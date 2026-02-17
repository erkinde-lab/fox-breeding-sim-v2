
'use client';

import React from 'react';
import { PawPrint } from 'lucide-react';

interface Props {
  phenotype: string;
  size?: number;
}

export function FoxIllustration({ phenotype, size = 16 }: Props) {
  const getColors = (p: string) => {
    const pLower = p.toLowerCase();
    
    if (pLower.includes('albino')) return { bg: 'bg-white', icon: 'text-slate-200' };
    if (pLower.includes('leucistic') || pLower.includes('white marble') || pLower.includes('georgian')) 
        return { bg: 'bg-earth-50', icon: 'text-slate-200' };
    
    if (pLower.includes('champagne')) return { bg: 'bg-pink-100', icon: 'text-pink-300' };
    if (pLower.includes('palomino')) return { bg: 'bg-amber-50', icon: 'text-amber-200' };
    
    if (pLower.includes('burgundy')) {
        if (pLower.includes('platinum') || pLower.includes('pearl')) return { bg: 'bg-red-200', icon: 'text-red-400' };
        return { bg: 'bg-red-800', icon: 'text-red-900' };
    }
    
    if (pLower.includes('pearl') || pLower.includes('sapphire')) return { bg: 'bg-earth-300', icon: 'text-slate-500' };
    
    if (pLower.includes('platinum')) return { bg: 'bg-earth-200', icon: 'text-slate-400' };
    
    if (pLower.includes('silver cross')) return { bg: 'bg-slate-800', icon: 'text-slate-900' };
    if (pLower.includes('cross')) return { bg: 'bg-orange-900', icon: 'text-orange-950' };
    
    if (pLower.includes('silver')) return { bg: 'bg-slate-600', icon: 'text-slate-700' };
    
    if (pLower.includes('gold')) return { bg: 'bg-amber-500', icon: 'text-amber-600' };
    if (pLower.includes('smokey red') || pLower.includes('substandard red')) return { bg: 'bg-orange-800', icon: 'text-orange-950' };
    if (pLower.includes('wildfire') || pLower.includes('red')) return { bg: 'bg-orange-600', icon: 'text-orange-700' };
    
    return { bg: 'bg-orange-100', icon: 'text-orange-300' };
  };

  const colors = getColors(phenotype);

  return (
    <div className={`flex items-center justify-center rounded-2xl border-2 border-earth-100 ${colors.bg} h-full w-full transition-colors duration-500`}>
      <PawPrint style={{ width: size * 4, height: size * 4 }} className={`${colors.icon} opacity-50`} />
    </div>
  );
}
