import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { GitHubData } from "@/types/github";

interface ContributorInsightsProps {
  githubData: GitHubData | null | undefined;
  isLoading: boolean;
}

export default function ContributorInsights({ githubData, isLoading }: ContributorInsightsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
            Contributor Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const contributionStats = githubData?.contributionStats;

  if (!contributionStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
            Contributor Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No contribution data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(
    contributionStats.totalCommitContributions,
    contributionStats.totalPullRequestContributions,
    contributionStats.totalIssueContributions,
    contributionStats.totalPullRequestReviewContributions
  );

  const insights = [
    {
      label: "Total Commits",
      value: contributionStats.totalCommitContributions,
      percentage: maxValue > 0 ? (contributionStats.totalCommitContributions / maxValue) * 100 : 0,
      color: "bg-green-500",
    },
    {
      label: "Pull Requests",
      value: contributionStats.totalPullRequestContributions,
      percentage: maxValue > 0 ? (contributionStats.totalPullRequestContributions / maxValue) * 100 : 0,
      color: "bg-blue-500",
    },
    {
      label: "Issues Created",
      value: contributionStats.totalIssueContributions,
      percentage: maxValue > 0 ? (contributionStats.totalIssueContributions / maxValue) * 100 : 0,
      color: "bg-orange-500",
    },
    {
      label: "Code Reviews",
      value: contributionStats.totalPullRequestReviewContributions,
      percentage: maxValue > 0 ? (contributionStats.totalPullRequestReviewContributions / maxValue) * 100 : 0,
      color: "bg-purple-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
          Contributor Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {insights.map((insight) => (
            <div key={insight.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{insight.label}</span>
                <span className="font-semibold text-gray-900">
                  {insight.value.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={insight.percentage} 
                className="h-2"
              />
            </div>
          ))}

          {/* Activity Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">This Year's Activity</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Contributions:</span>
                <p className="font-medium text-gray-900">
                  {(
                    contributionStats.totalCommitContributions +
                    contributionStats.totalPullRequestContributions +
                    contributionStats.totalIssueContributions +
                    contributionStats.totalPullRequestReviewContributions
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Repositories:</span>
                <p className="font-medium text-gray-900">
                  {contributionStats.totalRepositoryContributions.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
