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
      },
      checkAchievements: () => {}
    }),
    {
      name: "red-fox-sim-storage",
      version: 12,
      migrate: (persistedState: any, version: number) => {
        let state = persistedState as Partial<GameState>;
        if (version < 12) {
          if (state.members) {
            state.members = state.members.map(m =>
              m.id === "player-1" ? { ...m, role: "administrator" as Role } : m
            );
          }
        }
        return state;
      },
    }
  )
);

export type { GameState } from "./types";
