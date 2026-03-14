"use client";

import React from 'react';
import { useGameStore } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Megaphone, Users, Coins, Dog, AlertTriangle } from 'lucide-react';

import { DashboardTab } from '@/components/admin/DashboardTab';
import { CommsTab } from '@/components/admin/CommsTab';
import { ModerationTab } from '@/components/admin/ModerationTab';
import { EconomyTab } from '@/components/admin/EconomyTab';
import { NPCKennelTab } from '@/components/admin/NPCKennelTab';
import { DangerZoneTab } from '@/components/admin/DangerZoneTab';

export default function AdminPage() {
  const store = useGameStore();

  const stats = {
    totalFoxes: Object.keys(store.foxes).length,
    totalMembers: store.members.length,
    activeReports: store.reports.filter(r => r.status === 'pending').length,
    economyTotal: store.gold // Simplified for dashboard
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-fire-600" />
        <h1 className="text-3xl font-bold tracking-tight">Admin Command Center</h1>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full h-auto p-1 bg-muted/50 border">
          <TabsTrigger value="dashboard" className="py-2.5">
            <Shield className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="comms" className="py-2.5">
            <Megaphone className="w-4 h-4 mr-2" />
            Comms
          </TabsTrigger>
          <TabsTrigger value="moderation" className="py-2.5">
            <Users className="w-4 h-4 mr-2" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="economy" className="py-2.5">
            <Coins className="w-4 h-4 mr-2" />
            Economy
          </TabsTrigger>
          <TabsTrigger value="npc" className="py-2.5">
            <Dog className="w-4 h-4 mr-2" />
            NPC Kennel
          </TabsTrigger>
          <TabsTrigger value="danger" className="py-2.5 text-destructive hover:text-destructive">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Danger Zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab stats={stats} />
        </TabsContent>

        <TabsContent value="comms">
          <CommsTab
            onSetBroadcast={store.setBroadcast}
            onClearBroadcast={() => store.setBroadcast(null)}
          />
        </TabsContent>

        <TabsContent value="moderation">
          <ModerationTab
            members={store.members}
            reports={store.reports}
            onWarn={store.warnMember}
            onBan={store.banMember}
          />
        </TabsContent>

        <TabsContent value="economy">
          <EconomyTab onUpdateCurrency={store.adminAddCurrency} />
        </TabsContent>

        <TabsContent value="npc">
          <NPCKennelTab
            npcStuds={store.npcStuds}
            onRepopulate={store.repopulateFoundationFoxes}
          />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZoneTab onResetGame={store.resetGame} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
