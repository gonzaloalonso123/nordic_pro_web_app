import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { createAvatarsService, AvatarsService } from '@/utils/supabase/services';

export interface UploadAvatarVariables {
  file: File;
  userId: string;
}

export const useUploadAvatar = (
  options?: UseMutationOptions<string, Error, UploadAvatarVariables, unknown>
): UseMutationResult<string, Error, UploadAvatarVariables, unknown> => {
  const supabase = createClient();
  const avatarsService = createAvatarsService(supabase);
  const queryClient = useQueryClient();

  return useMutation<string, Error, UploadAvatarVariables, unknown>({
    mutationFn: async ({ file, userId }: UploadAvatarVariables) => {
      return avatarsService.uploadAvatar(file, userId);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export type { AvatarsService };
