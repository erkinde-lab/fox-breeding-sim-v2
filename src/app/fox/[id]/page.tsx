"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Sparkles,
  Dumbbell,
  Utensils,
  ChevronDown,
  Heart,
  Activity,
  Calendar,
  Dna,
  Info,
  Trophy,
  Check,
  ShoppingBag,
  Activity as ActivityIcon,
  Coins,
  Diamond,
} from "lucide-react";
import { FoxIllustration } from "@/components/FoxIllustration";
import {
  isHungry,
  isGroomed,
  isTrained,
  calculateCOI,
  Fox,
  getActiveBoosts,
} from "@/lib/genetics";
import { GeneticTooltip } from "@/components/GeneticTooltip";
import { FoxHistory } from "@/components/FoxHistory";
import { useNotifications } from "@/components/NotificationProvider";

export default function FoxProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { addNotification } = useNotifications();
  const {
    foxes,
    foundationFoxes,
    npcStuds,
    applyItem,
    renameFox,
    retireFox,
    toggleStudStatus,
    season,
    listFoxOnMarket,
    updateFox,
    spayNeuterFox,
  } = useGameStore();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState("supplies");
  const [isFeedDropdownOpen, setIsFeedDropdownOpen] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [listPrice, setListPrice] = useState(1000);
  const [listCurrency, setListCurrency] = useState<"gold" | "gems">("gold");

  const fox =
    foxes[id as string] ||
    foundationFoxes.find((f) => f.id === id) ||
    Object.values(npcStuds).find((f) => f.id === id);
  const isFoundational = !foxes[id as string];
  const [newName, setNewName] = useState(fox?.name || "");

  if (!fox)
    return (
      <div className="py-20 text-center font-black uppercase tracking-widest text-muted-foreground">
        Fox not found
      </div>
    );

  // Scoped navigation: only navigate foxes in the same category (Adult, Young, Retired)
  const categoryFoxIds = Object.keys(foxes)
    .filter((foxId) => {
      const f = foxes[foxId];
      if (fox.isRetired) return f.isRetired;
      if (fox.age < 1) return f.age < 1 && !f.isRetired;
      return f.age >= 1 && !f.isRetired;
    })
    .sort((a, b) => parseInt(a) - parseInt(b));

  const currentIndex = categoryFoxIds.indexOf(id as string);
  const prevFoxId = currentIndex > 0 ? categoryFoxIds[currentIndex - 1] : null;
  const nextFoxId =
    currentIndex < categoryFoxIds.length - 1
      ? categoryFoxIds[currentIndex + 1]
      : null;

  const hungry = isHungry(fox);
  const groomed = isGroomed(fox);
  const trained = isTrained(fox);
  const activeBoosts = getActiveBoosts(fox);

  const handleRename = () => {
    if (newName.trim()) {
      if (
        Object.values(foxes).some(
          (f) =>
            f.name.toLowerCase() === newName.toLowerCase() && f.id !== fox.id,
        )
      ) {
        addNotification(
          "This name is already taken by another fox!",
          "destructive",
        );
        return;
      }
      renameFox(fox.id, newName);
      setIsEditing(false);
    }
  };

  const handleReveal = () => applyItem("genetic-test", fox.id);
  const handleAnalyze = () => applyItem("pedigree-analysis", fox.id);

  const handleList = () => {
    listFoxOnMarket(fox.id, listPrice, listCurrency);
    setIsListing(false);
    addNotification("Fox listed on marketplace!", "success");
    router.push("/shop/marketplace");
  };

  const handleRetire = () => {
    if (fox.age < 6) {
      addNotification(
        "Foxes must be at least 6 years old to retire.",
        "destructive",
      );
      return;
    }
    if (confirm("Retire this fox? This cannot be undone.")) {
      retireFox(fox.id);
      router.push("/kennel");
    }
  };

  const handleAlter = () => {
    const actionName = fox.gender === "Dog" ? "neuter" : "spay";
    if (
      confirm(
        `Are you sure you want to ${actionName} ${fox.name}? This cannot be undone and they will no longer be able to breed.`,
      )
    ) {
      spayNeuterFox(fox.id);
      addNotification(`${fox.name} has been ${actionName}ed.`, "success");
    }
  };

  const feedOptions = [
    { id: "supplies", label: "Premium Feed" },
    { id: "feed-head", label: "Cranial Crunch" },
    { id: "feed-topline", label: "Spine Support" },
    { id: "feed-forequarters", label: "Shoulder Strength" },
    { id: "feed-hindquarters", label: "Hip Health" },
    { id: "feed-tail", label: "Brush Boost" },
    { id: "feed-coatQuality", label: "Lustrous Layers" },
    { id: "feed-temperament", label: "Calm Kibble" },
    { id: "feed-presence", label: "Showstopper Snack" },
  ];

  const handleFeed = () => {
    applyItem(selectedFeed, fox.id);
  };

  const handleSetPreferredFeed = (feedId: string) => {
    updateFox(fox.id, { preferredFeed: feedId });
    setSelectedFeed(feedId);
    addNotification("Preferred feed saved!", "success");
  };

  const goToKennel = () => {
    if (fox.age < 1) router.push("/kennel?tab=young");
    else if (fox.isRetired) router.push("/kennel?tab=retired");
    else router.push("/kennel?tab=adult");
  };

  const getStat = (key: keyof typeof fox.stats, bonus = 0) => {
    const base = fox.stats[key];
    const boost = activeBoosts[key] || 0;
    const totalBonus = boost + bonus;
    return { value: base + totalBonus, bonus: totalBonus };
  };

  const groomFox = (fid: string) => {
    applyItem("grooming-kit", fid);
  };
  const trainFox = (fid: string) => {
    applyItem("training-session", fid);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/50 p-4 rounded-3xl border border-border/50">
        <div className="flex items-center gap-2">
          <Button
            onClick={goToKennel}
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-[10px]"
          >
            <ArrowLeft size={16} /> Kennel
          </Button>

          <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

          <div className="flex items-center gap-1">
            <Button
              disabled={!prevFoxId}
              onClick={() => router.push(`/fox/${prevFoxId}`)}
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-xl gap-2 font-black uppercase tracking-widest text-[10px]"
            >
              Prev
            </Button>
            <Button
              disabled={!nextFoxId}
              onClick={() => router.push(`/fox/${nextFoxId}`)}
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-xl gap-2 font-black uppercase tracking-widest text-[10px]"
            >
              Next
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isFoundational && (
            <>
              <Button
                onClick={() => setIsListing(true)}
                variant="outline"
                className="rounded-xl font-black uppercase tracking-widest text-[10px] h-9 border-primary/20 text-primary hover:bg-primary/5"
              >
                Sell Fox
              </Button>

              {fox.gender === "Dog" &&
                fox.age >= 1 &&
                !fox.isAltered &&
                !fox.isRetired && (
                  <Button
                    onClick={() => toggleStudStatus(fox.id, 500)}
                    variant={fox.isAtStud ? "default" : "outline"}
                    className={cn(
                      "rounded-xl font-black uppercase tracking-widest text-[10px] h-9",
                      fox.isAtStud && "bg-primary",
                    )}
                  >
                    {fox.isAtStud ? "Listed at Stud" : "List for Stud"}
                  </Button>
                )}

              <Button
                onClick={handleRetire}
                variant="destructive"
                disabled={fox.age < 6}
                className={cn(
                  "rounded-xl font-black uppercase tracking-widest text-[10px] h-9",
                  fox.age < 6 && "opacity-30 grayscale cursor-not-allowed",
                )}
              >
                Retire
              </Button>

              {!fox.isAltered && !fox.isRetired && (
                <Button
                  onClick={handleAlter}
                  variant="outline"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] h-9 border-destructive/20 text-destructive hover:bg-destructive/5"
                >
                  {fox.gender === "Dog" ? "Neuter" : "Spay"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isListing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <Card className="w-full max-w-md folk-card border-2 border-primary/20 shadow-2xl rounded-[40px] overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest">
                Sell {fox.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 block">
                    Set Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={listPrice}
                      onChange={(e) =>
                        setListPrice(parseInt(e.target.value) || 0)
                      }
                      className="w-full bg-muted border border-border rounded-xl px-4 py-3 font-black text-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {listCurrency === "gold" ? (
                        <Coins size={20} className="text-yellow-600" />
                      ) : (
                        <Diamond size={20} className="text-cyan-600" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 block">
                    Currency
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={listCurrency === "gold" ? "default" : "outline"}
                      onClick={() => setListCurrency("gold")}
                      className="rounded-xl font-black uppercase tracking-widest text-xs"
                    >
                      Gold
                    </Button>
                    <Button
                      variant={listCurrency === "gems" ? "default" : "outline"}
                      onClick={() => setListCurrency("gems")}
                      className="rounded-xl font-black uppercase tracking-widest text-xs"
                    >
                      Gems
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleList}
                  className="flex-1 h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20"
                >
                  List on Market
                </Button>
                <Button
                  onClick={() => setIsListing(false)}
                  variant="ghost"
                  className="flex-1 h-12 font-black uppercase tracking-widest rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Illustration & Quick Stats */}
        <div className="xl:col-span-4 space-y-6">
          <div className="folk-card overflow-hidden bg-card border-2 border-border rounded-[48px] flex flex-col relative shadow-sm">
            <div className="aspect-square flex items-center justify-center p-12 bg-muted/30">
              <FoxIllustration
                phenotype={fox.phenotype}
                baseColor={fox.baseColor}
                pattern={fox.pattern}
                eyeColor={fox.eyeColor}
                size={32}
              />

              {/* Status Badges */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm backdrop-blur-md ${hungry ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-primary/10 border-primary/20 text-primary"}`}
                >
                  <Utensils size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {hungry ? "Hungry" : "Fed"}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm backdrop-blur-md ${!groomed ? "bg-muted/50 border-border/50 text-muted-foreground" : "bg-secondary/10 border-secondary/20 text-secondary"}`}
                >
                  <Sparkles size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {groomed ? "Groomed" : "Rough"}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm backdrop-blur-md ${!trained ? "bg-muted/50 border-border/50 text-muted-foreground" : "bg-orange-500/10 border-orange-500/20 text-orange-500"}`}
                >
                  <Dumbbell size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {trained ? "Trained" : "Idle"}
                  </span>
                </div>
                {fox.isAltered && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-sm backdrop-blur-md bg-purple-500/10 border-purple-500/20 text-purple-600">
                    <ActivityIcon size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Altered
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-border">
              <div className="flex justify-between items-center mb-2">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-2xl font-black p-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none w-full bg-background"
                    />
                    <Button
                      onClick={handleRename}
                      size="sm"
                      className="bg-primary h-10 w-10 p-0 rounded-xl"
                    >
                      <Save size={18} />
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive h-10 w-10 p-0 rounded-xl"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black italic text-foreground tracking-tight uppercase">
                      {fox.name}
                    </h1>
                    {!isFoundational && !fox.hasBeenRenamed && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                )}
                <Badge
                  variant="outline"
                  className={`font-black uppercase tracking-widest ${fox.gender === "Dog" ? "text-blue-500" : "text-rose-500"}`}
                >
                  {fox.gender}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-tight">
                <span>
                  {fox.age === 0
                    ? ["Spring", "Summer"].includes(season)
                      ? "Newborn"
                      : "Juvenile"
                    : fox.age + "y"}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{fox.phenotype}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{fox.eyeColor} Eyes</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          {!isFoundational && (
            <Card className="folk-card border-2 border-border shadow-sm rounded-[32px] overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => groomFox(fox.id)}
                    disabled={groomed}
                    variant="outline"
                    className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 border-secondary/20 hover:bg-secondary/5 hover:text-secondary disabled:opacity-50"
                  >
                    <Sparkles size={14} /> Groom
                  </Button>
                  <Button
                    onClick={() => trainFox(fox.id)}
                    disabled={trained}
                    variant="outline"
                    className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 border-orange-500/20 hover:bg-orange-500/5 hover:text-orange-500 disabled:opacity-50"
                  >
                    <Dumbbell size={14} /> Train
                  </Button>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Button
                      onClick={() => setIsFeedDropdownOpen(!isFeedDropdownOpen)}
                      variant="outline"
                      className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 justify-between px-4 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="truncate">
                        {feedOptions.find((f) => f.id === selectedFeed)?.label}
                      </span>
                      <ChevronDown size={14} />
                    </Button>
                    {isFeedDropdownOpen && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-2xl shadow-xl z-20 max-h-48 overflow-y-auto p-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {feedOptions.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center group"
                          >
                            <button
                              onClick={() => {
                                setSelectedFeed(option.id);
                                setIsFeedDropdownOpen(false);
                              }}
                              className="flex-1 text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary rounded-xl transition-colors"
                            >
                              {option.label}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetPreferredFeed(option.id);
                              }}
                              className={cn(
                                "p-2 mr-1 rounded-lg transition-all",
                                fox.preferredFeed === option.id
                                  ? "text-primary bg-primary/20"
                                  : "text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100",
                              )}
                              title="Set as Preferred"
                            >
                              <Save size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleFeed}
                    disabled={!hungry && selectedFeed === "supplies"}
                    className="h-12 w-12 rounded-2xl bg-primary hover:bg-primary/90 p-0"
                  >
                    <Utensils size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle Column: Stats */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="folk-card border-2 border-border shadow-sm rounded-[48px] overflow-hidden">
            <CardHeader className="bg-muted/30 p-8 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Trophy size={20} />
                </div>
                <CardTitle className="text-xl font-black italic tracking-tight uppercase">
                  Show Performance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <StatBar label="Head" {...getStat("head")} />
                <StatBar label="Topline" {...getStat("topline")} />
                <StatBar label="Forequarters" {...getStat("forequarters")} />
                <StatBar label="Hindquarters" {...getStat("hindquarters")} />
                <StatBar label="Tail" {...getStat("tail")} />
                <StatBar
                  label="Coat Quality"
                  {...getStat("coatQuality", groomed ? 5 : 0)}
                />
                <StatBar
                  label="Temperament"
                  {...getStat("temperament", trained ? 3 : 0)}
                />
                <StatBar
                  label="Presence"
                  {...getStat("presence", trained ? 3 : 0)}
                />
                <StatBar label="Luck" value={fox.stats.luck} />
                <StatBar label="Fertility" value={fox.stats.fertility} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Genetics & History */}
        <div className="xl:col-span-4 space-y-6">
          {/* Genotype Card */}
          <Card className="folk-card border-2 border-border shadow-sm rounded-[40px] overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Dna size={16} />
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest">
                    Genotype
                  </CardTitle>
                </div>
                {!fox.genotypeRevealed && !isFoundational && (
                  <Button
                    onClick={handleReveal}
                    size="sm"
                    variant="ghost"
                    className="text-[10px] font-black uppercase tracking-widest gap-1 hover:text-blue-500 p-0 h-auto"
                  >
                    <ShoppingBag size={12} /> Reveal
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {fox.genotypeRevealed ? (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(fox.genotype).map(([locus, alleles]) => (
                    <GeneticTooltip key={locus} locus={locus} alleles={alleles}>
                      <div className="px-3 py-2 rounded-xl bg-muted/50 border border-border/50 flex justify-between items-center group hover:border-blue-500/30 transition-colors w-full cursor-help">
                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase">
                          {locus}
                        </span>
                        <span className="font-mono text-xs font-black text-foreground">
                          {alleles.join("")}
                        </span>
                      </div>
                    </GeneticTooltip>
                  ))}
                </div>
              ) : (
                <div className="py-8 px-4 bg-muted/30 border-2 border-dashed border-border rounded-2xl text-center">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Genotype Hidden
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health & History */}
          <Card className="folk-card border-2 border-border shadow-sm rounded-[40px] overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-muted-foreground uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                  <ActivityIcon size={14} /> Health
                </h4>
                {fox.healthIssues.length > 0 ? (
                  <div className="space-y-2">
                    {fox.healthIssues.map((issue) => (
                      <Badge
                        key={issue}
                        variant="destructive"
                        className="w-full justify-center h-8 font-black text-[9px] uppercase tracking-widest rounded-lg"
                      >
                        {issue}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3 text-primary">
                    <Check size={16} className="shrink-0" />
                    <span className="text-xs font-black uppercase tracking-widest">
                      Perfect Health
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                  <Calendar size={14} /> History
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Birth Year
                    </span>
                    <span className="text-xs font-black font-mono">
                      {fox.birthYear}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Lifetime Points
                    </span>
                    <span className="text-xs font-black font-mono">
                      {fox.pointsLifetime.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black text-muted-foreground uppercase">
                        COI
                      </span>
                      {!fox.pedigreeAnalyzed && !isFoundational && (
                        <button
                          onClick={handleAnalyze}
                          className="text-xs text-primary hover:underline font-black uppercase tracking-tighter"
                        >
                          Analyze
                        </button>
                      )}
                    </div>
                    <span className="text-xs font-black font-mono">
                      {fox.pedigreeAnalyzed
                        ? `${calculateCOI(fox.id, foxes)}%`
                        : "???"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Width Pedigree at bottom */}
      <Card className="folk-card border-2 border-border shadow-sm rounded-[48px] overflow-hidden">
        <CardHeader className="bg-muted/30 p-8 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                <Heart size={20} />
              </div>
              <CardTitle className="text-xl font-black italic tracking-tight uppercase">
                Ancestry & Pedigree
              </CardTitle>
            </div>
            {fox.pedigreeAnalyzed && (
              <div className="px-4 py-1.5 rounded-full bg-background border border-border shadow-sm text-xs font-black uppercase tracking-widest">
                Inbreeding:{" "}
                <span className="text-rose-500 ml-1">
                  {calculateCOI(fox.id, foxes)}%
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8 overflow-x-auto">
          <div className="min-w-[800px] flex justify-center">
            <PedigreeTree foxId={fox.id} foxes={foxes} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatBar({
  label,
  value,
  bonus = 0,
}: {
  label: string;
  value: number;
  bonus?: number;
}) {
  const maxValue = label === "Fertility" ? 75 : 100;
  const percentage = Math.min(100, (value / maxValue) * 100);
  const baseValue = value - bonus;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="flex items-center gap-1 font-mono text-xs text-foreground">
          {baseValue}
          {bonus > 0 && (
            <span className="text-green-500 font-black">+{bonus}</span>
          )}
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner p-0.5 border border-border/50">
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={maxValue}
          aria-label={label}
          className="h-full bg-primary rounded-full transition-all shadow-[0_0_8px_rgba(var(--primary),0.3)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function PedigreeTree({
  foxId,
  foxes,
  depth = 0,
  defaultName,
}: {
  foxId: string | null;
  foxes: Record<string, Fox>;
  depth?: number;
  defaultName?: string | null;
}) {
  if (depth >= 5) return null;
  const fox = foxId ? foxes[foxId] : null;

  return (
    <div className="flex items-center gap-4">
      <div
        aria-label={
          fox
            ? `Pedigree node: ${fox.name}`
            : defaultName
              ? `Pedigree node: ${defaultName}`
              : "Unknown ancestor"
        }
        className={`w-36 p-3 border-2 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center text-center ${
          fox
            ? "border-border bg-card hover:border-primary/30 group"
            : defaultName
              ? "border-border bg-muted/20"
              : "border-border/30 bg-muted/20 text-muted-foreground/30 italic border-dashed"
        }`}
      >
        {fox ? (
          <Link
            href={`/fox/${fox.id}`}
            className="w-full flex flex-col items-center"
          >
            <div className="font-black text-foreground uppercase tracking-tight truncate w-full text-[10px] group-hover:text-primary transition-colors">
              {fox.name}
            </div>
            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest truncate w-full">
              {fox.phenotype}
            </div>
          </Link>
        ) : defaultName ? (
          <div className="w-full flex flex-col items-center">
            <div className="font-black text-foreground/70 uppercase tracking-tight truncate w-full text-[10px]">
              {defaultName}
            </div>
            <div className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest truncate w-full italic">
              NPC Ancestor
            </div>
          </div>
        ) : (
          <div className="text-[10px] font-black">?</div>
        )}
      </div>

      {depth < 4 && (
        <div className="flex flex-col gap-2 relative">
          <PedigreeTree
            foxId={fox?.parents?.[0] || null}
            foxes={foxes}
            depth={depth + 1}
            defaultName={fox?.parentNames?.[0]}
          />
          <PedigreeTree
            foxId={fox?.parents?.[1] || null}
            foxes={foxes}
            depth={depth + 1}
            defaultName={fox?.parentNames?.[1]}
          />
        </div>
      )}
    </div>
  );
}
