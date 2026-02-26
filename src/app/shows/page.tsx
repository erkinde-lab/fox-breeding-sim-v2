'use client';
import { cn } from '@/lib/utils';
import { ScoreBreakdown } from '@/components/ScoreBreakdown';


import React, { useState } from 'react';
import { useGameStore, Show } from '@/lib/store';
import {
  Trophy, History, Search, Plus, Check, ChevronRight,
  Settings, Trash2, Edit2, Users, Info, HelpCircle,
  Activity, Sparkles, Dumbbell, Shield
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isFoxEligibleForShow, ShowLevel, ShowClass } from '@/lib/showing';

export default function ShowsPage() {
  const {
    foxes, shows, showReports, year, season, joiningYear, isAdmin,
    addShow, removeShow, updateShow, enterFoxInShow, runShows, generateSeasonalShows
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'available' | 'amateur' | 'history' | 'manage'>('available');
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Editing State
  const [editingShowId, setEditingShowId] = useState<string | null>(null);
  const [newShowName, setNewShowName] = useState('');
  const [newShowLevel, setNewShowLevel] = useState<ShowLevel>('Open');
  const [newShowClass, setNewShowClass] = useState<ShowClass>('Best Adult Dog');

  const isAmateurEligible = year <= joiningYear + 1;

  const filteredShows = shows.filter(show => {
    const isAmateur = show.level.startsWith("Amateur");
    if (activeTab === 'amateur' && !isAmateur) return false;
    if (activeTab === 'available' && isAmateur) return false;

    return show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           show.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedShow = shows.find(s => s.id === selectedShowId);
  const eligibleFoxes = selectedShow
    ? Object.values(foxes).filter(f => isFoxEligibleForShow(f, selectedShow.level, selectedShow.type, season))
    : [];

  const handleAddShow = () => {
    if (!newShowName) return;
    if (editingShowId) {
      updateShow(editingShowId, {
        name: newShowName,
        level: newShowLevel,
        type: newShowClass
      });
      setEditingShowId(null);
    } else {
      addShow({
        id: Math.random().toString(36).substring(2, 9),
        name: newShowName,
        level: newShowLevel,
        type: newShowClass,
        entries: [],
        isRun: false
      });
    }
    setNewShowName('');
  };

  const handleEditShow = (show: Show) => {
    setEditingShowId(show.id);
    setNewShowName(show.name);
    setNewShowLevel(show.level);
    setNewShowClass(show.type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-5xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Show Arena</h2>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black px-3 py-1 uppercase tracking-widest text-[10px]">
              Year {year} • {season}
            </Badge>
            {isAmateurEligible && (
               <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20 font-black px-3 py-1 uppercase tracking-widest text-[10px]">
                Amateur Qualified
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={runShows} className="gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-primary/20">
            <Trophy size={18} /> Run All Entered Shows
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <nav className="flex flex-col gap-1">
            {[
              { id: 'available', label: 'Pro Circuit', icon: Trophy },
              { id: 'amateur', label: 'Amateur Arena', icon: Users, disabled: !isAmateurEligible },
              { id: 'history', label: 'Recent Results', icon: History },
              { id: 'manage', label: 'Admin: Manage', icon: Settings, adminOnly: true },
            ].map(tab => (
              (tab.adminOnly ? isAdmin : true) && (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as 'amateur' | 'junior' | 'open' | 'senior' | 'altered' | 'history' | 'manage'); setSelectedShowId(null); }}
                  disabled={tab.disabled}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-2"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    tab.disabled && "opacity-30 cursor-not-allowed grayscale"
                  )}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              )
            ))}
          </nav>
        </div>

        <div className="lg:col-span-9">
          {activeTab === 'history' ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-black italic text-foreground tracking-tight">Recent Show Reports</h3>
              {showReports.length === 0 ? (
                <div className="py-20 text-center bg-card rounded-[40px] border-2 border-dashed border-border text-muted-foreground italic">No shows have been run recently.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showReports.map((report, idx) => (
                    <Card key={idx} className="folk-card border-border overflow-hidden group">
                      <CardHeader className="bg-muted/30 pb-3 border-b border-border">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-black uppercase tracking-widest">{report.level} Show</CardTitle>
                          <Badge variant="outline" className="text-[9px] font-black uppercase bg-background">{report.season} Y{report.year}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        {report.results.slice(0, 3).map((res, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <span className={cn("w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black", i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-slate-100 text-slate-700" : "bg-orange-100 text-orange-700")}>{i + 1}</span>
                                <span className="font-bold text-foreground">{foxes[res.foxId]?.name || `Fox #${res.foxId}`}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-[9px] font-bold px-1.5 h-4">{res.class}</Badge>
                                <span className="text-xs font-black text-muted-foreground">{res.score} score ({res.pointsAwarded} pts)</span>
                              </div>
                            </div>

                            {res.breakdown && (
                               <div className="hidden group-hover:grid grid-cols-3 gap-1 px-7 py-2 bg-muted/20 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
                                  <div className="text-[8px] font-black uppercase text-muted-foreground/60">Base: <span className="text-foreground">{res.breakdown.base}</span></div>
                                  <div className="text-[8px] font-black uppercase text-muted-foreground/60">Groom: <span className="text-foreground">+{res.breakdown.grooming}</span></div>
                                  <div className="text-[8px] font-black uppercase text-muted-foreground/60">Train: <span className="text-foreground">+{res.breakdown.training}</span></div>
                                  <div className="text-[8px] font-black uppercase text-muted-foreground/60">Luck: <span className="text-foreground">+{res.breakdown.luck}</span></div>
                                  {res.breakdown.veterinary > 0 && <div className="text-[8px] font-black uppercase text-muted-foreground/60">Vet: <span className="text-foreground">+{res.breakdown.veterinary}</span></div>}
                                  {res.breakdown.penalties < 0 && <div className="text-[8px] font-black uppercase text-destructive">Penalty: <span className="text-destructive">{res.breakdown.penalties}</span></div>}
                               </div>
                            )}
                          </div>
                        ))}
                        {report.bestInShowFoxId && (
                           <div className="pt-3 mt-3 border-t border-border flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1"><Trophy size={12}/> Best In Show</span>
                              <span className="text-xs font-black italic">{foxes[report.bestInShowFoxId]?.name}</span>
                           </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'manage' ? (
            <div className="space-y-8">
              <Card className="folk-card border-border shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-black italic text-foreground tracking-tight uppercase">
                    {editingShowId ? "Edit Show" : "Generate New Show"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Show Name</label>
                      <input
                        type="text"
                        value={newShowName}
                        onChange={(e) => setNewShowName(e.target.value)}
                        className="w-full bg-muted/50 border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        placeholder="e.g. Winter Classic"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Level</label>
                      <select
                        value={newShowLevel}
                        onChange={(e) => setNewShowLevel(e.target.value as ShowLevel)}
                        className="w-full bg-muted/50 border border-border p-3 rounded-xl"
                      >
                        {["Junior", "Open", "Senior", "Championship", "Amateur Junior", "Amateur Open", "Amateur Senior"].map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Class</label>
                      <select
                        value={newShowClass}
                        onChange={(e) => setNewShowClass(e.target.value as ShowClass)}
                        className="w-full bg-muted/50 border border-border p-3 rounded-xl"
                      >
                        {["Best Juvenile Dog", "Best Juvenile Vixen", "Best Adult Dog", "Best Adult Vixen", "Red Specialty", "Silver Specialty", "Gold Specialty", "Cross Specialty", "Exotic Specialty"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleAddShow} className="flex-1 h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl">
                      {editingShowId ? "Update Show" : "Create New Show"}
                    </Button>
                    {editingShowId && (
                      <Button onClick={() => { setEditingShowId(null); setNewShowName(''); }} variant="outline" className="h-14 px-8 rounded-2xl">Cancel</Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black italic text-foreground tracking-tight">Active Shows</h3>
                    <Button variant="outline" onClick={generateSeasonalShows} size="sm" className="font-black uppercase tracking-widest text-[10px] h-8 rounded-lg border-primary/20 text-primary">Reset to Defaults</Button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shows.map(s => (
                      <Card key={s.id} className="folk-card border-border group">
                        <div className="p-4 flex items-center justify-between">
                           <div>
                              <p className="font-bold text-foreground">{s.name}</p>
                              <div className="flex gap-2 mt-1">
                                 <Badge variant="outline" className="text-[8px] uppercase">{s.level}</Badge>
                                 <Badge variant="outline" className="text-[8px] uppercase">{s.type}</Badge>
                              </div>
                           </div>
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" onClick={() => handleEditShow(s)} className="text-primary">
                                 <Edit2 size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => removeShow(s.id)} className="text-destructive">
                                 <Trash2 size={16} />
                              </Button>
                           </div>
                        </div>
                      </Card>
                    ))}
                 </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-8 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder="Search shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-card border border-border pl-10 pr-4 py-3 rounded-2xl"
                  />
                </div>

                <div className="space-y-3">
                  {filteredShows.length === 0 ? (
                    <div className="py-20 text-center bg-card/50 rounded-[32px] border-2 border-dashed border-border text-muted-foreground italic">No shows found.</div>
                  ) : filteredShows.map(show => (
                    <Card
                      key={show.id}
                      className={cn(
                        "folk-card border-2 transition-all cursor-pointer",
                        selectedShowId === show.id ? "border-primary bg-primary/5 -translate-y-1" : "border-border hover:border-border/80"
                      )}
                      onClick={() => setSelectedShowId(show.id)}
                    >
                      <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-3 rounded-2xl",
                            selectedShowId === show.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            <Trophy size={20} />
                          </div>
                          <div>
                            <h4 className="font-black italic text-lg text-foreground tracking-tight uppercase tracking-widest">{show.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[9px] font-bold uppercase">{show.level}</Badge>
                              <Badge variant="outline" className="text-[9px] font-bold uppercase">{show.type}</Badge>
                              <span className="text-[10px] font-black text-muted-foreground/40 uppercase ml-2">{show.entries.length} Entries</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={20} className={cn("text-muted-foreground transition-transform", selectedShowId === show.id && "translate-x-1 text-primary")} />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="xl:col-span-4">
                {selectedShow ? (
                  <Card className="folk-card border-2 border-primary/20 shadow-xl sticky top-24">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                      <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Enter {selectedShow.type}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        {eligibleFoxes.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic p-4 bg-muted/30 rounded-xl border border-dashed border-border text-center leading-relaxed">No qualified foxes found for this show.<br/>Foxes must be named, fed, healthy, and not retired.</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {eligibleFoxes.map(fox => {
                              const isEntered = selectedShow.entries.includes(fox.id);
                              return (
                                <button
                                  key={fox.id}
                                  onClick={() => enterFoxInShow(fox.id, selectedShow.id)}

                                  className={cn(
                                    "flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left overflow-visible relative",
                                    isEntered
                                      ? "bg-green-500/10 border-green-500/30 text-green-700"
                                      : "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
                                  )}
                                >
                                  <div className="flex flex-col"><span className="text-sm font-black italic">{fox.name}</span><div className="flex items-center gap-2 mt-0.5"><ScoreBreakdown fox={fox}><Info size={10} className="text-primary cursor-help" /></ScoreBreakdown><span className="text-[9px] font-bold text-muted-foreground uppercase">View Stats Breakdown</span></div></div>
                                  {isEntered ? <Check size={14} /> : <Plus size={14} />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center bg-card rounded-[32px] border-2 border-dashed border-border text-muted-foreground p-8 text-center sticky top-24">
                    <Trophy size={48} className="opacity-10 mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">Select a show</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
