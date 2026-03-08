import re

with open('src/lib/store.ts', 'r') as f:
    content = f.read()

# Fix retireFox: uses id parameter but attempts to use _id
content = re.sub(r'retireFox: \(id\) => set\(\(state\) => \(\{ foxes: { \.\.\.state\.foxes, \[\_id\]: { \.\.\.state\.foxes\[\_id\], isRetired: true } } \}\)\)',
                 r'retireFox: (id) => set((state) => ({ foxes: { ...state.foxes, [id]: { ...state.foxes[id], isRetired: true } } }))',
                 content)

# Fix updateFox: uses _id parameter
content = re.sub(r'updateFox: \(_id, updates\) => set\(\(state\) => \(\{ foxes: { \.\.\.state\.foxes, \[\_id\]: { \.\.\.state\.foxes\[\_id\], \.\.\.updates } } \}\)\)',
                 r'updateFox: (id, updates) => set((state) => ({ foxes: { ...state.foxes, [id]: { ...state.foxes[id], ...updates } } }))',
                 content)

with open('src/lib/store.ts', 'w') as f:
    f.write(content)
