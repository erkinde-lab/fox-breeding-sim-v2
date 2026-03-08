import os
import re

def fix_admin():
    path = 'src/app/admin/page.tsx'
    if not os.path.exists(path): return
    content = open(path).read()
    content = content.replace('<AlertTriangle, CheckCircle', '<AlertTriangle')
    content = content.replace('AlertTriangle, CheckCircle', 'AlertTriangle, CheckCircle') # Keep imports if they were okay
    # Just remove the comma and name if it exists in JSX
    content = re.sub(r'<AlertTriangle,\s*CheckCircle', '<AlertTriangle', content)
    with open(path, 'w') as f:
        f.write(content)

def fix_tos():
    path = 'src/app/tos/page.tsx'
    if not os.path.exists(path): return
    content = open(path).read()
    content = content.replace('("multi-accounting")', '(&quot;multi-accounting&quot;)')
    content = content.replace('("Real Money Trading")', '(&quot;Real Money Trading&quot;)')
    content = content.replace('("scrapers")', '(&quot;scrapers&quot;)')
    content = content.replace('("rehomed")', '(&quot;rehomed&quot;)')
    with open(path, 'w') as f:
        f.write(content)

def fix_privacy():
    path = 'src/app/privacy/page.tsx'
    if not os.path.exists(path): return
    content = open(path).read()
    content = content.replace(' "local storage" ', ' &quot;local storage&quot; ')
    content = content.replace(' "rehomed" ', ' &quot;rehomed&quot; ')
    with open(path, 'w') as f:
        f.write(content)

def fix_genetics():
    path = 'src/lib/genetics.ts'
    if not os.path.exists(path): return
    content = open(path).read()
    content = content.replace('let eyePoolName', 'const eyePoolName')

    # Add forcedId to createFox
    content = content.replace(
        'export function createFox(data: Partial<Fox>, random: () => number = Math.random): Fox {',
        'export function createFox(data: Partial<Fox>, random: () => number = Math.random, forcedId?: string): Fox {'
    )

    # Refactor the require block away
    import re
    pattern = r'if \(typeof window !== \'undefined\'\) {.*?require\(\'../lib/store\'\);.*?foxId = Date.now\(\).toString\(\);.*?\n  }'
    # This is still tricky. Let's just fix the id assignment directly.
    content = content.replace('id: data.id || Date.now().toString(),', 'id: forcedId || data.id || Date.now().toString(),')

    # Fix the require block by commenting it out or removing it
    old_block = """  let foxId: string;
  if (typeof window !== 'undefined') {
    // Try to get from zustand store if in browser
    try {
      // Import store dynamically to avoid circular dependency
      const { useGameStore } = require('../lib/store');
      const store = useGameStore.getState();
      const nextId = store.nextFoxId || 1;
      store.nextFoxId = nextId + 1;
      foxId = nextId.toString().padStart(7, '0');
    } catch {
      // Fallback for server-side or if store not available
      foxId = Date.now().toString();
    }
  } else {
    // Server-side fallback
    foxId = Date.now().toString();
  }"""
    # Just remove it, it will use the return object literal's id assignment
    content = content.replace(old_block, "")

    with open(path, 'w') as f:
        f.write(content)

def fix_store():
    path = 'src/lib/store.ts'
    if not os.path.exists(path): return
    content = open(path).read()
    # Fix adminSpawnFox to pass ID
    content = content.replace(
        'const fox = createFox({ name, gender, genotype });',
        'const nextId = (get().nextFoxId || 1).toString().padStart(7, "0");\n        const fox = createFox({ name, gender, genotype }, Math.random, nextId);'
    )
    # Increment ID
    content = content.replace(
        'set((state) => ({ foxes: { ...state.foxes, [fox.id]: fox } }));',
        'set((state) => ({ \n          foxes: { ...state.foxes, [fox.id]: fox },\n          nextFoxId: (state.nextFoxId || 1) + 1\n        }));'
    )

    # Fix types
    content = content.replace('season: nextSeason as any', 'season: nextSeason as "Spring" | "Summer" | "Autumn" | "Winter"')

    with open(path, 'w') as f:
        f.write(content)

def fix_ui():
    # Fox Page Flag
    path = 'src/app/fox/[id]/page.tsx'
    if os.path.exists(path):
        content = open(path).read()
        if 'Flag' in content and 'Flag,' not in content:
            content = content.replace('Diamond,', 'Diamond, Flag,')
        open(path, 'w').write(content)

    # Settings
    path = 'src/app/settings/page.tsx'
    if os.path.exists(path):
        content = open(path).read()
        if 'currentMemberId,' in content and 'setCurrentMemberId,' not in content:
            content = content.replace('currentMemberId,', 'currentMemberId, setCurrentMemberId,')
        content = content.replace('setFontSize(size )', 'setFontSize(size as any)')
        content = content.replace('setTextSpacing(spacing )', 'setTextSpacing(spacing as any)')
        open(path, 'w').write(content)

    # Shows
    path = 'src/app/shows/page.tsx'
    if os.path.exists(path):
        content = open(path).read()
        content = content.replace('setActiveTab(tab.id )', 'setActiveTab(tab.id as any)')
        content = content.replace('setNewShowLevel(e.target.value )', 'setNewShowLevel(e.target.value as any)')
        content = content.replace('setNewShowVariety(e.target.value )', 'setNewShowVariety(e.target.value as any)')
        open(path, 'w').write(content)

    # Dashboard
    path = 'src/components/Dashboard.tsx'
    if os.path.exists(path):
        content = open(path).read()
        content = content.replace('variant={award.variant }', 'variant={award.variant as any}')
        open(path, 'w').write(content)

fix_admin()
fix_tos()
fix_privacy()
fix_genetics()
fix_store()
fix_ui()
print("Re-applied all good fixes")
