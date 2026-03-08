"use client";



import { create } from "zustand";

import { persist } from "zustand/middleware";

import {

  createFox,

  createFoundationalFox,

  createFoundationFoxCollection,

  calculateSilverIntensity,

  calculateCOI,

  generateStats,

  getInitialGenotype,

  getPhenotype,

  LOCI,

  Genotype,

  Stats,

  Fox,

  breed,

} from "@/lib/genetics";

import {
  Variety,
  ShowLevel,
  ShowReport,
  ShowResult,
  ScoreBreakdown,
  Competitor,
  runHierarchicalShow,
  isFoxEligibleForShow,
} from "./showing";



const generateNPCStuds = (

  year: number,

  season: string,

): Record<string, Fox> => {

  const seasons = ["Spring", "Summer", "Autumn", "Winter"];

  const seasonIndex = seasons.indexOf(season);

  const totalSeasonNumber = (year - 1) * 4 + seasonIndex + 1;

  const npcSeedStr = `npc-studs-${year}-${season}`;

  let npcSeedVal = npcSeedStr

    .split("")

    .reduce((a, b) => a + b.charCodeAt(0), 0);

  const npcSeededRandom = () => {

    const x = Math.sin(npcSeedVal++) * 10000;

    return x - Math.floor(x);

  };



  const nextNpcStuds: Record<string, Fox> = {};

  const usedPhenotypes = new Set<string>();



  while (Object.keys(nextNpcStuds).length < 4) {

    let stud = createFoundationalFox(npcSeededRandom, "Dog");

    // NPC Studs can express Opal phenotypes (20% chance)
    if (npcSeededRandom() < 0.20) {
      const opalGenotypes: (Genotype)[] = [
        { R: ['r', 'r'] },
        { R: ['ra', 'ra'] },
        { R: ['r', 'ra'] }
      ];
      const selectedOpal = opalGenotypes[Math.floor(npcSeededRandom() * opalGenotypes.length)];
      stud = createFox({
         genotype: { ...stud.genotype, ...selectedOpal },
         gender: 'Dog',
         isNPC: true
      }, npcSeededRandom);
    }

    // NPC Studs can express Fawn Spotting or Star Spotting (20% chance)
    if (npcSeededRandom() < 0.20) {
      const extraGenotypes: (Genotype)[] = [
        { T: ['t', 't'] },
        { T: ['T', 't'] },
        { S: ['S', 'S'] },
        { S: ['s', 'S'] },
        { T: ['t', 't'], S: ['S', 'S'] }
      ];
      const selectedExtra = extraGenotypes[Math.floor(npcSeededRandom() * extraGenotypes.length)];
      stud = createFox({
         genotype: { ...stud.genotype, ...selectedExtra },
         gender: 'Dog',
         isNPC: true
      }, npcSeededRandom);
    }

    if (usedPhenotypes.has(stud.phenotype)) continue;



    usedPhenotypes.add(stud.phenotype);

    stud.isNPC = true;

    stud.genotypeRevealed = true;

    stud.name = `${stud.phenotype} Stud Season ${totalSeasonNumber}`;

    stud.studFee = 500 + Math.floor(npcSeededRandom() * 1000);

    Object.keys(stud.stats).forEach((key) => {

      if (key !== "fertility") {

        stud.stats[key as keyof Stats] = Math.max(

          20,

          stud.stats[key as keyof Stats],

        );

      }

    });

    nextNpcStuds[stud.id] = stud;

  }

  return nextNpcStuds;

};



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


export type Role = "player" | "moderator" | "administrator";

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetType: "member" | "post" | "reply";
  reason: string;
  content?: string; // Content of the reported post/reply
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
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

  reward: (state: GameState) => void;

  condition: (state: GameState) => boolean;

}

export interface ShowConfig {

  bis: number;

  rbis: number;

  bov: number;

  rbov: number;

  bos: number;

  rbos: number;

  boc: number;

  rboc: number;

}

export interface Pregnancy {

  motherId: string;

  fatherId: string;

  fatherName: string;

  fatherGenotype: Genotype;

  fatherStats: Stats;

  fatherSilverIntensity: number;

  dueYear: number;

  dueSeason: string;

}

export interface AdminLog {

  id: string;

  action: string;

  timestamp: string;

  details: string;

}

export interface WhelpingReport {

  motherName: string;

  fatherName: string;

  kits: {

    name: string;

    phenotype: string;

    baseColor: string;

    pattern: string;

    eyeColor: string;

    isStillborn: boolean;

  }[];

}

export interface BreedingRecord {

  id: string;

  sireId: string;

  damId: string;

  year: number;

  season: string;

  kits: string[];

}



export interface NewsItem {

  id: string;

  date: string;

  title: string;

  content: string;

  category: string;

}



export const ACHIEVEMENTS: Achievement[] = [

  {

    id: "first-fox",

    name: "First Fox",

    description: "Adopt your first foundational fox to start your kennel journey.",

    rewardText: "1,000 Gold",

    condition: (state) => Object.keys(state.foxes).length >= 1,

    reward: (state) => state.addGold(1000),

  },

  {

    id: "master-breeder",

    name: "Master Breeder",

    description: "Successfully manage a growing population of foxes.",

    rewardText: "Premium Feed x5",

    condition: (state) => Object.keys(state.foxes).length >= 5,

    reward: (state) => state.adminAddItem("premium_feed", 5),

  },

  {

    id: "show-winner",

    name: "Show Winner",

    description: "Reach the pinnacle of competitive showing.",

    rewardText: "Champion Ribbon",

    condition: (state) => state.bisWins >= 1,

    reward: (state) => state.adminAddItem("champion_ribbon", 1),

  },

  {

    id: "millionaire",

    name: "Millionaire",

    description: "Amass a fortune through careful kennel management.",

    rewardText: "Gold Statue",

    condition: (state) => state.gold >= 50000,

    reward: (state) => state.adminAddItem("gold_statue", 1),

  },

];



interface GameState {

  foxes: Record<string, Fox>;

  gold: number;

  gems: number;

  year: number;

  joiningYear: number;

  season: "Spring" | "Summer" | "Autumn" | "Winter";

  inventory: Record<string, number>;

  foodUses: Record<string, number>;

  seniorShowWinners: string[];

  showReports: ShowReport[];

  shows: Show[];

  showVisibilityMode: "midweek" | "weekend";

  whelpingReports: WhelpingReport[];

  pregnancyList: Pregnancy[];

  kennelCapacity: number;
  nextFoxId: number;
  bisWins: number;

  bestDogWins: number;

  bestVixenWins: number;

  totalShowPoints: number;

  totalFoxesCount: number;

  forumCategories: ForumCategory[];

  forumPosts: ForumPost[];

  isAdmin: boolean;

  showConfig: Record<string, ShowConfig>;

  setShowConfig: (config: Record<string, ShowConfig>) => void;

  marketListings: MarketListing[];

  unlockedAchievements: string[];

  hiredGroomer: boolean;

  hiredVeterinarian: boolean;

  hiredTrainer: boolean;

  hiredGeneticist: boolean;

  hiredNutritionist: boolean;

  bannerUrl: string;

  bannerXPosition: string;

  bannerYPosition: string;

  lastAdoptionReset: string;

  members: Member[];

  adminLogs: AdminLog[];

  isDarkMode: boolean;

  hasSeenTutorial: boolean;

  tutorialStep: number | null;

  colorblindMode: string;

  highContrast: boolean;

  fontSize: "small" | "normal" | "large" | "xl";

  useOpenDyslexic: boolean;

  reducedMotion: boolean;

  alwaysUnderlineLinks: boolean;

  highVisibilityFocus: boolean;

  simplifiedUI: boolean;

  textSpacing: "normal" | "wide" | "extra";

  broadcast: string | null;

  news: NewsItem[];



  advanceTime: () => void;

  breedFoxes: (dogId: string, vixenId: string) => void;

  addGold: (amount: number) => void;

  addGems: (amount: number) => void;

  addFox: (fox: Fox) => void;

  sellFox: (id: string) => void;

  retireFox: (id: string) => void;

  buyItem: (

    itemId: string,

    price: number,

    currency: "gold" | "gems",

    quantity?: number,

  ) => void;

  buyFoundationFox: (foxId: string) => void;

  buyCustomFoundationalFox: (
    genotype: Genotype,
    gender: "Dog" | "Vixen",
    name?: string,
    eyeColor?: string,
  ) => void;

  applyItem: (itemId: string, foxId: string) => void;

  renameFox: (id: string, newName: string) => void;

  updateFox: (id: string, updates: Partial<Fox>) => void;

  spayNeuterFox: (id: string) => void;

  initializeGame: () => void;

  setBannerUrl: (url: string) => void;

  setBannerXPosition: (pos: string) => void;

  setBannerYPosition: (pos: string) => void;

  toggleColorblindMode: (mode: string) => void;

  toggleHighContrast: () => void;

  setFontSize: (size: "small" | "normal" | "large" | "xl") => void;

  toggleOpenDyslexic: () => void;

  toggleReducedMotion: () => void;

  toggleAlwaysUnderlineLinks: () => void;

  toggleHighVisibilityFocus: () => void;

  toggleSimplifiedUI: () => void;

  setTextSpacing: (spacing: "normal" | "wide" | "extra") => void;

  expandKennel: () => void;

  runShows: () => void;

  generateSeasonalShows: () => void;

  enterFoxInShow: (foxId: string, showId: string) => void;

  addShow: (show: Show) => void;

  removeShow: (showId: string) => void;

  updateShow: (showId: string, updates: Partial<Show>) => void;

  setTutorialStep: (step: number | null) => void;

  completeTutorial: () => void;

  toggleAdminMode: () => void;

  toggleDarkMode: () => void;

  resetGame: () => void;

  repopulateFoundationFoxes: () => void;

  adminAddCurrency: (gold: number, gems: number) => void;

    adminSetCurrency: (updates: { gold?: number; gems?: number }) => void;
  currentMemberId: string;
  reports: Report[];
  setCurrentMemberId: (id: string) => void;
  updateMemberRole: (memberId: string, role: Role) => void;
  addReport: (report: Omit<Report, "id" | "status" | "createdAt">) => void;
  resolveReport: (reportId: string, action: "resolved" | "dismissed") => void;
  lockForumPost: (postId: string) => void;

  adminAddItem: (itemId: string, count: number) => void;

  adminSpawnFox: (

    name: string,

    gender: "Dog" | "Vixen",

    genotype: Genotype,

  ) => void;

  adminUpdateFoxStats: (foxId: string, stats: Partial<Stats>) => void;

  addAdminLog: (action: string, details: string) => void;

  warnMember: (memberId: string, reason: string) => void;

  banMember: (memberId: string) => void;

  toggleStudStatus: (foxId: string, fee: number) => void;

  hireGroomer: () => void;

  hireVeterinarian: () => void;

  hireTrainer: () => void;

  hireGeneticist: () => void;

  hireNutritionist: () => void;

  setFoxPreferredFeed: (foxId: string, feedId: string) => void;

  feedAllFoxes: () => void;

  groomFox: (foxId: string) => void;

  trainFox: (foxId: string) => void;

  groomAllFoxes: () => void;

  trainAllFoxes: () => void;

  addForumCategory: (name: string, description: string, icon: string) => void;

  addForumPost: (

    categoryId: string,

    author: string,

    title: string,

    content: string,

  ) => void;

  addForumReply: (postId: string, author: string, content: string) => void;

  deleteForumPost: (postId: string) => void;

  deleteForumReply: (postId: string, replyId: string) => void;

  togglePinPost: (postId: string) => void;

  setBroadcast: (message: string | null) => void;

  addNews: (title: string, content: string, category: string) => void;

  deleteNews: (id: string) => void;

  adminUpdateMemberInventory: (

    memberId: string,

    itemId: string,

    count: number,

  ) => void;

  adminRemoveItemFromInventory: (memberId: string, itemId: string) => void;

  buyFromMarket: (listingId: string) => void;

  cancelListing: (listingId: string) => void;

  updateMarketListing: (listingId: string, updates: Partial<MarketListing>) => void;

  listItemOnMarket: (type: "fox" | "item", targetId: string, price: number, currency: "gold" | "gems") => void;

  listFoxOnMarket: (foxId: string, price: number, currency: "gold" | "gems") => void;

  checkAchievements: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
      (set, _get) => ({

      foxes: {},
      gold: 10000,
      gems: 100,
      year: 1,
      joiningYear: 1,
      season: "Spring",
      inventory: {},
      foodUses: {},
      seniorShowWinners: [],
      showReports: [],
      shows: [],
      showVisibilityMode: "midweek",
      whelpingReports: [],
      pregnancyList: [],
      kennelCapacity: 10,
      nextFoxId: 1,
      bisWins: 0,
      bestDogWins: 0,
      bestVixenWins: 0,
      totalShowPoints: 0,
      totalFoxesCount: 0,
      forumCategories: [
        { id: "announcements", name: "Announcements", description: "Official updates.", icon: "Megaphone" },
        { id: "general", name: "General Discussion", description: "Talk about foxes.", icon: "MessageSquare" }
      ],
      forumPosts: [],
      isAdmin: false,
      showConfig: {
        Pro: { bis: 2000, rbis: 800, bov: 1000, rbov: 500, bos: 600, rbos: 300, boc: 400, rboc: 200 },
        Amateur: { bis: 1000, rbis: 400, bov: 500, rbov: 250, bos: 300, rbos: 150, boc: 200, rboc: 100 },
        Altered: { bis: 1500, rbis: 600, bov: 750, rbov: 375, bos: 450, rbos: 225, boc: 300, rboc: 150 },
      },
      marketListings: [],
      unlockedAchievements: [],
      hiredGroomer: false,
      hiredVeterinarian: false,
      hiredTrainer: false,
      hiredGeneticist: false,
      hiredNutritionist: false,
      bannerUrl: "",
      bannerXPosition: "50%",
      bannerYPosition: "50%",
      lastAdoptionReset: new Date().toISOString(),
      members: [
        { id: "player-1", name: "Angmar", level: 1, joined: new Date().toISOString().split("T")[0], points: 0, avatarColor: "bg-fire-500", isBanned: false, warnings: [], role: "administrator", ipHistory: ["192.168.1.1"] }
      ],
      adminLogs: [],
      isDarkMode: false,
      hasSeenTutorial: false,
      tutorialStep: null,
      colorblindMode: "none",
      highContrast: false,
      fontSize: "normal",
      useOpenDyslexic: false,
      reducedMotion: false,
      alwaysUnderlineLinks: false,
      highVisibilityFocus: false,
      simplifiedUI: false,
      textSpacing: "normal",
      broadcast: null,
      news: [],
      currentMemberId: "player-1",
      reports: [],

      // Actions
      advanceTime: () => set((state) => {
        const seasons = ["Spring", "Summer", "Autumn", "Winter"];
        const currentIdx = seasons.indexOf(state.season);
        const nextSeason = seasons[(currentIdx + 1) % 4] as "Spring" | "Summer" | "Autumn" | "Winter";
        return { season: nextSeason, year: nextSeason === "Spring" ? state.year + 1 : state.year };
      }),
      breedFoxes: (_dogId, _vixenId) => {},
      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      addFox: (fox) => set((state) => ({ foxes: { ...state.foxes, [fox.id]: fox } })),
      sellFox: (id) => set((state) => {
        const updated = { ...state.foxes };
        delete updated[id];
        return { foxes: updated };
      }),
      retireFox: (id) => set((state) => ({ foxes: { ...state.foxes, [id]: { ...state.foxes[id], isRetired: true } } })),
      buyItem: (_itemId, _price, _currency, _quantity = 1) => {},
      buyFoundationFox: (_foxId) => {},
      buyCustomFoundationalFox: (_genotype, _gender, _name, _eyeColor) => {},
      applyItem: (_itemId, _foxId) => {},
      renameFox: (_id, _newName) => {},
      updateFox: (id, updates) => set((state) => ({ foxes: { ...state.foxes, [id]: { ...state.foxes[id], ...updates } } })),
      spayNeuterFox: (_id) => {},
      initializeGame: () => {},
      setBannerUrl: (url) => set({ bannerUrl: url }),
      setBannerXPosition: (pos) => set({ bannerXPosition: pos }),
      setBannerYPosition: (pos) => set({ bannerYPosition: pos }),
      toggleColorblindMode: (mode) => set({ colorblindMode: mode }),
      toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
      setFontSize: (size) => set({ fontSize: size }),
      toggleOpenDyslexic: () => set((state) => ({ useOpenDyslexic: !state.useOpenDyslexic })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      toggleAlwaysUnderlineLinks: () => set((state) => ({ alwaysUnderlineLinks: !state.alwaysUnderlineLinks })),
      toggleHighVisibilityFocus: () => set((state) => ({ highVisibilityFocus: !state.highVisibilityFocus })),
      toggleSimplifiedUI: () => set((state) => ({ simplifiedUI: !state.simplifiedUI })),
      setTextSpacing: (spacing) => set({ textSpacing: spacing }),
      expandKennel: () => {},
      runShows: () => {},
      generateSeasonalShows: () => {},
      enterFoxInShow: (_foxId, _showId) => {},
      addShow: (_show) => {},
      removeShow: (_showId) => {},
      updateShow: (_showId, _updates) => {},
      setTutorialStep: (step) => set({ tutorialStep: step }),
      completeTutorial: () => set({ hasSeenTutorial: true, tutorialStep: null }),
      toggleAdminMode: () => set((state) => ({ isAdmin: !state.isAdmin })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      resetGame: () => {},
      repopulateFoundationFoxes: () => {},
      adminAddCurrency: (_gold, _gems) => {},
      adminSetCurrency: (updates) => set(updates),
      setCurrentMemberId: (id) => set({ currentMemberId: id }),
      updateMemberRole: (_memberId, _role) => {},
      addReport: (_report) => {},
      resolveReport: (_reportId, _action) => {},
      lockForumPost: (_postId) => {},
      adminAddItem: (_itemId, _count) => {},
      adminSpawnFox: (_name, _gender, _genotype) => {},
      adminUpdateFoxStats: (_foxId, _stats) => {},
      addAdminLog: (_action, _details) => {},
      warnMember: (_memberId, _reason) => {},
      banMember: (_memberId) => {},
      toggleStudStatus: (_foxId, _fee) => {},
      hireGroomer: () => {},
      hireVeterinarian: () => {},
      hireTrainer: () => {},
      hireGeneticist: () => {},
      hireNutritionist: () => {},
      setFoxPreferredFeed: (_foxId, _feedId) => {},
      feedAllFoxes: () => {},
      groomFox: (_foxId) => {},
      trainFox: (_foxId) => {},
      groomAllFoxes: () => {},
      trainAllFoxes: () => {},
      addForumCategory: (_name, _description, _icon) => {},
      addForumPost: (_categoryId, _author, _title, _content) => {},
      addForumReply: (_postId, _author, _content) => {},
      deleteForumPost: (_postId) => {},
      deleteForumReply: (_postId, _replyId) => {},
      togglePinPost: (_postId) => {},
      setBroadcast: (message) => set({ broadcast: message }),
      addNews: (_title, _content, _category) => {},
      deleteNews: (_id) => {},
      adminUpdateMemberInventory: (_memberId, _itemId, _count) => {},
      adminRemoveItemFromInventory: (_memberId, _itemId) => {},
      buyFromMarket: (_listingId) => {},
      cancelListing: (_listingId) => {},
      updateMarketListing: (_listingId, _updates) => {},
      listItemOnMarket: (_type, _targetId, _price, _currency) => {},
      listFoxOnMarket: (_foxId, _price, _currency) => {},
      setShowConfig: (config) => set({ showConfig: config }),
      checkAchievements: () => {},
    }),

    {

      name: "red-fox-sim-storage",

      version: 8,

      migrate: (persistedState: unknown, version: number) => {

        let state = persistedState as Partial<GameState>;

        if (version < 4) {

          state = {

            ...state,

            colorblindMode: state.colorblindMode ?? "none",

            highContrast: state.highContrast ?? false,

            fontSize: state.fontSize ?? "normal",

            useOpenDyslexic: state.useOpenDyslexic ?? false,

            reducedMotion: state.reducedMotion ?? false,

            alwaysUnderlineLinks: state.alwaysUnderlineLinks ?? false,

          };

        }

        if (version < 5) {

          state = {

            ...state,

            highVisibilityFocus: state.highVisibilityFocus ?? false,

            simplifiedUI: state.simplifiedUI ?? false,

            textSpacing: state.textSpacing ?? "normal",

          };

        }

        if (version < 7) {

          state = {

            ...state,

            broadcast: state.broadcast ?? null,

            news: state.news ?? [],

            marketListings: state.marketListings ?? [],

            forumPosts: state.forumPosts ?? [],

          };

        }
        if (version < 8) {
          state = {
            ...state,
            currentMemberId: state.currentMemberId ?? "player-1",
            reports: state.reports ?? [],
            members: (state.members || []).map(m => ({
              ...m,
              role: m.role ?? "player",
              ipHistory: m.ipHistory ?? ["192.168.1.1"],
            })),
          };
        }

        return state;

      },

      partialize: (state) => state,

    },

  ),

);

