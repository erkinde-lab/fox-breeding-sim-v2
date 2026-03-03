"use client";
import { appendHistory } from "./history-utils";

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

  while (Object.keys(nextNpcStuds).length < 6) {
    const stud = createFoundationalFox(npcSeededRandom, "Dog");
    if (usedPhenotypes.has(stud.phenotype)) continue;

    usedPhenotypes.add(stud.phenotype);
    stud.isNPC = true;
    stud.genotypeRevealed = true;
    stud.id = `npc-${stud.phenotype.replace(/\s+/g, "-").toLowerCase()}-${totalSeasonNumber}`;
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
  reward: () => void;
  condition: (state: GameState) => boolean;
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
  colorblindMode: boolean;
  highContrast: boolean;
  fontSize: "small" | "normal" | "large" | "xl";
  useOpenDyslexic: boolean;
  reducedMotion: boolean;
  alwaysUnderlineLinks: boolean;
  highVisibilityFocus: boolean;
  simplifiedUI: boolean;
  textSpacing: "normal" | "wide" | "extra";

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
  toggleColorblindMode: () => void;
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
  addForumPost: (
    categoryId: string,
    title: string,
    content: string,
    author: string,
  ) => void;
  addForumReply: (postId: string, author: string, content: string) => void;
  togglePinPost: (postId: string) => void;
  addForumCategory: (name: string, description: string, icon: string) => void;
  updateShowConfig: (level: string, updates: Partial<ShowConfig>) => void;
  listFoxOnMarket: (
    foxId: string,
    price: number,
    currency: "gold" | "gems",
  ) => void;
  listItemOnMarket: (
    itemId: string,
    price: number,
    currency: "gold" | "gems",
  ) => void;
  cancelListing: (listingId: string) => void;
  updateMarketListing: (
    listingId: string,
    updates: Partial<MarketListing>,
  ) => void;
  buyFromMarket: (listingId: string) => void;
  checkAchievements: () => void;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-fox",
    name: "First Fox",
    description: "Adopt your first foundational fox.",
    rewardText: "1,000 Gold",
    reward: () => useGameStore.getState().addGold(1000),
    condition: (state) => Object.keys(state.foxes).length >= 1,
  },
  {
    id: "master-breeder",
    name: "Master Breeder",
    description: "Have 5 foxes in your kennel.",
    rewardText: "50 Gems",
    reward: () => useGameStore.getState().addGems(50),
    condition: (state) => Object.keys(state.foxes).length >= 5,
  },
  {
    id: "show-winner",
    name: "Show Winner",
    description: "Win a Best in Show award.",
    rewardText: "5,000 Gold",
    reward: () => useGameStore.getState().addGold(5000),
    condition: (state) => state.bisWins >= 1,
  },
  {
    id: "millionaire",
    name: "Gold Rush",
    description: "Accumulate 50,000 Gold.",
    rewardText: "100 Gems",
    reward: () => useGameStore.getState().addGems(100),
    condition: (state) => state.gold >= 50000,
  },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      foxes: {},
      gold: 10000,
      gems: 100,
      year: 1,
      joiningYear: 1,
      season: "Spring",
      inventory: { supplies: 5, "genetic-test": 2, "pedigree-analysis": 2 },
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
          id: "staff",
          name: "Staff Announcements & Feedback",
          description: "Official news and feedback from the development team.",
          icon: "Megaphone",
        },
        {
          id: "general",
          name: "General Discussion",
          description: "Talk about anything fox-related!",
          icon: "MessageSquare",
        },
        {
          id: "breeding",
          name: "Breeding Tips",
          description: "Share your genetic discoveries.",
          icon: "Heart",
        },
        {
          id: "shows",
          name: "Show Results",
          description: "Celebrate your wins!",
          icon: "Trophy",
        },
        {
          id: "market",
          name: "Trading",
          description: "Buy, sell, and trade foxes.",
          icon: "Store",
        },
      ],
      forumPosts: [],
      isAdmin: false,
      showConfig: {
        "Amateur Junior": { bis: 1000, first: 500, second: 250, third: 100 },
        "Amateur Open": { bis: 2500, first: 1000, second: 500, third: 250 },
        "Amateur Senior": { bis: 5000, first: 2500, second: 1000, third: 500 },
        "Altered Junior": { bis: 1000, first: 500, second: 250, third: 100 },
        "Altered Open": { bis: 2500, first: 1000, second: 500, third: 250 },
        "Altered Senior": { bis: 5000, first: 2500, second: 1000, third: 500 },
        Junior: { bis: 1000, first: 500, second: 250, third: 100 },
        Open: { bis: 2500, first: 1000, second: 500, third: 250 },
        Senior: { bis: 5000, first: 2500, second: 1000, third: 500 },
        Championship: { bis: 10000, first: 5000, second: 2500, third: 1000 },
      },
      marketListings: [],
      unlockedAchievements: [],
      hiredGroomer: false,
      hiredVeterinarian: false,
      hiredTrainer: false,
      hiredGeneticist: false,
      hiredNutritionist: false,
      bannerUrl:
        "https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      bannerPosition: "50%",
      foundationFoxes: [],
      soldFoundationalSlots: [],
      lastAdoptionReset: "",
      members: [],
      adminLogs: [],
      hasSeenTutorial: false,
      tutorialStep: null,
      colorblindMode: false,
      highContrast: false,
      fontSize: "normal",
      useOpenDyslexic: false,
      reducedMotion: false,
      alwaysUnderlineLinks: false,
      highVisibilityFocus: false,
      simplifiedUI: false,
      textSpacing: "normal",
      isDarkMode: false,

      checkAchievements: () => {
        const state = get();
        const updatedFoxes = { ...state.foxes };
        let changed = false;
        Object.values(updatedFoxes).forEach((fox) => {
          const isAltered = !!fox.isAltered;
          let newTitle = fox.prefixTitle;
          const majors = fox.majors || 0;
          if (majors >= 4) newTitle = isAltered ? "DAGCH" : "DGCH";
          else if (majors >= 2) newTitle = isAltered ? "AGCH" : "GCH";
          else if (majors >= 1) newTitle = isAltered ? "ACH" : "CH";
          if (newTitle !== fox.prefixTitle) {
            fox.prefixTitle = newTitle;
            changed = true;
          }
        });
        if (changed) set({ foxes: updatedFoxes });
        ACHIEVEMENTS.forEach((ach) => {
          if (
            !state.unlockedAchievements.includes(ach.id) &&
            ach.condition(state)
          ) {
            ach.reward();
            set((s) => ({
              unlockedAchievements: [...s.unlockedAchievements, ach.id],
            }));
          }
        });
      },

      advanceTime: () => {
        set((state) => {
          const seasons: ("Spring" | "Summer" | "Autumn" | "Winter")[] = [
            "Spring",
            "Summer",
            "Autumn",
            "Winter",
          ];
          const currentIndex = seasons.indexOf(state.season);
          const nextIndex = (currentIndex + 1) % 4;
          const nextSeason = seasons[nextIndex];
          const nextYear = nextIndex === 0 ? state.year + 1 : state.year;
          const updatedFoxes = { ...state.foxes };
          let whelpingReports: WhelpingReport[] = [];
          let nextPregnancyList: Pregnancy[] = [];
          Object.keys(updatedFoxes).forEach((id) => {
            updatedFoxes[id].lastFed = undefined;
            updatedFoxes[id].lastGroomed = undefined;
            updatedFoxes[id].lastTrained = undefined;
          });
          if (nextIndex === 0) {
            Object.keys(updatedFoxes).forEach((id) => {
              updatedFoxes[id].age += 1;
              updatedFoxes[id].pointsYear = 0;
              updatedFoxes[id] = appendHistory(updatedFoxes[id], nextYear, "Spring", `Aged to ${updatedFoxes[id].age} years old.`, "life");
              if (updatedFoxes[id].age >= 10 && !updatedFoxes[id].isRetired) {
                updatedFoxes[id].isRetired = true;
                updatedFoxes[id] = appendHistory(updatedFoxes[id], nextYear, "Spring", "Retired from active showing and breeding.", "life");
              }
            });
          }
          let kitsCreatedThisTurn = 0;
          if (nextSeason === "Spring" && state.pregnancyList.length > 0) {
            state.pregnancyList.forEach((preg) => {
              const mother = state.foxes[preg.motherId];
              let kits: {
                name: string;
                phenotype: string;
                baseColor: string;
                pattern: string;
                eyeColor: string;
                isStillborn: boolean;
              }[] = [];
              if (!mother) return;
              const kitCount =
                (typeof window !== "undefined"
                  ? Math.floor(Math.random() * 4)
                  : 3) + 2;
              for (let i = 0; i < kitCount; i++) {
                const kitGenotype = breed(mother.genotype, preg.fatherGenotype);
                const kitPhenotype = getPhenotype(
                  kitGenotype,
                  calculateSilverIntensity(
                    mother.silverIntensity,
                    preg.fatherSilverIntensity,
                  ),
                );
                if (kitPhenotype.isLethal) {
                  kits.push({
                    name: "Stillborn Fox",
                    phenotype: "Stillborn",
                    baseColor: "-",
                    pattern: "-",
                    eyeColor: "-",
                    isStillborn: true,
                  });
                } else {
                  const kitCOI = calculateCOI(
                    preg.fatherId,
                    updatedFoxes,
                    preg.motherId,
                  );
                  const kitStats = generateStats(
                    mother.stats,
                    preg.fatherStats,
                    kitCOI,
                  );
                  const kit = createFox({
                    id: (
                      state.totalFoxesCount +
                      kitsCreatedThisTurn +
                      1
                    ).toString(),
                    parents: [preg.motherId, preg.fatherId],
                    parentNames: [mother.name, preg.fatherName],
                    genotype: kitGenotype,
                    stats: kitStats,
                    coi: kitCOI,
                    silverIntensity: calculateSilverIntensity(
                      mother.silverIntensity,
                      preg.fatherSilverIntensity,
                    ),
                    age: 0,
                    birthYear: nextYear,
                    history: [
                      {
                        year: nextYear,
                        season: "Spring",
                        event: `Born to ${mother.name} and ${preg.fatherName} (COI: ${kitCOI}%).`,
                        type: "life",
                      },
                    ],
                  });
                  kitsCreatedThisTurn++;
                  if (state.hiredGeneticist) kit.genotypeRevealed = true;
                  updatedFoxes[kit.id] = kit;
                  kits.push({
                    name: kit.name,
                    phenotype: kit.phenotype,
                    baseColor: kit.baseColor,
                    pattern: kit.pattern,
                    eyeColor: kit.eyeColor,
                    isStillborn: false,
                  });
                }
              }
              updatedFoxes[preg.motherId] = appendHistory(updatedFoxes[preg.motherId], nextYear, "Spring", `Produced a litter of ${kits.length} kit(s) with ${preg.fatherName}.`, "breeding");
              const father = updatedFoxes[preg.fatherId] || state.npcStuds[preg.fatherId];
              if (father && !father.isNPC) {
                updatedFoxes[preg.fatherId] = appendHistory(updatedFoxes[preg.fatherId], nextYear, "Spring", `Sired a litter of ${kits.length} kit(s) with ${mother.name}.`, "breeding");
              }

              whelpingReports.push({
                motherName: mother.name,
                fatherName: preg.fatherName,
                kits,
              });
            });
          } else {
            nextPregnancyList.push(...state.pregnancyList);
          }
          return {
            season: nextSeason,
            year: nextYear,
            foxes: updatedFoxes,
            totalFoxesCount: state.totalFoxesCount + kitsCreatedThisTurn,
            whelpingReports: [
              ...whelpingReports,
              ...state.whelpingReports,
            ].slice(0, 10),
            pregnancyList: nextPregnancyList,
            npcStuds:
              nextSeason === "Spring"
                ? generateNPCStuds(nextYear, nextSeason)
                : state.npcStuds,
          };
        });
        get().generateSeasonalShows();
      },

      breedFoxes: (dogId, vixenId) => {
        const { foxes, npcStuds, season, pregnancyList } = get();
        const dog = foxes[dogId] || npcStuds[dogId];
        const vixen = foxes[vixenId];
        if (!dog || !vixen || season !== "Winter") return;
        if (
          dog.gender !== "Dog" ||
          vixen.gender !== "Vixen" ||
          dog.isAltered ||
          vixen.isAltered ||
          dog.age < 2 ||
          vixen.age < 2 ||
          dog.isRetired ||
          vixen.isRetired
        )
          return;
        if (pregnancyList.some((p) => p.motherId === vixenId)) return;
        set((state) => ({
          pregnancyList: [
            ...state.pregnancyList,
            {
              motherId: vixenId,
              fatherId: dogId,
              fatherName: dog.name,
              fatherGenotype: dog.genotype,
              fatherStats: dog.stats,
              fatherSilverIntensity: dog.silverIntensity,
              dueYear: state.year + 1,
              dueSeason: "Spring",
            },
          ],
        }));
      },

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      addFox: (fox) =>
        set((state) => ({
          foxes: {
            ...state.foxes,
            [fox.id]: state.hiredGeneticist
              ? { ...fox, genotypeRevealed: true }
              : fox,
          },
        })),
      retireFox: (id) =>
        set((state) => ({
          foxes: {
            ...state.foxes,
            [id]: { ...state.foxes[id], isRetired: true },
          },
        })),
      sellFox: (id) =>
        set((state) => {
          const fox = state.foxes[id];
          if (fox && fox.age < 6) return state;
          const newFoxes = { ...state.foxes };
          delete newFoxes[id];
          return { foxes: newFoxes, gold: state.gold + 500 };
        }),

      buyItem: (itemId, price, currency, quantity = 1) =>
        set((state) => {
          if (currency === "gold" && state.gold < price) return state;
          if (currency === "gems" && state.gems < price) return state;
          return {
            gold: currency === "gold" ? state.gold - price : state.gold,
            gems: currency === "gems" ? state.gems - price : state.gems,
            inventory: {
              ...state.inventory,
              [itemId]: (state.inventory[itemId] || 0) + quantity,
            },
          };
        }),

      applyItem: (itemId, foxId) =>
        set((state) => {
          const fox = state.foxes[foxId];
          if (!fox) return state;
          const newFox = { ...fox };
          const newInventory = { ...state.inventory };
          const newFoodUses = { ...state.foodUses };
          if (
            itemId === "supplies" ||
            itemId === "standard-feed" ||
            itemId.startsWith("feed-")
          ) {
            let uses = newFoodUses[itemId] || 0;
            if (uses <= 0) {
              if (!newInventory[itemId] || newInventory[itemId] <= 0)
                return state;
              newInventory[itemId]--;
              uses =
                itemId === "supplies" ? 8 : itemId === "standard-feed" ? 4 : 5;
            }
            newFoodUses[itemId] = uses - 1;
            if (itemId === "supplies" || itemId === "standard-feed")
              newFox.lastFed = Date.now();
            else {
              const statKey = itemId.replace("feed-", "") as keyof Stats;
              newFox.stats = {
                ...newFox.stats,
                [statKey]: Math.min(100, (newFox.stats[statKey] || 0) + 2),
              };
              newFox.lastFed = Date.now();
            }
          } else {
            if (!newInventory[itemId] || newInventory[itemId] <= 0)
              return state;
            if (itemId === "genetic-test") newFox.genotypeRevealed = true;
            if (itemId === "pedigree-analysis") newFox.pedigreeAnalyzed = true;
            newInventory[itemId]--;
          }
          return {
            inventory: newInventory,
            foodUses: newFoodUses,
            foxes: { ...state.foxes, [foxId]: newFox },
          };
        }),

      setTutorialStep: (step) => set({ tutorialStep: step }),
      completeTutorial: () =>
        set({ hasSeenTutorial: true, tutorialStep: null }),
      renameFox: (id, newName) =>
        set((state) => {
          const allFoxes = [
            ...Object.values(state.foxes),
            ...Object.values(state.npcStuds),
            ...state.foundationFoxes,
          ];
          if (
            allFoxes.some(
              (f) =>
                f.id !== id && f.name.toLowerCase() === newName.toLowerCase(),
            )
          )
            return state;
          const fox = state.foxes[id];
          const oldName = fox.name;
          return {
            foxes: {
              ...state.foxes,
              [id]: {
                ...fox,
                name: newName,
                hasBeenRenamed: true,
                history: appendHistory(fox, state.year, state.season, `Renamed from ${oldName} to ${newName}.`, "life").history,
              },
            },
          };
        }),
      updateFox: (id, updates) =>
        set((state) => ({
          foxes: { ...state.foxes, [id]: { ...state.foxes[id], ...updates } },
        })),
      spayNeuterFox: (id) =>
        set((state) => {
          const fox = state.foxes[id];
          if (!fox || fox.isAltered || fox.isRetired) return state;
          return {
            foxes: {
              ...state.foxes,
              [id]: { ...fox, isAltered: true, isAtStud: false },
            },
          };
        }),

      checkAdoptionReset: () => {
        const now = new Date().toISOString().slice(0, 13);
        const state = get();
        if (state.lastAdoptionReset !== now) {
          let seedVal = now.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
          const seededRandom = () => {
            const x = Math.sin(seedVal++) * 10000;
            return x - Math.floor(x);
          };
          set({
            foundationFoxes: createFoundationFoxCollection(seededRandom),
            soldFoundationalSlots: [],
            lastAdoptionReset: now,
          });
        }
      },

      initializeGame: () => {
        const currentShows = get().shows;
        if (currentShows.length === 0) get().generateSeasonalShows();
        const { year, season, foxes } = get();
        set({ npcStuds: generateNPCStuds(year, season) });
        const migratedFoxes = { ...foxes };
        let needsMigration = false;
        Object.keys(migratedFoxes).forEach((id) => {
          if (!migratedFoxes[id].parentNames) {
            migratedFoxes[id].parentNames = [null, null];
            needsMigration = true;
          }
          if (!migratedFoxes[id].history) {
            migratedFoxes[id].history = [];
            needsMigration = true;
          }
          if (
            !migratedFoxes[id].hasBeenRenamed &&
            migratedFoxes[id].name !== migratedFoxes[id].phenotype
          ) {
            migratedFoxes[id].hasBeenRenamed = true;
            needsMigration = true;
          }
        });
        if (needsMigration) set({ foxes: migratedFoxes });
        if (get().hiredGeneticist) {
          const updated = { ...get().foxes };
          Object.keys(updated).forEach((id) => {
            updated[id].genotypeRevealed = true;
          });
          set({ foxes: updated });
        }
        get().checkAdoptionReset();
        if (get().members.length === 0) {
          set({
            gold: 10000,
            gems: 100,
            totalFoxesCount: 0,
            hasSeenTutorial: false,
            tutorialStep: 0,
            members: [
              {
                id: "1",
                name: "RedFoxMaster",
                level: 45,
                joined: "Spring, Year 1",
                points: 12500,
                avatarColor: "bg-orange-500",
                isBanned: false,
                warnings: [],
              },
              {
                id: "2",
                name: "SilverVixen",
                level: 38,
                joined: "Summer, Year 1",
                points: 9800,
                avatarColor: "bg-slate-400",
                isBanned: false,
                warnings: [],
              },
              {
                id: "3",
                name: "ArcticBreeder",
                level: 32,
                joined: "Autumn, Year 1",
                points: 7200,
                avatarColor: "bg-blue-100",
                isBanned: false,
                warnings: [],
              },
              {
                id: "4",
                name: "CrossFoxExpert",
                level: 29,
                joined: "Winter, Year 1",
                points: 6500,
                avatarColor: "bg-amber-700",
                isBanned: false,
                warnings: [],
              },
              {
                id: "5",
                name: "GeneticsGuru",
                level: 25,
                joined: "Spring, Year 2",
                points: 5100,
                avatarColor: "bg-purple-500",
                isBanned: false,
                warnings: [],
              },
            ],
          });
          if (year === 1 && season === "Spring") get().advanceTime();
        }
      },

      buyFoundationalFox: () =>
        set((state) => {
          if (state.gold < 1000) return state;
          const fox = createFoundationalFox();
          fox.id = (state.totalFoxesCount + 1).toString();
          return {
            gold: state.gold - 1000,
            totalFoxesCount: state.totalFoxesCount + 1,
            foxes: {
              ...state.foxes,
              [fox.id]: state.hiredGeneticist
                ? { ...fox, genotypeRevealed: true }
                : fox,
            },
          };
        }),
      buyFoundationalFoxById: (slotIndex) =>
        set((state) => {
          if (
            state.gold < 1000 ||
            state.soldFoundationalSlots.includes(slotIndex)
          )
            return state;
          const fox = state.foundationFoxes[slotIndex];
          if (!fox) return state;
          const newFox = { ...fox, id: (state.totalFoxesCount + 1).toString() };
          return {
            gold: state.gold - 1000,
            totalFoxesCount: state.totalFoxesCount + 1,
            foxes: {
              ...state.foxes,
              [newFox.id]: state.hiredGeneticist
                ? { ...newFox, genotypeRevealed: true }
                : newFox,
            },
            soldFoundationalSlots: [...state.soldFoundationalSlots, slotIndex],
          };
        }),
      buyCustomFoundationalFox: (genotype, gender, name, eyeColor) =>
        set((state) => {
          if (state.gems < 50) return state;
          const fox = createFox({
            id: (state.totalFoxesCount + 1).toString(),
            name: name || "Custom Foundational",
            genotype,
            gender,
            eyeColor,
            parents: [null, null],
            coi: 0,
            pedigreeAnalyzed: true,
            hasBeenRenamed: !!name,
            stats: {
              head: 25,
              topline: 25,
              forequarters: 25,
              hindquarters: 25,
              tail: 25,
              coatQuality: 25,
              temperament: 25,
              presence: 25,
              luck: 25,
              fertility: 50,
            },
          });
          return {
            gems: state.gems - 50,
            totalFoxesCount: state.totalFoxesCount + 1,
            foxes: {
              ...state.foxes,
              [fox.id]: state.hiredGeneticist
                ? { ...fox, genotypeRevealed: true }
                : fox,
            },
          };
        }),
      expandKennel: () =>
        set((state) => {
          if (state.gold < 5000) return state;
          return {
            gold: state.gold - 5000,
            kennelCapacity: state.kennelCapacity + 5,
          };
        }),
      toggleStudStatus: (foxId, fee) =>
        set((state) => {
          const fox = state.foxes[foxId];
          if (!fox || fox.gender !== "Dog" || fox.age < 2) return state;
          return {
            foxes: {
              ...state.foxes,
              [foxId]: { ...fox, isAtStud: !fox.isAtStud, studFee: fee },
            },
          };
        }),

      hireGroomer: () =>
        set((state) => {
          if (state.gems < 20) return state;
          return { gems: state.gems - 20, hiredGroomer: true };
        }),
      hireVeterinarian: () =>
        set((state) => {
          if (state.gems < 50) return state;
          return { gems: state.gems - 50, hiredVeterinarian: true };
        }),
      hireTrainer: () =>
        set((state) => {
          if (state.gems < 40) return state;
          return { gems: state.gems - 40, hiredTrainer: true };
        }),
      hireGeneticist: () =>
        set((state) => {
          if (state.gems < 100) return state;
          const updated = { ...state.foxes };
          Object.keys(updated).forEach((id) => {
            updated[id].genotypeRevealed = true;
          });
          return {
            gems: state.gems - 100,
            hiredGeneticist: true,
            foxes: updated,
          };
        }),
      hireNutritionist: () =>
        set((state) => {
          if (state.gems < 75) return state;
          return { gems: state.gems - 75, hiredNutritionist: true };
        }),
      setBannerUrl: (url: string) => set({ bannerUrl: url }),
      setBannerPosition: (pos: string) => set({ bannerPosition: pos }),
      setFoxPreferredFeed: (foxId, feedId) =>
        set((state) => ({
          foxes: {
            ...state.foxes,
            [foxId]: { ...state.foxes[foxId], preferredFeed: feedId },
          },
        })),

      feedAllFoxes: () => {
        const { hiredNutritionist, foxes } = get();
        if (hiredNutritionist)
          Object.keys(foxes).forEach((id) =>
            get().applyItem(foxes[id].preferredFeed || "supplies", id),
          );
      },
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
      groomAllFoxes: () => {
        const { hiredGroomer, foxes } = get();
        if (hiredGroomer) {
          const updated = { ...foxes };
          Object.keys(updated).forEach((id) => {
            updated[id].lastGroomed = Date.now();
          });
          set({ foxes: updated });
        }
      },
      trainAllFoxes: () => {
        const { hiredTrainer, foxes } = get();
        if (hiredTrainer) {
          const updated = { ...foxes };
          Object.keys(updated).forEach((id) => {
            updated[id].lastTrained = Date.now();
          });
          set({ foxes: updated });
        }
      },

      addForumPost: (categoryId, title, content, author) =>
        set((state) => ({
          forumPosts: [
            ...state.forumPosts,
            {
              id: Math.random().toString(36).substring(2, 9),
              categoryId,
              author,
              title,
              content,
              createdAt: new Date().toISOString(),
              replies: [],
            },
          ],
        })),
      addForumReply: (postId, author, content) =>
        set((state) => ({
          forumPosts: state.forumPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  replies: [
                    ...(post.replies || []),
                    {
                      id: Math.random().toString(36).substring(2, 9),
                      author,
                      content,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : post,
          ),
        })),
      togglePinPost: (postId) =>
        set((state) => ({
          forumPosts: state.forumPosts.map((post) =>
            post.id === postId ? { ...post, isPinned: !post.isPinned } : post,
          ),
        })),
      addForumCategory: (name, description, icon) =>
        set((state) => ({
          forumCategories: [
            ...state.forumCategories,
            {
              id: name.toLowerCase().replace(/\s+/g, "-"),
              name,
              description,
              icon,
            },
          ],
        })),
      updateShowConfig: (level, updates) =>
        set((state) => ({
          showConfig: {
            ...state.showConfig,
            [level]: { ...state.showConfig[level], ...updates },
          },
        })),

      listFoxOnMarket: (foxId, price, currency) =>
        set((state) => {
          const fox = state.foxes[foxId];
          if (!fox) return state;
          const newFoxes = { ...state.foxes };
          delete newFoxes[foxId];
          return {
            marketListings: [
              {
                id: Math.random().toString(36).substring(2, 9),
                sellerId: "player",
                sellerName: "You",
                type: "fox",
                targetId: foxId,
                price,
                currency,
                createdAt: new Date().toISOString(),
                foxData: fox,
              },
              ...state.marketListings,
            ],
            foxes: newFoxes,
          };
        }),
      listItemOnMarket: (itemId, price, currency) =>
        set((state) => {
          if (!state.inventory[itemId] || state.inventory[itemId] <= 0)
            return state;
          return {
            marketListings: [
              {
                id: Math.random().toString(36).substring(2, 9),
                sellerId: "player",
                sellerName: "You",
                type: "item",
                targetId: itemId,
                price,
                currency,
                createdAt: new Date().toISOString(),
              },
              ...state.marketListings,
            ],
            inventory: {
              ...state.inventory,
              [itemId]: state.inventory[itemId] - 1,
            },
          };
        }),
      updateMarketListing: (listingId, updates) =>
        set((state) => ({
          marketListings: state.marketListings.map((l) =>
            l.id === listingId ? { ...l, ...updates } : l,
          ),
        })),
      cancelListing: (listingId) =>
        set((state) => {
          const listing = state.marketListings.find((l) => l.id === listingId);
          if (!listing || listing.sellerId !== "player") return state;
          const newMarket = state.marketListings.filter(
            (l) => l.id !== listingId,
          );
          if (listing.type === "fox" && listing.foxData)
            return {
              marketListings: newMarket,
              foxes: { ...state.foxes, [listing.foxData.id]: listing.foxData },
            };
          return {
            marketListings: newMarket,
            inventory: {
              ...state.inventory,
              [listing.targetId]: (state.inventory[listing.targetId] || 0) + 1,
            },
          };
        }),
      buyFromMarket: (listingId) =>
        set((state) => {
          const listing = state.marketListings.find((l) => l.id === listingId);
          if (!listing || listing.sellerId === "player") return state;
          if (listing.currency === "gold" && state.gold < listing.price)
            return state;
          if (listing.currency === "gems" && state.gems < listing.price)
            return state;
          const newMarket = state.marketListings.filter(
            (l) => l.id !== listingId,
          );
          const newGold =
            listing.currency === "gold"
              ? state.gold - listing.price
              : state.gold;
          const newGems =
            listing.currency === "gems"
              ? state.gems - listing.price
              : state.gems;
          if (listing.type === "fox" && listing.foxData)
            return {
              marketListings: newMarket,
              gold: newGold,
              gems: newGems,
              foxes: { ...state.foxes, [listing.foxData.id]: listing.foxData },
            };
          return {
            marketListings: newMarket,
            gold: newGold,
            gems: newGems,
            inventory: {
              ...state.inventory,
              [listing.targetId]: (state.inventory[listing.targetId] || 0) + 1,
            },
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
          const levels: ShowLevel[] = [
            "Junior",
            "Open",
            "Senior",
            "Amateur Junior",
            "Amateur Open",
            "Amateur Senior",
            "Altered Junior",
            "Altered Open",
            "Altered Senior",
          ];
          const isChampionshipTime = state.season === "Winter";
          const midweekShows: Show[] = [];
          levels.forEach((lvl) => {
            varieties.forEach((v) => {
              midweekShows.push({
                id: Math.random().toString(36).substring(2, 9),
                name: `Midweek ${lvl} ${v} Showcase`,
                level: lvl,
                type: v,
                entries: [],
                isRun: false,
                isWeekend: false,
              });
            });
          });
          const weekendShows: Show[] = [];
          if (isChampionshipTime) {
            varieties.forEach((v) => {
              weekendShows.push({
                id: Math.random().toString(36).substring(2, 9),
                name: `Championship ${v} Final`,
                level: "Championship",
                type: v,
                entries: [],
                isRun: false,
                isWeekend: true,
              });
            });
          } else {
            levels.forEach((lvl) => {
              varieties.forEach((v) => {
                weekendShows.push({
                  id: Math.random().toString(36).substring(2, 9),
                  name: `Weekend ${lvl} ${v} Showcase`,
                  level: lvl,
                  type: v,
                  entries: [],
                  isRun: false,
                  isWeekend: true,
                });
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

                fox.history = [
                  ...(fox.history || []),
                  {
                    year,
                    season,
                    event: `Placed ${res.placement} in ${res.level} ${res.variety} show (${res.pointsAwarded} pts).${res.title ? " Awarded " + res.title + "!" : ""}`,
                    type: "show",
                  },
                ];
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
      toggleColorblindMode: () =>
        set((state: GameState) => ({ colorblindMode: !state.colorblindMode })),
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
    }),
    {
      name: "red-fox-sim-storage",
      version: 6,
      migrate: (persistedState: unknown, version: number) => {
        let state = persistedState as any;
        if (version < 4) {
          state = {
            ...state,
            colorblindMode: state.colorblindMode ?? false,
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
        if (version < 6) {
           state = {
             ...state,
             npcStuds: {}, // Force regen
           };
        }
        return state;
      },
      partialize: (state) => state,
    },
  ),
);
