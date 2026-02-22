'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Edit2, Save, X, Microscope, Utensils, Activity, Calendar, Check, Shield, Heart, Dna, Trophy, Info, ShoppingBag } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import { Fox, calculateCOI, getActiveBoosts, isHungry } from '@/lib/genetics';

export default function FoxProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { 
    foxes, foundationFoxes, applyItem, inventory, renameFox, sellFox,
    isAdmin, toggleStudStatus, hiredGroomer, 
    hiredVeterinarian, hiredTrainer, hiredNutritionist,
    setFoxPreferredFeed
  } = useGameStore();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const isFoundational = foundationFoxes.some(f => f.id === id);

  const fox = foxes[id as string] || foundationFoxes.find(f => f.id === id);

  useEffect(() => {
    if (fox) setNewName(fox.name);
  }, [fox]);

  if (!fox) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="p-6 bg-earth-100 rounded-full text-earth-400"><Info size={48} /></div>
        <h2 className="text-2xl font-bold text-earth-900">Fox Not Found</h2>
        <Button onClick={() => router.push('/kennel')} variant="outline">Back to Kennel</Button>
      </div>
    );
  }

  const activeBoosts = getActiveBoosts(fox);
  const hungry = isHungry(fox);
  const now = Date.now();

  const handleRename = () => {
    if (newName && newName !== fox.name) {
      renameFox(fox.id, newName);
      setIsEditing(false);
    }
  };

  const handleReveal = () => applyItem('genetic-test', fox.id);
  const handleAnalyze = () => applyItem('pedigree-analysis', fox.id);

  // Navigation functions for kennel browsing
  const goToPreviousFox = () => {
    const foxIds = Object.keys(foxes).filter(id => foxes[id].gender === fox.gender);
    const currentIndex = foxIds.indexOf(fox.id);
    if (currentIndex > 0) {
      const previousFoxId = foxIds[currentIndex - 1];
      router.push(`/fox/${previousFoxId}`);
    }
  };

  const goToNextFox = () => {
    const foxIds = Object.keys(foxes).filter(id => foxes[id].gender === fox.gender);
    const currentIndex = foxIds.indexOf(fox.id);
    if (currentIndex < foxIds.length - 1) {
      const nextFoxId = foxIds[currentIndex + 1];
      router.push(`/fox/${nextFoxId}`);
    }
  };

  const getStat = (key: keyof typeof fox.stats, bonus = 0) => {
    const base = fox.stats[key];
    const boost = activeBoosts[key] || 0;
    return { value: base + boost + bonus, bonus: boost + bonus };
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Button onClick={() => router.back()} variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} /> Back
        </Button>
        <div className="flex gap-2">
          {/* Navigation arrows for kennel browsing */}
          <Button onClick={goToPreviousFox} variant="outline" disabled={Object.keys(foxes).filter(id => foxes[id].gender === fox.gender).length <= 1} className="gap-2">
            <ChevronLeft size={16} /> Previous
          </Button>
          <Button onClick={goToNextFox} variant="outline" disabled={Object.keys(foxes).filter(id => foxes[id].gender === fox.gender).length <= 1} className="gap-2">
            Next <ChevronRight size={16} />
          </Button>
          {!isFoundational && (<>
            <Button onClick={() => toggleStudStatus(fox.id, 500)} variant={fox.isAtStud ? "default" : "outline"} className={fox.isAtStud ? "bg-fire-600" : ""}>
                {fox.isAtStud ? "Remove from Stud" : "List for Stud (500g)"}
            </Button>
            <Button onClick={() => { if(confirm("Are you sure?")) { sellFox(fox.id); router.push('/kennel'); } }} variant="destructive">Retire/Sell</Button>
          </ >)}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="folk-card overflow-hidden bg-white p-4 border-2 border-earth-100 rounded-[32px] flex flex-col items-center justify-center relative shadow-xl" style={{width: '420px', height: '420px', minWidth: '420px', maxWidth: '420px'}}>
             <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-earth-100 text-earth-700 border-none font-bold uppercase tracking-tighter text-[10px]">{fox.gender}</Badge>
             </div>
             <FoxIllustration phenotype={fox.phenotype} baseColor={fox.baseColor} pattern={fox.pattern} eyeColor={fox.eyeColor} size={24} />
             <div className="mt-2 text-center">
                <h1 className="text-2xl font-black text-earth-900 tracking-tight flex items-center gap-2 justify-center italic uppercase">{fox.name}</h1>
                <p className="mt-1 text-earth-500 font-medium tracking-wide uppercase text-xs">{fox.age} year old {fox.phenotype} fox</p>
             </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-2xl font-bold p-2 border rounded-lg focus:ring-2 focus:ring-fire-500 outline-none w-full"
              />
              <Button onClick={handleRename} size="sm" className="bg-green-600 hover:bg-green-700"><Save size={18} /></Button>
              <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="text-red-500"><X size={18} /></Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-black text-earth-900 tracking-tight">{fox.name}</h2>
              {!isFoundational && !fox.hasBeenRenamed && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-earth-300 hover:text-fire-600 transition-colors"
                  title="Rename Fox (One-time)"
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-earth-500 font-medium uppercase tracking-widest text-xs">{fox.phenotype}</p>
            <Badge variant="outline" className="bg-earth-50 text-earth-600 border-earth-200 font-bold">
              {fox.eyeColor} Eyes
            </Badge>
          </div>
          {hungry && <Badge variant="destructive" className="mt-1 font-bold animate-pulse">Hungry - Stat Penalty</Badge>}

          <div className="flex flex-wrap gap-2 mt-4">
          {!isFoundational && (<>
          {!fox.genotypeRevealed && (
            <Button onClick={handleReveal} variant="outline" className="gap-2 font-bold h-10 border-indigo-100 hover:bg-indigo-50 text-indigo-700">
              <Microscope size={16} /> Reveal Genotype
            </Button>
          )}
          <Button 
            onClick={() => applyItem('supplies', fox.id)}
            variant="outline" 
            className="gap-2 font-bold h-10"
          >
            <ShoppingBag size={16} /> Feed Fox
          </Button>
          {!fox.pedigreeAnalyzed && (
            <Button onClick={handleAnalyze} variant="outline" className="gap-2 font-bold h-10">
              <Heart size={16} /> Analyze Pedigree
            </Button>
          )}
          </>)}
          {fox.isRetired && <Badge className="bg-earth-500 h-10 px-4 font-bold">Retired</Badge>}
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="md:col-span-1 folk-card border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-black text-earth-900 tracking-tight italic uppercase">
              <Activity size={18} className="text-fire-600" /> Show Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatBar label="Head" {...getStat('head', hiredVeterinarian ? 1 : 0)} />
            <StatBar label="Topline" {...getStat('topline', hiredVeterinarian ? 1 : 0)} />
            <StatBar label="Forequarters" {...getStat('forequarters', hiredVeterinarian ? 1 : 0)} />
            <StatBar label="Hindquarters" {...getStat('hindquarters', hiredVeterinarian ? 1 : 0)} />
            <StatBar label="Tail" {...getStat('tail', hiredVeterinarian ? 1 : 0)} />
            <StatBar label="Coat Quality" {...getStat('coatQuality', hiredGroomer ? 5 : 0)} />
            <StatBar label="Temperament" {...getStat('temperament', hiredTrainer ? 3 : 0)} />
            <StatBar label="Presence" {...getStat('presence', hiredTrainer ? 3 : 0)} />
            <div className="pt-4 border-t border-earth-100 flex justify-between gap-4">
               <div className="flex-1">
                   <StatBar label="Luck" value={fox.stats.luck} />
               </div>
               <div className="flex-1">
                   <StatBar label="Fertility" value={fox.stats.fertility} />
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="md:col-span-2 folk-card border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-black text-foreground tracking-tight italic uppercase">
              <Info size={18} className="text-primary" /> Genetics & History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-black text-muted-foreground uppercase mb-4 tracking-widest flex items-center gap-2">
                    <Dna size={14} /> Genotype
                </h4>
                {fox.genotypeRevealed ? (
                   <div className="grid grid-cols-2 gap-3">
                      {Object.entries(fox.genotype).map(([locus, alleles]) => (
                        <div key={locus} className="text-xs font-bold bg-muted p-3 rounded-xl flex justify-between border">
                          <span className="text-muted-foreground font-mono tracking-tighter">{locus}:</span>
                          <span className="font-mono text-foreground">{alleles.join('')}</span>
                        </div>
                      ))}
                   </div>
                ) : (
                  <div className="p-8 bg-muted border-2 border-dashed border rounded-2xl text-muted-foreground text-sm text-center font-bold">
                    Genotype is hidden. <br/>Use a Genetic Test to reveal.
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div>
                    <h4 className="text-xs font-black text-muted-foreground uppercase mb-3 tracking-widest flex items-center gap-2">
                        <Activity size={14} /> Health Status
                    </h4>
                    {fox.healthIssues.length > 0 ? (
                    <div className="space-y-2">
                        {fox.healthIssues.map(issue => (
                        <Badge key={issue} variant="destructive" className="w-full justify-center h-8 font-bold">
                            {issue}
                        </Badge>
                        ))}
                    </div>
                    ) : (
                    <p className="text-sm font-bold bg-primary/10 text-primary p-3 rounded-xl border border-primary/20 flex items-center gap-2">
                        <Check size={16} /> Perfect Health
                    </p>
                    )}
                </div>

                <div>
                    <h4 className="text-xs font-black text-muted-foreground uppercase mb-3 tracking-widest flex items-center gap-2">
                        <Calendar size={14} /> Life History
                    </h4>
                    <div className="space-y-2 text-sm font-bold bg-muted p-4 rounded-xl border">
                        <p className="flex justify-between">
                            <span className="text-muted-foreground">Born Year:</span>
                            <span className="text-foreground">{fox.birthYear}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="text-muted-foreground">Lifetime Points:</span>
                            <span className="text-foreground">{fox.pointsLifetime.toLocaleString()}</span>
                        </p>
                        <p className="flex justify-between border-t border-border pt-2 mt-2">
                            <span className="text-muted-foreground uppercase tracking-tighter text-[10px]">Inbreeding (COI):</span>
                            <span className="text-foreground font-black">
                            {fox.pedigreeAnalyzed ? `${calculateCOI(fox.id, foxes)}%` : '???'}
                            </span>
                        </p>
                        {isAdmin && (
                            <p className="flex justify-between text-[10px] text-fire-600 font-black border-t border-orange-200 pt-2 mt-2">
                            <span className="flex items-center gap-1 uppercase tracking-widest"><Shield size={10}/> Intensity (Admin):</span>
                            <span>{fox.silverIntensity}</span>
                            </p>
                        )}
                    </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialty Feeds */}
        <Card className="md:col-span-3 folk-card bg-fire-50 border-fire-100 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-fire-700 font-black uppercase italic tracking-tight">
              <ShoppingBag size={20} /> Apply Specialty Feeds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { id: 'feed-head', label: 'Head' },
                { id: 'feed-topline', label: 'Topline' },
                { id: 'feed-forequarters', label: 'Fore' },
                { id: 'feed-hindquarters', label: 'Hind' },
                { id: 'feed-tail', label: 'Tail' },
                { id: 'feed-coatQuality', label: 'Coat' },
                { id: 'feed-temperament', label: 'Temp' },
                { id: 'feed-presence', label: 'Pres' },
              ].map(f => {
                const count = inventory[f.id] || 0;
                const statKey = f.id.replace('feed-', '');
                const expiry = fox.boosts?.[statKey];
                const isActive = expiry && expiry > now;
                const daysLeft = isActive ? Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)) : 0;
                return (
                  <Button 
                    key={f.id}
                    variant="outline"
                    className="flex-1 min-w-[100px] h-20 flex flex-col items-center justify-center gap-1 border-fire-200 hover:bg-white hover:border-fire-500 transition-all bg-white shadow-sm rounded-xl"
                    disabled={count === 0}
                    onClick={() => applyItem(f.id, fox.id)}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tighter text-fire-800">{f.label}</span>
                    <Badge variant="secondary" className="bg-fire-100 text-fire-700 text-[10px] font-black border-none h-5">
                        {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Nutritionist Controls */}
        {hiredNutritionist && (
          <Card className="md:col-span-3 folk-card bg-orange-50 border-orange-100 border-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-orange-800 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Utensils size={16} /> Nutritionist: Preferred Feed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'supplies', label: 'Premium Feed' },
                        { id: 'feed-head', label: 'Cranial Crunch' },
                        { id: 'feed-topline', label: 'Spine Support' },
                        { id: 'feed-forequarters', label: 'Shoulder Strength' },
                        { id: 'feed-hindquarters', label: 'Hip Health' },
                        { id: 'feed-tail', label: 'Brush Boost' },
                        { id: 'feed-coatQuality', label: 'Lustrous Layers' },
                        { id: 'feed-temperament', label: 'Calm Kibble' },
                        { id: 'feed-presence', label: 'Showstopper Snack' },
                    ].map(feed => (
                        <Button
                            key={feed.id}
                            variant={fox.preferredFeed === feed.id ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                                "text-[10px] font-black h-8 rounded-lg uppercase tracking-tighter",
                                fox.preferredFeed === feed.id ? "bg-orange-600 border-orange-600 text-white" : "border-orange-200 text-orange-700 hover:bg-white"
                            )}
                            onClick={() => setFoxPreferredFeed(fox.id, feed.id)}
                        >
                            {feed.label}
                        </Button>
                    ))}
                </div>
            </CardContent>
          </Card>
        )}

        {/* Pedigree */}
        <Card className="col-span-full folk-card border-2 shadow-inner">
          <CardHeader className="flex flex-row items-center justify-between border-b border-earth-100 bg-earth-50/30">
            <CardTitle className="flex items-center gap-2 font-black text-earth-900 tracking-tight italic uppercase">
              <Heart size={18} className="text-rose-600" /> Ancestry & Pedigree
            </CardTitle>
            {fox.pedigreeAnalyzed && (
              <div className="text-xs font-black text-earth-400 uppercase tracking-widest">
                COI: <span className="text-earth-900 ml-1 text-sm">{calculateCOI(fox.id, foxes)}%</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="overflow-x-auto p-8">
             <div className="min-w-[1000px]">
                <PedigreeTree foxId={fox.id} foxes={foxes} />
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatBar({ label, value, bonus = 0 }: { label: string; value: number; bonus?: number }) {
  // Scale stat values to percentage (max value is 100 for most stats, 75 for fertility)
  const maxValue = label === 'Fertility' ? 75 : 100;
  const percentage = Math.min(100, (value / maxValue) * 100);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <span className="flex items-center gap-1 font-mono text-xs text-foreground">
            {bonus > 0 && <span className="text-green-600 font-bold dark:text-green-400">+{bonus}</span>}
            {value}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner relative">
        <div 
          className="h-full bg-primary transition-all shadow-[0_0_5px_rgba(var(--primary),0.4)]"
          style={{ width: `${percentage}%` }} 
        />
        {/* Current stat indicator - theme-aware */}
        <div 
          className="absolute top-0 h-full w-1 bg-background border-2 border-muted-foreground shadow-lg"
          style={{ left: `${percentage}%` }}
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
      <div className={cn(
        "flex-1 p-3 border-2 rounded-2xl text-xs min-w-[180px] shadow-sm transition-all",
        fox ? "border-earth-100 bg-white" : "border-earth-100 bg-earth-50 text-earth-300 italic"
      )}>
        {fox ? (
          <div>
            <div className="font-black text-earth-900 uppercase tracking-tighter truncate">{fox.name}</div>
            <div className="text-[10px] font-bold text-earth-400 uppercase tracking-widest truncate">{fox.phenotype}</div>
          </div>
        ) : (
          "Unknown Ancestor"
        )}
      </div>
      
      {depth < 4 && (
        <div className="flex flex-col gap-3 border-l-2 border-earth-100 pl-6 py-2">
          <PedigreeTree foxId={fox?.parents[0] || null} foxes={foxes} depth={depth + 1} />
          <PedigreeTree foxId={fox?.parents[1] || null} foxes={foxes} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
function CheckIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
      <path d="m9 14 2 2a4 4 0 0 1 4v2a4 4 0 0 1-4h2a4 4 0 0 1 4z" />
    </svg>
  );
}
