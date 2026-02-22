'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, ShoppingBag, Info, ExternalLink } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import Link from 'next/link';

export default function AdoptionPage() {
  const {
    foundationFoxes, soldFoundationalSlots, buyFoundationalFoxById,
    gold, foxes, kennelCapacity, checkAdoptionReset
  } = useGameStore();

  useEffect(() => {
    checkAdoptionReset();
  }, [checkAdoptionReset]);

  const currentFoxCount = Object.keys(foxes).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Foundation Fox Adoption</h1>
        <p className="text-muted-foreground mt-2">Adopt high-quality foxes with clean pedigrees. New foxes available hourly with guaranteed variety.</p>
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-4 border-primary/30">
          <h4 className="font-black text-sm mb-2">Adoption Schedule & Genetics</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>Hourly Refresh:</strong> New collection of 6 foxes every hour</li>
            <li>• <strong>Guaranteed Variety:</strong> At least one red base and one cross fox per hour</li>
            <li>• <strong>Black Fox Limit:</strong> Maximum one black fox per hour (high rarity)</li>
            <li>• <strong>Rare Gene Chance:</strong> Each fox has a 25% chance of carrying a heterozygous rare gene (Gg, Cc, Pp, Ss, Fifi, Ll)</li>
            <li>• <strong>Foundation Quality:</strong> All foxes have clean pedigrees for breeding programs</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foundationFoxes.map((fox, index) => {
          const isSold = soldFoundationalSlots.includes(index);
          return (
            <Card key={index} className={cn(
              "folk-card overflow-hidden flex flex-col border-border bg-card",
              isSold ? "opacity-60 grayscale" : "hover:shadow-md transition-shadow"
            )}>
              <div className="h-80 flex items-center justify-center relative bg-gradient-to-b from-muted to-card">
                <FoxIllustration
                  phenotype={fox.phenotype}
                  baseColor={fox.baseColor}
                  pattern={fox.pattern}
                  eyeColor={fox.eyeColor}
                  size={18}
                />
                {isSold && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-black text-3xl uppercase tracking-widest -rotate-12 border-4 border-white px-4 py-1">Sold</span>
                  </div>
                )}
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-foreground">{fox.phenotype}</h3>
                    <Badge variant="outline" className="text-xs font-black uppercase tracking-wider">
                      {fox.gender}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Foundational Pedigree</p>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold border-t border-border pt-4">
                    <span className="text-muted-foreground uppercase tracking-widest">Price</span>
                    <span className="text-yellow-600 flex items-center gap-1 font-black">
                      <Coins size={16} /> 1,000
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/fox/${fox.id}`} className="flex-1">
                      <Button variant="outline" className="w-full h-12 font-bold gap-2">
                        <ExternalLink size={16} /> View Profile
                      </Button>
                    </Link>
                    <Button
                      onClick={() => buyFoundationalFoxById(index)}
                      disabled={isSold || gold < 1000 || currentFoxCount >= kennelCapacity}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground border-none font-bold flex-1 h-12"
                    >
                      {isSold ? 'Sold Out' : 'Adopt Now'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {currentFoxCount >= kennelCapacity && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-center font-bold">
          Your kennel is full! You cannot adopt more foxes right now.
        </div>
      )}
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
