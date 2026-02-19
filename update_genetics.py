import sys

with open('src/lib/genetics.ts', 'r') as f:
    content = f.read()

search_text = """  if (finalName) {
    // Already set
  } else if (canExpressFire) {
    // Specific Snow Glow / Cinnamon Fire overrides per request
    if (baseColorName === 'Standard Silver' && hasG) {
        finalName = 'Cinnamon Fire';
    } else if ((isRedGoldBase && (hasP || hasG)) || (baseColorName === 'Alaskan Silver' && hasG)) {
        finalName = 'Snow Glow';
    }
    // Standard fire expressions
    else if (isRedGoldBase) {
      if (baseColorName === 'Red') finalName = 'Wildfire';
      else finalName = 'Golden Sunrise';
    } else if (isCrossBase) {
      if (isAmber) finalName = 'Snow Glow';
      else if (hasP) finalName = 'Moon Glow';
      else finalName = 'Fire Cross';
    } else if (isSilverExpressingBase) {
      if (isAmber) finalName = 'Champagne';
      else if (hasP) finalName = 'Fawn Glow';
      else finalName = 'Colicott';
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

    // Masking for Red Foxes: Burgundy, Pearl, Mansfield Pearl are masked on Red
    if (baseColorName === 'Red' && (finalName === 'Burgundy' || finalName === 'Pearl' || finalName === 'Mansfield Pearl')) {
        finalName = ''; // Masked, will use base color
    }

    if (finalName && isRedGoldBase) {
      finalName = `{finalName} {baseColorName}`;
    }
  }"""

# Fix the curly braces in the python f-string/template
search_text = search_text.replace("", "")

replace_text = """  if (finalName) {
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
      finalName = ;
    }
  }"""

if search_text in content:
    new_content = content.replace(search_text, replace_text)
    with open('src/lib/genetics.ts', 'w') as f:
        f.write(new_content)
    print("Successfully updated src/lib/genetics.ts")
else:
    print("Could not find search_text in src/lib/genetics.ts")
    # Debug: print a portion of the content to see what's wrong
    start = content.find("if (finalName) {")
    if start != -1:
        print("Found start at:", start)
        print("Snippet:", content[start:start+200])
