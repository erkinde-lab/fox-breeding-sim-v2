import { Fox, Genotype, breed, calculateCOI, getPhenotype, calculateSilverIntensity } from "./genetics";

/**
 * Calculates probability of different phenotypes for a potential breeding pair
 */
export function calculateBreedingOutcomes(
  m: Fox,
  f: Fox,
  foxes: Record<string, Fox>,
  trials: number = 1000
) {
  const counts: Record<string, number> = {};

  for (let i = 0; i < trials; i++) {
    const childGenotype = breed(m.genotype, f.genotype);
    const childSilver = calculateSilverIntensity(m.silverIntensity, f.silverIntensity);
    const phenotype = getPhenotype(childGenotype, childSilver);

    const name = phenotype.name;
    counts[name] = (counts[name] || 0) + 1;
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

/**
 * Finds optimal matches for a fox based on COI and phenotype goals (placeholder for Branch 4)
 */
export function suggestMatches(
  targetId: string,
  candidates: Fox[],
  foxes: Record<string, Fox>
) {
  const target = foxes[targetId];
  if (!target) return [];

  return candidates
    .filter(c => c.id !== target.id && c.gender !== target.gender && !c.isRetired && c.age >= 2)
    .map(c => ({
      fox: c,
      coi: calculateCOI(target.id, foxes, c.id)
    }))
    .sort((a, b) => a.coi - b.coi)
    .slice(0, 5);
}
