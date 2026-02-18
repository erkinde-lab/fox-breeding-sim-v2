import { getPhenotype } from '../src/lib/genetics';

const testCases = [
  {
    name: 'Red + Amber + Fire = Autumn Fire',
    genotype: { A: ['A', 'A'], B: ['B', 'B'], G: ['g', 'g'], P: ['p', 'p'], Fire: ['fi', 'fi'] },
    expected: 'Autumn Fire Fox'
  },
  {
    name: 'Gold + Amber + Fire = Autumn Fire',
    genotype: { A: ['A', 'A'], B: ['B', 'b'], G: ['g', 'g'], P: ['p', 'p'], Fire: ['fi', 'fi'] },
    expected: 'Autumn Fire Fox'
  },
  {
    name: 'Cross + Amber + Fire = Snow Glow',
    genotype: { A: ['A', 'a'], B: ['B', 'B'], G: ['g', 'g'], P: ['p', 'p'], Fire: ['fi', 'fi'] },
    expected: 'Snow Glow Fox'
  },
  {
    name: 'aa Silver + Amber + Fire = Champagne',
    genotype: { A: ['a', 'a'], B: ['B', 'B'], G: ['g', 'g'], P: ['p', 'p'], Fire: ['fi', 'fi'] },
    expected: 'Champagne Fox'
  },
  {
    name: 'Red + Pearl + Fire = Fire and Ice',
    genotype: { A: ['A', 'A'], B: ['B', 'B'], P: ['p', 'p'], Fire: ['fi', 'fi'] },
    expected: 'Fire and Ice Fox'
  },
  {
    name: 'Cross + Pearl + Fire = Moon Glow',
    genotype: { A: ['A', 'a'], B: ['B', 'B'], P: ['p', 'p'], Fire: ['fi', 'fi'] },
    expected: 'Moon Glow Fox'
  },
  {
    name: 'aa Silver + Pearl + Fire = Fawn Glow',
    genotype: { A: ['a', 'a'], B: ['B', 'B'], P: ['p', 'p'], Fire: ['fi', 'fi'] },
    expected: 'Fawn Glow Fox'
  }
];

testCases.forEach(tc => {
  const p = getPhenotype(tc.genotype as any);
  const pass = p.name === tc.expected;
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${tc.name} | Got: ${p.name} | Expected: ${tc.expected}`);
});
