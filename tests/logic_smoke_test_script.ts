import { getPhenotype, LOCI } from '../src/lib/genetics';
import { getFoxVariety } from '../src/lib/showing';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error('FAIL: ' + message);
  }
  console.log('PASS: ' + message);
}

console.log('Running Comprehensive Logic Smoke Tests...');

// 1. Genetic Masking & Health
const albinoGenotype = { C: ['c', 'c'], A: ['A', 'A'], B: ['B', 'B'] };
const albinoPhenotype = getPhenotype(albinoGenotype as any);
assert(albinoPhenotype.name === 'Albino Fox', 'Albino name check');
assert(albinoPhenotype.healthIssues.some(issue => issue.includes('Photosensitivity')), 'Albino health check');

const leucisticGenotype = { L: ['l', 'l'], A: ['A', 'A'], B: ['B', 'B'], W: ['WM', 'w'] };
const leucisticPhenotype = getPhenotype(leucisticGenotype as any);
assert(leucisticPhenotype.name === 'Marble Leucistic Fox', 'Leucistic name check');
assert(leucisticPhenotype.healthIssues.some(issue => issue.includes('deafness')), 'Leucistic health check');

// 2. Lethality
const wLocus = LOCI.W;
if (wLocus && typeof wLocus.lethal === 'function') {
  assert(wLocus.lethal(['W', 'W'] as any) === true, 'WW is lethal');
  assert(wLocus.lethal(['WM', 'WM'] as any) === false, 'WMWM is not lethal');
  assert(wLocus.lethal(['WM', 'WG'] as any) === false, 'WMWG is not lethal');
  assert(wLocus.lethal(['WG', 'WG'] as any) === true, 'WGWG is lethal');
}

// 3. Variety Classification (Showing)
const mockFox = (genotype: any): any => ({
  genotype,
  phenotype: getPhenotype(genotype).name
});

assert(getFoxVariety(mockFox({ A: ['A', 'A'], B: ['B', 'B'] })) === 'Red', 'Red Variety');
assert(getFoxVariety(mockFox({ A: ['a', 'a'], B: ['b', 'b'] })) === 'Silver', 'Silver Variety');
assert(getFoxVariety(mockFox({ A: ['A', 'a'], B: ['B', 'b'] })) === 'Cross', 'Cross Variety');
assert(getFoxVariety(mockFox({ A: ['A', 'A'], B: ['b', 'b'], G: ['g', 'g'] })) === 'Exotic', 'Burgundy Standard Silver (Exotic)');
assert(getFoxVariety(mockFox({ A: ['A', 'A'], B: ['B', 'B'], W: ['WM', 'w'] })) === 'White Mark', 'Marble Red (White Mark)');
assert(getFoxVariety(mockFox({ C: ['c', 'c'], A: ['A', 'A'], B: ['B', 'B'] })) === 'Exotic', 'Albino (Exotic)');

console.log('All Logic Smoke Tests Passed!');
