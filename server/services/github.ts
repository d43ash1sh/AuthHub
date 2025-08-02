import { User } from "@shared/schema";

export interface GitHubRepository {
  id: string;
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  updatedAt: string;
  url: string;
  isPrivate: boolean;
  languages: {
    nodes: Array<{
      name: string;
      color: string;
    }>;
    totalSize: number;
    edges: Array<{
      size: number;
      node: {
        name: string;
        color: string;
      };
    }>;
  };
}

export interface GitHubUser {
  login: string;
  name: string;
  bio: string | null;
  avatarUrl: string;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  repositories: {
    totalCount: number;
  };
}

export interface ContributionStats {
  totalCommitContributions: number;
  totalIssueContributions: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  totalRepositoryContributions: number;
}

export class GitHubService {
  private baseUrl = 'https://api.github.com/graphql';

  private async makeGraphQLRequest(query: string, variables: any, accessToken: string) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
  }

  async getUserProfile(username: string, accessToken: string): Promise<GitHubUser> {
    const query = `
      query GetUser($username: String!) {
        user(login: $username) {
          login
          name
          bio
          avatarUrl
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories {
            totalCount
          }
        }
      }
    `;

    const data = await this.makeGraphQLRequest(query, { username }, accessToken);
    return data.user;
  }

  async getUserRepositories(username: string, accessToken: string, first: number = 100): Promise<GitHubRepository[]> {
    const query = `
      query GetRepositories($username: String!, $first: Int!) {
        user(login: $username) {
          repositories(
            first: $first
            orderBy: {field: STARGAZERS, direction: DESC}
            ownerAffiliations: OWNER
            privacy: PUBLIC
          ) {
            nodes {
              id
              name
              description
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
              updatedAt
              url
              isPrivate
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                totalSize
                nodes {
                  name
                  color
                }
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.makeGraphQLRequest(query, { username, first }, accessToken);
    return data.user.repositories.nodes;
  }

  async getContributionStats(username: string, accessToken: string): Promise<ContributionStats> {
    const currentYear = new Date().getFullYear();
    const query = `
      query GetContributions($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            totalRepositoryContributions
          }
        }
      }
    `;

    const variables = {
      username,
      from: `${currentYear}-01-01T00:00:00Z`,
      to: `${currentYear}-12-31T23:59:59Z`,
    };

    const data = await this.makeGraphQLRequest(query, variables, accessToken);
    return data.user.contributionsCollection;
  }

  async getLanguageStats(repositories: GitHubRepository[]): Promise<{ [key: string]: number }> {
    const languageStats: { [key: string]: number } = {};

    repositories.forEach(repo => {
      if (repo.languages?.edges) {
        repo.languages.edges.forEach(edge => {
          const language = edge.node.name;
          const size = edge.size;
          languageStats[language] = (languageStats[language] || 0) + size;
        });
      }
    });

    // Calculate percentages
    const totalSize = Object.values(languageStats).reduce((sum, size) => sum + size, 0);
    const percentages: { [key: string]: number } = {};

    Object.entries(languageStats).forEach(([language, size]) => {
      percentages[language] = Math.round((size / totalSize) * 100 * 10) / 10; // Round to 1 decimal
    });

    // Sort by percentage and return top 10
    return Object.fromEntries(
      Object.entries(percentages)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    );
  }

  // Get current authenticated user info using the access token
  async getCurrentUser(accessToken: string): Promise<GitHubUser> {
    const query = `
      query GetCurrentUser {
        viewer {
          login
          name
          bio
          avatarUrl
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories {
            totalCount
          }
        }
      }
    `;

    const data = await this.makeGraphQLRequest(query, {}, accessToken);
    return data.viewer;
  }
}

export const githubService = new GitHubService();
