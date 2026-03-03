"use client";

import React, { useState, Suspense } from "react";
import { useGameStore } from "@/lib/store";
import {
  PawPrint,
  Search,
  ArrowUpDown,
  Info,
  Trophy,
  Utensils,
  Sparkles,
  Dumbbell,
  Activity as ActivityIcon,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FoxIllustration } from "@/components/FoxIllustration";
import { isHungry, isGroomed, isTrained, Fox } from "@/lib/genetics";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Dashboard from "@/components/Dashboard";

type Tab = "dashboard" | "adult" | "young" | "retired";
type SortOption = "id" | "name" | "age" | "points";
type GenderFilter = "all" | "Dog" | "Vixen";

function KennelContent() {
  const { foxes, season } = useGameStore();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("id");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");

  const allFoxes = Object.values(foxes);

  const filteredFoxes = allFoxes.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.phenotype.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === "all" || f.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const sortedFoxes = [...filteredFoxes].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "age") return b.age - a.age;
    if (sortBy === "points") return b.pointsLifetime - a.pointsLifetime;
    return parseInt(a.id) - parseInt(b.id);
  });

  const adultFoxes = sortedFoxes.filter(f => f.age >= 2 && !f.isRetired);
  const youngFoxes = sortedFoxes.filter(f => f.age < 2);
  const retiredFoxes = sortedFoxes.filter(f => f.isRetired);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: ActivityIcon },
    { id: "adult", label: "Adult Kennel", icon: PawPrint, count: allFoxes.filter(f => f.age >= 2 && !f.isRetired).length },
    { id: "young", label: "Young & Kits", icon: ActivityIcon, count: allFoxes.filter(f => f.age < 2).length },
    { id: "retired", label: "Retirement", icon: Trophy, count: allFoxes.filter(f => f.isRetired).length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic text-foreground tracking-tight mb-2">My Kennel</h1>
          <p className="text-muted-foreground font-medium italic">Managing the legacy of your fox lines.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {activeTab !== "dashboard" && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Search foxes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 bg-card border-2 border-border pl-10 pr-4 py-2 rounded-xl text-sm focus:border-primary outline-none transition-all"
                />
              </div>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as GenderFilter)}
                className="bg-card border-2 border-border px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-primary cursor-pointer"
                aria-label="Filter by gender"
              >
                <option value="all">All Genders</option>
                <option value="Dog">Dogs</option>
                <option value="Vixen">Vixens</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-card border-2 border-border px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:border-primary cursor-pointer"
              >
                <option value="id">Sort by ID</option>
                <option value="name">Sort by Name</option>
                <option value="age">Sort by Age</option>
                <option value="points">Sort by Points</option>
              </select>
            </div>
          )}

          <div className="flex bg-muted/50 p-1 rounded-2xl border-2 border-border/50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-card text-foreground shadow-sm border-2 border-border/50" : "text-muted-foreground hover:text-foreground"}`}
              >
                <tab.icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && <span className="ml-1 opacity-50">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "adult" && <KennelGrid foxes={adultFoxes} type="adult" isFiltered={searchQuery !== "" || genderFilter !== "all"} season={season} />}
          {activeTab === "young" && <KennelGrid foxes={youngFoxes} type="young" isFiltered={searchQuery !== "" || genderFilter !== "all"} season={season} />}
          {activeTab === "retired" && <KennelGrid foxes={retiredFoxes} type="retired" isFiltered={searchQuery !== "" || genderFilter !== "all"} season={season} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function KennelGrid({ foxes, type, isFiltered, season }: { foxes: Fox[], type: string, isFiltered: boolean, season: string }) {
  if (foxes.length === 0) {
    return (
      <div className="py-24 text-center bg-card/50 rounded-[40px] border-2 border-dashed border-border">
        <Info className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-black italic text-foreground tracking-tight">{isFiltered ? "No matching foxes" : "No foxes here"}</h3>
        <p className="text-muted-foreground text-sm font-medium mt-1 mb-8">
          {isFiltered ? "Try adjusting your filters or search query." : "You don't have any foxes in this section yet."}
        </p>
        {!isFiltered && type !== "retired" && (
          <Link href={type === "young" ? "/breeding" : "/shop/adoption"}>
            <Button variant="outline" className="font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl">
              {type === "young" ? "Visit Breeding Center" : "Adopt a Fox"}
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {foxes.map(fox => (
        <FoxCard key={fox.id} fox={fox} season={season} />
      ))}
    </div>
  );
}

function FoxCard({ fox, season }: { fox: Fox, season: string }) {
  const hungry = isHungry(fox);
  const groomed = isGroomed(fox);
  const trained = isTrained(fox);

  return (
    <Link href={`/fox/${fox.id}`}>
      <div className="folk-card group relative overflow-hidden bg-card border-2 border-border rounded-[32px] hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6 group-hover:bg-primary/5 transition-colors">
          <FoxIllustration phenotype={fox.phenotype} size={16} />

          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50">
              <Utensils size={10} className={hungry ? "text-muted-foreground/20" : "text-primary"} />
              <Sparkles size={10} className={!groomed ? "text-muted-foreground/20" : "text-secondary"} />
              <Dumbbell size={10} className={!trained ? "text-muted-foreground/20" : "text-orange-500"} />
            </div>
          </div>

          <div className="absolute bottom-4 left-4">
             <Badge variant="outline" className={`font-black text-[8px] uppercase tracking-widest bg-background/80 backdrop-blur-sm border-border/50 ${fox.gender === "Dog" ? "text-blue-500" : "text-rose-500"}`}>
                {fox.gender}
             </Badge>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-black italic text-lg text-foreground truncate group-hover:text-primary transition-colors">{fox.name}</h3>
            <div className="flex items-center gap-1 text-primary font-black text-xs">
               <Trophy size={12} />
               <span>{fox.pointsLifetime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
            <span>
              {fox.age === 0 ? (["Spring", "Summer"].includes(season) ? "Newborn" : "Juvenile") : `${fox.age} Year${fox.age === 1 ? "" : "s"} Old`}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="truncate">{fox.phenotype}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function KennelPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-black uppercase tracking-widest text-muted-foreground">Loading Kennel...</div>}>
      <KennelContent />
    </Suspense>
  );
}
