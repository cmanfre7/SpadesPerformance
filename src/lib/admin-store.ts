// Admin data store - In production, replace with database (Supabase, etc.)
// For now, using localStorage for persistence

export interface Event {
  id: string;
  date: string;
  type: string;
  location: string;
  time: string;
  access: 'PRIVATE' | 'INVITE ONLY' | 'VERIFIED' | 'PUBLIC';
  spots: { taken: number; total: number } | null;
  dropDate?: string;
  isPast?: boolean;
  attendance?: number;
}

export interface Member {
  id: string;
  name: string;
  instagram?: string;
  car?: string;
  tier: 'member' | 'verified' | 'og';
  joinedDate: string;
  inviteCode?: string;
}

export interface MerchItem {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  description: string;
  sizes: string[];
  colors: string[];
  featured?: boolean;
  limited?: boolean;
  images: string[];
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok';
  postId: string;
  caption?: string;
  displayOrder: number;
  visible: boolean;
}

export interface SiteContent {
  heroTitle: string;
  heroTagline: string;
  memberCount: string;
  eventCount: string;
  buildCount: string;
  joinTagline: string;
}

export interface CollageItem {
  id: string;
  type: 'image' | 'video';
  filename: string;
  width: string;
  height: string;
  offset: string;
  displayOrder: number;
  visible: boolean;
}

// Default data
const defaultEvents: Event[] = [
  {
    id: "1",
    date: "12.21.25",
    type: "NIGHT MEET",
    location: "DENVER",
    time: "22:00",
    access: "PRIVATE",
    spots: { taken: 38, total: 50 },
  },
  {
    id: "2",
    date: "01.01.26",
    type: "PRIVATE",
    location: "TBA",
    time: "23:00",
    access: "INVITE ONLY",
    spots: null,
    dropDate: "12.27.25",
  },
  {
    id: "3",
    date: "01.15.26",
    type: "WAREHOUSE",
    location: "PRIVATE LOT",
    time: "21:00",
    access: "VERIFIED",
    spots: { taken: 40, total: 40 },
  },
];

const defaultMembers: Member[] = [
  { id: "1", name: "John D.", instagram: "@johnd_cars", car: "2020 Supra", tier: "verified", joinedDate: "2024-01-15" },
  { id: "2", name: "Mike R.", instagram: "@mike_rides", car: "2019 M4", tier: "og", joinedDate: "2023-06-01" },
  { id: "3", name: "Sarah K.", instagram: "@sarah_speed", car: "2021 RS6", tier: "member", joinedDate: "2024-08-20" },
];

const defaultMerch: MerchItem[] = [
  { 
    id: "1", 
    name: "SPADES LOGO TEE", 
    price: 35, 
    inStock: true,
    description: "Premium heavyweight cotton. Gold embroidered spade.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White"],
    images: [],
  },
  { 
    id: "2", 
    name: "MIDNIGHT HOODIE", 
    price: 75, 
    inStock: true,
    description: "Oversized fit. Puff print logo. Built for the cold nights.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    featured: true,
    images: [],
  },
];

const defaultSiteContent: SiteContent = {
  heroTitle: "SPADES PERFORMANCE",
  heroTagline: "Colorado's Fastest.",
  memberCount: "130+",
  eventCount: "47",
  buildCount: "70+",
  joinTagline: "Know someone on the team? Get them to vouch for you.",
};

// Storage helpers
const STORAGE_KEYS = {
  events: 'spades_admin_events',
  members: 'spades_admin_members',
  merch: 'spades_admin_merch',
  socials: 'spades_admin_socials',
  siteContent: 'spades_admin_content',
  collage: 'spades_admin_collage',
};

export const adminStore = {
  // Events
  getEvents: (): Event[] => {
    if (typeof window === 'undefined') return defaultEvents;
    const stored = localStorage.getItem(STORAGE_KEYS.events);
    return stored ? JSON.parse(stored) : defaultEvents;
  },
  saveEvents: (events: Event[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
  },

  // Members
  getMembers: (): Member[] => {
    if (typeof window === 'undefined') return defaultMembers;
    const stored = localStorage.getItem(STORAGE_KEYS.members);
    return stored ? JSON.parse(stored) : defaultMembers;
  },
  saveMembers: (members: Member[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
  },

  // Merch
  getMerch: (): MerchItem[] => {
    if (typeof window === 'undefined') return defaultMerch;
    const stored = localStorage.getItem(STORAGE_KEYS.merch);
    return stored ? JSON.parse(stored) : defaultMerch;
  },
  saveMerch: (merch: MerchItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.merch, JSON.stringify(merch));
  },

  // Social Posts
  getSocials: (): SocialPost[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.socials);
    return stored ? JSON.parse(stored) : [];
  },
  saveSocials: (socials: SocialPost[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.socials, JSON.stringify(socials));
  },

  // Site Content
  getSiteContent: (): SiteContent => {
    if (typeof window === 'undefined') return defaultSiteContent;
    const stored = localStorage.getItem(STORAGE_KEYS.siteContent);
    return stored ? JSON.parse(stored) : defaultSiteContent;
  },
  saveSiteContent: (content: SiteContent) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.siteContent, JSON.stringify(content));
  },

  // Collage Items
  getCollage: (): CollageItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.collage);
    return stored ? JSON.parse(stored) : [];
  },
  saveCollage: (items: CollageItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.collage, JSON.stringify(items));
  },

  // Generate invite code
  generateInviteCode: (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SPADES-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  // Generate unique ID
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
};

