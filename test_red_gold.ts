import { getPhenotype } from './src/lib/genetics';

const red = { A: ['A', 'A'], B: ['B', 'B'] };
const gold = { A: ['A', 'A'], B: ['B', 'b'] };

console.log("Red genotype phenotype:", getPhenotype(red as any).name);
console.log("Gold genotype phenotype:", getPhenotype(gold as any).name);
