'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Trophy, Info, LayoutDashboard, PawPrint, Utensils, Home, Sparkles, Dumbbell, Star, Heart, ArrowRight } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { isHungry, isGroomed, isTrained, Fox } from '@/lib/genetics';
import { motion, AnimatePresence } from 'framer-motion';

function KennelContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { foxes, kennelCapacity, expandKennel, gold } = useGameStore();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/kennel?tab=${tab}`, { scroll: false });
    };

    const foxList = Object.values(foxes);
    const adultFoxes = foxList.filter(fox => fox.age >= 1 && !fox.isRetired);
    const youngFoxes = foxList.filter(fox => fox.age < 1);
    const retiredFoxes = foxList.filter(fox => fox.isRetired);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'adult', label: 'Adult Kennel', icon: PawPrint, count: adultFoxes.length },
        { id: 'young', label: 'Young Kennel', icon: Heart, count: youngFoxes.length },
        { id: 'retired', label: 'Retired', icon: Home, count: retiredFoxes.length },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>My Kennel</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-muted-foreground text-sm font-medium">Managing {foxList.length} foxes</p>
                        <span className="text-muted-foreground/30">•</span>
                        <button
                            onClick={() => expandKennel()}
                            className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                            Expand Kennel ({kennelCapacity} slots) <ArrowRight size={10} />
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-muted/50 p-1 rounded-2xl border border-border/50 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                ? "bg-card text-foreground shadow-sm border border-border/50"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'adult' && <KennelGrid foxes={adultFoxes} type="adult" />}
                    {activeTab === 'young' && <KennelGrid foxes={youngFoxes} type="young" />}
                    {activeTab === 'retired' && <KennelGrid foxes={retiredFoxes} type="retired" />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function KennelGrid({ foxes, type }: { foxes: Fox[], type: string }) {
    if (foxes.length === 0) {
        return (
            <div className="py-24 text-center bg-card/50 rounded-[40px] border-2 border-dashed border-border transition-all">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Info className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-black italic text-foreground tracking-tight">No foxes here</h3>
                <p className="text-muted-foreground text-sm font-medium mt-1 mb-8">
                    {type === 'adult' ? "You don't have any adult foxes yet." :
                     type === 'young' ? "No kits in the nursery right now." :
                     "The retirement home is empty."}
                </p>
                {type !== 'retired' && (
                    <Link href={type === 'young' ? "/breeding" : "/shop/adoption"}>
                        <Button variant="outline" className="font-black uppercase tracking-widest text-xs h-10 rounded-xl">
                            {type === 'young' ? "Visit Breeding Center" : "Adopt a Fox"}
                        </Button>
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foxes.map((fox) => (
                <FoxCard key={fox.id} fox={fox} />
            ))}
        </div>
    );
}

function FoxCard({ fox }: { fox: Fox }) {
    const hungry = isHungry(fox);
    const groomed = isGroomed(fox);
    const trained = isTrained(fox);

    return (
        <Link href={`/fox/${fox.id}`}>
            <div className="folk-card group relative overflow-hidden bg-card border-2 border-border rounded-[32px] hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6 group-hover:bg-primary/5 transition-colors duration-500">
                    <FoxIllustration
                        phenotype={fox.phenotype}
                        baseColor={fox.baseColor}
                        pattern={fox.pattern}
                        eyeColor={fox.eyeColor}
                        size={16}
                    />

                    {/* Status Icons Overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2 py-1.5 rounded-xl border border-border/50 shadow-sm">
                            <Utensils size={12} className={hungry ? "text-muted-foreground/20" : "text-primary"} />
                            <Sparkles size={12} className={!groomed ? "text-muted-foreground/20" : "text-secondary"} />
                            <Dumbbell size={12} className={!trained ? "text-muted-foreground/20" : "text-orange-500"} />
                        </div>
                    </div>

                    {/* Gender Badge */}
                    <div className="absolute bottom-4 left-4">
                        <Badge variant="outline" className={`font-black text-[9px] uppercase tracking-widest bg-background/80 backdrop-blur-sm border-border/50 ${fox.gender === 'Dog' ? 'text-blue-500' : 'text-rose-500'}`}>
                            {fox.gender === 'Dog' ? 'Dog' : 'Vixen'}
                        </Badge>
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black italic text-lg text-foreground tracking-tight truncate group-hover:text-primary transition-colors">{fox.name}</h3>
                        <div className="flex items-center gap-1 text-primary font-black text-xs">
                            <Trophy size={12} />
                            <span>{fox.pointsLifetime}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{fox.age} {fox.age === 1 ? 'Year' : 'Years'} Old</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight truncate">{fox.phenotype}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function KennelPage() {
    return (
        <Suspense fallback={<div className="py-20 text-center font-black uppercase tracking-widest text-muted-foreground">Loading Kennel...</div>}>
            <KennelContent />
        </Suspense>
    );
}
