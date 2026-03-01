export type Allele = string;
export type Genotype = Record<string, Allele[]>;

export interface LocusInfo {
  name: string;
  description: string;
  alleles: Allele[];
  alleleDescriptions: Record<string, string>;
  lethal?: (genotype: Allele[]) => boolean;
}

export const LOCI: Record<string, LocusInfo> = {
  A: {
    name: "Agouti",
    description: "Controls the distribution of black pigment.",
    alleles: ["A", "a"],
    alleleDescriptions: {
      A: "Allows red base pigment.",
      a: "Restricts red base pigment, allowing silver/black phenotypes.",
    },
  },
  B: {
    name: "Black",
    description: "Controls the intensity of black pigment.",
    alleles: ["B", "b"],
    alleleDescriptions: {
      B: "Full pigment intensity.",
      b: "Diluted pigment (Silvering).",
    },
  },
  C: {
    name: "Albino",
    description: "Recessive albinism locus.",
    alleles: ["C", "c"],
    alleleDescriptions: {
      C: "Normal pigment.",
      c: "Albino (Photosensitive). cc masks all other traits.",
    },
  },
  G: {
    name: "Burgundy",
    description: "Recessive burgundy locus.",
    alleles: ["G", "g"],
    alleleDescriptions: {
      G: "Normal pigment.",
      g: "Burgundy pigment (gg results in Burgundy phenotype).",
    },
  },
  P: {
    name: "Pearl",
    description: "Recessive pearl locus.",
    alleles: ["P", "p"],
    alleleDescriptions: {
      P: "Normal pigment.",
      p: "Pearl pigment (pp results in Pearl phenotype).",
    },
  },
  Fire: {
    name: "Fire Factor",
    description: "Controls complex fire phenotypes.",
    alleles: ["FI", "fi"],
    alleleDescriptions: {
      FI: "Normal.",
      fi: "Fire Factor (fifi results in Fire phenotypes).",
    },
  },
  W: {
    name: "White Markings",
    description:
      "Controls dominant white patterns. Some combinations are lethal.",
    alleles: ["w", "W", "WM", "WG", "WP"],
    alleleDescriptions: {
      w: "No markings.",
      W: "White Mark.",
      WM: "Marble (Non-lethal).",
      WG: "Georgian.",
      WP: "Platinum.",
    },
    lethal: (alleles) => {
      const dominant = alleles.filter((a) => a !== "w");
      if (dominant.length < 2) return false;
      const [a1, a2] = dominant;
      if (a1 === "WM" || a2 === "WM") return false;
      return true;
    },
  },
  L: {
    name: "Leucistic",
    description: "Recessive leucism locus.",
    alleles: ["L", "l"],
    alleleDescriptions: {
      L: "Normal pigment.",
      l: "Leucistic (Deafness). ll results in white pelt with eye pigment.",
    },
  },
};

export interface Stats {
  head: number;
  topline: number;
  forequarters: number;
  hindquarters: number;
  tail: number;
  coatQuality: number;
  temperament: number;
  presence: number;
  luck: number;
  fertility: number;
}

export interface Fox {
  id: string;
  name: string;
  genotype: Genotype;
  phenotype: string;
  baseColor: string;
  pattern: string;
  eyeColor: string;
  gender: "Dog" | "Vixen";
  age: number;
  stats: Stats;
  genotypeRevealed: boolean;
  pedigreeAnalyzed: boolean;
  isRetired: boolean;
  hasBeenRenamed: boolean;
  silverIntensity: number;
  healthIssues: string[];
  pointsYear: number;
  pointsLifetime: number;
  parents: [string | null, string | null];
  parentNames: [string | null, string | null];
  birthYear: number;
  coi: number;
  isAtStud: boolean;
  studFee: number;
  isNPC?: boolean;
  isAltered?: boolean;
  prefixTitle?: string;
  bisWins?: number;
  majors?: number;
  lastFed?: number;
  lastGroomed?: number;
  lastTrained?: number;
  isStillborn?: boolean;
  boosts?: Record<string, number>;
  preferredFeed?: string;
  history?: {
    year: number;
    season: string;
    event: string;
    type: "show" | "breeding" | "life";
  }[];
}

export function getInitialGenotype(): Genotype {
  const genotype: Genotype = {};
  for (const locus in LOCI) {
    const alleles = LOCI[locus].alleles;
    genotype[locus] = [alleles[0], alleles[0]];
  }
  return genotype;
}

export function getPhenotype(
  genotype: Genotype,
  silverIntensity: number = 3,
  providedEyeColor?: string,
) {
  const A = genotype.A || ["A", "A"];
  const B = genotype.B || ["B", "B"];
  const C = genotype.C || ["C", "C"];
  const G = genotype.G || ["G", "G"];
  const P = genotype.P || ["P", "P"];
  const Fire = genotype.Fire || ["FI", "FI"];
  const L = genotype.L || ["L", "L"];
  const W = [...(genotype.W || ["w", "w"])].sort();

  // Lethal check
  let isLethal = false;
  for (const locusKey in LOCI) {
    const alleles = genotype[locusKey];
    const locusDef = LOCI[locusKey];
    if (alleles && locusDef.lethal && locusDef.lethal(alleles)) {
      isLethal = true;
      break;
    }
  }

  // Basic flags
  const hasC = C.filter((x) => x === "c").length === 2;
  const hasL = L.filter((x) => x === "l").length === 2;
  const hasG = G.filter((x) => x === "g").length === 2;
  const hasP = P.filter((x) => x === "p").length === 2;
  const isFifi = Fire.filter((x) => x === "fi").length === 2;
  const isAmber = hasG && hasP;

  // Base Color Logic
  let baseColorName = "Red";
  const aCount = A.filter((x) => x === "a").length;
  const bCount = B.filter((x) => x === "b").length;

  if (aCount === 0 && bCount === 0)
    baseColorName = "Red"; // AABB
  else if (aCount === 0 && bCount === 1)
    baseColorName = "Gold"; // AABb
  else if (aCount === 0 && bCount === 2)
    baseColorName = "Standard Silver"; // AAbb
  else if (aCount === 1 && bCount === 0)
    baseColorName = "Gold Cross"; // AaBB
  else if (aCount === 1 && bCount === 1)
    baseColorName = "Silver Cross"; // AaBb
  else if (aCount === 1 && bCount === 2)
    baseColorName = "Standard Silver"; // Aabb
  else if (aCount === 2 && bCount === 0)
    baseColorName = "Alaskan Silver"; // aaBB
  else if (aCount === 2 && bCount === 1)
    baseColorName = "Alaskan Silver"; // aaBb
  else if (aCount === 2 && bCount === 2) baseColorName = "Double Silver"; // aabb

  let underlyingName = "";

  if (isFifi) {
    if (baseColorName === "Red" || baseColorName === "Gold") {
      if (isAmber) underlyingName = "Autumn Fire";
      else if (hasG || hasP) underlyingName = "Snow Glow";
      else
        underlyingName =
          baseColorName === "Red" ? "Wildfire" : "Golden Sunrise";
    } else if (
      baseColorName === "Gold Cross" ||
      baseColorName === "Silver Cross"
    ) {
      if (isAmber) underlyingName = "Champagne Cross";
      else if (hasG) underlyingName = "Snow Glow";
      else if (hasP)
        underlyingName =
          baseColorName === "Gold Cross" ? "Fire and Ice" : "Moon Glow";
      else underlyingName = "Fire Cross";
    } else if (baseColorName === "Alaskan Silver") {
      if (isAmber || hasG) underlyingName = "Champagne";
      else if (hasP) underlyingName = "Fawn Glow";
      else underlyingName = "Colicott";
    } else if (baseColorName === "Standard Silver") {
      if (isAmber || hasG) underlyingName = "Cinnamon Fire";
      else underlyingName = "";
    } else if (baseColorName === "Double Silver") {
      if (isAmber || hasG) underlyingName = "Cinnamon Fire";
      else if (hasP) underlyingName = "Fawn Glow";
      else underlyingName = "Colicott";
    }
  }

  if (!underlyingName) {
    if (isAmber) {
      if (baseColorName === "Red") underlyingName = "Amber Red";
      else if (baseColorName === "Gold") underlyingName = "Amber Gold";
      else if (
        baseColorName === "Gold Cross" ||
        baseColorName === "Silver Cross"
      )
        underlyingName = "Amber Cross";
      else underlyingName = "Amber";
    } else if (hasG) {
      if (baseColorName === "Red") underlyingName = "Burgundy Red";
      else if (baseColorName === "Gold") underlyingName = "Burgundy Gold";
      else if (
        baseColorName === "Gold Cross" ||
        baseColorName === "Silver Cross"
      )
        underlyingName = "Burgundy Cross";
      else underlyingName = "Burgundy";
    } else if (hasP) {
      if (baseColorName === "Red") underlyingName = "Red";
      else if (baseColorName === "Gold") underlyingName = "Pearl Gold";
      else if (
        baseColorName === "Gold Cross" ||
        baseColorName === "Silver Cross"
      )
        underlyingName = "Pearl Cross";
      else underlyingName = "Pearl";
    } else {
      underlyingName = baseColorName;
      if (
        underlyingName === "Alaskan Silver" ||
        underlyingName === "Standard Silver" ||
        underlyingName === "Double Silver"
      ) {
        underlyingName = silverIntensity === 1 ? "Black" : "Silver";
      }
    }
  }

  let finalName = "";
  if (isLethal) finalName = "Stillborn";
  else if (hasC) finalName = "Albino";
  else if (hasL) finalName = "Leucistic";
  else finalName = underlyingName;

  const patterns: string[] = [];
  if (W.includes("WM")) patterns.push("Marble");
  if (W.includes("WP")) patterns.push("Platinum");
  if (W.includes("WG")) patterns.push("Georgian");
  if (W.includes("W")) patterns.push("White Mark");
  const patternName = patterns.length > 0 ? patterns.join(" ") : "None";

  const isFullyMasked = finalName === "Albino" || finalName === "Stillborn";
  const displayName = `${patternName !== "None" && !isFullyMasked ? patternName + " " : ""}${finalName} Fox`;

  let eyeColor = providedEyeColor;
  if (!eyeColor) {
    let eyePoolName = finalName === "Albino" ? "Albino" : finalName;
    eyeColor = getRandomEyeColor(eyePoolName);
  }

  const whiteAllelesCount = W.filter((a) => a !== "w").length;
  if (whiteAllelesCount > 0 && !providedEyeColor && finalName !== "Albino") {
    const chance = whiteAllelesCount >= 2 ? 0.25 : 0.1;
    const rand = Math.random();
    if (rand < chance) {
      eyeColor = "Blue";
    } else if (rand < chance * 2) {
      eyeColor = `${eyeColor} - Blue Heterochromia`;
    }
  }

  return {
    name: displayName,
    baseColor: finalName,
    pattern: patternName,
    eyeColor: eyeColor,
    geneticName: displayName,
    description: `A beautiful ${displayName} with ${eyeColor.toLowerCase().replace(" - blue heterochromia", " and blue heterochromic")} eyes.`,
    isLethal,
    healthIssues: [
      ...(hasC ? ["Photosensitivity and reduced vision"] : []),
      ...(hasL
        ? ["Higher incidence of deafness and vision irregularities"]
        : []),
    ],
  };
}

export function generateStats(
  p1?: Stats,
  p2?: Stats,
  coi: number = 0,
  random: () => number = Math.random,
): Stats {
  if (!p1 || !p2) {
    const base = () => Math.floor(random() * 40) + 30;
    return {
      head: base(),
      topline: base(),
      forequarters: base(),
      hindquarters: base(),
      tail: base(),
      coatQuality: base(),
      temperament: base(),
      presence: base(),
      luck: base(),
      fertility: Math.floor(random() * 50) + 25,
    };
  }

  const inherit = (v1: number, v2: number) => {
    const mean = (v1 + v2) / 2;
    const variance = (random() - 0.5) * 10;
    return Math.max(1, Math.min(100, Math.round(mean + variance)));
  };

  const stats = {
    head: inherit(p1.head, p2.head),
    topline: inherit(p1.topline, p2.topline),
    forequarters: inherit(p1.forequarters, p2.forequarters),
    hindquarters: inherit(p1.hindquarters, p2.hindquarters),
    tail: inherit(p1.tail, p2.tail),
    coatQuality: inherit(p1.coatQuality, p2.coatQuality),
    temperament: inherit(p1.temperament, p2.temperament),
    presence: inherit(p1.presence, p2.presence),
    luck: inherit(p1.luck, p2.luck),
    fertility: inherit(p1.fertility, p2.fertility),
  };

  if (coi > 15) {
    const penaltyFactor = 1 - (coi - 15) / 100;
    stats.fertility = Math.max(1, Math.round(stats.fertility * penaltyFactor));
    stats.head = Math.max(1, Math.round(stats.head * penaltyFactor));
    stats.topline = Math.max(1, Math.round(stats.topline * penaltyFactor));
    stats.forequarters = Math.max(
      1,
      Math.round(stats.forequarters * penaltyFactor),
    );
    stats.hindquarters = Math.max(
      1,
      Math.round(stats.hindquarters * penaltyFactor),
    );
    stats.tail = Math.max(1, Math.round(stats.tail * penaltyFactor));
  }

  return stats;
}

export function breed(parent1: Genotype, parent2: Genotype): Genotype {
  const offspring: Genotype = {};
  for (const locus in LOCI) {
    const p1Alleles = parent1[locus];
    const p2Alleles = parent2[locus];
    if (!p1Alleles || !p2Alleles) {
      const alleles = LOCI[locus].alleles;
      offspring[locus] = [alleles[0], alleles[0]];
      continue;
    }
    const a1 = p1Alleles[Math.floor(Math.random() * 2)];
    const a2 = p2Alleles[Math.floor(Math.random() * 2)];
    offspring[locus] = [a1, a2];
  }
  return offspring;
}

export function calculateSilverIntensity(
  p1Intensity: number,
  p2Intensity: number,
): number {
  const avg = (p1Intensity + p2Intensity) / 2;
  const base = Math.ceil(avg);
  const variance =
    (typeof window !== "undefined" ? Math.random() : 0.5) * 3 - 1;
  return Math.max(1, Math.min(5, base + variance));
}

export function calculateCOI(
  foxIdOrSireId: string,
  foxes: Record<string, { parents: [string | null, string | null] }>,
  maybeDamId?: string,
): number {
  let sireId: string | null = null;
  let damId: string | null = null;
  if (maybeDamId) {
    sireId = foxIdOrSireId;
    damId = maybeDamId;
  } else {
    const fox = foxes[foxIdOrSireId];
    if (!fox || !fox.parents?.[0] || !fox.parents?.[1]) return 0;
    sireId = fox.parents[0];
    damId = fox.parents[1];
  }

  const getPaths = (
    id: string,
    depth: number = 0,
    currentPath: string[] = [],
  ): string[][] => {
    if (depth > 5) return [];
    const f = foxes[id];
    if (!f) return [currentPath.concat(id)];
    const paths: string[][] = [currentPath.concat(id)];
    if (f.parents?.[0])
      paths.push(...getPaths(f.parents[0], depth + 1, currentPath.concat(id)));
    if (f.parents?.[1])
      paths.push(...getPaths(f.parents[1], depth + 1, currentPath.concat(id)));
    return paths;
  };

  const sirePaths = getPaths(sireId);
  const damPaths = getPaths(damId);
  let coi = 0;
  const sireAncestors = new Set(sirePaths.flat());
  const damAncestors = new Set(damPaths.flat());
  const common = Array.from(sireAncestors).filter((id) => damAncestors.has(id));

  common.forEach((ancestorId) => {
    const sPaths = sirePaths.filter((p) => p[p.length - 1] === ancestorId);
    const dPaths = damPaths.filter((p) => p[p.length - 1] === ancestorId);
    sPaths.forEach((sp) => {
      dPaths.forEach((dp) => {
        const intersection = sp.filter((id) => dp.includes(id));
        if (intersection.length === 1 && intersection[0] === ancestorId) {
          const n = sp.length - 1;
          const m = dp.length - 1;
          coi += Math.pow(0.5, n + m + 1);
        }
      });
    });
  });
  return Math.round(coi * 1000) / 10;
}

export function createFox(
  data: Partial<Fox>,
  random: () => number = Math.random,
): Fox {
  const genotype = data.genotype || getInitialGenotype();
  const silverIntensity = data.silverIntensity || Math.floor(random() * 5) + 1;
  const phenotype = getPhenotype(genotype, silverIntensity, data.eyeColor);
  const name =
    data.name ||
    (phenotype.name !== "Unknown Fox" ? phenotype.name : "Unnamed Fox");

  return {
    id: data.id || Math.random().toString(36).substring(2, 9),
    name,
    genotype,
    phenotype: phenotype.name,
    baseColor: phenotype.baseColor,
    pattern: phenotype.pattern,
    eyeColor: phenotype.eyeColor,
    gender: data.gender || (random() > 0.5 ? "Dog" : "Vixen"),
    age: data.age ?? 2,
    stats: data.stats || generateStats(undefined, undefined, 0, random),
    genotypeRevealed: data.genotypeRevealed || false,
    pedigreeAnalyzed:
      data.pedigreeAnalyzed ??
      (data.parents
        ? data.parents[0] === null && data.parents[1] === null
        : true),
    isRetired: data.isRetired || false,
    hasBeenRenamed: data.hasBeenRenamed || false,
    silverIntensity,
    healthIssues: phenotype.healthIssues,
    pointsYear: 0,
    pointsLifetime: 0,
    parents: data.parents ?? [null, null],
    parentNames: data.parentNames ?? [null, null],
    birthYear: data.birthYear ?? 0,
    coi: data.coi ?? 0,
    isAtStud: data.isAtStud ?? false,
    studFee: data.studFee ?? 0,
    isNPC: data.isNPC || false,
    lastFed: data.lastFed || Date.now(),
    boosts: data.boosts || {},
    history: data.history || [],
  };
}

export function createFoundationalFox(
  random: () => number = Math.random,
  gender?: "Dog" | "Vixen",
): Fox {
  const safeRandom = random;
  const baseGenotypes: Record<string, [string, string]>[] = [
    { A: ["A", "A"], B: ["B", "B"] }, // Red
    { A: ["A", "A"], B: ["B", "b"] }, // Gold
    { A: ["A", "A"], B: ["b", "b"] }, // Standard Silver
    { A: ["A", "a"], B: ["B", "B"] }, // Gold Cross
    { A: ["A", "a"], B: ["B", "b"] }, // Silver Cross
    { A: ["A", "a"], B: ["b", "b"] }, // Standard Silver
    { A: ["a", "a"], B: ["B", "B"] }, // Alaskan Silver
    { A: ["a", "a"], B: ["B", "b"] }, // Alaskan Silver
    { A: ["a", "a"], B: ["b", "b"] }, // Standard Silver
  ];
  const genotype = getInitialGenotype();
  Object.assign(
    genotype,
    baseGenotypes[Math.floor(safeRandom() * baseGenotypes.length)],
  );

  const rareRand = safeRandom();
  const rareGenes = ["G", "C", "P", "Fire", "L"];
  if (rareRand < 0.5) {
    const gene = rareGenes[Math.floor(safeRandom() * rareGenes.length)];
    const locus = LOCI[gene];
    const alleles = locus.alleles.filter((a) => a !== locus.alleles[0]);
    if (alleles.length > 0) {
      const rare = alleles[Math.floor(safeRandom() * alleles.length)];
      genotype[gene] = [rare, rare];
    }
  } else if (rareRand < 0.8) {
    const gene = rareGenes[Math.floor(safeRandom() * rareGenes.length)];
    const locus = LOCI[gene];
    const alleles = locus.alleles.filter((a) => a !== locus.alleles[0]);
    if (alleles.length > 0) {
      const rare = alleles[Math.floor(safeRandom() * alleles.length)];
      genotype[gene] = [locus.alleles[0], rare];
    }
  }

  return createFox(
    { genotype, coi: 0, pedigreeAnalyzed: true, gender },
    safeRandom,
  );
}

function createFoundationalFoxWithGenotype(
  baseGenotype: Record<string, [string, string]>,
  random: () => number,
  gender?: "Dog" | "Vixen",
): Fox {
  const safeRandom = random;
  const genotype = getInitialGenotype();
  Object.assign(genotype, baseGenotype);
  const rareGenes = ["G", "C", "P", "Fire", "L"];
  if (safeRandom() > 0.75) {
    const gene = rareGenes[Math.floor(safeRandom() * rareGenes.length)];
    const locus = LOCI[gene];
    const alleles = locus.alleles.filter((a) => a !== locus.alleles[0]);
    if (alleles.length > 0) {
      const rare = alleles[Math.floor(safeRandom() * alleles.length)];
      genotype[gene] = [locus.alleles[0], rare];
    }
  }
  return createFox(
    { genotype, coi: 0, pedigreeAnalyzed: true, gender },
    safeRandom,
  );
}

export function createFoundationFoxCollection(
  random: () => number = Math.random,
): Fox[] {
  const safeRandom = random;
  const crossGenotypes: Record<string, [string, string]>[] = [
    { A: ["A", "a"], B: ["B", "B"] }, // Gold Cross
    { A: ["A", "a"], B: ["B", "b"] }, // Silver Cross
    { A: ["A", "a"], B: ["b", "b"] }, // Standard Silver
  ];
  const otherGenotypes: Record<string, [string, string]>[] = [
    { A: ["A", "A"], B: ["b", "b"] }, // Standard Silver
    { A: ["a", "a"], B: ["B", "B"] }, // Alaskan Silver
    { A: ["a", "a"], B: ["B", "b"] }, // Alaskan Silver
    { A: ["a", "a"], B: ["b", "b"] }, // Standard Silver
  ];
  const foxes: Fox[] = [];
  foxes.push(
    createFoundationalFoxWithGenotype(
      { A: ["A", "A"], B: ["B", "B"] },
      safeRandom,
    ),
  ); // RED
  foxes.push(
    createFoundationalFoxWithGenotype(
      { A: ["A", "A"], B: ["B", "b"] },
      safeRandom,
    ),
  ); // GOLD
  const crossGenotype =
    crossGenotypes[Math.floor(safeRandom() * crossGenotypes.length)];
  foxes.push(createFoundationalFoxWithGenotype(crossGenotype, safeRandom));
  for (let i = 0; i < 3; i++) {
    const all = [
      { A: ["A", "A"], B: ["B", "B"] },
      { A: ["A", "A"], B: ["B", "b"] },
      ...crossGenotypes,
      ...otherGenotypes,
    ];
    const genotype = all[Math.floor(safeRandom() * all.length)];
    foxes.push(createFoundationalFoxWithGenotype(genotype, safeRandom));
  }
  const blackFoxIndices = foxes
    .map((fox, index) => ({ fox, index }))
    .filter(({ fox }) => fox.silverIntensity === 1);
  if (blackFoxIndices.length > 1) {
    for (let i = 1; i < blackFoxIndices.length; i++) {
      const { index } = blackFoxIndices[i];
      foxes[index] = {
        ...foxes[index],
        silverIntensity: Math.floor(safeRandom() * 4) + 2,
      };
    }
  }
  for (let i = foxes.length - 1; i > 0; i--) {
    const j = Math.floor(safeRandom() * (i + 1));
    [foxes[i], foxes[j]] = [foxes[j], foxes[i]];
  }
  return foxes;
}

export function getActiveBoosts(fox: Fox): Record<string, number> {
  const now = Date.now();
  const activeBoosts: Record<string, number> = {};
  if (!fox.boosts) return activeBoosts;
  for (const [stat, expiry] of Object.entries(fox.boosts)) {
    if (expiry > now) activeBoosts[stat] = 2;
  }
  return activeBoosts;
}

export function isHungry(fox: Fox): boolean {
  return !fox.lastFed;
}
export function isGroomed(fox: Fox): boolean {
  return !!fox.lastGroomed;
}
export function isTrained(fox: Fox): boolean {
  return !!fox.lastTrained;
}

export const EYE_COLOR_WEIGHTS: Record<string, number> = {
  Amber: 35,
  "Light Brown": 35,
  Brown: 10,
  Green: 10,
  Grey: 10,
  Blue: 5,
};

export const PHENOTYPE_EYE_COLORS: Record<string, string[]> = {
  Red: ["Brown", "Light Brown", "Amber"],
  Gold: ["Brown", "Light Brown", "Amber"],
  "Burgundy Red": ["Light Brown", "Amber", "Green"],
  "Burgundy Gold": ["Light Brown", "Amber", "Green"],
  "Burgundy Cross": ["Light Brown", "Amber", "Green"],
  "Pearl Gold": ["Light Brown", "Amber"],
  "Pearl Cross": ["Light Brown", "Amber"],
  Albino: ["Red"],
  Silver: ["Brown", "Light Brown", "Amber"],
  "Alaskan Silver": ["Brown", "Light Brown", "Amber"],
  Black: ["Brown", "Light Brown", "Amber"],
  "Standard Silver": ["Brown", "Light Brown", "Amber"],
  "Double Silver": ["Brown", "Light Brown", "Amber"],
  "Gold Cross": ["Brown", "Light Brown", "Amber"],
  "Silver Cross": ["Brown", "Light Brown", "Amber"],
  Colicott: ["Blue"],
  Burgundy: ["Light Brown", "Amber", "Green"],
  Pearl: ["Light Brown", "Amber", "Green", "Grey"],
  Amber: ["Amber", "Grey", "Green", "Blue"],
  Champagne: ["Blue"],
  "Fawn Glow": ["Blue"],
  "Amber Red": ["Amber", "Grey", "Green", "Blue"],
  "Amber Gold": ["Amber", "Grey", "Green", "Blue"],
  "Amber Cross": ["Amber", "Grey", "Green", "Blue"],
  Wildfire: ["Brown", "Light Brown", "Amber"],
  "Golden Sunrise": ["Brown", "Light Brown", "Amber"],
  "Fire Cross": ["Brown", "Light Brown", "Amber", "Green"],
  "Cinnamon Fire": ["Amber", "Green"],
  "Snow Glow": ["Amber", "Brown", "Light Brown", "Green", "Blue"],
  "Fire and Ice": ["Brown", "Light Brown", "Amber", "Grey"],
  "Moon Glow": ["Brown", "Light Brown", "Amber", "Grey"],
  "Autumn Fire": ["Amber", "Grey", "Blue"],
  "Champagne Cross": ["Blue"],
};

export function getRandomEyeColor(phenotypeName: string): string {
  const possibleColors = PHENOTYPE_EYE_COLORS[phenotypeName] || ["Brown"];
  if (possibleColors.length === 1) return possibleColors[0];
  if (typeof window === "undefined") return possibleColors[0];
  const weightedColors = possibleColors.map((color) => ({
    color,
    weight: EYE_COLOR_WEIGHTS[color] || 10,
  }));
  const totalWeight = weightedColors.reduce(
    (sum, item) => sum + item.weight,
    0,
  );
  let rand = Math.random() * totalWeight;
  for (const item of weightedColors) {
    if (rand < item.weight) return item.color;
    rand -= item.weight;
  }
  return possibleColors[0];
}

export function getBaseEyeColors(
  genotype: Genotype,
  silverIntensity: number = 3,
): string[] {
  const tempGenotype = { ...genotype };
  delete tempGenotype.W;
  delete tempGenotype.L;
  const phenotype = getPhenotype(tempGenotype, silverIntensity);
  let eyePoolName =
    phenotype.baseColor === "Albino" ? "Albino" : phenotype.baseColor;
  return [...(PHENOTYPE_EYE_COLORS[eyePoolName] || ["Brown"])];
}

export function getWhiteMarkingOptions(genotype: Genotype): string[] {
  const W = genotype.W || ["w", "w"];
  const L = genotype.L || ["l", "l"];
  const options: string[] = [];
  if (W.some((a) => a !== "w")) options.push("Blue", "Blue Heterochromia");
  if (L.some((a) => a === "l")) options.push("Any Base Color");
  return options;
}

export function getValidEyeColors(
  genotype: Genotype,
  silverIntensity: number = 3,
): string[] {
  const baseColors = getBaseEyeColors(genotype, silverIntensity);
  const W = genotype.W || ["w", "w"];
  const L = genotype.L || ["l", "l"];
  if (!W.some((a) => a !== "w") && !L.some((a) => a === "l")) return baseColors;
  if (W.some((a) => a !== "w") && !L.some((a) => a === "l"))
    return [...baseColors, "Blue", "Blue Heterochromia"];
  if (L.some((a) => a === "l")) return baseColors;
  return baseColors;
}

export function getEyeColorHex(eyeColor: string, baseColor?: string): string {
  const colorMap: Record<string, string> = {
    Brown: "#8B4513",
    "Light Brown": "#D2691E",
    Amber: "#FFBF00",
    Green: "#228B22",
    Grey: "#808080",
    Blue: "#4169E1",
    Red: "#DC143C",
  };
  if (eyeColor === "Blue Heterochromia" && baseColor) {
    const baseHex = colorMap[baseColor] || "#8B4513";
    return `linear-gradient(45deg, #4169E1 50%, ${baseHex} 50%)`;
  }
  if (eyeColor === "Blue Heterochromia")
    return "linear-gradient(45deg, #4169E1 50%, #8B4513 50%)";
  return colorMap[eyeColor] || "#8B4513";
}

export function calculateBreedingOutcomes(
  m: Fox,
  f: Fox,
  foxes: Record<string, Fox>,
) {
  const counts: Record<string, number> = {};
  const trials = 1000;
  for (let i = 0; i < trials; i++) {
    const child = breed(m.genotype, f.genotype);
    if (child) {
      const name = getPhenotype(child).name;
      counts[name] = (counts[name] || 0) + 1;
    }
  }
  const probabilities = Object.entries(counts)
    .map(([name, count]) => ({
      name,
      percent: Math.round((count / trials) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);
  return {
    probabilities,
    predictedCOI: Math.round(calculateCOI(m.id, foxes, f.id) * 100) / 100,
  };
}

declare var process: any;
