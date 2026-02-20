'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Clock, Send, Smile, Plus, MessageSquare } from 'lucide-react';

export default function TopicPage() {
    const { categoryId, postId } = useParams();
    const router = useRouter();
    const { forumCategories, forumPosts, addForumReply, isAdmin, togglePinPost } = useGameStore();

    const category = forumCategories.find(c => c.id === categoryId);
    const post = (forumPosts || []).find(p => p.id === postId);

    const [replyContent, setReplyContent] = useState('');
    const [author, setAuthor] = useState('Player One');

    const EMOJIS = ['🦊', '🐾', '🔥', '✨', '🏆', '❤️', '🌟', '🌿', '💎', '💰', '📉', '📈'];

    if (!category || !post) return <div className="p-8 text-center text-muted-foreground font-bold">Topic or Category not found</div>;

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyContent.trim()) {
            addForumReply(post.id, author, replyContent);
            setReplyContent('');
        }
    };

    const addEmoji = (emoji: string) => {
        setReplyContent(prev => prev + emoji);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push(`/forum/${categoryId}`)}>
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{category.name}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">{post.title}</h2>
                </div>
                {isAdmin && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePinPost(post.id)}
                        className={`h-9 px-4 text-xs uppercase font-bold tracking-widest ${post.isPinned ? 'text-primary border-primary/30 bg-primary/10' : 'text-muted-foreground border-border'}`}
                    >
                        {post.isPinned ? 'Unpin' : 'Pin Topic'}
                    </Button>
                )}
            </div>

            <Card className={`border-border ${post.isPinned ? 'border-l-4 border-l-primary bg-primary/5' : ''} folk-card shadow-md`}>
                <CardHeader className="pb-2 border-b border-border mb-4 bg-muted">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
                                <User size={20} className="text-primary" />
                            </div>
                            <div>
                                <div className="font-black text-foreground">{post.author}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                    <Clock size={10} /> {new Date(post.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        {post.isPinned && (
                            <Badge variant="default" className="bg-primary hover:bg-primary/90 h-6 px-2 gap-1.5 uppercase text-[10px] tracking-widest">
                                <Plus className="rotate-45" size={14} /> Pinned
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed text-lg">
                        {post.content}
                    </p>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em] px-2 flex items-center gap-2">
                    <MessageSquare size={14} className="text-primary" /> Discussion ({post.replies?.length || 0})
                </h3>

                {post.replies && post.replies.length > 0 && (
                    <div className="space-y-4">
                        {post.replies.map(reply => (
                            <div key={reply.id} className="bg-card p-6 rounded-2xl border border-border shadow-sm transition-all hover:border-accent/40">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center border border-border">
                                            <User size={14} className="text-primary" />
                                        </div>
                                        <span className="text-xs font-black text-foreground uppercase tracking-wide">{reply.author}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(reply.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                            </div>
                        ))}
                    </div>
                )}

                <Card className="border-primary/20 bg-muted overflow-hidden">
                    <CardContent className="pt-6">
                        <form onSubmit={handleReplySubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-primary tracking-wider">Join the Conversation</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-48 p-2 text-xs border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary font-bold bg-card text-foreground"
                                        placeholder="Your Name"
                                    />
                                    <div className="flex-1"></div>
                                </div>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="w-full p-4 border border-border rounded-xl bg-card text-foreground h-32 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                    placeholder="What are your thoughts?"
                                    required
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex flex-wrap gap-1">
                                    {EMOJIS.map(e => (
                                        <button
                                            key={e}
                                            type="button"
                                            onClick={() => addEmoji(e)}
                                            className="text-xl hover:scale-125 transition-transform p-1 bg-muted rounded-lg border border-transparent hover:border-primary/20"
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 h-12 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                                    <Send size={18} className="mr-2" /> Post Reply
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
