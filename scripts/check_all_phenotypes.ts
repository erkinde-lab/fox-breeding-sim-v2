import { getPhenotype } from '../src/lib/genetics';

const loci = {
  A: [['A', 'A'], ['A', 'a'], ['a', 'a']],
  B: [['B', 'B'], ['B', 'b'], ['b', 'b']],
  C: [['C', 'C'], ['c', 'c']],
  G: [['G', 'G'], ['g', 'g']],
  P: [['P', 'P'], ['p', 'p']],
  SS: [['S', 'S'], ['s', 's']],
  Fire: [['FI', 'FI'], ['FI', 'fi'], ['fi', 'fi']],
  L: [['L', 'L'], ['l', 'l']],
  D: [['D', 'D'], ['d', 'd']],
  W: [['w', 'w'], ['W', 'w']]
};

const uniqueNames = new Set<string>();

function generate(current: any, keys: string[]) {
  if (keys.length === 0) {
    try {
      const p = getPhenotype(current);
      uniqueNames.add(p.name);
    } catch (e) {
      // ignore
    }
    return;
  }

  const key = keys[0];
  const remaining = keys.slice(1);
  for (const alleles of (loci as any)[key]) {
    current[key] = alleles;
    generate({ ...current }, remaining);
  }
}

generate({}, Object.keys(loci));

const sortedNames = Array.from(uniqueNames).sort();
sortedNames.forEach(name => console.log(name));
console.log('Total unique names:', uniqueNames.size);
