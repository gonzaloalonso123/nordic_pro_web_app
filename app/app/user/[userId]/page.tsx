'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useClientData } from '@/utils/data/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Content } from '@/components/content';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { getInitials } from '@/utils/get-initials';
import { useHeader } from '@/hooks/useHeader';
import { NotificationSwitch } from './components/notification-switch';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const dataClient = useClientData();
  const { useHeaderConfig } = useHeader();

  useHeaderConfig({
    centerContent: (
      <h3 className="text-xl font-semibold">
        User Profile
      </h3>
    ),
  });

  const { user: currentUser, isLoading: authLoading } = useCurrentUser();

  const { data: user, isLoading: profileIsLoading, error: profileError } = dataClient.users.useById(userId);

  const pageLoading = authLoading || profileIsLoading;


  if (pageLoading && !user && !profileError) {
    return <div className="container mx-auto p-4 text-center">Loading profile...</div>;
  }

  const isOwnProfile = currentUser?.id === userId;

  if (!authLoading && !currentUser && !pageLoading) {
    return <div className="container mx-auto p-4 text-center">Could not authenticate user. Please try logging in.</div>;
  }

  if (profileError) {
    return <div className="container mx-auto p-4 text-center">Error loading profile: {profileError.message}. Please try again.</div>;
  }

  if (!user && !profileIsLoading && currentUser?.id !== userId) {
    return <div className="container mx-auto p-4 text-center">User profile not found.</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-4 text-center">User profile not found.</div>;
  }

  return (
    <Content>
      <Card className="mx-auto p-4 max-w-2xl">
        <CardHeader className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={user.avatar ?? undefined}
              alt="User Avatar"
            />
            <AvatarFallback>
              {getInitials({ firstName: user.first_name, lastName: user.last_name })}
            </AvatarFallback>
          </Avatar>

          <div className="text-center md:text-left grow">
            <h2 className="text-2xl font-semibold">
              {user.first_name}
              {' '}
              {user.last_name}
            </h2>
            <p className="text-gray-600">
              {user?.email}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Date of Birth</span>
              <span className="text-gray-700">{new Date(user.birth_date).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Gender</span>
              <span className="text-gray-700 capitalize">{user.gender}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Address</span>
              <span className="text-gray-700">{user.address}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Experience</span>
              <span className="text-gray-700 flex items-center">
                <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full mr-2">
                  {user.total_experience}
                </span>
                points
              </span>
            </div>
          </div>
          {/* <NotificationSwitch /> */}
        </CardContent>

        <CardFooter>
          {isOwnProfile && (
            <Link href={`/app/user/${userId}/edit`} passHref>
              <Button>
                Edit Profile
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </Content>
  );
}
