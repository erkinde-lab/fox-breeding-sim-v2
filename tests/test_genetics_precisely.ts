import { getPhenotype } from '../src/lib/genetics';

function test(genotype: any, expectedName: string, expectedEyes: string = 'Brown') {
    const p = getPhenotype(genotype);
    console.log(`Genotype: ${JSON.stringify(genotype)} -> ${p.name} (${p.eyeColor} eyes)`);
    if (p.name !== expectedName) {
        console.error(`FAILED: Expected "${expectedName}", got "${p.name}"`);
        process.exit(1);
    }
    if (p.eyeColor !== expectedEyes) {
        console.error(`FAILED: Expected "${expectedEyes}" eyes, got "${p.eyeColor}"`);
        process.exit(1);
    }
}

console.log("Testing Fire Factor Nomenclature...");

// 1. Wildfire: AABB + fifi
test({ A: ['A', 'A'], B: ['B', 'B'], Fire: ['fi', 'fi'] }, "Wildfire Fox");

// 2. Fire and Ice: AABB + pp + fifi
test({ A: ['A', 'A'], B: ['B', 'B'], P: ['p', 'p'], Fire: ['fi', 'fi'] }, "Fire and Ice Fox");

// 3. Snow Glow: AABB + pp + gg + fifi
test({ A: ['A', 'A'], B: ['B', 'B'], P: ['p', 'p'], G: ['g', 'g'], Fire: ['fi', 'fi'] }, "Snow Glow Fox");

// 4. Golden Sunrise: AABb + fifi
test({ A: ['A', 'A'], B: ['B', 'b'], Fire: ['fi', 'fi'] }, "Golden Sunrise Fox");

// 5. Fire and Ice (Gold base): AABb + pp + fifi
test({ A: ['A', 'A'], B: ['B', 'b'], P: ['p', 'p'], Fire: ['fi', 'fi'] }, "Fire and Ice Fox");

// 6. Autumn Fire: AABb + pp + gg + fifi
test({ A: ['A', 'A'], B: ['B', 'b'], P: ['p', 'p'], G: ['g', 'g'], Fire: ['fi', 'fi'] }, "Autumn Fire Fox");

// 7. Fire Cross: AaBB + fifi
test({ A: ['A', 'a'], B: ['B', 'B'], Fire: ['fi', 'fi'] }, "Fire Cross Fox");

// 8. Moon Glow: AaBB + pp + fifi
test({ A: ['A', 'a'], B: ['B', 'B'], P: ['p', 'p'], Fire: ['fi', 'fi'] }, "Moon Glow Fox");

// 9. Autumn Fire (Cross base): AaBB + pp + gg + fifi
test({ A: ['A', 'a'], B: ['B', 'B'], P: ['p', 'p'], G: ['g', 'g'], Fire: ['fi', 'fi'] }, "Autumn Fire Fox");

// 10. Colicott: aaBB + fifi
test({ A: ['a', 'a'], B: ['B', 'B'], Fire: ['fi', 'fi'] }, "Colicott Fox");

// 11. Colicott (aabb): aabb + fifi
test({ A: ['a', 'a'], B: ['b', 'b'], Fire: ['fi', 'fi'] }, "Colicott Fox");

// 12. Fawn Glow: aabb + pp + fifi
test({ A: ['a', 'a'], B: ['b', 'b'], P: ['p', 'p'], Fire: ['fi', 'fi'] }, "Fawn Glow Fox");

// 13. Cinnamon Fire: AAbb + gg + fifi
test({ A: ['A', 'A'], B: ['b', 'b'], G: ['g', 'g'], Fire: ['fi', 'fi'] }, "Cinnamon Fire Fox");

console.log("\nTesting Masking Rules...");

// 14. Red Fox masks Burgundy
test({ A: ['A', 'A'], B: ['B', 'B'], G: ['g', 'g'] }, "Red Fox");

// 15. Red Fox masks Pearl
test({ A: ['A', 'A'], B: ['B', 'B'], P: ['p', 'p'] }, "Red Fox");

// 16. Red Fox masks Mansfield Pearl
test({ A: ['A', 'A'], B: ['B', 'B'], SS: ['s', 's'] }, "Red Fox");

// 17. Gold Fox DOES NOT mask Burgundy (becomes Burgundy Gold)
test({ A: ['A', 'A'], B: ['B', 'b'], G: ['g', 'g'] }, "Burgundy Gold Fox");

console.log("\nTesting Eye Colors...");

// 18. Pearl Amber has Green eyes
test({ G: ['g', 'g'], P: ['p', 'p'], SS: ['s', 's'] }, "Pearl Amber Fox", "Green");

// 19. Pearl Amber + fifi (Fire masked by ss) -> still Pearl Amber with Green eyes
test({ G: ['g', 'g'], P: ['p', 'p'], SS: ['s', 's'], Fire: ['fi', 'fi'] }, "Pearl Amber Fox", "Green");

console.log("\nALL PRECISE GENETICS TESTS PASSED!");
