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
  description?: string;
  address?: string;
  published: boolean;
}

export interface Member {
  id: string;
  name: string;
  instagram?: string;
  car?: string;
  tags: ('member' | 'verified' | 'og')[];
  joinedDate: string;
  inviteCode?: string;
  email?: string;
  phone?: string;
  eventsAttended: number;
  notes?: string;
  active: boolean;
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
  category: string;
  quantity: number;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok';
  postUrl: string;
  embedCode?: string;
  caption?: string;
  displayOrder: number;
  visible: boolean;
  dateAdded: string;
}

export interface SocialConfig {
  instagram: {
    connected: boolean;
    username: string;
    accessToken?: string;
  };
  tiktok: {
    connected: boolean;
    username: string;
    accessToken?: string;
  };
}

export interface SiteContent {
  heroTitle: string;
  heroTagline: string;
  memberCount: string;
  eventCount: string;
  buildCount: string;
  joinTagline: string;
  // New sections
  aboutText: string;
  rulesIntro: string;
  footerText: string;
  // Featured builds
  featuredBuilds: {
    id: string;
    name: string;
    owner: string;
    image: string;
  }[];
}

export interface CollageItem {
  id: string;
  type: 'image' | 'video';
  filename: string;
  ext: string;
  width: string;
  height: string;
  offset: string;
  displayOrder: number;
  visible: boolean;
}

export interface MarketListing {
  id: string;
  title: string;
  category: string;
  price: number;
  seller: string;
  sellerVerified: boolean;
  location: string;
  status: 'active' | 'pending' | 'sold' | 'flagged' | 'removed';
  datePosted: string;
  description: string;
  images: string[];
  contactInfo: string;
  flagReason?: string;
}

export type AdminExportPayload = {
  events: Event[];
  members: Member[];
  merch: MerchItem[];
  socials: SocialPost[];
  socialConfig: SocialConfig;
  siteContent: SiteContent;
  collage: CollageItem[];
  settings: AdminSettings;
  marketplace: MarketListing[];
  exportDate: string;
};

export interface AdminSettings {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  socialLinks: {
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  maintenanceMode: boolean;
  allowNewMembers: boolean;
  requireApproval: boolean;
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
    published: true,
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
    published: true,
  },
  {
    id: "3",
    date: "01.15.26",
    type: "WAREHOUSE",
    location: "PRIVATE LOT",
    time: "21:00",
    access: "VERIFIED",
    spots: { taken: 40, total: 40 },
    published: true,
  },
];

const defaultMembers: Member[] = [
  { id: "1", name: "John D.", instagram: "@johnd_cars", car: "2020 Supra", tags: ["verified"], joinedDate: "2024-01-15", eventsAttended: 12, active: true },
  { id: "2", name: "Mike R.", instagram: "@mike_rides", car: "2019 M4", tags: ["verified", "og"], joinedDate: "2023-06-01", eventsAttended: 35, active: true },
  { id: "3", name: "Sarah K.", instagram: "@sarah_speed", car: "2021 RS6", tags: ["member"], joinedDate: "2024-08-20", eventsAttended: 3, active: true },
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
    category: "Apparel",
    quantity: 50,
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
    category: "Apparel",
    quantity: 30,
  },
];

const defaultSiteContent: SiteContent = {
  heroTitle: "SPADES PERFORMANCE",
  heroTagline: "Colorado's Fastest.",
  memberCount: "130+",
  eventCount: "47",
  buildCount: "70+",
  joinTagline: "Know someone on the team? Get them to vouch for you.",
  aboutText: "Spades Performance is Colorado's premier car enthusiast collective.",
  rulesIntro: "To keep our community safe and thriving, we have a few rules.",
  footerText: "INVITE ONLY",
  featuredBuilds: [
    { id: "1", name: "800HP Supra", owner: "@turbo_mike", image: "1" },
    { id: "2", name: "Twin Turbo 370Z", owner: "@z_nation", image: "4" },
    { id: "3", name: "Built STI", owner: "@subie_sean", image: "7" },
  ],
};

const defaultCollage: CollageItem[] = [
  { id: "1", type: "image", filename: "/images/collage/1.jpg", ext: "jpg", width: "w-36 md:w-48", height: "h-[85%]", offset: "mt-[8%]", displayOrder: 1, visible: true },
  { id: "2", type: "image", filename: "/images/collage/2.jpg", ext: "jpg", width: "w-28 md:w-36", height: "h-[90%]", offset: "mt-[5%]", displayOrder: 2, visible: true },
  { id: "3", type: "image", filename: "/images/collage/3.jpg", ext: "jpg", width: "w-40 md:w-52", height: "h-[75%]", offset: "mt-[12%]", displayOrder: 3, visible: true },
  { id: "RollM1", type: "video", filename: "/images/collage/RollM1.mp4", ext: "mp4", width: "w-36 md:w-48", height: "h-[90%]", offset: "mt-[5%]", displayOrder: 4, visible: true },
  { id: "20", type: "image", filename: "/images/collage/20.JPEG", ext: "JPEG", width: "w-32 md:w-44", height: "h-[95%]", offset: "mt-[2%]", displayOrder: 5, visible: true },
  { id: "4", type: "image", filename: "/images/collage/4.jpg", ext: "jpg", width: "w-28 md:w-36", height: "h-[68%]", offset: "mt-[18%]", displayOrder: 6, visible: true },
  { id: "5", type: "image", filename: "/images/collage/5.jpg", ext: "jpg", width: "w-36 md:w-48", height: "h-[82%]", offset: "mt-[10%]", displayOrder: 7, visible: true },
  { id: "21", type: "image", filename: "/images/collage/21.JPEG", ext: "JPEG", width: "w-30 md:w-40", height: "h-[72%]", offset: "mt-[14%]", displayOrder: 8, visible: true },
  { id: "flame", type: "video", filename: "/images/collage/ATSV Flame shot.mov", ext: "mov", width: "w-40 md:w-52", height: "h-[88%]", offset: "mt-[6%]", displayOrder: 9, visible: true },
  { id: "6", type: "image", filename: "/images/collage/6.jpg", ext: "jpg", width: "w-32 md:w-44", height: "h-[88%]", offset: "mt-[6%]", displayOrder: 10, visible: true },
  { id: "19", type: "image", filename: "/images/collage/19.JPEG", ext: "JPEG", width: "w-72 md:w-[400px]", height: "h-[92%]", offset: "mt-[4%]", displayOrder: 11, visible: true },
  { id: "7", type: "image", filename: "/images/collage/7.jpg", ext: "jpg", width: "w-28 md:w-36", height: "h-[78%]", offset: "mt-[11%]", displayOrder: 12, visible: true },
  { id: "RollM2", type: "video", filename: "/images/collage/RollM2.mp4", ext: "mp4", width: "w-36 md:w-48", height: "h-[85%]", offset: "mt-[8%]", displayOrder: 13, visible: true },
  { id: "22", type: "image", filename: "/images/collage/22.JPEG", ext: "JPEG", width: "w-40 md:w-52", height: "h-[92%]", offset: "mt-[4%]", displayOrder: 14, visible: true },
  { id: "8", type: "image", filename: "/images/collage/8.jpg", ext: "jpg", width: "w-32 md:w-40", height: "h-[65%]", offset: "mt-[20%]", displayOrder: 15, visible: true },
  { id: "9", type: "image", filename: "/images/collage/9.jpg", ext: "jpg", width: "w-36 md:w-48", height: "h-[85%]", offset: "mt-[8%]", displayOrder: 16, visible: true },
  { id: "23", type: "image", filename: "/images/collage/23.JPG", ext: "JPG", width: "w-28 md:w-36", height: "h-[75%]", offset: "mt-[13%]", displayOrder: 17, visible: true },
  { id: "10", type: "image", filename: "/images/collage/10.jpg", ext: "jpg", width: "w-32 md:w-44", height: "h-[90%]", offset: "mt-[5%]", displayOrder: 18, visible: true },
  { id: "Mroll3", type: "video", filename: "/images/collage/Mroll3.mp4", ext: "mp4", width: "w-36 md:w-48", height: "h-[82%]", offset: "mt-[9%]", displayOrder: 19, visible: true },
  { id: "11", type: "image", filename: "/images/collage/11.jpg", ext: "jpg", width: "w-30 md:w-40", height: "h-[70%]", offset: "mt-[16%]", displayOrder: 20, visible: true },
  { id: "24", type: "image", filename: "/images/collage/24.JPG", ext: "JPG", width: "w-36 md:w-48", height: "h-[88%]", offset: "mt-[6%]", displayOrder: 21, visible: true },
  { id: "Mroll4", type: "video", filename: "/images/collage/Mroll4.mp4", ext: "mp4", width: "w-32 md:w-44", height: "h-[78%]", offset: "mt-[11%]", displayOrder: 22, visible: true },
  { id: "12", type: "image", filename: "/images/collage/12.jpg", ext: "jpg", width: "w-28 md:w-36", height: "h-[80%]", offset: "mt-[10%]", displayOrder: 23, visible: true },
  { id: "13", type: "image", filename: "/images/collage/13.jpg", ext: "jpg", width: "w-40 md:w-52", height: "h-[73%]", offset: "mt-[14%]", displayOrder: 24, visible: true },
  { id: "14", type: "image", filename: "/images/collage/14.jpg", ext: "jpg", width: "w-32 md:w-40", height: "h-[95%]", offset: "mt-[2%]", displayOrder: 25, visible: true },
  { id: "15", type: "image", filename: "/images/collage/15.jpg", ext: "jpg", width: "w-36 md:w-48", height: "h-[68%]", offset: "mt-[18%]", displayOrder: 26, visible: true },
  { id: "16", type: "image", filename: "/images/collage/16.jpg", ext: "jpg", width: "w-28 md:w-36", height: "h-[85%]", offset: "mt-[8%]", displayOrder: 27, visible: true },
  { id: "17", type: "image", filename: "/images/collage/17.jpg", ext: "jpg", width: "w-32 md:w-44", height: "h-[78%]", offset: "mt-[12%]", displayOrder: 28, visible: true },
  { id: "18", type: "image", filename: "/images/collage/18.jpg", ext: "jpg", width: "w-36 md:w-48", height: "h-[90%]", offset: "mt-[5%]", displayOrder: 29, visible: true },
];

const defaultSocialConfig: SocialConfig = {
  instagram: { connected: false, username: "" },
  tiktok: { connected: false, username: "" },
};

const defaultSettings: AdminSettings = {
  siteName: "Spades Performance",
  siteUrl: "https://spadesdenver.club",
  contactEmail: "contact@spadesdenver.club",
  socialLinks: {
    instagram: "https://instagram.com/spades_performance",
    tiktok: "",
    youtube: "",
  },
  maintenanceMode: false,
  allowNewMembers: true,
  requireApproval: true,
};

const defaultInvites: string[] = [];

const defaultMarketListings: MarketListing[] = [
  { 
    id: '1', 
    title: 'Volk TE37 18x9.5 +22', 
    category: 'Wheels', 
    price: 2800, 
    seller: 'mike_evo', 
    sellerVerified: true, 
    location: 'Denver', 
    status: 'active', 
    datePosted: '2024-12-15',
    description: 'Mint condition, no curb rash',
    images: [],
    contactInfo: '@mike_evo on IG'
  },
  { 
    id: '2', 
    title: 'Invidia Q300 Cat-back', 
    category: 'Exhaust', 
    price: 650, 
    seller: 'stisnow', 
    sellerVerified: true, 
    location: 'Aurora', 
    status: 'active', 
    datePosted: '2024-12-14',
    description: 'Used for 6 months, sounds amazing',
    images: [],
    contactInfo: 'DM on IG'
  },
  { 
    id: '3', 
    title: 'BC Racing BR Coilovers', 
    category: 'Suspension', 
    price: 800, 
    seller: 'boosted_civic', 
    sellerVerified: false, 
    location: 'Littleton', 
    status: 'pending', 
    datePosted: '2024-12-16',
    description: '10k miles, comes with all hardware',
    images: [],
    contactInfo: 'Text 303-555-1234'
  },
];

// Storage helpers
const STORAGE_KEYS = {
  events: 'spades_admin_events',
  members: 'spades_admin_members',
  merch: 'spades_admin_merch',
  socials: 'spades_admin_socials',
  socialConfig: 'spades_admin_social_config',
  siteContent: 'spades_admin_content',
  collage: 'spades_admin_collage',
  settings: 'spades_admin_settings',
  marketplace: 'spades_admin_marketplace',
  invites: 'spades_admin_invites',
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

  // Social Config
  getSocialConfig: (): SocialConfig => {
    if (typeof window === 'undefined') return defaultSocialConfig;
    const stored = localStorage.getItem(STORAGE_KEYS.socialConfig);
    return stored ? JSON.parse(stored) : defaultSocialConfig;
  },
  saveSocialConfig: (config: SocialConfig) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.socialConfig, JSON.stringify(config));
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
    if (typeof window === 'undefined') return defaultCollage;
    const stored = localStorage.getItem(STORAGE_KEYS.collage);
    if (!stored) return defaultCollage;
    const parsed = JSON.parse(stored);
    // Check if data is valid (has full paths)
    if (parsed.length > 0 && !parsed[0].filename?.includes('/')) {
      // Old format without full paths - return defaults
      return defaultCollage;
    }
    return parsed;
  },
  resetCollage: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.collage);
  },
  saveCollage: (items: CollageItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.collage, JSON.stringify(items));
  },

  // Settings
  getSettings: (): AdminSettings => {
    if (typeof window === 'undefined') return defaultSettings;
    const stored = localStorage.getItem(STORAGE_KEYS.settings);
    return stored ? JSON.parse(stored) : defaultSettings;
  },
  saveSettings: (settings: AdminSettings) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  },

  // Marketplace
  getMarketplace: (): MarketListing[] => {
    if (typeof window === 'undefined') return defaultMarketListings;
    const stored = localStorage.getItem(STORAGE_KEYS.marketplace);
    return stored ? JSON.parse(stored) : defaultMarketListings;
  },
  saveMarketplace: (listings: MarketListing[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.marketplace, JSON.stringify(listings));
  },

  // Invites
  getInvites: (): string[] => {
    if (typeof window === 'undefined') return defaultInvites;
    const stored = localStorage.getItem(STORAGE_KEYS.invites);
    return stored ? JSON.parse(stored) : defaultInvites;
  },
  saveInvites: (invites: string[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.invites, JSON.stringify(invites));
  },
  addInvite: (code: string) => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEYS.invites);
    const invites: string[] = stored ? (JSON.parse(stored) as string[]) : defaultInvites;
    if (!invites.includes(code)) {
      invites.push(code);
      localStorage.setItem(STORAGE_KEYS.invites, JSON.stringify(invites));
    }
  },
  removeInvite: (code: string) => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEYS.invites);
    const invites: string[] = stored ? (JSON.parse(stored) as string[]) : defaultInvites;
    const filtered = invites.filter(inv => inv !== code);
    localStorage.setItem(STORAGE_KEYS.invites, JSON.stringify(filtered));
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

  // Export all data (for backup)
  exportAllData(): AdminExportPayload {
    return {
      events: this.getEvents(),
      members: this.getMembers(),
      merch: this.getMerch(),
      socials: this.getSocials(),
      socialConfig: this.getSocialConfig(),
      siteContent: this.getSiteContent(),
      collage: this.getCollage(),
      settings: this.getSettings(),
      marketplace: this.getMarketplace(),
      exportDate: new Date().toISOString(),
    };
  },

  // Import all data (from backup)
  importAllData(data: AdminExportPayload) {
    if (data.events) this.saveEvents(data.events);
    if (data.members) this.saveMembers(data.members);
    if (data.merch) this.saveMerch(data.merch);
    if (data.socials) this.saveSocials(data.socials);
    if (data.socialConfig) this.saveSocialConfig(data.socialConfig);
    if (data.siteContent) this.saveSiteContent(data.siteContent);
    if (data.collage) this.saveCollage(data.collage);
    if (data.settings) this.saveSettings(data.settings);
    if (data.marketplace) this.saveMarketplace(data.marketplace);
  },

  // Clear all data (reset to defaults)
  resetAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
