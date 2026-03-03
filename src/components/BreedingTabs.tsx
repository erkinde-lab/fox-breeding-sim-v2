"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Calculator, Sparkles } from "lucide-react";

export function BreedingTabs() {
  const pathname = usePathname();

  const tabs = [
    { id: "center", label: "Breeding Center", href: "/breeding", icon: Heart },
    { id: "comparison", label: "Comparison Tool", href: "/breeding/comparison", icon: Calculator },
    { id: "automatch", label: "Auto-Match", href: "/breeding/auto-match", icon: Sparkles },
  ];

  return (
    <div className="flex bg-muted/50 p-1 rounded-2xl border-2 border-border/50 overflow-x-auto no-scrollbar mb-8">
      {tabs.map(tab => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              isActive
                ? "bg-card text-foreground shadow-sm border-2 border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
