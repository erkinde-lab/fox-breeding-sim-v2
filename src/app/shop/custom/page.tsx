'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Diamond, Check, Microscope, Eye } from 'lucide-react';
import { LOCI, Genotype, getPhenotype, getValidEyeColors, getBaseEyeColors, getWhiteMarkingOptions, getEyeColorHex } from '@/lib/genetics';
import { FoxIllustration } from '@/components/FoxIllustration';

export default function CustomFoxPage() {
    const { buyCustomFoundationalFox, gems, foxes, kennelCapacity } = useGameStore();
    const [customGenotype, setCustomGenotype] = useState<Record<string, string[]>>({});
    const [customGender, setCustomGender] = useState<'Male' | 'Female'>('Male');
    const [foxName, setFoxName] = useState('Custom Designer Fox');
    const [eyeColor, setEyeColor] = useState<'Random' | string>('Brown');
    const [baseEyeColor, setBaseEyeColor] = useState<'Random' | string>('Brown');
    const [whiteMarkingEffect, setWhiteMarkingEffect] = useState<'None' | 'Blue' | 'Blue Heterochromia'>('None');
    const [silverIntensity, setSilverIntensity] = useState(3);
    const [showSuccess, setShowSuccess] = useState(false);

    // Function to format alleles correctly (uppercase then lowercase for heterozygous)
    const formatAlleles = (a1: string, a2: string) => {
        if (a1 === a2) {
            return a1 + a1; // Homozygous: AA
        }
        // Heterozygous: sort alphabetically but ensure first is uppercase, second is lowercase
        const sorted = [a1, a2].sort();
        return sorted[0].toUpperCase() + sorted[1].toLowerCase();
    };

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

    const currentPhenotype = useMemo(() => {
        // Determine final eye color based on base color and white marking effect
        let finalEyeColor: string | undefined;
        
        if (baseEyeColor === 'Random') {
            finalEyeColor = undefined;
        } else if (whiteMarkingEffect === 'None') {
            finalEyeColor = baseEyeColor;
        } else {
            finalEyeColor = whiteMarkingEffect;
        }
        
        return getPhenotype(currentGenotype, silverIntensity, finalEyeColor);
    }, [currentGenotype, silverIntensity, baseEyeColor, whiteMarkingEffect]);

    const baseEyeColors = useMemo(() => getBaseEyeColors(currentGenotype), [currentGenotype]);
    const whiteMarkingOptions = useMemo(() => getWhiteMarkingOptions(currentGenotype), [currentGenotype]);

    const handleCustomBuy = () => {
        // Determine final eye color for the fox
        let finalEyeColor: string | undefined;
        
        if (baseEyeColor === 'Random') {
            finalEyeColor = undefined;
        } else if (whiteMarkingEffect === 'None') {
            finalEyeColor = baseEyeColor;
        } else {
            finalEyeColor = whiteMarkingEffect;
        }
        
        buyCustomFoundationalFox(currentGenotype, customGender, foxName, finalEyeColor);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Custom Designer Foxes</h1>
                <p className="text-muted-foreground mt-2 font-medium">Use your gems to design a fox with a precise genetic profile.</p>
            </div>

            <Card className="border-primary/20 shadow-xl overflow-hidden border-2 rounded-[32px]">
                <CardHeader className="bg-primary text-primary-foreground flex flex-row items-center justify-between p-8">
                    <CardTitle className="flex items-center gap-2 text-2xl font-folksy italic uppercase tracking-tighter" style={{ fontWeight: 400 }}><Star className="fill-primary-foreground" /> Fox Designer</CardTitle>
                    <div className="flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-full text-sm font-black">
                        <Diamond size={18} /> {gems.toLocaleString()} GEMS
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-12">
                    {/* Top Config Section */}
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch bg-muted p-8 rounded-3xl border border-border shadow-inner">
                        <div className="w-full lg:w-1/2 space-y-6 flex flex-col justify-center">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Fox Identity</label>
                                <input
                                    type="text"
                                    value={foxName}
                                    onChange={(e) => setFoxName(e.target.value)}
                                    placeholder="Enter fox name..."
                                    className="w-full bg-card border-2 border-border p-4 rounded-2xl font-black text-lg focus:border-primary focus:outline-none transition-colors text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Selected Gender</label>
                                <div className="flex gap-2">
                                    {['Male', 'Female'].map(g => (
                                        <Button
                                            key={g}
                                            onClick={() => setCustomGender(g as 'Male' | 'Female')}
                                            variant={customGender === g ? 'default' : 'outline'}
                                            className={cn(
                                                "flex-1 h-12 font-black rounded-xl border-2 uppercase tracking-widest",
                                                customGender === g ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-card"
                                            )}
                                        >
                                            {g}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1 pt-4 border-t border-border">
                                <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Phenotype Preview</label>
                                <div className="text-xl font-black text-primary tracking-tight">{currentPhenotype.name}</div>
                                <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">
                                    {currentPhenotype.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center bg-card rounded-2xl border border-border shadow-sm p-8 min-h-[350px] relative">
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
                        <h3 className="text-xl font-folksy text-foreground flex items-center gap-2" style={{ fontWeight: 400 }}>
                            <Microscope size={20} className="text-primary" /> Genetic Blueprint
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Object.entries(LOCI).map(([key, locus]) => (
                                <div key={key} className="space-y-3 bg-muted/50 p-6 rounded-3xl border border-border">
                                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest flex justify-between">
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
                                                            ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                                                            : "bg-card border-border hover:border-primary/40 text-muted-foreground"
                                                    )}
                                                >
                                                    <span className="relative z-10">{formatAlleles(a1, a2)}</span>
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

                    {/* Eye Color Selection */}
                    <div className="space-y-6 bg-muted/30 p-8 rounded-3xl border border-border">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-folksy text-foreground flex items-center gap-2" style={{ fontWeight: 400 }}>
                                    <Eye size={20} className="text-primary" /> Eye Color Selection
                                </h3>

                                {/* Base Eye Color Section */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Base Eye Color</label>
                                    <div className="space-y-2">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setBaseEyeColor('Random')}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl font-bold border-2 transition-all",
                                                    baseEyeColor === 'Random'
                                                        ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                                                        : "bg-card border-border hover:border-primary/40 text-muted-foreground"
                                                )}
                                            >
                                                🎲 Random
                                            </button>
                                        </div>
                                    </div>

                                    {baseEyeColor !== 'Random' && baseEyeColors.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {baseEyeColors.map((color: string) => {
                                                const eyeColorHex = getEyeColorHex(color);
                                                const isHeterochromia = color.includes('Heterochromia');
                                                return (
                                                    <button
                                                        key={color}
                                                        onClick={() => setBaseEyeColor(color)}
                                                        className={cn(
                                                            "relative p-4 rounded-xl border-2 transition-all font-bold text-sm flex flex-col items-center gap-2 min-h-[80px]",
                                                            baseEyeColor === color
                                                                ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                                                                : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:scale-102"
                                                        )}
                                                    >
                                                        <div 
                                                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                            style={{ 
                                                                background: isHeterochromia ? eyeColorHex : eyeColorHex,
                                                                backgroundSize: isHeterochromia ? '200% 200%' : 'auto'
                                                            }}
                                                        />
                                                        <span className="text-center leading-tight text-xs">{color}</span>
                                                        {baseEyeColor === color && (
                                                            <div className="absolute top-1 right-1">
                                                                <Check size={16} className="text-primary" />
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* White Marking Effects Section */}
                                {whiteMarkingOptions.length > 0 && (
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">White Marking Effects</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            <button
                                                onClick={() => setWhiteMarkingEffect('None')}
                                                className={cn(
                                                    "relative p-4 rounded-xl border-2 transition-all font-bold text-sm flex flex-col items-center gap-2 min-h-[80px]",
                                                    whiteMarkingEffect === 'None'
                                                        ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                                                        : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:scale-102"
                                                )}
                                            >
                                                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm bg-gradient-to-r from-gray-400 to-gray-600" />
                                                <span className="text-center leading-tight text-xs">No Effect</span>
                                                {whiteMarkingEffect === 'None' && (
                                                    <div className="absolute top-1 right-1">
                                                        <Check size={16} className="text-primary" />
                                                    </div>
                                                )}
                                            </button>

                                            {whiteMarkingOptions.includes('Blue') && (
                                                <button
                                                    onClick={() => setWhiteMarkingEffect('Blue')}
                                                    className={cn(
                                                        "relative p-4 rounded-xl border-2 transition-all font-bold text-sm flex flex-col items-center gap-2 min-h-[80px]",
                                                        whiteMarkingEffect === 'Blue'
                                                            ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                                                            : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:scale-102"
                                                    )}
                                                >
                                                    <div 
                                                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                        style={{ background: '#4169E1' }}
                                                    />
                                                    <span className="text-center leading-tight text-xs">Blue</span>
                                                    {whiteMarkingEffect === 'Blue' && (
                                                        <div className="absolute top-1 right-1">
                                                            <Check size={16} className="text-primary" />
                                                        </div>
                                                    )}
                                                </button>
                                            )}

                                            {whiteMarkingOptions.includes('Blue Heterochromia') && (
                                                <button
                                                    onClick={() => setWhiteMarkingEffect('Blue Heterochromia')}
                                                    className={cn(
                                                        "relative p-4 rounded-xl border-2 transition-all font-bold text-sm flex flex-col items-center gap-2 min-h-[80px]",
                                                        whiteMarkingEffect === 'Blue Heterochromia'
                                                            ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                                                            : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:scale-102"
                                                    )}
                                                >
                                                    <div 
                                                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                        style={{ 
                                                            backgroundImage: getEyeColorHex('Blue Heterochromia', baseEyeColor === 'Random' ? 'Brown' : baseEyeColor),
                                                            backgroundSize: '200% 200%'
                                                        }}
                                                    />
                                                    <span className="text-center leading-tight text-xs">Blue Heterochromia</span>
                                                    {whiteMarkingEffect === 'Blue Heterochromia' && (
                                                        <div className="absolute top-1 right-1">
                                                            <Check size={16} className="text-primary" />
                                                        </div>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Silver Intensity Section */}
                    <div className="space-y-6 bg-muted/30 p-8 rounded-3xl border border-border">
                        <div className="space-y-4">
                            <h3 className="text-xl font-folksy text-foreground flex items-center gap-2" style={{ fontWeight: 400 }}>
                                <Microscope size={20} className="text-primary" /> Silver Intensity
                            </h3>
                            <div className="text-xs text-muted-foreground/60 italic font-medium mb-2">
                                Controls silver dilution: 1 = Black, 2 = Minimum Silver, 5 = Maximum Silver
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((intensity) => (
                                    <button
                                        key={intensity}
                                        onClick={() => setSilverIntensity(intensity)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl font-bold border-2 transition-all text-sm",
                                            silverIntensity === intensity
                                                ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                                                : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:scale-102"
                                        )}
                                    >
                                        {intensity}
                                    </button>
                                ))}
                            </div>
                            <div className="text-xs text-muted-foreground/50 italic mt-4 p-3 bg-muted/50 rounded-lg border-l-4 border-primary/30">
                                <strong>Note:</strong> Silver intensity is hidden on red base foxes but remains heritable. Select the desired intensity for breeding purposes even when not visible on red-based phenotypes.
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t-2 border-border flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-muted-foreground text-sm max-w-md font-medium space-y-2">
                            <div>
                                Designing a custom fox costs 50 Gems. All custom foxes start at age 2 with a blank pedigree and randomized competitive stats.
                            </div>
                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 font-bold text-primary">
                                    <Check size={16} />
                                    Guaranteed Quality
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    All stats are guaranteed to be at least 25 (fertility at least 50), making custom foxes excellent breeding stock.
                                </p>
                            </div>
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
                                className="bg-primary hover:bg-primary/90 px-12 h-16 text-xl font-black flex-1 md:flex-none shadow-xl shadow-primary/20 border-none rounded-2xl active:scale-95 transition-transform"
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
