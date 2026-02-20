'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Book, Zap, Heart, Microscope } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-folksy text-foreground tracking-tight flex items-center gap-3" style={{ fontWeight: 400 }}>
          <HelpCircle className="text-primary" size={40} /> Help Center
        </h1>
        <p className="text-muted-foreground mt-4 text-lg font-medium">Learn the basics of breeding, showing, and managing your kennel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
        <section className="space-y-6">
          <h2 className="text-2xl font-folksy text-foreground flex items-center gap-2" style={{ fontWeight: 400 }}>
            <Book className="text-primary" size={24} /> Getting Started
          </h2>
          <Card className="folk-card border-border bg-card">
            <CardContent className="pt-8 space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-2xl h-fit border border-primary/20"><Zap size={20} /></div>
                <div>
                  <h4 className="font-black text-foreground text-lg italic">Your First Foxes</h4>
                  <p className="text-muted-foreground leading-relaxed mt-1">Start by visiting the Foundation Adoption shop to buy your first pair. Look for complementary stats and genotypes to begin your lineage.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-secondary/10 text-secondary p-3 rounded-2xl h-fit border border-secondary/20"><Heart size={20} /></div>
                <div>
                  <h4 className="font-black text-foreground text-lg italic">Breeding Basics</h4>
                  <p className="text-muted-foreground leading-relaxed mt-1">Breeding occurs in Winter. Select a Sire and Dam, then check the Breeding Insights for potential outcomes and COI (Inbreeding Coefficient).</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-folksy text-foreground flex items-center gap-2" style={{ fontWeight: 400 }}>
            <Microscope className="text-primary" size={24} /> Genetics & Stats
          </h2>
          <Card className="folk-card border-border bg-card">
            <CardContent className="pt-8 space-y-4">
              <p className="text-muted-foreground mb-4 font-medium italic">Your foxes are judged across 8 key physical and behavioral traits:</p>
              <div className="grid grid-cols-2 gap-3">
                {['Head', 'Topline', 'Hindquarters', 'Forequarters', 'Presence', 'Temperament', 'Coat Quality', 'Tail'].map(stat => (
                  <div key={stat} className="p-3 bg-muted/30 rounded-xl border border-border text-center">
                    <span className="font-black text-foreground text-xs uppercase tracking-widest">{stat}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-muted/50 rounded-2xl border border-border mt-4">
                <span className="font-black text-primary block text-xs uppercase tracking-widest mb-1">Mendelian Genetics</span>
                <p className="text-sm text-muted-foreground">Genotypes (e.g., Bb, WpW) determine the physical Phenotype. Uppercase is Dominant, Lowercase is Recessive.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-folksy text-foreground flex items-center gap-2" style={{ fontWeight: 400 }}>
            <Zap className="text-primary" size={24} /> Kennel Services
          </h2>
          <Card className="folk-card border-border bg-card">
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 text-primary border-none">Groomer</Badge>
                  <span className="text-muted-foreground text-sm font-medium">+5 Coat Quality bonus for all foxes.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 text-primary border-none">Veterinarian</Badge>
                  <span className="text-muted-foreground text-sm font-medium">+1 bonus to all physical traits for kits.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 text-primary border-none">Geneticist</Badge>
                  <span className="text-muted-foreground text-sm font-medium italic">Automatically reveals genotypes for all owned foxes.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-folksy text-foreground flex items-center gap-2" style={{ fontWeight: 400 }}>
            <Zap className="text-primary" size={24} /> The Gem Shop
          </h2>
          <Card className="folk-card border-border bg-card">
            <CardContent className="pt-8 space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">Gems (Emeralds) unlock the most powerful tools in the simulation.</p>
              <ul className="space-y-3">
                <li className="flex gap-3 items-center">
                  <Badge variant="outline" className="text-xs border-primary text-primary">Custom Designer</Badge>
                  <span className="text-xs text-muted-foreground font-medium">Design a fox with a precise genetic blueprint.</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Badge variant="outline" className="text-xs border-secondary text-secondary">Specialty Items</Badge>
                  <span className="text-xs text-muted-foreground font-medium">Buy Genetic Tests, Medicine, and Calculators.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
