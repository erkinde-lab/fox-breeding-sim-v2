"use client";
import { cn } from "@/lib/utils";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import React, { useState } from "react";
import { useGameStore, Show } from "@/lib/store";
import {
  Trophy,
  History,
  Search,
  Plus,
  Check,
  ChevronRight,
  Settings,
  Trash2,
  Edit2,
  Users,
  Info,
  Sparkles,
  Star,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isFoxEligibleForShow, ShowLevel, Variety } from "@/lib/showing";

export default function ShowsPage() {
  const {
    foxes,
    shows,
    showReports,
    year,
    season,
    joiningYear,
    isAdmin,
    addShow,
    removeShow,
    updateShow,
    enterFoxInShow,
    runShows,
    generateSeasonalShows,
    showVisibilityMode,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<
    "available" | "amateur" | "altered" | "history" | "manage"
  >("available");
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Admin Editing State
  const [editingShowId, setEditingShowId] = useState<string | null>(null);
  const [newShowName, setNewShowName] = useState("");
  const [newShowLevel, setNewShowLevel] = useState<ShowLevel>("Open");
  const [newShowVariety, setNewShowVariety] = useState<Variety>("Red");

  const isAmateurEligible = year <= joiningYear + 1;

  const filteredShows = shows.filter((show) => {
    const isAmateur = show.level.startsWith("Amateur");
    const isAltered = show.level.startsWith("Altered");
    if (activeTab === "amateur" && !isAmateur) return false;
    if (activeTab === "altered" && !isAltered) return false;
    if (activeTab === "available" && (isAmateur || isAltered)) return false;
    return (
      show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).filter((show) => {
    // Filter by visibility mode - only show shows matching current mode
    const isMidweekShow = !show.isWeekend;
    const isWeekendShow = show.isWeekend;
    return showVisibilityMode === "midweek" ? isMidweekShow : isWeekendShow;
  });

  const selectedShow = shows.find((s) => s.id === selectedShowId);
  const eligibleFoxes = selectedShow
    ? Object.values(foxes).filter((f) =>
        isFoxEligibleForShow(
          f,
          selectedShow.level,
          selectedShow.type as Variety,
        ),
      )
    : [];

  const handleAddShow = () => {
    if (!newShowName) return;
    if (editingShowId) {
      updateShow(editingShowId, {
        name: newShowName,
        level: newShowLevel,
        type: newShowVariety,
      });
      setEditingShowId(null);
    } else {
      addShow({
        id: Math.random().toString(36).substring(2, 9),
        name: newShowName,
        level: newShowLevel,
        type: newShowVariety,
        entries: [],
        isRun: false,
      });
    }
    setNewShowName("");
  };

  const handleEditShow = (show: Show) => {
    setEditingShowId(show.id);
    setNewShowName(show.name);
    setNewShowLevel(show.level);
    setNewShowVariety(show.type as Variety);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-5xl font-folksy text-foreground tracking-tight">
            Show Arena
          </h2>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary border-primary/20 font-black px-3 py-1 uppercase tracking-widest text-[10px]"
            >
              Year {year} • {season}
            </Badge>
            {isAmateurEligible && (
              <Badge
                variant="outline"
                className="bg-secondary/5 text-secondary border-secondary/20 font-black px-3 py-1 uppercase tracking-widest text-[10px]"
              >
                Amateur Qualified
              </Badge>
            )}
          </div>
        </div>
        <Button
          onClick={runShows}
          className="gap-3 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-primary/20"
        >
          <Trophy size={18} /> Run All Shows
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <nav className="flex flex-col gap-1">
            {[
              { id: "available", label: "Pro Circuit", icon: Trophy },
              {
                id: "amateur",
                label: "Amateur Arena",
                icon: Users,
                disabled: !isAmateurEligible,
              },
              { id: "altered", label: "Altered Arena", icon: Sparkles },
              { id: "history", label: "Recent Results", icon: History },
              {
                id: "manage",
                label: "Admin: Manage",
                icon: Settings,
                adminOnly: true,
              },
            ].map(
              (tab) =>
                (tab.adminOnly ? isAdmin : true) && (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSelectedShowId(null);
                    }}
                    disabled={tab.disabled}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-2"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      tab.disabled && "opacity-30 cursor-not-allowed grayscale",
                    )}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ),
            )}
          </nav>
        </div>

        <div className="lg:col-span-9">
          {activeTab === "history" ? (
            <div className="space-y-8">
              <h3 className="text-2xl font-black italic text-foreground tracking-tight">
                Show Reports
              </h3>
              {showReports.length === 0 ? (
                <div className="py-20 text-center bg-card rounded-[40px] border-2 border-dashed border-border text-muted-foreground italic">
                  No shows have been run recently.
                </div>
              ) : (
                showReports.map((report, idx) => (
                  <Card
                    key={idx}
                    className="folk-card border-border overflow-hidden"
                  >
                    <CardHeader className="bg-muted/30 pb-3 border-b border-border">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">
                          {report.circuit} Hierarchical Show
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="text-[9px] font-black uppercase bg-background"
                        >
                          {report.season} Y{report.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                      {report.bisFoxId && (
                        <div className="bg-primary/5 rounded-3xl p-6 border-2 border-primary/20 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Trophy size={80} />
                          </div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                            <Star size={12} fill="currentColor" /> Best in Show
                            Winners
                          </h4>
                          <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border border-primary/10">
                              <div>
                                <span className="text-[10px] font-black uppercase text-muted-foreground">
                                  Best in Show
                                </span>
                                <p className="text-xl font-black italic text-primary">
                                  {foxes[report.bisFoxId]?.name}
                                </p>
                              </div>
                              {report.results.find(
                                (r) =>
                                  r.foxId === report.bisFoxId &&
                                  r.title === "BIS",
                              ) && (
                                <span className="text-xs font-black text-muted-foreground">
                                  {
                                    report.results.find(
                                      (r) =>
                                        r.foxId === report.bisFoxId &&
                                        r.title === "BIS",
                                    )?.score
                                  }{" "}
                                  pts
                                </span>
                              )}
                            </div>
                            {report.rbisFoxId && (
                              <div className="flex justify-between items-center bg-background/30 p-4 rounded-2xl border border-primary/5">
                                <div>
                                  <span className="text-[10px] font-black uppercase text-muted-foreground">
                                    Reserve Best in Show
                                  </span>
                                  <p className="text-lg font-black italic text-foreground">
                                    {foxes[report.rbisFoxId]?.name}
                                  </p>
                                </div>
                                {report.results.find(
                                  (r) =>
                                    r.foxId === report.rbisFoxId &&
                                    r.title === "RBIS",
                                ) && (
                                  <span className="text-xs font-black text-muted-foreground">
                                    {
                                      report.results.find(
                                        (r) =>
                                          r.foxId === report.rbisFoxId &&
                                          r.title === "RBIS",
                                      )?.score
                                    }{" "}
                                    pts
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {Array.from(
                        new Set(report.results.map((r) => r.level)),
                      ).map((lvl) => (
                        <div key={lvl} className="space-y-4">
                          <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                            {lvl} Stage Winners
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report.results
                              .filter(
                                (r) =>
                                  r.level === lvl &&
                                  (r.title === "BOS" || r.title === "RBOS"),
                              )
                              .map((res, i) => (
                                <div
                                  key={i}
                                  className="flex justify-between items-center p-3 bg-muted/20 rounded-xl border border-border/50"
                                >
                                  <div>
                                    <span className="text-[8px] font-black uppercase text-muted-foreground">
                                      {res.title}
                                    </span>
                                    <p className="text-sm font-bold">
                                      {foxes[res.foxId]?.name}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] font-bold"
                                  >
                                    {res.score}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}

                      <details className="group">
                        <summary className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-2">
                          View Full Variety Results{" "}
                          <ChevronRight
                            size={10}
                            className="group-open:rotate-90 transition-transform"
                          />
                        </summary>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                          {report.results
                            .filter((r) => r.title === "BOV")
                            .map((res, i) => (
                              <div
                                key={i}
                                className="text-[10px] p-2 bg-muted/10 rounded-lg border border-border/30"
                              >
                                <span className="font-black text-muted-foreground/50 uppercase">
                                  {res.variety}
                                </span>
                                <p className="font-bold truncate">
                                  {foxes[res.foxId]?.name}
                                </p>
                              </div>
                            ))}
                        </div>
                      </details>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : activeTab === "manage" ? (
            <div className="space-y-8">
              <Card className="folk-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-black italic tracking-tight uppercase">
                    {editingShowId ? "Edit Show" : "New Show"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newShowName}
                        onChange={(e) => setNewShowName(e.target.value)}
                        className="w-full bg-muted/50 border border-border p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Show Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground">
                        Level
                      </label>
                      <select
                        value={newShowLevel}
                        onChange={(e) => setNewShowLevel(e.target.value as any)}
                        className="w-full bg-muted/50 border border-border p-3 rounded-xl"
                      >
                        {[
                          "Junior",
                          "Open",
                          "Senior",
                          "Championship",
                          "Amateur Junior",
                          "Amateur Open",
                          "Amateur Senior",
                          "Altered Junior",
                          "Altered Open",
                          "Altered Senior",
                        ].map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground">
                        Variety
                      </label>
                      <select
                        value={newShowVariety}
                        onChange={(e) =>
                          setNewShowVariety(e.target.value as any)
                        }
                        className="w-full bg-muted/50 border border-border p-3 rounded-xl"
                      >
                        {[
                          "Red",
                          "Gold",
                          "Silver",
                          "Cross",
                          "Exotic",
                          "White Mark",
                        ].map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddShow}
                      className="flex-1 h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl"
                    >
                      {editingShowId ? "Update" : "Create"}
                    </Button>
                    {editingShowId && (
                      <Button
                        onClick={() => {
                          setEditingShowId(null);
                          setNewShowName("");
                        }}
                        variant="outline"
                        className="h-14 px-8 rounded-2xl"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black italic">Active Shows</h3>
                  <Button
                    variant="outline"
                    onClick={generateSeasonalShows}
                    size="sm"
                    className="font-black uppercase tracking-widest text-[10px] h-8 rounded-lg border-primary/20 text-primary"
                  >
                    Reset to Defaults
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shows.map((s) => (
                    <Card key={s.id} className="folk-card border-border group">
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-bold">{s.name}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="text-[8px] uppercase"
                            >
                              {s.level}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[8px] uppercase"
                            >
                              {s.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditShow(s)}
                            className="text-primary"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeShow(s.id)}
                            className="text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-8 space-y-6">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-card border border-border pl-10 pr-4 py-3 rounded-2xl"
                  />
                </div>
                <div className="space-y-3">
                  {filteredShows.length === 0 ? (
                    <div className="py-20 text-center bg-card/50 rounded-[32px] border-2 border-dashed border-border text-muted-foreground italic">
                      No shows found.
                    </div>
                  ) : (
                    filteredShows.map((show) => (
                      <Card
                        key={show.id}
                        className={cn(
                          "folk-card border-2 transition-all cursor-pointer",
                          selectedShowId === show.id
                            ? "border-primary bg-primary/5 -translate-y-1"
                            : "border-border hover:border-border/80",
                        )}
                        onClick={() => setSelectedShowId(show.id)}
                      >
                        <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "p-3 rounded-2xl",
                                selectedShowId === show.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <Trophy size={20} />
                            </div>
                            <div>
                              <h4 className="font-black italic text-lg tracking-widest uppercase">
                                {show.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className="text-[9px] font-bold uppercase"
                                >
                                  {show.level}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] font-bold uppercase"
                                >
                                  {show.type}
                                </Badge>
                                <span className="text-[10px] font-black text-muted-foreground/40 uppercase ml-2">
                                  {show.entries.length} Entries
                                </span>
                                {show.isWeekend && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-orange-100 text-orange-700 text-[8px] font-black border-none"
                                  >
                                    WEEKEND
                                  </Badge>
                                )}
                                {!show.isWeekend && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-700 text-[8px] font-black border-none"
                                  >
                                    MIDWEEK
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            size={20}
                            className={cn(
                              "text-muted-foreground transition-transform",
                              selectedShowId === show.id &&
                                "translate-x-1 text-primary",
                            )}
                          />
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
              <div className="xl:col-span-4">
                {selectedShow ? (
                  <Card className="folk-card border-2 border-primary/20 shadow-xl sticky top-24 !overflow-visible">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                      <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">
                        Enter {selectedShow.type} ({selectedShow.level})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      {selectedShow.level === "Championship" && (
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-2 mb-2">
                          <Info
                            size={14}
                            className="text-blue-600 shrink-0 mt-0.5"
                          />
                          <p className="text-[10px] text-blue-700 leading-relaxed font-bold">
                            Qualification Required: 16 pts this year or a major
                            win (BIS/RBIS).
                          </p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {eligibleFoxes.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic p-4 bg-muted/30 rounded-xl border border-dashed border-border text-center leading-relaxed">
                            No qualified foxes found.
                          </p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {eligibleFoxes.map((fox) => {
                              const isEntered = selectedShow.entries.includes(
                                fox.id,
                              );
                              return (
                                <button
                                  key={fox.id}
                                  onClick={() =>
                                    enterFoxInShow(fox.id, selectedShow.id)
                                  }
                                  className={cn(
                                    "flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left overflow-visible relative",
                                    isEntered
                                      ? "bg-green-500/10 border-green-500/30 text-green-700"
                                      : "bg-card border-border hover:border-primary/50 hover:bg-primary/5",
                                  )}
                                >
                                  <div className="flex flex-col">
                                    <span className="text-sm font-black italic">
                                      {fox.name}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <ScoreBreakdown fox={fox}>
                                        <Info
                                          size={10}
                                          className="text-primary cursor-help"
                                        />
                                      </ScoreBreakdown>
                                      <span className="text-[9px] font-bold text-muted-foreground uppercase">
                                        View Stats Breakdown
                                      </span>
                                    </div>
                                  </div>
                                  {isEntered ? (
                                    <Check size={14} />
                                  ) : (
                                    <Plus size={14} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center bg-card rounded-[32px] border-2 border-dashed border-border text-muted-foreground p-8 text-center sticky top-24">
                    <Trophy size={48} className="opacity-10 mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">
                      Select a show
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
