'use client';

import React from 'react';
import { PawPrint } from 'lucide-react';

interface Props {
  phenotype?: string;
  baseColor?: string;
  pattern?: string;
  eyeColor?: string;
  size?: number;
}

export function FoxIllustration({ phenotype, baseColor, pattern, eyeColor, size = 16 }: Props) {
  const p = (phenotype || '').toLowerCase();
  const b = (baseColor || '').toLowerCase();
  const pt = (pattern || '').toLowerCase();

  const getColors = () => {
    // Pattern Colors
    if (pt === 'white marble' || pt === 'georgian' || pt === 'platinum' || pt === 'arctic marble') {
        return { bg: 'bg-slate-100', icon: 'text-slate-300', border: 'border-slate-300' };
    }
    
    // Base Colors
    if (b.includes('amber')) return { bg: 'bg-amber-100', icon: 'text-amber-400', border: 'border-amber-200' };
    if (b.includes('fawn glow')) return { bg: 'bg-blue-100', icon: 'text-blue-300', border: 'border-blue-200' };
    if (b.includes('pink')) return { bg: 'bg-rose-50', icon: 'text-rose-200', border: 'border-rose-100' };
    if (b.includes('burgundy')) return { bg: 'bg-red-800', icon: 'text-red-900', border: 'border-red-950' };
    if (b.includes('pearl') || b.includes('sapphire')) return { bg: 'bg-slate-400', icon: 'text-slate-500', border: 'border-slate-500' };
    if (b.includes('silver')) return { bg: 'bg-slate-700', icon: 'text-slate-800', border: 'border-slate-900' };
    if (b.includes('gold') || b.includes('sun glow')) return { bg: 'bg-amber-500', icon: 'text-amber-600', border: 'border-amber-700' };
    if (b.includes('red')) return { bg: 'bg-orange-600', icon: 'text-orange-700', border: 'border-orange-800' };
    
    // Fallback using phenotype string for backward compatibility
    if (p.includes('leucistic')) return { bg: 'bg-white', icon: 'text-slate-100', border: 'border-slate-200' };
    if (p.includes('platinum')) return { bg: 'bg-slate-200', icon: 'text-slate-400', border: 'border-slate-300' };
    
    return { bg: 'bg-orange-50', icon: 'text-orange-200', border: 'border-earth-100' };
  };

  const colors = getColors();
  const eyeColorStyle = eyeColor?.toLowerCase() === 'blue' ? 'text-blue-500' : 
                        eyeColor?.toLowerCase() === 'green' ? 'text-green-500' : 'text-amber-700';

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border-2 ${colors.border} ${colors.bg} relative transition-all duration-500 overflow-hidden`} 
         style={{ width: size * 16, height: size * 16 }}>
      <img 
        src="/images/fox-placeholder.png" 
        alt="Fox" 
        className="w-full h-full object-contain rounded-xl"
        onError={(e) => {
          // Fallback to PawPrint if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.innerHTML = '<svg style="width: ' + (size * 8) + 'px; height: ' + (size * 8) + 'px" class="' + colors.icon + ' opacity-50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm0 0c0 1.5-.5 3-1.5 4.5L12 20l-3-7C8 11.5 7.5 10 7.5 8.5a2.5 2.5 0 0 1 5 0z"></path></svg>';
          fallback.className = 'flex items-center justify-center w-full h-full';
          target.parentNode?.insertBefore(fallback, target.nextSibling);
        }}
      />
      {eyeColor && (
        <div className="absolute top-1/4 left-1/4 right-1/4 flex justify-around opacity-80">
          <div className={`w-1 h-1 rounded-full ${eyeColorStyle} bg-current`} />
          <div className={`w-1 h-1 rounded-full ${eyeColorStyle} bg-current`} />
        </div>
      )}
      {pt !== 'none' && pt !== '' && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-1/4 bg-white transform -rotate-45 translate-y-2 translate-x-4" />
            <div className="w-full h-1/8 bg-white transform rotate-12 -translate-y-4" />
        </div>
      )}
    </div>
  );
}
