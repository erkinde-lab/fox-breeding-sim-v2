import re

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()

    # Add ownerId and history to mockFox
    if 'mockFox' in content and 'ownerId' not in content:
        content = content.replace('lastFed: Date.now(),', 'lastFed: Date.now(),\n  ownerId: "player-1",\n  history: [],')

    # Fix runHierarchicalShow signature in show_hierarchy.test.ts
    # signature: (circuit: Circuit, entries: Competitor[], year: number, season: Season, vetBonus: boolean, judgeName?: string, showName?: string, region?: string)
    content = content.replace("runHierarchicalShow('Pro', competitors, 1, 'Spring')",
                              "runHierarchicalShow('Pro', competitors, 1, 'Spring', false)")

    with open(path, 'w') as f:
        f.write(content)

fix_file('tests/show_hierarchy.test.ts')
fix_file('tests/logic_smoke_test_script.ts')
fix_file('tests/phenotype_test.ts')
