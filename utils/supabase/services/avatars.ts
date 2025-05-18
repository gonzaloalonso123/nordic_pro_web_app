import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type AvatarsService = ReturnType<typeof createAvatarsService>;

export function createAvatarsService(supabaseClient: SupabaseClient<Database>) {
  async function uploadAvatar(
    file: File,
    userId: string
  ): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabaseClient.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw new Error(`Failed to upload avatar: ${uploadError.message}`);
    }

    const { data: urlData } = supabaseClient.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      console.error('Error getting public URL for avatar:', filePath);
      throw new Error('Failed to get public URL for avatar.');
    }

    return urlData.publicUrl;
  }

  return {
    uploadAvatar,
  };
}
