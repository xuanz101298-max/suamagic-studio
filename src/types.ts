export interface Work {
  id: string;
  title: string;
  description: string;
  category?: string;
  year?: string;
  mediaUrl?: string;
  media_url?: string;
  mediaType?: string;
  media_type?: string;
  createdAt?: string;
  created_at?: string;
  order?: number;
  order_num?: number;
}

export interface Artist {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  avatar_url?: string;
  createdAt?: string;
  created_at?: string;
  order?: number;
  order_num?: number;
}

export interface StudioInfo {
  id: string;
  title: string;
  description: string;
  descriptionEn?: string;
  description_en?: string;
  order: number;
  order_num?: number;
}
