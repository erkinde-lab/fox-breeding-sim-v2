import {
  Fox,
  getActiveBoosts,
  isHungry,
  isGroomed,
  isTrained,
} from "./genetics";

export type ShowLevel =
  | "Junior"
  | "Open"
  | "Senior"
  | "Championship"
  | "Amateur Junior"
  | "Amateur Open"
  | "Amateur Senior"
  | "Altered Junior"
  | "Altered Open"
  | "Altered Senior";
export type Variety =
  | "Red"
  | "Gold"
  | "Silver"
  | "Cross"
  | "Exotic"
  | "White Mark";

export type ShowClass = Variety;

export interface ScoreBreakdown {
  base: number;
  grooming: number;
  training: number;
  veterinary: number;
  luck: number;
  penalties: number;
}

export interface ShowResult {
  foxId: string;
  score: number;
  pointsAwarded: number;
  title: string; // "BOV", "RBOV", "BOS", "RBOS", "BIS", "RBIS"
  variety: Variety;
  level: ShowLevel;
  gender: "Dog" | "Vixen";
  ageGroup: "Adult" | "Juvenile";
  breakdown?: ScoreBreakdown;
  isMajor?: boolean;
}

export interface ShowReport {
  year: number;
  season: string;
  circuit: "Pro" | "Amateur" | "Altered";
  results: ShowResult[];
  bisFoxId: string | null;
  rbisFoxId: string | null;
}

export function getFoxVariety(fox: Fox): Variety {
  const genotype = fox.genotype;

  const wAlleles = genotype.W || ["w", "w"];
  if (wAlleles.some((a) => ["W", "WM", "WG", "WP"].includes(a))) {
    return "White Mark";
  }

  const hasC = (genotype.C || []).filter((x) => x === "c").length === 2;
  const hasL = (genotype.L || []).filter((x) => x === "l").length === 2;
  const hasG = (genotype.G || []).filter((x) => x === "g").length === 2;
  const hasP = (genotype.P || []).filter((x) => x === "p").length === 2;
  const isFifi = (genotype.Fire || []).filter((x) => x === "fi").length === 2;

  if (hasC || hasL || hasG || hasP || isFifi) return "Exotic";

  const aCount = (genotype.A || []).filter((x) => x === "a").length;
  const bCount = (genotype.B || []).filter((x) => x === "b").length;

  if (aCount === 0 && bCount === 0) return "Red";
  if (aCount === 0 && bCount === 1) return "Gold";
  if (aCount === 1 && bCount === 0) return "Cross";
  if (aCount === 1 && bCount === 1) return "Cross";

  return "Silver";
}

export function calculateScore(
  fox: Fox,
  hasGroomer: boolean = false,
  hasTrainer: boolean = false,
  hasVeterinarian: boolean = false,
): { total: number; breakdown: ScoreBreakdown } {
  const { stats } = fox;
  const activeBoosts = getActiveBoosts(fox);
  const hungry = isHungry(fox);

  let groomingBonus = 0;
  let trainingBonus = 0;
  let vetBonus = 0;
  let penalties = 0;

  const head = stats.head + (activeBoosts["head"] || 0);
  const topline = stats.topline + (activeBoosts["topline"] || 0);
  const forequarters = stats.forequarters + (activeBoosts["forequarters"] || 0);
  const hindquarters = stats.hindquarters + (activeBoosts["hindquarters"] || 0);
  const tail = stats.tail + (activeBoosts["tail"] || 0);
  const coatQuality = stats.coatQuality + (activeBoosts["coatQuality"] || 0);
  const temperament = stats.temperament + (activeBoosts["temperament"] || 0);
  const presence = stats.presence + (activeBoosts["presence"] || 0);

  const rawBase =
    head +
    topline +
    forequarters +
    hindquarters +
    tail +
    coatQuality +
    temperament +
    presence;

  if (isGroomed(fox)) groomingBonus += 5;
  if (isTrained(fox)) trainingBonus += 6;
  if (hasVeterinarian) vetBonus += 5;
  if (hungry) penalties -= 40;

  const luckBonus = Math.floor(Math.random() * stats.luck) + 1;
  const total = Math.max(
    0,
    rawBase + groomingBonus + trainingBonus + vetBonus + penalties + luckBonus,
  );

  return {
    total,
    breakdown: {
      base: rawBase,
      grooming: groomingBonus,
      training: trainingBonus,
      veterinary: vetBonus,
      luck: luckBonus,
      penalties,
    },
  };
}

export interface Competitor {
  fox: Fox;
  variety: Variety;
  level: ShowLevel;
  gender: "Dog" | "Vixen";
  ageGroup: "Adult" | "Juvenile";
  currentScore: number;
  currentBreakdown: ScoreBreakdown;
}

export function runHierarchicalShow(
  circuit: "Pro" | "Amateur" | "Altered",
  competitors: Competitor[],
  year: number,
  season: string,
  hasGroomer: boolean = false,
  hasTrainer: boolean = false,
  hasVeterinarian: boolean = false,
): ShowReport {
  const results: ShowResult[] = [];

  const rerollLuck = (c: Competitor) => {
    const { total, breakdown } = calculateScore(
      c.fox,
      hasGroomer,
      hasTrainer,
      hasVeterinarian,
    );
    c.currentScore = total;
    c.currentBreakdown = breakdown;
  };

  const varieties: Variety[] = [
    "Red",
    "Gold",
    "Silver",
    "Cross",
    "Exotic",
    "White Mark",
  ];
  const levels: ShowLevel[] = Array.from(
    new Set(competitors.map((c) => c.level)),
  );

  const varietyWinners: Competitor[] = [];

  // Stage 1: Variety (BOV / RBOV)
  levels.forEach((lvl) => {
    varieties.forEach((v) => {
      ["Adult", "Juvenile"].forEach((ageGrp) => {
        const group = competitors.filter(
          (c) =>
            c.variety === v &&
            c.level === lvl &&
            c.ageGroup === (ageGrp as any),
        );
        if (group.length === 0) return;

        group.forEach(rerollLuck);

        const dogs = group
          .filter((c) => c.gender === "Dog")
          .sort((a, b) => b.currentScore - a.currentScore);
        const vixens = group
          .filter((c) => c.gender === "Vixen")
          .sort((a, b) => b.currentScore - a.currentScore);

        const bestDog = dogs[0];
        const bestVixen = vixens[0];

        if (!bestDog && !bestVixen) return;

        let bov: Competitor,
          rbov: Competitor | null = null;
        if (
          bestDog &&
          (!bestVixen || bestDog.currentScore >= bestVixen.currentScore)
        ) {
          bov = bestDog;
          rbov = bestVixen || null;
        } else {
          bov = bestVixen!;
          rbov = bestDog || null;
        }

        results.push(createResult(bov, "BOV", 1));
        varietyWinners.push(bov);
        if (rbov) {
          results.push(createResult(rbov, "RBOV", 1));
          varietyWinners.push(rbov);
        }
      });
    });
  });

  // Stage 2: Best of Sex (BOS / RBOS)
  const bosWinners: Competitor[] = [];
  levels.forEach((lvl) => {
    ["Adult", "Juvenile"].forEach((ageGrp) => {
      const candidates = varietyWinners.filter(
        (c) => c.level === lvl && c.ageGroup === (ageGrp as any),
      );
      if (candidates.length === 0) return;

      candidates.forEach(rerollLuck);

      const dogs = candidates
        .filter((c) => c.gender === "Dog")
        .sort((a, b) => b.currentScore - a.currentScore);
      const vixens = candidates
        .filter((c) => c.gender === "Vixen")
        .sort((a, b) => b.currentScore - a.currentScore);

      const bestDog = dogs[0];
      const bestVixen = vixens[0];

      if (!bestDog && !bestVixen) return;

      let bos: Competitor,
        rbos: Competitor | null = null;
      if (
        bestDog &&
        (!bestVixen || bestDog.currentScore >= bestVixen.currentScore)
      ) {
        bos = bestDog;
        rbos = bestVixen || null;
      } else {
        bos = bestVixen!;
        rbos = bestDog || null;
      }

      results.push(createResult(bos, "BOS", 1));
      bosWinners.push(bos);
      if (rbos) {
        results.push(createResult(rbos, "RBOS", 1));
        bosWinners.push(rbos);
      }
    });
  });

  // Stage 3: Best in Show (BIS / RBIS)
  if (bosWinners.length === 0)
    return { year, season, circuit, results, bisFoxId: null, rbisFoxId: null };

  bosWinners.forEach(rerollLuck);
  const finalDogs = bosWinners
    .filter((c) => c.gender === "Dog")
    .sort((a, b) => b.currentScore - a.currentScore);
  const finalVixens = bosWinners
    .filter((c) => c.gender === "Vixen")
    .sort((a, b) => b.currentScore - a.currentScore);

  let bis: Competitor,
    rbis: Competitor | null = null;
  if (
    finalDogs[0] &&
    (!finalVixens[0] ||
      finalDogs[0].currentScore >= finalVixens[0].currentScore)
  ) {
    bis = finalDogs[0];
    rbis = finalVixens[0] || null;
  } else {
    bis = finalVixens[0]!;
    rbis = finalDogs[0] || null;
  }

  results.push(createResult(bis, "BIS", 2, true));
  if (rbis) {
    results.push(createResult(rbis, "RBIS", 2, true));
  }

  return {
    year,
    season,
    circuit,
    results,
    bisFoxId: bis.fox.id,
    rbisFoxId: rbis?.fox.id || null,
  };
}

function createResult(
  c: Competitor,
  title: string,
  points: number,
  isMajor: boolean = false,
): ShowResult {
  return {
    foxId: c.fox.id,
    score: c.currentScore,
    pointsAwarded: points,
    title,
    variety: c.variety,
    level: c.level,
    gender: c.gender,
    ageGroup: c.ageGroup,
    breakdown: c.currentBreakdown,
    isMajor,
  };
}

export function isFoxEligibleForShow(
  fox: Fox,
  level: ShowLevel,
  variety: Variety,
  season: string,
): boolean {
  if (
    fox.isRetired ||
    fox.healthIssues.length > 0 ||
    isHungry(fox) ||
    !fox.hasBeenRenamed
  )
    return false;

  const isShowAltered = level.startsWith("Altered");
  if (isShowAltered && !fox.isAltered) return false;
  if (!isShowAltered && fox.isAltered) return false;

  const isAmateur = level.startsWith("Amateur");
  if (isAmateur && fox.age === 0) return false;

  const actualVariety = getFoxVariety(fox);
  if (actualVariety !== variety) return false;

  const baseLevel = level.replace("Amateur ", "").replace("Altered ", "");
  if (baseLevel === "Junior" && fox.pointsLifetime >= 5) return false;
  if (baseLevel === "Senior" && fox.pointsLifetime <= 10) return false;
  if (
    baseLevel === "Open" &&
    (fox.pointsLifetime < 5 || fox.pointsLifetime > 10)
  )
    return false;
  if (baseLevel === "Championship") return true; // Qualification check handled by store

  return true;
}

export function runSpecificShow(): any {
  return null;
}
export function runShow(): any {
  return null;
}
