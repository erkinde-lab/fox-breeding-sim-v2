import sys
import os

path = 'src/lib/store.ts'
content = open(path).read()

# 1. Update adminSpawnFox to pass ID
content = content.replace(
    'const fox = createFox({ name, gender, genotype });',
    'const nextId = (get().nextFoxId || 1).toString().padStart(7, "0");\n        const fox = createFox({ name, gender, genotype }, Math.random, nextId);'
)

# 2. Increment nextFoxId in adminSpawnFox
content = content.replace(
    'set((state) => ({ foxes: { ...state.foxes, [fox.id]: fox } }));',
    'set((state) => ({ \n          foxes: { ...state.foxes, [fox.id]: fox },\n          nextFoxId: (state.nextFoxId || 1) + 1\n        }));'
)

# 3. Update repopulateFoundationFoxes to use startId
# This is tricky, let's just make createFoundationFoxCollection accept startId first
# Done in genetics (oops, not yet).

with open(path, 'w') as f:
    f.write(content)

# Update genetics functions to support ID passing
path_gen = 'src/lib/genetics.ts'
content_gen = open(path_gen).read()

content_gen = content_gen.replace(
    'export function createFoundationFoxCollection(random: () => number = Math.random): Fox[] {',
    'export function createFoundationFoxCollection(random: () => number = Math.random, startId?: number): Fox[] {'
)

content_gen = content_gen.replace(
    'const safeRandom = typeof window !== \'undefined\' ? random : () => 0.5;',
    'const safeRandom = typeof window !== \'undefined\' ? random : () => 0.5;\n  let currentId = startId || 1;'
)

# Replace the calls inside createFoundationFoxCollection
# This needs to be done carefully.
content_gen = content_gen.replace(
    'foxes.push(createFoundationalFoxWithGenotype(redBaseGenotype, safeRandom, redFoxGender));',
    'foxes.push(createFoundationalFoxWithGenotype(redBaseGenotype, safeRandom, redFoxGender, (currentId++).toString().padStart(7, "0")));'
)
content_gen = content_gen.replace(
    'foxes.push(createFoundationalFoxWithGenotype(goldBaseGenotype, safeRandom, goldFoxGender));',
    'foxes.push(createFoundationalFoxWithGenotype(goldBaseGenotype, safeRandom, goldFoxGender, (currentId++).toString().padStart(7, "0")));'
)
content_gen = content_gen.replace(
    'foxes.push(createFoundationalFoxWithGenotype(crossGenotype, safeRandom, crossFoxGender));',
    'foxes.push(createFoundationalFoxWithGenotype(crossGenotype, safeRandom, crossFoxGender, (currentId++).toString().padStart(7, "0")));'
)

# Update the helper signature
content_gen = content_gen.replace(
    'function createFoundationalFoxWithGenotype(baseGenotype: Record<string, [string, string]>, random: () => number, gender?: "Dog" | "Vixen"): Fox {',
    'function createFoundationalFoxWithGenotype(baseGenotype: Record<string, [string, string]>, random: () => number, gender?: "Dog" | "Vixen", forcedId?: string): Fox {'
)

# Update the call inside the helper
content_gen = content_gen.replace(
    'gender,',
    'gender,\n  }, random, forcedId);'
)
# This might double up, let's be careful.
# Actually, I'll just rewrite the helper function.

with open(path_gen, 'w') as f:
    f.write(content_gen)
