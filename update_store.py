import re

with open('src/lib/store.ts', 'r') as f:
    content = f.read()

# 1. Define Role and Report interfaces
role_def = """
export type Role = "player" | "moderator" | "administrator";

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetType: "member" | "post" | "reply";
  reason: string;
  content?: string; // Content of the reported post/reply
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
}
"""

if 'export type Role' not in content:
    content = re.sub(r'(export interface ForumReply \{)', role_def + r'\n\1', content)

# 2. Update Member interface
content = re.sub(
    r'(export interface Member \{.*?)(\})',
    r'\1  role: Role;\n  ipHistory: string[];\n\2',
    content,
    flags=re.DOTALL
)

# 3. Update ForumPost interface
content = re.sub(
    r'(export interface ForumPost \{.*?)(\})',
    r'\1  isLocked?: boolean;\n\2',
    content,
    flags=re.DOTALL
)

# 4. Update GameState with new state and actions
state_additions = """
  currentMemberId: string;
  reports: Report[];
  setCurrentMemberId: (id: string) => void;
  updateMemberRole: (memberId: string, role: Role) => void;
  addReport: (report: Omit<Report, "id" | "status" | "createdAt">) => void;
  resolveReport: (reportId: string, action: "resolved" | "dismissed") => void;
  lockForumPost: (postId: string) => void;
"""

# Find where GameState interface ends
content = re.sub(
    r'(interface GameState \{.*?)(\})',
    r'\1' + state_additions + r'\2',
    content,
    flags=re.DOTALL
)

# 5. Update initial state in useGameStore
initial_state_additions = """
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

# Insert into the useGameStore implementation
content = re.sub(
    r'(showVisibilityMode: "midweek",)',
    r'\1' + initial_state_additions,
    content
)

# 6. Update initializeGame and resetGame to include roles and ipHistory
# Update members in resetGame
content = re.sub(
    r'members: \[.*?id: "player-0".*?\},.*?id: "player-1".*?\},.*?\]',
    r'''members: [
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
          ]''',
    content,
    flags=re.DOTALL
)

# Update members in initializeGame
content = re.sub(
    r'members: \[.*?id: "player-1".*?\},.*?\]',
    r'''members: [
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
            ]''',
    content,
    flags=re.DOTALL
)

# 7. Update store version and migration
content = re.sub(r'version: 7', 'version: 8', content)
content = re.sub(
    r'(if \(version < 7\) \{.*?state\.forumPosts \?\? \[\],.*?\}\n)',
    r'\1        if (version < 8) {\n          state = {\n            ...state,\n            currentMemberId: state.currentMemberId ?? "player-1",\n            reports: state.reports ?? [],\n            members: (state.members || []).map(m => ({\n              ...m,\n              role: m.role ?? "player",\n              ipHistory: m.ipHistory ?? ["192.168.1.1"],\n            })),\n          };\n        }\n',
    content,
    flags=re.DOTALL
)

with open('src/lib/store.ts', 'w') as f:
    f.write(content)
