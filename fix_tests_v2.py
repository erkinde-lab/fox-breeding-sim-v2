import re

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()

    # Add missing Fox properties if not present
    if 'mockFox' in content:
        if 'ownerId' not in content:
            content = content.replace('lastFed: Date.now(),', 'lastFed: Date.now(),\n  ownerId: "player-1",\n  history: [],')
        if 'lastFed' not in content:
            # Fallback for logic_smoke_test_script which has a very minimal mock
            pass

    # Fix runHierarchicalShow signature in show_hierarchy.test.ts
    content = content.replace("runHierarchicalShow('Pro', competitors, 1, 'Spring', false)",
                              "runHierarchicalShow('Pro', competitors, 1, 'Spring', false, 'Judge', 'Show', 'Region')")

    # Fix imports to include .ts extension for ts-node-esm compatibility
    content = content.replace("from '../src/lib/genetics'", "from '../src/lib/genetics.ts'")
    content = content.replace("from '../src/lib/showing'", "from '../src/lib/showing.ts'")

    with open(path, 'w') as f:
        f.write(content)

fix_file('tests/show_hierarchy.test.ts')
fix_file('tests/logic_smoke_test_script.ts')
fix_file('tests/phenotype_test.ts')
