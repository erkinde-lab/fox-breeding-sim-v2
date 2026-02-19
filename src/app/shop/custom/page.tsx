'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Diamond, Check, Microscope } from 'lucide-react';
import { LOCI, Genotype, getPhenotype } from '@/lib/genetics';
import { FoxIllustration } from '@/components/FoxIllustration';

export default function CustomFoxPage() {
  const { buyCustomFoundationalFox, gems, foxes, kennelCapacity } = useGameStore();
  const [customGenotype, setCustomGenotype] = useState<Record<string, string[]>>({});
  const [customGender, setCustomGender] = useState<'Male' | 'Female'>('Male');
  const [foxName, setFoxName] = useState('Custom Designer Fox');
  const [showSuccess, setShowSuccess] = useState(false);

  const currentFoxCount = Object.keys(foxes).length;

  const currentGenotype = useMemo(() => {
      const finalGenotype = { ...customGenotype };
      Object.keys(LOCI).forEach(key => {
          if (!finalGenotype[key]) {
              finalGenotype[key] = [LOCI[key].alleles[0], LOCI[key].alleles[0]];
          }
      });
      return finalGenotype as Genotype;
  }, [customGenotype]);

  const currentPhenotype = useMemo(() => getPhenotype(currentGenotype), [currentGenotype]);

  const handleCustomBuy = () => {
    buyCustomFoundationalFox(currentGenotype, customGender, foxName);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Custom Designer Foxes</h1>
        <p className="text-slate-500 mt-2 font-medium">Use your gems to design a fox with a precise genetic profile.</p>
      </div>

      <Card className="border-cyan-500 shadow-xl overflow-hidden border-2 rounded-[32px]">
        <CardHeader className="bg-cyan-600 text-white flex flex-row items-center justify-between p-8">
            <CardTitle className="flex items-center gap-2 text-2xl font-black italic uppercase tracking-tighter"><Star className="fill-white" /> Fox Designer</CardTitle>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-black">
               <Diamond size={18} /> {gems.toLocaleString()} GEMS
            </div>
        </CardHeader>
        <CardContent className="p-8 space-y-12">
            {/* Top Config Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner">
                <div className="w-full lg:w-1/2 space-y-6 flex flex-col justify-center">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Fox Identity</label>
                        <input
                            type="text"
                            value={foxName}
                            onChange={(e) => setFoxName(e.target.value)}
                            placeholder="Enter fox name..."
                            className="w-full bg-white border-2 border-slate-200 p-4 rounded-2xl font-black text-lg focus:border-cyan-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Selected Gender</label>
                        <div className="flex gap-2">
                            {['Male', 'Female'].map(g => (
                                <Button
                                    key={g}
                                    onClick={() => setCustomGender(g as 'Male' | 'Female')}
                                    variant={customGender === g ? 'default' : 'outline'}
                                    className={cn(
                                        "flex-1 h-12 font-black rounded-xl border-2 uppercase tracking-widest",
                                        customGender === g ? "bg-cyan-600 border-cyan-600 text-white" : "border-slate-200 text-slate-400 hover:bg-white"
                                    )}
                                >
                                    {g}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1 pt-4 border-t border-slate-200">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Phenotype Preview</label>
                        <div className="text-xl font-black text-cyan-800 tracking-tight">{currentPhenotype.name}</div>
                        <p className="text-xs text-slate-500 leading-relaxed italic font-medium">
                            {currentPhenotype.description}
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm p-8 min-h-[250px] relative">
                    <div className="absolute top-4 left-4">
                         <Badge className="bg-cyan-100 text-cyan-700 font-bold border-none uppercase tracking-tighter text-[10px]">{customGender}</Badge>
                    </div>
                    <FoxIllustration
                        phenotype={currentPhenotype.name}
                        baseColor={currentPhenotype.baseColor}
                        pattern={currentPhenotype.pattern}
                        eyeColor={currentPhenotype.eyeColor}
                        size={24}
                    />
                </div>
            </div>

            {/* Genetics Grid */}
            <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Microscope size={20} className="text-cyan-600" /> Genetic Blueprint
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(LOCI).map(([key, locus]) => (
                        <div key={key} className="space-y-3 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex justify-between">
                                {locus.name} <span>Locus</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {locus.alleles.map(a1 => (
                                    locus.alleles.map(a2 => (
                                        <button
                                            key={`${a1}${a2}`}
                                            onClick={() => setCustomGenotype(prev => ({ ...prev, [key]: [a1, a2] }))}
                                            className={cn(
                                                "relative h-12 text-sm border-2 rounded-xl transition-all font-black overflow-hidden flex items-center justify-center",
                                                (currentGenotype[key]?.slice().sort().join('') === [a1, a2].slice().sort().join(''))
                                                    ? "bg-cyan-600 border-cyan-600 text-white shadow-md scale-105"
                                                    : "bg-white border-slate-200 hover:border-cyan-300 text-slate-400"
                                            )}
                                        >
                                            <span className="relative z-10">{`${a1}${a2}`}</span>
                                            {locus.lethal?.includes([a1, a2].slice().sort().join("")) && (
                                                <div className="absolute top-0 right-0 p-1">
                                                     <div className="w-2 h-2 bg-red-500 rounded-full" />
                                                </div>
                                            )}
                                        </button>
                                    )).slice(0, locus.alleles.indexOf(a1) + 1)
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-8 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-slate-500 text-sm max-w-md font-medium">
                    Designing a custom fox costs 50 Gems. All custom foxes start at age 2 with a blank pedigree and randomized competitive stats.
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {showSuccess && (
                        <span className="text-green-600 font-bold flex items-center gap-2 animate-bounce">
                            <Check size={24} /> Created!
                        </span>
                    )}
                    <Button 
                        onClick={handleCustomBuy} 
                        disabled={gems < 50 || currentFoxCount >= kennelCapacity}
                        className="bg-cyan-600 hover:bg-cyan-500 px-12 h-16 text-xl font-black flex-1 md:flex-none shadow-xl shadow-cyan-200 border-none rounded-2xl active:scale-95 transition-transform"
                    >
                        <Diamond size={24} className="mr-2" /> Purchase for 50
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
