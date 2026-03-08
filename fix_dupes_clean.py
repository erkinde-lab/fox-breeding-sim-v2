import os

path_settings = 'src/app/settings/page.tsx'
content = open(path_settings).read()
content = content.replace('currentMemberId, setCurrentMemberId,\n    setCurrentMemberId,', 'currentMemberId,\n    setCurrentMemberId,')
with open(path_settings, 'w') as f:
    f.write(content)

path_gen = 'src/lib/genetics.ts'
content = open(path_gen).read()
content = content.replace('  }, random, forcedId);\n  }, safeRandom);', '  }, random, forcedId);\n')
with open(path_gen, 'w') as f:
    f.write(content)
