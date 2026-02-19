import re

with open('src/lib/genetics.ts', 'r') as f:
    content = f.read()

# Fix the base name appending logic
search_pattern = r'if \(finalName && isRedGoldBase\) \{\s+finalName = `$\{finalName\} $\{baseColorName\}`;\s+\}'
replacement = """if (finalName && isRedGoldBase && !['Pearl Amber', 'Sapphire', 'Amber'].includes(finalName)) {
      finalName = `${finalName} ${baseColorName}`;
    }"""

new_content = re.sub(search_pattern, replacement, content)

if new_content != content:
    with open('src/lib/genetics.ts', 'w') as f:
        f.write(new_content)
    print("Successfully updated src/lib/genetics.ts")
else:
    print("Pattern not found!")
