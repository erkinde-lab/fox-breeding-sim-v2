import { getPhenotype, LOCI, Genotype } from './src/lib/genetics';

function getAllCombinations() {
    const uniqueNames = new Set<string>();

    const bases = [
        { A: ['A', 'A'], B: ['B', 'B'] }, // Red
        { A: ['A', 'A'], B: ['B', 'b'] }, // Gold
        { A: ['A', 'a'], B: ['B', 'B'] }, // Gold Cross
        { A: ['A', 'a'], B: ['B', 'b'] }, // Silver Cross
        { A: ['a', 'a'], B: ['B', 'B'] }, // Alaskan Silver
        { A: ['A', 'A'], B: ['b', 'b'] }, // Standard Silver
    ];

    const patterns = [
        { W: ['w', 'w'] }, // None
        { W: ['WM', 'w'] }, // Marble
    ];

    const mods = [
        {},
        { Fire: ['Fi', 'Fi'] }, // Fire
        { G: ['g', 'g'] }, // Burgundy
        { P: ['p', 'p'] }, // Pearl
        { SS: ['s', 's'] }, // Mansfield Pearl
        { Fire: ['Fi', 'Fi'], P: ['p', 'p'] }, // Fawn Glow / Snow Glow
        { P: ['p', 'p'], SS: ['s', 's'] }, // Sapphire
        { G: ['g', 'g'], P: ['p', 'p'], SS: ['s', 's'] }, // Pearl Amber
        { G: ['g', 'g'], P: ['p', 'p'] }, // Amber
        { Fire: ['Fi', 'Fi'], P: ['p', 'p'], G: ['g', 'g'] }, // Snow Glow / Autumn Fire
    ];

    for (const b of bases) {
        for (const p of patterns) {
            for (const m of mods) {
                const genotype: Genotype = {
                    A: ['A', 'A'], B: ['B', 'B'], G: ['G', 'G'], C: ['C', 'C'],
                    P: ['P', 'P'], SS: ['S', 'S'], Fire: ['fi', 'fi'],
                    W: ['w', 'w'], L: ['L', 'L'], D: ['D', 'D'],
                    ...b, ...p, ...m
                };
                const phenotype = getPhenotype(genotype);
                uniqueNames.add(phenotype.name);
            }
        }
    }

    const sortedNames = Array.from(uniqueNames).sort();
    console.log(sortedNames.join('\n'));
}

getAllCombinations();
