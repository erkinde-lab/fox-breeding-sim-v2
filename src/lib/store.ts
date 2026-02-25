'use client';



import { create } from 'zustand';

import { persist } from 'zustand/middleware';

const generateNPCStuds = (year: number, season: string): Record<string, Fox> => {
  const npcSeedStr = `npc-studs-${year}-${season}`;
  let npcSeedVal = npcSeedStr.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const npcSeededRandom = () => {
    const x = Math.sin(npcSeedVal++) * 10000;
    return x - Math.floor(x);
  };

  const nextNpcStuds: Record<string, Fox> = {};
  for (let i = 0; i < 4; i++) {
    const stud = createFoundationalFox(npcSeededRandom, "Dog");
    stud.isNPC = true;
    stud.genotypeRevealed = true;
    stud.studFee = 500 + Math.floor(npcSeededRandom() * 1000);
    Object.keys(stud.stats).forEach(key => {
      if (key !== "fertility") {
        stud.stats[key as keyof Stats] = Math.max(20, stud.stats[key as keyof Stats]);
      }
    });
    nextNpcStuds[stud.id] = stud;
  }
  return nextNpcStuds;
};
import { createFox, createFoundationalFox, createFoundationFoxCollection, calculateSilverIntensity, getPhenotype, Genotype, Stats, Fox, breed } from '@/lib/genetics';

import { runSpecificShow, ShowReport, ShowLevel, ShowClass } from './showing';
export interface Show { id: string; name: string; level: ShowLevel; type: ShowClass; entries: string[]; isRun: boolean; }



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

  type: 'fox' | 'item';

  targetId: string;

  price: number;

  currency: 'gold' | 'gems';

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




export interface BreedingRecord {
  id: string;
  sireId: string;
  damId: string;
  sireName: string;
  damName: string;
  year: number;
  season: string;
  kits: { id?: string; name: string; phenotype: string; isStillborn: boolean }[];
}

export interface WhelpingReport {
  motherName: string;
  fatherName: string;
  kits: { name: string; phenotype: string; baseColor: string; pattern: string; eyeColor: string; isStillborn: boolean }[];
}

interface GameState {

  foxes: Record<string, Fox>;

  gold: number;

  gems: number;

  year: number;
  joiningYear: number;

  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';

  inventory: Record<string, number>;

  foodUses: Record<string, number>;

  seniorShowWinners: string[];

  showReports: ShowReport[];
  shows: Show[];

  whelpingReports: WhelpingReport[];

  pregnancyList: Pregnancy[];
  breedingHistory: BreedingRecord[];

  kennelCapacity: number;

  npcStuds: Record<string, Fox>;

  bisWins: number;

  bestDogWins: number;

  bestVixenWins: number;

  totalShowPoints: number;

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
  hiredHandler: boolean;

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


  // Actions

  advanceTime: () => void;

  breedFoxes: (dogId: string, vixenId: string) => void;

  addGold: (amount: number) => void;

  addGems: (amount: number) => void;

  addFox: (fox: Fox) => void;

  sellFox: (id: string) => void;
  retireFox: (id: string) => void;

  buyItem: (itemId: string, price: number, currency: 'gold' | 'gems', quantity?: number) => void;

  applyItem: (itemId: string, foxId: string) => void;

  renameFox: (id: string, newName: string) => void;

  updateFox: (id: string, updates: Partial<Fox>) => void;

  initializeGame: () => void;

  setBannerUrl: (url: string) => void;

  setBannerPosition: (pos: string) => void;

  toggleDarkMode: () => void;

  checkAdoptionReset: () => void;

  buyFoundationalFox: () => void;

  buyFoundationalFoxById: (slotIndex: number) => void;

  buyCustomFoundationalFox: (genotype: Genotype, gender: 'Dog' | 'Vixen', name?: string, eyeColor?: string) => void;

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

  adminSpawnFox: (name: string, gender: 'Dog' | 'Vixen', genotype: Genotype) => void;

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
  hireHandler: () => void;
  spayNeuterFox: (foxId: string) => void;

  setFoxPreferredFeed: (foxId: string, feedId: string) => void;

  feedAllFoxes: () => void;
  groomFox: (foxId: string) => void;
  trainFox: (foxId: string) => void;
  groomAllFoxes: () => void;
  trainAllFoxes: () => void;

  addForumPost: (categoryId: string, title: string, content: string, author: string) => void;

  addForumReply: (postId: string, author: string, content: string) => void;

  togglePinPost: (postId: string) => void;

  addForumCategory: (name: string, description: string, icon: string) => void;

  updateShowConfig: (level: string, updates: Partial<ShowConfig>) => void;

  listFoxOnMarket: (foxId: string, price: number, currency: 'gold' | 'gems') => void;

  listItemOnMarket: (itemId: string, price: number, currency: 'gold' | 'gems') => void;

  cancelListing: (listingId: string) => void;
  updateMarketListing: (listingId: string, updates: Partial<MarketListing>) => void;

  buyFromMarket: (listingId: string) => void;

  checkAchievements: () => void;

}



export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'altered-champion',
    name: 'Altered Champion',
    description: 'Have an altered fox reach 50 lifetime points.',
    rewardText: '2,000 Gold',
    reward: () => useGameStore.getState().addGold(2000),
    condition: (state) => Object.values(state.foxes).some(f => f.isAltered && f.pointsLifetime >= 50)
  },
  {
    id: 'altered-bis',
    name: 'Altered Best In Show',
    description: 'Win Best In Show with an altered fox.',
    rewardText: '50 Gems',
    reward: () => useGameStore.getState().addGems(50),
    condition: (state) => Object.values(state.foxes).some(f => f.isAltered && f.bisWins >= 1)
  },

  {

    id: 'first-fox',

    name: 'First Fox',

    description: 'Adopt your first foundational fox.',

    rewardText: '1,000 Gold',

    reward: () => useGameStore.getState().addGold(1000),

    condition: (state) => Object.keys(state.foxes).length >= 1

  },

  {

    id: 'master-breeder',

    name: 'Master Breeder',

    description: 'Have 5 foxes in your kennel.',

    rewardText: '50 Gems',

    reward: () => useGameStore.getState().addGems(50),

    condition: (state) => Object.keys(state.foxes).length >= 5

  },

  {

    id: 'show-winner',

    name: 'Show Winner',

    description: 'Win a Best in Show award.',

    rewardText: '5,000 Gold',

    reward: () => useGameStore.getState().addGold(5000),

    condition: (state) => state.bisWins >= 1

  },

  {

    id: 'millionaire',

    name: 'Gold Rush',

    description: 'Accumulate 50,000 Gold.',

    rewardText: '100 Gems',

    reward: () => useGameStore.getState().addGems(100),

    condition: (state) => state.gold >= 50000

  }

];



export const useGameStore = create<GameState>()(

  persist(

    (set, get) => ({

      foxes: {},

      gold: 10000,

      gems: 100,

      year: 1,
      joiningYear: 1,

      season: 'Spring',

      inventory: {

        'supplies': 5,

        'genetic-test': 2,

        'pedigree-analysis': 2,

      },

      foodUses: {},

      seniorShowWinners: [],

      showReports: [],
      shows: [],

      whelpingReports: [],

          pregnancyList: [],
  breedingHistory: [],

      kennelCapacity: 10,

      npcStuds: {},

      bisWins: 0,

      bestDogWins: 0,

      bestVixenWins: 0,

      totalShowPoints: 0,

      forumCategories: [

        { id: 'staff', name: 'Staff Announcements & Feedback', description: 'Official news and feedback from the development team.', icon: 'Megaphone' },

        { id: 'general', name: 'General Discussion', description: 'Talk about anything fox-related!', icon: 'MessageSquare' },

        { id: 'breeding', name: 'Breeding Tips', description: 'Share your genetic discoveries.', icon: 'Heart' },

        { id: 'shows', name: 'Show Results', description: 'Celebrate your wins!', icon: 'Trophy' },

        { id: 'market', name: 'Trading', description: 'Buy, sell, and trade foxes.', icon: 'Store' },

      ],

      forumPosts: [],

      isAdmin: false,

      showConfig: {
        "Amateur Junior": { bis: 1000, first: 500, second: 250, third: 100 },
        "Amateur Open": { bis: 2500, first: 1000, second: 500, third: 250 },
        "Amateur Senior": { bis: 5000, first: 2500, second: 1000, third: 500 },

        Junior: { bis: 1000, first: 500, second: 250, third: 100 },

        Open: { bis: 2500, first: 1000, second: 500, third: 250 },

        Senior: { bis: 5000, first: 2500, second: 1000, third: 500 },
        "Altered Junior": { bis: 1000, first: 500, second: 250, third: 100 },
        "Altered Open": { bis: 2500, first: 1000, second: 500, third: 250 },
        "Altered Senior": { bis: 5000, first: 2500, second: 1000, third: 500 },
        "Altered Amateur Junior": { bis: 1000, first: 500, second: 250, third: 100 },
        "Altered Amateur Open": { bis: 2500, first: 1000, second: 500, third: 250 },
        "Altered Amateur Senior": { bis: 5000, first: 2500, second: 1000, third: 500 },

        Championship: { bis: 10000, first: 5000, second: 2500, third: 1000 },

      },

      marketListings: [],

      unlockedAchievements: [],

      hiredGroomer: false,

      hiredVeterinarian: false,

      hiredTrainer: false,

      hiredGeneticist: false,

      hiredNutritionist: false,
      hiredHandler: false,

      bannerUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',

      bannerPosition: '50%',

      foundationFoxes: [],

      soldFoundationalSlots: [],

      lastAdoptionReset: '',

      members: [],

      adminLogs: [],
      hasSeenTutorial: false,
      tutorialStep: null,


      isDarkMode: false,



      checkAchievements: () => {
        const state = get();
        ACHIEVEMENTS.forEach((ach) => {
          if (!state.unlockedAchievements.includes(ach.id) && ach.condition(state)) {
            ach.reward();
            set((s) => ({ unlockedAchievements: [...s.unlockedAchievements, ach.id] }));
          }
        });
      },



      advanceTime: () => {
        set((state) => {

        const seasons: ('Spring' | 'Summer' | 'Autumn' | 'Winter')[] = ['Spring', 'Summer', 'Autumn', 'Winter'];

        const currentIndex = seasons.indexOf(state.season);

        const nextIndex = (currentIndex + 1) % 4;

        const nextSeason = seasons[nextIndex];

        const nextYear = nextIndex === 0 ? state.year + 1 : state.year;



        const updatedFoxes = { ...state.foxes };

        const whelpingReports: WhelpingReport[] = [];
        const newBreedingRecords: BreedingRecord[] = [];

        const nextPregnancyList: Pregnancy[] = [];



                // Reset fed status at the start of each season
        Object.keys(updatedFoxes).forEach(id => {
          updatedFoxes[id].lastFed = undefined;
          updatedFoxes[id].lastGroomed = undefined;
          updatedFoxes[id].lastTrained = undefined;
                });



        if (nextIndex === 0) {


          // Award Rankings (NW/RW)
          const foxesForRanking = Object.values(updatedFoxes).sort((a, b) => b.pointsYear - a.pointsYear);
          foxesForRanking.forEach((fox, index) => {
            if (index === 0 && fox.pointsYear > 0) {
              fox.suffixTitle = fox.suffixTitle ? `${fox.suffixTitle} NW` : 'NW';
            } else if (index < 10 && fox.pointsYear > 0) {
              fox.suffixTitle = fox.suffixTitle ? `${fox.suffixTitle} RW` : 'RW';
            }
          });

          Object.keys(updatedFoxes).forEach(id => {

            updatedFoxes[id].age += 1;

            updatedFoxes[id].pointsYear = 0;

            // Auto-retire all foxes at 10 years old
            if (updatedFoxes[id].age >= 10) {

              updatedFoxes[id].isRetired = true;

            }

          });

        }



        if (nextSeason === 'Spring') {
          state.pregnancyList.forEach(preg => {
            const mother = updatedFoxes[preg.motherId];
            const kits: WhelpingReport['kits'] = [];
            const historyKits: BreedingRecord['kits'] = [];

            if (!mother) return;

            const kitCount = (typeof window !== 'undefined' ? Math.floor(Math.random() * 4) : 3) + 2;

            for (let i = 0; i < kitCount; i++) {
              const kitGenotype = breed(mother.genotype, preg.fatherGenotype);
              const kitPhenotype = getPhenotype(kitGenotype, calculateSilverIntensity(mother.silverIntensity, preg.fatherSilverIntensity));

              if (kitPhenotype.isLethal) {
                const kitData = { name: "Stillborn Fox", phenotype: "Stillborn", baseColor: "-", pattern: "-", eyeColor: "-", isStillborn: true };
                kits.push(kitData);
                historyKits.push({ name: kitData.name, phenotype: kitData.phenotype, isStillborn: true });
              } else {
                const kit = createFox({
                  parents: [preg.motherId, preg.fatherId],
                  genotype: kitGenotype,
                  silverIntensity: calculateSilverIntensity(mother.silverIntensity, preg.fatherSilverIntensity),
                  age: 0,
                  birthYear: nextYear,
                });

                updatedFoxes[kit.id] = kit;

                kits.push({
                  name: kit.name,
                  phenotype: kit.phenotype,
                  baseColor: kit.baseColor,
                  pattern: kit.pattern,
                  eyeColor: kit.eyeColor,
                  isStillborn: false
                });
                historyKits.push({ id: kit.id, name: kit.name, phenotype: kit.phenotype, isStillborn: false });
              }
            }

            whelpingReports.push({ motherName: mother.name, fatherName: preg.fatherName, kits });
            newBreedingRecords.push({
              id: Math.random().toString(36).substring(2, 9),
              sireId: preg.fatherId,
              damId: preg.motherId,
              sireName: preg.fatherName,
              damName: mother.name,
              year: nextYear,
              season: nextSeason,
              kits: historyKits
            });
          });

        } else {

          nextPregnancyList.push(...state.pregnancyList);

        }



        return {

          season: nextSeason,

          year: nextYear,

          foxes: updatedFoxes,

          whelpingReports: [...whelpingReports, ...state.whelpingReports].slice(0, 10),

          pregnancyList: nextPregnancyList,
          breedingHistory: [...newBreedingRecords, ...(state.breedingHistory || [])].slice(0, 50),
          npcStuds: generateNPCStuds(nextYear, nextSeason)
        };
      });
      get().generateSeasonalShows();
    },



      breedFoxes: (dogId, vixenId) => {
        const { npcStuds, season, pregnancyList } = get();
        const dog = foxes[dogId] || npcStuds[dogId];
        const vixen = foxes[vixenId];



        if (!dog || !vixen || season !== 'Winter') return;

        if ((foxes[dogId] && !dog.hasBeenRenamed) || !vixen.hasBeenRenamed) return;

        if (dog.gender !== 'Dog' || vixen.gender !== 'Vixen') return;

        if (dog.age < 2 || vixen.age < 2 || dog.isRetired || vixen.isRetired) return;

        if (pregnancyList.some(p => p.motherId === vixenId)) return;



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

              dueSeason: 'Spring'

            }

          ]

        }));

      },



      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),

      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),

      addFox: (fox) => set((state) => ({ foxes: { ...state.foxes, [fox.id]: state.hiredGeneticist ? { ...fox, genotypeRevealed: true } : fox } })),

      retireFox: (id) => set((state) => ({
        foxes: {
          ...state.foxes, [id]: { ...state.foxes[id], isRetired: true }
        }
      })),

      sellFox: (id) => set((state) => {

        const fox = state.foxes[id];

        // Prevent retirement before 6 years old
        if (fox && fox.age < 6) {


          return state;

        }

        const newFoxes = { ...state.foxes };

        delete newFoxes[id];

        return { foxes: newFoxes, gold: state.gold + 500 };

      }),



      buyItem: (itemId, price, currency, quantity = 1) => set((state) => {

        if (currency === 'gold' && state.gold < price) return state;

        if (currency === 'gems' && state.gems < price) return state;

        return {

          gold: currency === 'gold' ? state.gold - price : state.gold,

          gems: currency === 'gems' ? state.gems - price : state.gems,

          inventory: { ...state.inventory, [itemId]: (state.inventory[itemId] || 0) + quantity }

        };

      }),



      applyItem: (itemId, foxId) => set((state) => {

        const fox = state.foxes[foxId];

        if (!fox) return state;



        const newFox = { ...fox };

        const newInventory = { ...state.inventory };

        const newFoodUses = { ...state.foodUses };



        if (itemId === 'supplies' || itemId === 'standard-feed' || itemId.startsWith('feed-')) {

          let uses = newFoodUses[itemId] || 0;

          if (uses <= 0) {

            if (!newInventory[itemId] || newInventory[itemId] <= 0) return state;

            newInventory[itemId]--;

            uses = itemId === 'supplies' ? 8 : (itemId === 'standard-feed' ? 4 : 5);

          }

          newFoodUses[itemId] = uses - 1;



          if (itemId === 'supplies' || itemId === 'standard-feed') {

            newFox.lastFed = Date.now();

          } else {

            const statKey = itemId.replace('feed-', '') as keyof Stats;

            const stats = { ...newFox.stats };

            stats[statKey] = Math.min(100, (stats[statKey] || 0) + 2);

            newFox.stats = stats;

            // Specialty feeds also satisfy hunger

            newFox.lastFed = Date.now();

          }

        } else {

          if (!newInventory[itemId] || newInventory[itemId] <= 0) return state;

          if (itemId === 'genetic-test') newFox.genotypeRevealed = true;

          if (itemId === 'pedigree-analysis') newFox.pedigreeAnalyzed = true;

          newInventory[itemId]--;

        }



        return {

          inventory: newInventory,

          foodUses: newFoodUses,

          foxes: { ...state.foxes, [foxId]: newFox }

        };

      }),



      setTutorialStep: (step) => set({ tutorialStep: step }),
      completeTutorial: () => set({ hasSeenTutorial: true, tutorialStep: null }),

      renameFox: (id, newName) => set((state) => {
        const allFoxes = [
          ...Object.values(state.foxes),
          ...Object.values(state.npcStuds),
          ...state.foundationFoxes
        ];
        const isNameTaken = allFoxes.some(f => f.id !== id && f.name.toLowerCase() === newName.toLowerCase());
        if (isNameTaken) return state;
        return {

        foxes: { ...state.foxes, [id]: { ...state.foxes[id], name: newName, hasBeenRenamed: true } }
        };

      }),



      updateFox: (id, updates) => set((state) => ({

        foxes: { ...state.foxes, [id]: { ...state.foxes[id], ...updates } }

      })),



      checkAdoptionReset: () => {

        const now = new Date().toISOString().slice(0, 13); // Hourly reset (e.g., "2026-12-20T11")

        const state = get();

        if (state.lastAdoptionReset !== now) {

          // Deterministic generation based on hour string

          let seedVal = now.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

          const seededRandom = () => {

            const x = Math.sin(seedVal++) * 10000;

            return x - Math.floor(x);

          };



          // Use new collection function with rules

          const newFoxes = createFoundationFoxCollection(seededRandom);

          set({

            foundationFoxes: newFoxes,

            soldFoundationalSlots: [], // Clear sold slots

            lastAdoptionReset: now

          });

        }

      },



      initializeGame: () => {
        if (get().shows.length === 0) get().generateSeasonalShows();

        const { year, season } = get();
        set({ npcStuds: generateNPCStuds(year, season) });
        const { members } = get();

        get().checkAdoptionReset();

        // If it's a brand new game state (no members), initialize default settings
        if (members.length === 0) {
          const defaultMembers: Member[] = [
            { id: '1', name: 'RedFoxMaster', level: 45, joined: 'Spring, Year 1', points: 12500, avatarColor: 'bg-orange-500', isBanned: false, warnings: [] },
            { id: '2', name: 'SilverVixen', level: 38, joined: 'Summer, Year 1', points: 9800, avatarColor: 'bg-slate-400', isBanned: false, warnings: [] },
            { id: '3', name: 'ArcticBreeder', level: 32, joined: 'Autumn, Year 1', points: 7200, avatarColor: 'bg-blue-100', isBanned: false, warnings: [] },
            { id: '4', name: 'CrossFoxExpert', level: 29, joined: 'Winter, Year 1', points: 6500, avatarColor: 'bg-amber-700', isBanned: false, warnings: [] },
            { id: '5', name: 'GeneticsGuru', level: 25, joined: 'Spring, Year 2', points: 5100, avatarColor: 'bg-purple-500', isBanned: false, warnings: [] },
          ];

          set({
            foxes: {},
            gold: 10000,
            gems: 100,
            members: defaultMembers,
            hasSeenTutorial: false,
            tutorialStep: 0
          });

          if (year === 1 && season === 'Spring') {
            get().advanceTime();
          }
        }
      },



      buyFoundationalFox: () => set((state) => {

        if (state.gold < 1000) return state;

        const fox = createFoundationalFox();

        return {

          gold: state.gold - 1000,

          foxes: { ...state.foxes, [fox.id]: fox }

        };

      }),



      buyFoundationalFoxById: (slotIndex) => set((state) => {

        if (state.gold < 1000 || state.soldFoundationalSlots.includes(slotIndex)) return state;

        const fox = state.foundationFoxes[slotIndex];

        if (!fox) return state;

        const newFox = { ...fox, id: (typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 9) : Date.now().toString()) };

        return {

          gold: state.gold - 1000,

          foxes: { ...state.foxes, [newFox.id]: newFox },

          soldFoundationalSlots: [...state.soldFoundationalSlots, slotIndex]

        };

      }),



      buyCustomFoundationalFox: (genotype, gender, name, eyeColor) => set((state) => {

        if (state.gems < 50) return state;

        const fox = createFox({

          name: name || 'Custom Foundational',

          genotype,

          gender,

          eyeColor,

          parents: [null, null],

          coi: 0,

          pedigreeAnalyzed: true,

          stats: {

            head: Math.max(25, Math.floor(Math.random() * 16) + 5),

            topline: Math.max(25, Math.floor(Math.random() * 16) + 5),

            forequarters: Math.max(25, Math.floor(Math.random() * 16) + 5),

            hindquarters: Math.max(25, Math.floor(Math.random() * 16) + 5),

            tail: Math.max(25, Math.floor(Math.random() * 16) + 5),

            coatQuality: Math.max(25, Math.floor(Math.random() * 16) + 5),

            temperament: Math.max(25, Math.floor(Math.random() * 16) + 5),

            presence: Math.max(25, Math.floor(Math.random() * 16) + 5),

            luck: Math.max(25, Math.floor(Math.random() * 16) + 5),

            fertility: Math.max(50, Math.floor(Math.random() * 50) + 25),

          }

        });

        return {

          gems: state.gems - 50,

          foxes: { ...state.foxes, [fox.id]: fox }

        };

      }),



      expandKennel: () => set((state) => {

        if (state.gold < 5000) return state;

        return {

          gold: state.gold - 5000,

          kennelCapacity: state.kennelCapacity + 5

        };

      }),



      toggleStudStatus: (foxId, fee) => set((state) => {

        const fox = state.foxes[foxId];

        if (!fox || fox.gender !== 'Dog' || fox.age < 2) return state;

        return {

          foxes: {

            ...state.foxes, [foxId]: { ...fox, isAtStud: !fox.isAtStud, studFee: fee }

          }

        };

      }),



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

        const updatedFoxes = { ...state.foxes };

        Object.keys(updatedFoxes).forEach(id => {

          updatedFoxes[id] = { ...updatedFoxes[id], genotypeRevealed: true };

        });

        return { gems: state.gems - 100, hiredGeneticist: true, foxes: updatedFoxes };

      }),

      hireNutritionist: () => set((state) => {

        if (state.gems < 75) return state;

        return { gems: state.gems - 75, hiredNutritionist: true };

      }),




      hireHandler: () => set((state) => {
        if (state.gems < 75) return state;
        return { gems: state.gems - 75, hiredHandler: true };
      }),

      spayNeuterFox: (foxId) => set((state) => {
        const fox = state.foxes[foxId];
        if (!fox || fox.age < 1 || fox.isAltered) return state;

        const updatedFox = {
          ...fox,
          isAltered: true,
          isAtStud: false,
          stats: {
            ...fox.stats,
            temperament: fox.stats.temperament + 20,
            presence: fox.stats.presence + 20,
          }
        };

        return {
          foxes: {
            ...state.foxes, [foxId]: updatedFox
          }
        };
      }),
      setBannerUrl: (url: string) => set({ bannerUrl: url }),

      setBannerPosition: (pos: string) => set({ bannerPosition: pos }),

      setFoxPreferredFeed: (foxId, feedId) => set((state) => ({

        foxes: { ...state.foxes, [foxId]: { ...state.foxes[foxId], preferredFeed: feedId } }

      })),



      feedAllFoxes: () => {

        const { hiredNutritionist } = get();

        if (!hiredNutritionist) return;

        Object.keys(foxes).forEach(id => {

          const fox = foxes[id];

          const feedId = fox.preferredFeed || 'supplies';

          get().applyItem(feedId, id);

        });

      },

      groomFox: (foxId) => set((state) => ({
        foxes: { ...state.foxes, [foxId]: { ...state.foxes[foxId], lastGroomed: Date.now() } }
      })),

      trainFox: (foxId) => set((state) => ({
        foxes: { ...state.foxes, [foxId]: { ...state.foxes[foxId], lastTrained: Date.now() } }
      })),

      groomAllFoxes: () => {
        const { hiredGroomer } = get();
        if (!hiredGroomer) return;
        const updatedFoxes = { ...foxes };
        Object.keys(updatedFoxes).forEach(id => {
          updatedFoxes[id] = { ...updatedFoxes[id], lastGroomed: Date.now() };
        });
        set({ foxes: updatedFoxes });
      },

      trainAllFoxes: () => {
        const { hiredTrainer } = get();
        if (!hiredTrainer) return;
        const updatedFoxes = { ...foxes };
        Object.keys(updatedFoxes).forEach(id => {
          updatedFoxes[id] = { ...updatedFoxes[id], lastTrained: Date.now() };
        });
        set({ foxes: updatedFoxes });
      },



      addForumPost: (categoryId, title, content, author) => set((state) => ({

        forumPosts: [...state.forumPosts, { id: (typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 9) : Date.now().toString()), categoryId, author, title, content, createdAt: new Date().toISOString(), isPinned: false, replies: [] }]

      })),



      addForumReply: (postId, author, content) => set((state) => ({

        forumPosts: state.forumPosts.map(post =>

          post.id === postId

            ? { ...post, replies: [...(post.replies || []), { id: (typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 9) : Date.now().toString()), author, content, createdAt: new Date().toISOString() }] }

            : post

        )

      })),



      togglePinPost: (postId) => set((state) => ({

        forumPosts: state.forumPosts.map(post =>

          post.id === postId ? { ...post, isPinned: !post.isPinned } : post

        )

      })),



      addForumCategory: (name, description, icon) => set((state) => ({

        forumCategories: [...state.forumCategories, { id: name.toLowerCase().replace(/\s+/g, '-'), name, description, icon }]

      })),



      updateShowConfig: (level, updates) => set((state) => ({
        showConfig: { ...state.showConfig, [level]: { ...state.showConfig[level], ...updates } }
      })),



      listFoxOnMarket: (foxId, price, currency) => set((state) => {

        const fox = state.foxes[foxId];

        if (!fox) return state;

        const newListing: MarketListing = { id: (typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 9) : Date.now().toString()), sellerId: 'player', sellerName: 'You', type: 'fox', targetId: foxId, price, currency, createdAt: new Date().toISOString(), foxData: fox };

        const newFoxes = { ...state.foxes };

        delete newFoxes[foxId];

        return { marketListings: [newListing, ...state.marketListings], foxes: newFoxes };

      }),



      listItemOnMarket: (itemId, price, currency) => set((state) => {

        if (!state.inventory[itemId] || state.inventory[itemId] <= 0) return state;

        const newListing: MarketListing = { id: (typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 9) : Date.now().toString()), sellerId: 'player', sellerName: 'You', type: 'item', targetId: itemId, price, currency, createdAt: new Date().toISOString() };

        return { marketListings: [newListing, ...state.marketListings], inventory: { ...state.inventory, [itemId]: state.inventory[itemId] - 1 } };

      }),




      updateMarketListing: (listingId, updates) => set((state) => ({
        marketListings: state.marketListings.map(l =>
          l.id === listingId ? { ...l, ...updates } : l
        )
      })),
      cancelListing: (listingId) => set((state) => {

        const listing = state.marketListings.find(l => l.id === listingId);

        if (!listing || listing.sellerId !== 'player') return state;

        const newMarket = state.marketListings.filter(l => l.id !== listingId);

        if (listing.type === 'fox' && listing.foxData) return { marketListings: newMarket, foxes: { ...state.foxes, [listing.foxData.id]: listing.foxData } };

        return { marketListings: newMarket, inventory: { ...state.inventory, [listing.targetId]: (state.inventory[listing.targetId] || 0) + 1 } };

      }),



      buyFromMarket: (listingId) => set((state) => {

        const listing = state.marketListings.find(l => l.id === listingId);

        if (!listing || listing.sellerId === 'player') return state;

        if (listing.currency === 'gold' && state.gold < listing.price) return state;

        if (listing.currency === 'gems' && state.gems < listing.price) return state;

        const newMarket = state.marketListings.filter(l => l.id !== listingId);

        const newGold = listing.currency === 'gold' ? state.gold - listing.price : state.gold;

        const newGems = listing.currency === 'gems' ? state.gems - listing.price : state.gems;

        if (listing.type === 'fox' && listing.foxData) return { marketListings: newMarket, gold: newGold, gems: newGems, foxes: { ...state.foxes, [listing.foxData.id]: listing.foxData } };

        return { marketListings: newMarket, gold: newGold, gems: newGems, inventory: { ...state.inventory, [listing.targetId]: (state.inventory[listing.targetId] || 0) + 1 } };

      }),




      generateSeasonalShows: () => set((state) => {
        const levels: ShowLevel[] = ["Junior", "Open", "Senior", "Amateur Junior", "Amateur Open", "Amateur Senior", "Altered Junior", "Altered Open", "Altered Senior", "Altered Amateur Junior", "Altered Amateur Open", "Altered Amateur Senior"];
        const classes: ShowClass[] = [
          "Best Juvenile Dog", "Best Juvenile Vixen", "Best Adult Dog", "Best Adult Vixen",
          "Red Specialty", "Silver Specialty", "Gold Specialty", "Cross Specialty", "Exotic Specialty"
        ];

        const newShows: Show[] = [];
        levels.forEach(level => {
          classes.forEach(cls => {
            newShows.push({
              id: Math.random().toString(36).substring(2, 9),
              name: `${level} ${cls} Showcase`,
              level,
              type: cls,
              entries: [],
              isRun: false
            });
          });
        });

        return { shows: newShows };
      }),

      enterFoxInShow: (foxId, showId) => set((state) => {
        const show = state.shows.find(s => s.id === showId);
        if (!show) return state;

        const isDeselecting = show.entries.includes(foxId);
        if (isDeselecting) {
          return {
            shows: state.shows.map(s =>
              s.id === showId ? { ...s, entries: s.entries.filter(id => id !== foxId) } : s
            )
          };
        }

        if (!state.hiredHandler) {
          const playerFoxIds = Object.keys(state.foxes);
          if (show.entries.some(id => playerFoxIds.includes(id))) {
            return state;
          }
        }

        return {
          shows: state.shows.map(s =>
            s.id === showId ? { ...s, entries: [...s.entries, foxId] } : s
          )
        };
      }),

      addShow: (show) => set((state) => ({
        shows: [show, ...state.shows]
      })),

      removeShow: (showId) => set((state) => ({
        shows: state.shows.filter(s => s.id !== showId)
      })),

      updateShow: (showId, updates) => set((state) => ({
        shows: state.shows.map(s =>
          s.id === showId ? { ...s, ...updates } : s
        )
      })),
            runShows: () => {
        const { shows, year, season, showConfig, hiredGroomer, hiredTrainer, hiredVeterinarian } = get();
        const newShowReports: ShowReport[] = [];
        let newGold = get().gold;
        let newBisWins = get().bisWins;
        let newBestDogWins = get().bestDogWins;
        let newBestVixenWins = get().bestVixenWins;
        let newTotalPoints = get().totalShowPoints;
        const newSeniorWinners = [...get().seniorShowWinners];
        const updatedFoxes = { ...foxes };

        shows.forEach(show => {
          if (show.entries.length === 0) return;

          const enteredFoxes = show.entries.map(id => foxes[id]).filter(Boolean) as Fox[];
          if (enteredFoxes.length === 0) return;

          const report = runSpecificShow(show.level, show.type, enteredFoxes, year, season, hiredGroomer, hiredTrainer, hiredVeterinarian);
          newShowReports.push(report);

          const config = showConfig[show.level as ShowLevel];

          report.results.forEach(res => {
            const fox = updatedFoxes[res.foxId];
            if (fox) {
              fox.pointsYear += res.pointsAwarded;
              fox.pointsLifetime += res.pointsAwarded;
              newTotalPoints += res.pointsAwarded;
              if (res.place === 1) {
                newGold += config.first;
                if (res.class === 'Best Adult Dog' || res.class === 'Best Juvenile Dog') newBestDogWins++;
                if (res.class === 'Best Adult Vixen' || res.class === 'Best Juvenile Vixen') newBestVixenWins++;
                if ( (show.level === 'Senior' || show.level === 'Altered Senior') && !newSeniorWinners.includes(fox.id)) {
                  newSeniorWinners.push(fox.id);
                }
              }
            }
          });

          if (report.bestInShowFoxId) {
            const bisFox = updatedFoxes[report.bestInShowFoxId];
            if (bisFox) {
              bisFox.pointsYear += 5;
              bisFox.pointsLifetime += 5;
              bisFox.bisWins = (bisFox.bisWins || 0) + 1;
              newTotalPoints += 5;
              newBisWins++;
              newGold += config.bis;
            }
          }
        });

        set({
          foxes: updatedFoxes,
          gold: newGold,
          seniorShowWinners: newSeniorWinners,
          showReports: [...newShowReports, ...get().showReports].slice(0, 20),
          bisWins: newBisWins,
          bestDogWins: newBestDogWins,
          bestVixenWins: newBestVixenWins,
          totalShowPoints: newTotalPoints,
          shows: shows.map(s => ({ ...s, entries: [], isRun: true }))
        });
        get().checkAchievements();
      },



      addAdminLog: (action, details) => set((state) => ({

        adminLogs: [{ id: (typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 9) : Date.now().toString()), action, details, timestamp: new Date().toISOString() }, ...state.adminLogs].slice(0, 50)

      })),

      adminUpdateFoxStats: (foxId, statsUpdates) => {

        const { year, season } = get();
        set({ npcStuds: generateNPCStuds(year, season) });
        const { foxes } = get();

        if (!foxes[foxId]) return;

        set((state) => ({ foxes: { ...state.foxes, [foxId]: { ...state.foxes[foxId], stats: { ...state.foxes[foxId].stats, ...statsUpdates } } } }));

        get().addAdminLog('Update Fox Stats', `Updated stats for fox ${foxes[foxId].name} (${foxId})`);

      },

      toggleAdminMode: () => set((state) => ({ isAdmin: !state.isAdmin })),

      adminAddCurrency: (goldAmount, gemsAmount) => set((state) => ({ gold: state.gold + goldAmount, gems: state.gems + gemsAmount })),

      adminSetCurrency: (updates) => set(updates),

      adminAddItem: (itemId, count) => set((state) => ({ inventory: { ...state.inventory, [itemId]: (state.inventory[itemId] || 0) + count } })),

      adminSpawnFox: (name, gender, genotype) => {

        const fox = createFox({ name, gender, genotype });

        set((state) => ({ foxes: { ...state.foxes, [fox.id]: fox } }));

        get().addAdminLog('Spawn Fox', `Spawned fox ${name} (${fox.id})`);

      },

      warnMember: (memberId, reason) => set((state) => ({ members: state.members.map(m => m.id === memberId ? { ...m, warnings: [...m.warnings, reason] } : m) })),

      banMember: (memberId) => set((state) => ({ members: state.members.map(m => m.id === memberId ? { ...m, isBanned: true } : m) })),

      toggleDarkMode: () => set((state: GameState) => ({ isDarkMode: !state.isDarkMode })),

    }),

    {

      name: 'red-fox-sim-storage',

      version: 4,

      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          return undefined;
        }
        return persistedState;
      },

      partialize: (state) => state

    }

  )

);

