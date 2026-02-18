import { getPhenotype } from '../src/lib/genetics';

const cases = [
  { name: 'Fire and Ice', genotype: { A: ['A', 'A'], B: ['B', 'B'], P: ['p', 'p'], Fire: ['fi', 'fi'] } },
  { name: 'Snow Glow (Red)', genotype: { A: ['A', 'A'], B: ['B', 'B'], P: ['p', 'p'], G: ['g', 'g'], Fire: ['fi', 'fi'] } },
  { name: 'Autumn Fire (Gold)', genotype: { A: ['A', 'A'], B: ['B', 'b'], P: ['p', 'p'], G: ['g', 'g'], Fire: ['fi', 'fi'] } },
  { name: 'Moon Glow (Gold Cross)', genotype: { A: ['A', 'a'], B: ['B', 'B'], P: ['p', 'p'], Fire: ['fi', 'fi'] } },
  { name: 'Fawn Glow (Silver)', genotype: { A: ['a', 'a'], B: ['B', 'B'], P: ['p', 'p'], Fire: ['fi', 'fi'] } },
  { name: 'Colicott', genotype: { A: ['a', 'a'], B: ['B', 'B'], Fire: ['fi', 'fi'] } },
  { name: 'Wildfire', genotype: { A: ['A', 'A'], B: ['B', 'B'], Fire: ['fi', 'fi'] } },
  { name: 'Heterozygous Fire (No expression)', genotype: { A: ['A', 'A'], B: ['B', 'B'], Fire: ['FI', 'fi'] } },
];

cases.forEach(c => {
  const p = getPhenotype(c.genotype as any);
  console.log(`${c.name}: Expected something related, got: ${p.name}`);
});
