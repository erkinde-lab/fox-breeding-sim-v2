export type Allele = string;
export type Genotype = Record<string, Allele[]>;

export const LOCI: Record<string, { name: string; alleles: Allele[]; lethal?: string[] }> = {
  A: { name: 'Agouti', alleles: ['A', 'a'] },
  B: { name: 'Black', alleles: ['B', 'b'] },
  C: { name: 'Albino', alleles: ['C', 'c'] }, // cc = Albino
  G: { name: 'Burgundy', alleles: ['G', 'g'] }, // gg = Burgundy
  P: { name: 'Pearl', alleles: ['P', 'p'] }, // pp = Pearl
  SS: { name: 'Mansfield Pearl', alleles: ['S', 's'] }, // ss = Mansfield Pearl
  Fire: { name: 'Fire', alleles: ['FI', 'fi'] }, // fi = Fire (Recessive)
  W: { name: 'White Markings', alleles: ['w', 'W', 'Wp', 'WM', 'WG'], lethal: ['WW', 'WpWp', 'WMWM', 'WGWG'] },
  L: { name: 'Leucistic', alleles: ['L', 'l'] }, // ll = Leucistic
};

export function getInitialGenotype(): Genotype {
  const genotype: Genotype = {};
  for (const locus in LOCI) {
    const alleles = LOCI[locus].alleles;
    genotype[locus] = [alleles[0], alleles[0]];
  }
  return genotype;
}

export function getPhenotype(genotype: Genotype, silverIntensity?: number, providedEyeColor?: string) {
  const A = genotype.A || ['A', 'A'];
  const B = genotype.B || ['B', 'B'];
  const C = genotype.C || ['C', 'C'];
  const G = genotype.G || ['G', 'G'];
  const P = genotype.P || ['P', 'P'];
  const SS = genotype.SS || ['S', 'S'];
  const Fire = genotype.Fire || ['FI', 'FI'];
  const L = genotype.L || ['L', 'L'];
  const W = [...(genotype.W || ['w', 'w'])].sort();

  // Lethal check
  let isLethal = false;
  for (const locusKey in LOCI) {
    const alleles = genotype[locusKey];
    if (alleles && LOCI[locusKey].lethal) {
      const combo = [...alleles].sort().join('');
      if (LOCI[locusKey].lethal?.includes(combo)) {
        isLethal = true;
        break;
      }
    }
  }

  // Basic flags
  const hasC = C.filter(x => x === 'c').length === 2;
  const hasL = L.filter(x => x === 'l').length === 2;
  const hasG = G.filter(x => x === 'g').length === 2;
  const hasP = P.filter(x => x === 'p').length === 2;
  const hasSS = SS.filter(x => x === 's').length === 2;
  const isFifi = Fire.filter(x => x === 'fi').length === 2;

  // Base Color Logic
  let baseColorName = 'Red';
  const aCount = A.filter(x => x === 'a').length;
  const bCount = B.filter(x => x === 'b').length;

  if (aCount === 0 && bCount === 0) baseColorName = 'Red'; // AABB
  else if (aCount === 0 && bCount === 1) baseColorName = 'Gold'; // AABb
  else if (aCount === 0 && bCount === 2) baseColorName = 'Standard Silver'; // AAbb
  else if (aCount === 1 && bCount === 0) baseColorName = 'Gold Cross'; // AaBB
  else if (aCount === 1 && bCount === 1) baseColorName = 'Silver Cross'; // AaBb
  else if (aCount === 1 && bCount === 2) baseColorName = 'Standard Silver'; // Aabb
  else if (aCount === 2 && bCount === 0) baseColorName = 'Alaskan Silver'; // aaBB
  else if (aCount === 2 && bCount === 1) baseColorName = 'Alaskan Silver'; // aaBb
  else if (aCount === 2 && bCount === 2) baseColorName = 'Standard Silver'; // aabb

  const isCrossBase = baseColorName === 'Gold Cross' || baseColorName === 'Silver Cross';
  const isRedGoldBase = baseColorName === 'Red' || baseColorName === 'Gold';

  // Helper flags
  const isAmber = hasG && hasP;
  const isPearlAmber = hasG && hasP && hasSS;
  const isSapphire = hasP && hasSS && !hasG;
  const isBurgundy = hasG && !hasP;
  const isPearl = hasP && !hasSS && !hasG;
  const isMansfieldPearl = hasSS && !hasP && !hasG;

  let underlyingName = "";

  if (isFifi) {
    // Fire Expression
    if (aCount === 2) { // Alaskan base
      if (hasG || hasP) underlyingName = "Snow Glow";
      else underlyingName = "Colicott";
    } else if (aCount === 1) { // Cross base
      if (hasP) underlyingName = "Moon Glow";
      else underlyingName = "Fire Cross";
    } else if (bCount === 2) { // Standard Silver base
      if (hasG) underlyingName = "Cinnamon Fire";
      else if (hasP) underlyingName = "Fawn Glow";
      else underlyingName = "Colicott";
    } else { // Red/Gold base
      if (hasG && hasP) underlyingName = "Autumn Fire";
      else if (hasP) underlyingName = "Fire and Ice";
      else if (hasG) underlyingName = "Snow Glow";
      else if (baseColorName === "Gold") underlyingName = "Golden Sunrise";
      else underlyingName = "Wildfire";
    }
  }

  if (!underlyingName) {
    if (isPearlAmber) {
      if (baseColorName === "Red") underlyingName = "Pearl Amber Red";
      else if (baseColorName === "Gold" || baseColorName === "Gold Cross") underlyingName = "Pearl Amber Gold";
      else underlyingName = "Pearl Amber";
    } else if (isAmber) {
      underlyingName = "Amber";
    } else if (isSapphire) {
      underlyingName = "Sapphire";
    } else if (isBurgundy) {
      underlyingName = "Burgundy";
    } else if (isPearl) {
      underlyingName = "Pearl";
    } else if (isMansfieldPearl) {
      underlyingName = "Mansfield Pearl";
    }

    // Suffix/Masking logic
    if (underlyingName) {
        if (baseColorName === "Red" && (underlyingName === "Burgundy" || underlyingName === "Pearl" || underlyingName === "Mansfield Pearl")) {
          underlyingName = ""; // Masked
        } else if (baseColorName === "Alaskan Silver" && hasG) {
          underlyingName = "Champagne";
        } else if (baseColorName === "Silver Cross" && hasG) {
          underlyingName = "Pink Cross";
        } else if (isRedGoldBase && !underlyingName.startsWith("Pearl Amber") && underlyingName !== "Sapphire" && underlyingName !== "Amber") {
          underlyingName = `${underlyingName} ${baseColorName}`;
        }
    }
  }

  if (!underlyingName) {
    let baseToUse = baseColorName;
    if (baseToUse === 'Alaskan Silver' || baseToUse === 'Standard Silver') {
      baseToUse = silverIntensity === 1 ? 'Black' : 'Silver';
    }
    underlyingName = baseToUse;
  } else if (isCrossBase && !underlyingName.includes('Cross') && !underlyingName.includes('Glow') && !underlyingName.includes('Fire') && !underlyingName.startsWith('Pearl Amber')) {
    underlyingName = `${underlyingName} Cross`;
  }

  let finalName = "";
  if (isLethal) finalName = 'Stillborn';
  else if (hasC) finalName = 'Albino';
  else if (hasL) finalName = 'Leucistic';
  else finalName = underlyingName;

  // Pattern Logic
  const patterns: string[] = [];
  if (W.includes('WM')) patterns.push('Marble');
  if (W.includes('Wp')) patterns.push('Platinum');
  if (W.includes('WG')) patterns.push('Georgian');
  if (W.includes('W')) patterns.push('White Mark');
  const patternName = patterns.length > 0 ? patterns.join(' ') : 'None';

  const isMaskingPhenotype = finalName === 'Albino' || finalName === 'Leucistic' || finalName === 'Stillborn';
  let displayName = `${patternName !== 'None' && !isMaskingPhenotype ? patternName + ' ' : ''}${finalName} Fox`;

  // Eye Color Logic
  let eyeColor = providedEyeColor;
  if (!eyeColor) {
    let eyePoolName = finalName === "Albino" ? "Albino" : finalName;
    if (eyePoolName.startsWith("Pearl Amber")) eyePoolName = "Pearl Amber";
    eyeColor = getRandomEyeColor(eyePoolName);
  }

  // W locus logic
  const whiteAllelesCount = W.filter(a => a !== 'w').length;
  if (whiteAllelesCount > 0 && !providedEyeColor && finalName !== "Albino") {
    const chance = whiteAllelesCount >= 2 ? 0.25 : 0.10;
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
    healthIssues: [],
  };
}

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
  gender: 'Male' | 'Female';
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
  birthYear: number;
  coi: number;
  isAtStud: boolean;
  studFee: number;
  isNPC?: boolean;
  lastFed?: number;
  boosts?: Record<string, number>;
  preferredFeed?: string;
}

export function generateStats(p1?: Stats, p2?: Stats, coi: number = 0): Stats {
  const base = () => Math.floor(Math.random() * 16) + 5;
  if (!p1 || !p2) {
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
      fertility: Math.floor(Math.random() * 50) + 25,
    };
  }

  const inherit = (v1: number, v2: number) => {
    const mean = (v1 + v2) / 2;
    const variance = (Math.random() - 0.5) * 10;
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
    stats.forequarters = Math.max(1, Math.round(stats.forequarters * penaltyFactor));
    stats.hindquarters = Math.max(1, Math.round(stats.hindquarters * penaltyFactor));
    stats.tail = Math.max(1, Math.round(stats.tail * penaltyFactor));
  }

  return stats;
}

export function breed(parent1: Genotype, parent2: Genotype): Genotype | null {
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

  if (getPhenotype(offspring).isLethal) return null;
  return offspring;
}

export function calculateSilverIntensity(p1Intensity: number, p2Intensity: number): number {
  const avg = (p1Intensity + p2Intensity) / 2;
  const base = Math.ceil(avg);
  const variance = Math.floor(Math.random() * 3) - 1;
  return Math.max(1, Math.min(5, base + variance));
}

export function calculateCOI(foxId: string, foxes: Record<string, { parents: [string | null, string | null] }>): number {
  const fox = foxes[foxId];
  if (!fox || !fox.parents[0] || !fox.parents[1]) return 0;

  const getPaths = (id: string, depth: number = 0, currentPath: string[] = []): string[][] => {
    if (depth > 5) return [];
    const f = foxes[id];
    if (!f) return [currentPath.concat(id)];

    const paths: string[][] = [currentPath.concat(id)];
    if (f.parents[0]) paths.push(...getPaths(f.parents[0], depth + 1, currentPath.concat(id)));
    if (f.parents[1]) paths.push(...getPaths(f.parents[1], depth + 1, currentPath.concat(id)));
    return paths;
  };

  const sirePaths = getPaths(fox.parents[0]);
  const damPaths = getPaths(fox.parents[1]);

  let coi = 0;
  const sireAncestors = new Set(sirePaths.flat());
  const damAncestors = new Set(damPaths.flat());
  const common = Array.from(sireAncestors).filter(id => damAncestors.has(id));

  common.forEach(ancestorId => {
    const sPaths = sirePaths.filter(p => p[p.length - 1] === ancestorId);
    const dPaths = damPaths.filter(p => p[p.length - 1] === ancestorId);

    sPaths.forEach(sp => {
      dPaths.forEach(dp => {
        const intersection = sp.filter(id => dp.includes(id));
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

export function createFox(data: Partial<Fox>): Fox {
  const genotype = data.genotype || getInitialGenotype();
  const silverIntensity = data.silverIntensity || Math.floor(Math.random() * 5) + 1;
  const phenotype = getPhenotype(genotype, silverIntensity, data.eyeColor);
  const name = data.name || (phenotype.name !== "Unknown Fox" ? phenotype.name : "Unnamed Fox");

  return {
    id: data.id || Math.random().toString(36).substring(2, 9),
    name: name,
    genotype,
    phenotype: phenotype.name,
    baseColor: phenotype.baseColor,
    pattern: phenotype.pattern,
    eyeColor: phenotype.eyeColor,
    gender: data.gender || (Math.random() > 0.5 ? "Male" : "Female"),
    age: data.age || 2,
    stats: data.stats || generateStats(),
    genotypeRevealed: data.genotypeRevealed || false,
    pedigreeAnalyzed: data.pedigreeAnalyzed || false,
    isRetired: data.isRetired || false,
    hasBeenRenamed: data.hasBeenRenamed || false,
    silverIntensity: silverIntensity,
    healthIssues: phenotype.healthIssues,
    pointsYear: 0,
    pointsLifetime: 0,
    parents: data.parents || [null, null],
    birthYear: data.birthYear || 0,
    coi: data.coi || 0,
    isAtStud: data.isAtStud || false,
    studFee: data.studFee || 0,
    isNPC: data.isNPC || false,
    lastFed: data.lastFed || Date.now(),
    boosts: data.boosts || {},
  };
}

export function createFoundationalFox(random: () => number = Math.random): Fox {
  const baseGenotypes: Record<string, [string, string]>[] = [
    { A: ['A', 'A'], B: ['B', 'B'] }, // Red
    { A: ['a', 'a'], B: ['B', 'B'] }, // Alaskan Silver
    { A: ['A', 'A'], B: ['b', 'b'] }, // Standard Silver
    { A: ['A', 'a'], B: ['B', 'b'] }, // Silver Cross
  ];

  const base = baseGenotypes[Math.floor(random() * baseGenotypes.length)];
  const genotype = getInitialGenotype();
  Object.assign(genotype, base);

  // Possible rare recessive
  const rareGenes = ['G', 'C', 'P', 'SS', 'Fire', 'W', 'L'];
  if (random() > 0.6) {
    const gene = rareGenes[Math.floor(random() * rareGenes.length)];
    const locus = LOCI[gene];
    const alleles = locus.alleles.filter(a => a !== locus.alleles[0]);
    if (alleles.length > 0) {
      const rare = alleles[Math.floor(random() * alleles.length)];
      genotype[gene] = [locus.alleles[0], rare];
    }
  }

  return createFox({
    genotype,
  });
}

export function getActiveBoosts(fox: Fox): Record<string, number> {
  const now = Date.now();
  const activeBoosts: Record<string, number> = {};
  if (!fox.boosts) return activeBoosts;

  for (const [stat, expiry] of Object.entries(fox.boosts)) {
    if (expiry > now) {
      activeBoosts[stat] = 2; // Each boost is +2
    }
  }
  return activeBoosts;
}

export function isHungry(fox: Fox): boolean {
  if (!fox.lastFed) return true;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return (Date.now() - fox.lastFed) > oneWeek;
}

export const EYE_COLOR_WEIGHTS: Record<string, number> = {
  'Amber': 35,
  'Light Brown': 35,
  'Brown': 10,
  'Green': 10,
  'Grey': 10,
  'Blue': 5,
};

export const PHENOTYPE_EYE_COLORS: Record<string, string[]> = {
  'Red': ['Brown', 'Light Brown', 'Amber'],
  'Gold': ['Brown', 'Light Brown', 'Amber'],
  'Burgundy Gold': ['Amber'],
  'Pearl Gold': ['Light Brown', 'Amber'],
  'Amber Gold': ['Amber'],
  'Albino': ['Red'],
  'Silver': ['Brown'],
  'Alaskan Silver': ['Brown', 'Light Brown', 'Amber'],
  'Black': ['Brown', 'Light Brown', 'Amber'],
  'Colicott': ['Blue'],
  'Burgundy': ['Light Brown', 'Amber', 'Green'],
  'Pearl': ['Light Brown', 'Amber', 'Green', 'Grey'],
  'Mansfield Pearl': ['Light Brown', 'Amber', 'Green', 'Grey'],
  'Amber': ['Amber', 'Grey', 'Green', 'Blue'],
  'Champagne': ['Blue'],
  'Fawn Glow': ['Blue'],
  'Sapphire': ['Grey', 'Green', 'Blue'],
  'Pearl Amber': ['Amber', 'Grey', 'Green', 'Blue'],
  'Cross': ['Brown', 'Light Brown', 'Amber'],
  'Silver Cross': ['Brown', 'Light Brown', 'Amber'],
  'Pearl Cross': ['Light Brown', 'Amber'],
  'Burgundy Cross': ['Amber'],
  'Amber Cross': ['Amber', 'Grey', 'Green'],
  'Pink Cross': ['Blue'],
  'Wildfire': ['Brown', 'Light Brown', 'Amber'],
  'Golden Sunrise': ['Brown', 'Light Brown', 'Amber'],
  'Fire Cross': ['Brown', 'Light Brown', 'Amber', 'Green'],
  'Cinnamon Fire': ['Amber', 'Green'],
  'Snow Glow': ['Amber', 'Brown', 'Light Brown', 'Green', 'Blue'],
  'Fire and Ice': ['Brown', 'Light Brown', 'Amber', 'Grey'],
  'Moon Glow': ['Brown', 'Light Brown', 'Amber', 'Grey'],
  'Autumn Fire': ['Amber', 'Grey', 'Blue'],
};

export function getRandomEyeColor(phenotypeName: string): string {
  const possibleColors = PHENOTYPE_EYE_COLORS[phenotypeName] || ['Brown'];
  if (possibleColors.length === 1) return possibleColors[0];

  const weightedColors = possibleColors.map(color => ({
    color,
    weight: EYE_COLOR_WEIGHTS[color] || 10
  }));

  const totalWeight = weightedColors.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of weightedColors) {
    if (random < item.weight) return item.color;
    random -= item.weight;
  }

  return possibleColors[0];
}

export function getValidEyeColors(genotype: Genotype, silverIntensity: number = 3): string[] {
  const phenotype = getPhenotype(genotype, silverIntensity);
  let eyePoolName = phenotype.baseColor === "Albino" ? "Albino" : phenotype.baseColor;
  if (eyePoolName.startsWith("Pearl Amber")) eyePoolName = "Pearl Amber";

  const colors = [...(PHENOTYPE_EYE_COLORS[eyePoolName] || ['Brown'])];

  // Add White Mark options if applicable
  const W = genotype.W || ['w', 'w'];
  if (W.some(a => a !== 'w') && phenotype.baseColor !== "Albino") {
    if (!colors.includes("Blue")) colors.push("Blue");
    if (!colors.includes("Blue Heterochromia")) {
        colors.push("Blue Heterochromia");
    }
  }

  return colors;
}
