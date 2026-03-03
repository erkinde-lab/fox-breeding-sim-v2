"use client";

import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ChevronLeft,
  Activity,
  Dna,
  Lock,
  Shield,
  Check,
  UserPlus
} from "lucide-react";
import { BreedingTabs } from "@/components/BreedingTabs";
import { FoxIllustration } from "@/components/FoxIllustration";
import { suggestMatches } from "@/lib/breeding-utils";

export default function BreedingAutoMatchPage() {
  const { foxes, hiredGeneticist } = useGameStore();
  const [selectedVixenId, setSelectedVixenId] = useState<string | null>(null);

  const vixens = Object.values(foxes).filter(f => f.gender === "Vixen" && !f.isRetired && f.age >= 2);
  const candidateDogs = Object.values(foxes).filter(f => f.gender === "Dog" && !f.isRetired && f.age >= 2);

  const matches = selectedVixenId ? suggestMatches(selectedVixenId, candidateDogs, foxes) : [];

  if (!hiredGeneticist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div>
          <h1 className="text-4xl font-black italic text-foreground tracking-tight mb-2">Breeding Center</h1>
          <p className="text-muted-foreground font-medium">Evaluate potential pairings and manage your nursery.</p>
        </div>

        <BreedingTabs />

        <div className="text-center py-24 bg-muted/10 rounded-[40px] border-2 border-dashed border-border px-8">
          <Lock size={48} className="mx-auto text-muted-foreground/20 mb-4" />
          <h4 className="text-2xl font-black text-foreground italic mb-2">Service Locked</h4>
          <p className="text-muted-foreground max-w-sm mx-auto font-medium">
            You must hire a **Geneticist** from the Staff Shop to unlock the Auto-Match assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-4xl font-black italic text-foreground tracking-tight mb-2">Breeding Center</h1>
        <p className="text-muted-foreground font-medium">Evaluate potential pairings and manage your nursery.</p>
      </div>

      <BreedingTabs />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
           <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Select Vixen</h4>
           <div className="space-y-2">
              {vixens.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVixenId(v.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${selectedVixenId === v.id ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-border hover:border-primary/30 bg-card"}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-muted/20 rounded-lg">
                    <FoxIllustration phenotype={v.phenotype} size={6} />
                  </div>
                  <div className="text-left">
                     <div className="text-[10px] font-black uppercase text-foreground leading-none">{v.name}</div>
                     <div className="text-[8px] font-bold text-muted-foreground uppercase">{v.phenotype}</div>
                  </div>
                </button>
              ))}
              {vixens.length === 0 && <div className="text-xs italic text-muted-foreground text-center py-10">No eligible vixens found.</div>}
           </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
           <h3 className="text-xl font-black italic text-foreground flex items-center gap-3">
              <Sparkles size={24} className="text-primary" /> Suggested Matches
              {selectedVixenId && <span className="text-muted-foreground font-medium not-italic text-sm ml-2">for {foxes[selectedVixenId].name}</span>}
           </h3>

           {!selectedVixenId ? (
              <div className="flex flex-col items-center justify-center py-24 bg-muted/10 rounded-[40px] border-2 border-dashed border-border px-8 text-center">
                 <UserPlus size={48} className="text-muted-foreground/20 mb-4" />
                 <h4 className="text-xl font-black text-foreground italic mb-2">Select a Dam</h4>
                 <p className="text-muted-foreground max-w-sm mx-auto font-medium text-sm">Pick a vixen from your kennel to see the most compatible studs based on COI and genetic diversity.</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {matches.map(({ fox, coi }) => (
                   <Card key={fox.id} className="folk-card border-2 border-border shadow-sm rounded-3xl hover:border-primary/40 hover:shadow-lg transition-all">
                      <CardContent className="p-6 flex items-center gap-4">
                         <div className="w-16 h-16 bg-muted/30 rounded-2xl flex items-center justify-center">
                            <FoxIllustration phenotype={fox.phenotype} size={10} />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-black italic text-lg text-foreground tracking-tight">{fox.name}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">{fox.phenotype}</p>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase">
                               COI: {coi}%
                            </Badge>
                         </div>
                      </CardContent>
                   </Card>
                 ))}
                 {matches.length === 0 && <div className="col-span-2 text-center py-20 text-muted-foreground font-bold italic">No compatible studs found.</div>}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
