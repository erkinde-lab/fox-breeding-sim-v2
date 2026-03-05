'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowLeft, Heart, Coins, Dna, ShoppingCart } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import Link from 'next/link';

export default function NPCKennelPage() {
  const { foxes, gold, buyFoundationFox } = useGameStore();

  const foundationFoxes = Object.values(foxes).filter(fox => fox.ownerId === "player-0" && fox.isFoundation);
  const npcStuds = Object.values(foxes).filter(fox => fox.ownerId === "player-0" && !fox.isFoundation);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/kennel"
            className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <ArrowLeft size={20} className="text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-5xl font-folksy text-foreground tracking-tight flex items-center gap-4" style={{ fontWeight: 400 }}>
              <Users className="text-primary" size={40} /> NPC Kennel
            </h1>
            <p className="text-muted-foreground mt-2">
              Game-owned foxes available for breeding and adoption
            </p>
          </div>
        </div>
      </div>

      {/* Foundation Foxes Section */}
      {foundationFoxes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-green-600" size={24} />
            <h2 className="text-3xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>
              Foundation Foxes - Available for Adoption
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundationFoxes.map((fox) => (
              <div
                key={fox.id}
                className="folk-card border-2 border-green-200 bg-green-50/30 shadow-sm rounded-[32px] overflow-hidden bg-card"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <FoxIllustration
                          phenotype={fox.phenotype}
                          baseColor={fox.baseColor}
                          pattern={fox.pattern}
                          eyeColor={fox.eyeColor}
                          size={8}
                        />
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-foreground">{fox.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{fox.phenotype}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 border-green-300 text-green-700">
                      For Sale
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Gender</p>
                      <p className="font-bold text-foreground">{fox.gender}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Age</p>
                      <p className="font-bold text-foreground">{fox.age}y</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Price</p>
                      <p className="font-bold text-foreground flex items-center gap-1">
                        <Coins size={12} /> 1,000
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Genotype</p>
                      <div className="flex items-center gap-1">
                        <Dna size={12} />
                        <Badge variant="secondary" className="text-[9px] px-1 py-0">
                          {fox.genotypeRevealed ? "Revealed" : "Hidden"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <Button
                      onClick={() => buyFoundationFox(fox.id)}
                      disabled={gold < 1000}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-bold"
                    >
                      Adopt for 1,000 Gold
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NPC Studs Section */}
      {npcStuds.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Heart className="text-primary" size={24} />
            <h2 className="text-3xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>
              NPC Studs - Available for Breeding
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {npcStuds.map((npc) => (
              <div
                key={npc.id}
                className="folk-card border-2 border-border shadow-sm rounded-[32px] overflow-hidden bg-card"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <FoxIllustration
                          phenotype={npc.phenotype}
                          baseColor={npc.baseColor}
                          pattern={npc.pattern}
                          eyeColor={npc.eyeColor}
                          size={8}
                        />
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-foreground">{npc.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{npc.phenotype}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                      NPC
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Gender</p>
                      <p className="font-bold text-foreground">{npc.gender}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Age</p>
                      <p className="font-bold text-foreground">{npc.age}y</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Stud Fee</p>
                      <p className="font-bold text-foreground flex items-center gap-1">
                        <Coins size={12} /> {npc.studFee}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pattern</p>
                      <p className="font-bold text-foreground">{npc.pattern}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Dna size={12} />
                    <span>Available for breeding in the Stud Barn</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(foundationFoxes.length === 0 && npcStuds.length === 0) && (
        <div className="text-center py-12">
          <Users className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Game Foxes Available</h3>
          <p className="text-muted-foreground">
            Foundation foxes and NPC studs will be available for adoption and breeding. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
