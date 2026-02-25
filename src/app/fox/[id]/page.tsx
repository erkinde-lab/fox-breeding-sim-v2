'use client';
import Link from 'next/link';


import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Edit2, Save, X, Sparkles, Dumbbell, Utensils,
  ChevronDown, Heart, Activity, Calendar, Dna, Info,
  Trophy, Check, ShoppingBag, Activity as ActivityIcon, Coins, Diamond, Medal
} from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import { isHungry, isGroomed, isTrained, calculateCOI, Fox, getActiveBoosts, getFormattedName } from '@/lib/genetics';
import { useNotifications } from '@/components/NotificationProvider';

export default function FoxProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { 
    foxes, breedingHistory, foundationFoxes, npcStuds, applyItem, renameFox, sellFox, retireFox, spayNeuterFox,
    isAdmin, toggleStudStatus, hiredGroomer, hiredGeneticist, season, listFoxOnMarket, cancelListing, marketListings, updateFox
  } = useGameStore();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState('supplies');
  const [isFeedDropdownOpen, setIsFeedDropdownOpen] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [listPrice, setListPrice] = useState(1000);
  const [listCurrency, setListCurrency] = useState<'gold' | 'gems'>('gold');

  const fox = foxes[id as string] || foundationFoxes.find(f => f.id === id) || Object.values(npcStuds).find(f => f.id === id);
  const isFoundational = !foxes[id as string];
  const [newName, setNewName] = useState(fox?.name || '');

  if (!fox) return <div className="py-20 text-center font-black uppercase tracking-widest text-muted-foreground">Fox not found</div>;

  const foxIds = Object.keys(foxes).sort();
  const currentIndex = foxIds.indexOf(fox.id);
  const prevId = currentIndex > 0 ? foxIds[currentIndex - 1] : null;
  const nextId = currentIndex < foxIds.length - 1 ? foxIds[currentIndex + 1] : null;

  const hungry = isHungry(fox);
  const groomed = isGroomed(fox);
  const trained = isTrained(fox);
  const activeBoosts = getActiveBoosts(fox);
  const foxHistory = (breedingHistory || []).filter(h => h.sireId === fox.id || h.damId === fox.id);

  const handleRename = () => {
    if (newName.trim()) {
      if (Object.values(foxes).some(f => f.name.toLowerCase() === newName.toLowerCase() && f.id !== fox.id)) {
        addNotification("This name is already taken by another fox!", "destructive");
        return;
      }
      renameFox(fox.id, newName);
      setIsEditing(false);
    }
  };

  const handleReveal = () => applyItem('genetic-test', fox.id);
  const handleAnalyze = () => applyItem('pedigree-analysis', fox.id);

  const handleList = () => {
    listFoxOnMarket(fox.id, listPrice, listCurrency);
    setIsListing(false);
    addNotification("Fox listed on marketplace!", "success");
    router.push("/shop/marketplace");
  };

  const handleRetire = () => {
    if (fox.age < 6) {
      addNotification("Foxes must be at least 6 years old to retire.", "destructive");
      return;
    }
    if (confirm("Retire this fox? This cannot be undone.")) {
      retireFox(fox.id);
      router.push("/kennel");
    }
  };





  const feedOptions = [
    { id: 'supplies', label: 'Premium Feed' },
    { id: 'feed-head', label: 'Cranial Crunch' },
    { id: 'feed-topline', label: 'Spine Support' },
    { id: 'feed-forequarters', label: 'Shoulder Strength' },
    { id: 'feed-hindquarters', label: 'Hip Health' },
    { id: 'feed-tail', label: 'Brush Boost' },
    { id: 'feed-coatQuality', label: 'Lustrous Layers' },
    { id: 'feed-temperament', label: 'Calm Kibble' },
    { id: 'feed-presence', label: 'Showstopper Snack' },
  ];

  const handleFeed = () => {
    applyItem(selectedFeed, fox.id);
  };

  const handleSetPreferredFeed = (feedId: string) => {
    updateFox(fox.id, { preferredFeed: feedId });
    setSelectedFeed(feedId);
  };

  const goToKennel = () => {
    if (fox.age < 1) router.push('/kennel?tab=young');
    else if (fox.isRetired) router.push('/kennel?tab=retired');
    else router.push('/kennel?tab=adult');
  };

  const getStat = (key: keyof typeof fox.stats, bonus = 0) => {
    const base = fox.stats[key];
    const boost = activeBoosts[key] || 0;
    const totalBonus = boost + bonus;
    return { value: base + totalBonus, bonus: totalBonus };
  };

  const groomFox = (fid: string) => { applyItem('grooming-kit', fid); };
  const trainFox = (fid: string) => { applyItem('training-session', fid); };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/50 p-4 rounded-3xl border border-border/50">
        <Button onClick={goToKennel} variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft size={16} /> Kennel
        </Button>

        <div className="flex flex-wrap gap-2">
          {!isFoundational && (
            <>
              <Button
                onClick={() => toggleStudStatus(fox.id, 500)}
                variant={fox.isAtStud ? "default" : "outline"}
                className={`rounded-xl font-black uppercase tracking-widest text-[10px] h-9 ${fox.isAtStud ? "bg-primary" : ""}`}
              >
                {fox.isAtStud ? "Listed at Stud" : "List for Stud"}
              </Button>
              <Button
                onClick={() => {
                  if(fox.age < 6) {
                    addNotification("Foxes must be at least 6 years old to retire.", "destructive");
                    return;
                  }
                  if(confirm("Retire or sell this fox?")) { retireFox(fox.id); router.push('/kennel'); }
                }}
                variant="destructive"
                className={`rounded-xl font-black uppercase tracking-widest text-[10px] h-9 ${fox.age < 6 ? "opacity-50 grayscale cursor-not-allowed" : ""}`}
              >
                Retire/Sell
              </Button>
              <Button
                onClick={() => {
                  if(fox.age < 1) {
                    addNotification("Foxes must be at least 1 year old to be altered.", "destructive");
                    return;
                  }
                  if(confirm("Spay/Neuter this fox? This is permanent and will remove them from breeding.")) { spayNeuterFox(fox.id); }
                }}
                variant="outline"
                disabled={fox.isAltered}
                className="rounded-xl font-black uppercase tracking-widest text-[10px] h-9"
              >
                {fox.isAltered ? "Altered" : "Spay/Neuter"}
              </Button>
            </>
          )}
        </div>
      </div>

            {isListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <Card className="w-full max-w-md folk-card border-2 border-primary/20 shadow-2xl rounded-[40px] overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Sell {getFormattedName(fox)}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 block">Set Price</label>
                    <div className="relative">
                       <input
                         type="number"
                         value={listPrice}
                         onChange={(e) => setListPrice(parseInt(e.target.value) || 0)}
                         className="w-full bg-muted border border-border rounded-xl px-4 py-3 font-black text-lg focus:ring-2 focus:ring-primary outline-none"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {listCurrency === 'gold' ? <Coins size={20} className="text-yellow-600"/> : <Diamond size={20} className="text-cyan-600"/>}
                       </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 block">Currency</label>
                    <div className="grid grid-cols-2 gap-2">
                       <Button
                         variant={listCurrency === 'gold' ? 'default' : 'outline'}
                         onClick={() => setListCurrency('gold')}
                         className="rounded-xl font-black uppercase tracking-widest text-xs"
                       >Gold</Button>
                       <Button
                         variant={listCurrency === 'gems' ? 'default' : 'outline'}
                         onClick={() => setListCurrency('gems')}
                         className="rounded-xl font-black uppercase tracking-widest text-xs"
                       >Gems</Button>
                    </div>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Button onClick={handleList} className="flex-1 h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">List on Market</Button>
                  <Button onClick={() => setIsListing(false)} variant="ghost" className="flex-1 h-12 font-black uppercase tracking-widest rounded-xl">Cancel</Button>
               </div>
            </CardContent>
          </Card>
        </div>
      )}
            {isListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <Card className="w-full max-w-md folk-card border-2 border-primary/20 shadow-2xl rounded-[40px] overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Sell {getFormattedName(fox)}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 block">Set Price</label>
                    <div className="relative">
                       <input
                         type="number"
                         value={listPrice}
                         onChange={(e) => setListPrice(parseInt(e.target.value) || 0)}
                         className="w-full bg-muted border border-border rounded-xl px-4 py-3 font-black text-lg focus:ring-2 focus:ring-primary outline-none"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {listCurrency === 'gold' ? <Coins size={20} className="text-yellow-600"/> : <Diamond size={20} className="text-cyan-600"/>}
                       </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 block">Currency</label>
                    <div className="grid grid-cols-2 gap-2">
                       <Button
                         variant={listCurrency === 'gold' ? 'default' : 'outline'}
                         onClick={() => setListCurrency('gold')}
                         className="rounded-xl font-black uppercase tracking-widest text-xs"
                       >Gold</Button>
                       <Button
                         variant={listCurrency === 'gems' ? 'default' : 'outline'}
                         onClick={() => setListCurrency('gems')}
                         className="rounded-xl font-black uppercase tracking-widest text-xs"
                       >Gems</Button>
                    </div>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Button onClick={handleList} className="flex-1 h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">List on Market</Button>
                  <Button onClick={() => setIsListing(false)} variant="ghost" className="flex-1 h-12 font-black uppercase tracking-widest rounded-xl">Cancel</Button>
               </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Illustration & Quick Stats */}
        <div className="xl:col-span-4 space-y-6">
          <div className="folk-card overflow-hidden bg-card border-2 border-border rounded-[48px] flex flex-col relative shadow-sm">
             <div className="aspect-square flex items-center justify-center p-12 bg-muted/30">
                <FoxIllustration phenotype={fox.phenotype} baseColor={fox.baseColor} pattern={fox.pattern} eyeColor={fox.eyeColor} size={32} />

                {/* Status Badges */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                   <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm backdrop-blur-md ${hungry ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-primary/10 border-primary/20 text-primary"}`}>
                      <Utensils size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{hungry ? "Hungry" : "Fed"}</span>
                   </div>
                   <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm backdrop-blur-md ${!groomed ? "bg-muted/50 border-border/50 text-muted-foreground" : "bg-secondary/10 border-secondary/20 text-secondary"}`}>
                      <Sparkles size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{groomed ? "Groomed" : "Rough"}</span>
                   </div>
                   <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm backdrop-blur-md ${!trained ? "bg-muted/50 border-border/50 text-muted-foreground" : "bg-orange-500/10 border-orange-500/20 text-orange-500"}`}>
                      <Dumbbell size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{trained ? "Trained" : "Idle"}</span>
                   </div>
                </div>
             </div>

             <div className="p-8 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                   {isEditing ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="text-2xl font-black p-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none w-full bg-background"
                        />
                        <Button onClick={handleRename} size="sm" className="bg-primary h-10 w-10 p-0 rounded-xl"><Save size={18} /></Button>
                        <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="text-destructive h-10 w-10 p-0 rounded-xl"><X size={18} /></Button>
                      </div>
                   ) : (
                      <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black italic text-foreground tracking-tight uppercase flex items-center gap-2">{getFormattedName(fox)} {(fox.bisWins || 0) > 0 && <Medal className="text-yellow-500" size={24} />}</h1>
                        {!isFoundational && !fox.hasBeenRenamed && (
                          <button onClick={() => setIsEditing(true)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                   )}
                   <Badge variant="outline" className={`font-black uppercase tracking-widest ${fox.gender === 'Dog' ? 'text-blue-500' : 'text-rose-500'}`}>
                      {fox.gender}
                   </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-tight">
                   <span>{fox.age === 0 ? ((['Spring', 'Summer'].includes(season)) ? 'Newborn' : 'Juvenile') : fox.age + 'y'}</span>
                   <span className="w-1 h-1 rounded-full bg-border" />
                   <span>{fox.phenotype}</span>
                   <span className="w-1 h-1 rounded-full bg-border" />
                   <span>{fox.eyeColor} Eyes</span>
                </div>
             </div>
          </div>

          {/* Quick Actions Card */}
          {!isFoundational && (
            <Card className="folk-card border-2 border-border shadow-sm rounded-[32px] overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => groomFox(fox.id)}
                    disabled={groomed}
                    variant="outline"
                    className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 border-secondary/20 hover:bg-secondary/5 hover:text-secondary disabled:opacity-50"
                  >
                    <Sparkles size={14} /> Groom
                  </Button>
                  <Button
                    onClick={() => trainFox(fox.id)}
                    disabled={trained}
                    variant="outline"
                    className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 border-orange-500/20 hover:bg-orange-500/5 hover:text-orange-500 disabled:opacity-50"
                  >
                    <Dumbbell size={14} /> Train
                  </Button>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Button
                      onClick={() => setIsFeedDropdownOpen(!isFeedDropdownOpen)}
                      variant="outline"
                      className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 justify-between px-4"
                    >
                      <span className="truncate">{feedOptions.find(f => f.id === selectedFeed)?.label}</span>
                      <ChevronDown size={14} />
                    </Button>
                    {isFeedDropdownOpen && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-2xl shadow-xl z-10 max-h-48 overflow-y-auto p-1">
                        {feedOptions.map(option => (
                          <button
                            key={option.id}
                            onClick={() => { setSelectedFeed(option.id); setIsFeedDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-muted rounded-xl"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleFeed}
                    disabled={!hungry && selectedFeed === 'supplies'}
                    className="h-12 w-12 rounded-2xl bg-primary hover:bg-primary/90 p-0"
                  >
                    <Utensils size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle Column: Stats */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="folk-card border-2 border-border shadow-sm rounded-[48px] overflow-hidden">
            <CardHeader className="bg-muted/30 p-8 border-b border-border">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-xl text-primary"><Trophy size={20} /></div>
                 <CardTitle className="text-xl font-black italic tracking-tight uppercase">Show Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <StatBar label="Head" {...getStat('head')} />
                <StatBar label="Topline" {...getStat('topline')} />
                <StatBar label="Forequarters" {...getStat('forequarters')} />
                <StatBar label="Hindquarters" {...getStat('hindquarters')} />
                <StatBar label="Tail" {...getStat('tail')} />
                <StatBar label="Coat Quality" {...getStat('coatQuality', groomed ? 5 : 0)} />
                <StatBar label="Temperament" {...getStat('temperament', trained ? 3 : 0)} />
                <StatBar label="Presence" {...getStat('presence', trained ? 3 : 0)} />
                <StatBar label="Luck" value={fox.stats.luck} />
                <StatBar label="Fertility" value={fox.stats.fertility} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Genetics & History */}
        <div className="xl:col-span-4 space-y-6">
          {/* Genotype Card */}
          <Card className="folk-card border-2 border-border shadow-sm rounded-[40px] overflow-hidden">
            <CardHeader className="bg-muted/30">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Dna size={16} /></div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest">Genotype</CardTitle>
                  </div>
                  {!fox.genotypeRevealed && !isFoundational && (
                    <Button onClick={handleReveal} size="sm" variant="ghost" className="text-[10px] font-black uppercase tracking-widest gap-1 hover:text-blue-500 p-0 h-auto">
                      <ShoppingBag size={12} /> Reveal
                    </Button>
                  )}
               </div>
            </CardHeader>
            <CardContent className="p-6">
                {fox.genotypeRevealed ? (
                   <div className="grid grid-cols-2 gap-2">
                      {Object.entries(fox.genotype).map(([locus, alleles]) => (
                        <div key={locus} className="px-3 py-2 rounded-xl bg-muted/50 border border-border/50 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                          <span className="text-[10px] font-black text-muted-foreground/60 uppercase">{locus}</span>
                          <span className="font-mono text-xs font-black text-foreground">{alleles.join('')}</span>
                        </div>
                      ))}
                   </div>
                ) : (
                  <div className="py-8 px-4 bg-muted/30 border-2 border-dashed border-border rounded-2xl text-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Genotype Hidden</p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Health & History */}
          <Card className="folk-card border-2 border-border shadow-sm rounded-[40px] overflow-hidden">
             <CardContent className="p-6 space-y-6">
                <div>
                   <h4 className="text-[10px] font-black text-muted-foreground uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                      <ActivityIcon size={14} /> Health
                   </h4>
                   {fox.healthIssues.length > 0 ? (
                      <div className="space-y-2">
                         {fox.healthIssues.map(issue => (
                           <Badge key={issue} variant="destructive" className="w-full justify-center h-8 font-black text-[9px] uppercase tracking-widest rounded-lg">
                              {issue}
                           </Badge>
                         ))}
                      </div>
                   ) : (
                      <div className="px-4 py-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3 text-primary">
                         <Check size={16} className="shrink-0" />
                         <span className="text-xs font-black uppercase tracking-widest">Perfect Health</span>
                      </div>
                   )}
                </div>

                <div className="pt-6 border-t border-border">
                   <h4 className="text-[10px] font-black text-muted-foreground uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                      <Calendar size={14} /> History
                   </h4>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase">Birth Year</span>
                         <span className="text-xs font-black font-mono">{fox.birthYear}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase">Lifetime Points</span>
                         <span className="text-xs font-black font-mono">{fox.pointsLifetime.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border/50">
                         <div className="flex items-center gap-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase">COI</span>
                            {!fox.pedigreeAnalyzed && !isFoundational && (
                               <button onClick={handleAnalyze} className="text-xs text-primary hover:underline font-black uppercase tracking-tighter">Analyze</button>
                            )}
                         </div>
                         <span className="text-xs font-black font-mono">
                            {fox.pedigreeAnalyzed ? `${calculateCOI(fox.id, foxes)}%` : '???'}
                         </span>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

            {/* Breeding History */}
      {!isFoundational && foxHistory.length > 0 && (
        <Card className="folk-card border-2 border-border shadow-sm rounded-[48px] overflow-hidden">
          <CardHeader className="bg-muted/30 p-8 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500"><Heart size={20} /></div>
              <CardTitle className="text-xl font-black italic tracking-tight uppercase">Breeding History</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {foxHistory.map((record) => {
                const isSire = record.sireId === fox.id;
                const mateName = isSire ? record.damName : record.sireName;
                const mateId = isSire ? record.damId : record.sireId;

                return (
                  <div key={record.id} className="p-6 rounded-3xl bg-muted/20 border border-border/50 flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Mated With</div>
                      {mateId ? (
                        <Link href={`/fox/${mateId}`} className="font-black italic text-lg text-foreground hover:text-primary transition-colors">{mateName}</Link>
                      ) : (
                        <span className="font-black italic text-lg text-foreground">{mateName}</span>
                      )}
                      <div className="text-xs font-bold text-muted-foreground mt-1">Year {record.year}, {record.season}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Offspring Produced</div>
                      <div className="flex flex-wrap gap-2">
                        {record.kits.map((kit, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-xl bg-card border border-border shadow-sm flex items-center gap-2">
                            {kit.id ? (
                              <Link href={`/fox/${kit.id}`} className="text-xs font-bold hover:text-primary transition-colors">{kit.name}</Link>
                            ) : (
                              <span className="text-xs font-bold text-muted-foreground/60">{kit.name}</span>
                            )}
                            <Badge variant="outline" className="text-[8px] uppercase font-black">{kit.phenotype}</Badge>
                            {kit.isStillborn && <span className="text-[8px] font-black text-destructive uppercase italic">Stillborn</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Width Pedigree at bottom */}
      <Card className="folk-card border-2 border-border shadow-sm rounded-[48px] overflow-hidden">
        <CardHeader className="bg-muted/30 p-8 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500"><Heart size={20} /></div>
              <CardTitle className="text-xl font-black italic tracking-tight uppercase">Ancestry & Pedigree</CardTitle>
            </div>
            {fox.pedigreeAnalyzed && (
               <div className="px-4 py-1.5 rounded-full bg-background border border-border shadow-sm text-xs font-black uppercase tracking-widest">
                  Inbreeding: <span className="text-rose-500 ml-1">{calculateCOI(fox.id, foxes)}%</span>
               </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8 overflow-x-auto">
           <div className="min-w-[800px] flex justify-center">
              <PedigreeTree foxId={fox.id} foxes={foxes} />
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatBar({ label, value, bonus = 0 }: { label: string; value: number; bonus?: number }) {
  const maxValue = label === 'Fertility' ? 75 : 100;
  const percentage = Math.min(100, (value / maxValue) * 100);
  const baseValue = value - bonus;
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="flex items-center gap-1 font-mono text-xs text-foreground">
            {baseValue}
            {bonus > 0 && <span className="text-green-500 font-black">+{bonus}</span>}
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner p-0.5 border border-border/50">
        <div 
          className="h-full bg-primary rounded-full transition-all shadow-[0_0_8px_rgba(var(--primary),0.3)]"
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}

function PedigreeTree({ foxId, foxes, depth = 0 }: { foxId: string | null; foxes: Record<string, Fox>; depth?: number }) {
  if (depth >= 5) return null;
  const fox = foxId ? foxes[foxId] : null;

  return (
    <div className="flex items-center gap-4">
      <div className={`w-36 p-3 border-2 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center text-center ${
        fox ? "border-border bg-card hover:border-primary/30 group" : "border-border/30 bg-muted/20 text-muted-foreground/30 italic border-dashed"
      }`}>
        {fox ? (
          <Link href={`/fox/${fox.id}`} className="w-full flex flex-col items-center">
            <div className="font-black text-foreground uppercase tracking-tight truncate w-full text-[10px] group-hover:text-primary transition-colors">{getFormattedName(fox)}</div>
            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest truncate w-full">{fox.phenotype}</div>
          </Link>
        ) : (
          <div className="text-[10px] font-black">?</div>
        )}
      </div>
      
      {depth < 4 && (
        <div className="flex flex-col gap-2 relative">
          <PedigreeTree foxId={fox?.parents[0] || null} foxes={foxes} depth={depth + 1} />
          <PedigreeTree foxId={fox?.parents[1] || null} foxes={foxes} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}