import sys

with open('src/lib/store.ts', 'r') as f:
    content = f.read()

# Fix the broken addAdminLog calls
content = content.replace("get().addAdminLog('Set Currency', );", "get().addAdminLog('Set Currency', `Gold: ${gold}, Gems: ${gems}`);")
content = content.replace("get().addAdminLog('Update Fox Stats', );", "get().addAdminLog('Update Fox Stats', `Updated stats for fox ${foxes[foxId].name} (${foxId})`);")

with open('src/lib/store.ts', 'w') as f:
    f.write(content)
