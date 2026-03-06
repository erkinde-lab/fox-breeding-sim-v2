"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Users,
  Coins,
  Settings,
  History,
  Database,
  TrendingUp,
  Megaphone,
  MessageSquare,
  Trash2,
  Plus,
  Package,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { useNotifications } from "@/components/NotificationProvider";

const BANNER_URLS = [
  {
    name: "Classic Fox",
    url: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Forest Mist",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Winter Den",
    url: "https://images.unsplash.com/photo-1483356256511-b48749959172?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Golden Field",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Night Prowl",
    url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function AdminPanel() {
  const { showNotification, addNotification } = useNotifications();
  const router = useRouter();

  const {
    isAdmin,
    members,
    gold,
    gems,
    foxes,
    adminLogs,
    warnMember,
    banMember,
    adminSetCurrency,
    setBroadcast,
    broadcast,
    bannerUrl,
    bannerYPosition,
    setBannerUrl,
    setBannerYPosition,
    news,
    addNews,
    deleteNews,
    forumPosts,
    deleteForumPost,
    deleteForumReply,
    showConfig,
    setShowConfig,
    adminUpdateMemberInventory,
    resetGame,
    season,
    year,
    hiredGroomer,
    hiredVeterinarian,
    hiredTrainer,
    hiredGeneticist,
    hiredNutritionist,
  } = useGameStore();

  const [broadcastInput, setBroadcastInput] = useState(broadcast || "");
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsCategory, setNewsCategory] = useState("Update");

  const [targetMemberId, setTargetMemberId] = useState(members[0]?.id || "");
  const [itemToAdd, setItemToAdd] = useState("gene_test");
  const [itemCount, setItemCount] = useState(1);

  const [editingLevel, setEditingLevel] = useState<string | null>(null);
  const [prizeForm, setPrizeForm] = useState({
    bis: { amount: 0, currency: "gold" },
    rbis: { amount: 0, currency: "gold" },
    bov: { amount: 0, currency: "gold" },
    rbov: { amount: 0, currency: "gold" },
    bos: { amount: 0, currency: "gold" },
    rbos: { amount: 0, currency: "gold" },
    boc: { amount: 0, currency: "gold" },
    rboc: { amount: 0, currency: "gold" },
  });

  const hasAccess = isAdmin || process.env.NODE_ENV === "development";

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-card rounded-[3rem] border-2 border-dashed border-border">
        <div className="p-6 bg-destructive/10 rounded-full text-destructive mb-6">
          <Shield size={64} />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight uppercase italic">
          Access Denied
        </h1>
        <p className="text-muted-foreground mt-2 font-medium max-w-sm">
          You must be an administrator to view this page.
        </p>
        <Button
          className="mt-8 bg-foreground text-background font-black uppercase tracking-widest px-8 rounded-xl h-12"
          onClick={() => (window.location.href = "/")}
        >
          Return Home
        </Button>
      </div>
    );
  }

  const handleUpdateBroadcast = () => {
    setBroadcast(broadcastInput || null);
    addNotification("Global broadcast updated successfully.", "success");
  };

  const handlePostNews = () => {
    if (!newsTitle || !newsContent) {
      addNotification("Please fill in both title and content.", "error");
      return;
    }
    addNews(newsTitle, newsContent, newsCategory);
    setNewsTitle("");
    setNewsContent("");
    addNotification("News item published to the feed.", "success");
  };

  const handleBanMember = (id: string, name: string) => {
    showNotification({
      title: "Confirm Ban",
      message: `Are you sure you want to ban ${name}?`,
      type: "destructive",
      confirmLabel: "Ban Member",
      onConfirm: () => {
        banMember(id);
        addNotification(`${name} has been banned.`, "destructive");
      },
    });
  };

  const handleEditPrizes = (level: string) => {
    const config = showConfig[level];
    setPrizeForm({
      bis: { amount: config.bis, currency: "gold" },
      rbis: { amount: config.rbis, currency: "gold" },
      bov: { amount: config.bov, currency: "gold" },
      rbov: { amount: config.rbov, currency: "gold" },
      bos: { amount: config.bos, currency: "gold" },
      rbos: { amount: config.rbos, currency: "gold" },
      boc: { amount: config.boc, currency: "gold" },
      rboc: { amount: config.rboc, currency: "gold" },
    });
    setEditingLevel(level);
  };

  const handleSavePrizes = () => {
    if (!editingLevel) return;
    const updatedConfig = {
      ...showConfig,
      [editingLevel]: {
        bis: prizeForm.bis.amount,
        rbis: prizeForm.rbis.amount,
        bov: prizeForm.bov.amount,
        rbov: prizeForm.rbov.amount,
        bos: prizeForm.bos.amount,
        rbos: prizeForm.rbos.amount,
        boc: prizeForm.boc.amount,
        rboc: prizeForm.rboc.amount,
      },
    };
    setShowConfig(updatedConfig);
    addNotification(
      `${editingLevel} prize tiers updated successfully`,
      "success",
    );
    setEditingLevel(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-border/50 border-dashed">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="px-3 py-1 border-fire-200 text-fire-600 bg-fire-50 font-black uppercase tracking-[0.2em] text-[10px]"
          >
            System Administration
          </Badge>
          <h1 className="text-5xl font-black text-foreground tracking-tighter flex items-center gap-4 italic">
            <Shield className="text-primary" size={48} /> Command{" "}
            <span className="text-primary">Center</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Manage simulation state and oversee game health.
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-8">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="bg-card p-1.5 rounded-2xl border-2 border-border shadow-sm flex w-max sm:w-full">
            <TabsTrigger
              value="dashboard"
              className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"
            >
              <TrendingUp size={14} /> Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="comms"
              className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"
            >
              <Megaphone size={14} /> Comms
            </TabsTrigger>
            <TabsTrigger
              value="moderation"
              className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"
            >
              <Shield size={14} /> Moderation
            </TabsTrigger>
            <TabsTrigger
              value="economy"
              className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"
            >
              <Coins size={14} /> Economy
            </TabsTrigger>
            <TabsTrigger
              value="kennel"
              className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"
            >
              <Package size={14} /> Kennel
            </TabsTrigger>
            <TabsTrigger
              value="danger"
              className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground rounded-xl transition-all"
            >
              <AlertTriangle size={14} /> Danger
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="dashboard"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="folk-card p-10 text-center border-moss-100 bg-moss-50/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700">
                <History size={120} />
              </div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest relative z-10">
                Total Fox Population
              </p>
              <h2 className="text-6xl font-black text-foreground mt-4 tracking-tighter relative z-10 italic">
                {Object.keys(foxes).length}
              </h2>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-moss-100 rounded-full text-moss-700 font-black text-[10px] uppercase tracking-widest relative z-10">
                <TrendingUp size={12} /> Stable Growth
              </div>
            </Card>

            <Card className="folk-card p-10 text-center border-amber-100 bg-amber-50/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700">
                <Coins size={120} />
              </div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest relative z-10">
                Economic Velocity
              </p>
              <h2 className="text-6xl font-black text-foreground mt-4 tracking-tighter relative z-10 italic">
                {Math.floor(gold / 1000)}k
              </h2>
              <p className="text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-widest relative z-10">
                Total Circulating Gold
              </p>
            </Card>

            <Card className="folk-card p-10 text-center border-fire-100 bg-fire-50/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700">
                <Shield size={120} />
              </div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest relative z-10">
                Active Reports
              </p>
              <h2 className="text-6xl font-black text-destructive mt-4 tracking-tighter relative z-10 italic">
                {Object.values(members).reduce(
                  (acc, m) => acc + (m.warnings?.length || 0),
                  0,
                )}
              </h2>
              <p className="text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-widest relative z-10 italic">
                Community Oversight
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="folk-card border-cyan-100 bg-cyan-50/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                  <Database className="text-cyan-600" size={24} /> System Health
                </CardTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Monitor and manage the global simulation state.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-4 bg-card border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Store Version
                    </span>
                    <Badge className="bg-cyan-500 border-none font-black px-3">
                      v7.0.0
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-card border border-border rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      Genetic API
                    </span>
                    <Badge className="bg-foreground text-background border-none font-black px-3">
                      v2.4-STABLE
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-2 border-cyan-200 text-cyan-700 font-black uppercase tracking-widest h-14 rounded-2xl hover:bg-cyan-50"
                  onClick={() => {
                    addNotification(
                      "State persistence refreshed successfully",
                      "success",
                    );
                    setTimeout(() => window.location.reload(), 1000);
                  }}
                >
                  Refresh State Persistence
                </Button>
              </CardContent>
            </Card>

            <Card className="folk-card border-cyan-100 bg-cyan-50/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                  <TrendingUp className="text-cyan-600" size={24} /> Game State
                  Info
                </CardTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Current game state information.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-card border border-border rounded-xl">
                    <span className="text-sm font-bold text-foreground">
                      Current Season
                    </span>
                    <Badge className="bg-cyan-500 border-none font-black px-3">
                      {season} Y{year}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card border border-border rounded-xl">
                    <span className="text-sm font-bold text-foreground">
                      Staff Hired
                    </span>
                    <Badge className="bg-cyan-500 border-none font-black px-3">
                      {
                        [
                          hiredGroomer,
                          hiredVeterinarian,
                          hiredTrainer,
                          hiredGeneticist,
                          hiredNutritionist,
                        ].filter(Boolean).length
                      }
                      /5
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="folk-card">
            <CardHeader className="border-b border-border pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-black italic">
                  Security Audit Log
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  Recent administrative actions.
                </p>
              </div>
              <History className="text-muted-foreground/20" size={32} />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {adminLogs.length === 0 ? (
                  <div className="p-20 text-center">
                    <p className="text-muted-foreground font-bold italic">
                      No administrative logs currently recorded.
                    </p>
                  </div>
                ) : (
                  adminLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-6 flex items-start gap-6 hover:bg-muted/10 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-foreground uppercase italic tracking-tight">
                            {log.action}
                          </span>
                          <span className="text-[9px] font-bold text-muted-foreground/50 bg-muted px-2 py-0.5 rounded-md uppercase">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mt-1">
                          {log.details}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="comms"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="folk-card border-fire-100 bg-fire-50/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                  <Megaphone className="text-fire-600" size={24} /> Global
                  Broadcast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <textarea
                  className="w-full p-4 bg-card border-2 border-border rounded-[2rem] h-32 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner"
                  placeholder="Enter broadcast message..."
                  value={broadcastInput}
                  onChange={(e) => setBroadcastInput(e.target.value)}
                />
                <Button
                  onClick={handleUpdateBroadcast}
                  className="w-full font-black uppercase tracking-widest h-14 rounded-2xl shadow-lg"
                >
                  Update Live Broadcast
                </Button>
              </CardContent>
            </Card>

            <Card className="folk-card border-info/30 bg-info/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                  <Package className="text-purple-600" size={24} /> Site-Wide
                  Banner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BANNER_URLS.map((b) => (
                    <button
                      key={b.name}
                      onClick={() => {
                        setBannerUrl(b.url);
                        addNotification(
                          `Site banner changed to ${b.name}`,
                          "success",
                        );
                      }}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${bannerUrl === b.url ? "border-primary shadow-md scale-[0.98]" : "border-transparent opacity-70 hover:opacity-100"}`}
                    >
                      <img
                        src={b.url}
                        alt={b.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-info">
                        Vertical Position
                      </label>
                      <span className="text-xs text-muted-foreground">{bannerYPosition}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={parseInt(bannerYPosition)}
                      onChange={(e) => {
                        const newPos = `${e.target.value}%`;
                        console.log(`Banner Y position changing from ${bannerYPosition} to ${newPos}`);
                        setBannerYPosition(newPos);
                      }}
                      className="w-full h-2 bg-info/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="folk-card border-info/30 bg-gems/5/10">

              <CardHeader className="pb-2">

                <CardTitle className="text-2xl font-black italic flex items-center gap-3">

                  <Database className="text-info" size={24} /> System Health

                </CardTitle>

                <p className="text-xs text-muted-foreground font-medium">Monitor and manage the global simulation state.</p>

              </CardHeader>

              <CardContent className="space-y-4 pt-4">

                <div className="space-y-2">

                  <div className="flex justify-between items-center p-4 bg-card border border-border rounded-2xl">

                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Store Version</span>

                    <Badge variant="info" className="border-none font-black px-3">v7.0.0</Badge>

                  </div>

                  <div className="flex justify-between items-center p-4 bg-card border border-border rounded-2xl">

                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Genetic API</span>

                    <Badge className="bg-foreground text-background border-none font-black px-3">v2.4-STABLE</Badge>

                  </div>

                </div>

                <Button variant="outline" className="w-full border-2 border-gems/50 text-gems font-black uppercase tracking-widest h-14 rounded-2xl hover:bg-gems/5">

                  Refresh State Persistence

                </Button>

              </CardContent>
            </Card>
          </div>

          <Card className="folk-card overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border">
              <CardTitle className="text-3xl font-black italic">
                Publish Game Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <input
                    className="w-full p-4 bg-muted/20 border-2 border-border rounded-2xl font-bold outline-none"
                    placeholder="Article Title"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <select
                    className="w-full p-4 bg-muted/20 border-2 border-border rounded-2xl font-bold outline-none"
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                  >
                    <option>Update</option>
                    <option>Announcement</option>
                    <option>Engine</option>
                    <option>Event</option>
                  </select>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <textarea
                    className="w-full p-6 bg-muted/20 border-2 border-border rounded-[2.5rem] h-48 font-medium outline-none"
                    placeholder="Content Body"
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={handlePostNews}
                className="w-full md:w-auto px-12 font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl"
              >
                Publish Update <Plus className="ml-2" size={18} />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="moderation"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="folk-card lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Package className="text-moss-600" /> Inventory Editor
                </CardTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Directly manipulate player inventories.
                </p>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Target Member
                  </label>
                  <select
                    className="w-full p-3 bg-muted/30 border border-border rounded-xl font-bold text-sm"
                    value={targetMemberId}
                    onChange={(e) => setTargetMemberId(e.target.value)}
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Item to Add
                  </label>
                  <select
                    className="w-full p-3 bg-muted/30 border border-border rounded-xl font-bold text-sm"
                    value={itemToAdd}
                    onChange={(e) => setItemToAdd(e.target.value)}
                  >
                    <option value="gene_test">Genetic Test</option>
                    <option value="stat_boost">Vitamins (Stat Boost)</option>
                    <option value="premium_feed">Premium Feed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 bg-muted/30 border border-border rounded-xl font-bold"
                    value={itemCount}
                    onChange={(e) => setItemCount(parseInt(e.target.value))}
                  />
                </div>
                <Button
                  className="w-full font-black uppercase tracking-widest h-12 rounded-xl mt-2 shadow-lg"
                  onClick={() => {
                    adminUpdateMemberInventory(
                      targetMemberId,
                      itemToAdd,
                      itemCount,
                    );
                    addNotification(
                      `Added ${itemCount} items to inventory.`,
                      "success",
                    );
                  }}
                >
                  Inject Items
                </Button>
              </CardContent>
            </Card>

            <Card className="folk-card lg:col-span-2 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        Member
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        Status
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-2xl ${member.avatarColor} shadow-inner`}
                            />
                            <div>
                              <span className="font-black text-foreground block tracking-tight">
                                {member.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          {member.isBanned ? (
                            <Badge
                              variant="destructive"
                              className="font-black px-3"
                            >
                              BANNED
                            </Badge>
                          ) : (member.warnings?.length || 0) > 0 ? (
                            <Badge
                              variant="outline"
                              className="text-amber-600 border-amber-200 bg-amber-50 font-black px-3 uppercase text-[10px]"
                            >
                              WARNED ({member.warnings.length})
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-moss-600 border-moss-200 bg-moss-50 font-black px-3 uppercase text-[10px]"
                            >
                              ACTIVE
                            </Badge>
                          )}
                        </td>
                        <td className="p-6 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] font-black uppercase tracking-widest px-4 border-2 rounded-xl"
                            onClick={() => {
                              showNotification({
                                title: "Issue Warning",
                                message: `Enter reason for warning ${member.name}:`,
                                showInput: true,
                                onConfirm: (reason) => {
                                  warnMember(
                                    member.id,
                                    reason || "Admin warning.",
                                  );
                                  addNotification("Warning issued.", "warning");
                                },
                              });
                            }}
                          >
                            Warn
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="text-[10px] font-black uppercase tracking-widest px-4 rounded-xl"
                            onClick={() =>
                              handleBanMember(member.id, member.name)
                            }
                            disabled={member.isBanned}
                          >
                            Ban
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <Card className="folk-card">
            <CardHeader className="border-b border-border pb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-black italic">
                  Forum Moderation
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  Regulate public discussions and remove harmful content.
                </p>
              </div>
              <MessageSquare className="text-muted-foreground/20" size={32} />
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {forumPosts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground font-bold italic">
                    No forum activity currently recorded.
                  </p>
                </div>
              ) : (
                forumPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-6 border-2 border-border rounded-[2rem] space-y-4 bg-muted/5 group hover:border-primary/20 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-black text-foreground italic">
                          "{post.title}"
                        </h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          By <span className="text-primary">{post.author}</span>{" "}
                          • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-muted-foreground/30 hover:text-destructive rounded-full p-2"
                        onClick={() => {
                          showNotification({
                            title: "Delete Post",
                            message:
                              "Are you sure? All replies will also be permanently removed.",
                            type: "destructive",
                            onConfirm: () => deleteForumPost(post.id),
                          });
                        }}
                      >
                        <Trash2 size={22} />
                      </Button>
                    </div>
                    <div className="p-4 bg-card border border-border rounded-2xl italic text-muted-foreground text-sm shadow-inner">
                      "{post.content}"
                    </div>
                    {post.replies && post.replies.length > 0 && (
                      <div className="mt-4 pl-6 space-y-3 border-l-2 border-dashed border-border">
                        {post.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm"
                          >
                            <div>
                              <span className="font-black text-xs text-foreground mr-2">
                                {reply.author}:
                              </span>
                              <span className="text-sm text-muted-foreground font-medium">
                                {reply.content}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground/30 hover:text-destructive"
                              onClick={() =>
                                deleteForumReply(post.id, reply.id)
                              }
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="economy"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="folk-card border-amber-100 bg-amber-50/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                  <Coins className="text-amber-600" size={24} /> Currency
                  Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-card border-2 border-amber-100 rounded-2xl text-center">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">
                      Gold Supply
                    </p>
                    <p className="text-2xl font-black text-amber-600">
                      {gold.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-card border-2 border-cyan-100 rounded-2xl text-center">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">
                      Gem Supply
                    </p>
                    <p className="text-2xl font-black text-cyan-600">
                      {gems.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-amber-200 text-amber-700 font-black uppercase tracking-widest h-12 rounded-xl"
                    onClick={() => adminSetCurrency({ gold: gold + 100000 })}
                  >
                    +100k Gold
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-cyan-200 text-cyan-700 font-black uppercase tracking-widest h-12 rounded-xl"
                    onClick={() => adminSetCurrency({ gems: gems + 1000 })}
                  >
                    +1k Gems
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="folk-card border-fire-100 bg-fire-50/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                  <Trophy className="text-fire-600" size={24} /> Show Prize
                  Tiers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(showConfig).map(([level, config]) => (
                    <div
                      key={level}
                      className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl group hover:bg-primary/10 hover:border-primary transition-all cursor-pointer"
                    >
                      <div>
                        <span className="font-black text-foreground block uppercase text-xs">
                          {level} Circuit
                        </span>
                        <div className="flex gap-3 mt-1 text-[10px] font-bold text-muted-foreground uppercase">
                          <span>BIS: {config.bis}g</span>
                          <span>RBIS: {config.rbis}g</span>
                          <span>BOV: {config.bov}g</span>
                          <span>RBOV: {config.rbov}g</span>
                          <span>BOS: {config.bos}g</span>
                          <span>RBOS: {config.rbos}g</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-8 w-8 p-0 hover:text-primary"
                        onClick={() => handleEditPrizes(level)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="kennel"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8"
        >
          <div className="space-y-12 pb-20">
            <div className="flex flex-col justify-between items-start gap-4">
              <div>
                <h2
                  className="text-5xl font-folksy text-foreground tracking-tight flex items-center gap-4"
                  style={{ fontWeight: 400 }}
                >
                  <Shield className="text-primary" size={40} /> NPC Kennel Admin
                </h2>
                <p className="text-muted-foreground mt-2">
                  Historical archive of all NPC studs and foundation foxes
                </p>
              </div>
            </div>

            {(() => {
              const foundationFoxes = Object.values(foxes).filter(
                (fox) => fox.ownerId === "player-0" && fox.isFoundation,
              );
              const npcStuds = Object.values(foxes).filter(
                (fox) => fox.ownerId === "player-0" && !fox.isFoundation,
              );

              return (
                <>
                  {foundationFoxes.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Package className="text-green-600" size={24} />
                        <h3
                          className="text-3xl font-folksy text-foreground tracking-tight"
                          style={{ fontWeight: 400 }}
                        >
                          Foundation Foxes ({foundationFoxes.length})
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {foundationFoxes.map((fox) => (
                          <div
                            key={fox.id}
                            className="folk-card border-2 border-green-200 bg-green-50/30 shadow-sm rounded-[32px] overflow-hidden bg-card p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                  {fox.phenotype.split(" ")[0]}
                                </div>
                                <div>
                                  <h4 className="font-black text-lg text-foreground">
                                    {fox.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground font-medium">
                                    {fox.phenotype}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                  Gender
                                </p>
                                <p className="font-bold text-foreground">
                                  {fox.gender}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                  Age
                                </p>
                                <p className="font-bold text-foreground">
                                  {fox.age}y
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {npcStuds.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Users className="text-primary" size={24} />
                        <h3
                          className="text-3xl font-folksy text-foreground tracking-tight"
                          style={{ fontWeight: 400 }}
                        >
                          Historical NPC Studs ({npcStuds.length})
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {npcStuds.slice(0, 12).map((npc) => (
                          <div
                            key={npc.id}
                            className="folk-card border-2 border-border shadow-sm rounded-[32px] overflow-hidden bg-card cursor-pointer hover:shadow-lg transition-shadow p-6"
                            onClick={() => router.push(`/fox/${npc.id}`)}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                  {npc.phenotype.split(" ")[0]}
                                </div>
                                <div>
                                  <h4 className="font-black text-lg text-foreground">
                                    {npc.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground font-medium">
                                    {npc.phenotype}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-primary/10 border-primary/20 text-primary"
                              >
                                NPC Stud
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                  Gender
                                </p>
                                <p className="font-bold text-foreground">
                                  {npc.gender}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                  Stud Fee
                                </p>
                                <p className="font-bold text-foreground flex items-center gap-1">
                                  <Coins size={12} /> {npc.studFee}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </TabsContent>

        <TabsContent
          value="danger"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="max-w-2xl mx-auto">
            <Card className="folk-card border-destructive-100 bg-destructive-50/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                  <Trash2 className="text-destructive-600" size={24} /> Reset
                  Game State
                </CardTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Reset the entire game to Year Zero / New Game state. This
                  action cannot be undone.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="p-4 bg-destructive-50 border border-destructive-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="text-destructive-600 mt-0.5 flex-shrink-0"
                      size={16}
                    />
                    <div>
                      <p className="text-sm font-bold text-destructive-700">
                        Warning: This will permanently delete:
                      </p>
                      <ul className="text-sm text-destructive-600 mt-2 space-y-1">
                        <li>• All foxes in your kennel</li>
                        <li>• All gold and gems</li>
                        <li>• All inventory items</li>
                        <li>• All progress and achievements</li>
                        <li>• All show reports and history</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    showNotification({
                      title: "Confirm Game Reset",
                      message:
                        'Are you absolutely sure you want to reset the entire game? This will delete ALL progress and cannot be undone. Type "RESET" to confirm.',
                      type: "destructive",
                      confirmLabel: "Reset Game",
                      showInput: true,
                      inputPlaceholder: 'Type "RESET" to confirm',
                      onConfirm: (confirmation) => {
                        if (confirmation === "RESET") {
                          resetGame();
                          addNotification(
                            "Game has been reset to Year Zero.",
                            "destructive",
                          );
                        } else {
                          addNotification("Game reset cancelled.", "error");
                        }
                      },
                    });
                  }}
                  className="w-full bg-destructive hover:bg-destructive/90 font-black uppercase tracking-widest h-14 rounded-2xl shadow-lg"
                >
                  Reset to Year Zero
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Prize Editing Modal */}
      {editingLevel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border-2 border-border rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-foreground mb-6">
              Edit {editingLevel} Circuit Prizes
            </h3>

            <div className="space-y-4">
              {Object.entries(prizeForm).map(([position, prize]) => {
                const positionLabels: Record<string, string> = {
                  bis: "BIS",
                  rbis: "RBIS",
                  bov: "BOV",
                  rbov: "RBOV",
                  bos: "BOS",
                  rbos: "RBOS",
                  boc: "Best of Category",
                  rboc: "Reserve Best of Category",
                };

                return (
                  <div
                    key={position}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl"
                  >
                    <span className="font-black text-foreground uppercase text-sm w-20">
                      {positionLabels[position]}
                    </span>
                    <input
                      type="number"
                      value={prize.amount}
                      onChange={(e) =>
                        setPrizeForm((prev) => ({
                          ...prev,
                          [position]: {
                            ...prev[position as keyof typeof prizeForm],
                            amount: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      className="flex-1 p-3 bg-card border border-border rounded-xl font-bold"
                      placeholder="Amount"
                    />
                    <select
                      value={prize.currency}
                      onChange={(e) =>
                        setPrizeForm((prev) => ({
                          ...prev,
                          [position]: {
                            ...prev[position as keyof typeof prizeForm],
                            currency: e.target.value,
                          },
                        }))
                      }
                      className="p-3 bg-card border border-border rounded-xl font-bold"
                    >
                      <option value="gold">Gold</option>
                      <option value="gems">Gems</option>
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleSavePrizes}
                className="flex-1 font-black uppercase tracking-widest"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingLevel(null)}
                className="flex-1 font-black uppercase tracking-widest"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
