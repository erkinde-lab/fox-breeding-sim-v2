'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { LOCI, getInitialGenotype, getPhenotype, Stats } from '@/lib/genetics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [passcode, setPasscode] = useState('');
  
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

  const handleLogin = () => {
    if (passcode === 'foxy2024') {
      toggleAdminMode();
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-slate-400">Please enter the administrative override code to proceed.</p>
            <Input
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              placeholder="Passcode"
            />
            <Button className="w-full bg-fire-600 hover:bg-fire-700" onClick={handleLogin}>
              Access Dashboard
            </Button>
            <div className="pt-4 text-center">
              <Button variant="link" className="text-slate-500" onClick={() => router.push('/')}>
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
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
    adminSpawnFox(getPhenotype(spawnGenotype).name, spawnGender, spawnGenotype);
    alert('Fox spawned successfully!');
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
            <tab.icon size={16} />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'members' && (
        <Card className="folk-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Community Members</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full pl-10 pr-4 py-2 bg-earth-50 border border-earth-100 rounded-xl text-sm"
                value={searchMember}
                onChange={e => setSearchMember(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-earth-100">
                    <th className="pb-4">Member</th>
                    <th className="pb-4">Level</th>
                    <th className="pb-4">Joined</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-50">
                  {members.filter(m => m.name.toLowerCase().includes(searchMember.toLowerCase())).map(member => (
                    <tr key={member.id} className="text-sm">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${member.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                            {member.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{member.name}</div>
                            <div className="text-xs text-slate-500">ID: {member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-mono">{member.level}</td>
                      <td className="py-4 text-slate-600">{member.joined}</td>
                      <td className="py-4">
                        {member.isBanned ? (
                          <Badge className="bg-red-100 text-red-600 border-red-200">Banned</Badge>
                        ) : member.warnings.length > 0 ? (
                          <Badge className="bg-amber-100 text-amber-600 border-amber-200">{member.warnings.length} Warnings</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-600 border-green-200">Active</Badge>
                        )}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => banMember(member.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <UserX size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <div className="p-4 bg-earth-50 rounded-xl border border-earth-200">
                    <h5 className="text-sm font-bold mb-2">Predicted Outcome</h5>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">{getPhenotype(spawnGenotype).name}</div>
                      <Badge variant="outline">{getPhenotype(spawnGenotype).eyeColor} Eyes</Badge>
                    </div>
                  </div>
                  <Button onClick={handleSpawn} className="w-full gap-2 bg-fire-600 hover:bg-fire-700">
                    <Plus size={16} /> Spawn Custom Fox
                  </Button>
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
