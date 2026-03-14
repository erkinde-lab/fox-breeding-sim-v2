"use client";

import React from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Diamond, Dog, Trophy } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const store = useGameStore();

  const stats = [
    { label: "Total Foxes", value: Object.keys(store.foxes).length, icon: Dog, color: "text-fire-600" },
    { label: "Gold", value: store.gold.toLocaleString(), icon: Coins, color: "text-gold" },
    { label: "Gems", value: store.gems.toLocaleString(), icon: Diamond, color: "text-gems" },
    { label: "BIS Wins", value: store.bisWins || 0, icon: Trophy, color: "text-blue-500" },
  ];

  const recentActivity = store.showReports.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Show Results</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((report, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-semibold">{report.level} {report.variety} Show</p>
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                    </div>
                    <Badge variant="outline">{report.results.length} Entries</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Kennel Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Capacity</span>
                <span className="font-bold">{Object.keys(store.foxes).length} / {store.kennelCapacity}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-fire-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (Object.keys(store.foxes).length / store.kennelCapacity) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
