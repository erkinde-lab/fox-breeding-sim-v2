'use client';

import { useGameStore } from '@/lib/store';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Trophy, Info } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';

export default function KennelPage() {
  const { foxes } = useGameStore();
  const foxList = Object.values(foxes);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-earth-900 tracking-tight">Your Foxes</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {foxList.length} / 5 Foxes
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foxList.map((fox) => (
          <Link key={fox.id} href={`/fox/${fox.id}`}>
            <div className="folk-card overflow-hidden hover:shadow-md transition cursor-pointer">
              <div className="h-40 flex items-center justify-center relative">
                <FoxIllustration phenotype={fox.phenotype} baseColor={fox.baseColor} pattern={fox.pattern} eyeColor={fox.eyeColor} size={16} />
                <div className="absolute top-2 right-2 flex gap-1">
                  {fox.isRetired && <Badge className="bg-earth-500">Retired</Badge>}
                  {fox.healthIssues.length > 0 && <Badge variant="destructive">Health</Badge>}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-earth-900">{fox.name}</h3>
                  <span className="text-xs text-earth-500 font-medium bg-earth-100 px-2 py-1 rounded">
                    Age {fox.age}
                  </span>
                </div>
                <div className="text-sm text-slate-600 mb-3 font-medium">{fox.baseColor}{fox.pattern !== "None" && ` with ${fox.pattern} markings`}</div>
                <div className="flex items-center gap-4 text-xs font-medium text-earth-500">
                  <span className="flex items-center gap-1">
                    <Trophy size={14} className="text-yellow-500" /> {fox.pointsLifetime} pts
                  </span>
                  <span>{fox.gender}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {foxList.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-earth-200">
            <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-earth-500 font-medium">No foxes in your kennel yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
