import { test, expect } from '@playwright/test';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPhenotype } from '../src/lib/genetics';

const tests = [
  // Base Color: Double Silver (updated to show as Silver per requirement)
  {
    genotype: { A: ['a', 'a'], B: ['b', 'b'] },
    expectedPhenotype: 'Silver Fox'
  },
  // Burgundy Corrections
  {
    genotype: { A: ['a', 'a'], B: ['B', 'B'], G: ['g', 'g'] },
    expectedPhenotype: 'Burgundy Fox'
  },
  {
    genotype: { A: ['A', 'a'], B: ['B', 'b'], G: ['g', 'g'] },
    expectedPhenotype: 'Burgundy Cross Fox'
  },
  // Fire Factor Double Silver
  {
    genotype: { A: ['a', 'a'], B: ['b', 'b'], Fire: ['fi', 'fi'] },
    expectedPhenotype: 'Colicott Fox'
  },
  // W Locus Lethality
  {
    genotype: { W: ['W', 'W'] },
    expectedPhenotype: 'Stillborn Fox'
  },
  {
    genotype: { W: ['WM', 'W'] },
    expectedPhenotype: 'Marble White Mark Red Fox'
  },
  // Leucistic Masking
  {
    genotype: { L: ['l', 'l'], W: ['WM', 'w'] },
    expectedPhenotype: 'Marble Leucistic Fox'
  }
];

let failed = 0;
tests.forEach((t, i) => {
  const result = getPhenotype(t.genotype as any);
  if (result.name !== t.expectedPhenotype) {
    console.error(`Test ${i} failed: Expected name "${t.expectedPhenotype}", got "${result.name}"`);
    failed++;
  } else {
    console.log(`Test ${i} passed: ${result.name}`);
  }
});

test("Logic Regression", async () => {
if (failed > 0) {
  process.exit(1);
} else {
  console.log("All regression tests passed!");
}

declare const process: { exit: (code: number) => void };

});