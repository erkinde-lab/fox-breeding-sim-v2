

'use client';



import React from 'react';

import { useGameStore } from '@/lib/store';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import { Trophy, Users, Info } from 'lucide-react';



export default function ShowsPage() {

  const { runShows, year, season, seniorShowWinners } = useGameStore();

  const luckBonus = 0; // Remove random calculation for now



  return (

    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <h2 className="text-4xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Show Arena</h2>

        <Button onClick={runShows} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-6 py-6 rounded-2xl shadow-lg shadow-primary/20">

          <Trophy size={18} /> Run Daily Shows

        </Button>

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Info Card */}

        <Card className="lg:col-span-1 folk-card border-border shadow-sm">

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Info size={18} /> Show Info

            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-4">

            <div className="p-4 bg-muted/50 rounded-xl space-y-2 text-sm border border-border">

              <p className="font-bold text-foreground">Current Season: <span className="text-primary">{season}</span></p>

              <p className="text-muted-foreground font-medium">Shows happen daily. All your eligible foxes are automatically entered when you run the shows.</p>

            </div>



            <div className="space-y-2">

              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Levels</h4>

              <ul className="space-y-2 text-sm">

                <li className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/30 transition-colors">

                  <span className="font-bold">Junior</span>

                  <Badge variant="outline" className="text-[9px] font-bold opacity-60">&lt; 5 life pts</Badge>

                </li>

                <li className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/30 transition-colors">

                  <span className="font-bold">Open</span>

                  <Badge variant="outline" className="text-[9px] font-bold opacity-60">All kennels</Badge>

                </li>

                <li className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/30 transition-colors">

                  <span className="font-bold">Senior</span>

                  <Badge variant="outline" className="text-[9px] font-bold opacity-60">&gt; 10 life pts</Badge>

                </li>

                <li className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/30 transition-colors">

                  <span className="font-bold uppercase tracking-tighter">Championship</span>

                  <Badge className="bg-primary/10 text-primary border-none text-[9px] font-bold">Fall Only</Badge>

                </li>

              </ul>

            </div>



            <div className="space-y-3 pt-4 border-t border-border">

              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Specialty Classes</h4>

              <div className="flex flex-wrap gap-2 text-[11px] font-bold">

                <Badge variant="secondary" className="rounded-full px-3">Red</Badge>

                <Badge variant="secondary" className="rounded-full px-3">Silver</Badge>

                <Badge variant="secondary" className="rounded-full px-3">Gold</Badge>

                <Badge variant="secondary" className="rounded-full px-3">Cross</Badge>

                <Badge variant="secondary" className="rounded-full px-3">Exotic</Badge>

              </div>

            </div>

          </CardContent>

        </Card>



        {/* Qualification Card */}

        <Card className="lg:col-span-2 folk-card border-border shadow-sm">

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <Trophy size={18} className="text-primary" /> Championship Qualification

            </CardTitle>

          </CardHeader>

          <CardContent>

            {seniorShowWinners.length > 0 ? (

              <div className="space-y-4">

                <p className="text-sm text-muted-foreground font-medium">The following foxes have qualified for the Year {year} Championship:</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                  {seniorShowWinners.map(id => (

                    <div key={id} className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-center gap-2 group transition-all hover:bg-primary/10">

                      <Trophy size={14} className="text-primary opacity-50 transition-opacity group-hover:opacity-100" />

                      <span className="text-xs font-black">Fox #{id}</span>

                    </div>

                  ))}

                </div>

              </div>

            ) : (

              <div className="p-16 text-center bg-muted/30 border-2 border-dashed border-border rounded-[32px] transition-colors hover:bg-muted/50">

                <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />

                <p className="text-foreground font-bold text-lg">Empty Arena</p>

                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1 font-medium">No foxes have qualified for the Championship yet this year. Win a Senior Show to qualify!</p>

              </div>

            )}

          </CardContent>

        </Card>

      </div>

    </div>

  );

}
