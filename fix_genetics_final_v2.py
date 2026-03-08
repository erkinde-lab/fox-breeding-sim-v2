import sys
content = open('src/lib/genetics.ts').read()

# Fix createFoundationalFoxWithGenotype
new_helper = """function createFoundationalFoxWithGenotype(baseGenotype: Record<string, [string, string]>, random: () => number, gender?: "Dog" | "Vixen", forcedId?: string): Fox {
  const genotype = getInitialGenotype();
  Object.keys(baseGenotype).forEach(gene => {
    genotype[gene] = [...baseGenotype[gene]];
  });

  return createFox({
    genotype,
    coi: 0,
    pedigreeAnalyzed: true,
    gender,
  }, random, forcedId);
}"""

import re
pattern = r'function createFoundationalFoxWithGenotype\(.*?\n}'
content = re.sub(pattern, new_helper, content, flags=re.DOTALL)

with open('src/lib/genetics.ts', 'w') as f:
    f.write(content)
