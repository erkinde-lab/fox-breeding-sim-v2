
'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Plus, User, Clock, Send, X } from 'lucide-react';


export default function CategoryPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const { forumCategories, forumPosts, addForumPost } = useGameStore();
  
  const category = forumCategories.find(c => c.id === categoryId);
  const posts = forumPosts.filter(p => p.categoryId === categoryId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const [showNewPost, setShowNewPost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Player One');

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
          <Plus size={16} /> New Post
        </Button>
      </div>

      {showNewPost && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Create New Post</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNewPost(false)}>
                <X size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Author Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Subject</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="What's on your mind?"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded h-32"
                  placeholder="Write your post here..."
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Send size={16} /> Post Message
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No posts in this category yet. Be the first!</p>
          </div>
        ) : (
          posts.map(post => (
            <Card key={post.id} className="border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-slate-900">{post.title}</CardTitle>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <User size={14} className="text-orange-500" />
                  <span className="font-medium">{post.author}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">{post.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
