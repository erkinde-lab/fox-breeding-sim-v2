import { StateCreator } from "zustand";
import { RootState } from "../index";
import { Member, Role } from "../types";
import { breed, createFox, getPhenotype } from "@/lib/genetics";

export interface GameSlice {
  year: number;
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  gameYear: number;
  gameSeason: "Spring" | "Summer" | "Autumn" | "Winter";
  joiningYear: number;

  // Actions
  advanceTime: () => void;
  resetGame: () => void;
  adminUpdateMemberInventory: (memberId: string, itemId: string, count: number) => void;
  adminRemoveItemFromInventory: (memberId: string, itemId: string) => void;
  adminAddCurrency: (gold: number, gems: number) => void;
  adminSetCurrency: (updates: { gold?: number; gems?: number }) => void;
  adminSpawnFox: (name: string, gender: "Dog" | "Vixen", genotype: any) => void;
  adminUpdateFoxStats: (foxId: string, stats: any) => void;
}

export const createGameSlice: StateCreator<RootState, [], [], GameSlice> = (set) => ({
  year: 1,
  season: "Spring",
  gameYear: 1,
  gameSeason: "Spring",
  joiningYear: 1,

  advanceTime: () => set((state: any) => {
    const seasons = ["Spring", "Summer", "Autumn", "Winter"] as const;
    const currentIdx = seasons.indexOf(state.season);
    const nextSeason = seasons[(currentIdx + 1) % 4];
    const isSpring = nextSeason === "Spring";
    const newYear = isSpring ? state.year + 1 : state.year;

    // Reset care flags and handle aging
    const updatedFoxes = { ...state.foxes };
    Object.keys(updatedFoxes).forEach(id => {
      const updates: any = {
        lastFed: undefined,
        lastGroomed: undefined,
        lastTrained: undefined
      };

      // Age up existing foxes at the start of Spring
      if (isSpring) {
        updates.age = (updatedFoxes[id].age || 0) + 1;
      }

      updatedFoxes[id] = {
        ...updatedFoxes[id],
        ...updates
      };
    });

    let updatedWhelpingReports = [...(state.whelpingReports || [])];
    let nextFoxId = state.nextFoxId;

    if (isSpring) {
      // Process all pregnancies
      state.pregnancyList.forEach((preg: any) => {
        const dog = state.foxes[preg.sireId] || state.npcStuds[preg.sireId];
        const vixen = state.foxes[preg.damId];

        if (dog && vixen) {
          const kits = breed(dog, vixen, Math.random, nextFoxId);
          kits.forEach(kit => {
            kit.birthYear = newYear;
            // Reveal genotype if Geneticist hired
            if (state.hiredGeneticist) {
              kit.genotypeRevealed = true;
            }
            updatedFoxes[kit.id] = kit;
          });

          updatedWhelpingReports.unshift({
            id: Math.random().toString(),
            damId: vixen.id,
            sireId: dog.id,
            motherName: vixen.name,
            fatherName: dog.name,
            kitIds: kits.map(k => k.id),
            kits: kits.map(k => k.phenotype),
            date: new Date().toISOString()
          });

          nextFoxId += kits.length;
        }
      });
    }

    return {
      season: nextSeason,
      year: newYear,
      gameSeason: nextSeason,
      gameYear: isSpring ? state.gameYear + 1 : state.gameYear,
      foxes: updatedFoxes,
      whelpingReports: updatedWhelpingReports,
      pregnancyList: isSpring ? [] : state.pregnancyList,
      nextFoxId,
      shows: [] // Clear shows for the new season
    };
  }),
  resetGame: () => {
    // Basic reset - in a real app this might clear localStorage
    set({
      year: 1,
      season: "Spring",
      gameYear: 1,
      gameSeason: "Spring",
      foxes: {},
      inventory: {},
      gold: 5000,
      gems: 100,
      pregnancyList: [],
      whelpingReports: []
    } as any);
  },
  adminUpdateMemberInventory: (memberId, itemId, count) => set((state: any) => ({
    inventory: {
      ...state.inventory,
      [`${memberId}:${itemId}`]: (state.inventory[`${memberId}:${itemId}` || 0) + count
    }
  })),
  adminRemoveItemFromInventory: (memberId, itemId) => set((state: any) => {
    const newInventory = { ...state.inventory };
    delete newInventory[`${memberId}:${itemId}`];
    return { inventory: newInventory };
  }),
  adminAddCurrency: (gold, gems) => set((state: any) => ({
    gold: (state.gold || 0) + gold,
    gems: (state.gems || 0) + gems
  })),
  adminSetCurrency: (updates) => set(updates as any),
  adminSpawnFox: (name, gender, genotype) => set((state: any) => {
    const newFox = createFox({
      id: state.nextFoxId.toString(),
      name,
      gender,
      genotype,
      ownerId: state.currentMemberId,
      genotypeRevealed: true,
      birthYear: state.year
    }, Math.random);

    return {
      foxes: { ...state.foxes, [newFox.id]: newFox },
      nextFoxId: state.nextFoxId + 1
    };
  }),
  adminUpdateFoxStats: (foxId, stats) => set((state: any) => {
    if (!state.foxes[foxId]) return state;
    return {
      foxes: {
        ...state.foxes,
        [foxId]: {
          ...state.foxes[foxId],
          stats: { ...state.foxes[foxId].stats, ...stats }
        }
      }
    };
  }),
});
