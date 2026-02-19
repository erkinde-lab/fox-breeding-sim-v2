
'use client';

import React from 'react';
import { useGameStore, ShowConfig,  } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Info, Settings,  } from 'lucide-react';

export default function ShowsPage() {
  const { runShows, year, season, seniorShowWinners, isAdmin, showConfig, updateShowConfig } = useGameStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Show Arena</h2>
        <Button onClick={runShows} className="gap-2 bg-yellow-600 hover:bg-yellow-500">
          <Trophy size={18} /> Run Daily Shows
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info size={18} /> Show Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg space-y-2 text-sm">
              <p className="font-bold text-slate-700">Current Season: {season}</p>
              <p className="text-slate-500">Shows happen daily. All your eligible foxes are automatically entered when you run the shows.</p>
            </div>
            
            <div className="space-y-2">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Levels</h4>
               <ul className="space-y-1 text-sm">
                  <li className="flex justify-between"><span>Junior</span> <span className="text-slate-400">&lt; 5 lifetime pts</span></li>
                  <li className="flex justify-between"><span>Open</span> <span className="text-slate-400">All kennels</span></li>
                  <li className="flex justify-between"><span>Senior</span> <span className="text-slate-400">&gt; 10 lifetime pts</span></li>
                  <li className="flex justify-between"><span>Championship</span> <span className="text-slate-400">Fall only, Senior winners</span></li>
               </ul>
            </div>

            <div className="space-y-2">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specialty Classes</h4>
               <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Red Specialty</li>
                  <li>• Silver Specialty (Standard/Alaskan)</li>
                  <li>• Gold Specialty</li>
                  <li>• Cross Specialty</li>
                  <li>• Exotic Specialty (Recessive Mods)</li>
               </ul>
            </div>
          </CardContent>
        </Card>

        {/* Qualification Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" /> Championship Qualification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {seniorShowWinners.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">The following foxes have qualified for the Year {year} Championship:</p>
                <div className="flex flex-wrap gap-2">
                  {seniorShowWinners.map(id => (
                    <Badge key={id} className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Fox #{id}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                 <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                 <p className="text-slate-500 font-medium">No foxes have qualified for the Championship yet this year.</p>
                 <p className="text-xs text-slate-400 mt-1">Win a Senior Show to qualify!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Show Config */}
        {isAdmin && (
          <Card className="lg:col-span-full border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Settings size={18} /> Admin: Show Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(Object.keys(showConfig) as (keyof ShowConfig)[]).map((level) => (
                  <div key={level} className="space-y-4 p-4 bg-white rounded-lg border border-orange-100 shadow-sm">
                    <h4 className="font-bold text-slate-700 border-b pb-2">{level} Prizes</h4>
                    <PrizeInput 
                      label="BIS" 
                      value={showConfig[level].bis} 
                      onChange={(val) => updateShowConfig(level, { bis: val })} 
                    />
                    <PrizeInput 
                      label="1st" 
                      value={showConfig[level].first} 
                      onChange={(val) => updateShowConfig(level, { first: val })} 
                    />
                    <PrizeInput 
                      label="2nd" 
                      value={showConfig[level].second} 
                      onChange={(val) => updateShowConfig(level, { second: val })} 
                    />
                    <PrizeInput 
                      label="3rd" 
                      value={showConfig[level].third} 
                      onChange={(val) => updateShowConfig(level, { third: val })} 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function PrizeInput({ label, value, onChange }: { label: string; value: number; onChange: (val: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-bold text-slate-500 w-8">{label}</span>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full text-right p-1 text-sm border rounded bg-slate-50 focus:bg-white transition"
      />
    </div>
  );
}
