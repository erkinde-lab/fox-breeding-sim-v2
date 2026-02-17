'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Book, Zap, Heart, Microscope } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-earth-900 tracking-tight flex items-center gap-3">
          <HelpCircle className="text-moss-600" /> Help Center
        </h1>
        <p className="text-earth-500 mt-2">Learn the basics of breeding, showing, and managing your ranch.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-earth-800 flex items-center gap-2">
            <Book className="text-fire-600" size={24} /> Getting Started
          </h2>
          <Card className="folk-card">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-fire-100 text-fire-600 p-2 rounded-lg h-fit"><Zap size={18}/></div>
                  <div>
                    <h4 className="font-bold text-earth-900">Your First Foxes</h4>
                    <p className="text-sm text-earth-600">Start by visiting the Foundation Adoption shop to buy your first pair. Look for complementary stats and genotypes.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-moss-100 text-moss-600 p-2 rounded-lg h-fit"><Heart size={18}/></div>
                  <div>
                    <h4 className="font-bold text-earth-900">Breeding Basics</h4>
                    <p className="text-sm text-earth-600">Breeding occurs in Winter. Select a Sire and Dam, then check the Breeding Insights for potential outcomes and COI.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-earth-800 flex items-center gap-2">
            <Microscope className="text-cyan-600" size={24} /> Genetics Explained
          </h2>
          <Card className="folk-card">
            <CardContent className="pt-6">
              <p className="text-sm text-earth-600 mb-4">Red Fox genetics follow Mendelian inheritance. Each locus has two alleles (one from each parent).</p>
              <div className="space-y-2">
                <div className="p-3 bg-earth-50 rounded-lg border border-earth-100">
                  <span className="font-bold text-earth-900 block text-xs uppercase">Dominant Alleles (Uppercase)</span>
                  <p className="text-xs text-earth-500">Only one allele is needed to show the trait (e.g., White Marked Wp).</p>
                </div>
                <div className="p-3 bg-earth-50 rounded-lg border border-earth-100">
                  <span className="font-bold text-earth-900 block text-xs uppercase">Recessive Alleles (Lowercase)</span>
                  <p className="text-xs text-earth-500">Two alleles are needed to show the trait (e.g., Silver bb).</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
