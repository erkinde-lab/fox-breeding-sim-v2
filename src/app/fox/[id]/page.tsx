"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGameStore } from "@/lib/store";
import {
  Dna,
  ChevronLeft,
  ChevronRight,
  Heart,
  Shield,
  Trophy,
  Activity as ActivityIcon,
  Calendar,
  Check,
  ShoppingBag,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FoxIllustration } from "@/components/FoxIllustration";
import { isHungry, isGroomed, isTrained, calculateCOI } from "@/lib/genetics";
import { GeneticTooltip } from "@/components/GeneticTooltip";
import { FoxHistory } from "@/components/FoxHistory";

export default function FoxProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { foxes, gold, revealGenotype, totalFoxesCount, isAdmin } = useGameStore();
  const fox = foxes[id];
  const router = useRouter();

  if (!fox) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-black italic mb-4">Fox not found</h2>
        <Link href="/kennel">
          <Button variant="outline" className="font-black uppercase tracking-widest">Return to Kennel</Button>
        </Link>
      </div>
    );
  }

  const isFoundational = parseInt(fox.id) <= 0;
  const hungry = isHungry(fox);
  const groomed = isGroomed(fox);
  const trained = isTrained(fox);

  const handleReveal = () => {
    if (gold >= 500) {
      revealGenotype(fox.id);
    }
  };

  const getStat = (name: keyof typeof fox.stats, bonus = 0) => {
    const val = (fox.stats[name] as number) + bonus;
    return { value: val, bonus };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/kennel">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h1 className="text-4xl font-black italic text-foreground tracking-tight">{fox.name}</h1>
               <Badge variant="outline" className="font-black uppercase tracking-widest bg-muted/50 border-border h-6">{fox.gender}</Badge>
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              ID: {fox.id} <span className="w-1 h-1 rounded-full bg-border" /> {fox.phenotype}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl h-10 font-black uppercase tracking-widest text-[10px] gap-2 px-4"
            disabled={parseInt(fox.id) <= 1}
            onClick={() => router.push(`/fox/${(parseInt(fox.id) - 1).toString()}`)}
          >
            <ChevronLeft size={14} /> Prev
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl h-10 font-black uppercase tracking-widest text-[10px] gap-2 px-4"
            disabled={parseInt(fox.id) >= totalFoxesCount}
            onClick={() => router.push(`/fox/${(parseInt(fox.id) + 1).toString()}`)}
          >
            Next <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Visuals & Core Info */}
        <div className="xl:col-span-4 space-y-8">
          <Card className="folk-card overflow-hidden border-2 border-border shadow-2xl shadow-primary/5 rounded-[48px] bg-gradient-to-b from-card to-muted/20">
            <div className="aspect-square relative flex items-center justify-center p-12 group">
              <FoxIllustration phenotype={fox.phenotype} size={32} />

              {/* Status Badges Overlay */}
              <div className="absolute top-8 right-8 flex flex-col gap-3">
                 {hungry && <Badge variant="destructive" className="font-black uppercase text-[10px] h-8 px-4 rounded-xl shadow-lg shadow-destructive/20">Hungry</Badge>}
                 {!groomed && <Badge variant="outline" className="font-black uppercase text-[10px] h-8 px-4 rounded-xl bg-background/80 backdrop-blur-md border-orange-500/20 text-orange-600">Needs Grooming</Badge>}
              </div>
            </div>

            <CardContent className="p-8 pt-0 text-center">
               <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]">Age {fox.age}</Badge>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]">{fox.pointsLifetime} Pts</Badge>
                  {fox.isRetired && <Badge variant="outline" className="font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]">Retired</Badge>}
               </div>
            </CardContent>
          </Card>

          {/* Traits List */}
          <div className="grid grid-cols-2 gap-4">
             <TraitCard label="Base Color" value={fox.baseColor} />
             <TraitCard label="Pattern" value={fox.pattern} />
             <TraitCard label="Eyes" value={fox.eyeColor} />
             <TraitCard label="Intensity" value={`Level ${fox.silverIntensity}`} />
          </div>
        </div>

        {/* Middle Column: Stats */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="folk-card border-2 border-border shadow-sm rounded-[40px] overflow-hidden">
            <CardHeader className="bg-muted/30 p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield className="text-primary" size={20} />
                <CardTitle className="text-sm font-black uppercase tracking-widest">Performance Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid gap-6">
                <StatBar label="Head" {...getStat("head")} />
                <StatBar label="Topline" {...getStat("topline")} />
                <StatBar label="Forequarters" {...getStat("forequarters")} />
                <StatBar label="Hindquarters" {...getStat("hindquarters")} />
                <StatBar label="Tail" {...getStat("tail")} />
                <StatBar label="Coat Quality" {...getStat("coatQuality", groomed ? 5 : 0)} />
                <StatBar label="Temperament" {...getStat("temperament", trained ? 3 : 0)} />
                <StatBar label="Presence" {...getStat("presence", trained ? 3 : 0)} />
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
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Dna size={16} />
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Genotype</CardTitle>
                </div>
                {!fox.genotypeRevealed && !isFoundational && (
                  <Button
                    onClick={handleReveal}
                    size="sm"
                    variant="ghost"
                    className="text-[10px] font-black uppercase tracking-widest gap-1 hover:text-blue-500 p-0 h-auto"
                  >
                    <ShoppingBag size={12} /> Reveal
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {fox.genotypeRevealed ? (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(fox.genotype).map(([locus, alleles]) => (
                    <GeneticTooltip key={locus} locus={locus} alleles={alleles}>
                      <div className="px-3 py-2 rounded-xl bg-muted/50 border border-border/50 flex justify-between items-center group hover:border-blue-500/30 transition-colors w-full cursor-help">
                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase">{locus}</span>
                        <span className="font-mono text-xs font-black text-foreground">{alleles.join("")}</span>
                      </div>
                    </GeneticTooltip>
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
                  <ActivityIcon size={14} /> Health Status
                </h4>
                {fox.healthIssues.length > 0 ? (
                  <div className="space-y-2">
                    {fox.healthIssues.map(issue => (
                      <Badge key={issue} variant="destructive" className="w-full justify-center h-8 font-black text-[9px] uppercase tracking-widest rounded-lg">{issue}</Badge>
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
                <h4 className="text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                  <Calendar size={14} /> Life Events & Records
                </h4>
                <FoxHistory history={fox.history} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pedigree */}
      <Card className="folk-card border-2 border-border shadow-sm rounded-[48px] overflow-hidden">
        <CardHeader className="bg-muted/30 p-8 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                <Heart size={20} />
              </div>
              <CardTitle className="text-xl font-black italic tracking-tight uppercase">Ancestry & Pedigree</CardTitle>
            </div>
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

function TraitCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 rounded-[2rem] bg-card border-2 border-border/50 shadow-sm">
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="font-black italic text-foreground truncate">{value}</p>
    </div>
  );
}

function StatBar({ label, value, bonus = 0 }: { label: string, value: number, bonus?: number }) {
  const maxValue = label === "Fertility" ? 75 : 100;
  const percentage = Math.min(100, (value / maxValue) * 100);
  const baseValue = value - bonus;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="flex items-center gap-1 font-mono text-xs text-foreground">
          {baseValue}{bonus > 0 && <span className="text-green-500 font-black">+{bonus}</span>}
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner p-0.5 border border-border/50">
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={maxValue}
          aria-label={label}
          className="h-full bg-primary rounded-full transition-all shadow-[0_0_8px_rgba(var(--primary),0.3)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function PedigreeTree({ foxId, foxes, depth = 0, defaultName }: { foxId: string | null, foxes: Record<string, import("@/lib/genetics").Fox>, depth?: number, defaultName?: string | null }) {
  if (depth >= 5) return null;
  const fox = foxId ? foxes[foxId] : null;

  return (
    <div className="flex items-center gap-4">
      <div className={`w-36 p-3 border-2 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center text-center ${
        fox ? "border-border bg-card hover:border-primary/30 group" :
        defaultName ? "border-border bg-muted/20" : "border-border/30 bg-muted/20 text-muted-foreground/30 italic border-dashed"
      }`}>
        {fox ? (
          <Link href={`/fox/${fox.id}`} className="w-full flex flex-col items-center">
            <div className="font-black text-foreground uppercase tracking-tight truncate w-full text-[10px] group-hover:text-primary transition-colors">{fox.name}</div>
            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest truncate w-full">{fox.phenotype}</div>
          </Link>
        ) : defaultName ? (
          <div className="w-full flex flex-col items-center">
            <div className="font-black text-foreground/70 uppercase tracking-tight truncate w-full text-[10px]">{defaultName}</div>
            <div className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest truncate w-full italic">NPC Ancestor</div>
          </div>
        ) : (
          <div className="text-[10px] font-black">?</div>
        )}
      </div>

      {depth < 4 && (
        <div className="flex flex-col gap-2 relative">
          <PedigreeTree
            foxId={fox?.parents?.[0] || null}
            foxes={foxes}
            depth={depth + 1}
            defaultName={fox?.parentNames?.[0]}
          />
          <PedigreeTree
            foxId={fox?.parents?.[1] || null}
            foxes={foxes}
            depth={depth + 1}
            defaultName={fox?.parentNames?.[1]}
          />
        </div>
      )}
    </div>
  );
}
