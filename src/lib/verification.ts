import { supabase } from '@/lib/supabase';

export const VERIFICATION_BUCKET = 'verification-docs';
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

export interface UploadedDoc {
  path: string;
  name: string;
  size: number;
}

/**
 * Upload a verification document to the PRIVATE bucket, inside the caller's
 * own '<userId>/' folder (enforced by storage RLS). Records metadata in the
 * verification_documents table for the review workflow.
 */
export async function uploadVerificationDoc(
  file: File,
  userId: string,
  onboardingSessionId: string
): Promise<UploadedDoc> {
  if (file.size > MAX_BYTES) {
    throw new Error('File is larger than 10 MB. Please choose a smaller file.');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only PDF, PNG, or JPG files are accepted.');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${onboardingSessionId}/${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(VERIFICATION_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const { error: metaError } = await supabase.from('verification_documents').insert({
    user_id: userId,
    file_path: path,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
  });
  if (metaError) {
    // Roll back the file so we never leave untracked objects behind.
    await supabase.storage.from(VERIFICATION_BUCKET).remove([path]);
    throw new Error(metaError.message);
  }

  return { path, name: file.name, size: file.size };
}

/**
 * Create a short-lived signed URL for a document in the private bucket.
 * Only the owning user (or service role) can obtain one — enforced by RLS.
 */
export async function getVerificationDocUrl(path: string, expiresInSeconds = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from(VERIFICATION_BUCKET)
    .createSignedUrl(path, expiresInSeconds);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}
