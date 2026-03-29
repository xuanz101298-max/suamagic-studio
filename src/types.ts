export interface Work {
  id: string;
  title: string;
  description: string;
  category?: string;
  year?: string;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  coverImageUrl?: string;
  createdAt?: string;
  order?: number;
}

export interface Artist {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  createdAt?: string;
  order?: number;
}

export interface StudioInfo {
  id: string;
  title: string;
  description: string;
  descriptionEn: string;
  order: number;
}
