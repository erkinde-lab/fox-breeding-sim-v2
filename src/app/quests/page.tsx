'use client';

import React from 'react';
import { useGameStore, ACHIEVEMENTS } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, Trophy, Lock, Medal, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function QuestsPage() {
  const { unlockedAchievements, foxes, gold, bisWins } = useGameStore();

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-5xl font-folksy text-foreground tracking-tight flex items-center gap-4" style={{ fontWeight: 400 }}>
          <Medal className="text-primary" size={40} /> Kennel Achievements
        </h1>
        <p className="text-muted-foreground mt-3 font-medium text-lg">Earn rewards and recognition for your progress in the simulator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              "folk-card transition-all border-2 flex flex-col group",
              isUnlocked ? "border-primary/20 bg-card shadow-lg shadow-primary/5" : "border-border bg-muted/30 opacity-80"
            )}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "p-4 rounded-[2rem] shadow-inner transition-transform group-hover:scale-110 duration-500",
                    isUnlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/40"
                  )}>
                    {isUnlocked ? <Medal size={28} /> : <Lock size={28} />}
                  </div>
                  {isUnlocked && (
                    <Badge className="bg-primary text-primary-foreground border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 shadow-md">Unlocked</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-black italic tracking-tight text-foreground">{ach.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {ach.description}
                </p>

                <div className="p-4 bg-muted/50 rounded-2xl border border-border mt-auto">
                  <p className="text-[10px] font-black uppercase text-muted-foreground/60 mb-2 tracking-widest flex justify-between">
                    Requirement
                    {!isUnlocked && <span className="text-primary">{Math.floor(percent)}%</span>}
                  </p>
                  <p className="text-xs font-bold text-foreground leading-snug">{requirement}</p>
                  {!isUnlocked && (
                    <div className="mt-4 space-y-1.5">
                      <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner border border-border/50">
                        <div className="h-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)] transition-all duration-1000" style={{ width: `${percent}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] font-black text-muted-foreground/50 tracking-tighter">
                        <span>PROGRESS</span>
                        <span>{progress.toLocaleString()} / {target.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest">Reward</span>
                  <span className="text-sm font-black text-primary flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    {ach.rewardText} <ArrowUpRight size={16} />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="bg-primary/5 rounded-[48px] p-8 md:p-16 border border-primary/10 relative overflow-hidden shadow-xl mt-12 transition-colors">
        <div className="absolute top-0 right-0 p-12 text-primary opacity-[0.03] pointer-events-none -rotate-12 translate-x-1/4 -translate-y-1/4">
          <Trophy size={400} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Star className="text-primary fill-primary animate-spin-slow" size={32} />
            </div>
            <h2 className="text-5xl font-folksy tracking-tight" style={{ fontWeight: 400 }}>
              Season <span className="text-primary italic">Challenges</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Complete timed objectives to earn exclusive prizes and seasonal badges. Challenges reset every <span className="text-foreground font-black uppercase tracking-widest text-xs bg-muted px-2 py-0.5 rounded">Spring</span>.
          </p>

          <div className="mt-12 space-y-4">
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
    <div className="space-y-4 bg-background/40 p-6 rounded-3xl border border-border backdrop-blur-sm group hover:bg-background/60 transition-all hover:translate-x-2">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h4 className="text-xl font-black italic text-foreground tracking-tight">{title}</h4>
          <p className="text-sm text-muted-foreground font-medium leading-snug">{instruction}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-black font-mono text-primary bg-primary/10 px-2 py-1 rounded-md">
            {progress.toLocaleString()}{unit ? ` ${unit}` : ''} / {total.toLocaleString()}{unit ? ` ${unit}` : ''}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner border border-border/50">
          <div className="h-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.3)] transition-all duration-1000" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Seasonal Reward</span>
          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary">
            {reward}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
