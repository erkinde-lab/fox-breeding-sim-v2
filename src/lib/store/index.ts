import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameState, Member, Role } from "./types";
import { UserSlice, createUserSlice } from "./slices/userSlice";
import { KennelSlice, createKennelSlice } from "./slices/kennelSlice";
import { SocialSlice, createSocialSlice } from "./slices/socialSlice";
import { ShowSlice, createShowSlice } from "./slices/showSlice";
import { MarketSlice, createMarketSlice } from "./slices/marketSlice";
import { GameSlice, createGameSlice } from "./slices/gameSlice";

export type RootState = UserSlice & KennelSlice & SocialSlice & ShowSlice & MarketSlice & GameSlice & {
  initializeGame: () => void;
  checkAchievements: () => void;
};

export const useGameStore = create<RootState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createKennelSlice(...a),
      ...createSocialSlice(...a),
      ...createShowSlice(...a),
      ...createMarketSlice(...a),
      ...createGameSlice(...a),

      initializeGame: () => {
        const state = a[0] as unknown as RootState;
        if (Object.keys(state.foxes).length === 0) {
           state.repopulateFoundationFoxes();
        }
        // Refresh NPC listings on init
        if (state.refreshNPCListings) {
            state.refreshNPCListings();
        }
      },
      checkAchievements: () => {}
    }),
    {
      name: "red-fox-sim-storage-v12",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Consolidate all historical migrations (v1-v12 legacy) into a fresh v1
        let state = persistedState as any;

        // Ensure critical fields exist
        if (!state.adminLogs) state.adminLogs = [];
        if (!state.reports) state.reports = [];
        if (!state.whelpingReports) state.whelpingReports = [];
        if (!state.pregnancyList) state.pregnancyList = [];
        if (!state.inventory) state.inventory = {};

        // Ensure at least one admin exists
        if (state.members) {
          const hasAdmin = state.members.some((m: any) => m.role === "administrator");
          if (!hasAdmin && state.members.length > 0) {
            state.members[0].role = "administrator";
          }
        }

        return state;
      },
    }
  )
);

export type { GameState } from "./types";
