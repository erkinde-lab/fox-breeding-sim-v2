'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Trophy, Info, LayoutDashboard, PawPrint, Utensils, Home } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';

export default function KennelPage() {
    const { foxes, kennelCapacity, hiredNutritionist, feedAllFoxes, expandKennel, gold } = useGameStore();
    const foxList = Object.values(foxes);
    
    // Filter for adult foxes only (age >= 1 and not retired)
    const adultFoxes = foxList.filter(fox => fox.age >= 1 && !fox.isRetired);

    return (
        <div className="space-y-16 pb-20">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Kennel Management</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Manage your foxes, view stats, and track show progress.</p>
                </div>
            </div>

            {/* Combined Kennel Navigation & Management */}
            <div className="space-y-10">
                {/* Centered Management Card */}
                <div className="flex justify-center">
                    <div className="flex flex-col gap-6 bg-card p-8 rounded-[40px] border-2 border-border shadow-sm w-full max-w-6xl">
                        {/* Navigation Section - Top of Card */}
                        <div className="flex justify-between items-center">
                            <Link href="/kennel/young">
                                <Button variant="outline" className="bg-primary/10 hover:bg-primary/20 text-primary font-black uppercase tracking-widest px-6 h-12 rounded-xl border-primary/30">
                                    <PawPrint size={16} /> Young Kennel
                                </Button>
                            </Link>
                            <Link href="/kennel">
                                <Button variant="outline" className="bg-primary/10 hover:bg-primary/20 text-primary font-black uppercase tracking-widest px-6 h-12 rounded-xl border-primary/30">
                                    <PawPrint size={16} /> Adult Kennel
                                </Button>
                            </Link>
                            <Link href="/kennel/retired">
                                <Button variant="outline" className="bg-muted hover:bg-muted/80 text-muted-foreground font-black uppercase tracking-widest px-6 h-12 rounded-xl border-border">
                                    <PawPrint size={16} /> Retired Kennel
                                </Button>
                            </Link>
                        </div>

                        {/* Kennel Info & Feed All Foxes - Inline */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-primary/10 rounded-2xl">
                                    <PawPrint className="text-primary" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic text-foreground tracking-tight">Adult Kennel</h2>
                                    <div className="flex items-center gap-1">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mt-1">Managing {adultFoxes.length}/{kennelCapacity} foxes</p>
                                        <Badge 
                                            variant="outline" 
                                            className="px-2 py-0.5 bg-primary/10 border-2 border-primary/30 text-primary font-black text-[10px] uppercase tracking-widest rounded-md justify-center h-6 leading-none cursor-pointer hover:bg-primary/20 transition-colors"
                                            onClick={() => expandKennel()}
                                        >
                                            +5 Slots
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {hiredNutritionist && (
                                <Button onClick={feedAllFoxes} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-8 h-14 rounded-2xl shadow-lg shadow-primary/20 gap-3">
                                    <Utensils size={18} /> Feed All Foxes
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Adult Kennel Fox Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem'}}>
                    {adultFoxes.map((fox) => (
                        <Link key={fox.id} href={`/fox/${fox.id}`}>
                            <div className="folk-card overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group rounded-[48px] border-2 border-border/50 bg-card flex flex-col" style={{width: '380px', height: '480px', minWidth: '380px', maxWidth: '380px'}}>
                                <div className="h-96 flex items-start justify-center relative bg-muted/30 transition-colors group-hover:bg-primary/5 shrink-0" style={{padding: '32px 32px 32px 32px'}}>
                                    <FoxIllustration phenotype={fox.phenotype} baseColor={fox.baseColor} pattern={fox.pattern} eyeColor={fox.eyeColor} size={22} />
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                        {fox.isRetired && <Badge className="bg-muted text-muted-foreground border-2 border-border font-black text-[10px] uppercase px-2 py-1 rounded-lg">Retired</Badge>}
                                        {fox.healthIssues.length > 0 && <Badge variant="destructive" className="font-black text-[10px] uppercase shadow-lg shadow-destructive/20 px-2 py-1 rounded-lg">Health Issue</Badge>}
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-xl font-black italic text-foreground group-hover:text-primary transition-colors tracking-tight">{fox.name}</h3>
                                        <span className="uppercase tracking-[0.2em] bg-muted/50 px-3 py-1 rounded-lg border border-border/50 text-foreground font-black text-[10px]">{fox.gender}</span>
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
            {adultFoxes.length === 0 && (
                <div className="col-span-full py-40 text-center bg-card rounded-[64px] border-2 border-dashed border-border transition-all hover:bg-muted/5 group">
                    <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <Info className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    <p className="text-foreground font-black text-3xl italic tracking-tight">The kennel feels cold...</p>
                    <p className="text-muted-foreground font-medium mt-2 mb-10">No adult foxes in your kennel yet.</p>
                    <Link href="/shop/adoption">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-10 h-16 rounded-2xl shadow-2xl shadow-primary/20 text-sm">Adopt Your First Fox</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
    return inputs.filter(Boolean).join(' ');
}
