'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Trophy, Info, LayoutDashboard, PawPrint } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';

function KennelContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'foxes';
  const { foxes, kennelCapacity } = useGameStore();
  const foxList = Object.values(foxes);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-4xl font-black text-earth-900 tracking-tight">Kennel Management</h1>
            <p className="text-earth-500 font-medium">Manage your foxes, view stats, and track show progress.</p>
        </div>
        <div className="flex bg-earth-100 p-1 rounded-xl shrink-0">
            <TabLink active={activeTab === 'dashboard'} href="/kennel?tab=dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <TabLink active={activeTab === 'foxes'} href="/kennel" icon={<PawPrint size={18} />} label="My Foxes" />
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <Dashboard />
      ) : (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-earth-100 shadow-sm">
                <h2 className="text-xl font-bold text-earth-900">Your Foxes</h2>
                <Badge variant="secondary" className="px-3 py-1 bg-earth-100 text-earth-700 border-none font-bold">
                {foxList.length} / {kennelCapacity} Slots Filled
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foxList.map((fox) => (
                <Link key={fox.id} href={`/fox/${fox.id}`}>
                    <div className="folk-card overflow-hidden hover:shadow-lg transition cursor-pointer group">
                    <div className="h-48 flex items-center justify-center relative bg-gradient-to-b from-earth-50 to-white">
                        <FoxIllustration phenotype={fox.phenotype} baseColor={fox.baseColor} pattern={fox.pattern} eyeColor={fox.eyeColor} size={18} />
                        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                        {fox.isRetired && <Badge className="bg-earth-500 border-none">Retired</Badge>}
                        {fox.healthIssues.length > 0 && <Badge variant="destructive">Health Issue</Badge>}
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-earth-900 group-hover:text-fire-600 transition-colors">{fox.name}</h3>
                        <span className="text-xs text-earth-500 font-black bg-earth-100 px-2 py-1 rounded uppercase tracking-wider">
                            Age {fox.age}
                        </span>
                        </div>
                        <div className="text-sm text-slate-500 mb-4 font-medium line-clamp-1">{fox.phenotype}</div>
                        <div className="flex items-center gap-6 text-xs font-bold text-earth-500 pt-4 border-t border-earth-50">
                        <span className="flex items-center gap-1.5">
                            <Trophy size={14} className="text-yellow-500" /> {fox.pointsLifetime.toLocaleString()} PTS
                        </span>
                        <span className="flex items-center gap-1.5 uppercase tracking-widest">
                            {fox.gender}
                        </span>
                        </div>
                    </div>
                    </div>
                </Link>
                ))}

                {foxList.length === 0 && (
                <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-earth-200">
                    <Info className="w-16 h-16 text-earth-200 mx-auto mb-4" />
                    <p className="text-earth-400 font-bold text-lg">No foxes in your kennel yet.</p>
                    <Link href="/shop/adoption">
                        <Button variant="link" className="text-fire-600 font-black uppercase tracking-widest mt-2">Adopt Your First Fox</Button>
                    </Link>
                </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}

export default function KennelPage() {
    return (
        <Suspense fallback={<div>Loading kennel...</div>}>
            <KennelContent />
        </Suspense>
    );
}

function TabLink({ active, href, icon, label }: { active: boolean, href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                active ? "bg-white text-earth-900 shadow-sm" : "text-earth-500 hover:text-earth-700"
            )}
        >
            {icon}
            {label}
        </Link>
    );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
