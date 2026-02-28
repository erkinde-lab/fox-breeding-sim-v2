"use client";
import { cn } from "@/lib/utils";

import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Coins,
  ShoppingCart,
  Zap,
  Shield,
  Sparkles,
  Moon,
  Sun,
  Wind,
  Heart,
  Microscope,
  Pill,
  Calculator,
  Package,
  LayoutGrid,
  Utensils,
} from "lucide-react";

const SPECIALTY_ITEMS = [
  {
    id: "genetic-test",
    name: "Genetic Test",
    description: "Reveals the full genotype of a fox.",
    price: 500,
    currency: "gold" as const,
    icon: <Microscope className="w-8 h-8 text-blue-500" />,
  },
  {
    id: "medicine",
    name: "Medicine",
    description: "Helps manage health issues and complications.",
    price: 200,
    currency: "gold" as const,
    icon: <Pill className="w-8 h-8 text-red-500" />,
  },
  {
    id: "calculator-access",
    name: "Breeding Calculator",
    description: "Unlock the ability to predict breeding outcomes.",
    price: 1000,
    currency: "gold" as const,
    icon: <Calculator className="w-8 h-8 text-purple-500" />,
  },
  {
    id: "pedigree-analysis",
    name: "Pedigree Analysis",
    description:
      "Calculate and reveal the Inbreeding Coefficient (COI) of a fox.",
    price: 750,
    currency: "gold" as const,
    icon: <Heart className="w-8 h-8 text-pink-500" />,
  },
];

const SPECIALTY_FEEDS = [
  {
    id: "feed-head",
    name: "Cranial Crunch",
    stat: "Head",
    icon: <Zap className="w-8 h-8" />,
    color: "blue",
  },
  {
    id: "feed-topline",
    name: "Spine Support",
    stat: "Topline",
    icon: <Shield className="w-8 h-8" />,
    color: "indigo",
  },
  {
    id: "feed-forequarters",
    name: "Stout Shoulder",
    stat: "Forequarters",
    icon: <Zap className="w-8 h-8" />,
    color: "cyan",
  },
  {
    id: "feed-hindquarters",
    name: "Hip Health",
    stat: "Hindquarters",
    icon: <Zap className="w-8 h-8" />,
    color: "teal",
  },
  {
    id: "feed-tail",
    name: "Brush Boost",
    stat: "Tail",
    icon: <Wind className="w-8 h-8" />,
    color: "emerald",
  },
  {
    id: "feed-coatQuality",
    name: "Silk Coat",
    stat: "Coat Quality",
    icon: <Sparkles className="w-8 h-8" />,
    color: "amber",
  },
  {
    id: "feed-temperament",
    name: "Calm Kibble",
    stat: "Temperament",
    icon: <Moon className="w-8 h-8" />,
    color: "purple",
  },
  {
    id: "feed-presence",
    name: "Star Power",
    stat: "Presence",
    icon: <Sun className="w-8 h-8" />,
    color: "orange",
  },
  {
    id: "feed-luck",
    name: "Fortune Flakes",
    stat: "Luck",
    icon: <Sparkles className="w-8 h-8" />,
    color: "yellow",
  },
  {
    id: "feed-fertility",
    name: "Breeder's Blend",
    stat: "Fertility",
    icon: <Heart className="w-8 h-8" />,
    color: "rose",
  },
];

export default function SuppliesPage() {
  const { gold, inventory, buyItem } = useGameStore();
  const [activeTab, setActiveTab] = useState<"all" | "feeds" | "items">("all");

  const tabs = [
    { id: "all", label: "All", icon: LayoutGrid },
    { id: "feeds", label: "Feeds", icon: UtensilsCustom },
    { id: "items", label: "Items", icon: Package },
  ] as const;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1
            className="text-4xl font-folksy text-foreground tracking-tight"
            style={{ fontWeight: 400 }}
          >
            Supplies & Feeds
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Essential items and nutritional supplements for your kennel.
          </p>
        </div>

        <div className="flex bg-muted/50 p-1 rounded-2xl border border-border/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={`Show ${tab.label}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Specialty Items Section */}
      {(activeTab === "all" || activeTab === "items") && (
        <section className="space-y-6" aria-labelledby="specialty-tools-title">
          <h2
            id="specialty-tools-title"
            className="text-2xl font-folksy text-foreground tracking-tight"
            style={{ fontWeight: 400 }}
          >
            Specialty Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPECIALTY_ITEMS.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col border-border bg-card hover:border-primary/30 transition-all overflow-hidden group rounded-[32px]"
              >
                <CardHeader className="flex flex-col items-center gap-4 text-center bg-muted/30 p-8">
                  <div className="p-4 bg-card rounded-2xl shadow-sm border border-border group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground font-black">
                      {item.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {item.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto pt-4 p-6 border-t border-border bg-card">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Owned: {inventory[item.id] || 0}
                    </span>
                    <span className="font-black text-foreground flex items-center gap-1">
                      <Coins size={14} className="text-yellow-600" />{" "}
                      {item.price}
                    </span>
                  </div>
                  <Button
                    onClick={() => buyItem(item.id, item.price, item.currency)}
                    disabled={gold < item.price}
                    className="w-full h-10 font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  >
                    Purchase
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Basic Supplies Section */}
      {(activeTab === "all" || activeTab === "feeds") && (
        <section className="space-y-6" aria-labelledby="basic-kibble-title">
          <h2
            id="basic-kibble-title"
            className="text-2xl font-folksy text-foreground tracking-tight"
            style={{ fontWeight: 400 }}
          >
            Basic Kibble
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KibbleCard
              id="standard-feed"
              name="Standard Feed"
              description="Budget-friendly kibble. 4 servings per bag."
              price={25}
              icon={<ShoppingBag size={40} />}
              inventory={inventory}
              gold={gold}
              buyItem={buyItem}
            />
            <KibbleCard
              id="supplies"
              name="Premium Feed"
              description="High-protein kibble. 8 servings per bag."
              price={50}
              icon={<Zap size={40} />}
              inventory={inventory}
              gold={gold}
              buyItem={buyItem}
            />
          </div>
        </section>
      )}

      {/* Stat Feeds Section */}
      {(activeTab === "all" || activeTab === "feeds") && (
        <section className="space-y-6">
          <div>
            <h2
              className="text-2xl font-folksy text-foreground tracking-tight"
              style={{ fontWeight: 400 }}
            >
              Nutritional Supplements
            </h2>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              Each bag provides 5 servings and a permanent +2 bonus to a
              specific trait.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {SPECIALTY_FEEDS.map((feed) => (
              <Card
                key={feed.id}
                className={`border-border bg-card hover:shadow-lg transition-all group rounded-[32px] overflow-hidden`}
              >
                <CardHeader className="flex flex-col items-center gap-3 text-center pb-2 pt-6">
                  <div
                    className={`p-4 bg-muted rounded-2xl group-hover:scale-110 transition-transform border border-border text-primary`}
                  >
                    {feed.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black min-h-[40px] flex items-center justify-center leading-tight text-foreground uppercase tracking-tight italic">
                      {feed.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="text-[8px] font-black uppercase tracking-tighter bg-primary/5 text-primary border-primary/20"
                    >
                      +{feed.stat}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase border-b border-border pb-2">
                    <span className="truncate">
                      Held: {inventory[feed.id] || 0}
                    </span>
                    <span className="text-yellow-600 flex items-center gap-0.5 shrink-0">
                      <Coins size={12} /> 150
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => buyItem(feed.id, 150, "gold", 1)}
                      disabled={gold < 150}
                      size="sm"
                      variant="outline"
                      className={`w-full border-border text-foreground hover:bg-muted font-black uppercase tracking-widest text-[9px] rounded-lg`}
                    >
                      Buy 1
                    </Button>
                    <Button
                      onClick={() => buyItem(feed.id, 1200, "gold", 10)}
                      disabled={gold < 1200}
                      size="sm"
                      className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[9px] rounded-lg shadow-sm`}
                    >
                      <ShoppingCart size={12} /> Buy 10 (1200)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

interface KibbleCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  inventory: Record<string, number>;
  gold: number;
  buyItem: (
    id: string,
    price: number,
    currency: "gold" | "gems",
    count: number,
  ) => void;
}

function KibbleCard({
  id,
  name,
  description,
  price,
  icon,
  inventory,
  gold,
  buyItem,
}: KibbleCardProps) {
  return (
    <Card className="flex flex-col border-border bg-card shadow-sm overflow-hidden rounded-[40px]">
      <CardHeader className="flex flex-col md:flex-row items-center gap-6 bg-muted/30 p-8">
        <div className="p-5 bg-card rounded-[2rem] text-primary shadow-sm border border-border">
          {icon}
        </div>
        <div className="text-center md:text-left">
          <CardTitle className="text-2xl font-black italic text-foreground tracking-tight uppercase">
            {name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1 font-medium italic">
            {description}
          </p>
        </div>
      </CardHeader>
      <CardContent className="mt-auto p-8 border-t border-border bg-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[10px] font-black text-muted-foreground uppercase block tracking-widest">
              Inventory
            </span>
            <span className="text-xl font-black text-foreground">
              {inventory[id] || 0} Bags
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-muted-foreground uppercase block tracking-widest">
              Price
            </span>
            <span className="text-xl font-black text-yellow-600 flex items-center gap-1 justify-end">
              <Coins size={18} /> {price}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => buyItem(id, price, "gold", 1)}
            disabled={gold < price}
            className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs rounded-xl shadow-md"
          >
            Buy 1
          </Button>
          <Button
            onClick={() => buyItem(id, price * 9, "gold", 10)}
            disabled={gold < price * 9}
            variant="outline"
            className="h-12 border-border text-foreground hover:bg-muted font-black uppercase tracking-widest text-xs rounded-xl"
          >
            Buy 10 ({price * 9})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UtensilsCustom(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
