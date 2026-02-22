'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Trophy, Info, PawPrint } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import { Button } from '@/components/ui/button';

export default function RetiredKennelPage() {
    const { foxes } = useGameStore();
    const foxList = Object.values(foxes);
    
    // Filter for retired foxes only
    const retiredFoxes = foxList.filter(fox => fox.isRetired);

    return (
        <div className="space-y-16 pb-20">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Retired Kennel</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Caring for your retired foxes who have served their time.</p>
                </div>
            </div>

            {/* Retired Kennel Section */}
            <div className="space-y-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card p-8 rounded-[40px] border-2 border-border shadow-sm gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gray-100 rounded-2xl">
                            <PawPrint className="text-gray-600" size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic text-foreground tracking-tight">Retired Foxes</h2>
                            <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mt-1">Caring for {retiredFoxes.length} retired foxes</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem'}}>
                    {retiredFoxes.map((fox) => (
                        <Link key={fox.id} href={`/fox/${fox.id}`}>
                            <div className="folk-card overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group rounded-[48px] border-2 border-border/50 bg-card flex flex-col" style={{width: '380px', height: '480px', minWidth: '380px', maxWidth: '380px'}}>
                                <div className="h-96 flex items-start justify-center relative bg-gray-50 transition-colors group-hover:bg-gray-100/5 shrink-0" style={{padding: '32px 32px 32px 32px'}}>
                                    <FoxIllustration phenotype={fox.phenotype} baseColor={fox.baseColor} pattern={fox.pattern} eyeColor={fox.eyeColor} size={22} />
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                        {fox.healthIssues.length > 0 && <Badge variant="destructive" className="font-black text-[10px] uppercase shadow-lg shadow-destructive/20 px-2 py-1 rounded-lg">Health Issue</Badge>}
                                        <Badge className="bg-gray-200 px-3 py-1 rounded-lg border border-gray-300 text-gray-700 font-black text-[10px] uppercase tracking-widest">Retired</Badge>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-xl font-black italic text-foreground group-hover:text-primary transition-colors tracking-tight">{fox.name}</h3>
                                        <span className="uppercase tracking-[0.2em] bg-gray-200 px-3 py-1 rounded-lg border border-gray-300 text-gray-700 font-black text-[10px]">{fox.gender}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-4 font-medium line-clamp-2 leading-relaxed">{fox.age} year old {fox.phenotype.toLowerCase()}</div>
                                    <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground/40 pt-6 border-t border-border mt-auto">
                                        <span className="flex items-center gap-2 group-hover:text-primary transition-colors uppercase tracking-widest">
                                            <Trophy size={16} className="text-primary" /> {fox.pointsLifetime.toLocaleString()} Points
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {retiredFoxes.length === 0 && (
                <div className="col-span-full py-40 text-center bg-card rounded-[64px] border-2 border-dashed border-border transition-all hover:bg-muted/5 group">
                    <div className="w-24 h-24 bg-gray-100/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <PawPrint className="w-12 h-12 text-gray-600/30" />
                    </div>
                    <p className="text-foreground font-black text-3xl italic tracking-tight">No retired foxes yet...</p>
                    <p className="text-muted-foreground font-medium mt-2 mb-10">Your retired foxes will appear here when they retire from service.</p>
                    <Link href="/kennel">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-10 h-16 rounded-2xl shadow-2xl shadow-primary/20 text-sm">View Adult Kennel</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
