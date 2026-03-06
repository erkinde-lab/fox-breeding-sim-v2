"use client";

import React, { useState, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Info,
  LayoutDashboard,
  PawPrint,
  Utensils,
  Home,
  Sparkles,
  Dumbbell,
  Heart,
  ArrowRight,
  Search,
  ArrowUpDown,
  Activity as ActivityIcon,
  Users,
} from "lucide-react";
import { FoxIllustration } from "@/components/FoxIllustration";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { isHungry, isGroomed, isTrained, Fox } from "@/lib/genetics";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = "id" | "name" | "age" | "points";

function KennelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { foxes, kennelCapacity, expandKennel, season, year } = useGameStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("id");

  const tabParam = searchParams.get("tab");
  const activeTab = useMemo(() => {
    if (
      tabParam &&
      ["dashboard", "adult", "young", "retired", "hof", "npc"].includes(tabParam)
    ) {
      return tabParam;
    }
    return "dashboard";
  }, [tabParam]);

  const handleTabChange = (tab: string) => {
    router.push(`/kennel?tab=${tab}`, { scroll: false });
  };

  const foxList = Object.values(foxes).filter(fox => fox.ownerId !== "player-0");

  const filteredAndSortedFoxes = useMemo(() => {
    return foxList
      .filter((fox) => {
        const query = searchQuery.toLowerCase();
        return (
          fox.name.toLowerCase().includes(query) ||
          fox.phenotype.toLowerCase().includes(query) ||
          fox.id.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "age") return b.age - a.age;
        if (sortBy === "points") return b.pointsLifetime - a.pointsLifetime;
        return a.id.localeCompare(b.id);
      });
  }, [foxList, searchQuery, sortBy]);

  const adultFoxes = filteredAndSortedFoxes.filter(
    (fox) => fox.age >= 1 && !fox.isRetired,
  );
  const youngFoxes = filteredAndSortedFoxes.filter((fox) => fox.age < 1);
  const retiredFoxes = filteredAndSortedFoxes.filter((fox) => fox.isRetired);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "adult",
      label: "Adult Kennel",
      icon: PawPrint,
      count: foxList.filter((f) => f.age >= 1 && !f.isRetired).length,
    },
    {
      id: "young",
      label: "Young Kennel",
      icon: Heart,
      count: foxList.filter((f) => f.age < 1).length,
    },
    {
      id: "retired",
      label: "Retired",
      icon: Home,
      count: foxList.filter((f) => f.isRetired).length,
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1
            className="text-4xl font-folksy text-foreground tracking-tight"
            style={{ fontWeight: 400 }}
          >
            My Kennel
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground text-sm font-medium">
              Managing {foxList.length} foxes
            </p>
            <span className="text-muted-foreground/30">•</span>
            <button
              onClick={() => expandKennel()}
              className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              Expand Kennel ({kennelCapacity} slots) <ArrowRight size={10} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search and Sort (Only show on kennel tabs) */}
          {activeTab !== "dashboard" && (
            <div className="flex gap-2 flex-1 sm:flex-none">
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search foxes..."
                  aria-label="Search foxes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card border border-border pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="relative">
                <ArrowUpDown
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  size={14}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-card border border-border pl-9 pr-8 py-2 rounded-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  aria-label="Sort foxes"
                >
                  <option value="id">Sort: ID</option>
                  <option value="name">Sort: Name</option>
                  <option value="age">Sort: Age</option>
                  <option value="points">Sort: Points</option>
                </select>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div
            className="flex bg-muted/50 p-1 rounded-2xl border border-border/50 overflow-x-auto no-scrollbar"
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "adult" && (
            <KennelGrid
              foxes={adultFoxes}
              type="adult"
              isFiltered={searchQuery !== ""}
              season={season}
            />
          )}
          {activeTab === "young" && (
            <KennelGrid
              foxes={youngFoxes}
              type="young"
              isFiltered={searchQuery !== ""}
              season={season}
            />
          )}
          {activeTab === "retired" && (
            <KennelGrid
              foxes={retiredFoxes}
              type="retired"
              isFiltered={searchQuery !== ""}
              season={season}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NPCKennel({ foxes }: { foxes: Record<string, Fox> }) {
  const npcFoxList = Object.values(foxes).filter(fox => fox.ownerId === "player-0");
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {npcFoxList.map((npc) => (
        <div
          key={npc.id}
          className="folk-card border-2 border-border shadow-sm rounded-[32px] overflow-hidden bg-card"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <PawPrint size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{npc.name}</h3>
                  <p className="text-sm text-muted-foreground">{npc.phenotype}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                NPC
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>{npc.gender}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{npc.age} years old</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Stud Fee: {npc.studFee} Gold</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={npc.studFee > 0 ? "default" : "secondary"} className="text-xs">
                {npc.studFee > 0 ? "Available for Breeding" : "Not Available"}
              </Badge>
              {npc.studFee === 0 && (
                <Badge variant="outline" className="text-xs">
                  Past Stud
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {npcFoxList.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No NPC studs available</p>
          <p className="text-sm">NPC studs will appear here after their breeding year ends</p>
        </div>
      )}
    </div>
  );
}

function KennelGrid({
  foxes,
  type,
  isFiltered,
  season,
}: {
  foxes: Fox[];
  type: string;
  isFiltered: boolean;
  season: string;
}) {
  if (foxes.length === 0) {
    return (
      <div className="py-24 text-center bg-card/50 rounded-[40px] border-2 border-dashed border-border transition-all">
        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info className="w-8 h-8 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-black italic text-foreground tracking-tight">
          {isFiltered ? "No matching foxes" : "No foxes here"}
        </h3>
        <p className="text-muted-foreground text-sm font-medium mt-1 mb-8">
          {isFiltered
            ? "Try adjusting your search query."
            : type === "adult"
              ? "You don't have any adult foxes yet."
              : type === "young"
                ? "No kits in the nursery right now."
                : "The retirement home is empty."}
        </p>
        {!isFiltered && type !== "retired" && (
          <Link href={type === "young" ? "/breeding" : "/shop/adoption"}>
            <Button
              variant="outline"
              className="font-black uppercase tracking-widest text-xs h-10 rounded-xl"
            >
              {type === "young" ? "Visit Breeding Center" : "Adopt a Fox"}
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {foxes.map((fox) => (
        <FoxCard key={fox.id} fox={fox} season={season} />
      ))}
    </div>
  );
}

function FoxCard({ fox, season }: { fox: Fox; season: string }) {
  const hungry = isHungry(fox);
  const groomed = isGroomed(fox);
  const trained = isTrained(fox);

  return (
    <Link href={`/fox/${fox.id}`}>
      <div className="folk-card group relative overflow-hidden bg-card border-2 border-border rounded-[32px] hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6 group-hover:bg-primary/5 transition-colors duration-500">
          <FoxIllustration
            phenotype={fox.phenotype}
            baseColor={fox.baseColor}
            pattern={fox.pattern}
            eyeColor={fox.eyeColor}
            size={16}
          />

          {/* Status Icons Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2 py-1.5 rounded-xl border border-border/50 shadow-sm">
              <Utensils
                size={12}
                className={hungry ? "text-muted-foreground/20" : "text-primary"}
              />
              <Sparkles
                size={12}
                className={
                  !groomed ? "text-muted-foreground/20" : "text-secondary"
                }
              />
              <Dumbbell
                size={12}
                className={
                  !trained ? "text-muted-foreground/20" : "text-orange-500"
                }
              />
              {fox.isAltered && (
                <ActivityIcon size={12} className="text-purple-500" />
              )}
            </div>
          </div>

          {/* Gender Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge
              variant="outline"
              className={`font-black text-[9px] uppercase tracking-widest bg-background/80 backdrop-blur-sm border-border/50 ${fox.gender === "Dog" ? "text-info" : "text-rose-500"}`}
            >
              {fox.gender === "Dog" ? "Dog" : "Vixen"}
            </Badge>
          </div>

          {/* ID Overlay on Hover */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4 pointer-events-none">
            <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-background px-2 py-1 rounded-lg border border-primary/20 shadow-sm">
              ID: {fox.id}
            </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-black italic text-lg text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
              {fox.name}
            </h3>
            <div className="flex items-center gap-1 text-primary font-black text-xs">
              <Trophy size={12} />
              <span>{fox.pointsLifetime}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
              {fox.age === 0
                ? ["Spring", "Summer"].includes(season)
                  ? "Newborn"
                  : "Juvenile"
                : `${fox.age} ${fox.age === 1 ? "Year" : "Years"} Old`}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight truncate">
              {fox.phenotype}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function KennelPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-black uppercase tracking-widest text-muted-foreground">
          Loading Kennel...
        </div>
      }
    >
      <KennelContent />
    </Suspense>
  );
}
