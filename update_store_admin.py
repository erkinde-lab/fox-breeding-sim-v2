import sys

with open('src/lib/store.ts', 'r') as f:
    content = f.read()

# Add AdminLog interface
if 'export interface AdminLog' not in content:
    log_interface = """
export interface AdminLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}
"""
    content = content.replace('export interface WhelpingReport {', log_interface + '\nexport interface WhelpingReport {')

# Add adminLogs and actions to GameState
if 'adminLogs: AdminLog[];' not in content:
    content = content.replace('  members: Member[];', '  members: Member[];\n  adminLogs: AdminLog[];')

if 'adminUpdateFoxStats:' not in content:
    action_add = '  adminSpawnFox: (name: string, gender: "Male" | "Female", genotype: Genotype) => void;\n  adminUpdateFoxStats: (foxId: string, stats: Partial<Stats>) => void;'
    content = content.replace('  adminSpawnFox: (name: string, gender: "Male" | "Female", genotype: Genotype) => void;', action_add)

# Add implementation
if 'adminUpdateFoxStats: (foxId, statsUpdates)' not in content:
    impl_add = """
      addAdminLog: (action: string, details: string) => set((state) => ({
        adminLogs: [{ id: Math.random().toString(36).substring(2, 9), action, details, timestamp: new Date().toISOString() }, ...state.adminLogs].slice(0, 50)
      })),

      adminUpdateFoxStats: (foxId, statsUpdates) => {
        const { foxes } = get();
        if (!foxes[foxId]) return;
        set((state) => ({
          foxes: {
            ...state.foxes,
            [foxId]: {
              ...state.foxes[foxId],
              stats: { ...state.foxes[foxId].stats, ...statsUpdates }
            }
          }
        }));
        get().addAdminLog('Update Fox Stats', `Updated stats for fox ${foxes[foxId].name} (${foxId})`);
      },
"""
    content = content.replace('      toggleAdminMode: () => set((state) => ({ isAdmin: !state.isAdmin })),', impl_add + '\n      toggleAdminMode: () => set((state) => ({ isAdmin: !state.isAdmin })),')

# Initialize adminLogs
if 'adminLogs: [],' not in content:
    content = content.replace('      members: [],', '      members: [],\n      adminLogs: [],')

# Update existing admin actions to log
if 'get().addAdminLog(\'Set Currency\'' not in content:
    content = content.replace('adminSetCurrency: (gold, gems) => set({ gold, gems }),', """adminSetCurrency: (gold, gems) => {
        set({ gold, gems });
        get().addAdminLog('Set Currency', f'Gold: {gold}, Gems: {gems}');
      },""")
    # Wait, the f-string syntax in JS is `${gold}`
    content = content.replace("f'Gold: {gold}, Gems: {gems}'", "`${gold}, ${gems}`")

with open('src/lib/store.ts', 'w') as f:
    f.write(content)
