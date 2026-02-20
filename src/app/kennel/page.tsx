'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Trophy, Info, LayoutDashboard, PawPrint, Utensils } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';

export default function KennelPage() {
    const { foxes, kennelCapacity, hiredNutritionist, feedAllFoxes } = useGameStore();
    const foxList = Object.values(foxes);

    return (
        <div className="space-y-16 pb-20">
            {/* Header section moved to the top of the container */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Kennel Management</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Manage your foxes, view stats, and track show progress.</p>
                </div>
            </div>

            {/* Your Foxes Section */}
            <div className="space-y-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-card p-8 rounded-[40px] border-2 border-border shadow-sm gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary/10 rounded-2xl">
                            <PawPrint className="text-primary" size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic text-foreground tracking-tight">Your Foxes</h2>
                            <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mt-1">Directly managing {foxList.length} foxes</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {hiredNutritionist && (
                            <Button onClick={feedAllFoxes} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-8 h-14 rounded-2xl shadow-lg shadow-primary/20 gap-3 flex-1 sm:flex-none">
                                <Utensils size={18} /> Feed All Foxes
                            </Button>
                        )}
                        <Badge variant="outline" className="px-6 py-3 bg-muted/30 border-2 border-border text-foreground font-black text-[10px] uppercase tracking-widest rounded-2xl flex-1 sm:flex-none justify-center h-14">
                            {foxList.length} / {kennelCapacity} Slots Filled
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {foxList.map((fox) => (
                        <Link key={fox.id} href={`/fox/${fox.id}`}>
                            <div className="folk-card overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group rounded-[48px] border-2 border-border/50 bg-card flex flex-col h-full">
                                <div className="h-64 flex items-center justify-center relative bg-muted/30 transition-colors group-hover:bg-primary/5 shrink-0">
                                    <FoxIllustration phenotype={fox.phenotype} baseColor={fox.baseColor} pattern={fox.pattern} eyeColor={fox.eyeColor} size={22} />
                                    <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                                        {fox.isRetired && <Badge className="bg-muted text-muted-foreground border-2 border-border font-black text-[10px] uppercase px-3 py-1 rounded-lg">Retired</Badge>}
                                        {fox.healthIssues.length > 0 && <Badge variant="destructive" className="font-black text-[10px] uppercase shadow-lg shadow-destructive/20 px-3 py-1 rounded-lg">Health Issue</Badge>}
                                    </div>
                                    <div className="absolute bottom-6 left-6">
                                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-foreground border-2 border-border font-black text-[10px] px-4 py-1.5 rounded-xl uppercase tracking-widest">Age {fox.age}</Badge>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-black italic text-foreground group-hover:text-primary transition-colors tracking-tight">{fox.name}</h3>
                                    </div>
                                    <div className="text-sm text-muted-foreground mb-8 font-medium line-clamp-2 leading-relaxed">{fox.phenotype}</div>
                                    <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground/40 pt-6 border-t border-border mt-auto">
                                        <span className="flex items-center gap-2 group-hover:text-primary transition-colors uppercase tracking-widest">
                                            <Trophy size={16} className="text-primary" /> {fox.pointsLifetime.toLocaleString()} Points
                                        </span>
                                        <span className="uppercase tracking-[0.2em] bg-muted/50 px-3 py-1 rounded-lg border border-border/50">
                                            {fox.gender}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {foxList.length === 0 && (
                        <div className="col-span-full py-40 text-center bg-card rounded-[64px] border-2 border-dashed border-border transition-all hover:bg-muted/5 group">
                            <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                                <Info className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                            <p className="text-foreground font-black text-3xl italic tracking-tight">The kennel feels cold...</p>
                            <p className="text-muted-foreground font-medium mt-2 mb-10">No foxes in your kennel yet.</p>
                            <Link href="/shop/adoption">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-10 h-16 rounded-2xl shadow-2xl shadow-primary/20 text-sm">Adopt Your First Fox</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
    return inputs.filter(Boolean).join(' ');
}
