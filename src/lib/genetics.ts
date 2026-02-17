export type Allele = string;
export type Genotype = Record<string, [Allele, Allele]>;

export interface Locus {
  name: string;
  alleles: string[];
  dominant?: string;
  lethal?: string[];
}

export const LOCI: Record<string, Locus> = {
  A: {
    name: 'Standard Silver',
    alleles: ['A', 'a'], // A = Red, a = Standard Silver
  },
  B: {
    name: 'Alaskan Silver',
    alleles: ['B', 'b'], // B = Red, b = Alaskan Silver
  },
  G: {
    name: 'Burgundy',
    alleles: ['G', 'g'], // G = Normal, g = Burgundy
  },
  C: {
    name: 'Albino',
    alleles: ['C', 'c'], // c = Albino (Recessive)
  },
  P: {
    name: 'Pearl',
    alleles: ['P', 'p'], // p = Pearl (Recessive)
  },
  SS: {
    name: 'Mansfield Pearl',
    alleles: ['S', 's'], // s = Mansfield Pearl (Recessive)
  },
  Fire: {
    name: 'Fire',
    alleles: ['fi', 'Fi'], // Fi = Fire (Dominant)
  },
  W: {
    name: 'White Series',
    alleles: ['w', 'W', 'Wp', 'WM', 'WG'], 
    lethal: ['WW', 'WWp', 'WpWp', 'WGWG', 'WGWp', 'WGW'],
  },
  L: {
    name: 'Leucistic',
    alleles: ['L', 'l'], 
  },
  D: {
    name: 'Dilute',
    alleles: ['D', 'd'],
  },
};

export function getInitialGenotype(): Genotype {
  const genotype: Genotype = {};
  for (const key in LOCI) {
    const locus = LOCI[key];
    genotype[key] = [locus.alleles[0], locus.alleles[0]];
  }
  return genotype;
}

export interface Phenotype {
  name: string;
  baseColor: string;
  pattern: string;
  eyeColor: string;
  geneticName: string;
  description: string;
  isLethal: boolean;
  healthIssues: string[];
}

export function getPhenotype(genotype: Genotype, isTested: boolean = false): Phenotype {
  const a = [...genotype.A].sort().join('');
  const b = [...genotype.B].sort().join('');
  const G = [...genotype.G].sort().join('');
  const C = [...genotype.C].sort().join('');
  const P = [...genotype.P].sort().join('');
  const SS = [...genotype.SS].sort().join('');
  const Fire = [...genotype.Fire].sort().join('');
  const W = [...genotype.W].sort();
  const L = [...genotype.L].sort().join('');
  const D = [...genotype.D].sort().join('');

  const healthIssues: string[] = [];
  let eyeColor = 'Orange/Amber';
  
  const wString = W.join('');
  if (LOCI.W.lethal?.includes(wString)) {
    return {
        name: 'Lethal White Combination',
        baseColor: 'White',
        pattern: 'Lethal',
        eyeColor: 'N/A',
        geneticName: 'Lethal White Combination',
        description: 'Homozygous white series mutations are often lethal.',
        isLethal: true,
        healthIssues: ['Lethal'],
    };
  }

  // Albino masks everything
  if (C === 'cc') {
    return {
        name: 'Albino Fox',
        baseColor: 'White',
        pattern: 'None',
        eyeColor: 'Pink/Red',
        geneticName: 'Albino',
        description: 'A pure white fox with pinkish eyes due to lack of pigment.',
        isLethal: false,
        healthIssues: [],
    };
  }

  if (L === 'll') {
    return {
        name: 'Leucistic Fox',
        baseColor: 'White',
        pattern: 'None',
        eyeColor: 'Blue',
        geneticName: 'Leucistic',
        description: 'A pure white fox with blue eyes.',
        isLethal: false,
        healthIssues: ['Deafness Risk'],
    };
  }

  // 1. Base Color Logic
  let baseColorName = 'Red';
  let internalBaseColor = 'Red';

  if (a === 'AA' && b === 'BB') {
    baseColorName = 'Red';
    internalBaseColor = 'Red';
  } else if (a === 'AA' && b === 'Bb') {
    baseColorName = 'Gold';
    internalBaseColor = 'Gold';
  } else if (a === 'Aa' && b === 'BB') {
    baseColorName = 'Gold Cross';
    internalBaseColor = 'Gold Cross';
  } else if (a === 'Aa' && b === 'Bb') {
    baseColorName = 'Silver Cross';
    internalBaseColor = 'Silver Cross';
  } else if (a === 'aa' && (b === 'BB' || b === 'Bb')) {
    baseColorName = 'Silver'; // Player display
    internalBaseColor = 'Alaskan Silver'; // In code
  } else if ((a === 'AA' || a === 'Aa' || a === 'aa') && b === 'bb') {
    baseColorName = 'Silver'; // Player display
    internalBaseColor = 'Standard Silver'; // In code
  }

  // 2. Modifiers and Combinations
  const isBurgundy = G === 'gg';
  const isPearl = P === 'pp';
  const isSS = SS === 'ss';
  const isFireFiFi = Fire === 'FiFi';
  const isFireAny = Fire.includes('Fi');
  const isDilute = D === 'dd';

  let finalName = '';
  let finalBaseColor = baseColorName;

  // Named Combinations
  if (isFireFiFi && isPearl && isBurgundy && (internalBaseColor === 'Red' || internalBaseColor === 'Gold')) {
    finalName = 'Snow Glow';
  } else if (isFireFiFi && isPearl && (internalBaseColor === 'Red' || internalBaseColor === 'Gold')) {
    finalName = 'Snow Glow';
  } else if (isFireFiFi && isPearl && isBurgundy) {
    finalName = 'Autumn Fire';
  } else if (isFireFiFi && isPearl && (internalBaseColor === 'Gold Cross' || internalBaseColor === 'Silver Cross')) {
    finalName = 'Fire and Ice';
  } else if (isFireFiFi && (internalBaseColor === 'Gold Cross' || internalBaseColor === 'Silver Cross')) {
    finalName = 'Fire Cross';
  } else if (isFireFiFi && internalBaseColor === 'Red') {
    finalName = 'Wildfire';
  } else if (isFireFiFi && internalBaseColor === 'Gold') {
    finalName = 'Golden Sunrise';
  } else if (isFireFiFi && isPearl) {
    finalName = 'Fawn Glow';
  } else if (isBurgundy && isPearl && isSS) {
    finalName = 'Pearl Amber';
    eyeColor = 'Green';
  } else if (isPearl && isSS) {
    finalName = 'Sapphire';
  } else if (isBurgundy && isPearl) {
    finalName = 'Amber';
    eyeColor = 'Green';
  }

  // If no special name, build it
  if (!finalName) {
    const mods: string[] = [];
    if (isBurgundy) mods.push('Burgundy');
    if (isPearl) mods.push('Pearl');
    if (isSS) mods.push('Mansfield Pearl');
    if (isFireAny) mods.push('Fire');
    if (isDilute) mods.push('Dilute');

    // Silver is masked by Burgundy, Pearl
    const masksSilver = isBurgundy || isPearl;
    let baseToUse = baseColorName;
    if (masksSilver && baseColorName === 'Silver') {
      baseToUse = '';
    } else if (masksSilver && baseColorName === 'Silver Cross') {
      baseToUse = 'Cross';
    }

    if (mods.length > 0) {
      if (baseToUse === 'Red') {
        finalName = mods.join(' ');
      } else {
        finalName = `${mods.join(' ')} ${baseToUse}`.trim();
      }
    } else {
      finalName = baseToUse;
    }
  }

  // Pattern Logic
  let patternName = 'None';
  const wmCount = W.filter(x => x === 'WM').length;
  const wpCount = W.filter(x => x === 'Wp').length;
  const wgCount = W.filter(x => x === 'WG').length;
  const wStandardCount = W.filter(x => x === 'W').length;

  if (wmCount >= 1 && wpCount >= 1) {
    patternName = 'Marble Platinum';
  } else if (wmCount >= 1) {
    patternName = 'Marble';
  } else if (wpCount >= 1) {
    patternName = 'Platinum';
  } else if (wgCount >= 1) {
    patternName = 'Georgian';
  } else if (wStandardCount >= 1) {
    patternName = 'White Mark';
  }

  let displayName = '';
  if (patternName !== 'None') {
    displayName = `${patternName} ${finalName} Fox`;
  } else {
    displayName = `${finalName} Fox`;
  }

  return {
    name: displayName,
    baseColor: finalName,
    pattern: patternName,
    eyeColor: eyeColor,
    geneticName: displayName,
    description: `A beautiful ${displayName} with ${eyeColor.toLowerCase()} eyes.`,
    isLethal: false,
    healthIssues,
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

export function calculateCOI(foxId: string, foxes: Record<string, { parents: [string | null, string | null ] }>): number {
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
  const phenotype = getPhenotype(genotype);
  return {
    id: data.id || Math.random().toString(36).substring(2, 9),
    name: data.name || 'Unnamed Fox',
    genotype,
    phenotype: phenotype.name,
    baseColor: phenotype.baseColor,
    pattern: phenotype.pattern,
    eyeColor: phenotype.eyeColor,
    gender: data.gender || (Math.random() > 0.5 ? 'Male' : 'Female'),
    age: data.age || 2,
    stats: data.stats || generateStats(),
    genotypeRevealed: data.genotypeRevealed || false,
    pedigreeAnalyzed: data.pedigreeAnalyzed || false,
    isRetired: data.isRetired || false,
    hasBeenRenamed: data.hasBeenRenamed || false,
    silverIntensity: data.silverIntensity || Math.floor(Math.random() * 5) + 1,
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

export function createFoundationalFox(): Fox {
  const baseGenotypes: Record<string, [string, string]>[] = [
    { A: ['A', 'A'], B: ['B', 'B'] }, // Red
    { A: ['a', 'a'], B: ['B', 'B'] }, // Alaskan Silver
    { A: ['A', 'A'], B: ['b', 'b'] }, // Standard Silver
    { A: ['A', 'a'], B: ['B', 'b'] }, // Silver Cross
  ];

  const base = baseGenotypes[Math.floor(Math.random() * baseGenotypes.length)];
  const genotype = getInitialGenotype();
  Object.assign(genotype, base);
  
  // Possible rare recessive
  const rareGenes = ['G', 'C', 'P', 'SS', 'Fire', 'W', 'L', 'D'];
  if (Math.random() > 0.6) {
    const gene = rareGenes[Math.floor(Math.random() * rareGenes.length)];
    const locus = LOCI[gene];
    const alleles = locus.alleles.filter(a => a !== locus.alleles[0]);
    if (alleles.length > 0) {
        const rare = alleles[Math.floor(Math.random() * alleles.length)];
        genotype[gene] = [locus.alleles[0], rare];
    }
  }

  return createFox({
    name: 'Foundational Fox',
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
