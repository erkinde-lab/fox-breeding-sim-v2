'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Clock, Image, Flag, User, Smartphone, Palette, Activity, Zap, Dog, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UPCOMING_FEATURES = [
  {
    icon: <Image className="text-blue-500" />,
    title: 'Images for Coat Colors',
    description: 'Detailed, high-quality illustrations representing every unique genetic combination and mutation.'
  },
  {
    icon: <Flag className="text-fire-600" />,
    title: 'Banner',
    description: 'Personalize your kennel profile with unique, collectible banners and headers.'
  },
  {
    icon: <User className="text-moss-600" />,
    title: 'User Login',
    description: 'Secure account creation to save your kennel progress and compete against other real players.'
  },
  {
    icon: <Smartphone className="text-cyan-600" />,
    title: 'Mobile Friendly Site',
    description: 'A fully responsive interface optimized for seamless gameplay on smartphones and tablets.'
  },
  {
    icon: <Palette className="text-purple-600" />,
    title: 'Avatar Builder',
    description: 'Design your own custom breeder avatar with unique outfits and styles.'
  },
  {
    icon: <Activity className="text-red-600" />,
    title: 'Full Health & Pregnancy Risks',
    description: 'In-depth medical system including genetic health screens and potential pregnancy complications.'
  },
  {
    icon: <Zap className="text-yellow-600" />,
    title: 'Agility',
    description: 'A new competition circuit focusing on speed, training levels, and physical fitness.'
  },
  {
    icon: <Dog className="text-slate-600" />,
    title: 'Grey Foxes',
    description: 'Introduction of the Grey Fox (Urocyon cinereoargenteus) species with its own unique genetics.'
  }
];

export default function ComingSoonPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-earth-900 tracking-tight flex items-center justify-center gap-4">
           <Rocket className="text-fire-600 animate-bounce" size={48} /> Roadmap
        </h1>
        <p className="text-xl text-earth-500 max-w-2xl mx-auto">
          The future of Red Fox Breeding Simulator. We are actively developing these features to expand your experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {UPCOMING_FEATURES.map((feature, idx) => (
          <Card key={idx} className="folk-card overflow-hidden group hover:border-fire-200 transition-all shadow-sm">
            <CardHeader className="pb-2">
               <div className="p-3 bg-earth-50 rounded-2xl w-fit group-hover:bg-fire-50 transition-colors">
                  {feature.icon}
               </div>
               <CardTitle className="text-xl mt-4 text-earth-900">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-earth-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}

        <Card className="folk-card border-dashed border-2 flex items-center justify-center bg-earth-50/30">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="p-3 bg-white rounded-full shadow-sm text-earth-300">
               <Plus size={32} />
            </div>
            <div>
                <p className="font-black text-earth-400 uppercase tracking-widest text-sm">More TBA...</p>
                <p className="text-xs text-earth-400 mt-1">We have many more surprises in store!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="bg-earth-900 rounded-[40px] p-12 text-white relative overflow-hidden">
         <div className="absolute -right-20 -bottom-20 opacity-10">
            <Clock size={400} />
         </div>
         <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6">Development Progress</h2>
            <p className="text-earth-300 text-lg mb-8 max-w-xl">
              Follow our community forum to get the latest news on development progress and participate in feature polls.
            </p>
            <div className="flex flex-wrap gap-4">
               <Badge className="bg-fire-600 hover:bg-fire-500 cursor-pointer px-4 py-2 text-sm border-none">Dev Blog</Badge>
               <Badge className="bg-cyan-600 hover:bg-cyan-500 cursor-pointer px-4 py-2 text-sm border-none">Community Polls</Badge>
            </div>
         </div>
      </section>
    </div>
  );
}
