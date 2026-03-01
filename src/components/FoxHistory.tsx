"use client";

import React from "react";
import { Trophy, Heart, Sparkles, Calendar } from "lucide-react";

interface HistoryItem {
  year: number;
  season: string;
  event: string;
  type: "show" | "breeding" | "life";
}

interface FoxHistoryProps {
  history?: HistoryItem[];
}

export function FoxHistory({ history }: FoxHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div className="py-8 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border">
        <p className="text-xs font-bold text-muted-foreground/50 italic">
          No history recorded yet.
        </p>
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    const seasons = ["Winter", "Autumn", "Summer", "Spring"]; // Reverse order
    return seasons.indexOf(a.season) - seasons.indexOf(b.season);
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "show":
        return <Trophy size={12} className="text-secondary" />;
      case "breeding":
        return <Heart size={12} className="text-primary" />;
      case "life":
        return <Calendar size={12} className="text-muted-foreground" />;
      default:
        return <Sparkles size={12} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {sortedHistory.map((item, idx) => (
        <div
          key={idx}
          className="relative pl-6 pb-4 border-l-2 border-border last:pb-0 last:border-l-transparent"
        >
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-card border-2 border-border flex items-center justify-center">
            {getIcon(item.type)}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                Year {item.year}, {item.season}
              </span>
              <span className={cn(
                "text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md",
                item.type === "show" ? "bg-secondary/10 text-secondary" :
                item.type === "breeding" ? "bg-primary/10 text-primary" :
                "bg-muted text-muted-foreground"
              )}>
                {item.type}
              </span>
            </div>
            <p className="text-xs font-bold text-foreground/80 leading-snug">
              {item.event}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
