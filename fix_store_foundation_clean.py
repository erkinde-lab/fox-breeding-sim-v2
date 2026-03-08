import sys
content = open('src/lib/store.ts').read()

old = """      repopulateFoundationFoxes: () => {
        const newFoundationFoxes = createFoundationFoxCollection();

        set((state) => {
          const updatedFoxes = { ...state.foxes };

          // Remove all existing foundation foxes
          Object.keys(updatedFoxes).forEach(foxId => {
            if (updatedFoxes[foxId].isFoundation) {
              delete updatedFoxes[foxId];
            }
          });

          // Add new foundation foxes with new IDs
          newFoundationFoxes.forEach((fox) => {
            const foxId = (state.nextFoxId || 1).toString().padStart(7, '0');
            updatedFoxes[foxId] = {
              ...fox,
              id: foxId,
              ownerId: "player-0",
              isFoundation: true
            };
            state.nextFoxId = (state.nextFoxId || 1) + 1;
          });

          return {
            foxes: updatedFoxes,
            nextFoxId: state.nextFoxId,
          };
        });
      },"""

new = """      repopulateFoundationFoxes: () => {
        set((state) => {
          const updatedFoxes = { ...state.foxes };
          const startId = state.nextFoxId || 1;
          const newFoundationFoxes = createFoundationFoxCollection(Math.random, startId);

          // Remove all existing foundation foxes
          Object.keys(updatedFoxes).forEach(foxId => {
            if (updatedFoxes[foxId].isFoundation) {
              delete updatedFoxes[foxId];
            }
          });

          // Add new foundation foxes
          newFoundationFoxes.forEach((fox) => {
            updatedFoxes[fox.id] = {
              ...fox,
              ownerId: "player-0",
              isFoundation: true
            };
          });

          return {
            foxes: updatedFoxes,
            nextFoxId: startId + newFoundationFoxes.length,
          };
        });
      },"""

content = content.replace(old, new)
with open('src/lib/store.ts', 'w') as f:
    f.write(content)
