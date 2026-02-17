
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Shield className="text-blue-600" /> Stud Barn
        </h2>
        {!isWinter && (
          <Badge variant="destructive">Breeding Closed (Only in Winter)</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Selection Panel */}
        <Card className="lg:col-span-1 border-pink-200 bg-pink-50">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-pink-700 uppercase">1. Select your Dam</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {eligibleFemales.map(f => (
              <div 
                key={f.id}
                onClick={() => setSelectedFemaleId(f.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition text-sm",
                  selectedFemaleId === f.id ? "bg-white border-pink-500 shadow-sm" : "bg-white/50 border-pink-100 hover:border-pink-300"
                )}
              >
                <div className="font-bold">{f.name}</div>
                <div className="text-xs text-slate-500">{f.phenotype}</div>
              </div>
            ))}
            {eligibleFemales.length === 0 && <p className="text-xs text-slate-400 italic">No eligible females (Age 2+)</p>}
          </CardContent>
        </Card>

        {/* Stud Listings */}
        <div className="lg:col-span-3 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-500" /> Foundation Studs (NPC)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <section>
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Heart size={18} className="text-pink-500" /> Your Offered Studs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    <Card className="overflow-hidden border-slate-200">
      <div className="flex h-32">
        <div className="w-32 flex-shrink-0">
          <FoxIllustration phenotype={fox.phenotype} />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-900">{fox.name}</h4>
                <Badge variant="outline" className="text-[10px] uppercase">Age {fox.age}</Badge>
            </div>
            <p className="text-xs text-slate-500">{fox.phenotype}</p>
            <div className="mt-2 flex items-center gap-1 text-yellow-600 font-bold text-sm">
                <Coins size={14} /> {fox.studFee.toLocaleString()} Fee
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={onBreed} 
            disabled={disabled}
            className="w-full mt-2"
          >
            Breed
          </Button>
        </div>
      </div>
    </Card>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
