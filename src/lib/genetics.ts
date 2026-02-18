export type Allele = string;
export type Genotype = Record<string, Allele[]>;

export const LOCI: Record<string, { name: string; alleles: Allele[] }> = {
  A: { name: 'Agouti', alleles: ['A', 'a'] },
  B: { name: 'Black', alleles: ['B', 'b'] },
  C: { name: 'Color', alleles: ['C', 'c'] }, // cc = Albino
  G: { name: 'Amber', alleles: ['G', 'g'] }, // gg = Amber
  P: { name: 'Pearl', alleles: ['P', 'p'] }, // pp = Pearl
  SS: { name: 'Burgundy', alleles: ['S', 's'] }, // ss = Burgundy (Mansfield Pearl)
  Fire: { name: 'Fire', alleles: ['Fire', 'fi'] },
  W: { name: 'White Markings', alleles: ['w', 'W', 'Wp', 'WM', 'WG'] },
  L: { name: 'Leucistic', alleles: ['L', 'l'] }, // ll = Leucistic
  D: { name: 'Dilute', alleles: ['D', 'd'] }, // dd = Dilute
};

export function getInitialGenotype(): Genotype {
  const genotype: Genotype = {};
  for (const locus in LOCI) {
    const alleles = LOCI[locus].alleles;
    genotype[locus] = [alleles[0], alleles[0]];
  }
  return genotype;
}

export function getPhenotype(genotype: Genotype) {
  const A = genotype.A || ['A', 'A'];
  const B = genotype.B || ['B', 'B'];
  const C = genotype.C || ['C', 'C'];
  const G = genotype.G || ['G', 'G'];
  const P = genotype.P || ['P', 'P'];
  const SS = genotype.SS || ['S', 'S'];
  const Fire = genotype.Fire || ['fi', 'fi'];
  const L = genotype.L || ['L', 'L'];
  const D = genotype.D || ['D', 'D'];
  const W = [...(genotype.W || ['w', 'w'])].sort();

  // Basic flags
  const isAlbino = C.filter(x => x === 'c').length === 2;
  const isLeucistic = L.filter(x => x === 'l').length === 2;
  const isAmber = G.filter(x => x === 'g').length === 2;
  const isPearl = P.filter(x => x === 'p').length === 2;
  const isBurgundy = SS.filter(x => x === 's').length === 2;
  const isDilute = D.filter(x => x === 'd').length === 2;
  const isFireFiFi = Fire.filter(x => x === 'Fire').length === 2;
  const isFireAny = Fire.includes('Fire');

  // Base Color Logic (A/B interaction)
  let baseColorName = 'Red';
  const aCount = A.filter(x => x === 'a').length;
  const bCount = B.filter(x => x === 'b').length;

  if (aCount === 0 && bCount === 0) baseColorName = 'Red';
  else if (aCount === 0 && bCount === 1) baseColorName = 'Gold';
  else if (aCount === 0 && bCount === 2) baseColorName = 'Standard Silver';
  else if (aCount === 1 && bCount === 0) baseColorName = 'Gold Cross';
  else if (aCount === 1 && bCount === 1) baseColorName = 'Silver Cross';
  else if (aCount === 1 && bCount === 2) baseColorName = 'Standard Silver';
  else if (aCount === 2 && bCount === 0) baseColorName = 'Alaskan Silver';
  else if (aCount === 2 && bCount === 1) baseColorName = 'Alaskan Silver';
  else if (aCount === 2 && bCount === 2) baseColorName = 'Standard Silver';

  let finalName = '';
  let eyeColor = 'Brown';
  let healthIssues: string[] = [];

  // Special Phenotypes (Priority Overrides)
  if (isAlbino) {
    finalName = 'Albino';
    eyeColor = 'Red';
  } else if (isLeucistic) {
    finalName = 'Leucistic';
    eyeColor = 'Blue';
  } else if (isFireFiFi && isAmber && isPearl) {
    finalName = 'Autumn Fire';
  } else if (isFireFiFi && isPearl && (baseColorName === 'Red' || baseColorName === 'Gold')) {
    finalName = 'Sun Glow';
  } else if (isFireFiFi && isPearl && (baseColorName === 'Alaskan Silver' || baseColorName === 'Standard Silver')) {
    finalName = 'Snow Glow';
  } else if (isFireFiFi && isPearl && baseColorName.includes('Cross')) {
    finalName = 'Fire and Ice';
  } else if (isFireFiFi && baseColorName === 'Red') {
    finalName = 'Wildfire';
  } else if (isFireFiFi && baseColorName === 'Gold') {
    finalName = 'Golden Sunrise';
  } else if (isFireFiFi && baseColorName.includes('Cross')) {
    finalName = 'Fire Cross';
  } else if (isAmber && isPearl && isBurgundy) {
    finalName = 'Pearl Amber';
    eyeColor = 'Green';
  } else if (isPearl && isBurgundy) {
    finalName = 'Sapphire';
  } else if (isFireFiFi && isPearl) {
    finalName = 'Fawn Glow'; // Catch-all for FiFi pp
  }

  // If no special name, build it
  if (!finalName) {
    const mods: string[] = [];
    if (isAmber) mods.push('Amber');
    if (isPearl) mods.push('Pearl');
    if (isBurgundy) mods.push('Burgundy');
    if (isFireAny) mods.push('Fire');
    if (isDilute) mods.push('Dilute');

    // Refined Masking Logic
    let baseToUse = baseColorName;

    // Normalize Silver for user display
    if (baseToUse === 'Alaskan Silver' || baseToUse === 'Standard Silver') {
      baseToUse = 'Silver';
    }

    if (isPearl || isBurgundy) {
      // Pearl and Burgundy mask everything except the "Cross" nature
      if (baseToUse === 'Red' || baseToUse === 'Gold' || baseToUse === 'Silver') {
        baseToUse = '';
      } else if (baseToUse.includes('Cross')) {
        baseToUse = 'Cross';
      }
    } else if (isAmber) {
      // Amber masks Red and Gold and the Red part of Cross, but not Silver
      if (baseToUse === 'Red' || baseToUse === 'Gold') {
        baseToUse = '';
      } else if (baseToUse.includes('Cross')) {
        baseToUse = 'Cross';
      }
    }

    const fullParts = [...mods, baseToUse].filter(Boolean);
    finalName = fullParts.join(' ');
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
  const name = data.name || (phenotype.name !== 'Unknown Fox' ? phenotype.name : 'Unnamed Fox');

  return {
    id: data.id || Math.random().toString(36).substring(2, 9),
    name: name,
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

  const phenotype = getPhenotype(genotype);
  return createFox({
    name: phenotype.name,
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
