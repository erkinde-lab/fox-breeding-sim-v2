import re

with open('src/lib/genetics.ts', 'r') as f:
    content = f.read()

pattern = r'if \(finalName\) \{\s+// Already set\s+\} else if \(canExpressFire\) \{.*?\}\s+// Handle named recessives if no special name assigned\s+if \(!finalName\) \{.*?if \(finalName && isRedGoldBase\) \{.*?\}\s+\}'

replacement = """if (finalName) {
    // Already set
  } else if (canExpressFire) {
    // Fire Factor nomenclature according to spreadsheet/memory
    if (baseColorName === 'Red') {
        if (hasP && hasG) finalName = 'Snow Glow';
        else if (hasP) finalName = 'Fire and Ice';
        else finalName = 'Wildfire';
    } else if (baseColorName === 'Gold') {
        if (hasP && hasG) finalName = 'Autumn Fire';
        else if (hasP) finalName = 'Fire and Ice';
        else finalName = 'Golden Sunrise';
    } else if (isCrossBase) {
        if (hasP && hasG) finalName = 'Autumn Fire';
        else if (hasP) finalName = 'Moon Glow';
        else finalName = 'Fire Cross';
    } else if (baseColorName === 'Alaskan Silver') {
        finalName = 'Colicott';
    } else if (baseColorName === 'Standard Silver') {
        if (aCount === 2) { // aabb
            if (hasP) finalName = 'Fawn Glow';
            else finalName = 'Colicott';
        } else { // AAbb or Aabb
            if (hasG) finalName = 'Cinnamon Fire';
        }
    }
  }

  // Handle named recessives if no special name assigned
  if (!finalName) {
    if (isPearlAmber) {
      finalName = 'Pearl Amber';
      eyeColor = 'Green';
    } else if (isAmber) {
      finalName = 'Amber';
    } else if (isSapphire) {
      finalName = 'Sapphire';
    } else if (isBurgundy) {
      finalName = 'Burgundy';
    } else if (isPearl) {
      finalName = 'Pearl';
    } else if (isMansfieldPearl) {
      finalName = 'Mansfield Pearl';
    }

    // Masking logic: Burgundy, Pearl, Mansfield Pearl are masked on Red base
    if (baseColorName === 'Red' && (finalName === 'Burgundy' || finalName === 'Pearl' || finalName === 'Mansfield Pearl')) {
        finalName = ''; // Masked, fall back to base name
    }

    if (finalName && isRedGoldBase) {
      finalName = `${finalName} ${baseColorName}`;
    }
  }"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

if new_content != content:
    with open('src/lib/genetics.ts', 'w') as f:
        f.write(new_content)
    print("Successfully updated src/lib/genetics.ts")
else:
    print("Pattern not found!")
