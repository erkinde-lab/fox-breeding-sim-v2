'use client';

import React, { useState } from 'react';
import { Fox, isHungry, isGroomed, isTrained } from '@/lib/genetics';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScoreBreakdown({ fox, children }: { fox: Fox; children?: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const hungry = isHungry(fox);
  const groomed = isGroomed(fox);
  const trained = isTrained(fox);

  const stats = [
    { label: 'Base Physique', value: (fox.stats.head + fox.stats.topline + fox.stats.forequarters + fox.stats.hindquarters + fox.stats.tail) / 5 },
    { label: 'Coat Quality', value: fox.stats.coatQuality, bonus: groomed ? 5 : 0 },
    { label: 'Temperament', value: fox.stats.temperament, bonus: trained ? 3 : 0 },
    { label: 'Presence', value: fox.stats.presence, bonus: trained ? 3 : 0 },
    { label: 'Luck Factor', value: fox.stats.luck / 10 },
  ];

  const total = stats.reduce((acc, s) => acc + s.value + (s.bonus || 0), 0);

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div className="cursor-help">
        {children || (
          <button className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-primary hover:underline">
            <Info size={12} /> Score Breakdown
          </button>
        )}
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[150] w-64 p-4 bg-card border-2 border-border rounded-2xl shadow-2xl pointer-events-none"
          >
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Predicted Performance</h4>
              <div className="space-y-1.5">
                {stats.map((s) => (
                  <div key={s.label} className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-muted-foreground">{s.label}</span>
                    <span className="font-mono font-black text-foreground">
                      {s.value.toFixed(1)}
                      {s.bonus ? <span className="text-secondary ml-1">+{s.bonus}</span> : ''}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-foreground">Estimated Base</span>
                <span className="text-sm font-black text-primary">{total.toFixed(1)}</span>
              </div>
              {hungry && (
                <p className="text-[9px] font-bold text-destructive uppercase italic">* Penalized for hunger</p>
              )}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-card" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-border -z-10 translate-y-[2px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
