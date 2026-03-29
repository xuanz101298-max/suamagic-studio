import OSS from 'ali-oss';

// 从环境变量读取配置
const region = import.meta.env.VITE_OSS_REGION || 'oss-cn-guangzhou';
const accessKeyId = import.meta.env.VITE_OSS_ACCESS_KEY_ID || '';
const accessKeySecret = import.meta.env.VITE_OSS_ACCESS_KEY_SECRET || '';
const bucket = import.meta.env.VITE_OSS_BUCKET || 'suamagic';

console.log('OSS Config:', { region, bucket, accessKeyId: accessKeyId ? 'set' : 'missing' });

const client = new OSS({
  region,
  accessKeyId,
  accessKeySecret,
  bucket,
});

export async function uploadFileToOSS(file: File, path: string): Promise<string> {
  try {
    console.log('Uploading to OSS:', path);
    const result = await client.put(path, file);
    console.log('Upload result:', result);
    return result.url;
  } catch (error) {
    console.error('OSS Upload Error:', error);
    throw new Error(`文件上传失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export { client as ossClient };
