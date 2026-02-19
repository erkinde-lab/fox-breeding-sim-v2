'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PawPrint, Trophy, Heart, ShoppingBag } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-earth-900 tracking-tight">
          Welcome to <span className="text-fire-600">Red Fox</span> Breeding Simulator
        </h1>
        <p className="text-xl text-earth-600 max-w-2xl mx-auto font-medium">
          Experience the art of fox genetics and competitive showing. Build your kennel,
          master complex inheritance, and produce the next Best in Show champion.
        </p>
        <div className="pt-6 flex justify-center gap-4">
          <Link href="/kennel">
            <Button size="lg" className="bg-fire-600 hover:bg-fire-500 h-14 px-8 text-lg font-bold shadow-lg shadow-fire-200">
              Enter My Kennel
            </Button>
          </Link>
          <Link href="/help">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-earth-200">
              How to Play
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
            icon={<PawPrint size={32} className="text-fire-600" />}
            title="Genetic Simulation"
            description="Complex Agouti, Black, Albino, Burgundy, Pearl, Mansfield Pearl, Fire, and White Markings loci interaction."
        />
        <FeatureCard
            icon={<Trophy size={32} className="text-amber-500" />}
            title="Competitive Shows"
            description="Compete in Junior, Open, Senior, and Championship levels across multiple specialty classes."
        />
        <FeatureCard
            icon={<Heart size={32} className="text-rose-500" />}
            title="Breeding Center"
            description="Strategic breeding with detailed COI tracking, health management, and genetic testing."
        />
        <FeatureCard
            icon={<ShoppingBag size={32} className="text-emerald-600" />}
            title="Economy & Staff"
            description="Manage your gold and gems. Hire professional Staff to improve your kennel quality."
        />
      </div>

      <div className="bg-earth-900 rounded-[48px] p-12 text-white overflow-hidden relative">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-black mb-4">Ready to start your journey?</h2>
            <p className="text-earth-300 text-lg mb-8">Join the community of breeders and start discovering rare color morphs today.</p>
            <Link href="/shop/adoption">
                <Button className="bg-white text-earth-900 hover:bg-earth-100 h-12 px-6 font-bold">
                    Adopt Your First Fox
                </Button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
              <PawPrint size={300} />
          </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-white p-8 rounded-[32px] border border-earth-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="p-4 bg-earth-50 rounded-2xl w-fit">
                {icon}
            </div>
            <h3 className="font-bold text-xl text-earth-900">{title}</h3>
            <p className="text-sm text-earth-600 leading-relaxed font-medium">{description}</p>
        </div>
    );
}
