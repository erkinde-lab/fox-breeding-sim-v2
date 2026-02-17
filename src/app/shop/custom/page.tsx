'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Diamond, Check } from 'lucide-react';
import { LOCI, Genotype } from '@/lib/genetics';

export default function CustomFoxPage() {
  const { buyCustomFoundationalFox, gems, foxes, kennelCapacity } = useGameStore();
  const [customGenotype, setCustomGenotype] = useState<Record<string, string[]>>({});
  const [customGender, setCustomGender] = useState<'Male' | 'Female'>('Male');
  const [showSuccess, setShowSuccess] = useState(false);

  const currentFoxCount = Object.keys(foxes).length;

  const handleCustomBuy = () => {
    // Fill in defaults for missing loci
    const finalGenotype = { ...customGenotype };
    Object.keys(LOCI).forEach(key => {
        if (!finalGenotype[key]) {
            finalGenotype[key] = [LOCI[key].alleles[0], LOCI[key].alleles[0]];
        }
    });

    buyCustomFoundationalFox(finalGenotype as Genotype, customGender);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  function cn(...inputs: (string | boolean | undefined | null)[]) {
    return inputs.filter(Boolean).join(' ');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Custom Designer Foxes</h1>
        <p className="text-slate-500 mt-2">Use your gems to design a fox with a precise genetic profile.</p>
      </div>

      <Card className="border-cyan-500 shadow-xl overflow-hidden">
        <CardHeader className="bg-cyan-600 text-white flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl"><Star className="fill-white" /> Fox Designer</CardTitle>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
               <Diamond size={16} /> {gems} Gems
            </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Selected Gender</label>
                    <div className="flex gap-2">
                        {['Male', 'Female'].map(g => (
                            <Button 
                                key={g} 
                                size="lg" 
                                variant={customGender === g ? 'default' : 'outline'}
                                onClick={() => setCustomGender(g as "Male" | "Female")}
                                className={cn("flex-1 h-14 text-lg transition-all", customGender === g ? "bg-cyan-600" : "")}
                            >
                                {g}
                            </Button>
                        ))}
                    </div>
                </div>

                {Object.entries(LOCI).map(([key, locus]) => (
                    <div key={key} className="space-y-3">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest">
                            {locus.name.toLowerCase().includes("locus") ? locus.name : `${locus.name} Locus`}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {locus.alleles.map(a1 => (
                                locus.alleles.map(a2 => (
                                    <button
                                        key={`${a1}${a2}`}
                                        onClick={() => setCustomGenotype(prev => ({ ...prev, [key]: [a1, a2] }))}
                                        className={cn(
                                            "relative p-3 text-sm border-2 rounded-xl transition-all font-bold overflow-hidden",
                                            (customGenotype[key]?.slice().sort().join('') === [a1, a2].slice().sort().join('')) 
                                                ? "bg-cyan-50 border-cyan-500 text-cyan-700 shadow-sm" 
                                                : "bg-white border-slate-100 hover:border-cyan-200 text-slate-400"
                                        )}
                                    >
                                        <span className="relative z-10">{`${a1}${a2}`}</span>
                                        {locus.lethal?.includes([a1, a2].slice().sort().join("")) && (
                                            <span className="absolute bottom-0 right-0 left-0 bg-red-500 text-[8px] text-white py-0.5 text-center font-black uppercase tracking-tighter">
                                                Lethal
                                            </span>
                                        )}
                                    </button>
                                )).slice(0, locus.alleles.indexOf(a1) + 1)
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-slate-500 text-sm max-w-md">
                    Designing a custom fox costs 50 Gems. The fox will be added to your kennel immediately with 100% health and randomized show stats.
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {showSuccess && (
                        <span className="text-green-600 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                            <Check size={20} /> Fox Created!
                        </span>
                    )}
                    <Button 
                        onClick={handleCustomBuy} 
                        disabled={gems < 50 || currentFoxCount >= kennelCapacity}
                        className="bg-cyan-600 hover:bg-cyan-500 px-12 h-14 text-xl font-bold flex-1 md:flex-none shadow-lg shadow-cyan-200"
                    >
                        <Diamond size={24} className="mr-2" /> Purchase for 50
                    </Button>
                </div>
            </div>
            {currentFoxCount >= kennelCapacity && (
              <p className="text-right text-xs text-red-600 font-bold mt-2">No kennel space available!</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
