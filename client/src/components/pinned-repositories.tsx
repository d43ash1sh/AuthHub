import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Pin, Star, Calendar } from "lucide-react";
import { PinnedRepository } from "@shared/schema";

export default function PinnedRepositories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pinnedRepos, isLoading } = useQuery<PinnedRepository[]>({
    queryKey: ["/api/github/pinned"],
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const unpinMutation = useMutation({
    mutationFn: async (repoId: string) => {
      await apiRequest("POST", `/api/github/repositories/${repoId}/pin`, {
        action: "unpin",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/github/pinned"] });
      queryClient.invalidateQueries({ queryKey: ["/api/github/repositories"] });
      toast({
        title: "Success",
        description: "Repository unpinned successfully",
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
        description: "Failed to unpin repository",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pin className="mr-2 h-5 w-5 text-blue-600" />
            Pinned Repositories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
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

  const repos = pinnedRepos || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Pin className="mr-2 h-5 w-5 text-blue-600" />
            Pinned Repositories
          </CardTitle>
          <span className="text-sm text-gray-500">{repos.length}/5 pinned</span>
        </div>
      </CardHeader>
      <CardContent>
        {repos.length === 0 ? (
          <div className="text-center py-8">
            <Pin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No pinned repositories yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Pin your favorite repositories from the list below
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-blue-600 hover:underline cursor-pointer">
                    {repo.repositoryName}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => unpinMutation.mutate(repo.repositoryId)}
                    disabled={unpinMutation.isPending}
                    className="text-yellow-500 hover:text-yellow-600 p-1"
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Repository from {repo.repositoryOwner}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Pinned
                    </span>
                  </div>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {repo.pinnedAt ? new Date(repo.pinnedAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
