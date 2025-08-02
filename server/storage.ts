import {
  users,
  pinnedRepositories,
  githubUserData,
  type User,
  type UpsertUser,
  type InsertPinnedRepository,
  type PinnedRepository,
  type InsertGithubUserData,
  type GithubUserData,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Pinned repositories operations
  getPinnedRepositories(userId: string): Promise<PinnedRepository[]>;
  addPinnedRepository(pinnedRepo: InsertPinnedRepository): Promise<PinnedRepository>;
  removePinnedRepository(userId: string, repositoryId: string): Promise<void>;
  isPinnedRepository(userId: string, repositoryId: string): Promise<boolean>;
  
  // GitHub user data cache operations
  getGithubUserData(userId: string, githubUsername: string): Promise<GithubUserData | undefined>;
  upsertGithubUserData(data: InsertGithubUserData): Promise<GithubUserData>;
  
  // Update user GitHub info
  updateUserGithubInfo(userId: string, githubUsername: string, accessToken?: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Pinned repositories operations
  async getPinnedRepositories(userId: string): Promise<PinnedRepository[]> {
    return await db
      .select()
      .from(pinnedRepositories)
      .where(eq(pinnedRepositories.userId, userId))
      .orderBy(desc(pinnedRepositories.pinnedAt));
  }

  async addPinnedRepository(pinnedRepo: InsertPinnedRepository): Promise<PinnedRepository> {
    const [repo] = await db
      .insert(pinnedRepositories)
      .values(pinnedRepo)
      .returning();
    return repo;
  }

  async removePinnedRepository(userId: string, repositoryId: string): Promise<void> {
    await db
      .delete(pinnedRepositories)
      .where(
        and(
          eq(pinnedRepositories.userId, userId),
          eq(pinnedRepositories.repositoryId, repositoryId)
        )
      );
  }

  async isPinnedRepository(userId: string, repositoryId: string): Promise<boolean> {
    const [repo] = await db
      .select()
      .from(pinnedRepositories)
      .where(
        and(
          eq(pinnedRepositories.userId, userId),
          eq(pinnedRepositories.repositoryId, repositoryId)
        )
      );
    return !!repo;
  }

  // GitHub user data cache operations
  async getGithubUserData(userId: string, githubUsername: string): Promise<GithubUserData | undefined> {
    const [data] = await db
      .select()
      .from(githubUserData)
      .where(
        and(
          eq(githubUserData.userId, userId),
          eq(githubUserData.githubUsername, githubUsername)
        )
      );
    return data;
  }

  async upsertGithubUserData(data: InsertGithubUserData): Promise<GithubUserData> {
    const [result] = await db
      .insert(githubUserData)
      .values(data)
      .onConflictDoUpdate({
        target: [githubUserData.userId, githubUserData.githubUsername],
        set: {
          ...data,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return result;
  }

  // Update user GitHub info
  async updateUserGithubInfo(userId: string, githubUsername: string, accessToken?: string): Promise<User> {
    const updateData: Partial<User> = {
      githubUsername,
      updatedAt: new Date(),
    };
    
    if (accessToken) {
      updateData.githubAccessToken = accessToken;
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
