import { test, expect } from '@playwright/test';
import { Fox, Genotype } from '../src/lib/genetics';
import { Competitor, Variety, ShowLevel, runHierarchicalShow } from '../src/lib/showing';

const mockGenotype: Genotype = { A: ['A', 'A'], B: ['B', 'B'] };

const createMockFox = (id: string, gender: 'Dog' | 'Vixen', variety: string): Fox => ({
  id,
  name: `Test Fox ${id}`,
  gender,
  genotype: mockGenotype,
  phenotype: variety,
  baseColor: 'Red',
  pattern: 'None',
  eyeColor: 'Brown',
  age: 2,
  stats: {
    head: 5, topline: 5, hindquarters: 5, forequarters: 5, tail: 5,
    coatQuality: 5, temperament: 5, condition: 5, presence: 5,
    luck: 5, fertility: 5
  },
  ownerId: 'player-1',
  history: [],
  isAltered: false,
  isNPC: false,
  genotypeRevealed: false,
  isFoundation: false,
  pointsLifetime: 0,
  pointsYear: 0,
  lastFed: Date.now(),
  healthIssues: [],
  studFee: 0,
  birthYear: 1,
  parents: [],
  parentNames: []
});

test('hierarchical show scoring', async () => {
  const fox1 = createMockFox('1', 'Dog', 'Red');
  const fox2 = createMockFox('2', 'Vixen', 'Red');

  const competitors: Competitor[] = [
    {
      fox: fox1,
      variety: 'Red' as Variety,
      level: 'Open' as ShowLevel,
      gender: 'Dog',
      ageGroup: 'Open',
      currentScore: 0,
      currentBreakdown: {
        baseScore: 0, conformation: 0, movement: 0, temperament: 0,
        condition: 0, presence: 0, luck: 0, handlerBonus: 0, healthBonus: 0
      }
    },
    {
      fox: fox2,
      variety: 'Red' as Variety,
      level: 'Open' as ShowLevel,
      gender: 'Vixen',
      ageGroup: 'Open',
      currentScore: 0,
      currentBreakdown: {
        baseScore: 0, conformation: 0, movement: 0, temperament: 0,
        condition: 0, presence: 0, luck: 0, handlerBonus: 0, healthBonus: 0
      }
    },
  ];

  const report = runHierarchicalShow(
    'Pro',
    competitors,
    1,
    'Spring',
    { Pro: { bis: 100, rbis: 50, bov: 20, rbov: 10, bos: 40, rbos: 20, boc: 10, rboc: 5 } },
    false,
    false,
    false
  );

  expect(report.results.length).toBeGreaterThan(0);
});
