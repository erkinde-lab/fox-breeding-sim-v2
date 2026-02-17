'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NEWS_ITEMS = [
  {
    id: 1,
    date: 'Spring, Year 1',
    title: 'Marketplace Beta Launch',
    content: 'The player-to-player marketplace is now live! You can now list your foxes and items for sale in exchange for Gold or Gems. This is a beta release, so please report any bugs to the staff.',
    category: 'Update'
  },
  {
    id: 2,
    date: 'Spring, Year 1',
    title: 'Genetics Engine Update',
    content: 'We have refined the inheritance logic for Georgian White and Platinum mutations to better align with historical breeding data. Lethal combinations are now strictly enforced.',
    category: 'Engine'
  },
  {
    id: 3,
    date: 'Spring, Year 1',
    title: 'Welcome to Red Fox Sim!',
    content: 'Welcome to the world of competitive fox breeding. Start by adopting your foundational pair and working towards your first Championship win.',
    category: 'Announcement'
  }
];

export default function NewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-earth-900 tracking-tight flex items-center gap-3">
          <Megaphone className="text-fire-600" /> Game News
        </h1>
        <p className="text-earth-500 mt-2">Latest updates, patch notes, and community announcements.</p>
      </div>

      <div className="space-y-6">
        {NEWS_ITEMS.map((item) => (
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
              <p className="text-earth-700 leading-relaxed">
                {item.content}
              </p>
              <div className="mt-4 flex justify-end">
                <button className="text-sm font-bold text-fire-600 flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <ArrowRight size={16} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
