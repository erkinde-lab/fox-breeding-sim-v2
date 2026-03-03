"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LOCI, Allele } from "@/lib/genetics";
import { Info } from "lucide-react";

interface GeneticTooltipProps {
  locus: string;
  alleles: Allele[];
  children: React.ReactNode;
}

export function GeneticTooltip({ locus, alleles, children }: GeneticTooltipProps) {
  const info = LOCI[locus];
  if (!info) return <>{children}</>;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="p-4 max-w-xs bg-card border-2 border-border shadow-2xl rounded-2xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Info size={14} className="text-primary" />
              <span className="text-xs font-black uppercase tracking-widest">{info.name} Locus</span>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground leading-relaxed italic">
              {info.description}
            </p>
            <div className="space-y-2">
              {Array.from(new Set(alleles)).map(allele => (
                <div key={allele} className="flex gap-2">
                  <span className="text-[10px] font-mono font-black text-primary bg-primary/5 px-1 rounded">{allele}</span>
                  <p className="text-[9px] font-bold text-foreground/80 leading-snug">
                    {info.alleleDescriptions[allele] || "Genetic variant."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
