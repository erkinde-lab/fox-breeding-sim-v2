import re

def fix_file(path, new_path, test_name):
    with open(path, 'r') as f:
        content = f.read()

    # Standardize imports for playwright
    content = content.replace(".ts'", "'")

    # Wrap assertions/logic in playwright test if not already
    if 'test(' not in content:
        content = "import { test, expect } from '@playwright/test';\n" + content
        content += f"\ntest('{test_name}', async () => {{ \n // Logic executed on import or below \n }});"

    with open(new_path, 'w') as f:
        f.write(content)

fix_file('tests/logic_smoke_test_script.ts', 'tests/logic_smoke.spec.ts', 'Logic Smoke Test')
fix_file('tests/show_hierarchy.test.ts', 'tests/show_hierarchy.spec.ts', 'Show Hierarchy Test')
