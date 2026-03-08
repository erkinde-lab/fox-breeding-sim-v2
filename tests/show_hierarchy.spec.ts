import { test, expect } from '@playwright/test';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fox, getInitialGenotype } from '../src/lib/genetics';
import { runHierarchicalShow, Competitor } from '../src/lib/showing';

const mockFox = (id: string, gender: 'Dog' | 'Vixen', variety: string): Fox => ({
  id,
  name: `Fox ${id}`,
  gender,
  genotype: getInitialGenotype(), // Simplified for test
  phenotype: variety + " Fox",
  baseColor: variety,
  pattern: "None",
  eyeColor: "Brown",
  age: 2,
  stats: { head: 50, topline: 50, forequarters: 50, hindquarters: 50, tail: 50, coatQuality: 50, temperament: 50, presence: 50, luck: 10, fertility: 50 },
  genotypeRevealed: true,
  pedigreeAnalyzed: true,
  isRetired: false,
  hasBeenRenamed: true,
  silverIntensity: 3,
  healthIssues: [],
  pointsYear: 0,
  pointsLifetime: 0,
  parents: [null, null],
  parentNames: [null, null],
  birthYear: 1,
  coi: 0,
  isAtStud: false,
  studFee: 0,
  lastFed: Date.now(),
  ownerId: "player-1",
  history: [],
});

const competitors: Competitor[] = [
  { fox: mockFox('1', 'Dog', 'Red'), variety: 'Red', level: 'Open', gender: 'Dog', ageGroup: 'Adult', currentScore: 0, currentBreakdown: {} as any },
  { fox: mockFox('2', 'Vixen', 'Red'), variety: 'Red', level: 'Open', gender: 'Vixen', ageGroup: 'Adult', currentScore: 0, currentBreakdown: {} as any },
  { fox: mockFox('3', 'Dog', 'Gold'), variety: 'Gold', level: 'Open', gender: 'Dog', ageGroup: 'Adult', currentScore: 0, currentBreakdown: {} as any },
  { fox: mockFox('4', 'Vixen', 'Gold'), variety: 'Gold', level: 'Open', gender: 'Vixen', ageGroup: 'Adult', currentScore: 0, currentBreakdown: {} as any },
];

const report = runHierarchicalShow('Pro', competitors, 1, 'Spring', false, 'Judge', 'Show', 'Region');

console.log('--- Show Report ---');
console.log('Circuit:', report.circuit);
console.log('BIS:', report.bisFoxId);
console.log('RBIS:', report.rbisFoxId);
console.log('Results Count:', report.results.length);

report.results.forEach(res => {
  console.log(`[${res.title}] Fox ${res.foxId} (${res.gender}) Variety: ${res.variety} Score: ${res.score} Pts: ${res.pointsAwarded}`);
});

// Basic Assertions
if (report.results.length < 6) throw new Error('Expected at least 6 results (4 BOV/RBOV, 2 BOS/RBOS)');
if (!report.bisFoxId) throw new Error('Expected a BIS winner');

test('Show Hierarchy Test', async () => {
 // Logic executed on import or below
 });