'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { getPhenotype, breed, calculateCOI } from '@/lib/genetics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, AlertCircle, Calculator } from 'lucide-react';

export default function BreedingPage() {
  const { foxes, breedFoxes, season, inventory } = useGameStore();
  const [selectedMale, setSelectedMale] = useState<string | null>(null);
  const [selectedFemale, setSelectedFemale] = useState<string | null>(null);

  const hasCalculator = inventory['calculator-access'] > 0;

  const foxList = Object.values(foxes);
  const males = foxList.filter(f => f.gender === 'Male' && !f.isRetired && f.age >= 2);
  const females = foxList.filter(f => f.gender === 'Female' && !f.isRetired && f.age >= 2);

  const handleBreed = () => {
    if (selectedMale && selectedFemale) {
      breedFoxes(selectedMale, selectedFemale);
      setSelectedMale(null);
      setSelectedFemale(null);
      alert("Breeding successful! Kits will be born in Spring.");
    }
  };

  const calculateOutcomes = () => {
    if (!selectedMale || !selectedFemale) return null;
    const m = foxes[selectedMale];
    const f = foxes[selectedFemale];
    
    const counts: Record<string, number> = {};
    const trials = 1000;
    
    for(let i=0; i<trials; i++) {
        const child = breed(m.genotype, f.genotype);
        if (child) {
            const name = getPhenotype(child).name;
            counts[name] = (counts[name] || 0) + 1;
        }
    }
    
    const predictedCOI = calculateCOI('temp', { 
        ...foxes, 
        temp: { parents: [selectedMale, selectedFemale] } 
    });

    return {
        probabilities: Object.entries(counts)
            .map(([name, count]) => ({ name, percent: Math.round((count / trials) * 100) }))
            .filter(item => item.percent >= 1)
            .sort((a, b) => b.percent - a.percent),
        predictedCOI
    };
  };

  const outcomes = calculateOutcomes();

  const isWinter = season === 'Winter';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Breeding Center</h2>
        {!isWinter && (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle size={14} /> Breeding only available in Winter
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Male Selection */}
        <Card className={cn(selectedMale ? "border-earth-300 bg-earth-100" : "")}>
          <CardHeader>
            <CardTitle className="text-sm uppercase text-slate-500">Select Sire (Male)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {males.map(m => (
              <div 
                key={m.id}
                onClick={() => setSelectedMale(m.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition",
                  selectedMale === m.id ? "bg-white border-blue-500 shadow-sm" : "bg-white border-slate-100 hover:border-slate-300"
                )}
              >
                <div className="font-bold text-sm">{m.name}</div>
                <div className="text-xs text-slate-500">{m.baseColor}{m.pattern !== "None" && ` with ${m.pattern} markings`}</div>
              </div>
            ))}
            {males.length === 0 && <p className="text-xs text-slate-400 italic">No eligible males</p>}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-4">
           <Heart className={cn("w-12 h-12 transition", selectedMale && selectedFemale ? "text-red-500 animate-pulse" : "text-slate-200")} />
           <Button 
            onClick={handleBreed}
            disabled={!selectedMale || !selectedFemale || !isWinter}
            className="w-full"
            variant={selectedMale && selectedFemale ? 'default' : 'outline'}
           >
             Commit Breeding
           </Button>
        </div>

        {/* Female Selection */}
        <Card className={cn(selectedFemale ? "border-earth-300 bg-earth-100" : "")}>
          <CardHeader>
            <CardTitle className="text-sm uppercase text-slate-500">Select Dam (Female)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {females.map(f => (
              <div 
                key={f.id}
                onClick={() => setSelectedFemale(f.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition",
                  selectedFemale === f.id ? "bg-white border-pink-500 shadow-sm" : "bg-white border-slate-100 hover:border-slate-300"
                )}
              >
                <div className="font-bold text-sm">{f.name}</div>
                <div className="text-xs text-slate-500">{f.baseColor}{f.pattern !== "None" && ` with ${f.pattern} markings`}</div>
              </div>
            ))}
            {females.length === 0 && <p className="text-xs text-slate-400 italic">No eligible females</p>}
          </CardContent>
        </Card>
      </div>

      {/* Calculator Section */}
      {selectedMale && selectedFemale && (
        <Card className="border-[#E8E1D3] bg-[#FDFBF7]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Calculator className="text-fire-600" />
                <h3 className="font-bold text-earth-900">Breeding Insights</h3>
              </div>
              {!hasCalculator && (
                <Badge variant="outline" className="text-purple-400 border-purple-200">
                    Calculator not purchased
                </Badge>
              )}
            </div>
            
            {hasCalculator && outcomes && (
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-bold text-purple-400 uppercase mb-2">Predicted Inbreeding (COI)</p>
                        <div className="text-2xl font-black text-earth-900">
                            {outcomes.predictedCOI}%
                            {outcomes.predictedCOI > 15 && (
                                <span className="text-xs font-bold text-red-500 ml-2 uppercase tracking-tighter">High Inbreeding Risk</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-bold text-purple-400 uppercase">Phenotype Probabilities (1,000 simulations)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {outcomes.probabilities.map(item => (
                                <div key={item.name} className="bg-white p-2 rounded border border-purple-100 flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                                    <Badge className="bg-earth-200 text-earth-700 border-none">{item.percent}%</Badge>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4 italic">* Exceedingly rare results (&lt; 1%) are hidden but not impossible.</p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
