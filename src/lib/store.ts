'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Fox, createFox, breed, getPhenotype, createFoundationalFox, getInitialGenotype, ShowLevel, Genotype } from './genetics';
import { runShow, ShowReport } from './showing';

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

export interface WhelpingReport {
  motherName: string;
  kits: { name: string; phenotype: string; isStillborn: boolean }[];
}

export interface Pregnancy {
  motherId: string;
  fatherId: string;
  fatherGenotype: Genotype;
  fatherStats: Record<string, number>;
  fatherSilverIntensity: number;
  dueYear: number;
  dueSeason: string;
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
  toggleStudStatus: (foxId: string, fee: number) => void;
  hireGroomer: () => void;
  hireVeterinarian: () => void;
  hireTrainer: () => void;
  addForumPost: (categoryId: string, title: string, content: string, author: string) => void;
  addForumCategory: (name: string, description: string, icon: string) => void;
  updateShowConfig: (level: string, updates: Partial<ShowConfig>) => void;
  
  // Marketplace Actions
  listFoxOnMarket: (foxId: string, price: number, currency: 'gold' | 'gems') => void;
  listItemOnMarket: (itemId: string, price: number, currency: 'gold' | 'gems') => void;
  cancelListing: (listingId: string) => void;
  buyFromMarket: (listingId: string) => void;

  // Achievement Actions
  checkAchievements: () => void;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_fox',
    name: 'First Steps',
    description: 'Own your first fox.',
    rewardText: '500 Gold',
    reward: () => useGameStore.getState().addGold(500),
    condition: (state) => Object.keys(state.foxes).length >= 1
  },
  {
    id: 'breeder_debut',
    name: 'Winter Breeder',
    description: 'Have a successful pregnancy in your kennel.',
    rewardText: '100 Gems',
    reward: () => useGameStore.getState().addGems(100),
    condition: (state) => state.pregnancyList.length > 0
  },
  {
    id: 'bis_winner',
    name: 'Show Stopper',
    description: 'Win your first Best in Show.',
    rewardText: '250 Gold',
    reward: () => useGameStore.getState().addGold(250),
    condition: (state) => state.bisWins > 0
  },
  {
    id: 'market_mogul',
    name: 'Market Mogul',
    description: 'List something on the marketplace.',
    rewardText: '50 Gems',
    reward: () => useGameStore.getState().addGems(50),
    condition: (state) => state.marketListings.some(l => l.sellerId === 'player')
  },
  {
    id: 'high_roller',
    name: 'High Roller',
    description: 'Accumulate 50,000 Gold.',
    rewardText: '200 Gems',
    reward: () => useGameStore.getState().addGems(200),
    condition: (state) => state.gold >= 50000
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      foxes: {},
      gold: 1000,
      gems: 50,
      year: 1,
      season: 'Spring',
      inventory: { 'supplies': 5, 'genetic-test': 2 },
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
      isAdmin: true,
      marketListings: [],
      unlockedAchievements: [],
      forumCategories: [
        { id: 'announcements', name: 'Announcements', description: 'Official game updates and news.', icon: 'Megaphone' },
        { id: 'general', name: 'General Discussion', description: 'Talk about anything fox related.', icon: 'MessageSquare' },
        { id: 'genetics', name: 'Genetics Lab', description: 'Discuss mutations, breeding strategies and COI.', icon: 'Microscope' },
        { id: 'trades', name: 'Market & Trades', description: 'Find specific foxes or items for trade.', icon: 'ShoppingBag' },
        { id: 'brags', name: 'Show Results & Brags', description: 'Share your latest wins and beautiful foxes.', icon: 'Trophy' },
      ],
      forumPosts: [],
      showConfig: {
        Junior: { bis: 100, first: 50, second: 25, third: 10 },
        Open: { bis: 250, first: 100, second: 50, third: 25 },
        Senior: { bis: 500, first: 250, second: 125, third: 50 },
        Championship: { bis: 2000, first: 1000, second: 500, third: 250 },
      },

      hiredGroomer: false,
      hiredVeterinarian: false,
      hiredTrainer: false,

      advanceTime: () => set((state) => {
        const seasons: ('Spring' | 'Summer' | 'Autumn' | 'Winter')[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
        const currentIdx = seasons.indexOf(state.season);
        const nextIdx = (currentIdx + 1) % 4;
        const nextSeason = seasons[nextIdx];
        const nextYear = nextIdx === 0 ? state.year + 1 : state.year;

        const updatedFoxes = { ...state.foxes };
        if (nextYear > state.year) {
          Object.keys(updatedFoxes).forEach(id => {
            updatedFoxes[id].age += 1;
            updatedFoxes[id].pointsYear = 0;
            if (updatedFoxes[id].age >= 12) updatedFoxes[id].isRetired = true;
          });
        }

        const newWhelpingReports = [...state.whelpingReports];
        let newPregnancyList = [...state.pregnancyList];
        if (nextSeason === 'Spring') {
          state.pregnancyList.forEach(p => {
            const mother = updatedFoxes[p.motherId];
            if (mother) {
              const numKits = Math.floor(Math.random() * 5) + 1;
              const kits = [];
              for (let i = 0; i < numKits; i++) {
                const kitGenotype = breed(p.fatherGenotype, mother.genotype);
                if (kitGenotype) {
                  const kit = createFox({
                    name: `${mother.name} Kit ${i + 1}`,
                    gender: Math.random() > 0.5 ? 'Male' : 'Female',
                    genotype: kitGenotype,
                    parents: [p.fatherId, mother.id],
                    stats: Object.fromEntries(Object.entries(p.fatherStats).map(([k, v]) => [k, Math.floor((v as number + (mother.stats[k as keyof typeof mother.stats] as number)) / 2) + (Math.floor(Math.random() * 5) - 2)])),
                    silverIntensity: Math.floor((p.fatherSilverIntensity + mother.silverIntensity) / 2)
                  } as unknown as Fox);
                  updatedFoxes[kit.id] = kit;
                  kits.push(kit);
                }
              }
              newWhelpingReports.unshift({ motherName: mother.name, kits: kits.map(k => ({ name: k.name, phenotype: k.phenotype, isStillborn: false })) });
            }
          });
          newPregnancyList = [];
        }

        // Generate NPC Studs
        const newNPCs: Record<string, Fox> = {};
        for (let i = 0; i < 5; i++) {
          const npc = createFoundationalFox();
          npc.name = `Foundation Stud ${i + 1}`;
          npc.gender = 'Male';
          npc.age = Math.floor(Math.random() * 6) + 2;
          npc.studFee = 1000 + Math.floor(Math.random() * 9000);
          newNPCs[npc.id] = npc;
        }

        // Update Marketplace (NPCs)
        let newMarket = [...state.marketListings];
        newMarket = newMarket.filter(l => l.sellerId === 'player' || Math.random() > 0.3);
        if (newMarket.length < 15) {
          for (let i = 0; i < 3; i++) {
             const type = Math.random() > 0.5 ? 'fox' : 'item';
             if (type === 'fox') {
                const f = createFoundationalFox();
                f.name = `NPC Fox ${Math.floor(Math.random()*100)}`;
                newMarket.push({
                   id: Math.random().toString(36).substring(2, 9),
                   sellerId: 'npc',
                   sellerName: 'Global Exotics',
                   type: 'fox',
                   targetId: f.id,
                   price: 2000 + Math.floor(Math.random() * 8000),
                   currency: Math.random() > 0.8 ? 'gems' : 'gold',
                   createdAt: new Date().toISOString(),
                   foxData: f
                });
             } else {
                const items = ['genetic-test', 'pedigree-analysis', 'supplies', 'feed-coatQuality', 'feed-presence'];
                const item = items[Math.floor(Math.random() * items.length)];
                newMarket.push({
                   id: Math.random().toString(36).substring(2, 9),
                   sellerId: 'npc',
                   sellerName: 'Ranch Supplies Co',
                   type: 'item',
                   targetId: item,
                   price: 100 + Math.floor(Math.random() * 400),
                   currency: 'gold',
                   createdAt: new Date().toISOString()
                });
             }
          }
        }

        setTimeout(() => get().checkAchievements(), 0);

        return { 
          season: nextSeason, 
          year: nextYear, 
          foxes: updatedFoxes, 
          whelpingReports: newWhelpingReports.slice(0, 10),
          pregnancyList: newPregnancyList,
          npcStuds: newNPCs,
          marketListings: newMarket,
          seniorShowWinners: nextYear > state.year ? [] : state.seniorShowWinners
        };
      }),

      checkAchievements: () => {
        const state = get();
        const newUnlocked = [...state.unlockedAchievements];
        let changed = false;

        ACHIEVEMENTS.forEach(ach => {
          if (!newUnlocked.includes(ach.id) && ach.condition(state)) {
            newUnlocked.push(ach.id);
            ach.reward();
            changed = true;
          }
        });

        if (changed) {
          set({ unlockedAchievements: newUnlocked });
        }
      },

      breedFoxes: (maleId, femaleId) => {
        const { foxes, npcStuds, year } = get();
        const father = foxes[maleId] || npcStuds[maleId];
        const mother = foxes[femaleId];
        if (!father || !mother || mother.gender !== 'Female') return;

        set((state) => ({
          pregnancyList: [
            ...state.pregnancyList,
            { 
                motherId: femaleId, 
                fatherId: maleId, 
                fatherGenotype: father.genotype,
                fatherStats: father.stats,
                fatherSilverIntensity: father.silverIntensity,
                dueYear: year + 1, 
                dueSeason: 'Spring' 
            }
          ]
        }));
        get().checkAchievements();
      },

      addGold: (amount) => set((state) => ({ gold: state.gold + amount })),
      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      addFox: (fox) => {
        set((state) => ({ foxes: { ...state.foxes, [fox.id]: fox } }));
        get().checkAchievements();
      },

      sellFox: (id) => set((state) => {
        const fox = state.foxes[id];
        if (!fox || fox.isRetired) return state;
        const sellPrice = 500 + (fox.pointsLifetime * 10);
        const newFoxes = { ...state.foxes };
        delete newFoxes[id];
        setTimeout(() => get().checkAchievements(), 0);
        return { foxes: newFoxes, gold: state.gold + sellPrice };
      }),

      buyItem: (itemId, price, currency) => set((state) => {
        if (currency === 'gold' && state.gold < price) return state;
        if (currency === 'gems' && state.gems < price) return state;
        setTimeout(() => get().checkAchievements(), 0);
        return {
          gold: currency === 'gold' ? state.gold - price : state.gold,
          gems: currency === 'gems' ? state.gems - price : state.gems,
          inventory: { ...state.inventory, [itemId]: (state.inventory[itemId] || 0) + 1 }
        };
      }),

      applyItem: (itemId, foxId) => set((state) => {
        if (!state.inventory[itemId] || state.inventory[itemId] <= 0) return state;
        const newInventory = { ...state.inventory, [itemId]: state.inventory[itemId] - 1 };
        const newFoxes = { ...state.foxes };
        if (itemId === 'genetic-test' && foxId && newFoxes[foxId]) {
          const fox = newFoxes[foxId];
          const revealed = true;
          const phenotype = getPhenotype(fox.genotype, revealed);
          newFoxes[foxId] = { ...fox, genotypeRevealed: revealed, phenotype: phenotype.name };
        } else if (itemId === 'pedigree-analysis' && foxId && newFoxes[foxId]) {
          newFoxes[foxId] = { ...newFoxes[foxId], pedigreeAnalyzed: true };
        } else if (itemId === 'supplies' && foxId && newFoxes[foxId]) {
          newFoxes[foxId] = { ...newFoxes[foxId], lastFed: Date.now() };
        } else if (itemId.startsWith('feed-') && foxId && newFoxes[foxId]) {
          const statKey = itemId.replace('feed-', '');
          const fox = newFoxes[foxId];
          const newBoosts = { ...(fox.boosts || {}) };
          newBoosts[statKey] = Date.now() + (7 * 24 * 60 * 60 * 1000);
          newFoxes[foxId] = { ...fox, boosts: newBoosts };
        }
        return { inventory: newInventory, foxes: newFoxes };
      }),

      renameFox: (id, newName) => set((state) => {
        const fox = state.foxes[id];
        if (!fox || fox.hasBeenRenamed) return state;
        const trimmedName = newName.trim();
        if (trimmedName.length > 20 || trimmedName.length === 0) return state;
        if (!/^[A-Za-z\s]+$/.test(trimmedName)) return state;
        if (Object.values(state.foxes).some(f => f.name.toLowerCase() === trimmedName.toLowerCase())) return state;
        return { foxes: { ...state.foxes, [id]: { ...fox, name: trimmedName, hasBeenRenamed: true } } };
      }),

      updateFox: (id, updates) => set((state) => ({
        foxes: { ...state.foxes, [id]: { ...state.foxes[id], ...updates } }
      })),

      toggleAdminMode: () => set((state) => ({ isAdmin: !state.isAdmin })),

      buyFoundationalFox: () => set((state) => {
        if (state.gold < 5000) return state;
        if (Object.keys(state.foxes).length >= state.kennelCapacity) return state;
        const fox = createFoundationalFox();
        setTimeout(() => get().checkAchievements(), 0);
        return { gold: state.gold - 5000, foxes: { ...state.foxes, [fox.id]: fox } };
      }),

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

      initializeGame: () => {
        const { foxes } = get();
        if (Object.keys(foxes).length > 0) return;
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
        
        set({ foxes: { [male.id]: male, [female.id]: female }, gold: 10000, gems: 100 });
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
