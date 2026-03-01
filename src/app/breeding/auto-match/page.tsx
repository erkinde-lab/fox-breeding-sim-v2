"use client";

import React, { useMemo } from "react";
import { useGameStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FoxIllustration } from "@/components/FoxIllustration";
import { Sparkles, Heart, Lock, AlertCircle } from "lucide-react";
import { calculateCOI } from "@/lib/genetics";
import Link from "next/link";
import { BreedingTabs } from "@/components/BreedingTabs";

export default function AutoMatchPage() {
  const { foxes, hiredGeneticist } = useGameStore();

  const suggestions = useMemo(() => {
    if (!hiredGeneticist) return [];

    const dogs = Object.values(foxes).filter(f => f.gender === "Dog" && !f.isRetired && !f.isAltered && f.age >= 2);
    const vixens = Object.values(foxes).filter(f => f.gender === "Vixen" && !f.isRetired && !f.isAltered && f.age >= 2);

    const matches: any[] = [];

    dogs.forEach(dog => {
      vixens.forEach(vixen => {
        const coi = calculateCOI(dog.id, foxes, vixen.id);
        if (coi < 10) { // Suggested match for low inbreeding
          const score = (
            Object.values(dog.stats).reduce((a, b) => a + b, 0) +
            Object.values(vixen.stats).reduce((a, b) => a + b, 0)
          ) / 20;

          matches.push({
            dog,
            vixen,
            coi,
            score: Math.round(score),
          });
        }
      });
    });

    return matches.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [foxes, hiredGeneticist]);

  if (!hiredGeneticist) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted/20 rounded-[2.5rem] flex items-center justify-center mb-6">
          <Lock className="text-muted-foreground/30" size={48} />
        </div>
        <h2 className="text-3xl font-black italic text-foreground uppercase tracking-tight mb-2">Service Locked</h2>
        <p className="text-muted-foreground max-w-md mx-auto font-medium mb-8">
          The Auto-Match genetic pairing service requires a professional **Geneticist** on staff.
        </p>
        <Link href="/shop/staff">
          <Button className="font-black uppercase tracking-widest px-8 h-14 rounded-2xl">
            Visit Staff Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <BreedingTabs />
      <div>
        <h2 className="text-4xl font-folksy text-foreground tracking-tight flex items-center gap-3">
          <Sparkles className="text-primary" size={32} /> Genetic Auto-Match
        </h2>
        <p className="text-muted-foreground text-sm">Suggested breeding pairs based on stat quality and low inbreeding risk.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {suggestions.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[40px]">
            <AlertCircle className="mx-auto mb-4 text-muted-foreground/30" size={48} />
            <p className="font-black uppercase tracking-widest text-xs text-muted-foreground">No ideal matches found in your kennel</p>
          </div>
        ) : (
          suggestions.map((match, idx) => (
            <Card key={idx} className="folk-card border-border bg-card overflow-hidden rounded-[32px] hover:border-primary/30 transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 p-6 flex items-center gap-6 border-b md:border-b-0 md:border-r border-border/50">
                    <div className="w-20 h-20 bg-muted/30 rounded-2xl flex items-center justify-center shrink-0">
                      <FoxIllustration phenotype={match.dog.phenotype} size={8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black italic text-foreground uppercase truncate">{match.dog.name}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Sire • {match.dog.phenotype}</div>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col items-center justify-center bg-primary/5 min-w-[150px] gap-2">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest">Match Quality</div>
                    <div className="text-3xl font-black text-foreground">{match.score}</div>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase">
                      COI: <span className="text-green-600 font-black">{match.coi}%</span>
                    </div>
                  </div>

                  <div className="flex-1 p-6 flex items-center gap-6 border-t md:border-t-0 md:border-l border-border/50">
                    <div className="flex-1 min-w-0 text-right">
                      <div className="text-sm font-black italic text-foreground uppercase truncate">{match.vixen.name}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Dam • {match.vixen.phenotype}</div>
                    </div>
                    <div className="w-20 h-20 bg-muted/30 rounded-2xl flex items-center justify-center shrink-0">
                      <FoxIllustration phenotype={match.vixen.phenotype} size={8} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
