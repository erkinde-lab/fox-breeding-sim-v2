import { Fox, getActiveBoosts, isHungry, isGroomed, isTrained } from './genetics';

export type ShowLevel = "Junior" | "Open" | "Senior" | "Championship" | "Amateur Junior" | "Amateur Open" | "Amateur Senior";
export type ShowClass = 
    'Best Juvenile Dog' | 'Best Juvenile Vixen' | 'Best Adult Dog' | 'Best Adult Vixen' |
    'Red Specialty' | 'Silver Specialty' | 'Gold Specialty' | 'Cross Specialty' | 'Exotic Specialty';

export interface ShowResult {
  foxId: string;
  score: number;
  place: number; // 1, 2, 3
  pointsAwarded: number;
  class: ShowClass;
}

export interface ShowReport {
  level: ShowLevel;
  year: number;
  season: string;
  results: ShowResult[];
  bestInShowFoxId: string | null;
}

export function calculateScore(fox: Fox, hasGroomer: boolean = false, hasTrainer: boolean = false, hasVeterinarian: boolean = false): number {
  const { stats } = fox;
  const activeBoosts = getActiveBoosts(fox);
  const hungry = isHungry(fox);
  
  // Sum all show-relevant hidden stats except luck
  let head = stats.head + (activeBoosts['head'] || 0);
  let topline = stats.topline + (activeBoosts['topline'] || 0);
  let forequarters = stats.forequarters + (activeBoosts['forequarters'] || 0);
  let hindquarters = stats.hindquarters + (activeBoosts['hindquarters'] || 0);
  let tail = stats.tail + (activeBoosts['tail'] || 0);
  let coatQuality = stats.coatQuality + (activeBoosts['coatQuality'] || 0);
  let temperament = stats.temperament + (activeBoosts['temperament'] || 0);
  let presence = stats.presence + (activeBoosts['presence'] || 0);

  if (isGroomed(fox)) coatQuality += 5;
  if (isTrained(fox)) {
      temperament += 3;
      presence += 3;
  }
  if (hasVeterinarian) {
      head += 1;
      topline += 1;
      forequarters += 1;
      hindquarters += 1;
      tail += 1;
  }

  if (hungry) {
      head -= 5;
      topline -= 5;
      forequarters -= 5;
      hindquarters -= 5;
      tail -= 5;
      coatQuality -= 5;
      temperament -= 5;
      presence -= 5;
  }

  const baseScore = 
    head +
    topline +
    forequarters +
    hindquarters +
    tail +
    coatQuality + 
    temperament + 
    presence;
  
  // Generate random bonus: 1 <= R <= luck
  const luckBonus = Math.floor(Math.random() * stats.luck) + 1;
  
  return Math.max(0, baseScore + luckBonus);
}

export function runShow(level: ShowLevel, foxes: Fox[], year: number, season: string, hasGroomer: boolean = false, hasTrainer: boolean = false, hasVeterinarian: boolean = false): ShowReport {
  const results: ShowResult[] = [];
  
  const classes: ShowClass[] = [
    'Best Juvenile Dog',
    'Best Juvenile Vixen',
    'Best Adult Dog',
    'Best Adult Vixen',
    'Red Specialty',
    'Silver Specialty',
    'Gold Specialty',
    'Cross Specialty',
    'Exotic Specialty'
  ];

  let bestInShowScore = -1;
  let bestInShowFoxId: string | null = null;

  classes.forEach(cls => {
    const eligibleFoxes = foxes.filter(f => {
      if (f.isRetired || f.healthIssues.length > 0 || isHungry(f)) return false;
      
      const isDog = f.gender === 'Dog';
      const isJuvenile = f.age === 0;
      
      if (cls === 'Best Juvenile Dog') return isDog && isJuvenile;
      if (cls === 'Best Juvenile Vixen') return !isDog && isJuvenile;
      if (cls === 'Best Adult Dog') return isDog && !isJuvenile;
      if (cls === 'Best Adult Vixen') return !isDog && !isJuvenile;
      
      // Specialty Classes
      const a = [...f.genotype.A].sort().join('');
      const b = [...f.genotype.B].sort().join('');
      
      if (cls === 'Red Specialty') {
          return a === 'AA' && b === 'BB';
      }
      if (cls === 'Silver Specialty') {
          return a === 'aa' || b === 'bb' || (a === 'Aa' && b === 'bb');
      }
      if (cls === 'Gold Specialty') {
          return a === 'AA' && b === 'Bb';
      }
      if (cls === 'Cross Specialty') {
          return a === 'Aa' && b !== 'bb';
      }
      if (cls === 'Exotic Specialty') {
          // Check for any non-wild-type in rare loci
          const loci = ['C', 'G', 'P', 'SS', 'Fire', 'L'];
          return loci.some(l => {
              const alleles = f.genotype[l];
              if (!alleles) return false;
              // If not homozygous dominant
              const wild = alleles[0].toUpperCase();
              return alleles.some(al => al.toLowerCase() === al); // Check for recessive allele
          });
      }

      return false;
    });

    // Level restrictions
    const finalEligible = eligibleFoxes.filter(f => {
        // Amateur shows are restricted to adult foxes
        if (level.startsWith("Amateur") && f.age === 0) return false;

        const baseLevel = level.replace("Amateur ", "");
        if (baseLevel === "Junior") return f.pointsLifetime < 5;
        if (baseLevel === "Senior") return f.pointsLifetime > 10;
        return true;
    });

    const scored = finalEligible.map(f => ({
      id: f.id,
      score: calculateScore(f, hasGroomer, hasTrainer, hasVeterinarian),
    })).sort((a, b) => b.score - a.score);

    scored.slice(0, 3).forEach((s, idx) => {
      const place = idx + 1;
      const points = 4 - place; // 1st=3, 2nd=2, 3rd=1
      results.push({
        foxId: s.id,
        score: s.score,
        place,
        pointsAwarded: points,
        class: cls,
      });

      if (s.score > bestInShowScore) {
        bestInShowScore = s.score;
        bestInShowFoxId = s.id;
      }
    });
  });

  return {
    level,
    year,
    season,
    results,
    bestInShowFoxId,
  };
}

export function runSpecificShow(level: ShowLevel, showClass: ShowClass, foxes: Fox[], year: number, season: string, hasGroomer: boolean = false, hasTrainer: boolean = false, hasVeterinarian: boolean = false): ShowReport {
  const eligibleFoxes = foxes.filter(f => {
    if (f.isRetired || f.healthIssues.length > 0) return false;

    const isDog = f.gender === 'Dog';
    const isJuvenile = f.age === 0;

    if (showClass === 'Best Juvenile Dog') return isDog && isJuvenile;
    if (showClass === 'Best Juvenile Vixen') return !isDog && isJuvenile;
    if (showClass === 'Best Adult Dog') return isDog && !isJuvenile;
    if (showClass === 'Best Adult Vixen') return !isDog && !isJuvenile;

    const a = [...f.genotype.A].sort().join('');
    const b = [...f.genotype.B].sort().join('');

    if (showClass === 'Red Specialty') return a === 'AA' && b === 'BB';
    if (showClass === 'Silver Specialty') return a === 'aa' || b === 'bb' || (a === 'Aa' && b === 'bb');
    if (showClass === 'Gold Specialty') return a === 'AA' && b === 'Bb';
    if (showClass === 'Cross Specialty') return a === 'Aa' && b !== 'bb';
    if (showClass === 'Exotic Specialty') {
        const loci = ['C', 'G', 'P', 'SS', 'Fire', 'L'];
        return loci.some(l => {
            const alleles = f.genotype[l];
            if (!alleles) return false;
            const wild = alleles[0].toUpperCase();
            return alleles.some(al => al.toLowerCase() === al);
        });
    }
    return false;
  });

  const finalEligible = eligibleFoxes.filter(f => {
      if (level.startsWith("Amateur") && f.age === 0) return false;
      const baseLevel = level.replace("Amateur ", "");
      if (baseLevel === "Junior") return f.pointsLifetime < 5;
      if (baseLevel === "Senior") return f.pointsLifetime > 10;
      return true;
  });

  const scored = finalEligible.map(f => ({
    id: f.id,
    score: calculateScore(f, hasGroomer, hasTrainer, hasVeterinarian),
  })).sort((a, b) => b.score - a.score);

  const results: ShowResult[] = [];
  scored.slice(0, 3).forEach((s, idx) => {
    const place = idx + 1;
    const points = 4 - place;
    results.push({
      foxId: s.id,
      score: s.score,
      place,
      pointsAwarded: points,
      class: showClass,
    });
  });

  return {
    level,
    year,
    season,
    results,
    bestInShowFoxId: scored.length > 0 ? scored[0].id : null,
  };
}

export function isFoxEligibleForShow(fox: Fox, level: ShowLevel, showClass: ShowClass): boolean {
  if (fox.isRetired || fox.healthIssues.length > 0 || isHungry(fox)) return false;

  const isDog = fox.gender === 'Dog';
  const isJuvenile = fox.age === 0;

  let classMatch = false;
  if (showClass === 'Best Juvenile Dog') classMatch = isDog && isJuvenile;
  else if (showClass === 'Best Juvenile Vixen') classMatch = !isDog && isJuvenile;
  else if (showClass === 'Best Adult Dog') classMatch = isDog && !isJuvenile;
  else if (showClass === 'Best Adult Vixen') classMatch = !isDog && !isJuvenile;
  else {
    const a = [...fox.genotype.A].sort().join('');
    const b = [...fox.genotype.B].sort().join('');

    if (showClass === 'Red Specialty') classMatch = a === 'AA' && b === 'BB';
    else if (showClass === 'Silver Specialty') classMatch = a === 'aa' || b === 'bb' || (a === 'Aa' && b === 'bb');
    else if (showClass === 'Gold Specialty') classMatch = a === 'AA' && b === 'Bb';
    else if (showClass === 'Cross Specialty') classMatch = a === 'Aa' && b !== 'bb';
    else if (showClass === 'Exotic Specialty') {
        const loci = ['C', 'G', 'P', 'SS', 'Fire', 'L'];
        classMatch = loci.some(l => {
            const alleles = fox.genotype[l];
            if (!alleles) return false;
            const wild = alleles[0].toUpperCase();
            return alleles.some(al => al.toLowerCase() === al);
        });
    }
  }

  if (!classMatch) return false;

  if (level.startsWith("Amateur") && fox.age === 0) return false;
  const baseLevel = level.replace("Amateur ", "");
  if (baseLevel === "Junior") return fox.pointsLifetime < 5;
  if (baseLevel === "Senior") return fox.pointsLifetime > 10;

  return true;
}
