import { Variety } from "./showing";

export type Allele = string;
export type Genotype = Record<string, [Allele, Allele]>;

export interface LocusDefinition {
  name: string;
  alleles: string[];
  description: string;
  lethal?: (alleles: Allele[]) => boolean;
}

export const LOCI: Record<string, LocusDefinition> = {
  A: {
    name: "Agouti",
    alleles: ["A", "a"],
    description: "Controls the distribution of black pigment.",
  },
  B: {
    name: "Black",
    alleles: ["B", "b"],
    description: "Determines the base pigment color.",
  },
  C: {
    name: "Albino",
    alleles: ["C", "c"],
    description: "Controls overall pigment production.",
  },
  G: {
    name: "Grey/Burgundy",
    alleles: ["G", "g"],
    description: "Modifies red pigment into burgundy tones.",
  },
  P: {
    name: "Pearl",
    alleles: ["P", "p"],
    description: "Dilutes pigment into pearlescent tones.",
  },
  Fire: {
    name: "Fire Factor",
    alleles: ["FI", "fi"],
    description: "Enhances red pigment intensity.",
  },
  L: {
    name: "Leucistic",
    alleles: ["L", "l"],
    description: "Causes partial or total loss of pigment.",
  },
  R: {
    name: "Opal/Radium",
    alleles: ["R", "r", "ra"],
    description: "A complex locus controlling metallic dilutions.",
  },
  T: {
    name: "Ticked",
    alleles: ["T", "t"],
    description: "Controls ticking and small spotting.",
  },
  S: {
    name: "Spotting",
    alleles: ["s", "S"],
    description: "Controls large white spotting patterns.",
  },
  W: {
    name: "White Markings",
    alleles: ["w", "W", "WM", "WG", "WP"],
    description: "Controls dominant white marking patterns.",
    lethal: (alleles: Allele[]) => {
      const dominantCount = alleles.filter(a => a !== 'w').length;
      if (dominantCount < 2) return false;
      const sorted = [...alleles].sort();
      if (sorted[0] === sorted[1] && sorted[0] !== 'WM' && sorted[0] !== 'w') return true;
      if (!sorted.includes('WM') && !sorted.includes('w')) return true;
      return false;
    }
  },
};

interface PhenotypeContext {
  genotype: Genotype;
  silverIntensity: number;
  baseColorName: string;
  underlyingName: string;
  finalName: string;
  isLethal: boolean;
  isFifi: boolean;
  hasG: boolean;
  hasP: boolean;
  isAmber: boolean;
  isOpal: boolean;
  isRadium: boolean;
  isPaleGlow: boolean;
}

const BaseColorHandler = (ctx: PhenotypeContext) => {
  const A = ctx.genotype.A || ['A', 'A'];
  const B = ctx.genotype.B || ['B', 'B'];
  const aCount = A.filter(x => x === 'a').length;
  const bCount = B.filter(x => x === 'b').length;

  if (aCount === 0 && bCount === 0) ctx.baseColorName = 'Red';
  else if (aCount === 0 && bCount === 1) ctx.baseColorName = 'Gold';
  else if (aCount === 0 && bCount === 2) ctx.baseColorName = 'Standard Silver';
  else if (aCount === 1 && bCount === 0) ctx.baseColorName = 'Gold Cross';
  else if (aCount === 1 && bCount === 1) ctx.baseColorName = 'Silver Cross';
  else if (aCount === 1 && bCount === 2) ctx.baseColorName = 'Standard Silver';
  else if (aCount === 2 && bCount === 0) ctx.baseColorName = 'Alaskan Silver';
  else if (aCount === 2 && bCount === 1) ctx.baseColorName = 'Alaskan Silver';
  else if (aCount === 2 && bCount === 2) ctx.baseColorName = 'Double Silver';
};

const FireFactorHandler = (ctx: PhenotypeContext) => {
  if (!ctx.isFifi) return;
  const { baseColorName, isAmber, hasG, hasP } = ctx;

  if (baseColorName === 'Red' || baseColorName === 'Gold') {
    if (isAmber) ctx.underlyingName = "Autumn Fire";
    else if (hasG || hasP) ctx.underlyingName = "Snow Glow";
    else ctx.underlyingName = baseColorName === 'Red' ? "Wildfire" : "Golden Sunrise";
  } else if (baseColorName === 'Gold Cross' || baseColorName === 'Silver Cross') {
    if (isAmber) ctx.underlyingName = "Champagne Cross";
    else if (hasG) ctx.underlyingName = "Snow Glow";
    else if (hasP) ctx.underlyingName = baseColorName === 'Gold Cross' ? "Fire and Ice" : "Moon Glow";
    else ctx.underlyingName = "Fire Cross";
  } else if (baseColorName === 'Alaskan Silver') {
    if (isAmber || hasG) ctx.underlyingName = "Champagne";
    else if (hasP) ctx.underlyingName = "Fawn Glow";
    else ctx.underlyingName = "Colicott";
  } else if (baseColorName === 'Standard Silver') {
    if (isAmber || hasG) ctx.underlyingName = "Cinnamon Fire";
  } else if (baseColorName === 'Double Silver') {
    if (isAmber || hasG) ctx.underlyingName = "Cinnamon Fire";
    else if (hasP) ctx.underlyingName = "Fawn Glow";
    else ctx.underlyingName = "Colicott";
  }
};

const ModifierHandler = (ctx: PhenotypeContext) => {
  if (ctx.underlyingName) return;
  const { baseColorName, isAmber, hasG, hasP, silverIntensity } = ctx;

  if (isAmber) {
    if (baseColorName === 'Red') ctx.underlyingName = "Amber Red";
    else if (baseColorName === 'Gold') ctx.underlyingName = "Amber Gold";
    else if (baseColorName.includes('Cross')) ctx.underlyingName = "Amber Cross";
    else ctx.underlyingName = "Amber";
  } else if (hasG) {
    if (baseColorName === 'Red') ctx.underlyingName = "Burgundy Red";
    else if (baseColorName === 'Gold') ctx.underlyingName = "Burgundy Gold";
    else if (baseColorName.includes('Cross')) ctx.underlyingName = "Burgundy Cross";
    else ctx.underlyingName = "Burgundy";
  } else if (hasP) {
    if (baseColorName === 'Red') ctx.underlyingName = "Red"; // Masked
    else if (baseColorName === 'Gold') ctx.underlyingName = "Pearl Gold";
    else if (baseColorName.includes('Cross')) ctx.underlyingName = "Pearl Cross";
    else ctx.underlyingName = "Pearl";
  } else {
    ctx.underlyingName = baseColorName;
    if (baseColorName.includes('Silver')) {
      ctx.underlyingName = silverIntensity === 1 ? 'Black' : 'Silver';
    }
  }
};

const OpalRadiumHandler = (ctx: PhenotypeContext) => {
  if (!ctx.isOpal && !ctx.isRadium && !ctx.isPaleGlow) return;

  if (ctx.isFifi) {
    if (ctx.isPaleGlow) {
      ctx.underlyingName = 'Pale Sun Glow';
    } else if (ctx.isOpal) {
      const map: Record<string, string> = {
        'Wildfire': 'Gold Glow', 'Autumn Fire': 'Gold Glow',
        'Golden Sunrise': 'Golden Glow', 'Cinnamon Fire': 'Cinnamon Glow',
        'Colicott': 'Sapphire Fawn Glow', 'Fawn Glow': 'Sapphire Fawn Glow',
        'Moon Glow': 'Moon Opal', 'Fire and Ice': 'Glacier Glow',
        'Champagne': 'Champagne Opal', 'Snow Glow': 'Golden Snow Glow',
        'Fire Cross': 'Opal Cross Glow', 'Champagne Cross': 'Champagne Moonstone',
        '': 'Opal'
      };
      ctx.underlyingName = map[ctx.underlyingName] || ctx.underlyingName || 'Opal';
    } else if (ctx.isRadium) {
      const map: Record<string, string> = {
        'Wildfire': 'Sun Glow', 'Autumn Fire': 'Sun Glow',
        'Golden Sunrise': 'Arctic Snow Glow', 'Cinnamon Fire': 'Amber Glow',
        'Colicott': 'Slate Fawn', 'Fawn Glow': 'Slate Fawn',
        'Champagne': 'Champagne Sun Glow', 'Moon Glow': 'Dark Snow Glow',
        'Snow Glow': 'Pure Snow Glow', 'Fire Cross': 'Sun Cross',
        'Fire and Ice': 'Arctic Fire Glow', 'Champagne Cross': 'Champagne Snow Cross',
        '': 'Radium'
      };
      ctx.underlyingName = map[ctx.underlyingName] || ctx.underlyingName || 'Radium';
    }
  } else {
    const isCross = ctx.baseColorName.includes('Cross');
    const isRedGold = ctx.baseColorName === 'Red' || ctx.baseColorName === 'Gold';
    const isSilver = ctx.baseColorName.includes('Silver') || ctx.underlyingName === 'Silver' || ctx.underlyingName === 'Black';

    if (ctx.isOpal) {
      if (isRedGold) {
        if (ctx.hasP) ctx.underlyingName = 'Sapphire Sun Glow';
        else if (ctx.hasG) ctx.underlyingName = 'Amber Sun Glow';
        else ctx.underlyingName = 'Red Opal';
      } else if (isCross) {
        if (ctx.hasP) ctx.underlyingName = 'Moonstone Glow';
        else ctx.underlyingName = 'Opal Cross';
      } else if (isSilver) {
        if (ctx.hasP) ctx.underlyingName = 'Sapphire Glow';
        else if (ctx.hasG) ctx.underlyingName = 'Amber Glow';
        else ctx.underlyingName = 'Opal';
      }
    } else if (ctx.isRadium) {
      if (isRedGold) {
        if (ctx.hasP) ctx.underlyingName = 'Pearl Sun Glow';
        else ctx.underlyingName = 'Sun Glow';
      } else if (isCross) {
        ctx.underlyingName = 'Radium Cross';
      } else if (isSilver) {
        if (ctx.hasP) ctx.underlyingName = 'Platinum Glow';
        else ctx.underlyingName = 'Radium';
      }
    } else if (ctx.isPaleGlow) {
      if (isRedGold) ctx.underlyingName = 'Pale Sun Glow';
      else if (isCross) ctx.underlyingName = 'Pale Cross';
      else if (isSilver) ctx.underlyingName = 'Pale Glow';
    }
  }
};

export function getPhenotype(genotype: Genotype, silverIntensity: number = 3, providedEyeColor?: string) {
  const C = genotype.C || ['C', 'C'];
  const L = genotype.L || ['L', 'L'];
  const Fire = genotype.Fire || ['FI', 'fi'];
  const G = genotype.G || ['G', 'g'];
  const P = genotype.P || ['P', 'p'];
  const R = genotype.R || ['R', 'R'];
  const T = genotype.T || ['T', 'T'];
  const S = genotype.S || ['s', 's'];
  const W = [...(genotype.W || ['w', 'w'])].sort();

  let isLethal = false;
  for (const locusKey in LOCI) {
    const alleles = genotype[locusKey];
    const locusDef = (LOCI as any)[locusKey];
    if (alleles && locusDef.lethal && locusDef.lethal(alleles)) {
      isLethal = true;
      break;
    }
  }

  const ctx: PhenotypeContext = {
    genotype,
    silverIntensity,
    baseColorName: 'Red',
    underlyingName: '',
    finalName: '',
    isLethal,
    isFifi: Fire.filter(x => x === 'fi').length === 2,
    hasG: G.filter(x => x === 'g').length === 2,
    hasP: P.filter(x => x === 'p').length === 2,
    isAmber: G.filter(x => x === 'g').length === 2 && P.filter(x => x === 'p').length === 2,
    isOpal: R.filter(x => x === 'r').length === 2,
    isRadium: R.filter(x => x === 'ra').length === 2,
    isPaleGlow: R.includes('r') && R.includes('ra')
  };

  const handlers = [BaseColorHandler, FireFactorHandler, ModifierHandler, OpalRadiumHandler];
  handlers.forEach(h => h(ctx));

  if (ctx.isLethal) ctx.finalName = 'Stillborn';
  else if (C.filter(x => x === 'c').length === 2) ctx.finalName = 'Albino';
  else if (L.filter(x => x === 'l').length === 2) ctx.finalName = 'Leucistic';
  else ctx.finalName = ctx.underlyingName;

  const patterns: string[] = [];
  if (T.includes('t')) patterns.push('Fawn Spotted');
  if (S.filter(x => x === 'S').length === 2) patterns.push('Piebald');
  else if (S.filter(x => x === 'S').length === 1) patterns.push('Star');

  if (W.includes('WM')) patterns.push('Marble');
  if (W.includes('WP')) patterns.push('Platinum');
  if (W.includes('WG')) patterns.push('Georgian');
  if (W.includes('W')) patterns.push('White Mark');

  const patternName = patterns.length > 0 ? patterns.join(' ') : 'None';
  const isFullyMasked = ctx.finalName === 'Albino' || ctx.finalName === 'Stillborn';
  const displayName = `${patternName !== 'None' && !isFullyMasked ? patternName + ' ' : ''}${ctx.finalName} Fox`;

  let eyeColor = providedEyeColor;
  if (!eyeColor) {
    eyeColor = getRandomEyeColor(ctx.finalName === "Albino" ? "Albino" : ctx.finalName);
  }

  const whiteAllelesCount = W.filter(a => a !== 'w').length;
  if (whiteAllelesCount > 0 && !providedEyeColor && ctx.finalName !== "Albino") {
    const chance = whiteAllelesCount >= 2 ? 0.25 : 0.10;
    const rand = Math.random();
    if (rand < chance) eyeColor = "Blue";
    else if (rand < chance * 2) eyeColor = `${eyeColor} - Blue Heterochromia`;
  }

  return {
    name: displayName,
    baseColor: ctx.finalName,
    pattern: patternName,
    eyeColor: eyeColor,
    geneticName: displayName,
    description: `A beautiful ${displayName} with ${eyeColor.toLowerCase().replace(" - blue heterochromia", " and blue heterochromic")} eyes.`,
    isLethal: ctx.isLethal,
    healthIssues: [
      ...(C.filter(x => x === 'c').length === 2 ? ['Photosensitivity and reduced vision'] : []),
      ...(L.filter(x => x === 'l').length === 2 ? ['Higher incidence of deafness and vision irregularities'] : []),
      ...(S.filter(x => x === 'S').length === 2 ? ['Potential sight and hearing issues'] : [])
    ],
  };
}

export interface Stats {
  head: number; topline: number; forequarters: number; hindquarters: number;
  tail: number; coatQuality: number; temperament: number; presence: number;
  luck: number; fertility: number;
}

export interface Fox {
  id: string;
  name: string;
  gender: "Dog" | "Vixen";
  genotype: Genotype;
  phenotype: string;
  baseColor: string;
  pattern: string;
  eyeColor: string;
  age: number;
  stats: Stats;
  ownerId: string;
  history: any[];
  isRetired?: boolean;
  isFoundation?: boolean;
  isNPC?: boolean;
  genotypeRevealed?: boolean;
  studFee: number;
  lastFed?: number;
  lastGroomed?: number;
  lastTrained?: number;
  boosts?: Record<string, number>;
  silverIntensity?: number;
  pointsLifetime: number;
  pointsYear: number;
  isAltered: boolean;
  isAtStud: boolean;
  pedigreeAnalyzed: boolean;
  preferredFeed?: string;
  birthYear: number;
  parents: (string | null)[];
  parentNames: (string | null)[];
  hasBeenRenamed: boolean;
  healthIssues: string[];
  coi: number;
}

export function generateStats(safeRandom: () => number = Math.random): Stats {
  const stats: Stats = {
    head: 0, topline: 0, forequarters: 0, hindquarters: 0,
    tail: 0, coatQuality: 0, temperament: 0, presence: 0,
    luck: 0, fertility: 0
  };
  Object.keys(stats).forEach(k => stats[k as keyof Stats] = Math.floor(safeRandom() * 40) + 10);
  return stats;
}

export function breed(mGen: Genotype, fGen: Genotype): Genotype {
  const childGen: Genotype = {};
  const loci = Array.from(new Set([...Object.keys(mGen), ...Object.keys(fGen)]));
  loci.forEach(locus => {
    const m = mGen[locus] || ['?', '?'];
    const f = fGen[locus] || ['?', '?'];
    childGen[locus] = [m[Math.floor(Math.random() * 2)], f[Math.floor(Math.random() * 2)]];
  });
  return childGen;
}

export function createFox(data: Partial<Fox>, safeRandom: () => number = Math.random, forcedId?: string): Fox {
  const genotype = data.genotype || getInitialGenotype();
  const pheno = getPhenotype(genotype, data.silverIntensity || 3);
  return {
    id: forcedId || Math.random().toString(36).substr(2, 9),
    name: data.name || "Unnamed Fox",
    gender: data.gender || (safeRandom() < 0.5 ? "Dog" : "Vixen"),
    genotype,
    phenotype: pheno.name,
    baseColor: pheno.baseColor,
    pattern: pheno.pattern,
    eyeColor: pheno.eyeColor,
    age: data.age || 0,
    stats: data.stats || generateStats(safeRandom),
    ownerId: data.ownerId || "system",
    history: [],
    pointsLifetime: 0,
    pointsYear: 0,
    isAltered: false,
    isAtStud: false,
    pedigreeAnalyzed: false,
    birthYear: 1,
    parents: [null, null],
    parentNames: [null, null],
    hasBeenRenamed: false,
    healthIssues: pheno.healthIssues || [],
    coi: 0,
    studFee: 0,
    ...data
  } as Fox;
}

export function getInitialGenotype(): Genotype {
  return {
    A: ['A', 'A'], B: ['B', 'B'], C: ['C', 'C'], G: ['G', 'G'],
    P: ['P', 'P'], Fire: ['FI', 'FI'], L: ['L', 'L'], R: ['R', 'R'],
    T: ['T', 'T'], S: ['s', 's'], W: ['w', 'w']
  };
}

export function calculateSilverIntensity(genotype: Genotype): number { return 3; }
export function isHungry(fox: Fox): boolean { return !fox.lastFed; }
export function isGroomed(fox: Fox): boolean { return !!fox.lastGroomed; }
export function isTrained(fox: Fox): boolean { return !!fox.lastTrained; }

export function getActiveBoosts(fox: Fox): Record<string, number> {
  const now = Date.now();
  const boosts: Record<string, number> = {};
  if (!fox.boosts) return boosts;
  for (const [s, e] of Object.entries(fox.boosts)) if (e > now) boosts[s] = 2;
  return boosts;
}

export const EYE_COLOR_WEIGHTS: Record<string, number> = {
  'Amber': 35, 'Light Brown': 35, 'Brown': 10, 'Green': 10, 'Grey': 10, 'Blue': 5
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
  'Autumn Fire': ['Amber', 'Grey', 'Blue'],
  'Champagne Cross': ['Blue'],
};

export function getRandomEyeColor(pheno: string): string {
  const pool = PHENOTYPE_EYE_COLORS[pheno] || ['Brown'];
  if (pool.length === 1) return pool[0];
  const weighted = pool.map(c => ({ c, w: EYE_COLOR_WEIGHTS[c] || 10 }));
  const total = weighted.reduce((s, i) => s + i.w, 0);
  let r = Math.random() * total;
  for (const i of weighted) { if (r < i.w) return i.c; r -= i.w; }
  return pool[0];
}

export function getBaseEyeColors(genotype: Genotype, si: number = 3): string[] {
  const temp = { ...genotype };
  delete temp.W; delete temp.L;
  const p = getPhenotype(temp, si);
  const poolName = p.baseColor === "Albino" ? "Albino" : p.baseColor;
  return [...(PHENOTYPE_EYE_COLORS[poolName] || ['Brown'])];
}

export function getWhiteMarkingOptions(genotype: Genotype): string[] {
  const options = [];
  if ((genotype.W || ['w', 'w']).some(a => a !== 'w')) options.push("Blue", "Blue Heterochromia");
  if ((genotype.L || ['l', 'l']).some(a => a === 'l')) options.push("Any Base Color");
  return options;
}

export function getValidEyeColors(genotype: Genotype, si: number = 3): string[] {
  const base = getBaseEyeColors(genotype, si);
  const W = genotype.W || ['w', 'w'];
  const L = genotype.L || ['l', 'l'];
  if (W.some(a => a !== 'w') && !L.some(a => a === 'l')) return [...base, "Blue", "Blue Heterochromia"];
  return base;
}

export function getEyeColorHex(color: string, base?: string): string {
  const map: Record<string, string> = {
    'Brown': '#8B4513', 'Light Brown': '#D2691E', 'Amber': '#FFBF00',
    'Green': '#228B22', 'Grey': '#808080', 'Blue': '#4169E1', 'Red': '#DC143C',
  };
  if (color === 'Blue Heterochromia' && base) return `linear-gradient(45deg, #4169E1 50%, ${map[base] || '#8B4513'} 50%)`;
  if (color === 'Blue Heterochromia') return 'linear-gradient(45deg, #4169E1 50%, #8B4513 50%)';
  return map[color] || '#8B4513';
}

export function calculateCOI(id: string, foxes: Record<string, Fox>, partnerId?: string): number { return 0; }

export function calculateBreedingOutcomes(m: Fox, f: Fox, foxes: Record<string, Fox>) {
  const counts: Record<string, number> = {};
  const trials = 100;
  for (let i = 0; i < trials; i++) {
    const child = breed(m.genotype, f.genotype);
    const name = getPhenotype(child).name;
    counts[name] = (counts[name] || 0) + 1;
  }
  const probabilities = Object.entries(counts)
    .map(([name, count]) => ({ name, percent: Math.round((count / trials) * 100) }))
    .sort((a, b) => b.percent - a.percent);
  return { probabilities, predictedCOI: 0 };
}

export function createFoundationalFox(safeRandom: () => number, gender?: "Dog" | "Vixen"): Fox {
  return createFox({ gender, ownerId: 'system', isFoundation: true }, safeRandom);
}

export function createFoundationFoxCollection(safeRandom: () => number, startId: number): Fox[] {
  const foxes: Fox[] = [];
  const genderOptions: ("Dog" | "Vixen")[] = ["Dog", "Vixen", "Dog", "Vixen", "Dog", "Vixen"];
  for (let i = 0; i < 6; i++) {
    const gender = genderOptions.splice(Math.floor(safeRandom() * genderOptions.length), 1)[0];
    foxes.push(createFoundationalFox(safeRandom, gender));
  }
  return foxes;
}
