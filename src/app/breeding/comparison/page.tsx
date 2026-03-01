"use client";

import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FoxIllustration } from "@/components/FoxIllustration";
import { Dna, Trophy, Activity, Heart } from "lucide-react";
import { calculateCOI } from "@/lib/genetics";
import { BreedingTabs } from "@/components/BreedingTabs";

export default function ComparisonPage() {
  const { foxes } = useGameStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const foxList = Object.values(foxes);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedFoxes = selectedIds.map(id => foxes[id]).filter(Boolean);

  return (
    <div className="space-y-8 pb-20">
      <BreedingTabs />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-folksy text-foreground tracking-tight">Fox Comparison</h2>
          <p className="text-muted-foreground text-sm">Select up to 3 foxes to compare side-by-side.</p>
        </div>
        <Badge variant="outline" className="font-black">
          {selectedIds.length} / 3 Selected
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Fox Selector Sidebar */}
        <Card className="xl:col-span-1 folk-card border-border bg-card max-h-[70vh] flex flex-col">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Kennel</CardTitle>
          </CardHeader>
          <CardContent className="p-2 overflow-y-auto">
            <div className="space-y-1">
              {foxList.map(fox => (
                <button
                  key={fox.id}
                  onClick={() => toggleSelection(fox.id)}
                  className={cn(
                    "w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left",
                    selectedIds.includes(fox.id)
                      ? "bg-primary/10 border border-primary/20 text-primary"
                      : "hover:bg-muted border border-transparent"
                  )}
                >
                  <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center shrink-0 border border-border/50">
                    <FoxIllustration phenotype={fox.phenotype} size={4} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black italic truncate">{fox.name}</div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase">{fox.phenotype}</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Grid */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedFoxes.length === 0 ? (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-[40px] opacity-40">
              <Activity className="mx-auto mb-4" size={48} />
              <p className="font-black uppercase tracking-widest text-xs">Select foxes to begin comparison</p>
            </div>
          ) : (
            selectedFoxes.map(fox => (
              <Card key={fox.id} className="folk-card border-border bg-card overflow-hidden rounded-[32px]">
                <div className="aspect-square bg-muted/30 flex items-center justify-center p-8">
                  <FoxIllustration
                    phenotype={fox.phenotype}
                    baseColor={fox.baseColor}
                    pattern={fox.pattern}
                    eyeColor={fox.eyeColor}
                    size={16}
                  />
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-black italic text-foreground uppercase truncate">{fox.name}</h3>
                    <Badge variant="outline" className="mt-1 text-[9px] uppercase font-black">{fox.gender}</Badge>
                  </div>

                  <div className="space-y-4">
                    <SectionHeader icon={<Trophy size={14}/>} label="Show Stats" />
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <CompactStat label="Head" value={fox.stats.head} />
                      <CompactStat label="Topline" value={fox.stats.topline} />
                      <CompactStat label="Front" value={fox.stats.forequarters} />
                      <CompactStat label="Rear" value={fox.stats.hindquarters} />
                      <CompactStat label="Coat" value={fox.stats.coatQuality} />
                      <CompactStat label="Points" value={fox.pointsLifetime} />
                    </div>

                    <SectionHeader icon={<Dna size={14}/>} label="Genetics" />
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(fox.genotype).map(([l, a]) => (
                        <div key={l} className="flex justify-between items-center bg-muted/50 px-2 py-1 rounded-lg">
                          <span className="text-[8px] font-black text-muted-foreground uppercase">{l}</span>
                          <span className="text-[9px] font-mono font-black">{fox.genotypeRevealed ? a.join("") : "??"}</span>
                        </div>
                      ))}
                    </div>

                    <SectionHeader icon={<Heart size={14}/>} label="Health" />
                    <div className="text-[9px] font-bold text-muted-foreground uppercase text-center py-2 bg-muted/20 rounded-xl">
                      COI: {calculateCOI(fox.id, foxes)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-1">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

function CompactStat({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-bold text-muted-foreground uppercase">{label}</span>
      <span className="text-xs font-black tabular-nums">{value}</span>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
