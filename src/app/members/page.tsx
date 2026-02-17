'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Trophy, Star, Calendar, Search, AlertTriangle } from 'lucide-react';

export default function MembersPage() {
  const { members } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = (members || []).filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Members</h1>
          <p className="text-slate-500 mt-2">Connect with other fox breeders and see who&apos;s leading the pack.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fire-500 focus:border-transparent transition-all shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className={`overflow-hidden hover:shadow-md transition-shadow folk-card ${member.isBanned ? 'opacity-50 grayscale' : ''}`}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className={`w-12 h-12 ${member.avatarColor} rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm`}>
                <User size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px] uppercase">Lvl {member.level}</Badge>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Calendar size={10} /> Joined {member.joined}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-1 text-slate-600">
                  <Trophy size={14} className="text-yellow-500" />
                  <span className="font-bold">{member.points.toLocaleString()} pts</span>
                </div>
                <div className="flex gap-2 items-center">
                  {member.warnings.length > 0 && (
                    <div className="text-amber-500 flex items-center gap-1" title={`${member.warnings.length} Warnings`}>
                      <AlertTriangle size={14} />
                    </div>
                  )}
                  {member.isBanned && (
                    <Badge variant="destructive" className="text-[8px] uppercase">Banned</Badge>
                  )}
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Star size={12} className="text-orange-400 fill-orange-400" />
                    Top 1%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredMembers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No members found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
