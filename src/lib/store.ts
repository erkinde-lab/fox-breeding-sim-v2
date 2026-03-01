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
  runHierarchicalShow,
  ShowReport,
  ShowLevel,
  Variety,
  ShowResult,
  Competitor,
  getFoxVariety,
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
    const stud = createFoundationalFox(npcSeededRandom, "Dog");
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
  reward: (state: any) => void;
  condition: (state: any) => boolean;
}
export interface ShowConfig {
  bis: number;
  first: number;
  second: number;
  third: number;
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
  whelpingReports: WhelpingReport[];
  pregnancyList: Pregnancy[];
  kennelCapacity: number;
  npcStuds: Record<string, Fox>;
  bisWins: number;
  bestDogWins: number;
  bestVixenWins: number;
  totalShowPoints: number;
  totalFoxesCount: number;
  forumCategories: ForumCategory[];
  forumPosts: ForumPost[];
  isAdmin: boolean;
  showConfig: Record<string, ShowConfig>;
  marketListings: MarketListing[];
  unlockedAchievements: string[];
  hiredGroomer: boolean;
  hiredVeterinarian: boolean;
  hiredTrainer: boolean;
  hiredGeneticist: boolean;
  hiredNutritionist: boolean;
  bannerUrl: string;
  bannerPosition: string;
  foundationFoxes: Fox[];
  soldFoundationalSlots: number[];
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
  applyItem: (itemId: string, foxId: string) => void;
  renameFox: (id: string, newName: string) => void;
  updateFox: (id: string, updates: Partial<Fox>) => void;
  spayNeuterFox: (id: string) => void;
  initializeGame: () => void;
  setBannerUrl: (url: string) => void;
  setBannerPosition: (pos: string) => void;
  toggleColorblindMode: (mode: string) => void;
  toggleHighContrast: () => void;
  setFontSize: (size: "small" | "normal" | "large" | "xl") => void;
  toggleOpenDyslexic: () => void;
  toggleReducedMotion: () => void;
  toggleAlwaysUnderlineLinks: () => void;
  toggleHighVisibilityFocus: () => void;
  toggleSimplifiedUI: () => void;
  setTextSpacing: (spacing: "normal" | "wide" | "extra") => void;
  toggleDarkMode: () => void;
  checkAdoptionReset: () => void;
  buyFoundationalFox: () => void;
  buyFoundationalFoxById: (slotIndex: number) => void;
  buyCustomFoundationalFox: (
    genotype: Genotype,
    gender: "Dog" | "Vixen",
    name?: string,
    eyeColor?: string,
  ) => void;
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
  adminAddCurrency: (gold: number, gems: number) => void;
  adminSetCurrency: (updates: { gold?: number; gems?: number }) => void;
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
      npcStuds: {},
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
        Pro: { bis: 2000, first: 1000, second: 500, third: 250 },
        Amateur: { bis: 1000, first: 500, second: 250, third: 125 },
        Altered: { bis: 1500, first: 750, second: 375, third: 185 },
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
      bannerPosition: "50% 50%",
      foundationFoxes: [],
      soldFoundationalSlots: [],
      lastAdoptionReset: new Date().toISOString(),
      members: [
        {
          id: "player-1",
          name: "Angmar",
          level: 10,
          joined: "2026-02-15",
          points: 1500,
          avatarColor: "bg-fire-500",
          isBanned: false,
          warnings: [],
        },
      ],
      adminLogs: [],
      isDarkMode: false,
      hasSeenTutorial: false,
      tutorialStep: 0,
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
      news: [
        {
          id: "1",
          date: "February 20, 2026",
          title: "Marketplace Beta Launch",
          content:
            "The player-to-player marketplace is now live! You can now list your foxes and items for sale in exchange for Gold or Gems.",
          category: "Update",
        },
      ],

      advanceTime: () =>
        set((state) => {
          const seasons: ("Spring" | "Summer" | "Autumn" | "Winter")[] = [
            "Spring",
            "Summer",
            "Autumn",
            "Winter",
          ];
          const currentIdx = seasons.indexOf(state.season);
          const nextIdx = (currentIdx + 1) % 4;
          const nextSeason = seasons[nextIdx];
          const nextYear = nextIdx === 0 ? state.year + 1 : state.year;

          const updatedFoxes = { ...state.foxes };
          Object.keys(updatedFoxes).forEach((id) => {
            const fox = updatedFoxes[id];
            if (nextIdx === 0) {
              fox.age += 1;
              fox.pointsYear = 0;
            }
          });

          const newWhelpingReports: WhelpingReport[] = [];
          const nextPregnancyList = state.pregnancyList.filter((preg) => {
            if (preg.dueYear === nextYear && preg.dueSeason === nextSeason) {
              const mother = updatedFoxes[preg.motherId];
              if (mother) {
                const litterSize = Math.floor(Math.random() * 4) + 1;
                const kits: Fox[] = [];
                for (let i = 0; i < litterSize; i++) {
                  const kitGenotype = breed(mother.genotype, preg.fatherGenotype);
                  const kit = createFox({
                    genotype: kitGenotype,
                    gender: Math.random() > 0.5 ? "Dog" : "Vixen"
                  });
                  updatedFoxes[kit.id] = kit;
                  kits.push(kit);
                }
                newWhelpingReports.push({
                  motherName: mother.name,
                  fatherName: preg.fatherName,
                  kits: kits.map((k) => ({
                    name: k.name,
                    phenotype: k.phenotype,
                    baseColor: k.baseColor,
                    pattern: k.pattern,
                    eyeColor: k.eyeColor,
                    isStillborn: k.isStillborn || false,
                  })),
                });
              }
              return false;
            }
            return true;
          });

          return {
            season: nextSeason,
            year: nextYear,
            foxes: updatedFoxes,
            pregnancyList: nextPregnancyList,
            whelpingReports: [
              ...newWhelpingReports,
              ...state.whelpingReports,
            ].slice(0, 10),
            npcStuds: generateNPCStuds(nextYear, nextSeason),
            shows: [],
          };
        }),

      breedFoxes: (dogId, vixenId) =>
        set((state) => {
          const dog = state.foxes[dogId] || state.npcStuds[dogId];
          const vixen = state.foxes[vixenId];
          if (!dog || !vixen) return state;

          const seasons: ("Spring" | "Summer" | "Autumn" | "Winter")[] = [
            "Spring",
            "Summer",
            "Autumn",
            "Winter",
          ];
          const currentIdx = seasons.indexOf(state.season);
          const dueIdx = (currentIdx + 1) % 4;
          const dueSeason = seasons[dueIdx];
          const dueYear = dueIdx === 0 ? state.year + 1 : state.year;

          if (dog.isNPC) {
            if (state.gold < (dog.studFee || 0)) return state;
          }

          return {
            gold: dog.isNPC ? state.gold - (dog.studFee || 0) : state.gold,
            pregnancyList: [
              ...state.pregnancyList,
              {
                motherId: vixenId,
                fatherId: dogId,
                fatherName: dog.name,
                fatherGenotype: dog.genotype,
                fatherStats: dog.stats,
                fatherSilverIntensity: dog.silverIntensity,
                dueYear,
                dueSeason,
              },
            ],
          };
        }),

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      addFox: (fox) =>
        set((state) => ({ foxes: { ...state.foxes, [fox.id]: fox } })),
      sellFox: (id) =>
        set((state) => {
          const { [id]: _, ...remainingFoxes } = state.foxes;
          return { foxes: remainingFoxes, gold: state.gold + 500 };
        }),
      retireFox: (id) =>
        set((state) => ({
          foxes: { ...state.foxes, [id]: { ...state.foxes[id], isRetired: true } },
        })),
      buyItem: (itemId, price, currency, quantity = 1) =>
        set((state) => {
          const totalCost = price * quantity;
          if (currency === "gold" && state.gold < totalCost) return state;
          if (currency === "gems" && state.gems < totalCost) return state;

          return {
            gold: currency === "gold" ? state.gold - totalCost : state.gold,
            gems: currency === "gems" ? state.gems - totalCost : state.gems,
            inventory: {
              ...state.inventory,
              [itemId]: (state.inventory[itemId] || 0) + quantity,
            },
          };
        }),
      applyItem: (itemId, foxId) =>
        set((state) => {
          if (!state.inventory[itemId] || state.inventory[itemId] <= 0)
            return state;
          const fox = state.foxes[foxId];
          if (!fox) return state;

          const updatedFox = { ...fox };
          if (itemId === "gene_test") updatedFox.genotypeRevealed = true;
          if (itemId === "stat_boost") {
            Object.keys(updatedFox.stats).forEach((k) => {
              updatedFox.stats[k as keyof Stats] = Math.min(
                100,
                updatedFox.stats[k as keyof Stats] + 5,
              );
            });
          }

          return {
            inventory: {
              ...state.inventory,
              [itemId]: state.inventory[itemId] - 1,
            },
            foxes: { ...state.foxes, [foxId]: updatedFox },
          };
        }),
      renameFox: (id, newName) =>
        set((state) => ({
          foxes: { ...state.foxes, [id]: { ...state.foxes[id], name: newName } },
        })),
      updateFox: (id, updates) =>
        set((state) => ({
          foxes: { ...state.foxes, [id]: { ...state.foxes[id], ...updates } },
        })),
      spayNeuterFox: (id) =>
        set((state) => ({
          foxes: { ...state.foxes, [id]: { ...state.foxes[id], isAltered: true } },
        })),

      initializeGame: () => {
        const { foxes } = get();
        if (Object.keys(foxes).length === 0) {
          set({
            gold: 10000,
            gems: 100,
            foxes: {},
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
              },
            ],
          });
        }
      },

      setBannerUrl: (url) => set({ bannerUrl: url }),
      setBannerPosition: (pos) => set({ bannerPosition: pos }),

      checkAdoptionReset: () => {
        const { lastAdoptionReset } = get();
        const lastReset = new Date(lastAdoptionReset);
        const now = new Date();
        if (now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000) {
          set({
            foundationFoxes: createFoundationFoxCollection(),
            soldFoundationalSlots: [],
            lastAdoptionReset: now.toISOString(),
          });
        } else if (get().foundationFoxes.length === 0) {
          set({
            foundationFoxes: createFoundationFoxCollection(),
          });
        }
      },

      buyFoundationalFox: () => {
        const { gold, foundationFoxes, soldFoundationalSlots } = get();
        if (gold < 1000) return;
        const availableSlots = foundationFoxes
          .map((_, i) => i)
          .filter((i) => !soldFoundationalSlots.includes(i));
        if (availableSlots.length === 0) return;

        const randomSlot =
          availableSlots[Math.floor(Math.random() * availableSlots.length)];
        const fox = foundationFoxes[randomSlot];

        set((state) => ({
          gold: state.gold - 1000,
          foxes: { ...state.foxes, [fox.id]: fox },
          soldFoundationalSlots: [...state.soldFoundationalSlots, randomSlot],
        }));
      },

      buyFoundationalFoxById: (slotIndex) => {
        const { gold, foundationFoxes, soldFoundationalSlots } = get();
        if (gold < 1500 || soldFoundationalSlots.includes(slotIndex)) return;

        const fox = foundationFoxes[slotIndex];
        set((state) => ({
          gold: state.gold - 1500,
          foxes: { ...state.foxes, [fox.id]: fox },
          soldFoundationalSlots: [...state.soldFoundationalSlots, slotIndex],
        }));
      },

      buyCustomFoundationalFox: (genotype, gender, name, eyeColor) => {
        const { gems } = get();
        if (gems < 50) return;

        const fox = createFox({
          name: name || getPhenotype(genotype).name,
          gender,
          genotype,
          eyeColor,
        });

        set((state) => ({
          gems: state.gems - 50,
          foxes: { ...state.foxes, [fox.id]: fox },
        }));
      },

      expandKennel: () =>
        set((state) => {
          if (state.gold < 5000) return state;
          return {
            gold: state.gold - 5000,
            kennelCapacity: state.kennelCapacity + 5,
          };
        }),

      generateSeasonalShows: () =>
        set((state) => {
          const varieties: Variety[] = [
            "Red",
            "Gold",
            "Silver",
            "Cross",
            "Exotic",
            "White Mark",
          ];
          const levels: ShowLevel[] = ["Open", "Amateur Open", "Altered Open"];
          const midweekShows: Show[] = [];
          const weekendShows: Show[] = [];

          varieties.forEach((v) => {
            levels.forEach((l) => {
              midweekShows.push({
                id: `mid-${v}-${l}-${Math.random().toString(36).substr(2, 5)}`,
                name: `${l} ${v} Show`,
                level: l,
                type: v,
                entries: [],
                isRun: false,
                isWeekend: false,
              });
            });
          });

          if (state.season === "Autumn" || state.season === "Winter") {
            varieties.forEach((v) => {
              weekendShows.push({
                id: `wknd-${v}-Junior-${Math.random()
                  .toString(36)
                  .substr(2, 5)}`,
                name: `Junior ${v} National`,
                level: "Junior",
                type: v,
                entries: [],
                isRun: false,
                isWeekend: true,
              });
            });
          } else {
            varieties.forEach((v) => {
              weekendShows.push({
                id: `wknd-${v}-Championship-${Math.random()
                  .toString(36)
                  .substr(2, 5)}`,
                name: `${v} Championship`,
                level: "Championship",
                type: v,
                entries: [],
                isRun: false,
                isWeekend: true,
              });
            });
          }
          return { shows: [...midweekShows, ...weekendShows] };
        }),

      enterFoxInShow: (foxId, showId) =>
        set((state) => {
          const show = state.shows.find((s) => s.id === showId);
          if (!show) return state;
          if (show.level === "Championship") {
            const fox = state.foxes[foxId];
            if (!fox) return state;
            const pointsThisYear = fox.pointsYear || 0;
            const hasQualifiedWin =
              (fox.bisWins || 0) > 0 ||
              state.showReports.some(
                (r) =>
                  (r.bisFoxId === foxId || r.rbisFoxId === foxId) &&
                  r.year === state.year,
              );
            if (pointsThisYear < 16 && !hasQualifiedWin) return state;
          }
          return {
            shows: state.shows.map((s) =>
              s.id === showId
                ? {
                    ...s,
                    entries: s.entries.includes(foxId)
                      ? s.entries.filter((id) => id !== foxId)
                      : [...s.entries, foxId],
                  }
                : s,
            ),
          };
        }),

      addShow: (show) => set((state) => ({ shows: [show, ...state.shows] })),
      removeShow: (showId) =>
        set((state) => ({ shows: state.shows.filter((s) => s.id !== showId) })),
      updateShow: (showId, updates) =>
        set((state) => ({
          shows: state.shows.map((s) =>
            s.id === showId ? { ...s, ...updates } : s,
          ),
        })),

      runShows: () => {
        const {
          foxes,
          shows,
          year,
          season,
          showConfig,
          hiredGroomer,
          hiredTrainer,
          hiredVeterinarian,
        } = get();
        const circuits: ("Pro" | "Amateur" | "Altered")[] = [
          "Pro",
          "Amateur",
          "Altered",
        ];
        const newShowReports: ShowReport[] = [];
        let newGold = get().gold;
        const updatedFoxes = { ...foxes };

        [false, true].forEach((isWeekend) => {
          circuits.forEach((circuit) => {
            const circuitShows = shows.filter((s) => {
              if (s.isWeekend !== isWeekend) return false;
              if (circuit === "Amateur") return s.level.startsWith("Amateur");
              if (circuit === "Altered") return s.level.startsWith("Altered");
              return (
                !s.level.startsWith("Amateur") && !s.level.startsWith("Altered")
              );
            });

            const entriesByFox = new Map<string, Variety>();
            circuitShows.forEach((s) => {
              s.entries.forEach((id) => {
                entriesByFox.set(id, s.type);
              });
            });

            if (entriesByFox.size === 0) return;

            const competitors: Competitor[] = Array.from(entriesByFox.keys())
              .map((id) => {
                const f = updatedFoxes[id];
                if (!f) return null;
                const variety = entriesByFox.get(id)!;
                const show = circuitShows.find((s) => s.entries.includes(id));
                const isNewborn =
                  f.age === 0 && (season === "Spring" || season === "Summer");
                const isJuvenile = f.age === 0 && !isNewborn;
                return {
                  fox: f,
                  variety,
                  level: show?.level || "Open",
                  gender: f.gender,
                  ageGroup: isJuvenile ? "Juvenile" : "Adult",
                  currentScore: 0,
                  currentBreakdown: {} as any,
                };
              })
              .filter(Boolean) as Competitor[];

            if (competitors.length === 0) return;

            const report = runHierarchicalShow(
              circuit,
              competitors,
              year,
              season,
              hiredGroomer,
              hiredTrainer,
              hiredVeterinarian,
            );

            newShowReports.push(report);

            report.results.forEach((res) => {
              const fox = updatedFoxes[res.foxId];
              if (fox) {
                fox.pointsYear += res.pointsAwarded;
                fox.pointsLifetime += res.pointsAwarded;
                if (res.isMajor) fox.majors = (fox.majors || 0) + 1;
                if (res.title === "BIS") {
                  fox.bisWins = (fox.bisWins || 0) + 1;
                  newGold += showConfig[res.level]?.bis || 1000;
                }
                if (res.title === "BOV")
                  newGold += showConfig[res.level]?.first || 500;
              }
            });
          });
        });

        set({
          foxes: updatedFoxes,
          gold: newGold,
          showReports: [...newShowReports, ...get().showReports].slice(0, 20),
          shows: shows.map((s) => ({ ...s, entries: [], isRun: true })),
        });
        get().checkAchievements();
      },

      addAdminLog: (action, details) =>
        set((state) => ({
          adminLogs: [
            {
              id: Math.random().toString(36).substring(2, 9),
              action,
              details,
              timestamp: new Date().toISOString(),
            },
            ...state.adminLogs,
          ].slice(0, 50),
        })),
      adminUpdateFoxStats: (foxId, statsUpdates) => {
        const { foxes } = get();
        if (!foxes[foxId]) return;
        set((state) => ({
          foxes: {
            ...state.foxes,
            [foxId]: {
              ...state.foxes[foxId],
              stats: { ...state.foxes[foxId].stats, ...statsUpdates },
            },
          },
        }));
        get().addAdminLog(
          "Update Fox Stats",
          `Updated stats for fox ${foxes[foxId].name} (${foxId})`,
        );
      },
      toggleAdminMode: () => set((state) => ({ isAdmin: !state.isAdmin })),
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
          return { gems: state.gems - 100, hiredGeneticist: true };
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
      version: 7,
      migrate: (persistedState: unknown, version: number) => {
        let state = persistedState as any;
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
        return state;
      },
      partialize: (state) => state,
    },
  ),
);
