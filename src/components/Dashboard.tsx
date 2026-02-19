'use client';

import { useGameStore } from '@/lib/store';
import { ShowReport } from '@/lib/showing';
import { Badge } from '@/components/ui/badge';
import { Trophy, Heart, Star, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const {
    foxes, bisWins, bestMaleWins, bestFemaleWins,
    totalShowPoints, whelpingReports, showReports,
    hiredNutritionist, feedAllFoxes
  } = useGameStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-earth-900 tracking-tight">Kennel Dashboard</h2>
        {hiredNutritionist && (
          <Button onClick={feedAllFoxes} className="bg-orange-600 hover:bg-orange-500 gap-2">
            <Utensils size={18} /> Feed All Foxes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-earth-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-fire-100 rounded-lg text-fire-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider">Total Points</p>
            <p className="text-xl font-bold text-earth-900">{totalShowPoints}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-earth-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-earth-100 rounded-lg text-earth-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider">Best in Show</p>
            <p className="text-xl font-bold text-earth-900">{bisWins}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-earth-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-moss-100 rounded-lg text-moss-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider">Best Male</p>
            <p className="text-xl font-bold text-earth-900">{bestMaleWins}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-earth-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-fire-100 rounded-lg text-fire-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-earth-500 uppercase tracking-wider">Best Female</p>
            <p className="text-xl font-bold text-earth-900">{bestFemaleWins}</p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Latest Whelping */}
        <div className="bg-white p-6 rounded-xl border border-earth-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-rose-500" size={20} />
            <h3 className="font-bold text-earth-900">Latest Whelping</h3>
          </div>
          {whelpingReports.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">
                {whelpingReports[0].motherName}&apos;s Litter ({whelpingReports[0].kits.length} kits)
              </p>
              <div className="space-y-2">
                {whelpingReports[0].kits.map((kit, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 bg-earth-50 rounded">
                    <span>{kit.name}</span>
                    <Badge variant={kit.isStillborn ? "outline" : "secondary"}>
                      {kit.phenotype}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-earth-500 italic">No recent whelping events.</p>
          )}
        </div>

        {/* Latest Show Results */}
        <div className="bg-white p-6 rounded-xl border border-earth-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star className="text-amber-500" size={20} />
            <h3 className="font-bold text-earth-900">Recent Show Highlights</h3>
          </div>
          {showReports.length > 0 ? (
            <div className="space-y-4">
              {showReports.slice(0, 1).map((report: ShowReport, idx: number) => (
                <div key={idx}>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Year {report.year} {report.season} - {report.level} Show
                  </p>
                  <div className="space-y-2">
                    {report.results.filter((r: { foxId: string; place: number; class: string }) => foxes[r.foxId]).slice(0, 3).map((res: { foxId: string; place: number; class: string }, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm p-2 bg-earth-50 rounded">
                        <span>{foxes[res.foxId]?.name}</span>
                        <div className="flex gap-2">
                            <Badge variant="outline">#{res.place}</Badge>
                            <span className="text-xs text-slate-400">{res.class}</span>
                        </div>
                      </div>
                    ))}
                    {report.bestInShowFoxId && foxes[report.bestInShowFoxId] && (
                        <div className="flex justify-between items-center text-sm p-2 bg-yellow-50 border border-yellow-100 rounded">
                            <span className="font-bold text-yellow-800">Best In Show</span>
                            <span className="font-bold text-yellow-800">{foxes[report.bestInShowFoxId].name}</span>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-earth-500 italic">No recent show results.</p>
          )}
        </div>
      </div>
    </div>
  );
}
