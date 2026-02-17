'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { ShoppingBag, Coins } from 'lucide-react';

export default function AdoptionPage() {
  const { buyFoundationalFox, gold, foxes, kennelCapacity } = useGameStore();
  const currentFoxCount = Object.keys(foxes).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Foundation Fox Adoption</h1>
        <p className="text-slate-500 mt-2">Adopt high-quality foxes with clean pedigrees to start your breeding lines.</p>
      </div>

      <Card className="bg-orange-50 border-orange-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 space-y-4">
            <h3 className="text-2xl font-bold text-orange-900">Foundational Fox</h3>
            <p className="text-orange-800/80">
              Purchase a brand new fox with a blank pedigree. These foxes are ideal for starting new lineages. 
              They come in basic colors and may carry a rare hidden gene.
            </p>
            <ul className="text-sm text-orange-800/70 space-y-1">
              <li>• Blank pedigree (Foundational)</li>
              <li>• Basic color types (Red, Gold, Silver, Cross)</li>
              <li>• Potential for one rare heterozygous gene</li>
              <li>• Competitive starter stats</li>
            </ul>
            <div className="pt-4 flex items-center gap-4">
              <div className="text-2xl font-black text-orange-900 flex items-center gap-2">
                <Coins className="text-yellow-600" /> 5,000
              </div>
              <Button 
                onClick={() => buyFoundationalFox()}
                disabled={gold < 5000 || currentFoxCount >= kennelCapacity}
                size="lg"
                className="bg-orange-600 hover:bg-orange-500 text-white border-none"
              >
                Adopt Now
              </Button>
            </div>
            {currentFoxCount >= kennelCapacity && (
              <p className="text-xs text-red-600 font-bold">Your kennel is full! Sell a fox or upgrade capacity to adopt more.</p>
            )}
          </div>
          <div className="bg-orange-100 flex items-center justify-center p-8">
            <div className="w-48 h-48 bg-white/50 rounded-full flex items-center justify-center border-4 border-orange-200 shadow-inner">
              <ShoppingBag size={80} className="text-orange-300" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
