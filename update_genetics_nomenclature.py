import sys

with open('src/lib/genetics.ts', 'r') as f:
    content = f.read()

# Replace Silver-Marked with Cross
content = content.replace("'Silver-Marked'", "'Cross'")

# Handle redundancy logic in getPhenotype
# Find the part where Silver-Marked (now Cross) is pushed to colorModifiers
old_logic = """  } else if (S === 'Ss') {
    colorModifiers.push('Cross');
  }"""

new_logic = """  } else if (S === 'Ss') {
    if (!baseColorName.includes('Cross')) {
      colorModifiers.push('Cross');
    }
  }"""

content = content.replace(old_logic, new_logic)

with open('src/lib/genetics.ts', 'w') as f:
    f.write(content)
