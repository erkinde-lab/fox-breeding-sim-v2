import { Fox } from "./genetics";

export type HistoryType = "show" | "breeding" | "life";

export interface HistoryItem {
  year: number;
  season: string;
  event: string;
  type: HistoryType;
}

export function createHistoryItem(
  year: number,
  season: string,
  event: string,
  type: HistoryType
): HistoryItem {
  return { year, season, event, type };
}

export function appendHistory(
  fox: Fox,
  year: number,
  season: string,
  event: string,
  type: HistoryType
): Fox {
  return {
    ...fox,
    history: [...(fox.history || []), createHistoryItem(year, season, event, type)]
  };
}
