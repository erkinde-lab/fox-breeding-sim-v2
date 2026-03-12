export type Allele = string;
export type Genotype = Record<string, Allele[]>;

export const LOCI: Record<string, { name: string; alleles: Allele[]; lethal?: (genotype: Allele[]) => boolean }> = {
  A: { name: 'Agouti', alleles: ['A', 'a'] },
  B: { name: 'Black', alleles: ['B', 'b'] },
  C: { name: 'Albino', alleles: ['C', 'c'] }, // cc = Albino
  G: { name: 'Burgundy', alleles: ['G', 'g'] }, // gg = Burgundy
  P: { name: 'Pearl', alleles: ['P', 'p'] }, // pp = Pearl
  Fire: { name: 'Fire', alleles: ['FI', 'fi'] }, // fi = Fire (Recessive)
  W: {
    name: 'White Markings', alleles: ['w', 'W', 'WM', 'WG', 'WP'],
    lethal: (alleles) => {
      const dominant = alleles.filter(a => a !== 'w');
      if (dominant.length < 2) return false;
      const [a1, a2] = dominant;
      // Marble (WM) is never lethal in combination
      if (a1 === 'WM' || a2 === 'WM') return false;
      // Any other combination of two dominant alleles (W, WG, WP) is lethal
      return true;
    }
  },
  L: { name: 'Leucistic', alleles: ['L', 'l'] }, // ll = Leucistic
  R: { name: 'Opal', alleles: ['R', 'r', 'ra'] },
  T: { name: 'Fawn Spotting', alleles: ['T', 't'] },
  S: { name: 'Star Spotting', alleles: ['s', 'S'] },
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
  const Fire = genotype.Fire || ['FI', 'FI'];
  const L = genotype.L || ['L', 'L'];
  const R = genotype.R || ['R', 'R'];
  const T = genotype.T || ['T', 'T'];
  const S = genotype.S || ['s', 's'];
  const W = [...(genotype.W || ['w', 'w'])].sort();

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
  const hasC = C.filter(x => x === 'c').length === 2;
  const hasL = L.filter(x => x === 'l').length === 2;
  const hasG = G.filter(x => x === 'g').length === 2;
  const hasP = P.filter(x => x === 'p').length === 2;
  const isFifi = Fire.filter(x => x === 'fi').length === 2;
  const isAmber = hasG && hasP;

  const isOpal = R.filter(x => x === 'r').length === 2;
  const isRadium = R.filter(x => x === 'ra').length === 2;
  const isPaleGlow = (R.includes('r') && R.includes('ra'));

  const isFawnSpotted = T.includes('t');
  const isStar = S.filter(x => x === 'S').length === 1;
  const isPiebald = S.filter(x => x === 'S').length === 2;

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
  else if (aCount === 2 && bCount === 2) baseColorName = 'Double Silver'; // aabb

  let underlyingName = "";

  if (isFifi) {
    // Fire Expression Logic
    if (baseColorName === 'Red' || baseColorName === 'Gold') {
      if (isAmber) underlyingName = "Autumn Fire";
      else if (hasG || hasP) underlyingName = "Snow Glow";
      else underlyingName = baseColorName === 'Red' ? "Wildfire" : "Golden Sunrise";
    } else if (baseColorName === 'Gold Cross' || baseColorName === 'Silver Cross') {
      if (isAmber) underlyingName = "Champagne Cross";
      else if (hasG) underlyingName = "Snow Glow";
      else if (hasP) underlyingName = baseColorName === 'Gold Cross' ? "Fire and Ice" : "Moon Glow";
      else underlyingName = "Fire Cross";
    } else if (baseColorName === 'Alaskan Silver') {
      if (isAmber || hasG) underlyingName = "Champagne";
      else if (hasP) underlyingName = "Fawn Glow";
      else underlyingName = "Colicott";
    } else if (baseColorName === 'Standard Silver') {
      if (isAmber || hasG) underlyingName = "Cinnamon Fire";
      else underlyingName = ""; // Masked
    } else if (baseColorName === 'Double Silver') {
      if (isAmber || hasG) underlyingName = "Cinnamon Fire";
      else if (hasP) underlyingName = "Fawn Glow";
      else underlyingName = "Colicott";
    }
  }

  // If not handled by Fire Factor
  if (!underlyingName) {
    if (isAmber) {
      if (baseColorName === 'Red') underlyingName = "Amber Red";
      else if (baseColorName === 'Gold') underlyingName = "Amber Gold";
      else if (baseColorName === 'Gold Cross' || baseColorName === 'Silver Cross') underlyingName = "Amber Cross";
      else underlyingName = "Amber";
    } else if (hasG) {
      if (baseColorName === 'Red') underlyingName = "Burgundy Red";
      else if (baseColorName === 'Gold') underlyingName = "Burgundy Gold";
      else if (baseColorName === 'Gold Cross' || baseColorName === 'Silver Cross') underlyingName = "Burgundy Cross";
      else underlyingName = "Burgundy";
    } else if (hasP) {
      if (baseColorName === 'Red') underlyingName = "Red"; // Masked
      else if (baseColorName === 'Gold') underlyingName = "Pearl Gold";
      else if (baseColorName === 'Gold Cross' || baseColorName === 'Silver Cross') underlyingName = "Pearl Cross";
      else underlyingName = "Pearl";
    } else {
      underlyingName = baseColorName;
      if (underlyingName === 'Alaskan Silver' || underlyingName === 'Standard Silver' || underlyingName === 'Double Silver') {
        underlyingName = silverIntensity === 1 ? 'Black' : 'Silver';
      }
    }
  }
  // Opal Locus overrides
  if (isOpal || isRadium || isPaleGlow) {
    if (isFifi) {
      if (isPaleGlow) {
        underlyingName = 'Pale Sun Glow';
      } else if (isOpal) {
        if (underlyingName === 'Wildfire' || underlyingName === 'Autumn Fire') underlyingName = 'Gold Glow';
        else if (underlyingName === 'Golden Sunrise') underlyingName = 'Golden Glow';
        else if (underlyingName === 'Cinnamon Fire') underlyingName = 'Cinnamon Glow';
        else if (underlyingName === 'Colicott' || underlyingName === 'Fawn Glow') underlyingName = 'Sapphire Fawn Glow';
        else if (underlyingName === 'Moon Glow') underlyingName = 'Moon Opal';
        else if (underlyingName === 'Fire and Ice') underlyingName = 'Glacier Glow';
        else if (underlyingName === 'Champagne') underlyingName = 'Champagne Opal';
        else if (underlyingName === 'Snow Glow') underlyingName = 'Golden Snow Glow';
        else if (underlyingName === 'Fire Cross') underlyingName = 'Opal Cross Glow';
        else if (underlyingName === 'Champagne Cross') underlyingName = 'Champagne Moonstone';
        else if (underlyingName === '') underlyingName = 'Opal';
      } else if (isRadium) {
        if (underlyingName === 'Wildfire' || underlyingName === 'Autumn Fire') underlyingName = 'Sun Glow';
        else if (underlyingName === 'Golden Sunrise') underlyingName = 'Arctic Snow Glow';
        else if (underlyingName === 'Cinnamon Fire') underlyingName = 'Amber Glow';
        else if (underlyingName === 'Colicott' || underlyingName === 'Fawn Glow') underlyingName = 'Slate Fawn';
        else if (underlyingName === 'Champagne') underlyingName = 'Champagne Sun Glow';
        else if (underlyingName === 'Moon Glow') underlyingName = 'Dark Snow Glow';
        else if (underlyingName === 'Snow Glow') underlyingName = 'Pure Snow Glow';
        else if (underlyingName === 'Fire Cross') underlyingName = 'Sun Cross';
        else if (underlyingName === 'Fire and Ice') underlyingName = 'Arctic Fire Glow';
        else if (underlyingName === 'Champagne Cross') underlyingName = 'Champagne Snow Cross';
        else if (underlyingName === '') underlyingName = 'Radium';
      }
    } else {
      const isCross = baseColorName.includes('Cross');
      const isRedGold = baseColorName === 'Red' || baseColorName === 'Gold';
      const isSilver = baseColorName.includes('Silver') || underlyingName === 'Silver' || underlyingName === 'Black';

      if (isOpal) {
        if (isRedGold) {
          if (hasP) underlyingName = 'Sapphire Sun Glow';
          else if (hasG) underlyingName = 'Amber Sun Glow';
          else underlyingName = 'Red Opal';
        } else if (isCross) {
          if (hasP) underlyingName = 'Moonstone Glow';
          else underlyingName = 'Opal Cross';
        } else if (isSilver) {
          if (hasP) underlyingName = 'Sapphire Glow';
          else if (hasG) underlyingName = 'Amber Glow';
          else underlyingName = 'Opal';
        }
      } else if (isRadium) {
        if (isRedGold) {
          if (hasP) underlyingName = 'Pearl Sun Glow';
          else underlyingName = 'Sun Glow';
        } else if (isCross) {
          underlyingName = 'Radium Cross';
        } else if (isSilver) {
          if (hasP) underlyingName = 'Platinum Glow';
          else underlyingName = 'Radium';
        }
      } else if (isPaleGlow) {
        if (isRedGold) underlyingName = 'Pale Sun Glow';
        else if (isCross) underlyingName = 'Pale Cross';
        else if (isSilver) underlyingName = 'Pale Glow';
      }
    }
  }

  let finalName = "";
  if (isLethal) finalName = 'Stillborn';
  else if (hasC) finalName = 'Albino';
  else if (hasL) finalName = 'Leucistic';
  else finalName = underlyingName;

  // Pattern Logic
  const patterns: string[] = [];
  if (isFawnSpotted) patterns.push('Fawn Spotted');
  if (isPiebald) patterns.push('Piebald');
  else if (isStar) patterns.push('Star');

  if (W.includes('WM')) patterns.push('Marble');
  if (W.includes('WP')) patterns.push('Platinum');
  if (W.includes('WG')) patterns.push('Georgian');
  if (W.includes('W')) patterns.push('White Mark');
  const patternName = patterns.length > 0 ? patterns.join(' ') : 'None';

  const isFullyMasked = finalName === 'Albino' || finalName === 'Stillborn';
  const displayName = `${patternName !== 'None' && !isFullyMasked ? patternName + ' ' : ''}${finalName} Fox`;

  // Eye Color Logic
  let eyeColor = providedEyeColor;
  if (!eyeColor) {
    const eyePoolName = finalName === "Albino" ? "Albino" : finalName;
    eyeColor = getRandomEyeColor(eyePoolName);
  }

  // Opal Eye Logic Override
  const opalPhenotypes = [
    'Opal', 'Radium', 'Pale Glow', 'Red Opal', 'Sun Glow', 'Pale Sun Glow', 'Opal Cross', 'Radium Cross', 'Pale Cross',
    'Gold Glow', 'Golden Glow', 'Arctic Snow Glow', 'Cinnamon Glow', 'Amber Glow', 'Sapphire Fawn Glow', 'Slate Fawn',
    'Moon Opal', 'Champagne Opal', 'Champagne Sun Glow', 'Dark Snow Glow', 'Golden Snow Glow', 'Pure Snow Glow',
    'Opal Cross Glow', 'Sun Cross', 'Glacier Glow', 'Arctic Fire Glow', 'Champagne Moonstone', 'Champagne Snow Cross',
    'Moonstone Glow', 'Sapphire Sun Glow', 'Amber Sun Glow', 'Pearl Sun Glow', 'Platinum Glow', 'Sapphire Glow'
  ];

  if (opalPhenotypes.includes(finalName) && !providedEyeColor) {
    eyeColor = getRandomEyeColor(finalName);
  }

  // SS Piebald Eye Logic
  if (isPiebald && !providedEyeColor && finalName !== 'Albino') {
    const rand = Math.random();
    if (rand < 0.25) eyeColor = 'Blue';
    else if (rand < 0.50) eyeColor = `${eyeColor} - Blue Heterochromia`;
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
    healthIssues: [
      ...(hasC ? ['Photosensitivity and reduced vision'] : []),
      ...(hasL ? ['Higher incidence of deafness and vision irregularities'] : []),
      ...(isPiebald ? ['Potential sight and hearing issues'] : [])
    ],
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
  gender: 'Dog' | 'Vixen';
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
  ownerId: string; // "player-0" for game-owned, "player-1" for user-owned
  isFoundation?: boolean; // true = available for purchase, false = NPC stud
  isAltered?: boolean;
  prefixTitle?: string;
  bisWins?: number;
  majors?: number;
  lastFed?: number; lastGroomed?: number; lastTrained?: number; isStillborn?: boolean;
  boosts?: Record<string, number>;
  preferredFeed?: string;
  history: { date: string; event: string; details: string; }[];
}

export function generateStats(p1?: Stats, p2?: Stats, coi: number = 0, random: () => number = Math.random): Stats {
  const base = () => Math.floor(random() * 16) + 5;
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
    stats.forequarters = Math.max(1, Math.round(stats.forequarters * penaltyFactor));
    stats.hindquarters = Math.max(1, Math.round(stats.hindquarters * penaltyFactor));
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

export function calculateSilverIntensity(p1Intensity: number, p2Intensity: number): number {
  const avg = (p1Intensity + p2Intensity) / 2;
  const base = Math.ceil(avg);
  const variance = (typeof window !== 'undefined' ? Math.random() : 0.5) * 3 - 1;
  return Math.max(1, Math.min(5, base + variance));
}

export function calculateCOI(foxIdOrSireId: string, foxes: Record<string, { parents: [string | null, string | null] }>, maybeDamId?: string): number {
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

  const getPaths = (id: string, depth: number = 0, currentPath: string[] = []): string[][] => {
    if (depth > 5) return [];
    const f = foxes[id];
    if (!f) return [currentPath.concat(id)];

    const paths: string[][] = [currentPath.concat(id)];
    if (f.parents?.[0]) paths.push(...getPaths(f.parents[0], depth + 1, currentPath.concat(id)));
    if (f.parents?.[1]) paths.push(...getPaths(f.parents[1], depth + 1, currentPath.concat(id)));
    return paths;
  };

  const sirePaths = getPaths(sireId);
  const damPaths = getPaths(damId);

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

export function createFox(data: Partial<Fox>, random: () => number = Math.random, forcedId?: string): Fox {
  const genotype = data.genotype || getInitialGenotype();
  const silverIntensity = data.silverIntensity || 3;
  const phenotype = getPhenotype(genotype, silverIntensity, data.eyeColor);

  return {
    id: forcedId || data.id || Date.now().toString(),
    name: data.name || 'Unnamed Fox',
    gender: data.gender || (random() > 0.5 ? 'Dog' : 'Vixen'),
    genotype,
    phenotype: phenotype.name,
    baseColor: phenotype.baseColor || "Red",
    pattern: phenotype.pattern || "Solid",
    eyeColor: phenotype.eyeColor,
    silverIntensity,
    age: 0,
    stats: data.stats || {
      head: 10,
      topline: 10,
      forequarters: 10,
      hindquarters: 10,
      tail: 10,
      coatQuality: 10,
      temperament: 10,
      presence: 10,
      luck: 10,
      fertility: 10
    },
    genotypeRevealed: false,
    pedigreeAnalyzed: false,
    isRetired: false,
    hasBeenRenamed: false,
    healthIssues: [],
    pointsYear: 0,
    pointsLifetime: 0,
    parents: [null, null],
    parentNames: [null, null],
    birthYear: 0,
    coi: 0,
    isAtStud: false,
    studFee: 0,
    ownerId: data.ownerId || 'system',
    lastFed: Date.now(),
    boosts: {},
    history: data.history || [{
      date: new Date().toISOString(),
      event: 'Born',
      details: 'Foundation fox created'
    }],
    ...data
  };
}

export function createFoundationalFox(random: () => number = Math.random, gender?: "Dog" | "Vixen", forcedId?: string): Fox {
  // Only use random on client side to avoid hydration issues
  const safeRandom = typeof window !== 'undefined' ? random : () => 0.5;

  const baseGenotypes: Record<string, [string, string]>[] = [
    { A: ['A', 'A'], B: ['B', 'B'] }, // Red
    { A: ['A', 'A'], B: ['B', 'b'] }, // Gold
    { A: ['A', 'A'], B: ['b', 'b'] }, // Standard Silver
    { A: ['A', 'a'], B: ['B', 'B'] }, // Gold Cross
    { A: ['A', 'a'], B: ['B', 'b'] }, // Silver Cross
    { A: ['A', 'a'], B: ['b', 'b'] }, // Standard Silver
    { A: ['a', 'a'], B: ['B', 'B'] }, // Alaskan Silver
    { A: ['a', 'a'], B: ['B', 'b'] }, // Alaskan Silver
    { A: ['a', 'a'], B: ['b', 'b'] }, // Standard Silver
  ];

  const genotype = getInitialGenotype();
  Object.assign(genotype, baseGenotypes[Math.floor(safeRandom() * baseGenotypes.length)]);

  // Possible rare recessive (excluding W since it's visible in heterozygous form)
  const rareRand = safeRandom();
  const rareGenes = ["G", "C", "P", "Fire", "L", "R", "T", "S"];
  if (rareRand < 0.5) {
    const gene = rareGenes[Math.floor(safeRandom() * rareGenes.length)];
    const locus = LOCI[gene];
    const alleles = locus.alleles.filter(a => a !== locus.alleles[0]);
    if (alleles.length > 0) {
      const rare = alleles[Math.floor(safeRandom() * alleles.length)];
      genotype[gene] = [rare, rare];
    }
  } else if (rareRand < 0.5 + 0.5 * 0.75) {
    const gene = rareGenes[Math.floor(safeRandom() * rareGenes.length)];
    const locus = LOCI[gene];
    const alleles = locus.alleles.filter(a => a !== locus.alleles[0]);
    if (alleles.length > 0) {
      const rare = alleles[Math.floor(safeRandom() * alleles.length)];
      genotype[gene] = [locus.alleles[0], rare];
    }
  }


  // Fawn spotting restriction: Foundation foxes can only be TT or Tt
  if (genotype['T'] && genotype['T'][0] === 't' && genotype['T'][1] === 't') {
    genotype['T'] = ['T', 't'];
  }

  return createFox({
    genotype,
    coi: 0,
    pedigreeAnalyzed: true,
    gender,
  }, random, forcedId);

}

export function createFoundationFoxCollection(random: () => number = Math.random, startId?: number): Fox[] {
  // Only use random on client side to avoid hydration issues
  const safeRandom = typeof window !== 'undefined' ? random : () => 0.5;
  let currentId = startId || 1;

  const redBaseGenotypes: Record<string, [string, string]>[] = [
    { A: ['A', 'A'] as [string, string], B: ['B', 'B'] as [string, string] }, // Red
    { A: ['A', 'A'] as [string, string], B: ['B', 'b'] as [string, string] }, // Gold
  ];

  const crossGenotypes: Record<string, [string, string]>[] = [
    { A: ['A', 'a'] as [string, string], B: ['B', 'B'] as [string, string] }, // Gold Cross
    { A: ['A', 'a'] as [string, string], B: ['B', 'b'] as [string, string] }, // Silver Cross
    { A: ['A', 'a'] as [string, string], B: ['b', 'b'] as [string, string] }, // Standard Silver
  ];

  const otherGenotypes: Record<string, [string, string]>[] = [
    { A: ['A', 'A'] as [string, string], B: ['b', 'b'] as [string, string] }, // Standard Silver
    { A: ['a', 'a'] as [string, string], B: ['B', 'B'] as [string, string] }, // Alaskan Silver
    { A: ['a', 'a'] as [string, string], B: ['B', 'b'] as [string, string] }, // Alaskan Silver
    { A: ['a', 'a'] as [string, string], B: ['b', 'b'] as [string, string] }, // Standard Silver
  ];

  const foxes: Fox[] = [];

  // Generate gender distribution: 2-4 of each gender (no more than 4 of one sex)
  const genderOptions: Array<"Dog" | "Vixen"> = [];
  const dogCount = 2 + Math.floor(safeRandom() * 3); // 2, 3, or 4 dogs
  const vixenCount = 6 - dogCount; // 4, 3, or 2 vixens

  for (let i = 0; i < dogCount; i++) genderOptions.push("Dog");
  for (let i = 0; i < vixenCount; i++) genderOptions.push("Vixen");

  // Shuffle gender options
  for (let i = genderOptions.length - 1; i > 0; i--) {
    const j = Math.floor(safeRandom() * (i + 1));
    [genderOptions[i], genderOptions[j]] = [genderOptions[j], genderOptions[i]];
  }

  // Rule 1: Ensure at least one red base fox
  const redBaseGenotype = redBaseGenotypes[Math.floor(safeRandom() * redBaseGenotypes.length)];
  const redFoxGender = genderOptions.pop()!;
  foxes.push(createFoundationalFoxWithGenotype(redBaseGenotype, safeRandom, redFoxGender, (currentId++).toString().padStart(7, "0")));

  // Rule 2: Ensure at least one gold base fox (different from the red one above)
  let goldBaseGenotype;
  do {
    goldBaseGenotype = redBaseGenotypes[Math.floor(safeRandom() * redBaseGenotypes.length)];
  } while (JSON.stringify(goldBaseGenotype) === JSON.stringify(redBaseGenotype)); // Ensure different genotype
  const goldFoxGender = genderOptions.pop()!;
  foxes.push(createFoundationalFoxWithGenotype(goldBaseGenotype, safeRandom, goldFoxGender, (currentId++).toString().padStart(7, "0")));

  // Rule 3: Ensure at least one cross fox
  const crossGenotype = crossGenotypes[Math.floor(safeRandom() * crossGenotypes.length)];
  const crossFoxGender = genderOptions.pop()!;
  foxes.push(createFoundationalFoxWithGenotype(crossGenotype, safeRandom, crossFoxGender, (currentId++).toString().padStart(7, "0")));

  // Generate remaining 3 foxes with assigned genders
  for (let i = 0; i < 3; i++) {
    const allGenotypes = [...redBaseGenotypes, ...crossGenotypes, ...otherGenotypes];
    const genotype = allGenotypes[Math.floor(safeRandom() * allGenotypes.length)];
    const gender = genderOptions.pop()!;
    foxes.push(createFoundationalFoxWithGenotype(genotype, safeRandom, gender, (currentId++).toString().padStart(7, "0")));
  }

  // Rule 3: Ensure only one black fox (intensity 1)
  const blackFoxIndices = foxes
    .map((fox, index) => ({ fox, index }))
    .filter(({ fox }) => fox.silverIntensity === 1);

  // If more than one black fox, convert extras to intensity 2-5
  if (blackFoxIndices.length > 1) {
    for (let i = 1; i < blackFoxIndices.length; i++) {
      const { index } = blackFoxIndices[i];
      foxes[index] = { ...foxes[index], silverIntensity: Math.floor(safeRandom() * 4) + 2 };
    }
  }

  // Shuffle the array to randomize positions
  for (let i = foxes.length - 1; i > 0; i--) {
    const j = Math.floor(safeRandom() * (i + 1));
    [foxes[i], foxes[j]] = [foxes[j], foxes[i]];
  }

  return foxes;
}

function createFoundationalFoxWithGenotype(baseGenotype: Record<string, [string, string]>, random: () => number, gender?: "Dog" | "Vixen", forcedId?: string): Fox {
  const genotype = getInitialGenotype();
  Object.keys(baseGenotype).forEach(gene => {
    genotype[gene] = [...baseGenotype[gene]];
  });

  return createFox({
    genotype,
    coi: 0,
    pedigreeAnalyzed: true,
    gender,
  }, random, forcedId);
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
  return !fox.lastFed;
}

export function isGroomed(fox: Fox): boolean {
  return !!fox.lastGroomed;
}

export function isTrained(fox: Fox): boolean {
  return !!fox.lastTrained;
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
  'Burgundy Red': ['Light Brown', 'Amber', 'Green'],
  'Burgundy Gold': ['Light Brown', 'Amber', 'Green'],
  'Burgundy Cross': ['Light Brown', 'Amber', 'Green'],
  'Pearl Gold': ['Light Brown', 'Amber'],
  'Pearl Cross': ['Light Brown', 'Amber'],
  'Albino': ['Red'],
  'Silver': ['Brown', 'Light Brown', 'Amber'],
  'Alaskan Silver': ['Brown', 'Light Brown', 'Amber'],
  'Black': ['Brown', 'Light Brown', 'Amber'],
  'Standard Silver': ['Brown', 'Light Brown', 'Amber'],
  'Double Silver': ['Brown', 'Light Brown', 'Amber'],
  'Gold Cross': ['Brown', 'Light Brown', 'Amber'],
  'Silver Cross': ['Brown', 'Light Brown', 'Amber'],
  'Colicott': ['Blue'],
  'Burgundy': ['Light Brown', 'Amber', 'Green'],
  'Pearl': ['Light Brown', 'Amber', 'Green', 'Grey'],
  'Amber': ['Amber', 'Grey', 'Green', 'Blue'],
  'Champagne': ['Blue'],
  'Fawn Glow': ['Blue'],
  'Amber Red': ['Amber', 'Grey', 'Green', 'Blue'],
  'Amber Gold': ['Amber', 'Grey', 'Green', 'Blue'],
  'Amber Cross': ['Amber', 'Grey', 'Green', 'Blue'],
  'Wildfire': ['Brown', 'Light Brown', 'Amber'],
  'Golden Sunrise': ['Brown', 'Light Brown', 'Amber'],
  'Fire Cross': ['Brown', 'Light Brown', 'Amber', 'Green'],
  'Cinnamon Fire': ['Amber', 'Green'],
  'Snow Glow': ['Amber', 'Brown', 'Light Brown', 'Green', 'Blue'],
  'Fire and Ice': ['Brown', 'Light Brown', 'Amber', 'Grey'],
  'Moon Glow': ['Brown', 'Light Brown', 'Amber', 'Grey'],
  'Autumn Fire': ['Amber', 'Grey', 'Blue'],
  'Champagne Cross': ['Blue'],
  'Opal': ['Amber', 'Grey', 'Green', 'Blue'],
  'Radium': ['Amber', 'Grey', 'Green', 'Blue'],
  'Pale Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Red Opal': ['Amber', 'Grey', 'Green', 'Blue'],
  'Sun Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Pale Sun Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Opal Cross': ['Amber', 'Grey', 'Green', 'Blue'],
  'Radium Cross': ['Amber', 'Grey', 'Green', 'Blue'],
  'Pale Cross': ['Amber', 'Grey', 'Green', 'Blue'],
  'Gold Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Golden Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Arctic Snow Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Cinnamon Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Amber Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Sapphire Fawn Glow': ['Blue', 'Amber', 'Grey', 'Green'],
  'Slate Fawn': ['Blue', 'Amber', 'Grey', 'Green'],
  'Moon Opal': ['Amber', 'Grey', 'Green', 'Blue'],
  'Champagne Opal': ['Blue', 'Amber', 'Grey', 'Green'],
  'Champagne Sun Glow': ['Blue', 'Amber', 'Grey', 'Green'],
  'Dark Snow Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Golden Snow Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Pure Snow Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Opal Cross Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Sun Cross': ['Amber', 'Grey', 'Green', 'Blue'],
  'Glacier Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Arctic Fire Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Champagne Moonstone': ['Blue', 'Amber', 'Grey', 'Green'],
  'Champagne Snow Cross': ['Blue', 'Amber', 'Grey', 'Green'],
  'Moonstone Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Sapphire Sun Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Amber Sun Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Pearl Sun Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Platinum Glow': ['Amber', 'Grey', 'Green', 'Blue'],
  'Sapphire Glow': ['Amber', 'Grey', 'Green', 'Blue'],
};

export function getRandomEyeColor(phenotypeName: string): string {
  const possibleColors = PHENOTYPE_EYE_COLORS[phenotypeName] || ['Brown'];
  if (possibleColors.length === 1) return possibleColors[0];

  // Only use random on client side to avoid hydration issues
  if (typeof window === 'undefined') {
    return possibleColors[0]; // Server fallback
  }

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

export function getBaseEyeColors(genotype: Genotype, silverIntensity: number = 3): string[] {
  // Determine base pelt color without considering W or L loci
  const tempGenotype = { ...genotype };
  const W = tempGenotype.W || ['w', 'w'];
  const L = tempGenotype.L || ['l', 'l'];

  // Temporarily remove W and L to get base pelt
  delete tempGenotype.W;
  delete tempGenotype.L;

  const phenotype = getPhenotype(tempGenotype, silverIntensity);
  const eyePoolName = phenotype.baseColor === "Albino" ? "Albino" : phenotype.baseColor;

  return [...(PHENOTYPE_EYE_COLORS[eyePoolName] || ['Brown'])];
}

export function getWhiteMarkingOptions(genotype: Genotype): string[] {
  const W = genotype.W || ['w', 'w'];
  const L = genotype.L || ['l', 'l'];

  const options: string[] = [];

  // White marking options (W locus)
  if (W.some(a => a !== 'w')) {
    options.push("Blue", "Blue Heterochromia");
  }

  // Leucistic options (L locus) - can have any base eye color
  if (L.some(a => a === 'l')) {
    // Leucistic foxes can have any eye color from their base pelt
    options.push("Any Base Color");
  }

  return options;
}

export function getValidEyeColors(genotype: Genotype, silverIntensity: number = 3): string[] {
  const baseColors = getBaseEyeColors(genotype, silverIntensity);
  const whiteOptions = getWhiteMarkingOptions(genotype);

  const W = genotype.W || ['w', 'w'];
  const L = genotype.L || ['l', 'l'];

  // If no white markings or leucism, return base colors only
  if (!W.some(a => a !== 'w') && !L.some(a => a === 'l')) {
    return baseColors;
  }

  // If has white markings but no leucism
  if (W.some(a => a !== 'w') && !L.some(a => a === 'l')) {
    return [...baseColors, "Blue", "Blue Heterochromia"];
  }

  // If has leucism (with or without white markings)
  if (L.some(a => a === 'l')) {
    return baseColors; // Leucistic foxes can have any base eye color
  }

  return baseColors;
}

export function getEyeColorHex(eyeColor: string, baseColor?: string): string {
  const colorMap: Record<string, string> = {
    'Brown': '#8B4513',
    'Light Brown': '#D2691E',
    'Amber': '#FFBF00',
    'Green': '#228B22',
    'Grey': '#808080',
    'Blue': '#4169E1',
    'Red': '#DC143C',
  };

  // Handle dynamic heterochromia
  if (eyeColor === 'Blue Heterochromia' && baseColor) {
    const baseHex = colorMap[baseColor] || '#8B4513';
    return `linear-gradient(45deg, #4169E1 50%, ${baseHex} 50%)`;
  }

  if (eyeColor === 'Blue Heterochromia') {
    return 'linear-gradient(45deg, #4169E1 50%, #8B4513 50%)';
  }

  return colorMap[eyeColor] || '#8B4513';
}

export function calculateBreedingOutcomes(m: Fox, f: Fox, foxes: Record<string, Fox>) {
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
    .map(([name, count]) => ({ name, percent: Math.round((count / trials) * 100) }))
    .sort((a, b) => b.percent - a.percent);

  return {
    probabilities,
    predictedCOI: Math.round(calculateCOI(m.id, foxes, f.id) * 100) / 100
  };
}

