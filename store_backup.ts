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
    (set, get) => ({

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

        {

          id: "announcements",

          name: "Announcements",

          description: "Official game updates and news.",

          icon: "Megaphone",

        },

        {

          id: "general",

          name: "General Discussion",

          description: "Talk about anything related to foxes.",

          icon: "MessageSquare",

        },

        {

          id: "trading",

          name: "Trading & Sales",

          description: "Buy and sell foxes or items.",

          icon: "Store",

        },

        {

          id: "help",

          name: "Help & Support",

          description: "Get help from other players and staff.",

          icon: "LifeBuoy",

        },

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

      bannerUrl:

        "https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=2070&auto=format&fit=crop",

      bannerXPosition: "50%",

      bannerYPosition: "50%",

      lastAdoptionReset: new Date().toISOString(),

      members: [
              {
                id: "player-1",
                name: "Angmar",
                level: 1,
                joined: new Date().toISOString().split("T")[0],
                points: 0,
                avatarColor: "bg-fire-500",
                isBanned: false,
                warnings: [],
                role: "administrator",
                ipHistory: ["192.168.1.1"],
              },
            ],
          adminLogs: [],
          isAdmin: false,
          hasSeenTutorial: false,
          tutorialStep: 0,
          colorblindMode: "none" as const,
          highContrast: false,
          fontSize: "normal" as const,
          useOpenDyslexic: false,
          reducedMotion: false,
          alwaysUnderlineLinks: false,
          highVisibilityFocus: false,
          simplifiedUI: false,
          textSpacing: "normal" as const,
          broadcast: null,
          news: [
            {
              id: "1",
              date: "February 20, 2026",
              title: "Marketplace Beta Launch",
              content: "The player-to-player marketplace is now live! You can now list your foxes and items for sale in exchange for Gold or Gems.",
              category: "Update",
            },
          ],
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
          bannerUrl: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=2070&auto=format&fit=crop",
          bannerXPosition: "50%",
          bannerYPosition: "50%",
          isDarkMode: false,
          currentMemberId: "player-1",
          reports: [],

      advanceTime: () => {
        set((state) => {
          const seasons = ["Spring", "Summer", "Autumn", "Winter"];
          const currentSeasonIndex = seasons.indexOf(state.season);
          const nextSeasonIndex = (currentSeasonIndex + 1) % 4;
          const nextSeason = seasons[nextSeasonIndex];
          const nextYear = nextSeason === "Spring" ? state.year + 1 : state.year;

          return {
            season: nextSeason as any,
            year: nextYear,
          };
        });
        get().generateSeasonalShows();
      },

      breedFoxes: (dogId, vixenId) => {
        const dog = get().foxes[dogId];
        const vixen = get().foxes[vixenId];
        if (!dog || !vixen) return;
        const kits = breed(dog, vixen);
        const updatedFoxes = { ...get().foxes };
        kits.forEach(kit => {
          const id = get().nextFoxId.toString().padStart(7, '0');
          updatedFoxes[id] = { ...kit, id, ownerId: "player-1" };
          set(state => ({ nextFoxId: state.nextFoxId + 1 }));
        });
        set({ foxes: updatedFoxes });
      },

      repopulateFoundationFoxes: () => {
        const newFoundationFoxes = createFoundationFoxCollection();

        set((state) => {
          const updatedFoxes = { ...state.foxes };

          // Remove all existing foundation foxes
          Object.keys(updatedFoxes).forEach(foxId => {
            if (updatedFoxes[foxId].isFoundation) {
              delete updatedFoxes[foxId];
            }
          });

          // Add new foundation foxes with new IDs
          newFoundationFoxes.forEach((fox) => {
            const foxId = (state.nextFoxId || 1).toString().padStart(7, '0');
            updatedFoxes[foxId] = {
              ...fox,
              id: foxId,
              ownerId: "player-0",
              isFoundation: true
            };
            state.nextFoxId = (state.nextFoxId || 1) + 1;
          });

          return {
            foxes: updatedFoxes,
            nextFoxId: state.nextFoxId,
          };
        });
      },

      adminAddCurrency: (goldAmount, gemsAmount) =>

        set((state) => ({

          gold: state.gold + goldAmount,

          gems: state.gems + gemsAmount,

        })),

      adminSetCurrency: (updates) => set(updates),

      adminAddItem: (itemId, count) =>

        set((state) => ({

          inventory: {

            ...state.inventory,

            [itemId]: (state.inventory[itemId] || 0) + count,

          },

        })),

      adminSpawnFox: (name, gender, genotype) => {

        const fox = createFox({ name, gender, genotype });

        set((state) => ({ foxes: { ...state.foxes, [fox.id]: fox } }));

        get().addAdminLog("Spawn Fox", `Spawned fox ${name} (${fox.id})`);

      },

      warnMember: (memberId, reason) =>

        set((state) => ({

          members: state.members.map((m) =>

            m.id === memberId ? { ...m, warnings: [...m.warnings, reason] } : m,

          ),

        })),

      banMember: (memberId) =>

        set((state) => ({

          members: state.members.map((m) =>

            m.id === memberId ? { ...m, isBanned: true } : m,

          ),

        })),

      toggleColorblindMode: (mode) =>

        set((state: GameState) => ({ colorblindMode: mode })),

      toggleHighContrast: () =>

        set((state: GameState) => ({ highContrast: !state.highContrast })),

      setFontSize: (size: "small" | "normal" | "large" | "xl") =>

        set({ fontSize: size }),

      resetGame: () => {
        // Generate initial NPC studs and foundation foxes as owned foxes
        const initialFoxes: Record<string, Fox> = {};

        // Generate NPC studs
        const npcStuds = generateNPCStuds(1, "Spring");
        Object.values(npcStuds).forEach((stud) => {
          const foxId = (Object.keys(initialFoxes).length + 1).toString().padStart(7, '0');
          initialFoxes[foxId] = { ...stud, id: foxId, ownerId: "player-0", isFoundation: false };
        });

        // Generate foundation foxes
        const foundationFoxes = createFoundationFoxCollection();
        foundationFoxes.forEach((fox) => {
          const foxId = (Object.keys(initialFoxes).length + 1).toString().padStart(7, '0');
          initialFoxes[foxId] = { ...fox, id: foxId, ownerId: "player-0", isFoundation: true };
        });

        set(() => ({
          // Reset to initial game state
          season: "Spring" as const,
          year: 1,
          gold: 10000,
          gems: 100,
          foxes: initialFoxes,
          nextFoxId: Object.keys(initialFoxes).length + 1,
          kennelCapacity: 10,
          inventory: {
            "gene_test": 1,
            "grooming-kit": 1,
            "training-session": 1,
            "supplies": 10,
          },
          pregnancyList: [],
          whelpingReports: [],
          shows: [],
          showReports: [],
          showVisibilityMode: "midweek" as const,
          soldFoundationalSlots: [],
          lastAdoptionReset: new Date().toISOString(),
          members: [
            {
              id: "player-0",
              name: "Game System",
              level: 0,
              joined: "2026-02-15",
              points: 0,
              avatarColor: "bg-gray-500",
              isBanned: false,
              warnings: [],
              role: "administrator",
              ipHistory: ["127.0.0.1"],
            },
            {
              id: "player-1",
              name: "Angmar",
              level: 10,
              joined: "2026-02-15",
              points: 1500,
              avatarColor: "bg-fire-500",
              isBanned: false,
              warnings: [],
              role: "administrator",
              ipHistory: ["192.168.1.1"],
            },
          ],
          adminLogs: [],
          isAdmin: false,
          hasSeenTutorial: false,
          tutorialStep: 0,
          colorblindMode: "none" as const,
          highContrast: false,
          fontSize: "normal" as const,
          useOpenDyslexic: false,
          reducedMotion: false,
          alwaysUnderlineLinks: false,
          highVisibilityFocus: false,
          simplifiedUI: false,
          textSpacing: "normal" as const,
          broadcast: null,
          news: [
            {
              id: "1",
              date: "February 20, 2026",
              title: "Marketplace Beta Launch",
              content: "The player-to-player marketplace is now live! You can now list your foxes and items for sale in exchange for Gold or Gems.",
              category: "Update",
            },
          ],
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
          bannerUrl: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=2070&auto=format&fit=crop",
          bannerXPosition: "50%",
          bannerYPosition: "50%",
          isDarkMode: false,
          currentMemberId: "player-1",
          reports: [],
        }));

        // Generate initial shows after state is set
        setTimeout(() => {
          get().generateSeasonalShows();
        }, 0);
      },

      toggleOpenDyslexic: () =>

        set((state: GameState) => ({

          useOpenDyslexic: !state.useOpenDyslexic,

        })),

      toggleReducedMotion: () =>

        set((state: GameState) => ({ reducedMotion: !state.reducedMotion })),

      toggleAlwaysUnderlineLinks: () =>

        set((state: GameState) => ({

          alwaysUnderlineLinks: !state.alwaysUnderlineLinks,

        })),

      toggleHighVisibilityFocus: () =>

        set((state: GameState) => ({

          highVisibilityFocus: !state.highVisibilityFocus,

        })),

      toggleSimplifiedUI: () =>

        set((state: GameState) => ({

          simplifiedUI: !state.simplifiedUI,

        })),

      setTextSpacing: (spacing: "normal" | "wide" | "extra") =>

        set({ textSpacing: spacing }),

      toggleDarkMode: () =>

        set((state: GameState) => ({ isDarkMode: !state.isDarkMode })),

      setTutorialStep: (step) => set({ tutorialStep: step }),

      resetGame: () => {
        // Generate initial NPC studs and foundation foxes as owned foxes
        const initialFoxes: Record<string, Fox> = {};

        // Generate NPC studs
        const npcStuds = generateNPCStuds(1, "Spring");
        Object.values(npcStuds).forEach((stud) => {
          const foxId = (Object.keys(initialFoxes).length + 1).toString().padStart(7, '0');
          initialFoxes[foxId] = { ...stud, id: foxId, ownerId: "player-0", isFoundation: false };
        });

        // Generate foundation foxes
        const foundationFoxes = createFoundationFoxCollection();
        foundationFoxes.forEach((fox) => {
          const foxId = (Object.keys(initialFoxes).length + 1).toString().padStart(7, '0');
          initialFoxes[foxId] = { ...fox, id: foxId, ownerId: "player-0", isFoundation: true };
        });

        set(() => ({
          // Reset to initial game state
          season: "Spring" as const,
          year: 1,
          gold: 10000,
          gems: 100,
          foxes: initialFoxes,
          nextFoxId: Object.keys(initialFoxes).length + 1,
          kennelCapacity: 10,
          inventory: {
            "gene_test": 1,
            "grooming-kit": 1,
            "training-session": 1,
            "supplies": 10,
          },
          pregnancyList: [],
          whelpingReports: [],
          shows: [],
          showReports: [],
          showVisibilityMode: "midweek" as const,
          soldFoundationalSlots: [],
          lastAdoptionReset: new Date().toISOString(),
          members: [
            {
              id: "player-0",
              name: "Game System",
              level: 0,
              joined: "2026-02-15",
              points: 0,
              avatarColor: "bg-gray-500",
              isBanned: false,
              warnings: [],
              role: "administrator",
              ipHistory: ["127.0.0.1"],
            },
            {
              id: "player-1",
              name: "Angmar",
              level: 10,
              joined: "2026-02-15",
              points: 1500,
              avatarColor: "bg-fire-500",
              isBanned: false,
              warnings: [],
              role: "administrator",
              ipHistory: ["192.168.1.1"],
            },
          ],
          adminLogs: [],
          isAdmin: false,
          hasSeenTutorial: false,
          tutorialStep: 0,
          colorblindMode: "none" as const,
          highContrast: false,
          fontSize: "normal" as const,
          useOpenDyslexic: false,
          reducedMotion: false,
          alwaysUnderlineLinks: false,
          highVisibilityFocus: false,
          simplifiedUI: false,
          textSpacing: "normal" as const,
          broadcast: null,
          news: [
            {
              id: "1",
              date: "February 20, 2026",
              title: "Marketplace Beta Launch",
              content: "The player-to-player marketplace is now live! You can now list your foxes and items for sale in exchange for Gold or Gems.",
              category: "Update",
            },
          ],
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
          bannerUrl: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=2070&auto=format&fit=crop",
          bannerXPosition: "50%",
          bannerYPosition: "50%",
          isDarkMode: false,
          currentMemberId: "player-1",
          reports: [],
        }));

        // Generate initial shows after state is set
        setTimeout(() => {
          get().generateSeasonalShows();
        }, 0);
      },

      completeTutorial: () => set({ hasSeenTutorial: true, tutorialStep: null }),

      addForumCategory: (name, description, icon) =>

        set((state) => ({

          forumCategories: [

            ...state.forumCategories,

            { id: Math.random().toString(36).substr(2, 9), name, description, icon }

          ]

        })),

      addForumPost: (categoryId, author, title, content) =>

        set((state) => ({

          forumPosts: [

            {

              id: Math.random().toString(36).substring(2, 9),

              categoryId,

              author,

              title,

              content,

              createdAt: new Date().toISOString(),

              replies: [],

            },

            ...(state.forumPosts || []),

          ],

        })),

      addForumReply: (postId, author, content) =>

        set((state) => ({

          forumPosts: (state.forumPosts || []).map((p) =>

            p.id === postId

              ? {

                  ...p,

                  replies: [

                    ...(p.replies || []),

                    {

                      id: Math.random().toString(36).substring(2, 9),

                      author,

                      content,

                      createdAt: new Date().toISOString(),

                    },

                  ],

                }

              : p,

          ),

        })),

      deleteForumPost: (postId) =>

        set((state) => ({

          forumPosts: (state.forumPosts || []).filter((p) => p.id !== postId),

        })),

      deleteForumReply: (postId, replyId) =>

        set((state) => ({

          forumPosts: (state.forumPosts || []).map((p) =>

            p.id === postId

              ? {

                  ...p,

                  replies: p.replies?.filter((r) => r.id !== replyId),

                }

              : p,

          ),

        })),

      togglePinPost: (postId) =>

        set((state) => ({

          forumPosts: (state.forumPosts || []).map((p) =>

            p.id === postId ? { ...p, isPinned: !p.isPinned } : p

          )

        })),

      setBroadcast: (message) => set({ broadcast: message }),

      addNews: (title, content, category) =>

        set((state) => ({

          news: [

            {

              id: Math.random().toString(36).substring(2, 9),

              date: new Date().toLocaleDateString("en-US", {

                month: "long",

                day: "numeric",

                year: "numeric",

              }),

              title,

              content,

              category,

            },

            ...(state.news || []),

          ],

        })),

      deleteNews: (id) =>

        set((state) => ({

          news: (state.news || []).filter((n) => n.id !== id),

        })),

      adminUpdateMemberInventory: (memberId, itemId, count) =>

        set((state) => ({

          inventory:

            memberId === "player-1"

              ? {

                  ...state.inventory,

                  [itemId]: (state.inventory[itemId] || 0) + count,

                }

              : state.inventory,

        })),

      adminRemoveItemFromInventory: (memberId, itemId) =>

        set((state) => {

          if (memberId !== "player-1") return state;

          const { [itemId]: _, ...newInventory } = state.inventory;

          return { inventory: newInventory };

        }),

      buyFromMarket: (listingId) =>

        set((state) => {

          const listing = (state.marketListings || []).find(l => l.id === listingId);

          if (!listing) return state;

          if (listing.currency === "gold" && state.gold < listing.price) return state;

          if (listing.currency === "gems" && state.gems < listing.price) return state;



          return {

            gold: listing.currency === "gold" ? state.gold - listing.price : state.gold,

            gems: listing.currency === "gems" ? state.gems - listing.price : state.gems,

            marketListings: state.marketListings.filter(l => l.id !== listingId)

          };

        }),

      cancelListing: (listingId) =>

        set((state) => ({

          marketListings: (state.marketListings || []).filter(l => l.id !== listingId)

        })),

      updateMarketListing: (listingId, updates) =>

        set((state) => ({

          marketListings: (state.marketListings || []).map(l => l.id === listingId ? { ...l, ...updates } : l)

        })),

      listItemOnMarket: (type, targetId, price, currency) =>

        set((state) => ({

          marketListings: [

            ...(state.marketListings || []),

            {

              id: Math.random().toString(36).substr(2, 9),

              sellerId: "player-1",

              sellerName: "Angmar",

              type,

              targetId,

              price,

              currency,

              createdAt: new Date().toISOString()

            }

          ]

        })),

      listFoxOnMarket: (foxId, price, currency) => {

        get().listItemOnMarket("fox", foxId, price, currency);

      },

      toggleStudStatus: (foxId, fee) =>

        set((state) => ({

          foxes: {

            ...state.foxes,

            [foxId]: {

              ...state.foxes[foxId],

              isAtStud: !state.foxes[foxId].isAtStud,

              studFee: fee,

            },

          },

        })),

      hireGroomer: () =>

        set((state) => {

          if (state.gems < 50 || state.hiredGroomer) return state;

          return { gems: state.gems - 50, hiredGroomer: true };

        }),

      hireVeterinarian: () =>

        set((state) => {

          if (state.gems < 100 || state.hiredVeterinarian) return state;

          return { gems: state.gems - 100, hiredVeterinarian: true };

        }),

      hireTrainer: () =>

        set((state) => {

          if (state.gems < 75 || state.hiredTrainer) return state;

          return { gems: state.gems - 75, hiredTrainer: true };

        }),

      hireGeneticist: () =>

        set((state) => {

          if (state.gems < 100 || state.hiredGeneticist) return state;

          // Reveal all genotypes permanently when geneticist is hired

          const updatedFoxes = { ...state.foxes };

          Object.keys(updatedFoxes).forEach((foxId) => {

            updatedFoxes[foxId] = { ...updatedFoxes[foxId], genotypeRevealed: true };

          });

          return {

            gems: state.gems - 100,

            hiredGeneticist: true,

            foxes: updatedFoxes

          };

        }),

      hireNutritionist: () =>

        set((state) => {

          if (state.gems < 50 || state.hiredNutritionist) return state;

          return { gems: state.gems - 50, hiredNutritionist: true };

        }),

      setFoxPreferredFeed: (foxId, feedId) =>

        set((state) => ({

          foxes: {

            ...state.foxes,

            [foxId]: { ...state.foxes[foxId], preferredFeed: feedId },

          },

        })),

      feedAllFoxes: () =>

        set((state) => {

          const updatedFoxes = { ...state.foxes };

          Object.keys(updatedFoxes).forEach((id) => {

            updatedFoxes[id].lastFed = Date.now();

          });

          return { foxes: updatedFoxes };

        }),

      groomFox: (foxId) =>

        set((state) => ({

          foxes: {

            ...state.foxes,

            [foxId]: { ...state.foxes[foxId], lastGroomed: Date.now() },

          },

        })),

      trainFox: (foxId) =>

        set((state) => ({

          foxes: {

            ...state.foxes,

            [foxId]: { ...state.foxes[foxId], lastTrained: Date.now() },

          },

        })),

      groomAllFoxes: () =>

        set((state) => {

          const updatedFoxes = { ...state.foxes };

          Object.keys(updatedFoxes).forEach((id) => {

            updatedFoxes[id].lastGroomed = Date.now();

          });

          return { foxes: updatedFoxes };

        }),

      trainAllFoxes: () =>

        set((state) => {

          const updatedFoxes = { ...state.foxes };

          Object.keys(updatedFoxes).forEach((id) => {

            updatedFoxes[id].lastTrained = Date.now();

          });

          return { foxes: updatedFoxes };

        }),

      checkAchievements: () => {

        const { foxes, gold, bisWins, unlockedAchievements } = get();

        ACHIEVEMENTS.forEach((ach) => {

          if (!unlockedAchievements.includes(ach.id) && ach.condition(get())) {

            set((state) => ({

              unlockedAchievements: [...state.unlockedAchievements, ach.id],

            }));

            ach.reward(get());

          }

        });

      },

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
