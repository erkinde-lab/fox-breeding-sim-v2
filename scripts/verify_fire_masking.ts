import { getPhenotype } from '../src/lib/genetics';

const testCases = [
  {
    name: 'Mansfield Pearl masks Fire',
    genotype: { A: ['A', 'A'], B: ['B', 'B'], SS: ['s', 's'], Fire: ['fi', 'fi'] },
    expected: 'Mansfield Pearl Fox'
  },
  {
    name: 'Burgundy alone masks Fire',
    genotype: { A: ['A', 'A'], B: ['B', 'B'], G: ['g', 'g'], Fire: ['fi', 'fi'] },
    expected: 'Burgundy Fox'
  },
  {
    name: 'AA Silver masks Fire',
    genotype: { A: ['A', 'A'], B: ['b', 'b'], Fire: ['fi', 'fi'] },
    expected: 'Silver Fox'
  },
  {
    name: 'Aa Silver masks Fire',
    genotype: { A: ['A', 'a'], B: ['b', 'b'], Fire: ['fi', 'fi'] },
    expected: 'Silver Fox'
  },
  {
    name: 'Carrier FIfi does not express',
    genotype: { A: ['A', 'A'], B: ['B', 'B'], Fire: ['FI', 'fi'] },
    expected: 'Red Fox'
  },
  {
    name: 'Pearl Amber does NOT mask Fire',
    genotype: { G: ['g', 'g'], P: ['p', 'p'], SS: ['s', 's'], Fire: ['fi', 'fi'] },
    expected: 'Autumn Fire Fox'
  }
];

testCases.forEach(tc => {
  const p = getPhenotype(tc.genotype as any);
  const pass = p.name === tc.expected;
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${tc.name} | Got: ${p.name} | Expected: ${tc.expected}`);
});
