import os
import re

def fix_admin():
    path = 'src/app/admin/page.tsx'
    if not os.path.exists(path): return
    content = open(path).read()
    # Correct invalid JSX: <AlertTriangle, CheckCircle ... />
    content = content.replace('<AlertTriangle, CheckCircle', '<AlertTriangle')
    # Also fix imports if they were joined
    content = content.replace('AlertTriangle, CheckCircle', 'AlertTriangle, CheckCircle') # Wait, they are likely separated by newline in imports
    with open(path, 'w') as f:
        f.write(content)

def fix_entities():
    files = ['src/app/tos/page.tsx', 'src/app/privacy/page.tsx', 'src/app/admin/page.tsx']
    for path in files:
        if not os.path.exists(path): continue
        content = open(path).read()
        # Find unescaped quotes outside of tags
        # This is a bit hard with regex, let's just fix the specific ones from the logs
        # or use a simple replacement for common text patterns

        # Specific known issues from previous logs:
        if 'tos' in path:
            content = content.replace('("multi-accounting")', '(&quot;multi-accounting&quot;)')
            content = content.replace('("Real Money Trading")', '(&quot;Real Money Trading&quot;)')
            content = content.replace('("scrapers")', '(&quot;scrapers&quot;)')
            content = content.replace('("rehomed")', '(&quot;rehomed&quot;)')

        if 'privacy' in path:
            content = content.replace(' "local storage" ', ' &quot;local storage&quot; ')

        with open(path, 'w') as f:
            f.write(content)

def fix_genetics_basic():
    path = 'src/lib/genetics.ts'
    if not os.path.exists(path): return
    content = open(path).read()
    content = content.replace('let eyePoolName', 'const eyePoolName')
    with open(path, 'w') as f:
        f.write(content)

def fix_circular():
    # Refactor createFox to avoid require
    path = 'src/lib/genetics.ts'
    content = open(path).read()

    # We need to change the function signature to accept foxId optionally
    old_sig = 'export function createFox(data: Partial<Fox>, random: () => number = Math.random): Fox {'
    new_sig = 'export function createFox(data: Partial<Fox>, random: () => number = Math.random, forcedId?: string): Fox {'
    content = content.replace(old_sig, new_sig)

    # Replace the block that uses require
    pattern = r'let foxId: string;.*?if \(typeof window !== \'undefined\'\) {.*?require\(\'../lib/store\'\);.*?foxId = Date.now\(\).toString\(\);.*?\n  }'
    # This is complex, let's just replace the whole logic inside createFox

    replacement = """  const genotype = data.genotype || getInitialGenotype();
  const silverIntensity = data.silverIntensity || 3;
  const phenotype = getPhenotype(genotype, silverIntensity, data.eyeColor);

  return {
    id: forcedId || data.id || Date.now().toString(),
    name: data.name || 'Unnamed Fox',
    gender: data.gender || (random() > 0.5 ? 'Dog' : 'Vixen'),
    genotype,
    phenotype: phenotype.name,
    baseColor: phenotype.baseColor || "Red",
    pattern: phenotype.pattern || "Solid",
    eyeColor: phenotype.eyeColor,
    silverIntensity,
    age: 0,
    stats: data.stats || {
      head: 10,
      topline: 10,
      forequarters: 10,
      hindquarters: 10,
      tail: 10,
      coatQuality: 10,
      temperament: 10,
      presence: 10,
      luck: 10,
      fertility: 10
    },
    genotypeRevealed: false,
    pedigreeAnalyzed: false,
    isRetired: false,
    hasBeenRenamed: false,
    healthIssues: [],
    pointsYear: 0,
    pointsLifetime: 0,
    parents: [null, null],
    parentNames: [null, null],
    birthYear: 0,
    coi: 0,
    isAtStud: false,
    studFee: 0,
    ownerId: data.ownerId || 'system',
    lastFed: Date.now(),
    boosts: {},
    history: data.history || [{
      date: new Date().toISOString(),
      event: 'Born',
      details: 'Foundation fox created'
    }],
    ...data
  };
}"""

    # Surgical replacement of the function body
    start_marker = 'export function createFox(data: Partial<Fox>, random: () => number = Math.random, forcedId?: string): Fox {\n'
    end_marker = '}\n\nexport function createFoundationalFox'

    parts = content.split(start_marker)
    if len(parts) > 1:
        rest = parts[1].split(end_marker)
        if len(rest) > 1:
            content = parts[0] + start_marker + replacement + '\n\nexport function createFoundationalFox' + rest[1]

    with open(path, 'w') as f:
        f.write(content)

fix_admin()
fix_entities()
fix_genetics_basic()
fix_circular()
print("Applied initial clean fixes")
