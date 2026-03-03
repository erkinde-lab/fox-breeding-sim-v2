"use client";

import React, { useState } from "react";
import { LOCI } from "@/lib/genetics";

interface GeneticTooltipProps {
  locus: string;
  alleles: string[];
  children: React.ReactNode;
}

export function GeneticTooltip({ locus, alleles, children }: GeneticTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const locusInfo = LOCI[locus];

  if (!locusInfo) return <>{children}</>;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-card border-2 border-primary/20 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary px-2 py-1 bg-primary/10 rounded-lg">
              Locus {locus}
            </span>
            <h4 className="text-xs font-black italic text-foreground tracking-tight">
              {locusInfo.name}
            </h4>
          </div>
          <p className="text-[10px] font-medium text-muted-foreground leading-relaxed mb-3">
            {locusInfo.description}
          </p>
          <div className="space-y-2 border-t border-border/50 pt-2">
            {alleles.map((allele, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="font-mono text-[10px] font-black text-primary bg-muted px-1.5 py-0.5 rounded leading-none mt-0.5">
                  {allele}
                </span>
                <span className="text-[9px] font-bold text-foreground/80 leading-snug">
                  {locusInfo.alleleDescriptions[allele] || "Unknown allele effect."}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
