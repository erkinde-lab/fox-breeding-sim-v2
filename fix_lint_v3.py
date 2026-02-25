import re
import os

def fix_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)

# Fix src/app/admin/page.tsx any type
fix_file('src/app/admin/page.tsx', [
    ('setModStats(stats as any)', 'setModStats(stats as Stats)')
])

# Remove some unused imports in layout-client.tsx
fix_file('src/app/layout-client.tsx', [
    ('ShoppingCart, ', ''),
    ('Utensils, ', ''),
    ('LayoutDashboard', ''),
    ('import { Badge } from \'@/components/ui/badge\';', '')
])

# Remove unused Store in TutorialTour.tsx (Try again)
fix_file('src/components/TutorialTour.tsx', [
    ('ShieldCheck, Store', 'ShieldCheck')
])

# Remove unused imports in store.ts
fix_file('src/lib/store.ts', [
    ('calculateCOI, ', ''),
    ('getActiveBoosts, ', ''),
    ('LOCI, ', ''),
    ('getInitialGenotype, ', ''),
    ('runShow, ', '')
])
