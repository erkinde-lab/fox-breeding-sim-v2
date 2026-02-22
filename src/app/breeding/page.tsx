'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { getPhenotype, breed, calculateCOI } from '@/lib/genetics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, AlertCircle, Calculator, Lock } from 'lucide-react';

export default function BreedingPage() {
  const { foxes, breedFoxes, season, inventory, hiredGeneticist } = useGameStore();
  const [selectedMale, setSelectedMale] = useState<string | null>(null);
  const [selectedFemale, setSelectedFemale] = useState<string | null>(null);

  const hasCalculator = inventory['calculator-access'] > 0;
  const hasGeneticist = hiredGeneticist;

  const foxList = Object.values(foxes);
  const males = foxList.filter(f => f.gender === 'Male' && !f.isRetired && f.age >= 2);
  const females = foxList.filter(f => f.gender === 'Female' && !f.isRetired && f.age >= 2);

  const handleBreed = () => {
    if (selectedMale && selectedFemale) {
      // Check for calculator access OR geneticist access
      if (!hasCalculator && !hasGeneticist) {
        alert("You need to hire Geneticist staff member or purchase Breeding Calculator to access breeding insights!");
        console.log("Calculator access:", hasCalculator, "Geneticist access:", hasGeneticist);
        return;
      }
      
      breedFoxes(selectedMale, selectedFemale);
      setSelectedMale(null);
      setSelectedFemale(null);
      alert("Breeding successful! Kits will be born in Spring.");
    }
  };

  const calculateOutcomes = () => {
    if (!selectedMale || !selectedFemale) return null;
    const m = foxes[selectedMale];
    const f = foxes[selectedFemale];

    const counts: Record<string, number> = {};
    const trials = 1000;

    for (let i = 0; i < trials; i++) {
      const child = breed(m.genotype, f.genotype);
      if (child) {
        const name = getPhenotype(child).name;
        counts[name] = (counts[name] || 0) + 1;
      }
    }

    const predictedCOI = calculateCOI('temp', {
      ...foxes,
      temp: { parents: [selectedMale, selectedFemale] }
    });

    return {
      probabilities: Object.entries(counts)
        .map(([name, count]) => ({ name, percent: Math.round((count / trials) * 100) }))
        .filter(item => item.percent >= 1)
        .sort((a, b) => b.percent - a.percent),
      predictedCOI
    };
  };

  const outcomes = calculateOutcomes();

  const isWinter = season === 'Winter';

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-5xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Breeding Center</h2>
        {!isWinter && (
          <Badge variant="destructive" className="gap-2 px-4 py-2 rounded-xl shadow-lg shadow-destructive/20 font-black uppercase text-[10px] tracking-widest">
            <AlertCircle size={14} /> Seasonal Lock: Winter Only
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Male Selection */}
        <Card className={cn("folk-card border-2 flex flex-col transition-all duration-500", selectedMale ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5" : "border-border")}>
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Select Sire (Male)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            {males.map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMale(m.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group",
                  selectedMale === m.id ? "bg-card border-primary shadow-md translate-x-1" : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50"
                )}
              >
                <div className="font-black text-foreground italic group-hover:text-primary transition-colors">{m.name}</div>
                <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{m.baseColor}{m.pattern !== "None" && ` • ${m.pattern}`}</div>
              </div>
            ))}
            {males.length === 0 && (
              <div className="text-center py-10 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                <p className="text-xs font-bold text-muted-foreground/50 italic">No eligible males</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center gap-6 p-8 bg-muted/20 rounded-[48px] border-2 border-dashed border-border">
          <div className="relative">
            <Heart className={cn("w-20 h-20 transition-all duration-700", selectedMale && selectedFemale ? "text-primary scale-110 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-pulse" : "text-muted-foreground/10 translate-y-2")} />
            {selectedMale && selectedFemale && <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full scale-150 blur-xl"></div>}
          </div>

          <div className="space-y-4 w-full">
            <Button
              onClick={handleBreed}
              disabled={!selectedMale || !selectedFemale || !isWinter}
              className={cn(
                "w-full py-8 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl",
                selectedMale && selectedFemale ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20" : "bg-muted text-muted-foreground opacity-50"
              )}
            >
              Commit Breeding
            </Button>
            {!isWinter && (
              <p className="text-[10px] text-center font-bold text-muted-foreground/60 uppercase tracking-widest">Available in Spring</p>
            )}
          </div>
        </div>

        {/* Female Selection */}
        <Card className={cn("folk-card border-2 flex flex-col transition-all duration-500", selectedFemale ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5" : "border-border")}>
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span> Select Dam (Female)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1">
            {females.map(f => (
              <div
                key={f.id}
                onClick={() => setSelectedFemale(f.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group",
                  selectedFemale === f.id ? "bg-card border-primary shadow-md -translate-x-1" : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50"
                )}
              >
                <div className="font-black text-foreground italic group-hover:text-primary transition-colors">{f.name}</div>
                <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{f.baseColor}{f.pattern !== "None" && ` • ${f.pattern}`}</div>
              </div>
            ))}
            {females.length === 0 && (
              <div className="text-center py-10 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                <p className="text-xs font-bold text-muted-foreground/50 italic">No eligible females</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calculator Section */}
      {selectedMale && selectedFemale && (
        <Card className="folk-card border-secondary/20 bg-secondary/5 overflow-hidden shadow-2xl shadow-secondary/5 rounded-[40px]">
          <CardContent className="p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b border-secondary/10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-secondary/10 rounded-[2rem]">
                  <Calculator className="text-secondary" size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black italic text-foreground tracking-tight">Breeding Insights</h3>
                  <p className="text-sm text-muted-foreground font-medium">Genetic simulation based on 1,000 trials</p>
                </div>
              </div>
              {!hasCalculator && !hasGeneticist && (
                <Badge variant="outline" className="text-secondary border-secondary/20 bg-secondary/5 px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest">
                  Analyzer Not Purchased
                </Badge>
              )}
            </div>

            {(hasCalculator || hasGeneticist) && outcomes && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="p-8 bg-background/50 backdrop-blur-md rounded-[32px] border border-secondary/10 shadow-inner">
                    <p className="text-[10px] font-black text-secondary uppercase mb-3 tracking-[0.2em]">Predicted Inbreeding (COI)</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black text-foreground tabular-nums tracking-tighter">{outcomes.predictedCOI}<span className="text-3xl text-secondary/40">%</span></span>
                      {outcomes.predictedCOI > 15 && (
                        <Badge variant="destructive" className="font-black uppercase text-[9px] px-2 py-1 shadow-lg shadow-destructive/20 animate-pulse">High Risk</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-2xl border border-border">
                    <AlertCircle size={18} className="text-muted-foreground/40 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">COI measures the probability that both gene copies at a locus are descended from the same ancestor. High COI can lead to lethal genetic expression.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] px-2">Phenotype Probabilities</p>
                  <div className="grid grid-cols-1 gap-3">
                    {outcomes.probabilities.map(item => (
                      <div key={item.name} className="bg-card p-4 rounded-2xl border border-border flex justify-between items-center group hover:border-secondary/30 transition-all hover:translate-x-2">
                        <span className="font-bold text-foreground group-hover:text-secondary transition-colors italic">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${item.percent}%` }} />
                          </div>
                          <span className="font-black text-xs tabular-nums text-muted-foreground w-8 text-right">{item.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-2xl border border-border">
                    <AlertCircle size={18} className="text-muted-foreground/40 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">Exceedingly rare results (&lt; 1%) are hidden but not impossible. These genetic combinations may require many breeding attempts to achieve.</p>
                  </div>
                </div>
              </div>
            )}

            {!hasCalculator && !hasGeneticist && (
              <div className="text-center py-20 bg-muted/10 rounded-[40px] border-2 border-dashed border-border px-8">
                <Lock size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <h4 className="text-xl font-black text-foreground italic mb-2">Calculator Locked</h4>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium">Purchase the **Inbreeding Calculator** from the shop or hire a **Geneticist** to unlock detailed genetic insights for this pair.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
