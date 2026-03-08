import re

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()

    # Use standard imports without extension for playwright
    content = content.replace("from '../src/lib/genetics.ts'", "from '../src/lib/genetics'")
    content = content.replace("from '../src/lib/showing.ts'", "from '../src/lib/showing'")

    # Wrap in playwright test if not already
    if 'import { test' not in content:
        content = "import { test, expect } from '@playwright/test';\n" + content
        content = content.replace('if (failed > 0)', 'test("Logic Regression", async () => {\nif (failed > 0)')
        content += "\n});"

    with open(path, 'w') as f:
        f.write(content)

fix_file('tests/phenotype_test.ts')
