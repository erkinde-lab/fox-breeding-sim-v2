'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Microscope, Pill, Calculator, Heart } from 'lucide-react';

const ITEM_LIST = [
  {
    id: 'genetic-test',
    name: 'Genetic Test',
    description: 'Reveals the full genotype of a fox.',
    price: 500,
    currency: 'gold' as const,
    icon: <Microscope className="w-8 h-8 text-blue-500" />
  },
  {
    id: 'medicine',
    name: 'Medicine',
    description: 'Helps manage health issues and complications.',
    price: 200,
    currency: 'gold' as const,
    icon: <Pill className="w-8 h-8 text-red-500" />
  },
  {
    id: 'calculator-access',
    name: 'Breeding Calculator',
    description: 'Unlock the ability to predict breeding outcomes.',
    price: 1000,
    currency: 'gold' as const,
    icon: <Calculator className="w-8 h-8 text-purple-500" />
  },
  {
    id: 'pedigree-analysis',
    name: 'Pedigree Analysis',
    description: 'Calculate and reveal the Inbreeding Coefficient (COI) of a fox.',
    price: 750,
    currency: 'gold' as const,
    icon: <Heart className="w-8 h-8 text-pink-500" />
  }
];

export default function ItemsPage() {
  const { buyItem, gold, inventory } = useGameStore();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Specialty Items</h1>
        <p className="text-slate-500 mt-2">Essential tools to manage and analyze your breeding stock.</p>
      </div>

      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEM_LIST.map((item) => (
            <Card key={item.id} className="flex flex-col border-slate-200 hover:border-blue-300 transition-colors">
              <CardHeader className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                </div>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">Owned: {inventory[item.id] || 0}</span>
                    <span className="font-bold text-slate-900">{item.price.toLocaleString()} {item.currency.toUpperCase()}</span>
                 </div>
                 <Button 
                  onClick={() => buyItem(item.id, item.price, item.currency)}
                  disabled={gold < item.price}
                  className="w-full h-12 font-bold"
                 >
                   Purchase
                 </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
