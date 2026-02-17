
'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, ShoppingBag, Heart, MessageSquare, Plus, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ICON_MAP: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="w-6 h-6 text-orange-500" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6 text-blue-500" />,
  Heart: <Heart className="w-6 h-6 text-pink-500" />,
  MessageSquare: <MessageSquare className="w-6 h-6 text-slate-500" />,
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <MessageSquare className="text-slate-600" /> Community Forum
        </h2>
        {isAdmin && (
          <Button onClick={() => setShowAddCategory(true)} variant="outline" className="gap-2">
            <Plus size={16} /> New Category
          </Button>
        )}
      </div>

      {showAddCategory && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g. Off-Topic Discussion"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full p-2 border rounded"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forumCategories.map((cat) => {
          const postCount = forumPosts.filter((p) => p.categoryId === cat.id).length;
          return (
            <Link key={cat.id} href={`/forum/${cat.id}`}>
              <Card className="hover:shadow-md transition cursor-pointer h-full border-slate-200">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-lg">
                    {ICON_MAP[cat.icon] || ICON_MAP.MessageSquare}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{cat.name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{cat.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex justify-end">
                   <Badge variant="secondary">{postCount} Posts</Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
