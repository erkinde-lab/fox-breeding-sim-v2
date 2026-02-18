'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { LOCI, getInitialGenotype, getPhenotype, Stats } from '@/lib/genetics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, Trophy, Coins, Microscope, Settings, 
  AlertTriangle, Ban, Plus, Trash2, Save, 
  RefreshCw, FastForward, Heart, Info,
  Search, ShieldCheck, UserX, Activity, List,
  ArrowUp, ArrowDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const router = useRouter();
  const { 
    isAdmin, members, gold, gems, inventory, foxes, adminLogs,
    warnMember, banMember, adminSetCurrency, adminAddItem, 
    adminSpawnFox, adminUpdateFoxStats, runShows, advanceTime, toggleAdminMode 
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('members');
  const [searchMember, setSearchMember] = useState('');
  
  // Economy State
  const [editGold, setEditGold] = useState(gold);
  const [editGems, setEditGems] = useState(gems);
  const [addItemId, setAddItemId] = useState('supplies');
  const [addItemCount, setAddItemCount] = useState(1);

  // Genetics Lab State
  const [spawnGender, setSpawnGender] = useState<'Male' | 'Female'>('Male');
  const [spawnGenotype, setSpawnGenotype] = useState(getInitialGenotype());

  // Stat Modifier State
  const [selectedFoxId, setSelectedFoxId] = useState('');
  const [modStats, setModStats] = useState<Partial<Stats>>({});

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShieldCheck size={64} className="text-earth-200 mb-4" />
        <h1 className="text-2xl font-black text-slate-900">Access Restricted</h1>
        <p className="text-slate-500 mt-2 mb-6">You must be an administrator to view this page.</p>
        <Button onClick={() => router.push('/')}>Return Home</Button>
      </div>
    );
  }

  const handleUpdateGenotype = (locus: string, index: number, value: string) => {
    const next = { ...spawnGenotype };
    const alleles = [...next[locus]];
    alleles[index] = value;
    next[locus] = alleles as [string, string];
    setSpawnGenotype(next);
  };

  const handleSpawn = () => {
    const phenotypeName = getPhenotype(spawnGenotype).name;
    adminSpawnFox(phenotypeName, spawnGender, spawnGenotype);
    alert('Fox spawned successfully!');
  };

  const handleWarn = (id: string) => {
    const reason = prompt('Reason for warning:');
    if (reason) warnMember(id, reason);
  };

  const handleUpdateStats = () => {
    if (!selectedFoxId) return;
    adminUpdateFoxStats(selectedFoxId, modStats);
    alert('Stats updated!');
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings className="text-fire-600" size={36} /> Admin Panel
          </h1>
          <p className="text-slate-500 mt-2">Global kennel management and user moderation tools.</p>
        </div>
        <Button variant="ghost" onClick={toggleAdminMode} className="text-red-500 hover:text-red-600 hover:bg-red-50">
          Deactivate Admin Mode
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'members', label: 'Members', icon: Users },
          { id: 'shows', label: 'Shows', icon: Trophy },
          { id: 'economy', label: 'Economy', icon: Coins },
          { id: 'genetics', label: 'Genetics Lab', icon: Microscope },
          { id: 'logs', label: 'Activity Logs', icon: List },
          { id: 'system', label: 'System', icon: RefreshCw },
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 whitespace-nowrap rounded-xl"
          >
            <tab.icon size={18} /> {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'members' && (
        <Card className="folk-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Moderation</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-earth-200 rounded-lg text-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-earth-100">
                    <th className="pb-3 pl-2">User</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-center">Warnings</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-50">
                  {(members || []).filter(m => m.name.toLowerCase().includes(searchMember.toLowerCase())).map(member => (
                    <tr key={member.id} className="hover:bg-earth-50 transition-colors">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${member.avatarColor} flex items-center justify-center text-white text-xs`}>
                            {member.name[0]}
                          </div>
                          <div>
                            <div className="font-bold">{member.name}</div>
                            <div className="text-[10px] text-slate-400">ID: {member.id} • Joined {member.joined}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        {member.isBanned ? (
                          <Badge variant="destructive" className="text-[8px] uppercase">Banned</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-moss-100 text-moss-700 text-[8px] uppercase">Active</Badge>
                        )}
                      </td>
                      <td className="py-4 text-center font-mono">
                        {(member.warnings || []).length > 0 ? (
                          <span className="text-amber-600 font-bold">{member.warnings.length}</span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>
                      <td className="py-4 text-right pr-2">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-amber-500 hover:bg-amber-50"
                            onClick={() => handleWarn(member.id)}
                            title="Warn User"
                          >
                            <AlertTriangle size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`h-8 w-8 ${member.isBanned ? 'text-moss-500 hover:bg-moss-50' : 'text-red-500 hover:bg-red-50'}`}
                            onClick={() => banMember(member.id)}
                            title={member.isBanned ? 'Unban User' : 'Ban User'}
                          >
                            {member.isBanned ? <RefreshCw size={16} /> : <Ban size={16} />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'economy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="folk-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="text-yellow-600" size={18} /> Global Economy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Set User Gold</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editGold}
                    onChange={e => setEditGold(Number(e.target.value))}
                    className="flex-1 p-2 border border-earth-200 rounded-lg text-sm font-bold"
                  />
                  <Button onClick={() => adminSetCurrency(editGold, editGems)}>Apply</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Set User Gems</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editGems}
                    onChange={e => setEditGems(Number(e.target.value))}
                    className="flex-1 p-2 border border-earth-200 rounded-lg text-sm font-bold"
                  />
                  <Button onClick={() => adminSetCurrency(editGold, editGems)}>Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="folk-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="text-moss-600" size={18} /> Item Spawner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Select Item</label>
                <select
                  value={addItemId}
                  onChange={e => setAddItemId(e.target.value)}
                  className="w-full p-2 border border-earth-200 rounded-lg text-sm"
                >
                  <option value="supplies">Premium Feed</option>
                  <option value="genetic-test">Genetic Test</option>
                  <option value="pedigree-analysis">Pedigree Analysis</option>
                  <option value="calculator-access">Breeding Calculator</option>
                  <option value="show-ticket-junior">Junior Ticket</option>
                  <option value="show-ticket-open">Open Ticket</option>
                  <option value="show-ticket-senior">Senior Ticket</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Quantity</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={addItemCount}
                    onChange={e => setAddItemCount(Number(e.target.value))}
                    className="flex-1 p-2 border border-earth-200 rounded-lg text-sm font-bold"
                  />
                  <Button variant="outline" onClick={() => adminAddItem(addItemId, addItemCount)}>Spawn Items</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'shows' && (
        <Card className="folk-card">
          <CardHeader>
            <CardTitle>Competitive Circuit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-earth-50 rounded-xl border border-earth-100">
                <h4 className="font-bold text-slate-900 mb-2">Automated Cycle</h4>
                <p className="text-xs text-slate-500 mb-4">Triggers all current season shows based on your current foxes.</p>
                <Button className="w-full gap-2" onClick={runShows}>
                  <FastForward size={16} /> Force Season Shows
                </Button>
              </div>
              <div className="p-4 bg-earth-50 rounded-xl border border-earth-100">
                <h4 className="font-bold text-slate-900 mb-2">Manual Points</h4>
                <p className="text-xs text-slate-500 mb-4">Manually award points to all foxes in the kennel (+10 points).</p>
                <Button variant="outline" className="w-full gap-2" onClick={() => {
                  Object.keys(foxes).forEach(id => {
                    useGameStore.getState().updateFox(id, { pointsLifetime: foxes[id].pointsLifetime + 10 });
                  });
                  alert('Awarded points to all foxes!');
                }}>
                  <Save size={16} /> Award Global Points
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Show History</h4>
              <div className="space-y-2">
                {useGameStore.getState().showReports.slice(0, 5).map((report, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white border border-earth-100 rounded-lg text-sm shadow-sm">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{report.level}</Badge>
                      <span className="font-medium">Year {report.year}, {report.season}</span>
                    </div>
                    <div className="text-fire-600 font-bold">Winner: {report.bestInShowFoxId ? foxes[report.bestInShowFoxId]?.name : 'None'}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'genetics' && (
        <div className="space-y-6">
          <Card className="folk-card">
            <CardHeader>
              <CardTitle>Genetics Lab: Spawn Fox</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-earth-50 rounded-xl border border-earth-200">
                    <h5 className="text-sm font-bold mb-2">Predicted Outcome</h5>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">{getPhenotype(spawnGenotype).name}</div>
                      <Badge variant="outline">{getPhenotype(spawnGenotype).eyeColor} Eyes</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                    <div className="flex gap-2">
                      <Button 
                        variant={spawnGender === 'Male' ? 'default' : 'outline'}
                        onClick={() => setSpawnGender('Male')}
                        className="flex-1"
                      >Male</Button>
                      <Button 
                        variant={spawnGender === 'Female' ? 'default' : 'outline'}
                        onClick={() => setSpawnGender('Female')}
                        className="flex-1"
                      >Female</Button>
                    </div>
                  </div>
                  <Button onClick={handleSpawn} className="w-full gap-2 bg-fire-600 hover:bg-fire-700">
                    <Plus size={16} /> Spawn Custom Fox
                  </Button>
                  <p className="text-[10px] text-slate-400 italic">Note: Manual naming is disabled. The fox will be named according to its phenotype.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(LOCI).map(([key, locus]) => (
                    <div key={key} className="p-3 bg-white border border-earth-100 rounded-lg space-y-2 shadow-sm">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{locus.name}</div>
                      <div className="flex gap-2">
                        <select 
                          value={spawnGenotype[key][0]} 
                          onChange={e => handleUpdateGenotype(key, 0, e.target.value)}
                          className="flex-1 text-xs p-1 border border-earth-100 rounded bg-earth-50"
                        >
                          {locus.alleles.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <select 
                          value={spawnGenotype[key][1]} 
                          onChange={e => handleUpdateGenotype(key, 1, e.target.value)}
                          className="flex-1 text-xs p-1 border border-earth-100 rounded bg-earth-50"
                        >
                          {locus.alleles.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="folk-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="text-blue-600" size={18} /> Stat Modifier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Select Fox</label>
                  <select 
                    value={selectedFoxId} 
                    onChange={e => {
                      const id = e.target.value;
                      setSelectedFoxId(id);
                      if (foxes[id]) setModStats(foxes[id].stats);
                    }}
                    className="w-full p-2 border border-earth-200 rounded-lg text-sm"
                  >
                    <option value="">-- Select a Fox --</option>
                    {Object.values(foxes).map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.phenotype})</option>
                    ))}
                  </select>
                </div>

                {selectedFoxId && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {['head', 'topline', 'forequarters', 'hindquarters', 'tail', 'coatQuality', 'temperament', 'presence', 'luck', 'fertility'].map(stat => (
                      <div key={stat} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">{stat}</label>
                        <input 
                          type="number"
                          value={modStats[stat as keyof Stats] || 0}
                          onChange={e => setModStats({ ...modStats, [stat]: Number(e.target.value) })}
                          className="w-full p-2 border border-earth-100 rounded bg-white text-sm font-bold"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <Button disabled={!selectedFoxId} onClick={handleUpdateStats} className="w-full">Save Stat Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'logs' && (
        <Card className="folk-card">
          <CardHeader>
            <CardTitle>Admin Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {adminLogs.length === 0 && <p className="text-sm text-slate-400 italic">No activity recorded yet.</p>}
              {adminLogs.map(log => (
                <div key={log.id} className="p-3 bg-earth-50 border border-earth-100 rounded-lg text-sm flex justify-between items-start">
                  <div>
                    <div className="font-bold text-fire-700">{log.action}</div>
                    <div className="text-slate-600 mt-1">{log.details}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'system' && (
        <Card className="folk-card">
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl" onClick={advanceTime}>
                <FastForward className="text-fire-600" />
                <span>Next Season</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl" onClick={() => {
                if(confirm('Are you sure you want to reset all game data?')) {
                  localStorage.removeItem('red-fox-sim-storage');
                  window.location.reload();
                }
              }}>
                <Trash2 className="text-red-500" />
                <span>Wipe Game Data</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl" onClick={() => router.push('/')}>
                <RefreshCw className="text-moss-600" />
                <span>Reload UI</span>
              </Button>
            </div>
            
            <div className="p-6 bg-fire-50 border border-fire-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShieldCheck size={32} className="text-fire-600" />
                <div>
                  <h4 className="font-bold text-slate-900">Developer Mode</h4>
                  <p className="text-sm text-slate-500">Currently active. This grants bypass for costs and cooldowns.</p>
                </div>
              </div>
              <Button variant="outline" onClick={toggleAdminMode}>Deactivate</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
