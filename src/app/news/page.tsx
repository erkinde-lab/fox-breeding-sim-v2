'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Megaphone, Calendar, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/lib/store';

export default function NewsPage() {
  const news = useGameStore((state) => state.news || []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-earth-900 tracking-tight flex items-center gap-3">
          <Megaphone className="text-fire-600" /> Game News
        </h1>
        <p className="text-earth-500 mt-2">Latest updates, patch notes, and community announcements.</p>
      </div>

      <div className="space-y-6">
        {news.length === 0 ? (
          <Card className="folk-card p-12 text-center border-dashed border-2">
            <Info className="mx-auto text-earth-300 mb-4" size={48} />
            <p className="text-earth-500 font-bold italic text-lg">No news items have been posted yet. Check back soon!</p>
          </Card>
        ) : (
          news.map((item) => (
            <Card key={item.id} className="folk-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-earth-400 uppercase tracking-widest">
                  <Calendar size={14} /> {item.date}
                </div>
                <Badge variant="outline" className="border-fire-200 text-fire-600 bg-fire-50">
                  {item.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl text-earth-900 mb-3">{item.title}</CardTitle>
                <p className="text-earth-700 leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
