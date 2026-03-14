import { Fox } from "@/lib/genetics";
import { Variety, ShowLevel, ShowReport } from "../showing";

export type { Fox };

export type Role = "player" | "moderator" | "administrator";

export interface Show {
  id: string;
  name: string;
  level: ShowLevel;
  type: Variety;
  entries: string[];
  isRun: boolean;
  isWeekend?: boolean;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ForumReply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  categoryId: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  isPinned?: boolean;
  replies?: ForumReply[];
  isLocked?: boolean;
}

export interface Member {
  id: string;
  name: string;
  level: number;
  joined: string;
  points: number;
  avatarColor: string;
  isBanned: boolean;
  warnings: string[];
  role: Role;
  ipHistory: string[];
}

export interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string;
  type: "fox" | "item";
  targetId: string;
  price: number;
  currency: "gold" | "gems";
  createdAt: string;
  foxData?: Fox;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  rewardText: string;
  isUnlocked?: boolean;
  unlockedAt?: string;
}

export interface Pregnancy {
  sireId: string;
  damId: string;
  motherId: string;
  whelpDate: number;
  kitCount: number;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface WhelpingReport {
  id: string;
  damId: string;
  sireId: string;
  motherName: string;
  fatherName: string;
  kitIds: string[];
  kits: string[];
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'Update' | 'Engine' | 'Event';
  date: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetType: "member" | "post" | "reply";
  reason: string;
  content?: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
}

export interface GameState {
  gold: number;
  gems: number;
  isAdmin: boolean;
  isDarkMode: boolean;
  currentMemberId: string;
  broadcast: string | null;
  news: NewsItem[];
  foxes: Record<string, Fox>;
  nextFoxId: number;
  lastAdoptionReset: string;
  inventory: Record<string, number>;
  npcStuds: Record<string, Fox>;
  gameYear: number;
  gameSeason: "Spring" | "Summer" | "Autumn" | "Winter";
  year: number;
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  shows: Show[];
  showConfig: any;
  forumCategories: ForumCategory[];
  forumPosts: ForumPost[];
  marketListings: MarketListing[];
  members: Member[];
  adminLogs: AdminLog[];
  reports: Report[];
  colorblindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  highContrast: boolean;
  fontSize: "small" | "normal" | "large" | "xl";
  useOpenDyslexic: boolean;
  reducedMotion: boolean;
  alwaysUnderlineLinks: boolean;
  highVisibilityFocus: boolean;
  simplifiedUI: boolean;
  textSpacing: "normal" | "wide" | "extra";
  hasSeenTutorial: boolean;
  tutorialStep: number | null;
  hiredGroomer: boolean;
  hiredVeterinarian: boolean;
  hiredTrainer: boolean;
  hiredGeneticist: boolean;
  hiredNutritionist: boolean;
  hiredHandler: boolean;
  showReports: ShowReport[];
  whelpingReports: WhelpingReport[];
  pregnancyList: Pregnancy[];
  unlockedAchievements: string[];
  bisWins: number;
  bestDogWins: number;
  bestVixenWins: number;
  totalShowPoints: number;
  kennelCapacity: number;
  bannerUrl: string | null;
  bannerXPosition: number;
  bannerYPosition: number;
  joiningYear: number;
  showVisibilityMode: "all" | "mine";
  initializeGame: () => void;
  checkAchievements: () => void;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-fox", name: "First Friend", description: "Adopt your first foundation fox.", rewardText: "50 Gold" },
  { id: "breeder", name: "Novice Breeder", description: "Successfully whelp your first litter.", rewardText: "100 Gold" },
];
