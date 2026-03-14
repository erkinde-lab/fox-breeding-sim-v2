import { Variety, ShowLevel } from "./showing";

export type Allele = string;
export type Genotype = Record<string, [Allele, Allele]>;

export interface Stats {
  head: number;
  topline: number;
  forequarters: number;
  hindquarters: number;
  tail: number;
  coatQuality: number;
  temperament: number;
  condition: number;
  presence: number;
  luck: number;
  fertility: number;
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
  isFoundation: boolean;
  isNPC: boolean;
  isRetired?: boolean;
  isAltered?: boolean;
  genotypeRevealed?: boolean;
  history: { date: string; event: string; details: string }[];
  lastFed?: number;
  lastGroomed?: number;
  lastTrained?: number;
  pointsLifetime: number;
  pointsYear: number;
  preferredFeed?: string;
  isStud?: boolean;
  isAtStud?: boolean;
  studFee: number;
  hasBeenRenamed?: boolean;
  birthYear: number;
  healthIssues: string[];
  parents: string[];
  parentNames: string[];
  pedigreeAnalyzed?: boolean;
}

export interface LocusDefinition {
  name: string;
  alleles: string[];
  description: string;
  lethal?: (alleles: Allele[]) => boolean;
}

export const LOCI: Record<string, LocusDefinition> = {
  A: { name: "Agouti", alleles: ["A", "a"], description: "Controls the distribution of black pigment." },
  B: { name: "Black", alleles: ["B", "b"], description: "Determines the base pigment color." },
  C: { name: "Albino", alleles: ["C", "c"], description: "Controls overall pigment production." },
  G: { name: "Grey/Burgundy", alleles: ["G", "g"], description: "Modifies red pigment into burgundy tones." },
  P: { name: "Pearl", alleles: ["P", "p"], description: "Dilutes pigment into pearlescent tones." },
  Fire: { name: "Fire Factor", alleles: ["FI", "fi"], description: "Enhances red pigment intensity." },
  L: { name: "Leucistic", alleles: ["L", "l"], description: "Causes pigment loss." },
  R: { name: "Opal/Radium", alleles: ["R", "r", "ra"], description: "Metallic dilutions." },
  W: {
    name: "White Markings", alleles: ["w", "W", "WM", "WG", "WP"],
    description: "Dominant white markings.",
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
}

const BaseColorHandler = (ctx: PhenotypeContext) => {
  const A = ctx.genotype.A || ['A', 'A'];
  const B = ctx.genotype.B || ['B', 'B'];
  const aCount = A.filter(x => x === 'a').length;
  const bCount = B.filter(x => x === 'b').length;
  const BCount = B.filter(x => x === 'B').length;

  if (aCount === 2 && bCount === 2) {
    ctx.baseColorName = 'Double Silver';
    ctx.underlyingName = 'Silver Fox';
  } else if (aCount === 2) {
    ctx.baseColorName = 'Standard Silver';
    ctx.underlyingName = 'Silver Fox';
  } else if (bCount === 2) {
    ctx.baseColorName = 'Alaskan Silver';
    ctx.underlyingName = 'Silver Fox';
  } else if (aCount === 1 || bCount === 1) {
    ctx.baseColorName = 'Cross';
    ctx.underlyingName = 'Cross Fox';
  } else if (BCount === 1) {
    ctx.baseColorName = 'Gold';
    ctx.underlyingName = 'Gold Fox';
  } else {
    ctx.baseColorName = 'Red';
    ctx.underlyingName = 'Red Fox';
  }
};

const ModifierHandler = (ctx: PhenotypeContext) => {
  if (ctx.isAmber) {
    ctx.underlyingName = 'Amber ' + ctx.baseColorName;
  } else if (ctx.hasG) {
    ctx.underlyingName = 'Burgundy ' + ctx.baseColorName;
  } else if (ctx.hasP) {
    ctx.underlyingName = 'Pearl ' + ctx.baseColorName;
  }
};

const FireFactorHandler = (ctx: PhenotypeContext) => {
  if (!ctx.isFifi) return;

  if (ctx.baseColorName === 'Red') {
    ctx.underlyingName = 'Wildfire';
  } else if (ctx.baseColorName === 'Gold') {
    ctx.underlyingName = 'Golden Sunrise';
  } else if (ctx.baseColorName === 'Cross') {
    ctx.underlyingName = ctx.hasP ? 'Fire and Ice' : 'Autumn Fire';
  } else if (ctx.baseColorName.includes('Silver')) {
    ctx.underlyingName = 'Colicott';
  }
};

const OpalRadiumHandler = (ctx: PhenotypeContext) => {
  if (ctx.isOpal) {
    ctx.underlyingName = 'Opal ' + ctx.underlyingName;
  } else if (ctx.isRadium) {
    ctx.underlyingName = 'Radium ' + ctx.underlyingName;
  }
};

export function getPhenotype(...args: any[]) {
  const genotype = args[0] as Genotype;
  const silverIntensity = args[1] || 3;

  const Fire = genotype.Fire || ['FI', 'FI'];
  const G = genotype.G || ['G', 'G'];
  const P = genotype.P || ['P', 'P'];
  const R = genotype.R || ['R', 'R'];
  const C = genotype.C || ['C', 'C'];
  const L = genotype.L || ['L', 'L'];

  let isLethal = false;
  for (const locusKey in LOCI) {
    const alleles = genotype[locusKey];
    if (alleles && (LOCI as any)[locusKey].lethal && (LOCI as any)[locusKey].lethal(alleles)) {
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
  };

  const handlers = [BaseColorHandler, ModifierHandler, FireFactorHandler, OpalRadiumHandler];
  handlers.forEach(h => h(ctx));

  if (ctx.isLethal) ctx.finalName = 'Stillborn';
  else if (C.filter(x => x === 'c').length === 2) ctx.finalName = 'Albino';
  else if (L.filter(x => x === 'l').length === 2) ctx.finalName = 'Leucistic';
  else ctx.finalName = ctx.underlyingName;

  return {
    name: ctx.finalName,
    variety: 'Red' as Variety,
    description: 'A beautiful ' + ctx.finalName,
    baseColor: ctx.baseColorName,
    pattern: 'None',
    eyeColor: 'Brown',
    healthIssues: [] as string[]
  };
}

export function breed(...args: any[]): Fox[] {
  const kits: Fox[] = [];
  const safeRandom = Math.random;
  const count = Math.floor(safeRandom() * 4) + 1;
  for (let i = 0; i < count; i++) {
    kits.push(createFox({ ownerId: "system" }, safeRandom));
  }
  return kits;
}

export function createFox(overrides: Partial<Fox> = {}, safeRandom: any = Math.random, extra?: any): Fox {
  return {
    id: Math.random().toString(),
    name: "New Fox",
    gender: safeRandom() > 0.5 ? "Dog" : "Vixen",
    genotype: { A: ['A', 'a'], B: ['B', 'b'] },
    phenotype: "Red",
    baseColor: "Red",
    pattern: "None",
    eyeColor: "Brown",
    age: 0,
    stats: { head: 5, topline: 5, forequarters: 5, hindquarters: 5, tail: 5, coatQuality: 5, temperament: 5, condition: 5, presence: 5, luck: 5, fertility: 5 },
    ownerId: "system",
    isFoundation: false,
    isNPC: false,
    history: [],
    pointsLifetime: 0,
    pointsYear: 0,
    healthIssues: [],
    studFee: 0,
    birthYear: 1,
    parents: [],
    parentNames: [],
    ...overrides
  };
}

export function createFoundationalFox(...args: any[]): Fox {
  return createFox({ ownerId: 'system', isFoundation: true });
}

export function createFoundationFoxCollection(safeRandom: any, startId: number): Fox[] {
  const foxes: Fox[] = [];
  for (let i = 0; i < 6; i++) {
    foxes.push(createFoundationalFox(safeRandom));
  }
  return foxes;
}

export function isHungry(fox: Fox): boolean { return false; }
export function isGroomed(fox: Fox): boolean { return true; }
export function isTrained(fox: Fox): boolean { return true; }
export function calculateCOI(id: string, foxes: any): number { return 0; }
export function getActiveBoosts(fox: Fox): any { return {}; }
export function getValidEyeColors(...args: any[]): string[] { return ["Brown"]; }
export function getBaseEyeColors(genotype?: any, si?: any): string[] { return ["Brown"]; }
export function getWhiteMarkingOptions(genotype?: any): string[] { return ["None"]; }
export function getEyeColorHex(...args: any[]): string { return "#8B4513"; }

export function calculateBreedingOutcomes(dog: any, vixen: any, foxes?: any) {
  return { probabilities: [{ name: "Red", percent: 100 }], predictedCOI: 0 };
}

export function isFoxEligibleForShow(...args: any[]): boolean { return true; }
