'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Fox, createFox, breed, getPhenotype, createFoundationalFox, getInitialGenotype, Genotype, Stats } from './genetics';
import { runShow, ShowReport, ShowLevel } from './showing';

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ForumPost {
  id: string;
  categoryId: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
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
  kits: { name: string; phenotype: string; baseColor: string; pattern: string; eyeColor: string; isStillborn: boolean }[];
}

interface GameState {
  foxes: Record<string, Fox>;
  gold: number;
  gems: number;
  year: number;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  inventory: Record<string, number>;
  seniorShowWinners: string[];
  showReports: ShowReport[];
  whelpingReports: WhelpingReport[];
  pregnancyList: Pregnancy[];
  kennelCapacity: number;
  npcStuds: Record<string, Fox>;
  bisWins: number;
  bestMaleWins: number;
  bestFemaleWins: number;
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
  members: Member[];
  adminLogs: AdminLog[];

  // Actions
  advanceTime: () => void;
  breedFoxes: (maleId: string, femaleId: string) => void;
  addGold: (amount: number) => void;
  addGems: (amount: number) => void;
  addFox: (fox: Fox) => void;
  sellFox: (id: string) => void;
  buyItem: (itemId: string, price: number, currency: 'gold' | 'gems') => void;
  applyItem: (itemId: string, foxId: string) => void;
  renameFox: (id: string, newName: string) => void;
  updateFox: (id: string, updates: Partial<Fox>) => void;
  initializeGame: () => void;
  buyFoundationalFox: () => void;
  buyCustomFoundationalFox: (genotype: Genotype, gender: 'Male' | 'Female') => void;
  runShows: () => void;
  toggleAdminMode: () => void;
  adminAddCurrency: (gold: number, gems: number) => void;
  adminSetCurrency: (gold: number, gems: number) => void;
  adminAddItem: (itemId: string, count: number) => void;
  adminSpawnFox: (name: string, gender: 'Male' | 'Female', genotype: Genotype) => void;
  adminUpdateFoxStats: (foxId: string, stats: Partial<Stats>) => void;
  addAdminLog: (action: string, details: string) => void;
  warnMember: (memberId: string, reason: string) => void;
  banMember: (memberId: string) => void;
  toggleStudStatus: (foxId: string, fee: number) => void;
  hireGroomer: () => void;
  hireVeterinarian: () => void;
  hireTrainer: () => void;
  addForumPost: (categoryId: string, title: string, content: string, author: string) => void;
  addForumCategory: (name: string, description: string, icon: string) => void;
  updateShowConfig: (level: string, updates: Partial<ShowConfig>) => void;
  listFoxOnMarket: (foxId: string, price: number, currency: 'gold' | 'gems') => void;
  listItemOnMarket: (itemId: string, price: number, currency: 'gold' | 'gems') => void;
  cancelListing: (listingId: string) => void;
  buyFromMarket: (listingId: string) => void;
  checkAchievements: () => void;
}


export const ACHIEVEMENTS: Achievement[] = [
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
      season: 'Spring',
      inventory: {
        'supplies': 5,
        'genetic-test': 2,
        'pedigree-analysis': 2,
      },
      seniorShowWinners: [],
      showReports: [],
      whelpingReports: [],
      pregnancyList: [],
      kennelCapacity: 5,
      npcStuds: {},
      bisWins: 0,
      bestMaleWins: 0,
      bestFemaleWins: 0,
      totalShowPoints: 0,
      forumCategories: [
        { id: 'general', name: 'General Discussion', description: 'Talk about anything fox-related!', icon: 'MessageSquare' },
        { id: 'breeding', name: 'Breeding Tips', description: 'Share your genetic discoveries.', icon: 'Heart' },
        { id: 'shows', name: 'Show Results', description: 'Celebrate your wins!', icon: 'Trophy' },
        { id: 'market', name: 'Trading', description: 'Buy, sell, and trade foxes.', icon: 'Store' },
      ],
      forumPosts: [],
      isAdmin: false,
      showConfig: {
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
      members: [],
      adminLogs: [],

      checkAchievements: () => {
        const state = get();
        ACHIEVEMENTS.forEach(ach => {
          if (!state.unlockedAchievements.includes(ach.id) && ach.condition(state)) {
            ach.reward();
            set(s => ({ unlockedAchievements: [...s.unlockedAchievements, ach.id] }));
          }
        });
      },

      advanceTime: () => set((state) => {
        const seasons: ('Spring' | 'Summer' | 'Autumn' | 'Winter')[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
        const currentIndex = seasons.indexOf(state.season);
        const nextIndex = (currentIndex + 1) % 4;
        const nextSeason = seasons[nextIndex];
        const nextYear = nextIndex === 0 ? state.year + 1 : state.year;

        const updatedFoxes = { ...state.foxes };
        const newWhelpingReports = [...state.whelpingReports];
        const newPregnancyList: Pregnancy[] = [];

        if (nextSeason === 'Spring') {
          state.pregnancyList.forEach(preg => {
            const mother = updatedFoxes[preg.motherId];
            if (mother) {
              const numKits = Math.floor(Math.random() * 4) + 1;
              const kits = [];
              for (let i = 0; i < numKits; i++) {
                const kitGenotype = breed(mother.genotype, preg.fatherGenotype);
                if (kitGenotype) {
                  const kit = createFox({
                    name: `Kit ${i + 1} of ${mother.name}`,
                    genotype: kitGenotype,
                    parents: [preg.fatherId, mother.id],
                    birthYear: nextYear,
                  });
                  updatedFoxes[kit.id] = kit;
                  kits.push(kit);
                }
              }
              newWhelpingReports.unshift({ motherName: mother.name, kits: kits.map(k => ({ name: k.name, phenotype: k.phenotype, baseColor: k.baseColor, pattern: k.pattern, eyeColor: k.eyeColor, isStillborn: false })) });
            }
          });
          
          Object.values(updatedFoxes).forEach(fox => {
            fox.age += 1;
            if (fox.age > 12 && Math.random() > 0.7) {
              fox.isRetired = true;
            }
          });
        }

        return {
          season: nextSeason,
          year: nextYear,
          foxes: updatedFoxes,
          whelpingReports: newWhelpingReports.slice(0, 10),
          pregnancyList: newPregnancyList,
        };
      }),

      breedFoxes: (maleId, femaleId) => {
        const { foxes, season, year } = get();
        const male = foxes[maleId];
        const female = foxes[femaleId];
        if (!male || !female || season !== 'Winter') return;

        set((state) => ({
          pregnancyList: [
            ...state.pregnancyList,
            {
              motherId: femaleId,
              fatherId: maleId,
              fatherGenotype: male.genotype,
              fatherStats: male.stats,
              fatherSilverIntensity: male.silverIntensity,
              dueYear: state.year + 1,
              dueSeason: 'Spring'
            }
          ]
        }));
      },

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      addFox: (fox) => set((state) => ({ foxes: { ...state.foxes, [fox.id]: fox } })),
      sellFox: (id) => set((state) => {
        const newFoxes = { ...state.foxes };
        delete newFoxes[id];
        return { foxes: newFoxes, gold: state.gold + 500 };
      }),

      buyItem: (itemId, price, currency) => set((state) => {
        if (currency === 'gold' && state.gold < price) return state;
        if (currency === 'gems' && state.gems < price) return state;
        return {
          gold: currency === 'gold' ? state.gold - price : state.gold,
          gems: currency === 'gems' ? state.gems - price : state.gems,
          inventory: { ...state.inventory, [itemId]: (state.inventory[itemId] || 0) + 1 }
        };
      }),

      applyItem: (itemId, foxId) => set((state) => {
        const fox = state.foxes[foxId];
        if (!fox || !state.inventory[itemId] || state.inventory[itemId] <= 0) return state;
        
        const newFox = { ...fox };
        if (itemId === 'genetic-test') newFox.genotypeRevealed = true;
        if (itemId === 'pedigree-analysis') newFox.pedigreeAnalyzed = true;
        
        return {
          inventory: { ...state.inventory, [itemId]: state.inventory[itemId] - 1 },
          foxes: { ...state.foxes, [foxId]: newFox }
        };
      }),

      renameFox: (id, newName) => set((state) => ({
        foxes: { ...state.foxes, [id]: { ...state.foxes[id], name: newName, hasBeenRenamed: true } }
      })),

      updateFox: (id, updates) => set((state) => ({
        foxes: { ...state.foxes, [id]: { ...state.foxes[id], ...updates } }
      })),


      addAdminLog: (action: string, details: string) => set((state) => ({
        adminLogs: [{ id: Math.random().toString(36).substring(2, 9), action, details, timestamp: new Date().toISOString() }, ...state.adminLogs].slice(0, 50)
      })),

      adminUpdateFoxStats: (foxId, statsUpdates) => {
        const { foxes } = get();
        if (!foxes[foxId]) return;
        set((state) => ({
          foxes: {
            ...state.foxes,
            [foxId]: {
              ...state.foxes[foxId],
              stats: { ...state.foxes[foxId].stats, ...statsUpdates }
            }
          }
        }));
        get().addAdminLog('Update Fox Stats', `Updated stats for fox ${foxes[foxId].name} (${foxId})`);
      },

      toggleAdminMode: () => set((state) => ({ isAdmin: !state.isAdmin })),
      adminAddCurrency: (goldAmount, gemsAmount) => set((state) => ({ gold: state.gold + goldAmount, gems: state.gems + gemsAmount })),
      adminSetCurrency: (gold, gems) => {
        set({ gold, gems });
        get().addAdminLog('Set Currency', `Gold: ${gold}, Gems: ${gems}`);
      },
      adminAddItem: (itemId, count) => set((state) => ({ inventory: { ...state.inventory, [itemId]: (state.inventory[itemId] || 0) + count } })),
      adminSpawnFox: (name, gender, genotype) => set((state) => {
        const fox = createFox({ name, gender, genotype });
        return { foxes: { ...state.foxes, [fox.id]: fox } };
      }),
      warnMember: (memberId, reason) => set((state) => ({
        members: state.members.map(m => m.id === memberId ? { ...m, warnings: [...m.warnings, reason] } : m)
      })),
      banMember: (memberId) => set((state) => ({
        members: state.members.map(m => m.id === memberId ? { ...m, isBanned: !m.isBanned } : m)
      })),

      runShows: () => {
        const { foxes, season, seniorShowWinners, gold, year, showConfig, hiredGroomer, hiredTrainer, hiredVeterinarian, bisWins, bestMaleWins, bestFemaleWins, totalShowPoints } = get();
        const allFoxes = Object.values(foxes);
        const levels: ShowLevel[] = ['Junior', 'Open', 'Senior'];
        if (season === 'Autumn') levels.push('Championship');

        const updatedFoxes = { ...foxes };
        let newGold = gold;
        const newSeniorWinners = [...seniorShowWinners];
        const newShowReports: ShowReport[] = [];
        let newBisWins = bisWins;
        let newBestMaleWins = bestMaleWins;
        let newBestFemaleWins = bestFemaleWins;
        let newTotalPoints = totalShowPoints;

        levels.forEach(level => {
          let candidates = allFoxes;
          if (level === 'Championship') candidates = allFoxes.filter(f => seniorShowWinners.includes(f.id));
          const report = runShow(level, candidates, year, season, hiredGroomer, hiredTrainer, hiredVeterinarian);
          const config = showConfig[level];
          newShowReports.push(report);

          report.results.forEach(res => {
            const fox = updatedFoxes[res.foxId];
            if (fox) {
              fox.pointsYear += res.pointsAwarded;
              fox.pointsLifetime += res.pointsAwarded;
              newTotalPoints += res.pointsAwarded;
              
              if (res.place === 1) {
                  newGold += config.first;
                  if (res.class === 'Best Adult Male' || res.class === 'Best Juvenile Male') newBestMaleWins++;
                  if (res.class === 'Best Adult Female' || res.class === 'Best Juvenile Female') newBestFemaleWins++;
              }

              if (level === 'Senior' && res.place === 1 && !newSeniorWinners.includes(fox.id)) {
                  newSeniorWinners.push(fox.id);
              }
            }
          });
          
          if (report.bestInShowFoxId) {
            const bisFox = updatedFoxes[report.bestInShowFoxId];
            if (bisFox) {
              bisFox.pointsYear += 5;
              bisFox.pointsLifetime += 5;
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
          showReports: [...newShowReports, ...get().showReports].slice(0, 10),
          bisWins: newBisWins,
          bestMaleWins: newBestMaleWins,
          bestFemaleWins: newBestFemaleWins,
          totalShowPoints: newTotalPoints
        });
        get().checkAchievements();
      },


      buyFoundationalFox: () => set((state) => {
        if (state.gold < 1000) return state;
        const fox = createFoundationalFox();
        return {
          gold: state.gold - 1000,
          foxes: { ...state.foxes, [fox.id]: fox }
        };
      }),

      initializeGame: () => {
        const { foxes, members } = get();
        if (Object.keys(foxes).length > 0) return;
        
        const defaultMembers: Member[] = [
          { id: '1', name: 'RedFoxMaster', level: 45, joined: 'Spring, Year 1', points: 12500, avatarColor: 'bg-orange-500', isBanned: false, warnings: [] },
          { id: '2', name: 'SilverVixen', level: 38, joined: 'Summer, Year 1', points: 9800, avatarColor: 'bg-slate-400', isBanned: false, warnings: [] },
          { id: '3', name: 'ArcticBreeder', level: 32, joined: 'Autumn, Year 1', points: 7200, avatarColor: 'bg-blue-100', isBanned: false, warnings: [] },
          { id: '4', name: 'CrossFoxExpert', level: 29, joined: 'Winter, Year 1', points: 6500, avatarColor: 'bg-amber-700', isBanned: false, warnings: [] },
          { id: '5', name: 'GeneticsGuru', level: 25, joined: 'Spring, Year 2', points: 5100, avatarColor: 'bg-purple-500', isBanned: false, warnings: [] },
        ];

        const starterStats = () => ({
          head: Math.floor(Math.random() * 15) + 5,
          topline: Math.floor(Math.random() * 15) + 5,
          forequarters: Math.floor(Math.random() * 15) + 5,
          hindquarters: Math.floor(Math.random() * 15) + 5,
          tail: Math.floor(Math.random() * 15) + 5,
          coatQuality: Math.floor(Math.random() * 15) + 5,
          temperament: Math.floor(Math.random() * 15) + 5,
          presence: Math.floor(Math.random() * 15) + 5,
          luck: Math.floor(Math.random() * 15) + 5,
          fertility: Math.floor(Math.random() * 50) + 25,
        });

        const maleGenotype = getInitialGenotype();
        Object.assign(maleGenotype, { G: ['G', 'g'] });
        const male = createFox({ name: 'Starter Male', gender: 'Male', genotype: maleGenotype, stats: starterStats() });
        
        const femaleGenotype = getInitialGenotype();
        Object.assign(femaleGenotype, { G: ['G', 'g'] });
        const female = createFox({ name: 'Starter Female', gender: 'Female', genotype: femaleGenotype, stats: starterStats() });
        
        set({ foxes: { [male.id]: male, [female.id]: female }, gold: 10000, gems: 100, members: defaultMembers });
        get().advanceTime();
        get().checkAchievements();
      },

      buyCustomFoundationalFox: (genotype, gender) => set((state) => {
        if (state.gems < 50) return state;
        const fox = createFox({
          name: 'Custom Foundational',
          genotype,
          gender,
          parents: [null, null]
        });
        setTimeout(() => get().checkAchievements(), 0);
        return {
            gems: state.gems - 50,
            foxes: { ...state.foxes, [fox.id]: fox }
        };
      }),

      toggleStudStatus: (foxId, fee) => set((state) => {
        const fox = state.foxes[foxId];
        if (!fox || fox.gender !== 'Male' || fox.age < 2) return state;
        return {
            foxes: {
                ...state.foxes,
                [foxId]: { ...fox, isAtStud: !fox.isAtStud, studFee: fee }
            }
        };
      }),

      hireGroomer: () => set((state) => {
        if (state.gems < 20) return state;
        return {
            gems: state.gems - 20,
            hiredGroomer: true
        };
      }),

      hireVeterinarian: () => set((state) => {
        if (state.gems < 50) return state;
        return {
            gems: state.gems - 50,
            hiredVeterinarian: true
        };
      }),

      hireTrainer: () => set((state) => {
        if (state.gems < 40) return state;
        return {
            gems: state.gems - 40,
            hiredTrainer: true
        };
      }),

      addForumPost: (categoryId, title, content, author) => set((state) => ({
        forumPosts: [
          ...state.forumPosts,
          {
            id: Math.random().toString(36).substring(2, 9),
            categoryId,
            author,
            title,
            content,
            createdAt: new Date().toISOString()
          }
        ]
      })),

      addForumCategory: (name, description, icon) => set((state) => ({
        forumCategories: [
          ...state.forumCategories,
          {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            description,
            icon
          }
        ]
      })),

      updateShowConfig: (level, updates) => set((state) => ({
        showConfig: {
          ...state.showConfig,
          [level]: { ...state.showConfig[level], ...updates }
        }
      })),

      listFoxOnMarket: (foxId, price, currency) => set((state) => {
        const fox = state.foxes[foxId];
        if (!fox) return state;
        const newListing: MarketListing = {
          id: Math.random().toString(36).substring(2, 9),
          sellerId: 'player',
          sellerName: 'You',
          type: 'fox',
          targetId: foxId,
          price,
          currency,
          createdAt: new Date().toISOString(),
          foxData: fox
        };
        const newFoxes = { ...state.foxes };
        delete newFoxes[foxId];
        setTimeout(() => get().checkAchievements(), 0);
        return {
          marketListings: [newListing, ...state.marketListings],
          foxes: newFoxes
        };
      }),

      listItemOnMarket: (itemId, price, currency) => set((state) => {
        if (!state.inventory[itemId] || state.inventory[itemId] <= 0) return state;
        const newListing: MarketListing = {
          id: Math.random().toString(36).substring(2, 9),
          sellerId: 'player',
          sellerName: 'You',
          type: 'item',
          targetId: itemId,
          price,
          currency,
          createdAt: new Date().toISOString()
        };
        const newInventory = { ...state.inventory, [itemId]: state.inventory[itemId] - 1 };
        setTimeout(() => get().checkAchievements(), 0);
        return {
          marketListings: [newListing, ...state.marketListings],
          inventory: newInventory
        };
      }),

      cancelListing: (listingId) => set((state) => {
        const listing = state.marketListings.find(l => l.id === listingId);
        if (!listing || listing.sellerId !== 'player') return state;
        
        const newMarket = state.marketListings.filter(l => l.id !== listingId);
        if (listing.type === 'fox' && listing.foxData) {
          return {
            marketListings: newMarket,
            foxes: { ...state.foxes, [listing.foxData.id]: listing.foxData }
          };
        } else {
          return {
            marketListings: newMarket,
            inventory: { ...state.inventory, [listing.targetId]: (state.inventory[listing.targetId] || 0) + 1 }
          };
        }
      }),

      buyFromMarket: (listingId) => set((state) => {
        const listing = state.marketListings.find(l => l.id === listingId);
        if (!listing || listing.sellerId === 'player') return state;

        if (listing.currency === 'gold' && state.gold < listing.price) return state;
        if (listing.currency === 'gems' && state.gems < listing.price) return state;

        const newMarket = state.marketListings.filter(l => l.id !== listingId);
        const newGold = listing.currency === 'gold' ? state.gold - listing.price : state.gold;
        const newGems = listing.currency === 'gems' ? state.gems - listing.price : state.gems;

        if (listing.type === 'fox' && listing.foxData) {
          return {
            marketListings: newMarket,
            gold: newGold,
            gems: newGems,
            foxes: { ...state.foxes, [listing.foxData.id]: listing.foxData }
          };
        } else {
          return {
            marketListings: newMarket,
            gold: newGold,
            gems: newGems,
            inventory: { ...state.inventory, [listing.targetId]: (state.inventory[listing.targetId] || 0) + 1 }
          };
        }
      }),
    }),
    { 
      name: 'red-fox-sim-storage',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['isAdmin'].includes(key))
      ) as GameState
    }
  )
);
