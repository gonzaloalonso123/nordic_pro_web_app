'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useClientData } from '@/utils/data/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const dataClient = useClientData();
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
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 items-center md:flex-row md:items-start mb-6">
        <Avatar>
          <AvatarImage
            src={user.avatar ?? undefined}
            alt="User Avatar"
          />
          <AvatarFallback>
            {user.first_name?.charAt(0).toUpperCase()}
            {user.last_name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center md:text-left flex-grow">
          <h2 className="text-2xl font-semibold">
            {user.first_name}
            {' '}
            {user.last_name}
          </h2>
          <p className="text-gray-600">
            {user?.email}
          </p>


          {isOwnProfile && (
            <Link href={`/app/user/${userId}/edit`} passHref>
              <Button>
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
