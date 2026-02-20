'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Plus, User, Clock, Send, X, Smile } from 'lucide-react';


export default function CategoryPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const { forumCategories, forumPosts, addForumPost, togglePinPost, isAdmin } = useGameStore();

  const category = forumCategories.find(c => c.id === categoryId);
  const posts = (forumPosts || []).filter(p => p.categoryId === categoryId).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const [showNewPost, setShowNewPost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Player One');

  const EMOJIS = ['🦊', '🐾', '🔥', '✨', '🏆', '❤️', '🌟', '🌿', '💎', '💰', '📉', '📈'];

  if (!category) return <div className="p-8 text-center">Category not found</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      addForumPost(category.id, title, content, author);
      setTitle('');
      setContent('');
      setShowNewPost(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/forum')}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">{category.name}</h2>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        <Button onClick={() => setShowNewPost(true)} className="gap-2">
          <Plus size={16} /> New Topic
        </Button>
      </div>

      {showNewPost && (
        <Card className="border-primary/20 bg-muted shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-foreground">Create New Topic</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNewPost(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-primary tracking-widest">Your Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-3 border-border border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-primary tracking-widest">Topic Subject</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border-border border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="What is this topic about?"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-primary tracking-widest">Message Body</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 border-border border rounded-xl bg-card text-foreground h-40 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Share your thoughts with the community..."
                  required
                />
              </div>

              <div className="p-3 bg-muted rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase text-primary tracking-tighter">
                  <Smile size={12} /> Quick Emojis
                </div>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(e => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => addEmoji(e)}
                      className="text-xl hover:scale-125 transition-transform p-1"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full h-12 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-md">
                <Send size={18} /> Publish Topic
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare className="w-12 h-12 text-earth-200 mx-auto mb-3" />
            <p className="text-earth-400 font-medium">No topics yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {posts.map(post => (
              <div
                key={post.id}
                onClick={() => router.push(`/forum/${categoryId}/${post.id}`)}
                className={`group p-4 hover:bg-muted transition-colors cursor-pointer flex items-center justify-between gap-4 ${post.isPinned ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${post.isPinned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {post.isPinned ? <Plus size={18} className="rotate-45" /> : <MessageSquare size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {post.isPinned && (
                        <Badge variant="default" className="bg-primary hover:bg-primary/90 h-4 px-1 text-[8px] uppercase tracking-tighter">Pinned</Badge>
                      )}
                      <h3 className="font-black text-foreground group-hover:text-primary transition-colors truncate tracking-tight">{post.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span className="text-primary">{post.author}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">{post.replies?.length || 0} Replies</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinPost(post.id);
                      }}
                      className={`h-7 px-2 text-[9px] uppercase font-black tracking-widest ${post.isPinned ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {post.isPinned ? 'Unpin' : 'Pin'}
                    </Button>
                  )}
                  <ArrowLeft size={16} className="text-earth-200 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
