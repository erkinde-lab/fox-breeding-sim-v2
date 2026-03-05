'use client';
import { cn } from '@/lib/utils';

import React, { useState, useMemo } from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Coins, User, Shield, Calculator, AlertCircle, Lock, Dna, Activity } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import { calculateBreedingOutcomes, LOCI } from '@/lib/genetics';

export default function StudBarnPage() {
  const { foxes, breedFoxes, season, gold, hiredGeneticist, inventory } = useGameStore();
  const [selectedVixenId, setSelectedVixenId] = useState<string | null>(null);
  const [selectedStudId, setSelectedStudId] = useState<string | null>(null);

  const ownedStuds = Object.values(foxes).filter(f => f.gender === 'Dog' && f.isAtStud && !f.isRetired);
  const availableNPCs = Object.values(foxes).filter(f => f.isNPC);
  const eligibleVixens = Object.values(foxes).filter(f => f.gender === 'Vixen' && !f.isRetired && f.age >= 2);

  const hasCalculator = inventory['calculator-access'] > 0;
  const hasGeneticist = hiredGeneticist;

  const handleBreed = () => {
    if (!selectedVixenId || !selectedStudId) {
      alert("Please select both a vixen and a stud!");
      return;
    }
    breedFoxes(selectedStudId, selectedVixenId);
    setSelectedVixenId(null);
    setSelectedStudId(null);
    alert("Breeding committed! Check Spring for results.");
  };

  const outcomes = useMemo(() => {
    if (!selectedVixenId || !selectedStudId) return null;
    const vixen = foxes[selectedVixenId];
    const stud = foxes[selectedStudId];
    if (!vixen || !stud) return null;
    return calculateBreedingOutcomes(stud, vixen, foxes);
  }, [selectedVixenId, selectedStudId, foxes]);

  const isWinter = season === 'Winter';

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-5xl font-folksy text-foreground tracking-tight flex items-center gap-4" style={{ fontWeight: 400 }}>
          <Shield className="text-primary" size={40} /> Stud Barn
        </h2>
        {!isWinter && (
          <Badge variant="destructive" className="gap-2 px-4 py-2 rounded-xl shadow-lg shadow-destructive/20 font-black uppercase text-[10px] tracking-widest text-white">
            <Shield size={14} /> Seasonal Lock: Winter Only
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Selection Panel */}
        <Card className={cn("lg:col-span-1 folk-card border-2 transition-all duration-500", selectedVixenId ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5" : "border-border bg-card")}>
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> 1. Select Dam
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eligibleVixens.map(f => (
              <div
                key={f.id}
                onClick={() => setSelectedVixenId(f.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group",
                  selectedVixenId === f.id ? "bg-card border-primary shadow-md translate-x-1" : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50"
                )}
              >
                <div className="font-black text-foreground italic group-hover:text-primary transition-colors">{f.name}</div>
                <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{f.phenotype}</div>
              </div>
            ))}
            {eligibleVixens.length === 0 && (
              <div className="text-center py-10 opacity-40 border-2 border-dashed border-border rounded-2xl">
                <p className="text-xs font-bold text-foreground italic">No eligible vixens (Age 2+)</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stud Listings */}
        <div className="lg:col-span-3 space-y-10">
          {/* Insights / Calculator */}
          {selectedVixenId && selectedStudId && (
            <Card className="folk-card border-secondary/20 bg-secondary/5 overflow-hidden shadow-2xl shadow-secondary/5 rounded-[40px]">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 pb-4 border-b border-secondary/10">
                  <div className="flex items-center gap-4">
                    <Calculator className="text-secondary" size={24} />
                    <h3 className="text-2xl font-black italic text-foreground tracking-tight">Breeding Insights</h3>
                  </div>
                  <Button
                    onClick={handleBreed}
                    disabled={!isWinter || (foxes[selectedStudId] && foxes[selectedStudId].isNPC && gold < foxes[selectedStudId].studFee)}
                    className="bg-primary text-primary-foreground font-black uppercase tracking-widest px-8 rounded-xl"
                  >
                    Commit Breeding
                  </Button>
                </div>

                {(hasCalculator || hasGeneticist) && outcomes ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-secondary uppercase mb-2 tracking-widest">Phenotype Probabilities</p>
                      <div className="space-y-2">
                        {outcomes.probabilities.slice(0, 5).map(p => (
                          <div key={p.name} className="flex justify-between items-center text-xs p-2 bg-background/50 rounded-lg border border-secondary/5">
                            <span className="font-bold">{p.name}</span>
                            <span className="font-black text-secondary">{p.percent}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center p-6 bg-background/50 rounded-[32px] border border-secondary/10">
                       <p className="text-[10px] font-black text-secondary uppercase mb-2 tracking-widest">Inbreeding Risk</p>
                       <div className="text-4xl font-black text-foreground">{outcomes.predictedCOI}%</div>
                       <p className="text-[10px] text-muted-foreground mt-2 font-medium">COI Coefficient</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-60 italic text-sm">
                    <Lock size={20} className="mx-auto mb-2"/>
                    Purchase Calculator or hire Geneticist for insights.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <section>
            <h3 className="text-xl font-black italic text-foreground mb-6 flex items-center gap-3 tracking-tight">
              <User size={24} className="text-secondary" /> Foundation Studs <span className="text-muted-foreground/30 font-medium not-italic text-sm">(NPC)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableNPCs.map(npc => (
                <StudCard
                  key={npc.id}
                  fox={npc}
                  isSelected={selectedStudId === npc.id}
                  onSelect={() => setSelectedStudId(npc.id)}
                  onBreed={() => { setSelectedStudId(npc.id); handleBreed(); }}
                  disabled={!isWinter || !selectedVixenId || gold < npc.studFee}
                />
              ))}
            </div>
          </section>

          {ownedStuds.length > 0 && (
            <section className="pt-10 border-t border-border">
              <h3 className="text-xl font-black italic text-foreground mb-6 flex items-center gap-3 tracking-tight">
                <Heart size={24} className="text-primary fill-primary/20" /> Your Offered Studs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ownedStuds.map(stud => (
                  <StudCard
                    key={stud.id}
                    fox={stud}
                    isSelected={selectedStudId === stud.id}
                    onSelect={() => setSelectedStudId(stud.id)}
                    onBreed={() => { setSelectedStudId(stud.id); handleBreed(); }}
                    disabled={!isWinter || !selectedVixenId}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function StudCard({ fox, isSelected, onSelect, onBreed, disabled }: { fox: import('@/lib/genetics').Fox, isSelected: boolean, onSelect: () => void, onBreed: () => void, disabled: boolean }) {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "folk-card overflow-hidden border-2 cursor-pointer transition-all hover:shadow-xl rounded-[32px]",
        isSelected ? "border-primary bg-primary/5 shadow-primary/5" : "border-border bg-card hover:border-secondary/30"
      )}
    >
      <div className="flex flex-col sm:flex-row h-full">
        <div className="w-full sm:w-44 flex-shrink-0 bg-muted/40 flex items-center justify-center relative transition-colors group-hover:bg-secondary/5 p-4">
          <FoxIllustration phenotype={fox.phenotype} size={10} />
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="text-[8px] uppercase font-black bg-background/80 backdrop-blur-md border-border px-1.5 h-4">Age {fox.age}</Badge>
          </div>
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-black italic text-lg text-foreground truncate tracking-tight">{fox.name}</h4>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-2">{fox.phenotype}</p>

            {/* Stats & Genotype Mini-Display */}
            <div className="grid grid-cols-2 gap-2 mb-3">
               <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[8px] font-black text-muted-foreground/60 uppercase"><Activity size={8}/> Stats</div>
                  <div className="text-[9px] font-bold text-foreground">
                    Avg: {Math.round(Object.values(fox.stats).reduce(((a: number, b: number) => a + b),0)/Object.values(fox.stats).length)}
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[8px] font-black text-muted-foreground/60 uppercase"><Dna size={8}/> Genetics</div>
                  <div className="flex flex-wrap gap-0.5">
                    {Object.entries(fox.genotype).slice(0, fox.isNPC || fox.genotypeRevealed ? undefined : 3).map(([l, a]) => (
                      <span key={l} className="text-[8px] font-mono bg-muted px-0.5 rounded">{l}:{a.join("")}</span>
                    ))}
                    {(!fox.isNPC && !fox.genotypeRevealed) && <span className="text-[8px] text-muted-foreground">...</span>}
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest">
              <Coins size={14} /> {fox.studFee.toLocaleString()}
            </div>
          </div>
          {isSelected && (
            <Button
              size="sm"
              onClick={(e) => { e.stopPropagation(); onBreed(); }}
              disabled={disabled}
              className={cn(
                "w-full mt-3 rounded-xl font-black uppercase tracking-widest text-[9px] h-8 transition-all",
                !disabled ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground opacity-50"
              )}
            >
              Commit Breeding
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

