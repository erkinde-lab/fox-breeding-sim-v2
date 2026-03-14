import { StateCreator } from "zustand";
import { RootState } from "../index";
import { MarketListing, Fox } from "../types";
import { createFoundationalFox } from "@/lib/genetics";

export interface MarketSlice {
  marketListings: MarketListing[];

  // Actions
  buyFromMarket: (listingId: string) => void;
  cancelListing: (listingId: string) => void;
  updateMarketListing: (listingId: string, updates: Partial<MarketListing>) => void;
  listItemOnMarket: (type: "fox" | "item", targetId: string, price: number, currency: "gold" | "gems") => void;
  listFoxOnMarket: (foxId: string, price: number, currency: "gold" | "gems") => void;
  refreshNPCListings: () => void;
}

export const createMarketSlice: StateCreator<RootState, [], [], MarketSlice> = (set, get) => ({
  marketListings: [],

  buyFromMarket: (listingId) => set((state: any) => {
    const listing = state.marketListings.find((l: MarketListing) => l.id === listingId);
    if (!listing) return state;

    const cost = listing.price;
    const currency = listing.currency;

    if (currency === "gold" && state.gold < cost) return state;
    if (currency === "gems" && state.gems < cost) return state;

    const updates: any = {
      gold: currency === "gold" ? state.gold - cost : state.gold,
      gems: currency === "gems" ? state.gems - cost : state.gems,
      marketListings: state.marketListings.filter((l: MarketListing) => l.id !== listingId)
    };

    if (listing.type === "fox" && listing.foxData) {
      const fox = listing.foxData;
      updates.foxes = {
        ...state.foxes,
        [fox.id]: {
          ...fox,
          ownerId: state.currentMemberId,
          isFoundation: false,
          history: [
            ...(fox.history || []),
            {
              date: new Date().toISOString(),
              event: "Purchased",
              details: `Purchased from Market for ${cost} ${currency} by ${state.members.find((m: any) => m.id === state.currentMemberId)?.name || 'Breeder'}`
            }
          ]
        }
      };
    } else if (listing.type === "item") {
      updates.inventory = {
        ...state.inventory,
        [listing.targetId]: (state.inventory[listing.targetId] || 0) + 1
      };
    }

    return updates;
  }),
  cancelListing: (listingId) => set((state: any) => {
    const listing = state.marketListings.find((l: MarketListing) => l.id === listingId);
    if (!listing) return state;

    const updates: any = {
      marketListings: state.marketListings.filter((l: MarketListing) => l.id !== listingId)
    };

    // Return fox to seller's kennel if it was a fox listing
    if (listing.type === "fox" && listing.sellerId === state.currentMemberId && listing.foxData) {
        updates.foxes = {
            ...state.foxes,
            [listing.foxData.id]: { ...listing.foxData, ownerId: state.currentMemberId }
        };
    }

    return updates;
  }),
  updateMarketListing: (listingId, updates) => set((state: any) => ({
    marketListings: state.marketListings.map((l: MarketListing) => l.id === listingId ? { ...l, ...updates } : l)
  })),
  listItemOnMarket: (type, targetId, price, currency) => set((state: any) => {
    const listingId = Date.now().toString();
    const seller = state.members.find((m: any) => m.id === state.currentMemberId);

    return {
      marketListings: [...state.marketListings, {
        id: listingId,
        sellerId: state.currentMemberId,
        sellerName: seller?.name || "Seller",
        type,
        targetId,
        price,
        currency,
        createdAt: new Date().toISOString()
      }]
    };
  }),
  listFoxOnMarket: (foxId, price, currency) => set((state: any) => {
    const fox = state.foxes[foxId];
    if (!fox) return state;

    const listingId = Date.now().toString();
    const seller = state.members.find((m: any) => m.id === state.currentMemberId);

    const { [foxId]: removed, ...remainingFoxes } = state.foxes;

    return {
      foxes: remainingFoxes,
      marketListings: [...state.marketListings, {
        id: listingId,
        sellerId: state.currentMemberId,
        sellerName: seller?.name || "Seller",
        type: "fox",
        targetId: foxId,
        price,
        currency,
        createdAt: new Date().toISOString(),
        foxData: fox
      }]
    };
  }),
  refreshNPCListings: () => set((state: any) => {
    const npcNames = ["Whispering Woods", "Crimson Hollow", "Silver Peak", "Golden Valley"];
    const newListings: MarketListing[] = [];

    for (let i = 0; i < 3; i++) {
        const fox = createFoundationalFox(Math.random);
        fox.id = "npc-market-" + Math.random().toString(36).substr(2, 9);
        fox.name = "Foundation " + (i + 1);

        newListings.push({
            id: "listing-" + fox.id,
            sellerId: "npc-market",
            sellerName: npcNames[Math.floor(Math.random() * npcNames.length)],
            type: "fox",
            targetId: fox.id,
            price: 500 + Math.floor(Math.random() * 2000),
            currency: "gold",
            createdAt: new Date().toISOString(),
            foxData: fox
        });
    }

    return {
        marketListings: [...state.marketListings.filter(l => l.sellerId !== "npc-market"), ...newListings]
    };
  })
});
