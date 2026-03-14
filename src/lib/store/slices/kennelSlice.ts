import { StateCreator } from "zustand";
import { GameState, RootState } from "../index";
import { Fox, createFoundationalFox, createFoundationFoxCollection, breed, Genotype } from "@/lib/genetics";
import { Pregnancy, WhelpingReport, Member } from "../types";

export interface KennelSlice {
  foxes: Record<string, Fox>;
  nextFoxId: number;
  lastAdoptionReset: string;
  inventory: Record<string, number>;
  npcStuds: Record<string, Fox>;
  pregnancyList: Pregnancy[];
  whelpingReports: WhelpingReport[];
  hiredGroomer: boolean;
  hiredVeterinarian: boolean;
  hiredTrainer: boolean;
  hiredGeneticist: boolean;
  hiredNutritionist: boolean;
  hiredHandler: boolean;
  kennelCapacity: number;

  // Actions
  addFox: (fox: Fox) => void;
  updateFox: (foxId: string, updates: Partial<Fox>) => void;
  removeFox: (foxId: string) => void;
  setNextFoxId: (id: number) => void;
  repopulateFoundationFoxes: () => void;
  addPregnancy: (pregnancy: Pregnancy) => void;
  removePregnancy: (motherId: string) => void;
  addWhelpingReport: (report: WhelpingReport) => void;
  hireGroomer: () => void;
  hireVeterinarian: () => void;
  hireTrainer: () => void;
  hireGeneticist: () => void;
  hireNutritionist: () => void;
  hireHandler: () => void;
  feedAllFoxes: () => void;
  groomFox: (foxId: string) => void;
  trainFox: (foxId: string) => void;
  groomAllFoxes: () => void;
  trainAllFoxes: () => void;
  setFoxPreferredFeed: (foxId: string, feedId: string) => void;
  toggleStudStatus: (foxId: string, fee?: number) => void;

  breedFoxes: (dogId: string, vixenId: string) => void;
  buyFoundationFox: (foxId: string) => void;
  buyCustomFoundationalFox: (genotype: Genotype, gender: "Dog" | "Vixen", name?: string, eyeColor?: string) => void;
  sellFox: (id: string) => void;
  retireFox: (id: string) => void;
  renameFox: (id: string, newName: string) => void;
  spayNeuterFox: (id: string) => void;
  expandKennel: () => void;
  buyItem: (itemId: string, price: number, currency: "gold" | "gems", quantity?: number) => void;
  applyItem: (itemId: string, foxId: string) => void;
}

export const createKennelSlice: StateCreator<RootState, [], [], KennelSlice> = (set, get) => ({
  foxes: {},
  nextFoxId: 100,
  lastAdoptionReset: new Date().toISOString(),
  inventory: {},
  npcStuds: {},
  pregnancyList: [],
  whelpingReports: [],
  hiredGroomer: false,
  hiredVeterinarian: false,
  hiredTrainer: false,
  hiredGeneticist: false,
  hiredNutritionist: false,
  hiredHandler: false,
  kennelCapacity: 20,

  addFox: (fox) => set((state: any) => ({ foxes: { ...state.foxes, [fox.id]: fox } })),
  updateFox: (foxId, updates) => set((state: any) => ({
    foxes: {
      ...state.foxes,
      [foxId]: { ...state.foxes[foxId], ...updates }
    }
  })),
  removeFox: (foxId) => set((state: any) => {
    const { [foxId]: removed, ...remaining } = state.foxes;
    return { foxes: remaining };
  }),
  setNextFoxId: (id) => set({ nextFoxId: id }),
  repopulateFoundationFoxes: () => set((state: any) => {
    const updatedFoxes = { ...state.foxes };
    Object.keys(updatedFoxes).forEach(id => {
      if (updatedFoxes[id].isFoundation && updatedFoxes[id].ownerId === 'system') {
        delete updatedFoxes[id];
      }
    });

    const newFoxes = createFoundationFoxCollection(Math.random, state.nextFoxId);
    newFoxes.forEach(f => {
      updatedFoxes[f.id] = {
        ...f,
        isFoundation: true,
        ownerId: 'system',
        age: 0
      };
    });

    return {
      foxes: updatedFoxes,
      nextFoxId: state.nextFoxId + newFoxes.length,
      lastAdoptionReset: new Date().toISOString()
    };
  }),
  addPregnancy: (p) => set((state: any) => ({ pregnancyList: [...state.pregnancyList, p] })),
  removePregnancy: (motherId) => set((state: any) => ({
    pregnancyList: state.pregnancyList.filter((p: Pregnancy) => p.motherId !== motherId)
  })),
  addWhelpingReport: (r) => set((state: any) => ({ whelpingReports: [r, ...state.whelpingReports] })),
  hireGroomer: () => set((state: any) => {
    if (state.gems < 20) return state;
    return { gems: state.gems - 20, hiredGroomer: true };
  }),
  hireVeterinarian: () => set((state: any) => {
    if (state.gems < 50) return state;
    return { gems: state.gems - 50, hiredVeterinarian: true };
  }),
  hireTrainer: () => set((state: any) => {
    if (state.gems < 40) return state;
    return { gems: state.gems - 40, hiredTrainer: true };
  }),
  hireGeneticist: () => set((state: any) => {
    if (state.gems < 100) return state;
    return { gems: state.gems - 100, hiredGeneticist: true };
  }),
  hireNutritionist: () => set((state: any) => {
    if (state.gems < 30) return state;
    return { gems: state.gems - 30, hiredNutritionist: true };
  }),
  hireHandler: () => set((state: any) => {
    if (state.gems < 75) return state;
    return { gems: state.gems - 75, hiredHandler: true };
  }),
  feedAllFoxes: () => set((state: any) => {
    const updatedFoxes = { ...state.foxes };
    const now = Date.now();
    Object.keys(updatedFoxes).forEach(id => {
      if (updatedFoxes[id].ownerId === state.currentMemberId) {
        updatedFoxes[id] = { ...updatedFoxes[id], lastFed: now };
      }
    });
    return { foxes: updatedFoxes };
  }),
  groomFox: (foxId) => set((state: any) => ({
    foxes: {
      ...state.foxes,
      [foxId]: { ...state.foxes[foxId], lastGroomed: Date.now() }
    }
  })),
  trainFox: (foxId) => set((state: any) => ({
    foxes: {
      ...state.foxes,
      [foxId]: { ...state.foxes[foxId], lastTrained: Date.now() }
    }
  })),
  groomAllFoxes: () => set((state: any) => {
    const updatedFoxes = { ...state.foxes };
    const now = Date.now();
    Object.keys(updatedFoxes).forEach(id => {
      if (updatedFoxes[id].ownerId === state.currentMemberId) {
        updatedFoxes[id] = { ...updatedFoxes[id], lastGroomed: now };
      }
    });
    return { foxes: updatedFoxes };
  }),
  trainAllFoxes: () => set((state: any) => {
    const updatedFoxes = { ...state.foxes };
    const now = Date.now();
    Object.keys(updatedFoxes).forEach(id => {
      if (updatedFoxes[id].ownerId === state.currentMemberId) {
        updatedFoxes[id] = { ...updatedFoxes[id], lastTrained: now };
      }
    });
    return { foxes: updatedFoxes };
  }),
  setFoxPreferredFeed: (foxId, feedId) => set((state: any) => ({
    foxes: {
      ...state.foxes,
      [foxId]: { ...state.foxes[foxId], preferredFeed: feedId }
    }
  })),
  toggleStudStatus: (foxId, fee) => set((state: any) => ({
    foxes: {
      ...state.foxes,
      [foxId]: {
        ...state.foxes[foxId],
        isStud: !state.foxes[foxId].isStud,
        studFee: fee !== undefined ? fee : state.foxes[foxId].studFee
      }
    }
  })),

  breedFoxes: (dogId, vixenId) => set((state: any) => {
    const dog = state.foxes[dogId] || state.npcStuds[dogId];
    const vixen = state.foxes[vixenId];
    if (!dog || !vixen) return state;

    const outcomes = breed(dog, vixen, Math.random, state.nextFoxId);
    const whelpDate = Date.now() + 1000 * 60 * 60 * 24;

    return {
      pregnancyList: [...state.pregnancyList, {
        sireId: dogId,
        damId: vixenId,
        motherId: vixenId,
        whelpDate,
        kitCount: outcomes.length
      }]
    };
  }),
  buyFoundationFox: (foxId) => set((state: any) => {
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
              details: `Adopted from Foundation Store by ${state.members.find((m: Member) => m.id === state.currentMemberId)?.name || 'Breeder'}`
            }
          ]
        }
      }
    };
  }),
  buyCustomFoundationalFox: (genotype, gender, name, eyeColor) => set((state: any) => {
    if (state.gems < 50) return state;
    const newFox = createFoundationalFox(Math.random, gender);
    newFox.id = state.nextFoxId.toString();
    newFox.genotype = genotype;
    if (name) newFox.name = name;
    if (eyeColor) newFox.eyeColor = eyeColor;
    newFox.ownerId = state.currentMemberId;

    return {
      gems: state.gems - 50,
      nextFoxId: state.nextFoxId + 1,
      foxes: { ...state.foxes, [newFox.id]: newFox }
    };
  }),
  sellFox: (id) => set((state: any) => {
    const { [id]: removed, ...remaining } = state.foxes;
    return { foxes: remaining, gold: state.gold + 500 };
  }),
  retireFox: (id) => set((state: any) => ({
    foxes: { ...state.foxes, [id]: { ...state.foxes[id], isRetired: true } }
  })),
  renameFox: (id, newName) => set((state: any) => ({
    foxes: { ...state.foxes, [id]: { ...state.foxes[id], name: newName } }
  })),
  spayNeuterFox: (id) => set((state: any) => ({
    foxes: { ...state.foxes, [id]: { ...state.foxes[id], isAltered: true } }
  })),
  expandKennel: () => set((state: any) => {
    if (state.gold < 5000) return state;
    return { gold: state.gold - 5000, kennelCapacity: state.kennelCapacity + 5 };
  }),
  buyItem: (itemId, price, currency, quantity = 1) => set((state: any) => {
    const cost = price * quantity;
    if (currency === "gold" && state.gold < cost) return state;
    if (currency === "gems" && state.gems < cost) return state;

    return {
      gold: currency === "gold" ? state.gold - cost : state.gold,
      gems: currency === "gems" ? state.gems - cost : state.gems,
      inventory: {
        ...state.inventory,
        [itemId]: (state.inventory[itemId] || 0) + quantity
      }
    };
  }),
  applyItem: (itemId, foxId) => set((state: any) => {
    if (!state.inventory[itemId] || state.inventory[itemId] <= 0) return state;
    return {
      inventory: { ...state.inventory, [itemId]: state.inventory[itemId] - 1 }
    };
  }),
});
