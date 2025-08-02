import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, GitBranch } from "lucide-react";
import { User } from "@shared/schema";
import { GitHubData } from "@/types/github";

interface ProfileHeaderProps {
  user: User;
  githubData: GitHubData | null | undefined;
  isLoading: boolean;
}

export default function ProfileHeader({ user, githubData, isLoading }: ProfileHeaderProps) {
  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <Skeleton className="w-32 h-32 rounded-full" />
            <div className="flex-1 text-center md:text-left space-y-4">
              <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-32 mx-auto md:mx-0" />
              <Skeleton className="h-16 w-full max-w-2xl mx-auto md:mx-0" />
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const profile = githubData?.profileData;

  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <img 
            src={profile?.avatarUrl || user.profileImageUrl || '/api/placeholder/200/200'} 
            alt="Developer Profile" 
            className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500/20"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {profile?.name || `${user.firstName} ${user.lastName}`.trim() || 'Developer'}
            </h2>
            <p className="text-lg text-blue-600 mb-4">
              @{profile?.login || user.githubUsername || 'username'}
            </p>
            {profile?.bio && (
              <p className="text-gray-600 mb-6 max-w-2xl">
                {profile.bio}
              </p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">
                  <strong>{profile?.followers?.totalCount || 0}</strong> followers
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">
                  <strong>{profile?.following?.totalCount || 0}</strong> following
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">
                  <strong>{profile?.repositories?.totalCount || 0}</strong> repositories
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
