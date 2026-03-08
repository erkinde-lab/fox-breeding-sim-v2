/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPhenotype } from '../src/lib/genetics';
import { getFoxVariety } from '../src/lib/showing';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`PASSED: ${message}`);
}

// 1. Genetic Masking & Health
const albinoGenotype = { C: ['c', 'c'], A: ['A', 'A'], B: ['B', 'B'] };
const albinoPhenotype = getPhenotype(albinoGenotype as any);
assert(albinoPhenotype.name === 'Albino Fox', 'Albino name check');
assert(albinoPhenotype.healthIssues.some(issue => issue.includes('Photosensitivity')), 'Albino health check');

const stillbornGenotype = { W: ['W', 'W'], A: ['A', 'A'], B: ['B', 'B'] };
const stillbornPhenotype = getPhenotype(stillbornGenotype as any);
assert(stillbornPhenotype.name === 'Stillborn Fox', 'Stillborn name check');

// 2. Leucistic Pattern Persistence
const leucisticGenotype = { L: ['l', 'l'], W: ['WM', 'w'], A: ['A', 'A'], B: ['B', 'B'] };
const leucisticPhenotype = getPhenotype(leucisticGenotype as any);
assert(leucisticPhenotype.name === 'Marble Leucistic Fox', 'Leucistic pattern check');

// 3. Show Variety Logic
const mockFox = (genotype: any): any => ({
  genotype,
  phenotype: getPhenotype(genotype).name
});

assert(getFoxVariety(mockFox({ A: ['A', 'A'], B: ['B', 'B'] })) === 'Red', 'Red Variety');
assert(getFoxVariety(mockFox({ A: ['a', 'a'], B: ['b', 'b'] })) === 'Silver', 'Silver Variety');
assert(getFoxVariety(mockFox({ A: ['A', 'a'], B: ['B', 'b'] })) === 'Cross', 'Cross Variety');
assert(getFoxVariety(mockFox({ A: ['A', 'A'], B: ['b', 'b'], G: ['g', 'g'] })) === 'Exotic', 'Burgundy Standard Silver (Exotic)');

console.log('\nAll smoke tests passed!');
