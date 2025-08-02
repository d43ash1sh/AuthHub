import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, GitBranch, GitCommit, AlertCircle } from "lucide-react";
import { GitHubData } from "@/types/github";

interface StatsOverviewProps {
  githubData: GitHubData | null | undefined;
  isLoading: boolean;
}

export default function StatsOverview({ githubData, isLoading }: StatsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const repositories = githubData?.repositories || [];
  const contributionStats = githubData?.contributionStats;

  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazerCount, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forkCount, 0);

  const stats = [
    {
      title: "Total Stars",
      value: totalStars.toLocaleString(),
      icon: Star,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Forks",
      value: totalForks.toLocaleString(),
      icon: GitBranch,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Contributions",
      value: contributionStats?.totalCommitContributions?.toLocaleString() || "0",
      icon: GitCommit,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Issues Created",
      value: contributionStats?.totalIssueContributions?.toLocaleString() || "0",
      icon: AlertCircle,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
