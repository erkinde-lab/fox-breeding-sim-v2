import { StateCreator } from "zustand";
import { GameState, RootState } from "../index";

export interface UserSlice {
  gold: number;
  gems: number;
  isAdmin: boolean;
  isDarkMode: boolean;
  currentMemberId: string;
  broadcast: string | null;
  hasSeenTutorial: boolean;
  tutorialStep: number | null;

  colorblindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  highContrast: boolean;
  fontSize: "small" | "normal" | "large" | "xl";
  useOpenDyslexic: boolean;
  reducedMotion: boolean;
  alwaysUnderlineLinks: boolean;
  highVisibilityFocus: boolean;
  simplifiedUI: boolean;
  textSpacing: "normal" | "wide" | "extra";

  bannerUrl: string | null;
  bannerXPosition: number;
  bannerYPosition: number;

  bisWins: number;
  bestDogWins: number;
  bestVixenWins: number;
  totalShowPoints: number;
  unlockedAchievements: string[];

  // Actions
  addGold: (amount: number) => void;
  removeGold: (amount: number) => void;
  addGems: (amount: number) => void;
  removeGems: (amount: number) => void;
  toggleAdminMode: () => void;
  setAdminMode: (isAdmin: boolean) => void;
  toggleDarkMode: () => void;
  setBroadcast: (message: string | null) => void;
  setCurrentMemberId: (id: string) => void;
  setTutorialStep: (step: number | null) => void;
  completeTutorial: () => void;
  updateAccessibilitySettings: (settings: any) => void;
  toggleColorblindMode: (...args: any[]) => void; // Permissive for legacy calls

  toggleHighContrast: () => void;
  setFontSize: (size: "small" | "normal" | "large" | "xl") => void;
  toggleOpenDyslexic: () => void;
  toggleReducedMotion: () => void;
  toggleAlwaysUnderlineLinks: () => void;
  toggleHighVisibilityFocus: () => void;
  toggleSimplifiedUI: () => void;
  setTextSpacing: (spacing: any) => void;

  setBannerUrl: (url: string | null) => void;
  setBannerXPosition: (pos: number) => void;
  setBannerYPosition: (pos: number) => void;
}

export const createUserSlice: StateCreator<RootState, [], [], UserSlice> = (set) => ({
  gold: 1000,
  gems: 10,
  isAdmin: false,
  isDarkMode: false,
  currentMemberId: "player-1",
  broadcast: null,
  hasSeenTutorial: false,
  tutorialStep: null,

  colorblindMode: "none",
  highContrast: false,
  fontSize: "normal",
  useOpenDyslexic: false,
  reducedMotion: false,
  alwaysUnderlineLinks: false,
  highVisibilityFocus: false,
  simplifiedUI: false,
  textSpacing: "normal",

  bannerUrl: null,
  bannerXPosition: 50,
  bannerYPosition: 50,

  bisWins: 0,
  bestDogWins: 0,
  bestVixenWins: 0,
  totalShowPoints: 0,
  unlockedAchievements: [],

  addGold: (amount) => set((state: any) => ({ gold: state.gold + amount })),
  removeGold: (amount) => set((state: any) => ({ gold: Math.max(0, state.gold - amount) })),
  addGems: (amount) => set((state: any) => ({ gems: state.gems + amount })),
  removeGems: (amount) => set((state: any) => ({ gems: Math.max(0, state.gems - amount) })),
  toggleAdminMode: () => set((state: any) => ({ isAdmin: !state.isAdmin })),
  setAdminMode: (isAdmin) => set({ isAdmin }),
  toggleDarkMode: () => set((state: any) => ({ isDarkMode: !state.isDarkMode })),
  setBroadcast: (message) => set({ broadcast: message }),
  setCurrentMemberId: (id) => set({ currentMemberId: id }),
  setTutorialStep: (step) => set({ tutorialStep: step }),
  completeTutorial: () => set({ hasSeenTutorial: true, tutorialStep: null }),
  updateAccessibilitySettings: (settings) => set((state: any) => ({ ...state, ...settings })),

  toggleColorblindMode: (...args) => set((state: any) => {
    if (args.length > 0 && typeof args[0] === 'string') {
       return { colorblindMode: args[0] as any };
    }
    const modes: ("none" | "protanopia" | "deuteranopia" | "tritanopia")[] = ["none", "protanopia", "deuteranopia", "tritanopia"];
    const currentIndex = modes.indexOf(state.colorblindMode);
    return { colorblindMode: modes[(currentIndex + 1) % modes.length] };
  }),
  toggleHighContrast: () => set((state: any) => ({ highContrast: !state.highContrast })),
  setFontSize: (size) => set({ fontSize: size }),
  toggleOpenDyslexic: () => set((state: any) => ({ useOpenDyslexic: !state.useOpenDyslexic })),
  toggleReducedMotion: () => set((state: any) => ({ reducedMotion: !state.reducedMotion })),
  toggleAlwaysUnderlineLinks: () => set((state: any) => ({ alwaysUnderlineLinks: !state.alwaysUnderlineLinks })),
  toggleHighVisibilityFocus: () => set((state: any) => ({ highVisibilityFocus: !state.highVisibilityFocus })),
  toggleSimplifiedUI: () => set((state: any) => ({ simplifiedUI: !state.simplifiedUI })),
  setTextSpacing: (spacing: any) => set({ textSpacing: spacing }),

  setBannerUrl: (url) => set({ bannerUrl: url }),
  setBannerXPosition: (pos) => set({ bannerXPosition: pos }),
  setBannerYPosition: (pos) => set({ bannerYPosition: pos }),
});
