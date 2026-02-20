
'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, ShoppingBag, Heart, MessageSquare, Plus, X, Check, Trophy, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ICON_MAP: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="w-6 h-6 text-apricot" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6 text-moab" />,
  Heart: <Heart className="w-6 h-6 text-sagebrush" />,
  MessageSquare: <MessageSquare className="w-6 h-6 text-ink/60" />,
  Trophy: <Trophy className="w-6 h-6 text-amber-500" />,
  Store: <Store className="w-6 h-6 text-sagebrush" />,
};

export default function ForumPage() {
  const { forumCategories, forumPosts, isAdmin, addForumCategory } = useGameStore();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = () => {
    if (newCatName.trim() && newCatDesc.trim()) {
      addForumCategory(newCatName, newCatDesc, 'MessageSquare');
      setNewCatName('');
      setNewCatDesc('');
      setShowAddCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-8 rounded-[2rem] border border-border shadow-sm">
        <h2 className="text-4xl font-folksy text-foreground tracking-tight flex items-center gap-3">
          <MessageSquare className="text-primary" /> Community Forum
        </h2>
        {isAdmin && (
          <Button onClick={() => setShowAddCategory(true)} variant="outline" size="sm" className="gap-2">
            <Plus size={16} /> New Category
          </Button>
        )}
      </div>

      {showAddCategory && (
        <Card className="border-border bg-muted">
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Category Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full p-2 border border-border rounded bg-card text-foreground"
                placeholder="e.g. Off-Topic Discussion"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Description</label>
              <textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full p-2 border border-border rounded bg-card text-foreground"
                placeholder="What is this category for?"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCategory} className="gap-2">
                <Check size={16} /> Create
              </Button>
              <Button onClick={() => setShowAddCategory(false)} variant="ghost" className="gap-2">
                <X size={16} /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {forumCategories.map((cat) => {
          const postCount = forumPosts.filter((p) => p.categoryId === cat.id).length;
          return (
            <Link key={cat.id} href={`/forum/${cat.id}`}>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full group">
                <CardHeader className="flex flex-row items-center gap-6 p-10">
                  <div className="p-5 bg-muted rounded-[1.5rem] group-hover:bg-primary/10 transition-colors">
                    {ICON_MAP[cat.icon] || ICON_MAP.MessageSquare}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-folksy text-foreground">{cat.name}</CardTitle>
                    <p className="text-[15px] opacity-70 mt-2 font-medium leading-relaxed">{cat.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="px-10 pb-10 pt-0 flex justify-end">
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{postCount} Posts</Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
