import { Work, Artist, StudioInfo } from './types';

export const initialWorks: Work[] = [
  {
    id: '1',
    title: 'BLUE ROOM',
    description: 'Naomi Takeda / Japan - 探索视听新的可能',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    mediaType: 'image',
    createdAt: new Date().toISOString(),
    order: 3
  },
  {
    id: '2',
    title: 'VOID WALKER',
    description: 'AI Fashion Short / Brand Custom',
    mediaUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
    mediaType: 'image',
    createdAt: new Date().toISOString(),
    order: 2
  },
  {
    id: '3',
    title: 'SYNTHETIC DREAMS',
    description: 'AI Generated Feature / Exploring Boundaries',
    mediaUrl: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop',
    mediaType: 'image',
    createdAt: new Date().toISOString(),
    order: 1
  }
];

export const initialArtists: Artist[] = [
  {
    id: '1',
    name: '0xKael',
    description: 'Visual Alchemist. Specializes in latent space exploration and dark surrealism.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    order: 5
  },
  {
    id: '2',
    name: 'Nova.AI',
    description: 'Generative Audio-Visual Composer. Creating the soundscapes of the future ideal state.',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    order: 4
  },
  {
    id: '3',
    name: 'R3KT',
    description: 'Interactive Installation DAO Contributor. Bridging physical and digital realms.',
    avatarUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    order: 3
  },
  {
    id: '4',
    name: 'Cipher',
    description: 'Multi-modal translator. Turning raw creative concepts into monetizable digital assets.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    order: 2
  },
  {
    id: '5',
    name: 'Lumina',
    description: 'AI Fashion Designer. Redefining wearable art through neural networks.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    order: 1
  }
];

export const initialAbout: StudioInfo[] = [
  {
    id: '1',
    title: 'Creative Direction',
    description: '原创实验片，AI电影，品牌定制时尚短片。探索视听新的可能，打破传统叙事边界。',
    descriptionEn: 'Original experimental films, AI cinema, and brand-tailored fashion shorts. Exploring new audiovisual possibilities, breaking traditional narrative boundaries.',
    order: 2
  },
  {
    id: '2',
    title: 'DAO Ecosystem',
    description: '签约全球多模态AI艺术家（影像、音乐、图片、交互装置）。以DAO为组织形式，制造"未来艺术的理想国"和"创意变现的翻译官"。',
    descriptionEn: 'Signing global multimodal AI artists (video, music, images, interactive installations). Organized as a DAO, creating a \'Utopia for Future Art\' and acting as a \'Translator for Creative Monetization\'.',
    order: 1
  }
];
