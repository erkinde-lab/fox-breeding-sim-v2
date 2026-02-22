'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { ShowReport } from '@/lib/showing';
import { Badge } from '@/components/ui/badge';
import { Trophy, Heart, Star, Utensils, Award, Sparkles, Ghost, Leaf, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function Dashboard() {
  const {
    foxes, bisWins, bestMaleWins, bestFemaleWins,
    totalShowPoints, whelpingReports, showReports,
    hiredNutritionist, feedAllFoxes, kennelCapacity, gold, expandKennel
  } = useGameStore();

  const foxList = Object.values(foxes);

  const seasonalAwards = [
    { title: "Autumn Ghost", description: "Bred a Silver fox during the Hallow-season", year: 1, season: "Autumn", icon: Ghost, variant: "primary" },
    { title: "Spring Blossom", description: "Achieved 1st place with a Red Juvenile", year: 1, season: "Spring", icon: Leaf, variant: "secondary" },
    { title: "Winter Star", description: "Maintained a perfect health record in Winter", year: 1, season: "Winter", icon: Sparkles, variant: "primary" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-4xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Kennel Dashboard</h2>
        {hiredNutritionist && (
          <Button onClick={feedAllFoxes} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-6 rounded-2xl shadow-lg shadow-primary/20 gap-2">
            <Utensils size={16} /> Feed All Foxes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Kennel Capacity"
          value={`${foxList.length} / ${kennelCapacity}`}
          icon={<Home size={24} />}
          variant="primary"
        />
        <StatCard
          label="Total Points"
          value={totalShowPoints.toLocaleString()}
          icon={<Trophy size={24} />}
          variant="secondary"
        />
        <StatCard
          label="Best in Show"
          value={bisWins}
          icon={<Star size={24} />}
          variant="primary"
        />
        <StatCard
          label="Best Female"
          value={bestFemaleWins}
          icon={<Trophy size={24} />}
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Whelping */}
        <Card className="folk-card border-2 border-border bg-card overflow-hidden shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Heart className="text-primary fill-primary/20" size={20} />
              </div>
              <CardTitle className="text-xl font-black italic text-foreground tracking-tight">Latest Whelping</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {whelpingReports.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest bg-muted/30 px-3 py-1 rounded-md inline-block">
                  {whelpingReports[0].motherName}&apos;s Litter
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {whelpingReports[0].kits.map((kit, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-muted/20 hover:bg-muted/40 transition-colors rounded-2xl border border-border/50 group">
                      <span className="font-bold text-foreground italic group-hover:text-primary transition-colors">{kit.name}</span>
                      <Badge variant="outline" className="font-black text-[10px] uppercase tracking-tighter border-primary/20 text-primary px-3">
                        {kit.phenotype}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 opacity-40">
                <p className="text-sm text-foreground font-medium italic">No recent whelping events.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Show Results */}
        <Card className="folk-card border-2 border-border bg-card overflow-hidden shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-secondary/10 rounded-xl">
                <Star className="text-secondary fill-secondary/20" size={20} />
              </div>
              <CardTitle className="text-xl font-black italic text-foreground tracking-tight">Recent Highlights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {showReports.length > 0 ? (
              <div className="space-y-6">
                {showReports.slice(0, 1).map((report: ShowReport, idx: number) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 border-b border-border pb-2">
                      <span>Season {report.season} • Year {report.year}</span>
                      <span className="text-secondary">{report.level} Show</span>
                    </div>
                    <div className="space-y-2">
                      {report.results.filter((r: { foxId: string; place: number; class: string }) => foxes[r.foxId]).slice(0, 3).map((res: { foxId: string; place: number; class: string }, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-muted/20 hover:bg-muted/40 transition-colors rounded-xl border border-border/30 group">
                          <span className="text-sm font-bold text-foreground group-hover:text-secondary transition-colors italic">{foxes[res.foxId]?.name}</span>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="font-black text-[10px] px-2 h-5 bg-background border-border">#{res.place}</Badge>
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{res.class}</span>
                          </div>
                        </div>
                      ))}
                      {report.bestInShowFoxId && foxes[report.bestInShowFoxId] && (
                        <div className="mt-4 p-4 bg-secondary/5 border-2 border-secondary/20 rounded-2xl flex justify-between items-center group hover:bg-secondary/10 transition-all">
                          <div className="flex items-center gap-3">
                            <Trophy size={18} className="text-secondary" />
                            <span className="font-black italic text-foreground tracking-tight">Best In Show</span>
                          </div>
                          <span className="font-black text-secondary uppercase tracking-widest text-xs group-hover:scale-110 transition-transform">
                            {foxes[report.bestInShowFoxId].name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 opacity-40">
                <p className="text-sm text-foreground font-medium italic">No recent show results.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Challenge Awards */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Award className="text-secondary" size={20} />
          </div>
          <h3 className="text-2xl font-black italic text-foreground tracking-tight">Seasonal Challenge Awards</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seasonalAwards.map((award, i) => (
            <ChallengeAward
              key={i}
              title={award.title}
              description={award.description}
              year={award.year}
              season={award.season}
              icon={award.icon}
              variant={award.variant as 'primary' | 'secondary'}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon, variant }: { label: string, value: string | number, icon: React.ReactNode, variant: 'primary' | 'secondary' }) {
  return (
    <div className="bg-card p-6 rounded-[32px] border-2 border-border shadow-sm flex items-center gap-5 group hover:border-primary/20 transition-all hover:translate-y-[-4px] hover:shadow-xl hover:shadow-primary/5">
      <div className={cn(
        "p-4 rounded-[1.5rem] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner",
        variant === 'primary' ? "bg-primary/10 text-primary shadow-primary/5" : "bg-secondary/10 text-secondary shadow-secondary/5"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-black italic text-foreground tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function ChallengeAward({ title, description, year, season, icon: Icon, variant }: { title: string, description: string, year: number, season: string, icon: any, variant: 'primary' | 'secondary' }) {
  return (
    <div className="bg-card p-5 rounded-[2.5rem] border-2 border-border shadow-sm group hover:border-secondary/30 transition-all hover:translate-y-[-2px] hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3.5 rounded-2xl transition-all duration-500 group-hover:rotate-12 shadow-inner shrink-0",
          variant === 'primary' ? "bg-primary/10 text-primary shadow-primary/5" : "bg-secondary/10 text-secondary shadow-secondary/5"
        )}>
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h4 className="font-black italic text-foreground text-lg tracking-tight truncate group-hover:text-secondary transition-colors leading-tight">{title}</h4>
          </div>
          <p className="text-xs text-muted-foreground font-medium mb-3 line-clamp-2 leading-relaxed">{description}</p>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase text-muted-foreground/40 tracking-[0.2em]">
            <span>Year {year}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-secondary/60">{season}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
