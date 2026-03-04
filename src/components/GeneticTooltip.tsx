"use client";

import React, { ReactNode, useState } from "react";
import { LOCI } from "@/lib/genetics";

interface GeneticTooltipProps {
    locus: string;
    alleles: string[];
    children: ReactNode;
}

const ALLELE_LABELS: Record<string, Record<string, string>> = {
    A: { A: "Agouti (dominant)", a: "Non-agouti (recessive)" },
    B: { B: "Full Black (dominant)", b: "Dilute (recessive)" },
    C: { C: "Full Color (dominant)", c: "Albino (recessive)" },
    G: { G: "Normal (dominant)", g: "Burgundy (recessive)" },
    P: { P: "Normal (dominant)", p: "Pearl (recessive)" },
    Fire: { FI: "Normal (dominant)", fi: "Fire Factor (recessive)" },
    W: {
        w: "No markings (wild-type)",
        W: "White Marked",
        WM: "Marble",
        WG: "Georgian",
        WP: "Platinum",
    },
    L: { L: "Normal (dominant)", l: "Leucistic (recessive)" },
};

export function GeneticTooltip({ locus, alleles, children }: GeneticTooltipProps) {
    const [visible, setVisible] = useState(false);
    const locusInfo = LOCI[locus];
    const locusName = locusInfo?.name ?? locus;
    const labels = ALLELE_LABELS[locus] ?? {};

    return (
        <div
            className="relative w-full"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-4 py-3 rounded-2xl bg-card border-2 border-border shadow-xl text-left pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-150">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">
                        {locusName} Locus ({locus})
                    </p>
                    <div className="space-y-1">
                        {alleles.map((a, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black text-foreground w-6 shrink-0">
                                    {a}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium leading-tight">
                                    {labels[a] ?? a}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-card border-r-2 border-b-2 border-border rotate-45" />
                </div>
            )}
        </div>
    );
}
