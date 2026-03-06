'use client';

import React from 'react';
import { Award, Code, Palette, Heart, Coffee, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CreditsPage() {
  const categories = [
    {
      title: "Lead Creator",
      icon: <Heart className="text-fire-600" />,
      members: ["Angmar"]
    },
    {
      title: "Design & Development",
      icon: <Code className="text-gems" />,
      members: ["The Red Fox Simulator Team"]
    },
    {
      title: "Art & Assets",
      icon: <Palette className="text-gold" />,
      members: ["Community Contributors", "Creative Commons Resources"]
    },
    {
      title: "Special Thanks",
      icon: <Coffee className="text-moss-600" />,
      members: ["Our Beta Testers", "The Sim Gaming Community"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-fire-100 rounded-3xl text-fire-600 mb-2">
          <Award size={48} />
        </div>
        <h1 className="text-5xl font-black text-earth-900 tracking-tighter italic">Game Credits</h1>
        <p className="text-earth-500 text-lg max-w-2xl mx-auto font-medium italic">
          Red Fox Breeding Simulator is made possible by the passion and dedication of our small team and the support of our players.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat, idx) => (
          <Card key={idx} className="folk-card overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="flex flex-row items-center gap-4 border-b border-earth-100 bg-earth-50/50 pb-4">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                {cat.icon}
              </div>
              <CardTitle className="text-xl font-black text-earth-900 tracking-tight uppercase italic">{cat.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {cat.members.map((member, midx) => (
                  <li key={midx} className="text-earth-700 font-bold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-earth-200 rounded-full" />
                    {member}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="folk-card border-2 border-dashed border-earth-200 bg-transparent p-8 text-center">
        <h3 className="text-2xl font-black text-earth-900 mb-4 italic flex items-center justify-center gap-3">
          <Shield className="text-fire-600" /> Built with Excellence
        </h3>
        <p className="text-earth-500 font-medium max-w-lg mx-auto mb-8">
          This project utilizes modern web technologies including Next.js, Tailwind CSS, and Framer Motion to provide a fast and accessible breeding simulation.
        </p>
        <Link href="/">
          <Button variant="default" className="bg-fire-600 hover:bg-fire-500 text-white font-black px-12 py-6 rounded-2xl shadow-lg shadow-fire-200 text-lg uppercase tracking-widest h-auto">
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
}
