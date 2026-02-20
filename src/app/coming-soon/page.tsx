'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Clock, Image, Flag, User, Smartphone, Palette, Activity, Zap, Dog, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UPCOMING_FEATURES = [
  {
    icon: <Image className="text-primary" />,
    title: 'Images for Coat Colors',
    description: 'Detailed, high-quality illustrations representing every unique genetic combination and mutation.'
  },
  {
    icon: <Flag className="text-primary" />,
    title: 'Banner Sets',
    description: 'Personalize your kennel profile with unique, collectible banners and decorative headers.'
  },
  {
    icon: <User className="text-primary" />,
    title: 'User Login System',
    description: 'Secure account creation to save your kennel progress and compete against other real players.'
  },
  {
    icon: <Smartphone className="text-primary" />,
    title: 'Mobile Friendly Interface',
    description: 'A fully responsive interface optimized for seamless gameplay on smartphones and tablets.'
  },
  {
    icon: <Palette className="text-secondary" />,
    title: 'Avatar Creator',
    description: 'Design your own custom breeder avatar with unique outfits and folksy styles.'
  },
  {
    icon: <Activity className="text-secondary" />,
    title: 'Veterinary System',
    description: 'In-depth medical system including genetic health screens and potential pregnancy complications.'
  },
  {
    icon: <Zap className="text-secondary" />,
    title: 'Agility Trials',
    description: 'A new competition circuit focusing on speed, training levels, and physical fitness.'
  },
  {
    icon: <Dog className="text-secondary" />,
    title: 'New Species Expansion',
    description: 'Introduction of the Grey Fox (Urocyon cinereoargenteus) species with its own unique genetics.'
  }
];

export default function ComingSoonPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-folksy text-foreground tracking-tight flex items-center justify-center gap-4" style={{ fontWeight: 400 }}>
          <Rocket className="text-primary animate-bounce" size={48} /> Project Roadmap
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
          The future of Red Fox Breeding Simulator. We are actively developing these features to expand your folksy kennel experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {UPCOMING_FEATURES.map((feature, idx) => (
          <Card key={idx} className="folk-card overflow-hidden group hover:border-primary/50 transition-all shadow-sm bg-card border-border">
            <CardHeader className="pb-2">
              <div className="p-3 bg-muted rounded-2xl w-fit group-hover:bg-primary/10 transition-colors border border-border">
                {feature.icon}
              </div>
              <CardTitle className="text-xl mt-4 text-foreground font-black italic">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}

        <Card className="folk-card border-dashed border-2 flex items-center justify-center bg-muted/30 border-border">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="p-3 bg-card rounded-full shadow-sm text-muted-foreground border border-border">
              <Plus size={32} />
            </div>
            <div>
              <p className="font-black text-muted-foreground uppercase tracking-widest text-sm">More TBA...</p>
              <p className="text-xs text-muted-foreground/60 mt-1">We have many more surprises in store!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="bg-primary text-primary-foreground rounded-[40px] p-12 relative overflow-hidden shadow-xl">
        <div className="absolute -right-20 -bottom-20 opacity-10">
          <Clock size={400} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-folksy mb-6" style={{ fontWeight: 400 }}>Development Progress</h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl font-medium leading-relaxed">
            Follow our community forum to get the latest news on development progress and participate in feature polls.
          </p>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default" className="bg-primary-foreground text-primary hover:opacity-90 cursor-pointer px-6 py-2 text-sm border-none font-black uppercase tracking-widest shadow-md">Dev Blog</Badge>
            <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 cursor-pointer px-6 py-2 text-sm font-black uppercase tracking-widest backdrop-blur-sm">Community Polls</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
