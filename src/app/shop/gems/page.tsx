'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Diamond, Zap, Sparkles, ShoppingCart, ShieldCheck, Gift } from 'lucide-react';
import { useGameStore } from '@/lib/store';

const GEM_PACKS = [
    {
        id: 'pack-1',
        name: 'Pouch of Gems',
        amount: 100,
        price: '$4.99',
        bonus: null,
        icon: <Diamond className="text-cyan-400" size={32} />,
        color: 'bg-cyan-500/10'
    },
    {
        id: 'pack-2',
        name: 'Bag of Gems',
        amount: 250,
        price: '$9.99',
        bonus: '+10% Bonus Included',
        icon: <Zap className="text-yellow-400" size={32} />,
        color: 'bg-yellow-500/10'
    },
    {
        id: 'pack-3',
        name: 'Chest of Gems',
        amount: 600,
        price: '$19.99',
        bonus: 'BEST VALUE: +20% Bonus',
        icon: <Sparkles className="text-primary" size={32} />,
        color: 'bg-primary/10',
        featured: true
    },
    {
        id: 'pack-4',
        name: 'King\'s Treasure',
        amount: 1500,
        price: '$39.99',
        bonus: '+30% Massive Bonus',
        icon: <Gift className="text-secondary" size={32} />,
        color: 'bg-secondary/10'
    }
];

export default function GemStorePage() {
    const { gems } = useGameStore();

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-folksy text-foreground tracking-tight flex items-center justify-center gap-4" style={{ fontWeight: 400 }}>
                    <Diamond className="text-primary animate-pulse" size={48} /> Emerald Shop
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                    Purchase premium gems to unlock custom designers, speed up time, and acquire legendary specialty items.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {GEM_PACKS.map((pack) => (
                    <Card key={pack.id} className={`folk-card border-border shadow-sm flex flex-col items-center p-6 bg-card relative ${pack.featured ? 'ring-2 ring-primary transition-transform hover:scale-105' : ''}`}>
                        {pack.featured && (
                            <Badge className="absolute -top-3 bg-primary text-primary-foreground px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">Most Popular</Badge>
                        )}

                        <div className={`p-6 ${pack.color} rounded-full mb-6 mt-4`}>
                            {pack.icon}
                        </div>

                        <h3 className="text-xl font-black italic text-foreground text-center">{pack.name}</h3>

                        <div className="flex items-center gap-2 mt-4 text-3xl font-black text-foreground">
                            <Diamond size={24} className="text-primary" />
                            {pack.amount.toLocaleString()}
                        </div>

                        {pack.bonus && (
                            <p className="text-[10px] font-black uppercase tracking-wider text-secondary mt-2 text-center bg-secondary/10 px-3 py-1 rounded-full">
                                {pack.bonus}
                            </p>
                        )}

                        <div className="flex-1" />

                        <div className="w-full mt-8 space-y-3">
                            <div className="text-center">
                                <span className="text-2xl font-black text-foreground">{pack.price}</span>
                                <span className="text-muted-foreground text-xs ml-1 font-bold">USD</span>
                            </div>
                            <Button className="w-full h-12 font-black bg-primary hover:bg-primary/90 text-primary-foreground group">
                                <ShoppingCart size={18} className="mr-2 group-hover:animate-bounce" /> Purchase Pack
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <section className="bg-secondary text-white rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl">
                <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md">
                    <ShieldCheck size={64} />
                </div>
                <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-folksy" style={{ fontWeight: 400 }}>Safe & Secure Payments</h2>
                    <p className="opacity-80 font-medium">All transactions are encrypted and processed through our secure partner gateways. Your data and privacy are always protected.</p>
                </div>
                <div className="flex gap-4">
                    <div className="h-10 w-16 bg-white/20 rounded-lg flex items-center justify-center font-black text-[10px] tracking-tighter">VISA</div>
                    <div className="h-10 w-16 bg-white/20 rounded-lg flex items-center justify-center font-black text-[10px] tracking-tighter">MC</div>
                    <div className="h-10 w-16 bg-white/20 rounded-lg flex items-center justify-center font-black text-[10px] tracking-tighter">PAYPAL</div>
                </div>
            </section>
        </div>
    );
}
