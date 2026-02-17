'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Plus, User, Clock, Send, X, Smile } from 'lucide-react';


export default function CategoryPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const { forumCategories, forumPosts, addForumPost } = useGameStore();
  
  const category = forumCategories.find(c => c.id === categoryId);
  const posts = (forumPosts || []).filter(p => p.categoryId === categoryId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{category.name}</h2>
          <p className="text-slate-500">{category.description}</p>
        </div>
        <Button onClick={() => setShowNewPost(true)} className="gap-2">
          <Plus size={16} /> New Topic
        </Button>
      </div>

      {showNewPost && (
        <Card className="border-fire-200 bg-fire-50/50 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-fire-900">Create New Topic</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNewPost(false)} className="text-fire-600">
                <X size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-fire-700 tracking-widest">Your Name</label>
                    <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-3 border-fire-100 border rounded-xl bg-white focus:ring-2 focus:ring-fire-500 focus:outline-none"
                    placeholder="Your Name"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-fire-700 tracking-widest">Topic Subject</label>
                    <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border-fire-100 border rounded-xl bg-white focus:ring-2 focus:ring-fire-500 focus:outline-none"
                    placeholder="What is this topic about?"
                    required
                    />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-fire-700 tracking-widest">Message Body</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 border-fire-100 border rounded-xl bg-white h-40 focus:ring-2 focus:ring-fire-500 focus:outline-none"
                  placeholder="Share your thoughts with the community..."
                  required
                />
              </div>

              <div className="p-3 bg-white/50 rounded-xl border border-fire-100">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase text-fire-600 tracking-tighter">
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

              <Button type="submit" className="w-full h-12 gap-2 bg-fire-600 hover:bg-fire-700 text-lg font-bold shadow-md">
                <Send size={18} /> Publish Topic
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-earth-200">
            <MessageSquare className="w-12 h-12 text-earth-200 mx-auto mb-3" />
            <p className="text-earth-400 font-medium">No topics here yet. Start the conversation!</p>
          </div>
        ) : (
          posts.map(post => (
            <Card key={post.id} className="border-earth-100 hover:border-fire-200 transition-colors folk-card shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-earth-900 font-black tracking-tight">{post.title}</CardTitle>
                  <div className="text-[10px] font-bold text-earth-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-earth-500 mt-1">
                  <div className="w-6 h-6 bg-earth-100 rounded-full flex items-center justify-center">
                    <User size={12} className="text-fire-600" />
                  </div>
                  <span className="font-bold">{post.author}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
