'use client';



import React, { useState, useEffect } from 'react';

import { useGameStore } from '@/lib/store';

import { LOCI, getInitialGenotype, getPhenotype, Stats, getBaseEyeColors, getWhiteMarkingOptions, getEyeColorHex } from '@/lib/genetics';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import {

  Users, Trophy, Coins, Microscope, Settings,

  AlertTriangle, Ban, Plus, Trash2, Save,

  RefreshCw, FastForward, Heart, Info,

  Search, ShieldCheck, UserX, Activity, List,

  ArrowUp, ArrowDown, Eye, Check

} from 'lucide-react';

import { useRouter } from 'next/navigation';



export default function AdminPanel() {

  const router = useRouter();

  const {

    isAdmin, members, gold, gems, inventory, foxes, adminLogs,

    warnMember, banMember, adminSetCurrency, adminAddItem,

    adminSpawnFox, adminUpdateFoxStats, runShows, advanceTime, toggleAdminMode,

    bannerUrl, setBannerUrl, bannerPosition, setBannerPosition

  } = useGameStore();



  const [activeTab, setActiveTab] = useState('members');

  const [searchMember, setSearchMember] = useState('');



  // Economy State

  const [editGold, setEditGold] = useState(gold);

  const [editGems, setEditGems] = useState(gems);

  const [editBannerUrl, setEditBannerUrl] = useState(bannerUrl);

  const [addItemId, setAddItemId] = useState('supplies');

  const [addItemCount, setAddItemCount] = useState(1);



  // Genetics Lab State

  const [spawnGender, setSpawnGender] = useState<'Male' | 'Female'>('Male');

  const [spawnGenotype, setSpawnGenotype] = useState(getInitialGenotype());

  const [baseEyeColor, setBaseEyeColor] = useState<'Random' | string>('Brown');

  const [whiteMarkingEffect, setWhiteMarkingEffect] = useState<'None' | 'Blue' | 'Blue Heterochromia'>('None');

  const [silverIntensity, setSilverIntensity] = useState(3);



  // Prize Configuration Functions

  const loadPrizeConfig = () => {

    try {

      if (typeof window !== 'undefined') {

        const saved = localStorage.getItem('fox-show-prizes');

        if (saved) {

          const config = JSON.parse(saved);

          console.log(' DEBUG: Prize config loaded from localStorage:', config);

          return config;

        }

      }

    } catch (error) {

      console.error(' DEBUG: Failed to load prize config:', error);

    }

    return null;

  };



  const savePrizeConfig = (config: any) => {

    try {

      if (typeof window !== 'undefined') {

        localStorage.setItem('fox-show-prizes', JSON.stringify(config));

        console.log(' DEBUG: Prize config saved to localStorage:', config);

      }

    } catch (error) {

      console.error(' DEBUG: Failed to save prize config:', error);

    }

  };



  const showSavedIndicator = (key: string) => {

    setSavedIndicator(prev => ({ ...prev, [key]: true }));

    console.log(' DEBUG: Saved indicator triggered for:', key);

    setTimeout(() => {

      setSavedIndicator(prev => ({ ...prev, [key]: false }));

      console.log(' DEBUG: Saved indicator cleared for:', key);

    }, 2000);

  };



  // Prize Configuration State

  const [showConfig, setShowConfig] = useState(() => {

    const savedConfig = loadPrizeConfig();

    return savedConfig || {

      Junior: { bis: 1000, first: 500, second: 250, third: 100 },

      Open: { bis: 2500, first: 1000, second: 500, third: 250 },

      Senior: { bis: 5000, first: 2500, second: 1000, third: 500 },

      Championship: { bis: 10000, first: 5000, second: 2500, third: 1000 }

    };

  });

  const [savedIndicator, setSavedIndicator] = useState<Record<string, boolean>>({});

  // Load prize configuration after component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConfig = loadPrizeConfig();
      if (savedConfig) {
        setShowConfig(savedConfig);
        console.log('🔧 DEBUG: Prize config loaded after mount:', savedConfig);
      }
    }
  }, []);

  // Stat Modifier State

  const [selectedFoxId, setSelectedFoxId] = useState('');

  const [modStats, setModStats] = useState<Partial<Stats>>({});



  if (!isAdmin) {

    return (

      <div className="flex flex-col items-center justify-center py-20">

        <ShieldCheck size={64} className="text-secondary mb-4 opacity-20" />

        <h1 className="text-2xl font-black text-foreground">Access Restricted</h1>

        <p className="text-muted-foreground mt-2 mb-6">You must be an administrator to view this page.</p>

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

    // Determine final eye color for the fox

    let finalEyeColor: string | undefined;

    

    if (baseEyeColor === 'Random') {

      finalEyeColor = undefined;

    } else if (whiteMarkingEffect === 'None') {

      finalEyeColor = baseEyeColor;

    } else {

      finalEyeColor = whiteMarkingEffect;

    }

    

    const phenotypeName = getPhenotype(spawnGenotype, silverIntensity, finalEyeColor).name;

    adminSpawnFox(phenotypeName, spawnGender, spawnGenotype);

    alert('Fox spawned successfully!');

  };



  const handleWarn = (memberId: string) => {

    const reason = prompt('Reason for warning:');

    if (reason) warnMember(memberId, reason);

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

          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">

            <Settings className="text-primary" size={36} /> Admin Panel

          </h1>

          <p className="text-muted-foreground mt-2 font-medium">Global kennel management and user moderation tools.</p>

        </div>

        <Button variant="ghost" onClick={toggleAdminMode} className="text-destructive hover:text-destructive hover:bg-destructive/10">

          Deactivate Admin Mode

        </Button>

      </div>



      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

        {[

          { id: 'members', label: 'Members', icon: Users },

          { id: 'shows', label: 'Shows', icon: Trophy },

          { id: 'economy', label: 'Economy', icon: Coins },

          { id: 'genetics', label: 'Genetics Lab', icon: Microscope },

          { id: 'site', label: 'Site Settings', icon: Info },

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

        <Card className="folk-card border-2 border-border bg-card">

          <CardHeader className="flex flex-row items-center justify-between">

            <CardTitle className="font-black italic text-foreground tracking-tight">User Moderation</CardTitle>

            <div className="relative w-64">

              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />

              <input

                type="text"

                placeholder="Search by name..."

                value={searchMember}

                onChange={(e) => setSearchMember(e.target.value)}

                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-sm font-medium"

              />

            </div>

          </CardHeader>

          <CardContent>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="text-left text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b border-border">

                    <th className="pb-3 pl-2">User</th>

                    <th className="pb-3 text-center">Status</th>

                    <th className="pb-3 text-center">Warnings</th>

                    <th className="pb-3 text-right pr-2">Actions</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-border">

                  {(members || []).filter(m => m.name.toLowerCase().includes(searchMember.toLowerCase())).map(member => (

                    <tr key={member.id} className="hover:bg-muted/30 transition-colors">

                      <td className="py-4 pl-2">

                        <div className="flex items-center gap-3">

                          <div className={`w-8 h-8 rounded-full ${member.avatarColor} flex items-center justify-center text-white text-xs`}>

                            {member.name[0]}

                          </div>

                          <div>

                            <div className="font-bold text-foreground">{member.name}</div>

                            <div className="text-[10px] text-muted-foreground">ID: {member.id} • Joined {member.joined}</div>

                          </div>

                        </div>

                      </td>

                      <td className="py-4 text-center">

                        {member.isBanned ? (

                          <Badge variant="destructive" className="text-[8px] uppercase">Banned</Badge>

                        ) : (

                          <Badge variant="secondary" className="bg-primary/10 text-primary border-none shadow-none text-[8px] uppercase">Active</Badge>

                        )}

                      </td>

                      <td className="py-4 text-center font-mono">

                        {(member.warnings || []).length > 0 ? (

                          <span className="text-secondary font-bold">{member.warnings.length}</span>

                        ) : (

                          <span className="text-muted-foreground/30">0</span>

                        )}

                      </td>

                      <td className="py-4 text-right pr-2">

                        <div className="flex justify-end gap-1">

                          <Button

                            size="icon"

                            variant="ghost"

                            className="h-8 w-8 text-secondary hover:bg-secondary/10"

                            onClick={() => handleWarn(member.id)}

                            title="Warn User"

                          >

                            <AlertTriangle size={16} />

                          </Button>

                          <Button

                            size="icon"

                            variant="ghost"

                            className={`h-8 w-8 ${member.isBanned ? 'text-primary hover:bg-primary/10' : 'text-destructive hover:bg-destructive/10'}`}

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

          <Card className="folk-card border-2 border-border bg-card">

            <CardHeader>

              <CardTitle className="flex items-center gap-2 font-black italic text-foreground tracking-tight">

                <Coins className="text-secondary" size={18} /> Global Economy

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div className="space-y-2">

                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Set User Gold</label>

                <div className="flex gap-2">

                  <input

                    type="number"

                    value={editGold}

                    onChange={e => setEditGold(Number(e.target.value))}

                    className="flex-1 p-2 bg-muted/30 border border-border rounded-lg text-sm font-bold text-foreground"

                  />

                  <Button onClick={() => adminSetCurrency(editGold, editGems)}>Apply</Button>

                </div>

              </div>

              <div className="space-y-2">

                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Set User Gems</label>

                <div className="flex gap-2">

                  <input

                    type="number"

                    value={editGems}

                    onChange={e => setEditGems(Number(e.target.value))}

                    className="flex-1 p-2 bg-muted/30 border border-border rounded-lg text-sm font-bold text-foreground"

                  />

                  <Button onClick={() => adminSetCurrency(editGold, editGems)}>Apply</Button>

                </div>

              </div>

            </CardContent>

          </Card>



          <Card className="folk-card border-2 border-border bg-card">

            <CardHeader>

              <CardTitle className="flex items-center gap-2 font-black italic text-foreground tracking-tight">

                <Plus className="text-primary" size={18} /> Item Spawner

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div className="space-y-2">

                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Select Item</label>

                <select

                  value={addItemId}

                  onChange={e => setAddItemId(e.target.value)}

                  className="w-full p-2 bg-muted/30 border border-border rounded-lg text-sm font-medium text-foreground"

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

                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Quantity</label>

                <div className="flex gap-2">

                  <input

                    type="number"

                    value={addItemCount}

                    onChange={e => setAddItemCount(Number(e.target.value))}

                    className="flex-1 p-2 bg-muted/30 border border-border rounded-lg text-sm font-bold text-foreground"

                  />

                  <Button variant="outline" onClick={() => adminAddItem(addItemId, addItemCount)}>Spawn Items</Button>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      )}



      {activeTab === 'shows' && (

        <Card className="folk-card border-2 border-border bg-card">

          <CardHeader>

            <CardTitle className="font-black italic text-foreground tracking-tight">Competitive Circuit</CardTitle>

          </CardHeader>

          <CardContent className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="p-4 bg-muted/20 rounded-xl border border-border">

                <h4 className="font-bold text-foreground mb-2">Automated Cycle</h4>

                <p className="text-xs text-muted-foreground mb-4 font-medium">Triggers all current season shows based on your current foxes.</p>

                <Button className="w-full gap-2" onClick={runShows}>

                  <FastForward size={16} /> Force Season Shows

                </Button>

              </div>

              <div className="p-4 bg-muted/20 rounded-xl border border-border">

                <h4 className="font-bold text-foreground mb-2">Manual Points</h4>

                <p className="text-xs text-muted-foreground mb-4 font-medium">Manually award points to all foxes in the kennel (+10 points).</p>

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

            {/* Prize Configuration */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Show Prize Configuration</h4>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    console.log('🔧 DEBUG: Manual save button clicked');
                    console.log('🔧 DEBUG: Current showConfig:', showConfig);
                    savePrizeConfig(showConfig);
                    showSavedIndicator('manual-save');
                    setTimeout(() => {
                      setSavedIndicator(prev => ({ ...prev, 'manual-save': false }));
                      console.log('🔧 DEBUG: Saved indicator cleared for: manual-save');
                    }, 2000);
                    alert('Prize configuration saved!');
                  }}
                  className="text-xs"
                >
                  <Save size={14} /> Save All Settings
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Junior', 'Open', 'Senior', 'Championship'].map((level) => (
                  <div key={level} className="space-y-3 p-4 bg-muted/20 rounded-xl border border-border">
                    <h5 className="text-xs font-black text-foreground uppercase tracking-wider flex justify-between items-center">
                      {level} 
                      <Badge variant="outline" className="text-[8px] font-bold opacity-60">
                        {level === 'Junior' ? 'Starter' : level === 'Championship' ? 'Fall Only' : 'Expert'}
                      </Badge>
                    </h5>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[8px] font-black text-muted-foreground uppercase tracking-wider">Prize Currency</label>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <label className="text-[8px] font-black text-muted-foreground uppercase tracking-wider block mb-1">1st Place</label>
                          <div className="space-y-1">
                            <select
                              className="w-full px-2 py-1 text-xs font-bold border border-border rounded bg-background focus:ring-1 focus:ring-primary/30 outline-none mb-1"
                              onChange={(e) => {
                                console.log('🔧 DEBUG: 1st place change detected', { level, value: e.target.value });
                                const val = parseInt(e.target.value) || 0;
                                const newConfig = { ...showConfig };
                                newConfig[level] = { ...newConfig[level], first: val };
                                setShowConfig(newConfig);
                                savePrizeConfig(newConfig);
                                showSavedIndicator(`${level}-first`);
                                console.log('🔧 DEBUG: Prize config updated and saved');
                              }}
                            >
                              <option value="gold">Gold</option>
                              <option value="gems">Gems</option>
                            </select>
                            <div className="relative">
                              <input
                                type="number"
                                className="w-full px-2 py-1 text-xs font-bold border border-border rounded bg-background focus:ring-1 focus:ring-primary/30 outline-none"
                                placeholder="0"
                                value={showConfig[level]?.first || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  const newConfig = { ...showConfig };
                                  newConfig[level] = { ...newConfig[level], first: val };
                                  setShowConfig(newConfig);
                                  savePrizeConfig(newConfig);
                                  showSavedIndicator(`${level}-first`);
                                  console.log('🔧 DEBUG: Prize config updated and saved');
                                }}
                              />
                              {savedIndicator[`${level}-first`] && (
                                <div className="absolute right-2 top-1/2 text-green-500">
                                  <Check size={14} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <label className="text-[8px] font-black text-muted-foreground uppercase tracking-wider block mb-1">2nd Place</label>
                          <div className="space-y-1">
                            <select
                              className="w-full px-2 py-1 text-xs font-bold border border-border rounded bg-background focus:ring-1 focus:ring-primary/30 outline-none mb-1"
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const newConfig = { ...showConfig };
                                newConfig[level] = { ...newConfig[level], second: val };
                                setShowConfig(newConfig);
                                savePrizeConfig(newConfig);
                                showSavedIndicator(`${level}-second`);
                              }}
                            >
                              <option value="gold">Gold</option>
                              <option value="gems">Gems</option>
                            </select>
                            <div className="relative">
                              <input
                                type="number"
                                className="w-full px-2 py-1 text-xs font-bold border border-border rounded bg-background focus:ring-1 focus:ring-primary/30 outline-none"
                                placeholder="0"
                                value={showConfig[level]?.second || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  const newConfig = { ...showConfig };
                                  newConfig[level] = { ...newConfig[level], second: val };
                                  setShowConfig(newConfig);
                                  savePrizeConfig(newConfig);
                                  showSavedIndicator(`${level}-second`);
                                }}
                              />
                              {savedIndicator[`${level}-second`] && (
                                <div className="absolute right-2 top-1/2 text-green-500">
                                  <Check size={14} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <label className="text-[8px] font-black text-muted-foreground uppercase tracking-wider block mb-1">3rd Place</label>
                          <div className="space-y-1">
                            <select
                              className="w-full px-2 py-1 text-xs font-bold border border-border rounded bg-background focus:ring-1 focus:ring-primary/30 outline-none mb-1"
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const newConfig = { ...showConfig };
                                newConfig[level] = { ...newConfig[level], third: val };
                                setShowConfig(newConfig);
                                savePrizeConfig(newConfig);
                                showSavedIndicator(`${level}-third`);
                              }}
                            >
                              <option value="gold">Gold</option>
                              <option value="gems">Gems</option>
                            </select>
                            <div className="relative">
                              <input
                                type="number"
                                className="w-full px-2 py-1 text-xs font-bold border border-border rounded bg-background focus:ring-1 focus:ring-primary/30 outline-none"
                                placeholder="0"
                                value={showConfig[level]?.third || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  const newConfig = { ...showConfig };
                                  newConfig[level] = { ...newConfig[level], third: val };
                                  setShowConfig(newConfig);
                                  savePrizeConfig(newConfig);
                                  showSavedIndicator(`${level}-third`);
                                }}
                              />
                              {savedIndicator[`${level}-third`] && (
                                <div className="absolute right-2 top-1/2 text-green-500">
                                  <Check size={14} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center mt-3">
                        <label className="text-[8px] font-black text-muted-foreground uppercase tracking-wider block mb-1">Best in Show</label>
                        <div className="space-y-1">
                          <select
                            className="w-full px-2 py-1 text-xs font-bold border border-border rounded bg-background focus:ring-1 focus:ring-primary/30 outline-none mb-1"
                            value={showConfig[level]?.bis || 0}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newConfig = { ...showConfig };
                              newConfig[level] = { ...newConfig[level], bis: parseInt(val) || 0 };
                              setShowConfig(newConfig);
                              savePrizeConfig(newConfig);
                              showSavedIndicator(`${level}-bis`);
                            }}
                          >
                            <option value="gold">Gold</option>
                            <option value="gems">Gems</option>
                          </select>
                          <input
                            type="number"
                            className="w-full px-2 py-1 text-xs font-bold border border-border rounded bg-background focus:ring-1 focus:ring-primary/30 outline-none"
                            placeholder="0"
                            value={showConfig[level]?.bis || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const newConfig = { ...showConfig };
                              newConfig[level] = { ...newConfig[level], bis: val };
                              setShowConfig(newConfig);
                              savePrizeConfig(newConfig);
                              showSavedIndicator(`${level}-bis`);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="space-y-2">

              <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Show History</h4>

              <div className="space-y-2">

                {useGameStore.getState().showReports.slice(0, 5).map((report, i) => (

                  <div key={i} className="flex justify-between items-center p-3 bg-muted/10 border border-border rounded-lg text-sm shadow-inner group transition-colors hover:bg-muted/20">

                    <div className="flex items-center gap-3">

                      <Badge variant="outline" className="font-black text-[10px] border-secondary/20 text-secondary">{report.level}</Badge>

                      <span className="font-bold italic text-foreground/80 tracking-tight">Year {report.year}, {report.season}</span>

                    </div>

                    <div className="text-secondary font-black tracking-tight italic">Winner: {report.bestInShowFoxId ? foxes[report.bestInShowFoxId]?.name : 'None'}</div>

                  </div>

                ))}

              </div>

            </div>

          </CardContent>

        </Card>

      )}



      {activeTab === 'genetics' && (

        <div className="space-y-6">

          <Card className="folk-card border-2 border-border bg-card">

            <CardHeader>

              <CardTitle className="font-black italic text-foreground tracking-tight">Genetics Lab: Spawn Fox</CardTitle>

            </CardHeader>

            <CardContent className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-4">

                  <div className="p-4 bg-muted/20 rounded-xl border border-border">

                    <h5 className="text-sm font-black italic text-foreground mb-2">Predicted Outcome</h5>

                    <div className="flex justify-between items-center">

                      <div className="text-sm font-bold text-primary">{getPhenotype(spawnGenotype, silverIntensity, baseEyeColor === 'Random' ? undefined : whiteMarkingEffect === 'None' ? baseEyeColor : whiteMarkingEffect).name}</div>

                      <Badge variant="outline" className="font-black text-[10px] uppercase tracking-tighter border-secondary/20 text-secondary">{getPhenotype(spawnGenotype, silverIntensity, baseEyeColor === 'Random' ? undefined : whiteMarkingEffect === 'None' ? baseEyeColor : whiteMarkingEffect).eyeColor} Eyes</Badge>

                    </div>

                  </div>

                  

                  {/* Silver Intensity */}

                  <div className="space-y-4">

                    <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.1em]">Silver Intensity</label>

                    <div className="text-xs text-muted-foreground/60 italic font-medium mb-2">

                        Controls silver dilution: 1 = Black, 2 = Minimum Silver, 5 = Maximum Silver

                    </div>

                    <div className="grid grid-cols-5 gap-2">

                      {[1, 2, 3, 4, 5].map((intensity) => (

                        <Button

                          key={intensity}

                          size="sm"

                          variant={silverIntensity === intensity ? 'default' : 'outline'}

                          onClick={() => setSilverIntensity(intensity)}

                          className="text-xs font-black rounded-lg"

                        >

                          {intensity}

                        </Button>

                      ))}

                    </div>

                    <div className="text-xs text-muted-foreground/50 italic mt-4 p-3 bg-muted/50 rounded-lg border-l-4 border-primary/30">

                        <strong>Note:</strong> Silver intensity is hidden on red base foxes but remains heritable. Select the desired intensity for breeding purposes even when not visible on red-based phenotypes.

                    </div>

                  </div>

                  

                  {/* Eye Color Selection */}

                  <div className="space-y-4">

                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">

                      <Eye size={14} className="text-primary" /> Eye Color Selection

                    </label>

                    

                    {/* Base Eye Color */}

                    <div className="space-y-2">

                      <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.1em]">Base Color</label>

                      <div className="flex gap-2">

                        <Button

                          size="sm"

                          variant={baseEyeColor === 'Random' ? 'default' : 'outline'}

                          onClick={() => setBaseEyeColor('Random')}

                          className="text-xs font-black rounded-lg"

                        >

                          🎲 Random

                        </Button>

                      </div>

                      

                      {baseEyeColor !== 'Random' && (

                        <div className="grid grid-cols-3 gap-2">

                          {getBaseEyeColors(spawnGenotype).map((color: string) => (

                            <Button

                              key={color}

                              size="sm"

                              variant={baseEyeColor === color ? 'default' : 'outline'}

                              onClick={() => setBaseEyeColor(color)}

                              className="text-xs font-black rounded-lg flex items-center gap-1"

                            >

                              <div 

                                className="w-3 h-3 rounded-full border border-white/50"

                                style={{ background: getEyeColorHex(color) }}

                              />

                              {color}

                            </Button>

                          ))}

                        </div>

                      )}

                    </div>

                    

                    {/* White Marking Effects */}

                    {getWhiteMarkingOptions(spawnGenotype).length > 0 && (

                      <div className="space-y-2">

                        <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.1em]">White Marking Effects</label>

                        <div className="grid grid-cols-3 gap-2">

                          <Button

                            size="sm"

                            variant={whiteMarkingEffect === 'None' ? 'default' : 'outline'}

                            onClick={() => setWhiteMarkingEffect('None')}

                            className="text-xs font-black rounded-lg"

                          >

                            No Effect

                          </Button>

                          

                          {getWhiteMarkingOptions(spawnGenotype).includes('Blue') && (

                            <Button

                              size="sm"

                              variant={whiteMarkingEffect === 'Blue' ? 'default' : 'outline'}

                              onClick={() => setWhiteMarkingEffect('Blue')}

                              className="text-xs font-black rounded-lg flex items-center gap-1"

                            >

                              <div 

                                className="w-3 h-3 rounded-full border border-white/50"

                                style={{ background: '#4169E1' }}

                              />

                              Blue

                            </Button>

                          )}

                          

                          {getWhiteMarkingOptions(spawnGenotype).includes('Blue Heterochromia') && (

                            <Button

                              size="sm"

                              variant={whiteMarkingEffect === 'Blue Heterochromia' ? 'default' : 'outline'}

                              onClick={() => setWhiteMarkingEffect('Blue Heterochromia')}

                              className="text-xs font-black rounded-lg flex items-center gap-1"

                            >

                              <div 

                                className="w-3 h-3 rounded-full border border-white/50"

                                style={{ 

                                  backgroundImage: getEyeColorHex('Blue Heterochromia', baseEyeColor === 'Random' ? 'Brown' : baseEyeColor),

                                  backgroundSize: '200% 200%'

                                }}

                              />

                              Hetero

                            </Button>

                          )}

                        </div>

                      </div>

                    )}

                  </div>

                  

                  <div className="space-y-2">

                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Gender</label>

                    <div className="flex gap-2">

                      <Button

                        variant={spawnGender === 'Male' ? 'default' : 'outline'}

                        onClick={() => setSpawnGender('Male')}

                        className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px]"

                      >Male</Button>

                      <Button

                        variant={spawnGender === 'Female' ? 'default' : 'outline'}

                        onClick={() => setSpawnGender('Female')}

                        className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px]"

                      >Female</Button>

                    </div>

                  </div>

                  <Button onClick={handleSpawn} className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] h-12 rounded-2xl">

                    <Plus size={16} /> Spawn Custom Fox

                  </Button>

                  <p className="text-[10px] text-muted-foreground/60 italic font-medium">Note: Manual naming is disabled. The fox will be named according to its phenotype.</p>

                </div>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">

                  {Object.entries(LOCI).map(([key, locus]) => (

                    <div key={key} className="p-3 bg-card border-2 border-border rounded-2xl space-y-3 shadow-sm group hover:border-secondary/20 transition-colors">

                      <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">{locus.name}</div>

                      <div className="flex gap-2">

                        <select

                          value={spawnGenotype[key][0]}

                          onChange={e => handleUpdateGenotype(key, 0, e.target.value)}

                          className="flex-1 text-xs p-2 bg-muted/30 border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-secondary/20 transition-all"

                        >

                          {locus.alleles.map(a => <option key={a} value={a} className="bg-card">{a}</option>)}

                        </select>

                        <select

                          value={spawnGenotype[key][1]}

                          onChange={e => handleUpdateGenotype(key, 1, e.target.value)}

                          className="flex-1 text-xs p-2 bg-muted/30 border border-border rounded-xl font-bold text-foreground focus:ring-2 focus:ring-secondary/20 transition-all"

                        >

                          {locus.alleles.map(a => <option key={a} value={a} className="bg-card">{a}</option>)}

                        </select>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </CardContent>

          </Card>



          <Card className="folk-card border-2 border-border bg-card">

            <CardHeader>

              <CardTitle className="flex items-center gap-2 font-black italic text-foreground tracking-tight">

                <Activity className="text-secondary" size={18} /> Stat Modifier

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-6">

              <div className="space-y-4">

                <div className="space-y-2">

                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Select Fox</label>

                  <select

                    value={selectedFoxId}

                    onChange={e => {

                      const id = e.target.value;

                      setSelectedFoxId(id);

                      if (foxes[id]) setModStats(foxes[id].stats);

                    }}

                    className="w-full p-2 bg-muted/30 border border-border rounded-lg text-sm font-medium text-foreground"

                  >

                    <option value="" className="bg-card">-- Select a Fox --</option>

                    {Object.values(foxes).map(f => (

                      <option key={f.id} value={f.id} className="bg-card">{f.name} ({f.phenotype})</option>

                    ))}

                  </select>

                </div>



                {selectedFoxId && (

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">

                    {['head', 'topline', 'forequarters', 'hindquarters', 'tail', 'coatQuality', 'temperament', 'presence', 'luck', 'fertility'].map(stat => (

                      <div key={stat} className="space-y-1">

                        <label className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{stat}</label>

                        <input

                          type="number"

                          value={modStats[stat as keyof Stats] || 0}

                          onChange={e => setModStats({ ...modStats, [stat]: Number(e.target.value) })}

                          className="w-full p-2 bg-muted/20 border border-border rounded-lg text-sm font-black text-foreground"

                        />

                      </div>

                    ))}

                  </div>

                )}

                <Button disabled={!selectedFoxId} onClick={handleUpdateStats} className="w-full bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-widest h-12 rounded-2xl shadow-lg shadow-secondary/10">Save Stat Changes</Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}



      {activeTab === 'site' && (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="folk-card border-2 border-border bg-card">

            <CardHeader>

              <CardTitle className="flex items-center gap-2 font-black italic text-foreground tracking-tight">

                <Info className="text-primary" size={18} /> Header Banner

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-6">

              <div className="space-y-2">

                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Banner Image URL</label>

                <div className="flex gap-2">

                  <input

                    type="text"

                    value={editBannerUrl}

                    onChange={e => setEditBannerUrl(e.target.value)}

                    className="flex-1 p-2 bg-muted/30 border border-border rounded-lg text-sm font-medium text-foreground"

                    placeholder="https://..."

                  />

                  <Button onClick={() => setBannerUrl(editBannerUrl)}>Apply</Button>

                </div>

                <p className="text-[10px] text-muted-foreground/60 italic font-medium">

                  Recommended Dimensions: <span className="font-bold text-primary">1920 x 400</span> (or any wide aspect ratio with 4:1 - 5:1 ratio).

                </p>

              </div>



              <div className="space-y-2">

                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Vertical Focus ({bannerPosition})</label>

                <div className="flex gap-4 items-center">

                  <input

                    type="range"

                    min="0"

                    max="100"

                    value={parseInt(bannerPosition)}

                    onChange={e => setBannerPosition(`${e.target.value}%`)}

                    className="flex-1 accent-primary"

                  />

                  <span className="text-xs font-mono text-muted-foreground w-10 font-bold">

                    {bannerPosition === '0%' ? 'Top' : (bannerPosition === '100%' ? 'Bottom' : bannerPosition)}

                  </span>

                </div>

                <p className="text-[10px] text-muted-foreground/60 italic font-medium">Adjust which part of the image is shown in the banner crop.</p>

              </div>



              <div className="space-y-3">

                <label className="text-xs font-bold text-slate-400 uppercase">Banner Presets (Verified IDs)</label>

                <div className="grid grid-cols-2 gap-2">

                  {[

                    { name: 'Red Fox Autumn', url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=2070' },

                    { name: 'Snow Fox Winter', url: 'https://images.unsplash.com/photo-1490264443916-701856236282?auto=format&fit=crop&q=80&w=2070' },

                    { name: 'Forest Fox Cubs', url: 'https://images.unsplash.com/photo-1516934024742-b43617159ccd?auto=format&fit=crop&q=80&w=2070' },

                    { name: 'Staring Red Fox', url: 'https://images.unsplash.com/photo-1519098901909-b1553a1190af?auto=format&fit=crop&q=80&w=2070' },

                  ].map(preset => (

                    <Button

                      key={preset.name}

                      variant="outline"

                      size="sm"

                      className="text-[10px] font-bold h-10"

                      onClick={() => {

                        setEditBannerUrl(preset.url);

                        setBannerUrl(preset.url);

                        setBannerPosition('50%');

                      }}

                    >

                      {preset.name}

                    </Button>

                  ))}

                </div>

              </div>



              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">

                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Layout Reference</p>

                <p className="text-[11px] text-foreground font-medium opacity-80">The site is currently configured for <span className="font-black italic">Left Alignment</span> to match your branding preference.</p>

              </div>

            </CardContent>

          </Card>



          <Card className="folk-card overflow-hidden border-2 border-border bg-card">

            <CardHeader className="bg-muted/30 border-b border-border">

              <CardTitle className="text-xs font-black uppercase text-muted-foreground/40 tracking-[0.2em]">Banner Preview</CardTitle>

            </CardHeader>

            <div

              className="w-full h-48 bg-cover"

              style={{ backgroundImage: `url(${bannerUrl})`, backgroundPosition: `center ${bannerPosition}` }}

            />

            <CardContent className="p-5 bg-muted/10">

              <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">This banner will appear at the top of every page in the simulation, providing a cozy atmosphere for your kennel.</p>

            </CardContent>

          </Card>

        </div>

      )}



      {activeTab === 'logs' && (

        <Card className="folk-card border-2 border-border bg-card">

          <CardHeader>

            <CardTitle className="font-black italic text-foreground tracking-tight">Admin Activity Log</CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-3">

              {(adminLogs || []).length === 0 && <p className="text-sm text-muted-foreground italic py-10 text-center font-medium opacity-40">No activity recorded yet.</p>}

              {(adminLogs || []).map(log => (

                <div key={log.id} className="p-4 bg-muted/20 border border-border rounded-2xl text-sm flex justify-between items-start group hover:bg-muted/40 transition-colors">

                  <div>

                    <div className="font-black italic text-primary group-hover:text-secondary transition-colors">{log.action}</div>

                    <div className="text-muted-foreground mt-1 font-medium">{log.details}</div>

                  </div>

                  <div className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">

                    {new Date(log.timestamp).toLocaleTimeString()}

                  </div>

                </div>

              ))}

            </div>

          </CardContent>

        </Card>

      )}



      {activeTab === 'system' && (

        <Card className="folk-card border-2 border-border bg-card">

          <CardHeader>

            <CardTitle className="font-black italic text-foreground tracking-tight">System Controls</CardTitle>

          </CardHeader>

          <CardContent className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              <Button variant="outline" className="h-28 flex flex-col gap-3 rounded-[2rem] border-2 group hover:border-primary/30 transition-all font-black uppercase text-[10px] tracking-widest" onClick={advanceTime}>

                <FastForward size={24} className="text-primary group-hover:scale-110 transition-transform" />

                <span>Next Season</span>

              </Button>

              <Button variant="outline" className="h-28 flex flex-col gap-3 rounded-[2rem] border-2 group hover:border-destructive/30 transition-all font-black uppercase text-[10px] tracking-widest" onClick={() => {

                if (confirm('Are you sure you want to reset all game data?')) {

                  localStorage.removeItem('red-fox-sim-storage');

                  window.location.reload();

                }

              }}>

                <Trash2 size={24} className="text-destructive group-hover:scale-110 transition-transform" />

                <span>Wipe Game Data</span>

              </Button>

              <Button variant="outline" className="h-28 flex flex-col gap-3 rounded-[2rem] border-2 group hover:border-secondary/30 transition-all font-black uppercase text-[10px] tracking-widest" onClick={() => router.push('/')}>

                <RefreshCw size={24} className="text-secondary group-hover:scale-110 transition-transform" />

                <span>Reload UI</span>

              </Button>

            </div>



            <div className="p-8 bg-primary/10 border-2 border-primary/20 rounded-[2.5rem] flex items-center justify-between shadow-inner">

              <div className="flex items-center gap-6">

                <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20">

                  <ShieldCheck size={32} />

                </div>

                <div>

                  <h4 className="font-black italic text-foreground text-xl tracking-tight">Developer Mode</h4>

                  <p className="text-sm text-muted-foreground font-medium opacity-80 mt-1">Currently active. This grants bypass for all costs and cooldowns.</p>

                </div>

              </div>

              <Button variant="outline" onClick={toggleAdminMode} className="rounded-xl border-2 font-black uppercase tracking-widest text-[10px] px-6">Deactivate</Button>

            </div>

          </CardContent>

        </Card>

      )}

    </div>

  );

}

