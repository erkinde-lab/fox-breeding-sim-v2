import { Fox, getActiveBoosts, isHungry } from './genetics';

export type ShowLevel = 'Junior' | 'Open' | 'Senior' | 'Championship';
export type ShowClass = 
    'Best Juvenile Male' | 'Best Juvenile Female' | 'Best Adult Male' | 'Best Adult Female' |
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

  if (hasGroomer) coatQuality += 5;
  if (hasTrainer) {
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
    'Best Juvenile Male',
    'Best Juvenile Female',
    'Best Adult Male',
    'Best Adult Female',
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
      if (f.isRetired || f.healthIssues.length > 0) return false;
      
      const isMale = f.gender === 'Male';
      const isJuvenile = f.age === 0;
      
      if (cls === 'Best Juvenile Male') return isMale && isJuvenile;
      if (cls === 'Best Juvenile Female') return !isMale && isJuvenile;
      if (cls === 'Best Adult Male') return isMale && !isJuvenile;
      if (cls === 'Best Adult Female') return !isMale && !isJuvenile;
      
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
        if (level === 'Junior') return f.pointsLifetime < 5;
        if (level === 'Senior') return f.pointsLifetime > 10;
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
