import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Search, Star, GitBranch, Pin, ExternalLink } from "lucide-react";
import { GitHubRepository } from "@/types/github";

export default function RepositoryList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("stars");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: repositories, isLoading } = useQuery<GitHubRepository[]>({
    queryKey: ["/api/github/repositories"],
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const pinMutation = useMutation({
    mutationFn: async ({ repoId, repositoryName, repositoryOwner, action }: {
      repoId: string;
      repositoryName: string;
      repositoryOwner: string;
      action: "pin" | "unpin";
    }) => {
      await apiRequest("POST", `/api/github/repositories/${repoId}/pin`, {
        repositoryName,
        repositoryOwner,
        action,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/github/repositories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/github/pinned"] });
      toast({
        title: "Success",
        description: `Repository ${variables.action === "pin" ? "pinned" : "unpinned"} successfully`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update repository pin status",
        variant: "destructive",
      });
    },
  });

  const filteredAndSortedRepos = (repositories || [])
    .filter((repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stargazerCount - a.stargazerCount;
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "created":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

  const handleTogglePin = (repo: GitHubRepository) => {
    const action = repo.isPinned ? "unpin" : "pin";
    pinMutation.mutate({
      repoId: repo.id,
      repositoryName: repo.name,
      repositoryOwner: repo.url.split('/')[3], // Extract owner from GitHub URL
      action,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-40" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-5">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Repositories</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stars">Sort by stars</SelectItem>
              <SelectItem value="name">Sort by name</SelectItem>
              <SelectItem value="updated">Sort by updated</SelectItem>
              <SelectItem value="created">Sort by created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAndSortedRepos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No repositories found</p>
            </div>
          ) : (
            filteredAndSortedRepos.map((repo) => (
              <div
                key={repo.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-all hover:border-gray-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-600 hover:underline flex items-center"
                      >
                        {repo.name}
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {repo.isPrivate ? "Private" : "Public"}
                      </span>
                      {repo.isPinned && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Pinned
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-gray-600 mb-4">{repo.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {repo.primaryLanguage && (
                        <span className="flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: repo.primaryLanguage.color || "#6b7280" }}
                          ></span>
                          {repo.primaryLanguage.name}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {repo.stargazerCount}
                      </span>
                      <span className="flex items-center">
                        <GitBranch className="w-4 h-4 mr-1" />
                        {repo.forkCount}
                      </span>
                      <span>
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePin(repo)}
                    disabled={pinMutation.isPending}
                    className={`ml-4 p-2 transition-colors ${
                      repo.isPinned
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-gray-400 hover:text-yellow-500"
                    }`}
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
