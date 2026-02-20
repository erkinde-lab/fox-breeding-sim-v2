'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Coins, ShoppingCart, Zap, Shield, Sparkles, Moon, Sun, Wind, Heart } from 'lucide-react';

export default function FeedsPage() {
  const { gold, inventory, buyItem } = useGameStore();

  const specialtyFeeds = [
    { id: 'feed-head', name: 'Cranial Crunch', stat: 'Head', icon: <Zap className="w-8 h-8" />, color: 'blue' },
    { id: 'feed-topline', name: 'Spine Support', stat: 'Topline', icon: <Shield className="w-8 h-8" />, color: 'indigo' },
    { id: 'feed-forequarters', name: 'Stout Shoulder', stat: 'Forequarters', icon: <Zap className="w-8 h-8" />, color: 'cyan' },
    { id: 'feed-hindquarters', name: 'Hip Health', stat: 'Hindquarters', icon: <Zap className="w-8 h-8" />, color: 'teal' },
    { id: 'feed-tail', name: 'Brush Boost', stat: 'Tail', icon: <Wind className="w-8 h-8" />, color: 'emerald' },
    { id: 'feed-coatQuality', name: 'Silk Coat', stat: 'Coat Quality', icon: <Sparkles className="w-8 h-8" />, color: 'amber' },
    { id: 'feed-temperament', name: 'Calm Kibble', stat: 'Temperament', icon: <Moon className="w-8 h-8" />, color: 'purple' },
    { id: 'feed-presence', name: 'Star Power', stat: 'Presence', icon: <Sun className="w-8 h-8" />, color: 'orange' },
    { id: 'feed-luck', name: 'Fortune Flakes', stat: 'Luck', icon: <Sparkles className="w-8 h-8" />, color: 'yellow' },
    { id: 'feed-fertility', name: "Breeder's Blend", stat: 'Fertility', icon: <Heart className="w-8 h-8" />, color: 'rose' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Feed Store</h1>
        <p className="text-muted-foreground mt-2 font-medium">Nutritious meals with unlimited shop stock for your kennel.</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-folksy text-foreground" style={{ fontWeight: 400 }}>Basic Supplies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="flex flex-col items-center gap-4 text-center bg-muted/30 p-8">
              <div className="p-6 bg-card rounded-full text-foreground/50 shadow-sm border border-border">
                <ShoppingBag size={48} />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-foreground">Standard Feed</CardTitle>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  Budget-friendly kibble. One bag provides 4 individual feedings.
                </p>
              </div>
            </CardHeader>
            <CardContent className="mt-auto pt-6 p-8 border-t border-border bg-card">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-xs font-black text-muted-foreground uppercase block tracking-widest">Your Inventory</span>
                  <span className="text-2xl font-black text-foreground">{inventory['standard-feed'] || 0} Bags</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-muted-foreground uppercase block tracking-widest">Price</span>
                  <span className="text-2xl font-black text-yellow-600 flex items-center gap-1 justify-end">
                    <Coins size={20} /> 25
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => buyItem('standard-feed', 25, 'gold', 1)}
                  disabled={gold < 25}
                  className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md"
                >
                  Buy 1
                </Button>
                <Button
                  onClick={() => buyItem('standard-feed', 225, 'gold', 10)}
                  disabled={gold < 225}
                  variant="outline"
                  className="h-14 border-border text-foreground hover:bg-muted font-bold"
                >
                  Buy 10 (225)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="flex flex-col items-center gap-4 text-center bg-muted/30 p-8">
              <div className="p-6 bg-card rounded-full text-foreground/50 shadow-sm border border-border">
                <Zap size={48} />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-foreground">Premium Feed</CardTitle>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  High-protein kibble. One bag provides 8 individual feedings.
                </p>
              </div>
            </CardHeader>
            <CardContent className="mt-auto pt-6 p-8 border-t border-border bg-card">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-xs font-black text-muted-foreground uppercase block tracking-widest">Your Inventory</span>
                  <span className="text-2xl font-black text-foreground">{inventory['supplies'] || 0} Bags</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-muted-foreground uppercase block tracking-widest">Price</span>
                  <span className="text-2xl font-black text-yellow-600 flex items-center gap-1 justify-end">
                    <Coins size={20} /> 50
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => buyItem('supplies', 50, 'gold', 1)}
                  disabled={gold < 50}
                  className="h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md"
                >
                  Buy 1
                </Button>
                <Button
                  onClick={() => buyItem('supplies', 450, 'gold', 10)}
                  disabled={gold < 450}
                  variant="outline"
                  className="h-14 border-border text-foreground hover:bg-muted font-bold"
                >
                  Buy 10 (450)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-folksy text-foreground" style={{ fontWeight: 400 }}>Stat-Boosting Specialty Feeds</h2>
          <p className="text-muted-foreground mt-1 font-medium">Each specialty feed provides 5 servings and a permanent +2 bonus to a specific show stat.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {specialtyFeeds.map((feed) => (
            <Card key={feed.id} className={`border-border bg-card hover:shadow-md transition-all group`}>
              <CardHeader className="flex flex-col items-center gap-3 text-center pb-2 pt-6">
                <div className={`p-4 bg-muted rounded-2xl group-hover:scale-110 transition-transform border border-border`}>
                  {feed.icon}
                </div>
                <div>
                  <CardTitle className="text-lg font-bold min-h-[56px] flex items-center justify-center leading-tight text-foreground">{feed.name}</CardTitle>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Affects: {feed.stat}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6 pt-2">
                <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase border-b border-border pb-2">
                  <span className="truncate">Held: {inventory[feed.id] || 0}</span>
                  <span className="text-yellow-600 flex items-center gap-0.5 shrink-0"><Coins size={12} /> 150</span>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => buyItem(feed.id, 150, 'gold', 1)}
                    disabled={gold < 150}
                    size="sm"
                    variant="outline"
                    className={`w-full border-border text-foreground hover:bg-muted font-bold`}
                  >
                    Buy 1
                  </Button>
                  <Button
                    onClick={() => buyItem(feed.id, 1200, 'gold', 10)}
                    disabled={gold < 1200}
                    size="sm"
                    className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 font-bold shadow-sm`}
                  >
                    <ShoppingCart size={14} /> Buy 10 (1200)
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
