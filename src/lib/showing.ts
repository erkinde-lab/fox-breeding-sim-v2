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
  staff?: {
    groomer: number;
    veterinarian: number;
    trainer: number;
    nutritionist: number;
  };
}

export interface ShowResult {
  foxId: string;
  score: number;
  pointsAwarded: number;
  title: string; // "BOC", "RBOC", "BOV", "RBOV", "BOS", "RBOS", "BIS", "RBIS"
  variety: Variety;
  level: ShowLevel;
  gender: "Dog" | "Vixen";
  ageGroup: "Adult" | "Juvenile";
  breakdown?: ScoreBreakdown;
  isMajor?: boolean;
  circuit?: "Pro" | "Amateur" | "Altered";
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
  staffBonuses: {
    groomer: boolean;
    veterinarian: boolean;
    trainer: boolean;
    nutritionist: boolean;
  }
): { total: number; breakdown: ScoreBreakdown } {
  const { stats } = fox;
  const activeBoosts = getActiveBoosts(fox);
  const hungry = isHungry(fox);

  let groomingBonus = 0;
  let trainingBonus = 0;
  const vetBonus = 0;
  let penalties = 0;

  const head = stats.head + (activeBoosts["head"] || 0) + (staffBonuses.veterinarian ? 1 : 0);
  const topline = stats.topline + (activeBoosts["topline"] || 0) + (staffBonuses.veterinarian ? 1 : 0);
  const forequarters = stats.forequarters + (activeBoosts["forequarters"] || 0) + (staffBonuses.veterinarian ? 1 : 0);
  const hindquarters = stats.hindquarters + (activeBoosts["hindquarters"] || 0) + (staffBonuses.veterinarian ? 1 : 0);
  const tail = stats.tail + (activeBoosts["tail"] || 0) + (staffBonuses.veterinarian ? 1 : 0);
  const coatQuality = stats.coatQuality + (activeBoosts["coatQuality"] || 0) + (staffBonuses.groomer ? 5 : 0);
  const temperament = stats.temperament + (activeBoosts["temperament"] || 0) + (staffBonuses.trainer ? 3 : 0);
  const presence = stats.presence + (activeBoosts["presence"] || 0) + (staffBonuses.trainer ? 3 : 0);

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
      staff: {
        groomer: staffBonuses.groomer ? 5 : 0,
        veterinarian: staffBonuses.veterinarian ? 5 : 0, // +1 to each of 5 physical traits
        trainer: staffBonuses.trainer ? 6 : 0, // +3 temp + 3 pres
        nutritionist: staffBonuses.nutritionist ? 2 : 0, // +2 fertility (applied elsewhere)
      },
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
  showConfig: any,
  hiredGroomer: boolean,
  hiredTrainer: boolean,
  hiredVeterinarian: boolean,
): ShowReport {
  const results: ShowResult[] = [];

  const rerollLuck = (c: Competitor) => {
    const { total, breakdown } = calculateScore(c.fox, {
      groomer: hiredGroomer,
      veterinarian: hiredVeterinarian,
      trainer: hiredTrainer,
      nutritionist: false,
    });
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

  // Stage 1: Best of Category (BOC / RBOC) - Organization Only
  const bocWinners: Competitor[] = [];
  const rbocWinners: Competitor[] = [];

  levels.forEach((lvl) => {
    varieties.forEach((v) => {
      ["Adult", "Juvenile"].forEach((ageGrp) => {
        const group = competitors.filter(
          (c) =>
            c.variety === v &&
            c.level === lvl &&
            c.ageGroup === ageGrp,
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

        let boc: Competitor,
          rboc: Competitor | null = null;
        if (
          bestDog &&
          (!bestVixen || bestDog.currentScore >= bestVixen.currentScore)
        ) {
          boc = bestDog;
          rboc = bestVixen || null;
        } else {
          boc = bestVixen!;
          rboc = bestDog || null;
        }

        // BOC/RBOC get no points, just for organization
        results.push(createResult(boc, "BOC", 0, false, circuit));
        bocWinners.push(boc);
        if (rboc) {
          results.push(createResult(rboc, "RBOC", 0, false, circuit));
          rbocWinners.push(rboc);
        }
      });
    });
  });

  // Stage 2: Best of Variety (BOV / RBOV) - 1 point each
  const bovWinners: Competitor[] = [];
  const rbovWinners: Competitor[] = [];

  varieties.forEach((v) => {
    ["Adult", "Juvenile"].forEach((ageGrp) => {
      const candidates = [...bocWinners, ...rbocWinners].filter(
        (c) =>
          c.variety === v &&
          c.ageGroup === ageGrp,
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

      results.push(createResult(bov, "BOV", 1, false, circuit));
      bovWinners.push(bov);
      if (rbov) {
        results.push(createResult(rbov, "RBOV", 1, false, circuit));
        rbovWinners.push(rbov);
      }
    });
  });

  // Stage 3: Best of Sex (BOS / RBOS) - 1 point each
  const bosWinners: Competitor[] = [];
  const rbosWinners: Competitor[] = [];

  ["Adult", "Juvenile"].forEach((ageGrp) => {
    const candidates = [...bovWinners, ...rbovWinners].filter(
      (c) => c.ageGroup === ageGrp,
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

    results.push(createResult(bos, "BOS", 1, false, circuit));
    bosWinners.push(bos);
    if (rbos) {
      results.push(createResult(rbos, "RBOS", 1, false, circuit));
      rbosWinners.push(rbos);
    }
  });

  // Stage 4: Best in Show (BIS / RBIS) - 2/1 points
  if (bosWinners.length === 0)
    return { year, season, circuit, results, bisFoxId: null, rbisFoxId: null };

  const finalCandidates = [...bosWinners, ...rbosWinners];
  finalCandidates.forEach(rerollLuck);
  
  const finalDogs = finalCandidates
    .filter((c) => c.gender === "Dog")
    .sort((a, b) => b.currentScore - a.currentScore);
  const finalVixens = finalCandidates
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

  results.push(createResult(bis, "BIS", 2, true, circuit));
  if (rbis) {
    results.push(createResult(rbis, "RBIS", 1, true, circuit));
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
  circuit?: "Pro" | "Amateur" | "Altered",
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
    circuit,
  };
}

export function isFoxEligibleForShow(
  fox: Fox,
  level: ShowLevel,
  type: Variety,
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
  if (actualVariety !== type) return false;

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
