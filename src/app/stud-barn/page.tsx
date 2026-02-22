
'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Coins, User, Shield } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';

export default function StudBarnPage() {
  const { foxes, npcStuds, breedFoxes, season, gold } = useGameStore();
  const [selectedFemaleId, setSelectedFemaleId] = useState<string | null>(null);

  const ownedStuds = Object.values(foxes).filter(f => f.gender === 'Male' && f.isAtStud && !f.isRetired);
  const availableNPCs = Object.values(npcStuds);
  const eligibleFemales = Object.values(foxes).filter(f => f.gender === 'Female' && !f.isRetired && f.age >= 2);

  const handleBreed = (fatherId: string) => {
    if (!selectedFemaleId) {
      alert("Please select a female fox first!");
      return;
    }
    breedFoxes(fatherId, selectedFemaleId);
    setSelectedFemaleId(null);
    alert("Breeding committed! Check Spring for results.");
  };

  const isWinter = season === 'Winter';

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-5xl font-folksy text-foreground tracking-tight flex items-center gap-4" style={{ fontWeight: 400 }}>
          <Shield className="text-primary" size={40} /> Stud Barn
        </h2>
        {!isWinter && (
          <Badge variant="destructive" className="gap-2 px-4 py-2 rounded-xl shadow-lg shadow-destructive/20 font-black uppercase text-[10px] tracking-widest">
            <Shield size={14} /> Seasonal Lock: Winter Only
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Selection Panel */}
        <Card className={cn("lg:col-span-1 folk-card border-2 transition-all duration-500", selectedFemaleId ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5" : "border-border bg-card")}>
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> 1. Select Dam
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eligibleFemales.map(f => (
              <div
                key={f.id}
                onClick={() => setSelectedFemaleId(f.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group",
                  selectedFemaleId === f.id ? "bg-card border-primary shadow-md translate-x-1" : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50"
                )}
              >
                <div className="font-black text-foreground italic group-hover:text-primary transition-colors">{f.name}</div>
                <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{f.phenotype}</div>
              </div>
            ))}
            {eligibleFemales.length === 0 && (
              <div className="text-center py-10 opacity-40 border-2 border-dashed border-border rounded-2xl">
                <p className="text-xs font-bold text-foreground italic">No eligible females (Age 2+)</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stud Listings */}
        <div className="lg:col-span-3 space-y-10">
          <section>
            <h3 className="text-xl font-black italic text-foreground mb-6 flex items-center gap-3 tracking-tight">
              <User size={24} className="text-secondary" /> Foundation Studs <span className="text-muted-foreground/30 font-medium not-italic text-sm">(NPC)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableNPCs.map(npc => (
                <StudCard
                  key={npc.id}
                  fox={npc}
                  onBreed={() => handleBreed(npc.id)}
                  disabled={!isWinter || !selectedFemaleId || gold < npc.studFee}
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
                    onBreed={() => handleBreed(stud.id)}
                    disabled={!isWinter || !selectedFemaleId}
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

function StudCard({ fox, onBreed, disabled }: { fox: import('@/lib/genetics').Fox, onBreed: () => void, disabled: boolean }) {
  return (
    <Card className="folk-card overflow-hidden border-2 border-border bg-card group hover:border-secondary/30 transition-all hover:shadow-xl hover:shadow-secondary/5 rounded-[32px]">
      <div className="flex h-56">
        <div className="w-56 flex-shrink-0 bg-muted/40 flex items-center justify-center relative transition-colors group-hover:bg-secondary/5">
          <FoxIllustration phenotype={fox.phenotype} size={14} />
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="text-[10px] uppercase font-black bg-background/80 backdrop-blur-md border-border">Age {fox.age}</Badge>
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-black italic text-xl text-foreground group-hover:text-secondary transition-colors tracking-tight">{fox.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-3 line-clamp-1">{fox.phenotype}</p>
            <div className="flex items-center gap-2 text-secondary font-black text-sm uppercase tracking-widest">
              <Coins size={16} /> {fox.studFee.toLocaleString()} <span className="text-[10px] opacity-60">Fee</span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={onBreed}
            disabled={disabled}
            className={cn(
              "w-full mt-2 rounded-xl font-black uppercase tracking-widest text-[10px] h-10 transition-all",
              !disabled ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20" : "bg-muted text-muted-foreground opacity-50"
            )}
          >
            Commit Breeding
          </Button>
        </div>
      </div>
    </Card>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
