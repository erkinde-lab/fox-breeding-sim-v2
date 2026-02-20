'use client';

import React from 'react';
import { useGameStore, ACHIEVEMENTS } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, Trophy, Lock, Medal, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function QuestsPage() {
  const { unlockedAchievements, foxes, gold, bisWins } = useGameStore();

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-earth-900 tracking-tight flex items-center gap-3">
           <Medal className="text-fire-600" /> Kennel Achievements
        </h1>
        <p className="text-earth-500 mt-2 font-medium">Earn rewards and recognition for your progress in the simulator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlockedAchievements.includes(ach.id);

          // Logic for clearer requirements
          let requirement = "";
          let progress = 0;
          let target = 1;

          if (ach.id === 'first-fox') {
              requirement = "Adopt at least 1 foundational fox from the shop.";
              progress = Object.keys(foxes).length;
              target = 1;
          } else if (ach.id === 'master-breeder') {
              requirement = "Own 5 or more foxes simultaneously in your kennel.";
              progress = Object.keys(foxes).length;
              target = 5;
          } else if (ach.id === 'show-winner') {
              requirement = "Win at least one Best in Show (BIS) award in any competition.";
              progress = bisWins;
              target = 1;
          } else if (ach.id === 'millionaire') {
              requirement = "Accumulate a total of 50,000 Gold in your treasury.";
              progress = gold;
              target = 50000;
          }

          const percent = Math.min(100, (progress / target) * 100);

          return (
            <Card key={ach.id} className={cn(
                "folk-card transition-all border-2",
                isUnlocked ? "border-fire-200 bg-white shadow-md" : "border-earth-100 bg-earth-50/50 opacity-80"
            )}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                    <div className={cn(
                        "p-3 rounded-2xl shadow-inner",
                        isUnlocked ? "bg-fire-100 text-fire-600" : "bg-earth-200 text-earth-400"
                    )}>
                        {isUnlocked ? <Medal size={24} /> : <Lock size={24} />}
                    </div>
                    {isUnlocked && (
                        <Badge className="bg-fire-600 border-none font-bold">Unlocked</Badge>
                    )}
                </div>
                <CardTitle className="text-xl font-black text-earth-900">{ach.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-earth-600 leading-relaxed font-medium">
                  {ach.description}
                </p>

                <div className="p-3 bg-earth-50 rounded-xl border border-earth-100">
                    <p className="text-[10px] font-black uppercase text-earth-400 mb-1 tracking-widest">Requirement</p>
                    <p className="text-xs font-bold text-earth-700">{requirement}</p>
                    {!isUnlocked && (
                        <div className="mt-3 space-y-1">
                             <div className="flex justify-between text-[9px] font-black text-earth-400">
                                <span>PROGRESS</span>
                                <span>{progress.toLocaleString()} / {target.toLocaleString()}</span>
                             </div>
                             <div className="h-1.5 bg-earth-200 rounded-full overflow-hidden">
                                <div className="h-full bg-fire-500" style={{ width: `${percent}%` }} />
                             </div>
                        </div>
                    )}
                </div>

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

      <section className="bg-earth-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Trophy size={250} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-black flex items-center gap-3 italic">
             <Star className="text-fire-500 fill-fire-500" /> Season Challenges
          </h2>
          <p className="text-earth-300 mt-4 text-lg font-medium">
            Complete timed objectives to earn exclusive prizes and seasonal badges. Challenges reset every Spring.
          </p>
          
          <div className="mt-10 space-y-6">
            <ChallengeRow
                title="Master Breeder"
                progress={0}
                total={10}
                reward="Elite Breeding License"
                instruction="Produce 10 successful litters this season."
            />
            <ChallengeRow
                title="Show Stopper"
                progress={1}
                total={5}
                reward="Crystal Trophy"
                instruction="Place 1st in 5 different Open or Senior level shows."
            />
            <ChallengeRow
                title="Market King"
                progress={0}
                total={50000}
                reward="Gilded Stall"
                unit="Gold"
                instruction="Earn 50,000 Gold from market sales this season."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ChallengeRow({ title, progress, total, reward, unit, instruction }: { title: string, progress: number, total: number, reward: string, unit?: string, instruction: string }) {
    const percent = Math.min(100, (progress / total) * 100);
    return (
        <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">{title}</h4>
                    <p className="text-xs text-earth-400 font-medium mt-0.5">{instruction}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-fire-500 mt-2">Reward: {reward}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-black font-mono text-fire-400">{progress.toLocaleString()}{unit ? ` ${unit}` : ''} / {total.toLocaleString()}{unit ? ` ${unit}` : ''}</span>
                </div>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-fire-500 shadow-[0_0_10px_rgba(234,88,12,0.5)] transition-all" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
