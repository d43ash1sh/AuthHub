import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Github, ArrowRight } from "lucide-react";

export default function GithubUsernameForm() {
  const [username, setUsername] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setupMutation = useMutation({
    mutationFn: async (githubUsername: string) => {
      await apiRequest("POST", "/api/github/setup", { githubUsername });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "GitHub username set up successfully! Fetching your data...",
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
      
      const errorMessage = error.message;
      if (errorMessage.includes("404")) {
        toast({
          title: "User Not Found",
          description: "GitHub username not found. Please check the username and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to set up GitHub username. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a GitHub username",
        variant: "destructive",
      });
      return;
    }

    // Basic username validation
    const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]|-)*[a-zA-Z0-9]$/;
    if (!usernameRegex.test(username.trim())) {
      toast({
        title: "Invalid Username",
        description: "Please enter a valid GitHub username",
        variant: "destructive",
      });
      return;
    }

    setupMutation.mutate(username.trim());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Github className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Set Up Your GitHub Profile</CardTitle>
          <p className="text-gray-600">
            Enter your GitHub username to get started with your portfolio dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">GitHub Username</Label>
              <div className="relative">
                <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your GitHub username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  disabled={setupMutation.isPending}
                />
              </div>
              <p className="text-sm text-gray-500">
                This will be used to fetch your public repositories and profile information
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What we'll fetch:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your public repositories (sorted by stars)</li>
                <li>• Profile information (bio, followers, etc.)</li>
                <li>• Programming language statistics</li>
                <li>• Contribution insights for this year</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
              disabled={setupMutation.isPending || !username.trim()}
            >
              {setupMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting up...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
