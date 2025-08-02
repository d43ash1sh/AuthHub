import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Download, Github, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const generatePDFMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/generate-pdf", {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }

      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `github-resume-${user?.githubUsername || "portfolio"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Resume PDF generated and downloaded successfully",
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
        description: "Failed to generate PDF resume",
        variant: "destructive",
      });
    },
  });

  const refreshDataMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/github/refresh");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/github"] });
      toast({
        title: "Success",
        description: "GitHub data refreshed successfully",
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
        description: "Failed to refresh GitHub data",
        variant: "destructive",
      });
    },
  });

  const handleGeneratePDF = () => {
    if (!user?.githubUsername) {
      toast({
        title: "Setup Required",
        description: "Please set up your GitHub username first",
        variant: "destructive",
      });
      return;
    }
    generatePDFMutation.mutate();
  };

  const handleViewGitHub = () => {
    if (!user?.githubUsername) {
      toast({
        title: "Setup Required",
        description: "Please set up your GitHub username first",
        variant: "destructive",
      });
      return;
    }
    window.open(`https://github.com/${user.githubUsername}`, "_blank");
  };

  const handleRefreshData = () => {
    if (!user?.githubUsername) {
      toast({
        title: "Setup Required",
        description: "Please set up your GitHub username first",
        variant: "destructive",
      });
      return;
    }
    refreshDataMutation.mutate();
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-2">
        <Button
          onClick={handleGeneratePDF}
          disabled={generatePDFMutation.isPending || !user?.githubUsername}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          {generatePDFMutation.isPending ? "Generating..." : "Generate PDF"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleViewGitHub}
          disabled={!user?.githubUsername}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefreshData}
          disabled={refreshDataMutation.isPending || !user?.githubUsername}
        >
          <RefreshCw className={`h-4 w-4 ${refreshDataMutation.isPending ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Mobile PDF Button */}
      <div className="md:hidden">
        <Button
          onClick={handleGeneratePDF}
          disabled={generatePDFMutation.isPending || !user?.githubUsername}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
