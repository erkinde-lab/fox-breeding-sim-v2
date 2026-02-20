'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PawPrint, Trophy, Heart, ShoppingBag } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-12">
      <div className="text-center space-y-6">
        <h1 className="text-6xl sm:text-8xl font-folksy text-earth-900 tracking-tight leading-[0.85]">
          Welcome to <span className="text-apricot">Red Fox</span><br />Breeding Simulator
        </h1>
        <p className="text-xl text-ink max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
          Experience the art of fox genetics and competitive showing. Build your kennel,
          master complex inheritance, and produce the next Best in Show champion.
        </p>
        <div className="pt-8 flex justify-center gap-6">
          <Link href="/kennel">
            <Button size="lg" className="h-16 px-10 text-lg">
              Enter My Kennel
            </Button>
          </Link>
          <Link href="/help">
            <Button size="lg" variant="outline" className="h-16 px-10 text-lg">
              How to Play
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<PawPrint size={32} className="text-apricot" />}
          title="Genetic Simulation"
          description="Complex Agouti, Black, Albino, Burgundy, Pearl, Mansfield Pearl and Fire loci interaction."
        />
        <FeatureCard
          icon={<Trophy size={32} className="text-amber-500" />}
          title="Competitive Shows"
          description="Compete in Junior, Open, Senior, and Championship levels across multiple specialty classes."
        />
        <FeatureCard
          icon={<Heart size={32} className="text-sagebrush" />}
          title="Breeding Center"
          description="Strategic breeding with detailed COI tracking, health management, and genetic testing."
        />
        <FeatureCard
          icon={<ShoppingBag size={32} className="text-moab" />}
          title="Economy & Staff"
          description="Manage your gold and gems. Hire professional Staff to improve your kennel quality."
        />
      </div>

      <div className="bg-moab rounded-[4rem] p-16 text-white overflow-hidden relative shadow-2xl shadow-moab/20">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl font-folksy mb-6 leading-tight">Ready to start your journey?</h2>
          <p className="text-white/80 text-lg mb-10 font-medium">Join our charming community of breeders and start discovering rare color morphs today.</p>
          <Link href="/shop/adoption">
            <Button className="bg-white text-moab hover:bg-oatmeal border-none transition-all shadow-xl">
              Adopt Your First Fox
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <PawPrint size={350} />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="folk-card p-10 space-y-6 flex flex-col items-start group">
      <div className="p-5 bg-muted rounded-[1.5rem] transition-colors group-hover:bg-primary/10">
        {icon}
      </div>
      <h3 className="font-folksy text-2xl text-earth-900">{title}</h3>
      <p className="text-[15px] text-ink/70 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
