import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupGitHubAuth, isAuthenticated } from "./githubAuth";
import { githubService } from "./services/github";
import { pdfService } from "./services/pdf";
import { insertPinnedRepositorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupGitHubAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // GitHub profile data is automatically available after OAuth
  app.get('/api/github/profile', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (!user.githubUsername || !user.githubAccessToken) {
        return res.status(400).json({ message: "GitHub authentication required" });
      }

      // Check cache first
      const cachedData = await storage.getGithubUserData(user.id, user.githubUsername);
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
        githubService.getUserProfile(user.githubUsername, user.githubAccessToken),
        githubService.getUserRepositories(user.githubUsername, user.githubAccessToken),
        githubService.getContributionStats(user.githubUsername, user.githubAccessToken)
      ]);

      const languageStats = await githubService.getLanguageStats(repositories);

      // Cache the data
      const githubData = await storage.upsertGithubUserData({
        userId: user.id,
        githubUsername: user.githubUsername,
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
      const user = req.user;
      
      if (!user?.githubUsername || !user?.githubAccessToken) {
        return res.status(400).json({ message: "GitHub authentication required" });
      }

      const repositories = await githubService.getUserRepositories(user.githubUsername, user.githubAccessToken);
      const pinnedRepos = await storage.getPinnedRepositories(user.id);

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
      const user = req.user;
      const { repoId } = req.params;
      const { repositoryName, repositoryOwner, action } = req.body;

      if (action === 'pin') {
        // Check if already at max pins (5)
        const pinnedRepos = await storage.getPinnedRepositories(user.id);
        if (pinnedRepos.length >= 5) {
          return res.status(400).json({ message: "Maximum 5 repositories can be pinned" });
        }

        // Check if already pinned
        const isAlreadyPinned = await storage.isPinnedRepository(user.id, repoId);
        if (isAlreadyPinned) {
          return res.status(400).json({ message: "Repository is already pinned" });
        }

        const validatedData = insertPinnedRepositorySchema.parse({
          userId: user.id,
          repositoryName,
          repositoryOwner,
          repositoryId: repoId,
        });

        const pinnedRepo = await storage.addPinnedRepository(validatedData);
        res.json(pinnedRepo);
      } else if (action === 'unpin') {
        await storage.removePinnedRepository(user.id, repoId);
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
      const user = req.user;
      const pinnedRepos = await storage.getPinnedRepositories(user.id);
      res.json(pinnedRepos);
    } catch (error) {
      console.error("Error fetching pinned repositories:", error);
      res.status(500).json({ message: "Failed to fetch pinned repositories" });
    }
  });

  // Generate PDF resume
  app.get('/api/generate-pdf', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (!user?.githubUsername) {
        return res.status(400).json({ message: "GitHub authentication required" });
      }

      // Get cached GitHub data
      const githubData = await storage.getGithubUserData(user.id, user.githubUsername);
      if (!githubData) {
        return res.status(400).json({ message: "GitHub profile data not found. Please refresh your data first." });
      }

      const pinnedRepos = await storage.getPinnedRepositories(user.id);

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
      const user = req.user;
      
      if (!user?.githubUsername || !user?.githubAccessToken) {
        return res.status(400).json({ message: "GitHub authentication required" });
      }

      // Fetch fresh data from GitHub
      const [githubProfile, repositories, contributionStats] = await Promise.all([
        githubService.getUserProfile(user.githubUsername, user.githubAccessToken),
        githubService.getUserRepositories(user.githubUsername, user.githubAccessToken),
        githubService.getContributionStats(user.githubUsername, user.githubAccessToken)
      ]);

      const languageStats = await githubService.getLanguageStats(repositories);

      // Update cache
      const githubData = await storage.upsertGithubUserData({
        userId: user.id,
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
