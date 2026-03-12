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
  getFoxVariety,
  calculateScore,
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
  hiredHandler: boolean;

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
  hireHandler: () => void;

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
  setAdminMode: (isAdmin: boolean) => void;
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
      hiredHandler: false,
      bannerUrl: "",
      bannerXPosition: "50%",
      bannerYPosition: "50%",
      lastAdoptionReset: new Date().toISOString(),
      members: [
        { id: "player-1", name: "Angmar", level: 1, joined: new Date().toISOString().split("T")[0], points: 0, avatarColor: "bg-fire-500", isBanned: false, warnings: [], role: "administrator", ipHistory: ["192.168.1.1"] },
        { id: "player-2", name: "Shield", level: 1, joined: new Date().toISOString().split("T")[0], points: 0, avatarColor: "bg-info/50", isBanned: false, warnings: [], role: "moderator", ipHistory: ["192.168.1.2"] },
        { id: "player-3", name: "FoxFan", level: 1, joined: new Date().toISOString().split("T")[0], points: 0, avatarColor: "bg-success/50", isBanned: false, warnings: [], role: "player", ipHistory: ["192.168.1.3"] }
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

        // Reset care flags for all foxes
        const updatedFoxes = { ...state.foxes };
        Object.keys(updatedFoxes).forEach(id => {
          updatedFoxes[id] = {
            ...updatedFoxes[id],
            lastFed: undefined,
            lastGroomed: undefined,
            lastTrained: undefined
          };
        });

        return {
          season: nextSeason,
          year: nextSeason === "Spring" ? state.year + 1 : state.year,
          foxes: updatedFoxes,
          shows: [] // Clear shows for the new season
        };
      }),
      breedFoxes: (_dogId, _vixenId) => { },
      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      addFox: (fox) => set((state) => ({ foxes: { ...state.foxes, [fox.id]: fox } })),
      sellFox: (id) => set((state) => {
        const updated = { ...state.foxes };
        delete updated[id];
        return { foxes: updated };
      }),
      retireFox: (id) => set((state) => ({ foxes: { ...state.foxes, [id]: { ...state.foxes[id], isRetired: true } } })),
      buyItem: (_itemId, _price, _currency, _quantity = 1) => { },
      buyFoundationFox: (foxId) => set((state) => {
        if (state.gold < 1000) return state;
        const fox = state.foxes[foxId];
        if (!fox || !fox.isFoundation) return state;

        return {
          gold: state.gold - 1000,
          foxes: {
            ...state.foxes,
            [foxId]: {
              ...fox,
              isFoundation: false,
              ownerId: state.currentMemberId,
              history: [
                ...(fox.history || []),
                {
                  date: new Date().toISOString(),
                  event: 'Adopted',
                  details: `Adopted from Foundation Store by ${state.members.find(m => m.id === state.currentMemberId)?.name || 'Breeder'}`
                }
              ]
            }
          }
        };
      }),
      buyCustomFoundationalFox: (genotype, gender, name, eyeColor) => set((state) => {
        if (state.gems < 50) return state;
        const currentFoxCount = Object.keys(state.foxes).length;
        if (currentFoxCount >= state.kennelCapacity) return state;

        const nextId = state.nextFoxId;
        const forcedId = nextId.toString().padStart(7, "0");

        // High quality stats: min 25 for physical, min 50 for fertility
        const stats = {
          head: Math.floor(Math.random() * 25) + 25,
          topline: Math.floor(Math.random() * 25) + 25,
          forequarters: Math.floor(Math.random() * 25) + 25,
          hindquarters: Math.floor(Math.random() * 25) + 25,
          tail: Math.floor(Math.random() * 25) + 25,
          coatQuality: Math.floor(Math.random() * 25) + 25,
          temperament: Math.floor(Math.random() * 25) + 25,
          presence: Math.floor(Math.random() * 25) + 25,
          luck: Math.floor(Math.random() * 25) + 25,
          fertility: Math.floor(Math.random() * 50) + 50,
        };

        const newFox = createFox({
          id: forcedId,
          name: name || 'Custom Designer Fox',
          gender,
          genotype,
          eyeColor,
          stats,
          age: 2,
          ownerId: state.currentMemberId,
          history: [
            {
              date: new Date().toISOString(),
              event: 'Created',
              details: `Custom designer fox purchased by ${state.members.find(m => m.id === state.currentMemberId)?.name || 'Breeder'}`
            }
          ]
        }, Math.random, forcedId);

        return {
          gems: state.gems - 50,
          foxes: {
            ...state.foxes,
            [forcedId]: newFox
          },
          nextFoxId: state.nextFoxId + 1
        };
      }),
      applyItem: (itemId, foxId) => set((state) => {
        const fox = state.foxes[foxId];
        if (!fox) return state;

        const updatedFox = { ...fox };
        const now = Date.now();

        if (itemId === "grooming-kit") {
          updatedFox.lastGroomed = now;
        } else if (itemId === "training-session") {
          updatedFox.lastTrained = now;
        } else if (itemId === "genetic-test") {
          updatedFox.genotypeRevealed = true;
        } else if (itemId === "pedigree-analysis") {
          updatedFox.pedigreeAnalyzed = true;
        } else if (itemId.startsWith("feed-")) {
          const stat = itemId.replace("feed-", "") as keyof Stats;
          if (updatedFox.stats[stat] !== undefined) {
            // Boost stat permanently or temporarily? 
            // Usually these are permanent tiny boosts in sims.
            // But the UI suggests it also feeds them.
            updatedFox.lastFed = now;
            // Let's just feed them for now to match 'supplies'
          }
        } else if (itemId === "supplies") {
          updatedFox.lastFed = now;
        }

        return {
          foxes: { ...state.foxes, [foxId]: updatedFox }
        };
      }),
      renameFox: (id, newName) => set((state) => ({
        foxes: {
          ...state.foxes,
          [id]: { ...state.foxes[id], name: newName, hasBeenRenamed: true }
        }
      })),
      updateFox: (id, updates) => set((state) => ({ foxes: { ...state.foxes, [id]: { ...state.foxes[id], ...updates } } })),
      spayNeuterFox: (_id) => { },
      initializeGame: () => { },
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
      expandKennel: () => set((state) => ({
        kennelCapacity: state.kennelCapacity + 5
      })),
      runShows: () => set((state) => {
        const runningShows = state.shows.filter(s => !s.isRun && s.entries.length > 0);
        if (runningShows.length === 0) return state;

        // Group competitors for simulation
        const proCompetitors: Competitor[] = [];
        const amaCompetitors: Competitor[] = [];
        const altCompetitors: Competitor[] = [];

        state.shows.forEach(show => {
          if (show.isRun || show.entries.length === 0) return;

          show.entries.forEach(foxId => {
            const fox = state.foxes[foxId];
            if (!fox) return;

            const variety = getFoxVariety(fox);
            const gender = fox.gender;
            const ageGroup = fox.age >= 1 ? "Adult" : "Juvenile";

            const { total, breakdown } = calculateScore(fox, {
              groomer: state.hiredGroomer,
              veterinarian: state.hiredVeterinarian,
              trainer: state.hiredTrainer,
              nutritionist: state.hiredNutritionist
            });

            const competitor: Competitor = {
              fox,
              variety,
              level: show.level,
              gender,
              ageGroup,
              currentScore: total,
              currentBreakdown: breakdown
            };

            if (show.level.startsWith("Amateur")) amaCompetitors.push(competitor);
            else if (show.level.startsWith("Altered")) altCompetitors.push(competitor);
            else proCompetitors.push(competitor);
          });
        });

        const newReports: ShowReport[] = [];
        if (proCompetitors.length > 0) {
          newReports.push(runHierarchicalShow("Pro", proCompetitors, state.year, state.season, state.showConfig as any, state.hiredGroomer, state.hiredTrainer, state.hiredVeterinarian));
        }
        if (amaCompetitors.length > 0) {
          newReports.push(runHierarchicalShow("Amateur", amaCompetitors, state.year, state.season, state.showConfig as any, state.hiredGroomer, state.hiredTrainer, state.hiredVeterinarian));
        }
        if (altCompetitors.length > 0) {
          newReports.push(runHierarchicalShow("Altered", altCompetitors, state.year, state.season, state.showConfig as any, state.hiredGroomer, state.hiredTrainer, state.hiredVeterinarian));
        }

        const updatedFoxes = { ...state.foxes };
        newReports.forEach(report => {
          report.results.forEach(res => {
            if (updatedFoxes[res.foxId]) {
              updatedFoxes[res.foxId] = {
                ...updatedFoxes[res.foxId],
                pointsLifetime: (updatedFoxes[res.foxId].pointsLifetime || 0) + res.pointsAwarded,
                pointsYear: (updatedFoxes[res.foxId].pointsYear || 0) + res.pointsAwarded,
                history: [
                  ...(updatedFoxes[res.foxId].history || []),
                  {
                    date: new Date().toISOString(),
                    event: 'Show Result',
                    details: `${res.title} at ${res.level} ${res.variety} Show (+${res.pointsAwarded} pts)`
                  }
                ]
              };
            }
          });
        });

        return {
          showReports: [...newReports, ...state.showReports].slice(0, 50),
          foxes: updatedFoxes,
          shows: state.shows.map(s => ({ ...s, isRun: true }))
        };
      }),
      generateSeasonalShows: () => set((state) => {
        const varieties: Variety[] = ["Red", "Gold", "Silver", "Cross", "Exotic", "White Mark"];
        const levels: ShowLevel[] = ["Junior", "Open", "Senior", "Championship"];
        const newShows: Show[] = [];

        levels.forEach(level => {
          varieties.forEach(variety => {
            newShows.push({
              id: `pro-mid-${level}-${variety}-${state.year}-${state.season}`,
              name: `Midweek ${variety} ${level} Show`,
              level: level,
              type: variety,
              entries: [],
              isRun: false,
              isWeekend: false
            });
            newShows.push({
              id: `pro-week-${level}-${variety}-${state.year}-${state.season}`,
              name: `Weekend ${variety} ${level} Show`,
              level: level,
              type: variety,
              entries: [],
              isRun: false,
              isWeekend: true
            });
          });
        });

        ["Amateur Junior", "Amateur Open", "Amateur Senior", "Altered Junior", "Altered Open", "Altered Senior"].forEach(level => {
          varieties.forEach(variety => {
            newShows.push({
              id: `${level.startsWith("Amateur") ? "ama" : "alt"}-${level}-${variety}-${state.year}-${state.season}`,
              name: `${variety} ${level} Arena`,
              level: level as ShowLevel,
              type: variety,
              entries: [],
              isRun: false,
              isWeekend: true
            });
          });
        });

        return { shows: newShows };
      }),
      enterFoxInShow: (foxId, showId) => set((state) => {
        const targetShow = state.shows.find(s => s.id === showId);
        if (!targetShow) return state;

        const isRemoving = targetShow.entries.includes(foxId);

        if (!isRemoving) {
          // Rule 1: Fox can only be in one show at a time
          const isFoxAlreadyEntered = state.shows.some(s => s.entries.includes(foxId));
          if (isFoxAlreadyEntered) return state;

          // Rule 2: User can only add one fox per category (Level + Variety)
          if (!state.hiredHandler) {
            const hasFoxInCategory = state.shows.some(s =>
              s.level === targetShow.level &&
              s.type === targetShow.type &&
              s.entries.some(id => state.foxes[id]?.ownerId === state.currentMemberId)
            );
            if (hasFoxInCategory) return state;
          }
        }

        return {
          shows: state.shows.map((s) =>
            s.id === showId
              ? {
                ...s,
                entries: isRemoving
                  ? s.entries.filter((id) => id !== foxId)
                  : [...s.entries, foxId],
              }
              : s
          ),
        };
      }),
      addShow: (show) => set((state) => ({
        shows: [...state.shows, show]
      })),
      removeShow: (showId) => set((state) => ({
        shows: state.shows.filter(s => s.id !== showId)
      })),
      updateShow: (showId, updates) => set((state) => ({
        shows: state.shows.map(s => s.id === showId ? { ...s, ...updates } : s)
      })),
      setTutorialStep: (step) => set({ tutorialStep: step }),
      completeTutorial: () => set({ hasSeenTutorial: true, tutorialStep: null }),
      toggleAdminMode: () => set((state) => ({ isAdmin: !state.isAdmin })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      resetGame: () => { },
      repopulateFoundationFoxes: () => set((state) => {
        // Clear old foundation foxes (those still marked as foundation and owned by system)
        const updatedFoxes = { ...state.foxes };
        Object.keys(updatedFoxes).forEach(id => {
          if (updatedFoxes[id].isFoundation && updatedFoxes[id].ownerId === 'system') {
            delete updatedFoxes[id];
          }
        });

        // Generate new collection
        const newFoxes = createFoundationFoxCollection(Math.random, state.nextFoxId);
        newFoxes.forEach(f => {
          updatedFoxes[f.id] = {
            ...f,
            isFoundation: true,
            ownerId: 'system',
            age: 0 // Foundation foxes are always young
          };
        });

        return {
          foxes: updatedFoxes,
          nextFoxId: state.nextFoxId + newFoxes.length,
          lastAdoptionReset: new Date().toISOString()
        };
      }),
      adminAddCurrency: (_gold, _gems) => { },
      adminSetCurrency: (updates) => set(updates),
      setCurrentMemberId: (id) => set({ currentMemberId: id }),
      updateMemberRole: (memberId, role) => set((state) => ({
        members: state.members.map(m => m.id === memberId ? { ...m, role: role as Role } : m)
      })),
      addReport: (_report) => { },
      resolveReport: (_reportId, _action) => { },
      lockForumPost: (_postId) => { },
      adminAddItem: (_itemId, _count) => { },
      adminSpawnFox: (_name, _gender, _genotype) => { },
      adminUpdateFoxStats: (_foxId, _stats) => { },
      addAdminLog: (_action, _details) => { },
      warnMember: (_memberId, _reason) => { },
      banMember: (_memberId) => { },
      toggleStudStatus: (_foxId, _fee) => { },
      hireGroomer: () => set((state) => {
        if (state.gems < 20) return state;
        return { gems: state.gems - 20, hiredGroomer: true };
      }),
      hireVeterinarian: () => set((state) => {
        if (state.gems < 50) return state;
        return { gems: state.gems - 50, hiredVeterinarian: true };
      }),
      hireTrainer: () => set((state) => {
        if (state.gems < 40) return state;
        return { gems: state.gems - 40, hiredTrainer: true };
      }),
      hireGeneticist: () => set((state) => {
        if (state.gems < 100) return state;
        return { gems: state.gems - 100, hiredGeneticist: true };
      }),
      hireNutritionist: () => set((state) => {
        if (state.gems < 30) return state;
        return { gems: state.gems - 30, hiredNutritionist: true };
      }),
      hireHandler: () => set((state) => {
        if (state.gems < 75) return state;
        return { gems: state.gems - 75, hiredHandler: true };
      }),
      setFoxPreferredFeed: (foxId, feedId) => set((state) => ({
        foxes: {
          ...state.foxes,
          [foxId]: { ...state.foxes[foxId], preferredFeed: feedId }
        }
      })),
      feedAllFoxes: () => set((state) => {
        const updatedFoxes = { ...state.foxes };
        const now = Date.now();
        Object.keys(updatedFoxes).forEach(id => {
          if (updatedFoxes[id].ownerId === "player-1") {
            updatedFoxes[id] = { ...updatedFoxes[id], lastFed: now };
          }
        });
        return { foxes: updatedFoxes };
      }),
      groomFox: (foxId) => set((state) => ({
        foxes: {
          ...state.foxes,
          [foxId]: { ...state.foxes[foxId], lastGroomed: Date.now() }
        }
      })),
      trainFox: (foxId) => set((state) => ({
        foxes: {
          ...state.foxes,
          [foxId]: { ...state.foxes[foxId], lastTrained: Date.now() }
        }
      })),
      groomAllFoxes: () => set((state) => {
        const updatedFoxes = { ...state.foxes };
        const now = Date.now();
        Object.keys(updatedFoxes).forEach(id => {
          if (updatedFoxes[id].ownerId === "player-1") {
            updatedFoxes[id] = { ...updatedFoxes[id], lastGroomed: now };
          }
        });
        return { foxes: updatedFoxes };
      }),
      trainAllFoxes: () => set((state) => {
        const updatedFoxes = { ...state.foxes };
        const now = Date.now();
        Object.keys(updatedFoxes).forEach(id => {
          if (updatedFoxes[id].ownerId === "player-1") {
            updatedFoxes[id] = { ...updatedFoxes[id], lastTrained: now };
          }
        });
        return { foxes: updatedFoxes };
      }),
      addForumCategory: (_name, _description, _icon) => { },
      addForumPost: (_categoryId, _author, _title, _content) => { },
      addForumReply: (_postId, _author, _content) => { },
      deleteForumPost: (_postId) => { },
      deleteForumReply: (_postId, _replyId) => { },
      togglePinPost: (_postId) => { },
      setBroadcast: (message) => set({ broadcast: message }),
      addNews: (_title, _content, _category) => { },
      deleteNews: (_id) => { },
      adminUpdateMemberInventory: (_memberId, _itemId, _count) => { },
      adminRemoveItemFromInventory: (_memberId, _itemId) => { },
      buyFromMarket: (_listingId) => { },
      cancelListing: (_listingId) => { },
      updateMarketListing: (_listingId, _updates) => { },
      listItemOnMarket: (_type, _targetId, _price, _currency) => { },
      listFoxOnMarket: (_foxId, _price, _currency) => { },
      setShowConfig: (config) => set({ showConfig: config }),
      setAdminMode: (isAdmin: boolean) => set({ isAdmin }),
      checkAchievements: () => { },
    }),

    {

      name: "red-fox-sim-storage",

      version: 12,

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
        if (version < 9) {
          const defaultMembers: Member[] = [
            { id: "player-1", name: "Angmar", level: 1, joined: new Date().toISOString().split("T")[0], points: 0, avatarColor: "bg-fire-500", isBanned: false, warnings: [], role: "administrator" as Role, ipHistory: ["192.168.1.1"] },
            { id: "player-2", name: "Shield", level: 1, joined: new Date().toISOString().split("T")[0], points: 0, avatarColor: "bg-info/50", isBanned: false, warnings: [], role: "moderator" as Role, ipHistory: ["192.168.1.2"] },
            { id: "player-3", name: "FoxFan", level: 1, joined: new Date().toISOString().split("T")[0], points: 0, avatarColor: "bg-success/50", isBanned: false, warnings: [], role: "player" as Role, ipHistory: ["192.168.1.3"] }
          ];

          state = {
            ...state,
            members: state.members && state.members.length > 0 ? state.members : defaultMembers
          };

          // Ensure Shield and FoxFan are present in the members array
          if (state.members) {
            if (!state.members.find(m => m.id === "player-2")) {
              state.members.push(defaultMembers[1]);
            }
            if (!state.members.find(m => m.id === "player-3")) {
              state.members.push(defaultMembers[2]);
            }
            // Ensure Angmar (player-1) has the correct admin role if they existed with 'player' role
            const angmar = state.members.find(m => m.id === "player-1");
            if (angmar && angmar.role !== "administrator") {
              angmar.role = "administrator" as Role;
            }
          }
        }

        if (version < 10) {
          if (state.members) {
            const angmar = state.members.find(m => m.id === "player-1");
            if (angmar) {
              angmar.role = "administrator" as Role;
            }
          }
        }

        if (version < 12) {
          if (state.members) {
            state = {
              ...state,
              members: state.members.map(m =>
                m.id === "player-1" ? { ...m, role: "administrator" as Role } : m
              )
            };
          }
        }

        return state;

      },

      partialize: (state) => state,

    },

  ),

);

