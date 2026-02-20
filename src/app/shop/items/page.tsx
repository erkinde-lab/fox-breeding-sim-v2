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
        <h1 className="text-4xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Specialty Items</h1>
        <p className="text-muted-foreground mt-2">Essential tools to manage and analyze your breeding stock.</p>
      </div>

      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEM_LIST.map((item) => (
            <Card key={item.id} className="flex flex-col border-border bg-card hover:border-primary transition-colors overflow-hidden">
              <CardHeader className="flex flex-col items-center gap-4 text-center bg-muted/30 p-8">
                <div className="p-4 bg-card rounded-full shadow-sm border border-border">
                  {item.icon}
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground font-black">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">{item.description}</p>
                </div>
              </CardHeader>
              <CardContent className="mt-auto pt-6 p-6 border-t border-border bg-card">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Owned: {inventory[item.id] || 0}</span>
                  <span className="font-black text-foreground">{item.price.toLocaleString()} {item.currency.toUpperCase()}</span>
                </div>
                <Button
                  onClick={() => buyItem(item.id, item.price, item.currency)}
                  disabled={gold < item.price}
                  className="w-full h-12 font-black bg-primary hover:bg-primary/90 text-primary-foreground"
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
