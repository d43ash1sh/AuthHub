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
  isPinned?: boolean;
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

export interface GitHubData {
  profileData: GitHubUser;
  repositories: GitHubRepository[];
  languageStats: { [key: string]: number };
  contributionStats: ContributionStats;
  lastUpdated: string;
}
