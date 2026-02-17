'use client';

import React from 'react';
import { useGameStore, ACHIEVEMENTS } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, Trophy, Lock, Medal, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function QuestsPage() {
  const { unlockedAchievements } = useGameStore();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-earth-900 tracking-tight flex items-center gap-3">
           <Medal className="text-fire-600" /> Ranch Achievements
        </h1>
        <p className="text-earth-500 mt-2">Earn rewards and recognition for your progress in the simulator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlockedAchievements.includes(ach.id);
          return (
            <Card key={ach.id} className={cn(
                "folk-card transition-all",
                isUnlocked ? "border-fire-200 bg-white shadow-md" : "border-earth-200 bg-earth-50/50 opacity-70 grayscale"
            )}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                    <div className={cn(
                        "p-3 rounded-2xl",
                        isUnlocked ? "bg-fire-100 text-fire-600" : "bg-earth-200 text-earth-400"
                    )}>
                        {isUnlocked ? <Medal size={24} /> : <Lock size={24} />}
                    </div>
                    {isUnlocked && (
                        <Badge className="bg-fire-600 border-none">Unlocked</Badge>
                    )}
                </div>
                <CardTitle className="text-xl text-earth-900">{ach.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-earth-600 leading-relaxed">
                  {ach.description}
                </p>
                <div className="pt-4 border-t border-earth-100 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-earth-400 tracking-widest">Reward</span>
                    <span className="text-sm font-black text-fire-600 flex items-center gap-1">
                        {ach.rewardText} <ArrowUpRight size={14} />
                    </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="bg-earth-900 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Trophy size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black flex items-center gap-3">
             <Star className="text-fire-500 fill-fire-500" /> Season Challenges
          </h2>
          <p className="text-earth-300 mt-4 text-lg">
            Complete timed objectives to earn exclusive prizes and seasonal badges. Challenges reset every Spring.
          </p>
          
          <div className="mt-8 space-y-4">
            <ChallengeRow title="Master Breeder" progress={0} total={10} reward="Elite Breeding License" />
            <ChallengeRow title="Show Stopper" progress={1} total={5} reward="Crystal Trophy" />
            <ChallengeRow title="Market King" progress={0} total={50000} reward="Gilded Stall" unit="Gold" />
          </div>
        </div>
      </section>
    </div>
  );
}

function ChallengeRow({ title, progress, total, reward, unit }: { title: string, progress: number, total: number, reward: string, unit?: string }) {
    const percent = Math.min(100, (progress / total) * 100);
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <div>
                    <h4 className="font-bold text-white">{title}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-earth-400">Reward: {reward}</p>
                </div>
                <span className="text-xs font-mono text-earth-300">{progress.toLocaleString()}{unit ? ` ${unit}` : ''} / {total.toLocaleString()}{unit ? ` ${unit}` : ''}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-fire-500 transition-all" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
