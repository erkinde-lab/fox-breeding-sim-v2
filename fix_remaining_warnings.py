import re
import os

def fix_file_unused(path, patterns):
    if not os.path.exists(path):
        return
    with open(path, 'r') as f:
        content = f.read()
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)
    with open(path, 'w') as f:
        f.write(content)

# src/app/layout-client.tsx
fix_file_unused('src/app/layout-client.tsx', [
    (r'ShoppingCart,\s*', ''),
    (r'Utensils,\s*', '')
])

# src/components/TutorialTour.tsx
fix_file_unused('src/components/TutorialTour.tsx', [
    (r'Store,\s*', '')
])

# src/lib/store.ts
# Line 785: const { gold, year, ... } = get();
# Line 1048: const { foxes, ... } = state;
# Line 1482: set((state) => ({ ... })) -> state is unused
fix_file_unused('src/lib/store.ts', [
    (r'gold, year,\s*', ''),
    (r'foxes,\s*', ''),
    (r'\(state\) => \(', r'() => (')
])

# src/lib/showing.ts
# Line 66: const { hiredGroomer: hasGroomer, hiredTrainer: hasTrainer, ... } = ...
fix_file_unused('src/lib/showing.ts', [
    (r'hiredGroomer: hasGroomer,\s*', ''),
    (r'hiredTrainer: hasTrainer,\s*', '')
])
