import re

with open('src/lib/store.ts', 'r') as f:
    content = f.read()

# Fix GameState interface
# Remove the messed up part in adminSetCurrency
content = re.sub(
    r'adminSetCurrency: \(updates: \{ gold\?: number; gems\?: number \n  currentMemberId: string;.*?\}\) => void;',
    r'adminSetCurrency: (updates: { gold?: number; gems?: number }) => void;\n  currentMemberId: string;\n  reports: Report[];\n  setCurrentMemberId: (id: string) => void;\n  updateMemberRole: (memberId: string, role: Role) => void;\n  addReport: (report: Omit<Report, "id" | "status" | "createdAt">) => void;\n  resolveReport: (reportId: string, action: "resolved" | "dismissed") => void;\n  lockForumPost: (postId: string) => void;',
    content,
    flags=re.DOTALL
)

# Fix useGameStore initial state and actions
# It seems showVisibilityMode: "midweek" was replaced and initial_state_additions was inserted but mangled members list.
# I will just define the whole (set, get) body to be safe, or at least the part that got messed up.

# Let's fix the members list and missing actions first.
# Finding the members list in useGameStore
new_actions = """
      currentMemberId: "player-1",
      reports: [],
      setCurrentMemberId: (id) => set({ currentMemberId: id }),
      updateMemberRole: (memberId, role) => set((state) => ({
        members: state.members.map(m => m.id === memberId ? { ...m, role } : m)
      })),
      addReport: (reportData) => set((state) => ({
        reports: [
          ...state.reports,
          {
            ...reportData,
            id: Math.random().toString(36).substr(2, 9),
            status: "pending",
            createdAt: new Date().toISOString(),
          }
        ]
      })),
      resolveReport: (reportId, status) => set((state) => ({
        reports: state.reports.map(r => r.id === reportId ? { ...r, status } : r)
      })),
      lockForumPost: (postId) => set((state) => ({
        forumPosts: state.forumPosts.map(p => p.id === postId ? { ...p, isLocked: !p.isLocked } : p)
      })),
"""

if 'setCurrentMemberId: (id) => set({ currentMemberId: id })' not in content:
    content = re.sub(
        r'(showVisibilityMode: "midweek",)',
        r'\1' + new_actions,
        content
    )

# Fix the initializeGame function which seems to have been eaten
initialize_game_fix = """
      initializeGame: () => {
        const { foxes } = get();
        if (Object.keys(foxes).length === 0) {
          set({
            gold: 10000,
            gems: 100,
            foxes: {},
            members: [
              {
                id: "player-1",
                name: "Angmar",
                level: 1,
                joined: new Date().toISOString().split("T")[0],
                points: 0,
                avatarColor: "bg-fire-500",
                isBanned: false,
                warnings: [],
                role: "administrator",
                ipHistory: ["192.168.1.1"],
              },
            ],
          });
        }
      },
"""

# Find where initializeGame was supposed to be (between spayNeuterFox and setBannerUrl)
if 'initializeGame: () => {' not in content:
    content = re.sub(
        r'(spayNeuterFox: \(id\) =>.*?set\(.*?\}\n        \}\),)',
        r'\1\n' + initialize_game_fix,
        content,
        flags=re.DOTALL
    )

# Fix resetGame which also seems to have been eaten or mangled
reset_game_fix = """
      resetGame: () => {
        // Generate initial NPC studs and foundation foxes as owned foxes
        const initialFoxes: Record<string, Fox> = {};

        // Generate NPC studs
        const npcStuds = generateNPCStuds(1, "Spring");
        Object.values(npcStuds).forEach((stud) => {
          const foxId = (Object.keys(initialFoxes).length + 1).toString().padStart(7, '0');
          initialFoxes[foxId] = { ...stud, id: foxId, ownerId: "player-0", isFoundation: false };
        });

        // Generate foundation foxes
        const foundationFoxes = createFoundationFoxCollection();
        foundationFoxes.forEach((fox) => {
          const foxId = (Object.keys(initialFoxes).length + 1).toString().padStart(7, '0');
          initialFoxes[foxId] = { ...fox, id: foxId, ownerId: "player-0", isFoundation: true };
        });

        set(() => ({
          // Reset to initial game state
          season: "Spring" as const,
          year: 1,
          gold: 10000,
          gems: 100,
          foxes: initialFoxes,
          nextFoxId: Object.keys(initialFoxes).length + 1,
          kennelCapacity: 10,
          inventory: {
            "gene_test": 1,
            "grooming-kit": 1,
            "training-session": 1,
            "supplies": 10,
          },
          pregnancyList: [],
          whelpingReports: [],
          shows: [],
          showReports: [],
          showVisibilityMode: "midweek" as const,
          soldFoundationalSlots: [],
          lastAdoptionReset: new Date().toISOString(),
          members: [
            {
              id: "player-0",
              name: "Game System",
              level: 0,
              joined: "2026-02-15",
              points: 0,
              avatarColor: "bg-gray-500",
              isBanned: false,
              warnings: [],
              role: "administrator",
              ipHistory: ["127.0.0.1"],
            },
            {
              id: "player-1",
              name: "Angmar",
              level: 10,
              joined: "2026-02-15",
              points: 1500,
              avatarColor: "bg-fire-500",
              isBanned: false,
              warnings: [],
              role: "administrator",
              ipHistory: ["192.168.1.1"],
            },
          ],
          adminLogs: [],
          isAdmin: false,
          hasSeenTutorial: false,
          tutorialStep: 0,
          colorblindMode: "none" as const,
          highContrast: false,
          fontSize: "normal" as const,
          useOpenDyslexic: false,
          reducedMotion: false,
          alwaysUnderlineLinks: false,
          highVisibilityFocus: false,
          simplifiedUI: false,
          textSpacing: "normal" as const,
          broadcast: null,
          news: [
            {
              id: "1",
              date: "February 20, 2026",
              title: "Marketplace Beta Launch",
              content: "The player-to-player marketplace is now live! You can now list your foxes and items for sale in exchange for Gold or Gems.",
              category: "Update",
            },
          ],
          showConfig: {
            Pro: { bis: 2000, rbis: 800, bov: 1000, rbov: 500, bos: 600, rbos: 300, boc: 400, rboc: 200 },
            Amateur: { bis: 1000, rbis: 400, bov: 500, rbov: 250, bos: 300, rbos: 150, boc: 200, rboc: 100 },
            Altered: { bis: 1500, rbis: 600, bov: 750, rbov: 375, bos: 450, rbos: 225, boc: 300, rboc: 150 },
          },
          marketListings: [],
          unlockedAchievements: [],
          hiredGroomer: false,
          hiredVeterinarian: false,
          hiredTrainer: false,
          hiredGeneticist: false,
          hiredNutritionist: false,
          bannerUrl: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=2070&auto=format&fit=crop",
          bannerXPosition: "50%",
          bannerYPosition: "50%",
          isDarkMode: false,
          currentMemberId: "player-1",
          reports: [],
        }));

        // Generate initial shows after state is set
        setTimeout(() => {
          get().generateSeasonalShows();
        }, 0);
      },
"""

# Find where resetGame was (between toggleDarkMode and repopulateFoundationFoxes)
if 'resetGame: () => {' not in content:
    content = re.sub(
        r'(toggleDarkMode: \(\) =>.*?set\(.*?\}\n        \}\),)',
        r'\1\n' + reset_game_fix,
        content,
        flags=re.DOTALL
    )

with open('src/lib/store.ts', 'w') as f:
    f.write(content)
