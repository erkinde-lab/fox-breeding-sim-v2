import { StateCreator } from "zustand";
import { RootState } from "../index";
import { Member, Role } from "../types";

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
      gameSeason: nextSeason,
      gameYear: nextSeason === "Spring" ? state.gameYear + 1 : state.gameYear,
      foxes: updatedFoxes,
      shows: [] // Clear shows for the new season
    };
  }),
  resetGame: () => {
    // This is handled by clear storage in persist normally,
    // but here we can reset to initial state if needed
  },
  adminUpdateMemberInventory: (memberId, itemId, count) => set((state: any) => ({
    inventory: {
      ...state.inventory,
      [`${memberId}:${itemId}`]: (state.inventory[`${memberId}:${itemId}`] || 0) + count
    }
  })),
  adminRemoveItemFromInventory: (memberId, itemId) => set((state: any) => {
    const newInventory = { ...state.inventory };
    delete newInventory[`${memberId}:${itemId}`];
    return { inventory: newInventory };
  }),
  adminAddCurrency: (gold, gems) => set((state: any) => ({
    gold: state.gold + gold,
    gems: state.gems + gems
  })),
  adminSetCurrency: (updates) => set(updates),
  adminSpawnFox: (name, gender, genotype) => {
    // Complex logic usually goes here or calls a utility
  },
  adminUpdateFoxStats: (foxId, stats) => set((state: any) => ({
    foxes: {
      ...state.foxes,
      [foxId]: { ...state.foxes[foxId], stats: { ...state.foxes[foxId].stats, ...stats } }
    }
  })),
});
