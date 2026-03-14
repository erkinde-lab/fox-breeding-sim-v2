"use client";

import { useGameStore } from "./store/index";
export { useGameStore };

// Re-export types and constants
export type { GameState, Role, Member, Fox, Show, MarketListing, NewsItem } from "./store/types";
export { ACHIEVEMENTS } from "./store/types";
