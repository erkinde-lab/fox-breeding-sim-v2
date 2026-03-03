"use client";

import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  ChevronLeft,
  Activity,
  Dna,
  Lock,
  Shield,
  Check,
  AlertCircle
} from "lucide-react";
import { BreedingTabs } from "@/components/BreedingTabs";
import { FoxIllustration } from "@/components/FoxIllustration";
import { calculateBreedingOutcomes } from "@/lib/breeding-utils";

export default function BreedingComparisonPage() {
  const { foxes, gold, hiredGeneticist, hiredNutritionist } = useGameStore();
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [selectedVixenId, setSelectedVixenId] = useState<string | null>(null);

  const dogs = Object.values(foxes).filter(f => f.gender === "Dog" && !f.isRetired && f.age >= 2);
  const vixens = Object.values(foxes).filter(f => f.gender === "Vixen" && !f.isRetired && f.age >= 2);

  const dog = selectedDogId ? foxes[selectedDogId] : null;
  const vixen = selectedVixenId ? foxes[selectedVixenId] : null;

  const outcomes = dog && vixen ? calculateBreedingOutcomes(dog, vixen, foxes) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-4xl font-black italic text-foreground tracking-tight mb-2">Breeding Center</h1>
        <p className="text-muted-foreground font-medium">Evaluate potential pairings and manage your nursery.</p>
      </div>

      <BreedingTabs />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selection Area */}
        <div className="space-y-6">
          <Card className="folk-card border-2 border-border shadow-sm rounded-[32px]">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Pair</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Stud (Dog)</label>
                <select
                  className="w-full bg-muted/50 border-2 border-border p-4 rounded-2xl font-bold focus:border-primary outline-none transition-all"
                  value={selectedDogId || ""}
                  onChange={(e) => setSelectedDogId(e.target.value)}
                >
                  <option value="">Select a stud...</option>
                  {dogs.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.phenotype})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Dam (Vixen)</label>
                <select
                  className="w-full bg-muted/50 border-2 border-border p-4 rounded-2xl font-bold focus:border-primary outline-none transition-all"
                  value={selectedVixenId || ""}
                  onChange={(e) => setSelectedVixenId(e.target.value)}
                >
                  <option value="">Select a vixen...</option>
                  {vixens.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.phenotype})</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Visual Preview */}
          <div className="grid grid-cols-2 gap-4">
             <Card className="folk-card border-2 border-border shadow-sm rounded-[32px] aspect-square flex items-center justify-center p-8 bg-muted/10">
                {dog ? <FoxIllustration phenotype={dog.phenotype} size={24} /> : <div className="text-xs font-black text-muted-foreground/30 uppercase italic">No Stud</div>}
             </Card>
             <Card className="folk-card border-2 border-border shadow-sm rounded-[32px] aspect-square flex items-center justify-center p-8 bg-muted/10">
                {vixen ? <FoxIllustration phenotype={vixen.phenotype} size={24} /> : <div className="text-xs font-black text-muted-foreground/30 uppercase italic">No Dam</div>}
             </Card>
          </div>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
           {outcomes ? (
             <Card className="folk-card border-2 border-secondary/20 bg-secondary/5 shadow-2xl shadow-secondary/5 rounded-[40px] h-full overflow-hidden">
                <CardContent className="p-10 space-y-10">
                  <div className="flex items-center gap-4 pb-6 border-b border-secondary/10">
                    <div className="p-4 bg-secondary/10 rounded-[2rem]">
                      <Calculator className="text-secondary" size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black italic text-foreground tracking-tight">Outcome Prediction</h3>
                      <p className="text-xs text-muted-foreground font-medium">Genetic simulation based on 1,000 trials</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-background/50 backdrop-blur-md rounded-[32px] border border-secondary/10 shadow-inner">
                      <p className="text-[10px] font-black text-secondary uppercase mb-3 tracking-[0.2em]">Predicted Inbreeding (COI)</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black text-foreground tabular-nums tracking-tighter">{outcomes.predictedCOI}<span className="text-2xl text-secondary/40">%</span></span>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] px-2">Top Phenotypes</p>
                       <div className="space-y-2">
                          {outcomes.probabilities.slice(0, 5).map(p => (
                            <div key={p.name} className="bg-card p-3 rounded-xl border border-border flex justify-between items-center text-[10px] font-bold">
                               <span className="italic">{p.name}</span>
                               <span className="text-secondary">{p.percent}%</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-2xl border border-border">
                    <AlertCircle size={18} className="text-muted-foreground/40 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                      Predictions are probabilistic. Actual results may vary based on random allele inheritance.
                    </p>
                  </div>
                </CardContent>
             </Card>
           ) : (
             <div className="h-full flex flex-col items-center justify-center py-24 bg-muted/10 rounded-[40px] border-2 border-dashed border-border px-8 text-center">
                <Shield size={48} className="text-muted-foreground/20 mb-4" />
                <h4 className="text-xl font-black text-foreground italic mb-2">Awaiting Selection</h4>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium text-sm">Select both a Stud and a Dam to begin the genetic comparison and preview potential outcomes.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
