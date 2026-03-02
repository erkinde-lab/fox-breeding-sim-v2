'use client';
import { cn } from '@/lib/utils';

import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/store';
import {
  LOCI, getInitialGenotype, getPhenotype, Stats,
  getBaseEyeColors, getWhiteMarkingOptions, getEyeColorHex
} from '@/lib/genetics';
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
import { useNotifications } from '@/components/NotificationProvider';

export default function AdminPanel() {
  const router = useRouter();
  const { showNotification } = useNotifications();
  const {
    isAdmin, members, gold, gems, inventory, foxes, adminLogs,
    warnMember, banMember, adminSetCurrency, adminAddItem,
    adminSpawnFox, adminUpdateFoxStats, runShows, advanceTime, toggleAdminMode, updateShowConfig,
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
  const [spawnGender, setSpawnGender] = useState<'Dog' | 'Vixen'>('Dog');
  const [spawnGenotype, setSpawnGenotype] = useState(getInitialGenotype());
  const [baseEyeColor, setBaseEyeColor] = useState<'Random' | string>('Brown');
  const [whiteMarkingEffect, setWhiteMarkingEffect] = useState<'None' | 'Blue' | 'Blue Heterochromia'>('None');
  const [silverIntensity, setSilverIntensity] = useState(3);

  const [selectedFoxId, setSelectedFoxId] = useState<string | null>(null);
  const [modStats, setModStats] = useState<Record<string, number>>({});
  const lastSyncedId = useRef<string | null>(null);

  useEffect(() => {
    if (selectedFoxId && foxes[selectedFoxId] && lastSyncedId.current !== selectedFoxId) {
      const stats = foxes[selectedFoxId].stats;
      const targetId = selectedFoxId;
      Promise.resolve().then(() => {
        setModStats(stats as any);
        lastSyncedId.current = targetId;
      });
    }
  }, [selectedFoxId, foxes]);

  const handleSpawnFox = () => {
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
    showNotification({
      title: "Fox Spawned",
      message: `Successfully spawned a ${phenotypeName} into your kennel!`,
      type: "success"
    });
  };

  const handleWarn = (memberId: string) => {
    showNotification({
      title: "Warn Member",
      message: "Please enter the reason for the warning:",
      type: "warning",
      showInput: true,
      inputPlaceholder: "Reason...",
      onConfirm: (reason) => {
        if (reason) {
          warnMember(memberId, reason);
          showNotification({ title: "Member Warned", message: "The warning has been issued.", type: "success" });
        }
      }
    });
  };

  const handleUpdateStats = () => {
    if (!selectedFoxId) return;
    adminUpdateFoxStats(selectedFoxId, modStats);
    showNotification({
      title: "Stats Updated",
      message: `Stats for ${foxes[selectedFoxId].name} have been updated successfully.`,
      type: "success"
    });
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Ban size={64} className="text-destructive mb-4" />
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">Access Denied</h1>
        <p className="text-muted-foreground font-medium mt-2">You do not have administrative privileges.</p>
        <Button onClick={() => router.push('/')} className="mt-8">Return Home</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Settings className="text-primary" size={36} /> Admin Panel
          </h1>
          <Badge className="mt-2 bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-[10px]">Developer Control Center</Badge>
        </div>
        <div className="flex gap-2">
          {['members', 'economy', 'genetics', 'site', 'logs', 'system'].map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className="font-black uppercase tracking-widest text-[10px] rounded-xl h-10 px-4"
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === 'members' && (
        <Card className="folk-card border-2 border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-black italic text-foreground tracking-tight">Registered Members</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                value={searchMember}
                onChange={e => setSearchMember(e.target.value)}
                placeholder="Search by ID or Name..."
                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.filter(m => m.name.toLowerCase().includes(searchMember.toLowerCase()) || m.id.includes(searchMember)).map(member => (
                <div key={member.id} className="p-4 bg-muted/20 border border-border rounded-2xl flex items-center justify-between group hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                      {member.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black italic text-lg text-foreground tracking-tight">{member.name}</div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        ID: {member.id} • Joined: {new Date(member.joined).toLocaleDateString()}

                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" onClick={() => handleWarn(member.id)} className="h-9 gap-2 font-black uppercase tracking-widest text-[9px]">
                      <AlertTriangle size={14} className="text-accent" /> Warn
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      showNotification({
                        title: "Ban Member",
                        message: `Are you sure you want to ban ${member.name}? This action is permanent.`,
                        type: "error",
                        confirmLabel: "Ban Member",
                        onConfirm: () => banMember(member.id)
                      });
                    }} className="h-9 gap-2 font-black uppercase tracking-widest text-[9px] hover:bg-destructive hover:text-primary-foreground">
                      <UserX size={14} /> Ban
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'economy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="folk-card border-2 border-border bg-card">
            <CardHeader><CardTitle className="font-black italic text-foreground tracking-tight">Currency Management</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent/5 border border-accent/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Coins className="text-accent" />
                    <span className="font-black uppercase text-xs tracking-widest text-accent">Gold Reserve</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={editGold} onChange={e => setEditGold(parseInt(e.target.value))} className="w-24 p-2 bg-background border border-border rounded-lg text-right font-mono" />
                    <Button onClick={() => adminSetCurrency({ gold: editGold })} size="sm">Set</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-accent/5 border border-accent/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Heart className="text-accent" />
                    <span className="font-black uppercase text-xs tracking-widest text-accent">Gem Reserve</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={editGems} onChange={e => setEditGems(parseInt(e.target.value))} className="w-24 p-2 bg-background border border-border rounded-lg text-right font-mono" />
                    <Button onClick={() => adminSetCurrency({ gems: editGems })} size="sm">Set</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="folk-card border-2 border-border bg-card">
            <CardHeader><CardTitle className="font-black italic text-foreground tracking-tight">Stockpile Injection</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Item ID</label>
                  <input type="text" value={addItemId} onChange={e => setAddItemId(e.target.value)} className="w-full p-3 bg-muted/30 border border-border rounded-xl font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Quantity</label>
                  <input type="number" value={addItemCount} onChange={e => setAddItemCount(parseInt(e.target.value))} className="w-full p-3 bg-muted/30 border border-border rounded-xl font-mono text-sm" />
                </div>
              </div>
              <Button onClick={() => {
                adminAddItem(addItemId, addItemCount);
                showNotification({ title: "Items Added", message: `Successfully injected ${addItemCount}x ${addItemId} into inventory.`, type: "success" });
              }} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/10">Inject into Inventory</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'genetics' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="folk-card border-2 border-border bg-card">
            <CardHeader><CardTitle className="font-black italic text-foreground tracking-tight">Genetics Lab (Fox Spawner)</CardTitle></CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Biological Gender</label>
                  <div className="flex gap-2">
                    {['Dog', 'Vixen'].map(g => (
                      <Button key={g} variant={spawnGender === g ? 'default' : 'outline'} onClick={() => setSpawnGender(g as "Dog" | "Vixen")} className="flex-1 rounded-xl h-11 font-black uppercase tracking-widest text-[10px]">{g}</Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Silver Intensity</label>
                  <div className="flex items-center gap-4">
                    <input type="range" min="1" max="5" value={silverIntensity} onChange={e => setSilverIntensity(parseInt(e.target.value))} className="flex-1" />
                    <span className="font-mono font-black text-primary">{silverIntensity}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Genotype Configuration</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {Object.entries(spawnGenotype).map(([locus, alleles]) => (
                    <div key={locus} className="p-3 bg-muted/20 border border-border rounded-2xl">
                      <div className="text-[8px] font-black text-muted-foreground uppercase mb-2 tracking-widest">{locus}</div>
                      <div className="flex gap-1">
                        {alleles.map((a, i) => (
                          <input
                            key={i}
                            type="text"
                            value={a}
                            maxLength={2}
                            onChange={e => {
                              const next = { ...spawnGenotype };
                              next[locus][i] = e.target.value;
                              setSpawnGenotype(next);
                            }}
                            className="w-full h-8 bg-background border border-border rounded-lg text-center font-mono text-xs font-black uppercase"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Base Eye Color</label>
                  <select value={baseEyeColor} onChange={e => setBaseEyeColor(e.target.value)} className="w-full p-3 bg-muted/30 border border-border rounded-xl font-bold text-sm">
                    <option value="Random">Genetic Random</option>
                    {getBaseEyeColors(spawnGenotype).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">White Marking Effect</label>
                  <select value={whiteMarkingEffect} onChange={e => setWhiteMarkingEffect(e.target.value as "None" | "Blue" | "Blue Heterochromia")} className="w-full p-3 bg-muted/30 border border-border rounded-xl font-bold text-sm">
                    {getWhiteMarkingOptions(spawnGenotype).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <Button onClick={handleSpawnFox} className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                <Plus size={20} /> Spawn Specified Fox
              </Button>
            </CardContent>
          </Card>

          <Card className="folk-card border-2 border-border bg-card">
            <CardHeader><CardTitle className="font-black italic text-foreground tracking-tight">Fox Management & Stats</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Target Fox ID</label>
                <div className="flex gap-2">
                  <input type="text" value={selectedFoxId || ''} onChange={e => setSelectedFoxId(e.target.value)} placeholder="Enter Fox ID..." className="flex-1 p-3 bg-muted/30 border border-border rounded-xl font-mono text-sm" />
                  <Button variant="outline" onClick={() => setSelectedFoxId('')}>Clear</Button>
                </div>
              </div>

              <div className="space-y-4">
                {selectedFoxId && foxes[selectedFoxId] && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(modStats).map(([stat, val]) => (
                      <div key={stat} className="flex flex-col gap-1">
                        <label className="text-[8px] font-black text-muted-foreground uppercase">{stat}</label>
                        <input
                          type="number"
                          value={val}
                          onChange={e => setModStats(prev => ({ ...prev, [stat]: parseInt(e.target.value) }))}
                          className="p-2 bg-muted/30 border border-border rounded-lg text-sm font-mono text-foreground"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <Button disabled={!selectedFoxId} onClick={handleUpdateStats} className="w-full bg-secondary hover:bg-secondary/90 text-primary-foreground font-black uppercase tracking-widest h-12 rounded-2xl shadow-lg shadow-secondary/10">Save Stat Changes</Button>
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
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Vertical Focus ({bannerPosition})</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={parseInt(bannerPosition)}
                  onChange={e => setBannerPosition(`${e.target.value}%`)}
                  className="w-full accent-primary"
                />
              </div>

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
                    className="text-[10px] font-bold"
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
          </Card>
        </div>
      )}

      {activeTab === 'logs' && (
        <Card className="folk-card border-2 border-border bg-card">
          <CardHeader><CardTitle className="font-black italic text-foreground tracking-tight">Admin Activity Log</CardTitle></CardHeader>
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
          <CardHeader><CardTitle className="font-black italic text-foreground tracking-tight">System Controls</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Button variant="outline" className="h-28 flex flex-col gap-3 rounded-[2rem] border-2 group hover:border-primary/30 transition-all font-black uppercase text-[10px] tracking-widest" onClick={advanceTime}>
                <FastForward size={24} className="text-primary group-hover:scale-110 transition-transform" />
                <span>Next Season</span>
              </Button>
              <Button variant="outline" className="h-28 flex flex-col gap-3 rounded-[2rem] border-2 group hover:border-destructive/30 transition-all font-black uppercase text-[10px] tracking-widest" onClick={() => {
                showNotification({
                  title: "Wipe Game Data?",
                  message: "Are you sure you want to reset all game data? This action is permanent and will refresh the page.",
                  type: "error",
                  confirmLabel: "Reset Data",
                  onConfirm: () => {
                    localStorage.removeItem('red-fox-sim-storage');
                    window.location.reload();
                  }
                });
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

