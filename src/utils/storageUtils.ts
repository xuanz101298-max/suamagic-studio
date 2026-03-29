import { supabase } from '../supabase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface StorageErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleStorageError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: StorageErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Storage Error: ', JSON.stringify(errInfo));
  throw error;
}

export async function uploadFileToStorage(file: File, path: string): Promise<string> {
  try {
    // 使用 Supabase Storage 上传到 'works' bucket
    const bucketName = 'works';
    
    // 上传文件到 Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // 获取公开访问 URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    console.log('Upload successful:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    if (error?.message?.includes('Storage is not initialized')) {
      throw new Error('Supabase Storage is not initialized. Please check your Supabase project and bucket configuration.');
    }
    throw error;
  }
}
