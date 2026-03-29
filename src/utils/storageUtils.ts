import { uploadFileToOSS } from './aliOss';

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
  throw new Error(JSON.stringify(errInfo));
}

export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    return await uploadFileToOSS(file, path);
  } catch (error: any) {
    console.error("Error uploading file:", error);
    if (error?.message?.includes('Bucket not found')) {
      throw new Error("阿里云 OSS Bucket 未配置。请在阿里云控制台创建 Bucket 并更新配置。");
    }
    throw error;
  }
}
