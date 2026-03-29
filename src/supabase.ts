import { createClient, RealtimeChannel } from '@supabase/supabase-js';

// 使用环境变量，Vercel 会自动注入
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dxlocqoyqoehkvziunnp.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_kbArZ2HbKpEqU-KcDn3Tpw_gPLf63Gy';

console.log('Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);

// 表名
export const TABLES = {
  WORKS: 'works',
  ARTISTS: 'artists',
  STUDIO_INFO: 'studio_info',
  SETTINGS: 'settings',
  USERS: 'users',
} as const;

// 类型转换：将 Supabase 数据转为 App 需要的格式
export interface DbWork {
  id: string;
  title: string;
  description: string;
  category?: string;
  year?: string;
  media_url?: string;
  media_type?: string;
  created_at?: string;
  order_num?: number;
}

export interface DbArtist {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
  created_at?: string;
  order_num?: number;
}

export interface DbStudioInfo {
  id: string;
  title: string;
  description: string;
  description_en?: string;
  order_num?: number;
}

// 转换函数
export function convertWork(dbWork: DbWork) {
  return {
    id: dbWork.id,
    title: dbWork.title,
    description: dbWork.description,
    category: dbWork.category,
    year: dbWork.year,
    mediaUrl: dbWork.media_url,
    mediaType: dbWork.media_type,
    createdAt: dbWork.created_at,
    order: dbWork.order_num,
  };
}

export function convertArtist(dbArtist: DbArtist) {
  return {
    id: dbArtist.id,
    name: dbArtist.name,
    description: dbArtist.description,
    avatarUrl: dbArtist.avatar_url,
    createdAt: dbArtist.created_at,
    order: dbArtist.order_num,
  };
}

export function convertStudioInfo(dbInfo: DbStudioInfo) {
  return {
    id: dbInfo.id,
    title: dbInfo.title,
    description: dbInfo.description,
    descriptionEn: dbInfo.description_en,
    order: dbInfo.order_num,
  };
}

// 数据库操作函数
export async function getWorks() {
  const { data, error } = await supabase
    .from(TABLES.WORKS)
    .select('*')
    .order('order_num', { ascending: false });
  
  if (error) throw error;
  return data.map(convertWork);
}

export async function getArtists() {
  const { data, error } = await supabase
    .from(TABLES.ARTISTS)
    .select('*')
    .order('order_num', { ascending: false });
  
  if (error) throw error;
  return data.map(convertArtist);
}

export async function getStudioInfo() {
  const { data, error } = await supabase
    .from(TABLES.STUDIO_INFO)
    .select('*')
    .order('order_num', { ascending: false });
  
  if (error) throw error;
  return data.map(convertStudioInfo);
}

export async function getSettings() {
  const { data, error } = await supabase
    .from(TABLES.SETTINGS)
    .select('*')
    .eq('id', 'global')
    .single();
  
  if (error) return null;
  return data;
}

// 订阅实时更新
export function subscribeWorks(callback: (works: any[]) => void): RealtimeChannel {
  return supabase
    .channel('works-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.WORKS }, async () => {
      const works = await getWorks();
      callback(works);
    })
    .subscribe();
}

export function subscribeArtists(callback: (artists: any[]) => void): RealtimeChannel {
  return supabase
    .channel('artists-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.ARTISTS }, async () => {
      const artists = await getArtists();
      callback(artists);
    })
    .subscribe();
}

export function subscribeStudioInfo(callback: (info: any[]) => void): RealtimeChannel {
  return supabase
    .channel('studio-info-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.STUDIO_INFO }, async () => {
      const info = await getStudioInfo();
      callback(info);
    })
    .subscribe();
}

export function subscribeSettings(callback: (settings: any) => void): RealtimeChannel {
  return supabase
    .channel('settings-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.SETTINGS }, async () => {
      const settings = await getSettings();
      if (settings) callback(settings);
    })
    .subscribe();
}

// 保存数据
export async function saveWork(work: any) {
  const { error } = await supabase
    .from(TABLES.WORKS)
    .upsert({
      id: work.id,
      title: work.title,
      description: work.description,
      category: work.category,
      year: work.year,
      media_url: work.mediaUrl,
      media_type: work.mediaType,
      created_at: work.createdAt,
      order_num: work.order,
    });
  
  if (error) throw error;
}

export async function saveArtist(artist: any) {
  const { error } = await supabase
    .from(TABLES.ARTISTS)
    .upsert({
      id: artist.id,
      name: artist.name,
      description: artist.description,
      avatar_url: artist.avatarUrl,
      created_at: artist.createdAt,
      order_num: artist.order,
    });
  
  if (error) throw error;
}

export async function saveStudioInfo(info: any) {
  const { error } = await supabase
    .from(TABLES.STUDIO_INFO)
    .upsert({
      id: info.id,
      title: info.title,
      description: info.description,
      description_en: info.descriptionEn,
      order_num: info.order,
    });
  
  if (error) throw error;
}

export async function saveSettings(settings: { logoUrl?: string }) {
  const { error } = await supabase
    .from(TABLES.SETTINGS)
    .upsert({
      id: 'global',
      logo_url: settings.logoUrl,
    });
  
  if (error) throw error;
}

// 用户相关（简化的 Auth）- 如需用户系统后续添加
export async function checkUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from(TABLES.USERS)
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error) return null;
  return data?.role;
}
