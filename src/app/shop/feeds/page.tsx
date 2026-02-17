'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Coins, Sparkles, Zap, Shield, Wind, Sun, Moon, ShoppingCart } from 'lucide-react';

export default function FeedsPage() {
  const { buyItem, gold, inventory } = useGameStore();
  
  const specialtyFeeds = [
    { id: 'feed-head', name: 'Cranial Crunch', stat: 'Head', icon: <Zap className="w-8 h-8" />, color: 'blue' },
    { id: 'feed-topline', name: 'Spine Support', stat: 'Topline', icon: <Shield className="w-8 h-8" />, color: 'indigo' },
    { id: 'feed-forequarters', name: 'Shoulder Strength', stat: 'Forequarters', icon: <Zap className="w-8 h-8" />, color: 'cyan' },
    { id: 'feed-hindquarters', name: 'Hip Health', stat: 'Hindquarters', icon: <Zap className="w-8 h-8" />, color: 'teal' },
    { id: 'feed-tail', name: 'Brush Boost', stat: 'Tail', icon: <Wind className="w-8 h-8" />, color: 'emerald' },
    { id: 'feed-coatQuality', name: 'Lustrous Layers', stat: 'Coat Quality', icon: <Sparkles className="w-8 h-8" />, color: 'amber' },
    { id: 'feed-temperament', name: 'Calm Kibble', stat: 'Temperament', icon: <Moon className="w-8 h-8" />, color: 'purple' },
    { id: 'feed-presence', name: 'Showstopper Snack', stat: 'Presence', icon: <Sun className="w-8 h-8" />, color: 'orange' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Feeds</h1>
        <p className="text-slate-500 mt-2">Nutritious meals to keep your foxes healthy and improve their show performance.</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Basic Supplies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col border-orange-200">
            <CardHeader className="flex flex-col items-center gap-4 text-center">
              <div className="p-6 bg-orange-50 rounded-full text-orange-500">
                <ShoppingBag size={48} />
              </div>
              <div>
                <CardTitle className="text-2xl">Premium Feed</CardTitle>
                <p className="text-sm text-slate-500 mt-2">
                  High-protein kibble enriched with omega-3 fatty acids. Essential for general maintenance.
                </p>
              </div>
            </CardHeader>
            <CardContent className="mt-auto pt-6 border-t border-slate-50">
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase block">In Stock</span>
                    <span className="text-2xl font-black text-slate-900">{inventory['supplies'] || 0} Bags</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase block">Price</span>
                    <span className="text-2xl font-black text-yellow-600 flex items-center gap-1 justify-end">
                      <Coins size={20} /> 50
                    </span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => buyItem('supplies', 50, 'gold')}
                    disabled={gold < 50}
                    className="h-12 bg-orange-600 hover:bg-orange-500"
                  >
                    1 Bag
                  </Button>
                  <Button 
                    onClick={() => buyItem('supplies', 450, 'gold', 10)}
                    disabled={gold < 450}
                    variant="outline"
                    className="h-12 border-orange-200 text-orange-700 hover:bg-orange-50"
                  >
                    10 Bags (450)
                  </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Stat-Boosting Specialty Feeds</h2>
        <p className="text-slate-500">Each specialty feed provides a permanent +2 bonus to a specific show stat (up to 100).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialtyFeeds.map((feed) => (
            <Card key={feed.id} className={`border-${feed.color}-100 hover:shadow-md transition-shadow`}>
              <CardHeader className="flex flex-col items-center gap-3 text-center pb-2">
                <div className={`p-4 bg-${feed.color}-50 rounded-full text-${feed.color}-500`}>
                  {feed.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{feed.name}</CardTitle>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Affects: {feed.stat}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase">Held: {inventory[feed.id] || 0}</span>
                    <span className="text-xs font-bold text-yellow-600 flex items-center gap-0.5"><Coins size={12}/> 150 / Bag</span>
                 </div>
                 <div className="space-y-2">
                   <Button 
                    onClick={() => buyItem(feed.id, 150, 'gold')}
                    disabled={gold < 150}
                    size="sm"
                    variant="outline"
                    className={`w-full border-${feed.color}-200 text-${feed.color}-700 hover:bg-${feed.color}-50`}
                   >
                     Buy 1
                   </Button>
                   <Button 
                    onClick={() => buyItem(feed.id, 1000, 'gold', 10)}
                    disabled={gold < 1000}
                    size="sm"
                    className={`w-full bg-${feed.color}-600 hover:bg-${feed.color}-500 flex items-center justify-center gap-2`}
                   >
                     <ShoppingCart size={14} /> Buy 10 (1000g)
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
