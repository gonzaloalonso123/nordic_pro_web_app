'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useClientData } from '@/utils/data/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInitials } from '@/utils/get-initials';

export default function EditUserProfilePage() {
  const dataClient = useClientData();
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, isLoading: authLoading } = useCurrentUser();
  const router = useRouter();

  const updateUserMutation = dataClient.users.useUpdate();
  const uploadAvatarMutation = dataClient.avatars.useUpload();

  const { data: user, isPending: profileIsLoading, error: profileError, refetch: refetchProfile } = dataClient.users.useById(userId);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!authLoading && currentUser && currentUser.id !== userId) {
      console.warn('Attempting to edit another user\'s profile. Redirecting.');
      setFeedbackMessage({ type: 'error', message: 'You can only edit your own profile.' });
      return;
    } else if (!authLoading && !currentUser) {
      console.error('No authenticated user found. Cannot edit profile.');
      setFeedbackMessage({ type: 'error', message: 'Authentication required to edit profile.' });
      return;
    }
  }, [currentUser, authLoading, userId, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setAvatarPreview(user.avatar);
    } else if (profileError) {
      console.error('Error fetching user profile data for editing:', profileError);
      setFeedbackMessage({ type: 'error', message: `Failed to load profile data: ${profileError.message}` });
    } else if (!profileIsLoading && !user && currentUser && currentUser.id === userId) {
      setFirstName(currentUser.first_name || '');
      setLastName(currentUser.last_name || '');
      setAvatarPreview(currentUser.avatar ?? null);
    }
  }, [user, profileError, profileIsLoading, currentUser, userId]);


  if (!authLoading && currentUser?.id !== userId) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>You are not authorized to edit this profile.</p>
        <Link href={`/app/user/${userId}`} className="text-blue-500 hover:underline">
          Go back to profile
        </Link>
      </div>
    );
  }



  if (!user) {
    return;
  }

  const pageLoading = authLoading || profileIsLoading || updateUserMutation.isPending || uploadAvatarMutation.isPending;

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage(null);

    if (!currentUser || typeof currentUser.id !== 'string' || !currentUser.id.trim()) {
      setFeedbackMessage({ type: 'error', message: 'Cannot update profile. User authentication is invalid or ID is missing.' });
      console.error('handleProfileUpdate: currentUser or currentUser.id is invalid.', currentUser);
      return;
    }

    if (currentUser.id !== userId) {
      setFeedbackMessage({ type: 'error', message: 'Cannot update profile. Authorization issue or invalid target user ID.' });
      console.error('handleProfileUpdate: Authorization issue or userId is invalid.', 'userId:', userId, 'currentUser.id:', currentUser.id);
      return;
    }


    let avatarPublicUrl = user.avatar || currentUser.avatar;

    if (avatarFile) {
      try {
        const uploadedAvatarUrl = await uploadAvatarMutation.mutateAsync({ file: avatarFile, userId: currentUser.id });
        avatarPublicUrl = uploadedAvatarUrl;
      } catch (error: any) {
        console.error('Error uploading avatar:', error);
        setFeedbackMessage({ type: 'error', message: `Failed to upload avatar: ${error.message}` });
        return;
      }
    }

    const updatePayload = {
      userId: currentUser.id,
      updates: {
        first_name: firstName,
        last_name: lastName,
        avatar: avatarPublicUrl,
      }
    };

    updateUserMutation.mutate(updatePayload, {
      onSuccess: () => {
        setFeedbackMessage({ type: 'success', message: 'Profile updated successfully!' });
        setAvatarFile(null);
        refetchProfile();
      },
      onError: (error: any) => {
        console.error('Error updating profile:', error);
        let displayErrorMessage = `Failed to update profile: ${error.message}`;
        if (error.message?.includes("invalid input syntax for type uuid")) {
          displayErrorMessage = "Failed to update profile. An unexpected error occurred with the user identifier.";
        } else if (error.message?.includes("new row violates row-level security policy")) {
          displayErrorMessage = "Failed to update profile. You may not have the required permissions.";
        }
        setFeedbackMessage({ type: 'error', message: displayErrorMessage });
      },
    });
  };

  if (authLoading || profileIsLoading && !user && !profileError) {
    return <div className="container mx-auto p-4 text-center">Loading editor...</div>;
  }

  if (!currentUser || (currentUser && currentUser.id !== userId)) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>You are not authorized to edit this profile.</p>
        <Link href={`/app/user/${userId}`} className="text-blue-500 hover:underline">
          Go back to profile
        </Link>
      </div>
    );
  }

  if (profileError && !user) {
    return <div className="container mx-auto p-4 text-center">Error loading profile data for editing: {profileError.message}.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>

      {feedbackMessage && (
        <div className={`p-3 mb-4 rounded-md text-sm ${feedbackMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {feedbackMessage.message}
        </div>
      )}

      <form onSubmit={handleProfileUpdate} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={avatarPreview ?? undefined}
                alt="User Avatar Preview"
              />
              <AvatarFallback className="text-4xl">
                {getInitials({ firstName, lastName })}
              </AvatarFallback>
            </Avatar>

            <Label htmlFor="avatarUpload" className="absolute bottom-0 right-0">
              <Button
                size="sm"
                asChild
              >
                <span>Change</span>
              </Button>
              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </Label>
          </div>
        </div>

        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1"
            disabled={pageLoading}
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1"
            disabled={pageLoading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Link href={`/app/user/${userId}`} passHref>
            <Button
              type="button"
              variant="outline"
              disabled={pageLoading}
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={pageLoading || updateUserMutation.isPending || uploadAvatarMutation.isPending}
          >
            {updateUserMutation.isPending || uploadAvatarMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
