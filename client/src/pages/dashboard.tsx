import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { LogOut, Github } from "lucide-react";
import ProfileHeader from "@/components/profile-header";
import StatsOverview from "@/components/stats-overview";
import PinnedRepositories from "@/components/pinned-repositories";
import RepositoryList from "@/components/repository-list";
import LanguageChart from "@/components/language-chart";
import ContributorInsights from "@/components/contributor-insights";
import QuickActions from "@/components/quick-actions";
import GithubUsernameForm from "@/components/github-username-form";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: githubData, isLoading: githubLoading, error: githubError } = useQuery({
    queryKey: ["/api/github/profile", user?.githubUsername],
    enabled: !!user?.githubUsername,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (githubError && isUnauthorizedError(githubError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [githubError, toast]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Github className="h-8 w-8 text-gray-900" />
              <h1 className="text-xl font-semibold text-gray-900">Portfolio Dashboard</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
              <a href="#repositories" className="text-gray-600 hover:text-gray-900 font-medium">Repositories</a>
              <a href="#analytics" className="text-gray-600 hover:text-gray-900 font-medium">Analytics</a>
            </nav>

            <div className="flex items-center space-x-4">
              <QuickActions />
              <div className="flex items-center space-x-3">
                {user.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt="User Avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user.githubUsername ? (
          <GithubUsernameForm />
        ) : (
          <>
            {/* Profile Section */}
            <ProfileHeader 
              user={user} 
              githubData={githubData} 
              isLoading={githubLoading} 
            />

            {/* Stats Overview */}
            <StatsOverview 
              githubData={githubData} 
              isLoading={githubLoading} 
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Repositories & Pinned */}
              <div className="lg:col-span-2 space-y-8">
                <PinnedRepositories />
                <div id="repositories">
                  <RepositoryList />
                </div>
              </div>

              {/* Right Column: Analytics */}
              <div className="space-y-8" id="analytics">
                <LanguageChart githubData={githubData} isLoading={githubLoading} />
                <ContributorInsights githubData={githubData} isLoading={githubLoading} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 text-blue-600">
            <Github className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <Github className="h-5 w-5" />
            <span className="text-xs mt-1">Repos</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-500">
            <Github className="h-5 w-5" />
            <span className="text-xs mt-1">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
