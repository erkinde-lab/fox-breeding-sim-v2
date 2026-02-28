"use client";
import { cn } from "@/lib/utils";

import React, { useState, useMemo } from "react";
import { useGameStore } from "@/lib/store";
import {
  getPhenotype,
  breed,
  calculateCOI,
  LOCI,
  calculateBreedingOutcomes,
} from "@/lib/genetics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertCircle, Calculator, Lock } from "lucide-react";
import { FoxIllustration } from "@/components/FoxIllustration";

export default function BreedingPage() {
  const {
    foxes,
    breedFoxes,
    season,
    inventory,
    hiredGeneticist,
    pregnancyList,
  } = useGameStore();
  const [selectedDog, setSelectedDog] = useState<string | null>(null);
  const [selectedVixen, setSelectedVixen] = useState<string | null>(null);

  const hasCalculator = inventory["calculator-access"] > 0;
  const hasGeneticist = hiredGeneticist;

  const foxList = Object.values(foxes);
  const dogs = foxList.filter(
    (f) => f.gender === "Dog" && !f.isRetired && !f.isAltered && f.age >= 2,
  );
  const vixens = foxList.filter(
    (f) => f.gender === "Vixen" && !f.isRetired && !f.isAltered && f.age >= 2,
  );

  const handleBreed = () => {
    if (selectedDog && selectedVixen) {
      if (!hasCalculator && !hasGeneticist) {
        alert(
          "You need to hire Geneticist staff member or purchase Breeding Calculator to access breeding insights!",
        );
        return;
      }

      breedFoxes(selectedDog, selectedVixen);
      setSelectedDog(null);
      setSelectedVixen(null);
      alert("Breeding successful! Kits will be born in Spring.");
    }
  };

  const outcomes = useMemo(() => {
    if (!selectedDog || !selectedVixen) return null;
    const m = foxes[selectedDog];
    const f = foxes[selectedVixen];
    if (!m || !f) return null;
    return calculateBreedingOutcomes(m, f, foxes);
  }, [selectedDog, selectedVixen, foxes]);

  const isWinter = season === "Winter";

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2
          className="text-5xl font-folksy text-foreground tracking-tight"
          style={{ fontWeight: 400 }}
        >
          Breeding Center
        </h2>
        {!isWinter && (
          <Badge
            variant="destructive"
            className="gap-2 px-4 py-2 rounded-xl shadow-lg shadow-destructive/20 font-black uppercase text-[10px] tracking-widest text-white"
          >
            <AlertCircle size={14} /> Seasonal Lock: Winter Only
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Dog Selection */}
        <Card
          className={cn(
            "folk-card border-2 flex flex-col transition-all duration-500",
            selectedDog
              ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5"
              : "border-border",
          )}
        >
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Select
              Sire (Dog)
            </CardTitle>
          </CardHeader>
          <CardContent
            className="space-y-3 flex-1"
            role="radiogroup"
            aria-label="Select Dog"
          >
            {dogs.map((m) => (
              <div
                key={m.id}
                role="radio"
                aria-checked={selectedDog === m.id}
                onClick={() => setSelectedDog(m.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group flex items-center gap-4",
                  selectedDog === m.id
                    ? "bg-card border-primary shadow-md translate-x-1"
                    : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50",
                )}
              >
                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center shrink-0 border border-border/50">
                  <FoxIllustration phenotype={m.phenotype} size={6} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-foreground italic group-hover:text-primary transition-colors truncate">
                    {m.name}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    {m.phenotype}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(m.genotype).map(([locus, alleles]) => (
                      <span
                        key={locus}
                        className="text-[7px] font-mono bg-muted px-0.5 rounded text-muted-foreground uppercase"
                      >
                        {locus}:{alleles.join("")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {dogs.length === 0 && (
              <div className="text-center py-10 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                <p className="text-xs font-bold text-muted-foreground/50 italic">
                  No eligible dogs (Age 2+)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center gap-6 p-8 bg-muted/20 rounded-[48px] border-2 border-dashed border-border">
          <div className="relative">
            <Heart
              className={cn(
                "w-20 h-20 transition-all duration-700",
                selectedDog && selectedVixen
                  ? "text-primary scale-110 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-pulse"
                  : "text-muted-foreground/10 translate-y-2",
              )}
            />
            {selectedDog && selectedVixen && (
              <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full scale-150 blur-xl"></div>
            )}
          </div>

          <div className="space-y-4 w-full">
            <Button
              onClick={handleBreed}
              disabled={!selectedDog || !selectedVixen || !isWinter}
              className={cn(
                "w-full py-8 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl",
                selectedDog && selectedVixen
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                  : "bg-muted text-muted-foreground opacity-50",
              )}
            >
              Commit Breeding
            </Button>
            {!isWinter && (
              <p className="text-[10px] text-center font-bold text-muted-foreground/60 uppercase tracking-widest">
                Available in Winter
              </p>
            )}
          </div>
        </div>

        {/* Vixen Selection */}
        <Card
          className={cn(
            "folk-card border-2 flex flex-col transition-all duration-500",
            selectedVixen
              ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5"
              : "border-border",
          )}
        >
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span> Select
              Dam (Vixen)
            </CardTitle>
          </CardHeader>
          <CardContent
            className="space-y-3 flex-1"
            role="radiogroup"
            aria-label="Select Vixen"
          >
            {vixens.map((f) => {
              const isServiced = pregnancyList.some((p) => p.motherId === f.id);
              return (
                <div
                  key={f.id}
                  role="radio"
                  aria-checked={selectedVixen === f.id}
                  onClick={() => !isServiced && setSelectedVixen(f.id)}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all duration-300 group flex items-center gap-4",
                    isServiced
                      ? "opacity-50 grayscale cursor-not-allowed bg-muted/10 border-border"
                      : selectedVixen === f.id
                        ? "bg-card border-primary shadow-md -translate-x-1 cursor-pointer"
                        : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50 cursor-pointer",
                  )}
                >
                  <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center shrink-0 border border-border/50">
                    <FoxIllustration phenotype={f.phenotype} size={6} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="font-black text-foreground italic group-hover:text-primary transition-colors truncate">
                        {f.name}
                      </div>
                      {isServiced && (
                        <Badge
                          variant="outline"
                          className="text-[8px] uppercase font-black border-primary/30 text-primary"
                        >
                          Serviced
                        </Badge>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      {f.phenotype}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(f.genotype).map(([locus, alleles]) => (
                        <span
                          key={locus}
                          className="text-[7px] font-mono bg-muted px-0.5 rounded text-muted-foreground uppercase"
                        >
                          {locus}:{alleles.join("")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            {vixens.length === 0 && (
              <div className="text-center py-10 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                <p className="text-xs font-bold text-muted-foreground/50 italic">
                  No eligible vixens (Age 2+)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calculator Section */}
      {selectedDog && selectedVixen && (
        <Card className="folk-card border-secondary/20 bg-secondary/5 overflow-hidden shadow-2xl shadow-secondary/5 rounded-[40px]">
          <CardContent className="p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b border-secondary/10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-secondary/10 rounded-[2rem]">
                  <Calculator className="text-secondary" size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black italic text-foreground tracking-tight">
                    Breeding Insights
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    Genetic simulation based on 1,000 trials
                  </p>
                </div>
              </div>
              {!hasCalculator && !hasGeneticist && (
                <Badge
                  variant="outline"
                  className="text-secondary border-secondary/20 bg-secondary/5 px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest"
                >
                  Analyzer Not Purchased
                </Badge>
              )}
            </div>

            {(hasCalculator || hasGeneticist) && outcomes && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="p-8 bg-background/50 backdrop-blur-md rounded-[32px] border border-secondary/10 shadow-inner">
                    <p className="text-[10px] font-black text-secondary uppercase mb-3 tracking-[0.2em]">
                      Predicted Inbreeding (COI)
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-6xl font-black text-foreground tabular-nums tracking-tighter">
                        {outcomes.predictedCOI}
                        <span className="text-3xl text-secondary/40">%</span>
                      </span>
                      {outcomes.predictedCOI > 15 && (
                        <Badge
                          variant="destructive"
                          className="font-black uppercase text-[9px] px-2 py-1 shadow-lg shadow-destructive/20 animate-pulse text-white"
                        >
                          High Risk
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-2xl border border-border">
                    <AlertCircle
                      size={18}
                      className="text-muted-foreground/40 shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                      COI measures the probability that both gene copies at a
                      locus are descended from the same ancestor. High COI can
                      lead to lethal genetic expression.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] px-2">
                    Phenotype Probabilities
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {outcomes.probabilities.slice(0, 8).map((item) => (
                      <div
                        key={item.name}
                        className="bg-card p-4 rounded-2xl border border-border flex justify-between items-center group hover:border-secondary/30 transition-all hover:translate-x-2"
                      >
                        <span className="font-bold text-foreground group-hover:text-secondary transition-colors italic">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-secondary transition-all duration-1000"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                          <span className="font-black text-xs tabular-nums text-muted-foreground w-8 text-right">
                            {item.percent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!hasCalculator && !hasGeneticist && (
              <div className="text-center py-20 bg-muted/10 rounded-[40px] border-2 border-dashed border-border px-8">
                <Lock
                  size={48}
                  className="mx-auto text-muted-foreground/20 mb-4"
                />
                <h4 className="text-xl font-black text-foreground italic mb-2">
                  Calculator Locked
                </h4>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                  Purchase the **Inbreeding Calculator** from the shop or hire a
                  **Geneticist** to unlock detailed genetic insights for this
                  pair.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
