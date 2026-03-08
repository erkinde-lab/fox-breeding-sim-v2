'use client';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, Coins } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import Link from 'next/link';

export default function FoundationFoxStorePage() {
  const { foxes, gold, buyFoundationFox, repopulateFoundationFoxes } = useGameStore();
  const [soldSlots, setSoldSlots] = useState<Set<string>>(new Set());

  // Track previous foundation fox count to detect repopulation


  const foundationFoxes = Object.values(foxes).filter(fox => fox.isFoundation);

  // Track previous foundation fox count to detect repopulation
  const prevCountRef = React.useRef(foundationFoxes.length);

  // Clear soldSlots when foundation foxes are repopulated (count INCREASES)
  useEffect(() => {
    const currentCount = foundationFoxes.length;
    if (prevCountRef.current > 0 && currentCount > prevCountRef.current) {
      // Foundation foxes were repopulated (count increased), clear sold slots
      setTimeout(() => setSoldSlots(new Set()), 0);
    }
    prevCountRef.current = currentCount;
  }, [foundationFoxes.length]);

  // Hourly repopulation scheduler
  useEffect(() => {
    const scheduleHourlyRepopulation = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0); // Next :00

      const timeUntilNextHour = nextHour.getTime() - now.getTime();

      // Schedule first repopulation
      const timeoutId = setTimeout(() => {
        repopulateFoundationFoxes();

        // Schedule subsequent repopulations every hour
        const intervalId = setInterval(() => {
          repopulateFoundationFoxes();
        }, 60 * 60 * 1000); // 1 hour in milliseconds

        // Store interval ID for cleanup (though this component may not unmount)
        return () => clearInterval(intervalId);
      }, timeUntilNextHour);

      return () => clearTimeout(timeoutId);
    };

    const cleanup = scheduleHourlyRepopulation();

    return cleanup;
  }, [repopulateFoundationFoxes]);

  // Combine available foxes and sold slots for display
  const displayItems = [
    ...foundationFoxes.map(fox => ({ type: 'fox' as const, fox, id: fox.id })),
    ...Array.from(soldSlots).map(slotId => ({ type: 'sold' as const, id: slotId }))
  ];

  const handlePurchase = (foxId: string) => {
    // Immediately show sold card
    setSoldSlots(prev => new Set([...prev, foxId]));

    // Process purchase
    buyFoundationFox(foxId);

    // Sold cards now persist until hourly repopulation
  };

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
              <ShoppingCart className="text-primary" size={40} /> Foundation Fox Store
            </h1>
            <p className="text-muted-foreground mt-2">
              Adopt foundation foxes to start your breeding program
            </p>
          </div>
        </div>
      </div>

      {/* Foundation Foxes Section */}
      {displayItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-success" size={24} />
            <h2 className="text-3xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>
              Foundation Foxes - Available for Adoption
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item) => {
              if (item.type === 'fox') {
                const fox = item.fox;
                // Available fox card
                return (
                  <div
                    key={fox.id}
                    className="folk-card overflow-hidden border-2 border-success/30 bg-success/5/30 shadow-sm rounded-[32px] bg-card relative"
                  >
                    <div className="folk-card overflow-hidden border-2 border-border bg-card rounded-[32px] flex flex-col sm:flex-row h-full">
                      <div className="w-full sm:w-44 flex-shrink-0 bg-muted/40 flex items-center justify-center relative p-4">
                        <FoxIllustration
                          phenotype={fox.phenotype}
                          baseColor={fox.baseColor}
                          pattern={fox.pattern}
                          eyeColor={fox.eyeColor}
                          size={10}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-success/20 border-success/50 text-success text-[8px] uppercase font-black px-1.5 h-4">
                            For Sale
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="font-black italic text-lg text-foreground truncate tracking-tight">{fox.name}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-2">{fox.phenotype}</p>

                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Gender</p>
                              <p className="font-bold text-foreground">{fox.gender}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Age</p>
                              <p className="font-bold text-foreground">{fox.age}y</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Base Color</p>
                              <p className="font-bold text-foreground">{fox.baseColor}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pattern</p>
                              <p className="font-bold text-foreground">{fox.pattern}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest">
                            <Coins size={14} /> 1,000 Gold
                          </div>
                          <Button
                            onClick={() => handlePurchase(fox.id)}
                            disabled={gold < 1000}
                            className="bg-success hover:bg-green-700 text-white rounded-xl font-black uppercase tracking-widest text-xs px-4 h-8"
                            size="sm"
                          >
                            Adopt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Sold placeholder card
                return (
                  <div
                    key={item.id}
                    className="folk-card overflow-hidden border-2 border-gray-300 bg-gray-50/30 opacity-60 rounded-[32px] flex flex-col sm:flex-row h-full"
                  >
                    <div className="w-full sm:w-44 flex-shrink-0 bg-gray-200/50 flex items-center justify-center relative p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-300 flex items-center justify-center">
                          <ShoppingCart className="text-gray-500" size={24} />
                        </div>
                        <Badge variant="outline" className="bg-gray-100 border-gray-400 text-gray-600 text-[8px] uppercase font-black px-1.5 h-4">
                          Sold
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-center items-center text-center">
                      <h3 className="font-black italic text-xl text-gray-500 tracking-tight mb-2">Sold</h3>
                      <p className="text-sm text-gray-400">This foundation fox has been adopted by another breeder</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      {foundationFoxes.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Foundation Foxes Available</h3>
          <p className="text-muted-foreground">
            Foundation foxes will be available for adoption. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
