import { StateCreator } from "zustand";
import { GameState, RootState } from "../index";
import { Show, Member } from "../types";
import {
  Variety,
  ShowLevel,
  ShowReport,
  runHierarchicalShow,
  Competitor
} from "@/lib/showing";

export interface ShowSlice {
  shows: Show[];
  showReports: ShowReport[];
  showConfig: any;
  showVisibilityMode: "all" | "mine" | any;

  // Actions
  addShow: (...args: any[]) => void; // Permissive for legacy
  updateShow: (showId: string, updates: Partial<Show>) => void;
  removeShow: (showId: string) => void;
  setShowConfig: (config: any) => void;
  toggleShowEntry: (showId: string, foxId: string) => void;
  enterFoxInShow: (...args: any[]) => void;
  addShowReport: (report: ShowReport) => void;
  setShowVisibilityMode: (mode: any) => void;
  generateSeasonalShows: () => void;
  runShows: () => void;
}

export const createShowSlice: StateCreator<RootState, [], [], ShowSlice> = (set, get) => ({
  shows: [],
  showReports: [],
  showConfig: {
    Pro: { bis: 2000, rbis: 800, bov: 1000, rbov: 500, bos: 600, rbos: 300, boc: 400, rboc: 200 },
    Amateur: { bis: 1000, rbis: 400, bov: 500, rbov: 250, bos: 300, rbos: 150, boc: 200, rboc: 100 },
    Altered: { bis: 1500, rbis: 600, bov: 750, rbov: 375, bos: 450, rbos: 225, boc: 300, rboc: 150 },
  },
  showVisibilityMode: "all",

  addShow: (...args) => set((state: any) => {
    if (args.length === 1 && typeof args[0] === 'object') {
       return { shows: [...state.shows, args[0]] };
    }
    return state;
  }),
  updateShow: (showId, updates) => set((state: any) => ({
    shows: state.shows.map((s: Show) => s.id === showId ? { ...s, ...updates } : s)
  })),
  removeShow: (showId) => set((state: any) => ({
    shows: state.shows.filter((s: Show) => s.id !== showId)
  })),
  setShowConfig: (config) => set({ showConfig: config }),
  toggleShowEntry: (showId, foxId) => set((state: any) => {
    const show = state.shows.find((s: Show) => s.id === showId);
    if (!show) return state;

    const isRemoving = show.entries.includes(foxId);
    return {
      shows: state.shows.map((s: Show) =>
        s.id === showId
          ? {
              ...s,
              entries: isRemoving
                ? s.entries.filter((id: string) => id !== foxId)
                : [...s.entries, foxId],
            }
          : s
      ),
    };
  }),
  enterFoxInShow: (...args) => set((state: any) => {
    const foxId = args[0];
    const showId = args[1];
    const targetShow = state.shows.find((s: Show) => s.id === showId);
    if (!targetShow) return state;

    const isRemoving = targetShow.entries.includes(foxId);

    if (!isRemoving) {
      const isFoxAlreadyEntered = state.shows.some((s: Show) => s.entries.includes(foxId));
      if (isFoxAlreadyEntered) return state;

      if (!state.hiredHandler) {
        const hasFoxInCategory = state.shows.some((s: Show) =>
          s.level === targetShow.level &&
          s.type === targetShow.type &&
          s.entries.some(id => state.foxes[id]?.ownerId === state.currentMemberId)
        );
        if (hasFoxInCategory) return state;
      }
    }

    return {
      shows: state.shows.map((s: Show) =>
        s.id === showId
          ? {
              ...s,
              entries: isRemoving
                ? s.entries.filter((id: string) => id !== foxId)
                : [...s.entries, foxId],
            }
          : s
      ),
    };
  }),
  addShowReport: (report) => set((state: any) => ({
    showReports: [report, ...state.showReports]
  })),
  setShowVisibilityMode: (mode) => set({ showVisibilityMode: mode }),
  generateSeasonalShows: () => set((state: any) => {
    const varieties: Variety[] = ["Red", "Gold", "Silver", "Cross", "Exotic", "White Mark"];
    const levels: ShowLevel[] = ["Junior", "Open", "Senior", "Championship"];
    const newShows: Show[] = [];

    levels.forEach(level => {
      varieties.forEach(variety => {
        newShows.push({
          id: `pro-mid-${level}-${variety}-${state.year}-${state.season}`,
          name: `Midweek ${variety} ${level} Show`,
          level: level,
          type: variety,
          entries: [],
          isRun: false,
          isWeekend: false
        });
        newShows.push({
          id: `pro-week-${level}-${variety}-${state.year}-${state.season}`,
          name: `Weekend ${variety} ${level} Show`,
          level: level,
          type: variety,
          entries: [],
          isRun: false,
          isWeekend: true
        });
      });
    });

    ["Amateur Junior", "Amateur Open", "Amateur Senior", "Altered Junior", "Altered Open", "Altered Senior"].forEach(level => {
      varieties.forEach(variety => {
        newShows.push({
          id: `${level.startsWith("Amateur") ? "ama" : "alt"}-${level}-${variety}-${state.year}-${state.season}`,
          name: `${variety} ${level} Arena`,
          level: level as ShowLevel,
          type: variety,
          entries: [],
          isRun: false,
          isWeekend: true
        });
      });
    });

    return { shows: newShows };
  }),
  runShows: () => set((state: any) => {
    const newReports: ShowReport[] = [];
    const proCompetitors: Competitor[] = [];
    const amaCompetitors: Competitor[] = [];
    const altCompetitors: Competitor[] = [];

    state.shows.forEach((show: Show) => {
      show.entries.forEach(foxId => {
        const fox = state.foxes[foxId];
        if (!fox) return;
        const competitor: Competitor = {
          fox,
          variety: show.type,
          level: show.level,
          gender: fox.gender,
          ageGroup: fox.age < 2 ? 'Junior' : 'Open',
          currentScore: 0,
          currentBreakdown: {
            baseScore: 0, conformation: 0, movement: 0, temperament: 0,
            condition: 0, presence: 0, luck: 0, handlerBonus: 0, healthBonus: 0
          }
        };
        if (show.id.startsWith("pro")) proCompetitors.push(competitor);
        else if (show.id.startsWith("ama")) amaCompetitors.push(competitor);
        else if (show.id.startsWith("alt")) altCompetitors.push(competitor);
      });
    });

    if (proCompetitors.length > 0) {
      newReports.push(runHierarchicalShow("Pro", proCompetitors, state.year, state.season, state.showConfig, state.hiredGroomer, state.hiredTrainer, state.hiredVeterinarian));
    }
    if (amaCompetitors.length > 0) {
      newReports.push(runHierarchicalShow("Amateur", amaCompetitors, state.year, state.season, state.showConfig, state.hiredGroomer, state.hiredTrainer, state.hiredVeterinarian));
    }
    if (altCompetitors.length > 0) {
      newReports.push(runHierarchicalShow("Altered", altCompetitors, state.year, state.season, state.showConfig, state.hiredGroomer, state.hiredTrainer, state.hiredVeterinarian));
    }

    const updatedFoxes = { ...state.foxes };
    newReports.forEach(report => {
      report.results.forEach(res => {
        if (updatedFoxes[res.foxId]) {
          updatedFoxes[res.foxId] = {
            ...updatedFoxes[res.foxId],
            pointsLifetime: (updatedFoxes[res.foxId].pointsLifetime || 0) + res.pointsAwarded,
            pointsYear: (updatedFoxes[res.foxId].pointsYear || 0) + res.pointsAwarded,
            history: [
              ...(updatedFoxes[res.foxId].history || []),
              {
                date: new Date().toISOString(),
                event: 'Show Result',
                details: `${res.title} at ${res.level} ${res.variety} Show (+${res.pointsAwarded} pts)`
              }
            ]
          };
        }
      });
    });

    return {
      showReports: [...newReports, ...state.showReports].slice(0, 50),
      foxes: updatedFoxes,
      shows: state.shows.map((s: Show) => ({ ...s, isRun: true }))
    };
  }),
});
