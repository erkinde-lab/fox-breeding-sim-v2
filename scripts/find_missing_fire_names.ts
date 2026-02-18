import { getPhenotype } from '../src/lib/genetics';

const bases = [
  { name: 'Red', genotype: { A: ['A', 'A'], B: ['B', 'B'] } },
  { name: 'Gold', genotype: { A: ['A', 'A'], B: ['B', 'b'] } },
  { name: 'Gold Cross', genotype: { A: ['A', 'a'], B: ['B', 'B'] } },
  { name: 'Silver Cross', genotype: { A: ['A', 'a'], B: ['B', 'b'] } },
  { name: 'Alaskan Silver', genotype: { A: ['a', 'a'], B: ['B', 'B'] } },
  { name: 'Standard Silver (aa)', genotype: { A: ['a', 'a'], B: ['b', 'b'] } },
  { name: 'Standard Silver (Aa)', genotype: { A: ['A', 'a'], B: ['b', 'b'] } },
  { name: 'Standard Silver (AA)', genotype: { A: ['A', 'A'], B: ['b', 'b'] } },
];

const recessives = [
  { name: 'None', genotype: {} },
  { name: 'Pearl (pp)', genotype: { P: ['p', 'p'] } },
  { name: 'Amber (gg+pp)', genotype: { G: ['g', 'g'], P: ['p', 'p'] } },
  { name: 'Burgundy (gg)', genotype: { G: ['g', 'g'] } },
  { name: 'Mansfield Pearl (ss)', genotype: { SS: ['s', 's'] } },
  { name: 'Sapphire (pp+ss)', genotype: { P: ['p', 'p'], SS: ['s', 's'] } },
  { name: 'Pearl Amber (gg+pp+ss)', genotype: { G: ['g', 'g'], P: ['p', 'p'], SS: ['s', 's'] } },
];

console.log('--- Fire Expressing (fifi) ---');
bases.forEach(b => {
  recessives.forEach(r => {
    const fullGenotype = { ...b.genotype, ...r.genotype, Fire: ['fi', 'fi'] };
    const p = getPhenotype(fullGenotype as any);
    console.log(`${b.name} + ${r.name}: ${p.name}`);
  });
});
