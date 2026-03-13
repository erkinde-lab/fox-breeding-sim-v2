"use client";

import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Settings, Filter } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";

export default function KennelPage() {
  const { foxes, currentMemberId } = useGameStore();
  const [activeTab, setActiveTab] = useState("adults");
  const [genderFilter, setGenderFilter] = useState<"all" | "Dog" | "Vixen">("all");

  const playerFoxes = Object.values(foxes).filter(f => f.ownerId === currentMemberId);

  const adults = playerFoxes.filter(f => f.age >= 12 && !f.isRetired);
  const young = playerFoxes.filter(f => f.age < 12);
  const retired = playerFoxes.filter(f => f.isRetired);

  const filteredAdults = adults.filter(f => genderFilter === "all" || f.gender === genderFilter);
  const filteredYoung = young.filter(f => genderFilter === "all" || f.gender === genderFilter);
  const filteredRetired = retired.filter(f => genderFilter === "all" || f.gender === genderFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-32">
      <Dashboard />

      <Tabs defaultValue="adults" className="space-y-8" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <TabsList className="bg-primary/5 p-1.5 rounded-2xl border-4 border-primary/10 h-auto">
            <TabsTrigger value="adults" className="gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all">
              Adult Kennel ({adults.length})
            </TabsTrigger>
            <TabsTrigger value="young" className="gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all">
              Young & Kits ({young.length})
            </TabsTrigger>
            <TabsTrigger value="retired" className="gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all">
              Retired ({retired.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="h-10 px-4 rounded-xl border-4 border-primary/10 bg-background/50 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
              <Filter size={14} className="text-primary" />
              Filter:
            </Badge>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="h-10 px-4 rounded-xl border-4 border-primary/10 bg-background/50 font-black uppercase tracking-widest text-[10px] outline-none focus:border-primary/30 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Genders</option>
              <option value="Dog">Dogs</option>
              <option value="Vixen">Vixens</option>
            </select>
          </div>
        </div>

        <TabsContent value="adults" className="outline-none">
          <FoxGrid foxes={filteredAdults} emptyMessage="No adult foxes in your kennel." />
        </TabsContent>
        <TabsContent value="young" className="outline-none">
          <FoxGrid foxes={filteredYoung} emptyMessage="No kits or young foxes." />
        </TabsContent>
        <TabsContent value="retired" className="outline-none">
          <FoxGrid foxes={filteredRetired} emptyMessage="No retired foxes." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FoxGrid({ foxes, emptyMessage }: { foxes: any[], emptyMessage: string }) {
  if (foxes.length === 0) {
    return (
      <div className="h-64 rounded-[2.5rem] border-4 border-dashed border-primary/10 flex flex-col items-center justify-center text-muted-foreground bg-primary/5">
        <Heart size={48} className="mb-4 opacity-20" />
        <p className="font-black uppercase tracking-widest text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {foxes.map((fox) => (
        <Card key={fox.id} className="group border-4 border-primary/20 shadow-none rounded-[2rem] overflow-hidden bg-background/50 backdrop-blur-md hover:border-primary/40 transition-all hover:translate-y-[-4px]">
          <div className="aspect-[4/3] bg-primary/5 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center font-black uppercase tracking-tighter text-primary/10 text-4xl select-none">
              {fox.phenotype}
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg shadow-lg">
                  <Settings size={14} />
               </Button>
            </div>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-xl uppercase tracking-tight truncate leading-none">{fox.name}</h3>
                <Badge variant="outline" className="shrink-0 font-black uppercase tracking-widest text-[8px] py-0.5 px-1.5 rounded-md border-2 border-primary/10">
                  {fox.gender === 'Dog' ? '♂ Dog' : '♀ Vixen'}
                </Badge>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{fox.phenotype}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
               <div className="bg-primary/5 rounded-xl p-2 border-2 border-primary/5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Age</p>
                  <p className="text-sm font-black tracking-tight leading-none">{fox.age} Mo</p>
               </div>
               <div className="bg-primary/5 rounded-xl p-2 border-2 border-primary/5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Stats</p>
                  <p className="text-sm font-black tracking-tight leading-none">AVG {Math.round(Object.values((fox.stats as any) || {}).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0) / 10)}</p>
               </div>
            </div>

            <Button className="w-full h-10 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border-2 border-primary/5 font-black uppercase tracking-widest text-[10px] transition-all">
              View Profile
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
