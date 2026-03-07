import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function uploadToSupabase(
  buffer: Buffer,
  filename: string,
  mimetype: string
): Promise<string> {
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${filename}`;

  const { error } = await supabase.storage
    .from("paintbiz-uploads")
    .upload(uniqueName, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from("paintbiz-uploads")
    .getPublicUrl(uniqueName);

  return data.publicUrl;
}

export async function deleteFromSupabase(publicUrl: string): Promise<void> {
  try {
    // Extract the filename from the public URL
    const parts = publicUrl.split("/paintbiz-uploads/");
    if (parts.length < 2) return;
    const filename = parts[1];
    await supabase.storage.from("paintbiz-uploads").remove([filename]);
  } catch (err) {
    console.error("Failed to delete from Supabase Storage:", err);
    // Don't throw — deletion failure shouldn't break the app
  }
}
