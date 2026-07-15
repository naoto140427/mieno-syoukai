'use server'

import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `news/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from('mieno-images')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('mieno-images')
    .getPublicUrl(filePath);

  return publicUrl;
}
