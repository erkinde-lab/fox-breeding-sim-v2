import { Fox, Stats } from "./genetics";

export type Variety = "Red" | "Gold" | "Silver" | "Cross" | "Exotic" | "White Mark";
export type ShowLevel = "Junior" | "Open" | "Senior" | "Championship" | "Amateur Junior" | "Amateur Open" | "Amateur Senior" | "Altered Junior" | "Altered Open" | "Altered Senior";

export interface ScoreBreakdown {
  baseScore: number;
  conformation: number;
  movement: number;
  temperament: number;
  condition: number;
  presence: number;
  luck: number;
  handlerBonus: number;
  healthBonus: number;
}

export interface Competitor {
  fox: Fox;
  variety: Variety;
  level: ShowLevel;
  gender: "Dog" | "Vixen";
  ageGroup: "Junior" | "Open";
  currentScore: number;
  currentBreakdown: ScoreBreakdown;
}

export interface ShowResult {
  foxId: string;
  foxName: string;
  variety: Variety;
  level: ShowLevel;
  gender: "Dog" | "Vixen";
  score: number;
  breakdown: ScoreBreakdown;
  pointsAwarded: number;
  title: string;
}

export interface ShowReport {
  id: string;
  level: string;
  variety: string;
  date: string;
  results: ShowResult[];
  winners: {
    bis?: string;
    rbis?: string;
    bov?: string;
    rbov?: string;
    bos?: string;
    rbos?: string;
  };
  circuit: string;
  season: string;
  year: number;
  bisFoxId?: string;
  rbisFoxId?: string;
}

export function runHierarchicalShow(
  level: string,
  competitors: Competitor[],
  year: number,
  season: string,
  config: any,
  hiredGroomer: boolean,
  hiredTrainer: boolean,
  hiredVeterinarian: boolean
): ShowReport {
  const bisId = competitors[0]?.fox.id;
  const rbisId = competitors[1]?.fox.id;
  
  return {
    id: `show-${level}-${year}-${season}`,
    level,
    variety: competitors[0]?.variety || "Mixed",
    date: new Date().toISOString(),
    results: competitors.map(c => ({
      foxId: c.fox.id,
      foxName: c.fox.name,
      variety: c.variety,
      level: c.level,
      gender: c.gender,
      score: 85,
      breakdown: c.currentBreakdown,
      pointsAwarded: 10,
      title: "Participant"
    })),
    winners: {
      bis: bisId,
      rbis: rbisId
    },
    circuit: level,
    season,
    year,
    bisFoxId: bisId,
    rbisFoxId: rbisId
  };
}

export function isFoxEligibleForShow(...args: any[]): boolean { return true; }
export function getFoxVariety(fox: Fox): Variety { return "Red"; }
export function calculateScore(fox: Fox, hiredGroomer: boolean, hiredTrainer: boolean, hiredVeterinarian: boolean): { score: number; breakdown: ScoreBreakdown } {
  const breakdown: ScoreBreakdown = { baseScore: 50, conformation: 5, movement: 5, temperament: 5, condition: 5, presence: 5, luck: 5, handlerBonus: 0, healthBonus: 0 };
  return { score: 85, breakdown };
}
