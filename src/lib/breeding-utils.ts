import { Fox, breed, getPhenotype, calculateBreedingOutcomes as geneticsCalc } from "./genetics";

export function calculateBreedingOutcomes(dog: Fox, vixen: Fox) {
  return geneticsCalc(dog, vixen);
}

export function suggestMatches(fox: Fox, candidates: Fox[]) {
  return candidates
    .filter(c => c.gender !== fox.gender && !c.isRetired && !c.isAltered)
    .map(c => {
      const dog = fox.gender === "Dog" ? fox : c;
      const vixen = fox.gender === "Vixen" ? fox : c;
      const outcomes = calculateBreedingOutcomes(dog, vixen);

      return {
        fox: c,
        matchScore: 50,
        topOutcome: outcomes.probabilities[0]?.name || "Unknown"
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
