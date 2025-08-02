import {
  type User,
  type UpsertUser,
  type InsertPinnedRepository,
  type PinnedRepository,
  type InsertGithubUserData,
  type GithubUserData,
} from "@shared/schema";
import { randomUUID } from "crypto";

// In-memory storage for development
class MemoryStorage {
  private users = new Map<string, User>();
  private pinnedRepositories = new Map<string, PinnedRepository[]>();
  private githubUserData = new Map<string, GithubUserData>();

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id || randomUUID(),
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      githubUsername: userData.githubUsername || null,
      githubAccessToken: userData.githubAccessToken || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(user.id, user);
    return user;
  }

  // Pinned repositories operations
  async getPinnedRepositories(userId: string): Promise<PinnedRepository[]> {
    return this.pinnedRepositories.get(userId) || [];
  }

  async addPinnedRepository(pinnedRepo: InsertPinnedRepository): Promise<PinnedRepository> {
    const repo: PinnedRepository = {
      id: randomUUID(),
      userId: pinnedRepo.userId,
      repositoryName: pinnedRepo.repositoryName,
      repositoryOwner: pinnedRepo.repositoryOwner,
      repositoryId: pinnedRepo.repositoryId,
      pinnedAt: new Date(),
    };

    const userRepos = this.pinnedRepositories.get(pinnedRepo.userId) || [];
    userRepos.push(repo);
    this.pinnedRepositories.set(pinnedRepo.userId, userRepos);
    
    return repo;
  }

  async removePinnedRepository(userId: string, repositoryId: string): Promise<void> {
    const userRepos = this.pinnedRepositories.get(userId) || [];
    const filteredRepos = userRepos.filter(repo => repo.repositoryId !== repositoryId);
    this.pinnedRepositories.set(userId, filteredRepos);
  }

  async isPinnedRepository(userId: string, repositoryId: string): Promise<boolean> {
    const userRepos = this.pinnedRepositories.get(userId) || [];
    return userRepos.some(repo => repo.repositoryId === repositoryId);
  }

  // GitHub user data cache operations
  async getGithubUserData(userId: string, githubUsername: string): Promise<GithubUserData | undefined> {
    const key = `${userId}-${githubUsername}`;
    return this.githubUserData.get(key);
  }

  async upsertGithubUserData(data: InsertGithubUserData): Promise<GithubUserData> {
    const key = `${data.userId}-${data.githubUsername}`;
    const githubData: GithubUserData = {
      id: randomUUID(),
      userId: data.userId,
      githubUsername: data.githubUsername,
      profileData: data.profileData,
      repositories: data.repositories,
      languageStats: data.languageStats,
      contributionStats: data.contributionStats,
      lastUpdated: new Date(),
    };

    this.githubUserData.set(key, githubData);
    return githubData;
  }

  // Update user GitHub info
  async updateUserGithubInfo(userId: string, githubUsername: string, accessToken?: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...user,
      githubUsername,
      githubAccessToken: accessToken || user.githubAccessToken,
      updatedAt: new Date(),
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const memoryStorage = new MemoryStorage(); 