"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function BreedingTabs() {
  const pathname = usePathname();

  const tabs = [
    { id: "breeding", label: "Breeding Center", href: "/breeding" },
    { id: "comparison", label: "Comparison Tool", href: "/breeding/comparison" },
    { id: "auto-match", label: "Auto-Match", href: "/breeding/auto-match" },
  ];

  return (
    <div className="flex bg-muted/50 p-1 rounded-2xl border border-border/50 w-fit mb-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <Link key={tab.id} href={tab.href}>
          <button
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
              pathname === tab.href
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        </Link>
      ))}
    </div>
  );
}
