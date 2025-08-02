import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { githubService } from "./services/github";
import { pdfService } from "./services/pdf";
import { insertPinnedRepositorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // GitHub username setup
  app.post('/api/github/setup', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { githubUsername } = req.body;

      if (!githubUsername) {
        return res.status(400).json({ message: "GitHub username is required" });
      }

      // Use the GitHub access token from the authenticated user session
      const accessToken = req.user.access_token;
      if (!accessToken) {
        return res.status(400).json({ message: "GitHub access token not found. Please re-authenticate." });
      }

      // Verify the GitHub username exists and fetch basic profile
      try {
        const githubProfile = await githubService.getUserProfile(githubUsername, accessToken);
        
        // Update user with GitHub username
        const updatedUser = await storage.updateUserGithubInfo(userId, githubUsername, accessToken);
        
        res.json({ 
          user: updatedUser,
          githubProfile 
        });
      } catch (error: any) {
        if (error.message.includes('API error: 404')) {
          return res.status(404).json({ message: "GitHub user not found" });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error setting up GitHub username:", error);
      res.status(500).json({ message: "Failed to setup GitHub username" });
    }
  });

  // Get GitHub profile data
  app.get('/api/github/profile/:username', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { username } = req.params;
      const accessToken = req.user.access_token;

      if (!accessToken) {
        return res.status(400).json({ message: "GitHub access token not found" });
      }

      // Check cache first
      const cachedData = await storage.getGithubUserData(userId, username);
      const now = new Date();
      const cacheExpiry = 30 * 60 * 1000; // 30 minutes

      if (cachedData && cachedData.lastUpdated) {
        const isExpired = now.getTime() - cachedData.lastUpdated.getTime() > cacheExpiry;
        if (!isExpired) {
          return res.json(cachedData);
        }
      }

      // Fetch fresh data from GitHub
      const [githubProfile, repositories, contributionStats] = await Promise.all([
        githubService.getUserProfile(username, accessToken),
        githubService.getUserRepositories(username, accessToken),
        githubService.getContributionStats(username, accessToken)
      ]);

      const languageStats = await githubService.getLanguageStats(repositories);

      // Cache the data
      const githubData = await storage.upsertGithubUserData({
        userId,
        githubUsername: username,
        profileData: githubProfile as any,
        repositories: repositories as any,
        languageStats: languageStats as any,
        contributionStats: contributionStats as any,
      });

      res.json(githubData);
    } catch (error) {
      console.error("Error fetching GitHub profile:", error);
      res.status(500).json({ message: "Failed to fetch GitHub profile data" });
    }
  });

  // Get repositories for the authenticated user's GitHub username
  app.get('/api/github/repositories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.githubUsername) {
        return res.status(400).json({ message: "GitHub username not set up" });
      }

      const accessToken = req.user.access_token;
      if (!accessToken) {
        return res.status(400).json({ message: "GitHub access token not found" });
      }

      const repositories = await githubService.getUserRepositories(user.githubUsername, accessToken);
      const pinnedRepos = await storage.getPinnedRepositories(userId);

      // Add pinned status to repositories
      const repositoriesWithPinned = repositories.map(repo => ({
        ...repo,
        isPinned: pinnedRepos.some(pinned => pinned.repositoryId === repo.id)
      }));

      res.json(repositoriesWithPinned);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      res.status(500).json({ message: "Failed to fetch repositories" });
    }
  });

  // Pin/unpin repository
  app.post('/api/github/repositories/:repoId/pin', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { repoId } = req.params;
      const { repositoryName, repositoryOwner, action } = req.body;

      if (action === 'pin') {
        // Check if already at max pins (5)
        const pinnedRepos = await storage.getPinnedRepositories(userId);
        if (pinnedRepos.length >= 5) {
          return res.status(400).json({ message: "Maximum 5 repositories can be pinned" });
        }

        // Check if already pinned
        const isAlreadyPinned = await storage.isPinnedRepository(userId, repoId);
        if (isAlreadyPinned) {
          return res.status(400).json({ message: "Repository is already pinned" });
        }

        const validatedData = insertPinnedRepositorySchema.parse({
          userId,
          repositoryName,
          repositoryOwner,
          repositoryId: repoId,
        });

        const pinnedRepo = await storage.addPinnedRepository(validatedData);
        res.json(pinnedRepo);
      } else if (action === 'unpin') {
        await storage.removePinnedRepository(userId, repoId);
        res.json({ message: "Repository unpinned successfully" });
      } else {
        res.status(400).json({ message: "Invalid action. Use 'pin' or 'unpin'" });
      }
    } catch (error) {
      console.error("Error pinning/unpinning repository:", error);
      res.status(500).json({ message: "Failed to update repository pin status" });
    }
  });

  // Get pinned repositories
  app.get('/api/github/pinned', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pinnedRepos = await storage.getPinnedRepositories(userId);
      res.json(pinnedRepos);
    } catch (error) {
      console.error("Error fetching pinned repositories:", error);
      res.status(500).json({ message: "Failed to fetch pinned repositories" });
    }
  });

  // Generate PDF resume
  app.get('/api/generate-pdf', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.githubUsername) {
        return res.status(400).json({ message: "GitHub username not set up" });
      }

      const accessToken = req.user.access_token;
      if (!accessToken) {
        return res.status(400).json({ message: "GitHub access token not found" });
      }

      // Get cached GitHub data
      const githubData = await storage.getGithubUserData(userId, user.githubUsername);
      if (!githubData) {
        return res.status(400).json({ message: "GitHub profile data not found. Please refresh your data first." });
      }

      const pinnedRepos = await storage.getPinnedRepositories(userId);

      const resumeData = {
        user,
        githubProfile: githubData.profileData as any,
        pinnedRepositories: pinnedRepos,
        topRepositories: (githubData.repositories as any)?.slice(0, 10) || [],
        contributionStats: githubData.contributionStats as any,
        languageStats: githubData.languageStats as any,
      };

      const pdfBuffer = await pdfService.generateResumePDF(resumeData);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="github-resume-${user.githubUsername}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF resume" });
    }
  });

  // Refresh GitHub data
  app.post('/api/github/refresh', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.githubUsername) {
        return res.status(400).json({ message: "GitHub username not set up" });
      }

      const accessToken = req.user.access_token;
      if (!accessToken) {
        return res.status(400).json({ message: "GitHub access token not found" });
      }

      // Fetch fresh data from GitHub
      const [githubProfile, repositories, contributionStats] = await Promise.all([
        githubService.getUserProfile(user.githubUsername, accessToken),
        githubService.getUserRepositories(user.githubUsername, accessToken),
        githubService.getContributionStats(user.githubUsername, accessToken)
      ]);

      const languageStats = await githubService.getLanguageStats(repositories);

      // Update cache
      const githubData = await storage.upsertGithubUserData({
        userId,
        githubUsername: user.githubUsername,
        profileData: githubProfile as any,
        repositories: repositories as any,
        languageStats: languageStats as any,
        contributionStats: contributionStats as any,
      });

      res.json(githubData);
    } catch (error) {
      console.error("Error refreshing GitHub data:", error);
      res.status(500).json({ message: "Failed to refresh GitHub data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
