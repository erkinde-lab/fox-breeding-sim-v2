'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { Fox, calculateCOI, getActiveBoosts, isHungry } from '@/lib/genetics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Info, Microscope, Edit2, Check, X, DollarSign, Shield, ShoppingBag, ArrowLeftRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FoxIllustration } from '@/components/FoxIllustration';

export default function FoxProfilePage() {
  const now = Date.now(); // eslint-disable-line react-hooks/purity
  const { id } = useParams();
  const router = useRouter();
  const { 
    foxes, applyItem, inventory, renameFox, sellFox, 
    isAdmin, toggleStudStatus, hiredGroomer, 
    hiredVeterinarian, hiredTrainer, listFoxOnMarket 
  } = useGameStore();
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSettingStud, setIsSettingStud] = useState(false);
  const [studFee, setStudFee] = useState(1000);
  
  const [isListing, setIsListing] = useState(false);
  const [listPrice, setListPrice] = useState(5000);
  const [listCurrency, setListCurrency] = useState<'gold' | 'gems'>('gold');

  const fox = foxes[id as string];
  const activeBoosts = fox ? getActiveBoosts(fox) : {};
  const hungry = fox ? isHungry(fox) : false;
  
  const getStat = (key: string, baseBonus: number) => {
    if (!fox) return { value: 0, bonus: 0 };
    const boost = activeBoosts[key] || 0;
    const penalty = hungry ? 5 : 0;
    // @ts-expect-error: dynamic stat access
    return { value: Math.max(0, Math.min(100, fox.stats[key] + baseBonus + boost - penalty)), bonus: baseBonus + boost - penalty };
  };

  if (!fox) return <div className="p-8 text-center">Fox not found</div>;

  const handleRename = () => {
    const lettersOnly = /^[A-Za-z\s]+$/;
    if (!lettersOnly.test(newName)) {
      alert("Names can only contain letters and spaces.");
      return;
    }
    renameFox(fox.id, newName);
    setIsRenaming(false);
  };

  const handleReveal = () => {
    if (inventory['genetic-test'] > 0) {
      applyItem('genetic-test', fox.id);
    } else {
      alert("You need a Genetic Test in your inventory!");
    }
  };

  const handleAnalyze = () => {
    if (inventory['pedigree-analysis'] > 0) {
      applyItem('pedigree-analysis', fox.id);
    } else {
      alert("You need a Pedigree Analysis in your inventory!");
    }
  };

  const handleSell = () => {
    const sellPrice = 500 + (fox.pointsLifetime * 10);
    if (confirm(`Are you sure you want to sell ${fox.name} for ${sellPrice} Gold? This cannot be undone.`)) {
      sellFox(fox.id);
      router.push('/');
    }
  };

  const handleList = () => {
    listFoxOnMarket(fox.id, listPrice, listCurrency);
    router.push('/shop/marketplace');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-6">
        <div className="w-32 h-32 flex-shrink-0">
          <FoxIllustration phenotype={fox.phenotype} size={12} />
        </div>
        <div className="flex-1">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
                className="text-3xl font-bold text-earth-900 border-b-2 border-orange-500 focus:outline-none bg-transparent"
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={handleRename} className="text-green-600">
                <Check size={20} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setIsRenaming(false)} className="text-red-600">
                <X size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-slate-900">{fox.name}</h2>
              {!fox.hasBeenRenamed && (
                <button
                  onClick={() => {
                    setIsRenaming(true);
                    setNewName(fox.name);
                  }}
                  className="text-earth-400 hover:text-orange-500 transition"
                  title="Rename Fox (One-time)"
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>
          )}
          <p className="text-earth-500 font-medium">{fox.phenotype}</p>
          {hungry && <Badge variant="destructive" className="mt-1">Hungry - Stat Penalty</Badge>}
        </div>
        <div className="flex gap-2">
          {!fox.genotypeRevealed && (
            <Button onClick={handleReveal} variant="outline" className="gap-2">
              <Microscope size={16} /> Reveal Genotype (Use Test)
            </Button>
          )}
          <Button 
            onClick={() => {
              if (inventory['supplies'] > 0) {
                applyItem('supplies', fox.id);
              } else {
                alert("You need Premium Feed in your inventory!");
              }
            }} 
            variant="outline" 
            className="gap-2 border-fire-200 hover:bg-orange-50"
          >
            <ShoppingBag size={16} className="text-orange-500" /> Feed Fox
          </Button>
          {!fox.pedigreeAnalyzed && (
            <Button onClick={handleAnalyze} variant="outline" className="gap-2 border-pink-200 hover:bg-pink-50">
              <Heart size={16} className="text-pink-500" /> Analyze Pedigree
            </Button>
          )}
          {fox.isRetired ? (
            <Badge className="bg-earth-500 h-6">Retired</Badge>
          ) : (
            <div className="flex gap-2">
                {fox.gender === 'Male' && fox.age >= 2 && (
                    <Button 
                        onClick={() => fox.isAtStud ? toggleStudStatus(fox.id, 0) : setIsSettingStud(true)} 
                        variant={fox.isAtStud ? 'secondary' : 'outline'}
                        className="gap-2"
                    >
                        <Shield size={16} /> {fox.isAtStud ? 'Remove from Stud' : 'Offer for Stud'}
                    </Button>
                )}
                <Button onClick={() => setIsListing(true)} variant="outline" className="gap-2 border-earth-200">
                    <ArrowLeftRight size={16} className="text-moss-600" /> List on Market
                </Button>
                <Button onClick={handleSell} variant="ghost" className="text-red-500 hover:bg-red-50 gap-1">
                    <DollarSign size={16} /> Sell
                </Button>
            </div>
          )}
        </div>
      </div>

      {isSettingStud && (
          <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-black uppercase text-blue-700">Set Stud Fee (Gold)</label>
                    <input 
                        type="number" 
                        value={studFee} 
                        onChange={(e) => setStudFee(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-blue-200 p-2 rounded-lg font-bold"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => { toggleStudStatus(fox.id, studFee); setIsSettingStud(false); }}>Offer for Stud</Button>
                    <Button variant="ghost" onClick={() => setIsSettingStud(false)}>Cancel</Button>
                  </div>
              </CardContent>
          </Card>
      )}

      {isListing && (
          <Card className="border-moss-200 bg-moss-50/50">
              <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-end">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-black uppercase text-moss-700 tracking-widest">Marketplace Asking Price</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                value={listPrice} 
                                onChange={(e) => setListPrice(parseInt(e.target.value) || 0)}
                                className="flex-1 bg-white border border-moss-200 p-3 rounded-xl font-bold text-lg"
                            />
                            <select 
                                value={listCurrency}
                                onChange={(e) => setListCurrency(e.target.value as 'gold' | 'gems')}
                                className="bg-white border border-moss-200 p-3 rounded-xl font-bold uppercase"
                            >
                                <option value="gold">Gold</option>
                                <option value="gems">Gems</option>
                            </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleList} className="bg-moss-600 hover:bg-moss-500 px-8 h-12 font-black">Confirm Listing</Button>
                        <Button variant="ghost" onClick={() => setIsListing(false)} className="h-12">Cancel</Button>
                      </div>
                  </div>
                  <p className="mt-4 text-xs text-moss-600 italic">
                     Once listed, the fox will be removed from your kennel and visible to all players in the Marketplace.
                  </p>
              </CardContent>
          </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="md:col-span-1 folk-card shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} /> Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatBar label="Head" {...getStat('head', hiredVeterinarian ? 1 : 0)} isMasked />
            <StatBar label="Topline" {...getStat('topline', hiredVeterinarian ? 1 : 0)} isMasked />
            <StatBar label="Forequarters" {...getStat('forequarters', hiredVeterinarian ? 1 : 0)} isMasked />
            <StatBar label="Hindquarters" {...getStat('hindquarters', hiredVeterinarian ? 1 : 0)} isMasked />
            <StatBar label="Tail" {...getStat('tail', hiredVeterinarian ? 1 : 0)} isMasked />
            <StatBar label="Coat Quality" {...getStat('coatQuality', hiredGroomer ? 5 : 0)} isMasked />
            <StatBar label="Temperament" {...getStat('temperament', hiredTrainer ? 3 : 0)} isMasked />
            <StatBar label="Presence" {...getStat('presence', hiredTrainer ? 3 : 0)} isMasked />
            <StatBar label="Luck" value={fox.stats.luck} isMasked />
            <div className="pt-2 border-t border-earth-100">
               <StatBar label="Fertility" value={fox.stats.fertility} isMasked />
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="md:col-span-2 folk-card shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info size={18} /> Genetics & Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-earth-400 uppercase mb-2 tracking-wider">Genotype</h4>
                {fox.genotypeRevealed ? (
                   <div className="grid grid-cols-2 gap-2">
                      {Object.entries(fox.genotype).map(([locus, alleles]) => (
                        <div key={locus} className="text-sm font-mono bg-earth-100 p-2 rounded flex justify-between">
                          <span className="text-earth-500">{locus}:</span>
                          <span className="font-bold">{alleles.join('')}</span>
                        </div>
                      ))}
                   </div>
                ) : (
                  <div className="p-4 bg-earth-50 border border-dashed border-earth-200 rounded text-earth-400 text-sm text-center">
                    Genotype is hidden
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-earth-400 uppercase mb-2 tracking-wider">Health Issues</h4>
                {fox.healthIssues.length > 0 ? (
                  <div className="space-y-2">
                    {fox.healthIssues.map(issue => (
                      <Badge key={issue} variant="destructive" className="w-full justify-center">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600 font-medium">Healthy</p>
                )}
                
                <h4 className="text-sm font-bold text-earth-400 uppercase mb-2 mt-6 tracking-wider">History</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-earth-500">Born Year:</span>
                    <span className="font-medium">{fox.birthYear}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-earth-500">Lifetime Points:</span>
                    <span className="font-medium">{fox.pointsLifetime}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-earth-500 text-xs font-bold uppercase tracking-tight">Inbreeding (COI):</span>
                    <span className="font-bold">
                      {fox.pedigreeAnalyzed ? `${calculateCOI(fox.id, foxes)}%` : '???'}
                    </span>
                  </p>
                  {isAdmin && (
                    <p className="flex justify-between text-xs text-fire-600 font-bold border-t border-orange-100 pt-2 mt-2">
                      <span className="flex items-center gap-1"><Shield size={12}/> Silver Intensity (Admin):</span>
                      <span>{fox.silverIntensity}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        
        {/* Specialty Feeds */}
        <Card className="md:col-span-3 folk-card shadow-none bg-fire-50 border-fire-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-fire-700">
              <ShoppingBag size={18} /> Apply Specialty Feeds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
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
                    className="flex-1 min-w-[120px] h-16 flex flex-col items-center justify-center gap-1 border-fire-200 hover:bg-fire-100"
                    disabled={count === 0}
                    onClick={() => applyItem(f.id, fox.id)}
                  >
                    <span className="text-xs font-bold">{f.label} Boost</span>
                    {isActive ? (
                        <Badge variant="default" className="bg-green-500 text-[9px] h-4">
                          Active: {daysLeft}d left
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-fire-200 text-fire-700 text-[10px] h-4">
                          {count} Available
                        </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pedigree */}
        <Card className="col-span-full folk-card shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart size={18} /> Pedigree (5 Generations)
            </CardTitle>
            {fox.pedigreeAnalyzed && (
              <div className="text-sm font-bold text-earth-400">
                COI: <span className="text-slate-900">{calculateCOI(fox.id, foxes)}%</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="overflow-x-auto">
             <div className="min-w-[1000px]">
                <PedigreeTree foxId={fox.id} foxes={foxes} />
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatBar({ label, value, bonus = 0, isMasked = false }: { label: string; value: number; bonus?: number; isMasked?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-earth-500">
        <span>{label}</span>
        {!isMasked && (
          <span className="flex items-center gap-1">
              {bonus > 0 && <span className="text-moss-500 text-[10px]">+{bonus}</span>}
              {value}
          </span>
        )}
      </div>
      <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all", isMasked ? "bg-moss-600" : "bg-fire-600")}
          style={{ width: `${value}%` }} 
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
        "flex-1 p-2 border rounded text-xs min-w-[150px]",
        fox ? "border-earth-200 bg-white" : "border-earth-100 bg-earth-50 text-earth-400 italic"
      )}>
        {fox ? (
          <div>
            <div className="font-bold truncate">{fox.name}</div>
            <div className="opacity-70 truncate">{fox.phenotype}</div>
          </div>
        ) : (
          "Unknown"
        )}
      </div>
      
      {depth < 4 && (
        <div className="flex flex-col gap-2 border-l border-earth-200 pl-4">
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
