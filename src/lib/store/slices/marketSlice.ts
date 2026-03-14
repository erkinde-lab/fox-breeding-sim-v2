import { StateCreator } from "zustand";
import { RootState } from "../index";
import { MarketListing } from "../types";

export interface MarketSlice {
  marketListings: MarketListing[];

  // Actions
  buyFromMarket: (listingId: string) => void;
  cancelListing: (listingId: string) => void;
  updateMarketListing: (listingId: string, updates: Partial<MarketListing>) => void;
  listItemOnMarket: (type: "fox" | "item", targetId: string, price: number, currency: "gold" | "gems") => void;
  listFoxOnMarket: (foxId: string, price: number, currency: "gold" | "gems") => void;
}

export const createMarketSlice: StateCreator<RootState, [], [], MarketSlice> = (set) => ({
  marketListings: [],

  buyFromMarket: (listingId) => set((state: any) => {
    const listing = state.marketListings.find((l: MarketListing) => l.id === listingId);
    if (!listing) return state;

    return {
      marketListings: state.marketListings.filter((l: MarketListing) => l.id !== listingId)
    };
  }),
  cancelListing: (listingId) => set((state: any) => ({
    marketListings: state.marketListings.filter((l: MarketListing) => l.id !== listingId)
  })),
  updateMarketListing: (listingId, updates) => set((state: any) => ({
    marketListings: state.marketListings.map((l: MarketListing) => l.id === listingId ? { ...l, ...updates } : l)
  })),
  listItemOnMarket: (type, targetId, price, currency) => set((state: any) => ({
    marketListings: [...state.marketListings, {
      id: Date.now().toString(),
      sellerId: state.currentMemberId,
      sellerName: state.members.find((m: any) => m.id === state.currentMemberId)?.name || "Seller",
      type,
      targetId,
      price,
      currency,
      createdAt: new Date().toISOString()
    }]
  })),
  listFoxOnMarket: (foxId, price, currency) => set((state: any) => ({
    marketListings: [...state.marketListings, {
      id: Date.now().toString(),
      sellerId: state.currentMemberId,
      sellerName: state.members.find((m: any) => m.id === state.currentMemberId)?.name || "Seller",
      type: "fox",
      targetId: foxId,
      price,
      currency,
      createdAt: new Date().toISOString(),
      foxData: state.foxes[foxId]
    }]
  })),
});
