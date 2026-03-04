'use client';



import React, { useState } from 'react';

import { useGameStore } from '@/lib/store';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {

  Shield,

  Users,

  Coins,

  Settings,

  History,

  Database,

  TrendingUp,

  Megaphone,

  MessageSquare,

  Trash2,

  Plus,

  Package,

  Trophy,

  AlertTriangle

} from 'lucide-react';

import { useNotifications } from '@/components/NotificationProvider';

const BANNER_URLS = [
  {
    name: "Classic Fox",
    url: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Forest Mist",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Winter Den",
    url: "https://images.unsplash.com/photo-1483356256511-b48749959172?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Golden Field",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Night Prowl",
    url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function AdminPanel() {

  const { showNotification, addNotification } = useNotifications();

  const {

    isAdmin,

    members,

    gold,

    gems,

    inventory,

    foxes,

    adminLogs,

    warnMember,

    banMember,

    adminSetCurrency,

    adminAddItem,

    setBroadcast,

    broadcast,
    bannerUrl,
    bannerPosition,
    setBannerUrl,
    setBannerPosition,
    news,

    addNews,

    deleteNews,

    forumPosts,

    deleteForumPost,

    deleteForumReply,

    showConfig,

    adminUpdateMemberInventory,

    adminRemoveItemFromInventory

  } = useGameStore();



  const [broadcastInput, setBroadcastInput] = useState(broadcast || '');

  const [newsTitle, setNewsTitle] = useState('');

  const [newsContent, setNewsContent] = useState('');

  const [newsCategory, setNewsCategory] = useState('Update');



  const [targetMemberId, setTargetMemberId] = useState('player-1');

  const [itemToAdd, setItemToAdd] = useState('gene_test');

  const [itemCount, setItemCount] = useState(1);



  // Allow access in development even if not admin

  const hasAccess = isAdmin || process.env.NODE_ENV === 'development';



  if (!hasAccess) {

    return (

      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-card rounded-[3rem] border-2 border-dashed border-border">

        <div className="p-6 bg-destructive/10 rounded-full text-destructive mb-6">

          <Shield size={64} />

        </div>

        <h1 className="text-3xl font-black text-foreground tracking-tight uppercase italic">Access Denied</h1>

        <p className="text-muted-foreground mt-2 font-medium max-w-sm">You must be an administrator to view this page. If you believe this is an error, please contact the site owner.</p>

        <Button className="mt-8 bg-foreground text-background font-black uppercase tracking-widest px-8 rounded-xl h-12" onClick={() => window.location.href = '/'}>

          Return Home

        </Button>

      </div>

    );

  }



  const handleUpdateBroadcast = () => {

    setBroadcast(broadcastInput || null);

    addNotification('Global broadcast updated successfully.', 'success');

  };



  const handlePostNews = () => {

    if (!newsTitle || !newsContent) {

      addNotification('Please fill in both title and content.', 'error');

      return;

    }

    addNews(newsTitle, newsContent, newsCategory);

    setNewsTitle('');

    setNewsContent('');

    addNotification('News item published to the feed.', 'success');

  };



  const handleBanMember = (id: string, name: string) => {

    showNotification({

      title: 'Confirm Ban',

      message: `Are you sure you want to ban ${name}? This action is permanent and will restrict their access to the kennel and forums.`,

      type: 'destructive',

      confirmLabel: 'Ban Member',

      onConfirm: () => {

        banMember(id);

        addNotification(`${name} has been banned.`, 'destructive');

      }

    });

  };



  return (

    <div className="max-w-6xl mx-auto space-y-10 pb-20">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-border/50 border-dashed">

        <div className="space-y-2">

          <Badge variant="outline" className="px-3 py-1 border-fire-200 text-fire-600 bg-fire-50 font-black uppercase tracking-[0.2em] text-[10px]">

            System Administration

          </Badge>

          <h1 className="text-5xl font-black text-foreground tracking-tighter flex items-center gap-4 italic">

            <Shield className="text-primary" size={48} /> Command <span className="text-primary">Center</span>

          </h1>

          <p className="text-muted-foreground font-medium text-lg">Manage simulation state, regulate members, and oversee game health.</p>

        </div>



        <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-3xl border border-border backdrop-blur-sm">

          <div className="text-right hidden sm:block">

            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Admin</p>

            <p className="font-bold text-foreground">Angmar (Root)</p>

          </div>

          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">

            <Shield size={24} />

          </div>

        </div>

      </div>



      <Tabs defaultValue="site" className="space-y-8">

        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">

          <TabsList className="bg-card p-1.5 rounded-2xl border-2 border-border shadow-sm flex w-max sm:w-full">

            <TabsTrigger value="site" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"><Settings size={14} /> Site</TabsTrigger>

            <TabsTrigger value="news" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"><Megaphone size={14} /> News</TabsTrigger>

            <TabsTrigger value="members" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"><Users size={14} /> Members</TabsTrigger>

            <TabsTrigger value="forum" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"><MessageSquare size={14} /> Forum</TabsTrigger>

            <TabsTrigger value="economy" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"><Coins size={14} /> Economy</TabsTrigger>

            <TabsTrigger value="analytics" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all"><TrendingUp size={14} /> Stats</TabsTrigger>

          </TabsList>

        </div>



        {/* Site Management */}

        <TabsContent value="site" className="animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <Card className="folk-card border-fire-100 bg-fire-50/10">

              <CardHeader className="pb-2">

                <CardTitle className="text-2xl font-black italic flex items-center gap-3">

                  <Megaphone className="text-fire-600" size={24} /> Global Broadcast

                </CardTitle>

                <p className="text-xs text-muted-foreground font-medium">Post a site-wide alert banner visible to all active sessions.</p>

              </CardHeader>

              <CardContent className="space-y-4 pt-4">

                <textarea

                  className="w-full p-4 bg-card border-2 border-border rounded-[2rem] h-32 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner"

                  placeholder="Enter broadcast message (supports Markdown emojis)..."

                  value={broadcastInput}

                  onChange={(e) => setBroadcastInput(e.target.value)}

                />

                <Button onClick={handleUpdateBroadcast} className="w-full bg-fire-600 hover:bg-fire-500 font-black uppercase tracking-widest h-14 rounded-2xl shadow-lg shadow-fire-200">

                  Update Live Broadcast

                </Button>

              </CardContent>

            </Card>

            <Card className="folk-card border-purple-100 bg-purple-50/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                  <Package className="text-purple-600" size={24} /> Site-Wide Banner
                </CardTitle>
                <p className="text-xs text-muted-foreground font-medium">Change the decorative header banner visible to all players.</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BANNER_URLS.map((b) => (
                    <button
                      key={b.name}
                      onClick={() => {
                        setBannerUrl(b.url);
                        addNotification(`Site banner changed to ${b.name}`, 'success');
                      }}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${bannerUrl === b.url
                          ? "border-primary shadow-md scale-[0.98]"
                          : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={b.url}
                        alt={b.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-black text-white uppercase tracking-widest text-center px-1">
                          {b.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  {["0% 50%", "50% 50%", "100% 50%"].map((pos, i) => (
                    <Button
                      key={pos}
                      variant={bannerPosition === pos ? "default" : "outline"}
                      onClick={() => setBannerPosition(pos)}
                      className="flex-1 h-10 rounded-xl font-bold uppercase tracking-widest text-[9px] border-purple-200 hover:bg-purple-50"
                    >
                      {i === 0 ? "Top" : i === 1 ? "Center" : "Bottom"}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="folk-card border-cyan-100 bg-cyan-50/10">

              <CardHeader className="pb-2">

                <CardTitle className="text-2xl font-black italic flex items-center gap-3">

                  <Database className="text-cyan-600" size={24} /> System Health

                </CardTitle>

                <p className="text-xs text-muted-foreground font-medium">Monitor and manage the global simulation state.</p>

              </CardHeader>

              <CardContent className="space-y-4 pt-4">

                <div className="space-y-2">

                  <div className="flex justify-between items-center p-4 bg-card border border-border rounded-2xl">

                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Store Version</span>

                    <Badge className="bg-cyan-500 border-none font-black px-3">v7.0.0</Badge>

                  </div>

                  <div className="flex justify-between items-center p-4 bg-card border border-border rounded-2xl">

                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Genetic API</span>

                    <Badge className="bg-moss-500 border-none font-black px-3">v2.4-STABLE</Badge>

                  </div>

                </div>

                <Button variant="outline" className="w-full border-2 border-cyan-200 text-cyan-700 font-black uppercase tracking-widest h-14 rounded-2xl hover:bg-cyan-50">

                  Refresh State Persistence

                </Button>

              </CardContent>

            </Card>

          </div>

        </TabsContent>



        {/* News Management */}

        <TabsContent value="news" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

          <Card className="folk-card overflow-hidden">

            <CardHeader className="bg-muted/30 pb-6 border-b border-border">

              <CardTitle className="text-3xl font-black italic">Publish Game Updates</CardTitle>

              <p className="text-sm text-muted-foreground font-medium">Keep the community informed about patches and events.</p>

            </CardHeader>

            <CardContent className="p-8 space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-2 space-y-2">

                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Article Title</label>

                  <input

                    className="w-full p-4 bg-muted/20 border-2 border-border rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none"

                    placeholder="e.g., Spring Whelping Season is Here!"

                    value={newsTitle}

                    onChange={(e) => setNewsTitle(e.target.value)}

                  />

                </div>

                <div className="space-y-2">

                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Category</label>

                  <select

                    className="w-full p-4 bg-muted/20 border-2 border-border rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none appearance-none"

                    value={newsCategory}

                    onChange={(e) => setNewsCategory(e.target.value)}

                  >

                    <option>Update</option>

                    <option>Announcement</option>

                    <option>Engine</option>

                    <option>Event</option>

                  </select>

                </div>

                <div className="md:col-span-3 space-y-2">

                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Content Body</label>

                  <textarea

                    className="w-full p-6 bg-muted/20 border-2 border-border rounded-[2.5rem] h-48 font-medium focus:ring-2 focus:ring-primary outline-none shadow-inner"

                    placeholder="Write your update here. Line breaks are preserved."

                    value={newsContent}

                    onChange={(e) => setNewsContent(e.target.value)}

                  />

                </div>

              </div>

              <Button onClick={handlePostNews} className="w-full md:w-auto px-12 bg-fire-600 hover:bg-fire-500 font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-fire-100">

                Publish Update <Plus className="ml-2" size={18} />

              </Button>

            </CardContent>

          </Card>



          <div className="space-y-4">

            <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] ml-2">Recent Articles</h3>

            <div className="grid grid-cols-1 gap-3">

              {news.map(item => (

                <div key={item.id} className="group flex items-center justify-between p-5 bg-card border-2 border-border rounded-2xl hover:border-primary/30 transition-all shadow-sm">

                  <div className="flex items-center gap-4">

                    <Badge className="bg-muted text-muted-foreground border-none font-black px-3 py-1 rounded-lg uppercase text-[9px] tracking-widest">

                      {item.category}

                    </Badge>

                    <div>

                      <h4 className="font-black text-foreground">{item.title}</h4>

                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">{item.date}</p>

                    </div>

                  </div>

                  <Button

                    variant="ghost"

                    size="sm"

                    className="text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"

                    onClick={() => {

                      showNotification({

                        title: 'Delete News',

                        message: 'Are you sure you want to delete this news article?',

                        type: 'destructive',

                        onConfirm: () => deleteNews(item.id)

                      });

                    }}

                  >

                    <Trash2 size={20} />

                  </Button>

                </div>

              ))}

            </div>

          </div>

        </TabsContent>



        {/* Member Management */}

        <TabsContent value="members" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <Card className="folk-card lg:col-span-1">

              <CardHeader>

                <CardTitle className="flex items-center gap-3">

                  <Package className="text-moss-600" /> Inventory Editor

                </CardTitle>

                <p className="text-xs text-muted-foreground font-medium">Directly manipulate player inventories.</p>

              </CardHeader>

              <CardContent className="space-y-5 pt-4">

                <div className="space-y-2">

                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Target Member</label>

                  <select className="w-full p-3 bg-muted/30 border border-border rounded-xl font-bold text-sm" value={targetMemberId} onChange={e => setTargetMemberId(e.target.value)}>

                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}

                  </select>

                </div>

                <div className="space-y-2">

                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Item to Add</label>

                  <select className="w-full p-3 bg-muted/30 border border-border rounded-xl font-bold text-sm" value={itemToAdd} onChange={e => setItemToAdd(e.target.value)}>

                    <option value="gene_test">Genetic Test</option>

                    <option value="stat_boost">Vitamins (Stat Boost)</option>

                    <option value="premium_feed">Premium Feed</option>

                  </select>

                </div>

                <div className="space-y-2">

                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Quantity</label>

                  <input type="number" className="w-full p-3 bg-muted/30 border border-border rounded-xl font-bold" value={itemCount} onChange={e => setItemCount(parseInt(e.target.value))} />

                </div>

                <Button className="w-full bg-moss-600 hover:bg-moss-500 font-black uppercase tracking-widest h-12 rounded-xl mt-2 shadow-lg shadow-moss-100" onClick={() => {

                  adminUpdateMemberInventory(targetMemberId, itemToAdd, itemCount);

                  addNotification(`Added ${itemCount} items to inventory.`, 'success');

                }}>Inject Items</Button>

              </CardContent>

            </Card>



            <Card className="folk-card lg:col-span-2 overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="bg-muted/50 border-b border-border">

                    <tr>

                      <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Member</th>

                      <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</th>

                      <th className="p-6 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Actions</th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-border">

                    {members.map((member) => (

                      <tr key={member.id} className="hover:bg-muted/20 transition-colors">

                        <td className="p-6">

                          <div className="flex items-center gap-4">

                            <div className={`w-10 h-10 rounded-2xl ${member.avatarColor} shadow-inner`} />

                            <div>

                              <span className="font-black text-foreground block tracking-tight">{member.name}</span>

                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Joined {member.joined}</span>

                            </div>

                          </div>

                        </td>

                        <td className="p-6">

                          {member.isBanned ? (

                            <Badge variant="destructive" className="font-black px-3">BANNED</Badge>

                          ) : member.warnings.length > 0 ? (

                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 font-black px-3 uppercase tracking-tighter text-[10px]">WARNED ({member.warnings.length})</Badge>

                          ) : (

                            <Badge variant="outline" className="text-moss-600 border-moss-200 bg-moss-50 font-black px-3 uppercase tracking-tighter text-[10px]">ACTIVE</Badge>

                          )}

                        </td>

                        <td className="p-6 text-right space-x-2">

                          <Button

                            variant="outline"

                            size="sm"

                            className="text-[10px] font-black uppercase tracking-widest px-4 border-2 rounded-xl"

                            onClick={() => {

                              showNotification({

                                title: 'Issue Warning',

                                message: `Enter reason for warning ${member.name}:`,

                                showInput: true,

                                inputPlaceholder: 'TOS violation...',

                                onConfirm: (reason) => {

                                  warnMember(member.id, reason || "Admin warning.");

                                  addNotification('Warning issued.', 'warning');

                                }

                              });

                            }}

                          >

                            Warn

                          </Button>

                          <Button

                            variant="destructive"

                            size="sm"

                            className="text-[10px] font-black uppercase tracking-widest px-4 rounded-xl"

                            onClick={() => handleBanMember(member.id, member.name)}

                            disabled={member.isBanned}

                          >

                            Ban

                          </Button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </Card>

          </div>

        </TabsContent>



        {/* Forum Moderation */}

        <TabsContent value="forum" className="animate-in fade-in slide-in-from-bottom-4 duration-500">

          <Card className="folk-card">

            <CardHeader className="border-b border-border pb-6">

              <CardTitle className="text-3xl font-black italic">Content Moderation</CardTitle>

              <p className="text-sm text-muted-foreground font-medium">Regulate public discussions and remove harmful content.</p>

            </CardHeader>

            <CardContent className="p-8 space-y-6">

              {forumPosts.length === 0 ? (

                <div className="text-center py-20 space-y-4">

                  <MessageSquare size={48} className="mx-auto text-muted-foreground/20" />

                  <p className="text-muted-foreground font-bold italic">No forum activity currently recorded.</p>

                </div>

              ) : (

                forumPosts.map(post => (

                  <div key={post.id} className="p-6 border-2 border-border rounded-[2rem] space-y-4 bg-muted/5 group hover:border-primary/20 transition-all">

                    <div className="flex justify-between items-start">

                      <div className="space-y-1">

                        <h4 className="text-xl font-black text-foreground tracking-tight italic">"{post.title}"</h4>

                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">By <span className="text-primary">{post.author}</span> • {new Date(post.createdAt).toLocaleDateString()}</p>

                      </div>

                      <Button variant="ghost" className="text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 rounded-full p-2" onClick={() => {
                        showNotification({
                          title: 'Delete Post',
                          message: 'Are you sure? All replies will also be permanently removed.',
                          type: 'destructive',
                          onConfirm: () => deleteForumPost(post.id)
                        });
                      }}>

                        <Trash2 size={22} />

                      </Button>

                    </div>

                    <div className="p-4 bg-card border border-border rounded-2xl italic text-muted-foreground text-sm shadow-inner">

                      "{post.content}"

                    </div>



                    {post.replies && post.replies.length > 0 && (

                      <div className="mt-4 pl-6 space-y-3 border-l-2 border-dashed border-border">

                        {post.replies.map(reply => (

                          <div key={reply.id} className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">

                            <div>

                              <span className="font-black text-xs text-foreground mr-2">{reply.author}:</span>

                              <span className="text-sm text-muted-foreground font-medium">{reply.content}</span>

                            </div>

                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground/30 hover:text-destructive" onClick={() => deleteForumReply(post.id, reply.id)}>

                              <Trash2 size={16} />

                            </Button>

                          </div>

                        ))}

                      </div>

                    )}

                  </div>

                ))

              )}

            </CardContent>

          </Card>

        </TabsContent>



        {/* Economy Controls */}

        <TabsContent value="economy" className="animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <Card className="folk-card border-amber-100 bg-amber-50/10">

              <CardHeader className="pb-2">

                <CardTitle className="text-2xl font-black italic flex items-center gap-3">

                  <Coins className="text-amber-600" size={24} /> Currency Control

                </CardTitle>

                <p className="text-xs text-muted-foreground font-medium">Issue development funds for testing and compensation.</p>

              </CardHeader>

              <CardContent className="space-y-4 pt-4">

                <div className="grid grid-cols-2 gap-4">

                  <div className="p-4 bg-card border-2 border-amber-100 rounded-2xl text-center space-y-1">

                    <p className="text-[10px] font-black uppercase text-muted-foreground">Gold Supply</p>

                    <p className="text-2xl font-black text-amber-600">{gold.toLocaleString()}</p>

                  </div>

                  <div className="p-4 bg-card border-2 border-cyan-100 rounded-2xl text-center space-y-1">

                    <p className="text-[10px] font-black uppercase text-muted-foreground">Gem Supply</p>

                    <p className="text-2xl font-black text-cyan-600">{gems.toLocaleString()}</p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <Button variant="outline" className="flex-1 border-2 border-amber-200 text-amber-700 font-black uppercase tracking-widest h-12 rounded-xl" onClick={() => adminSetCurrency({ gold: gold + 100000 })}>

                    +100k Gold

                  </Button>

                  <Button variant="outline" className="flex-1 border-2 border-cyan-200 text-cyan-700 font-black uppercase tracking-widest h-12 rounded-xl" onClick={() => adminSetCurrency({ gems: gems + 1000 })}>

                    +1k Gems

                  </Button>

                </div>

                <Button className="w-full bg-foreground text-background font-black uppercase tracking-widest h-12 rounded-xl" onClick={() => {

                   showNotification({

                     title: 'Set Balances',

                     message: 'Set specific currency values (Staff Only):',

                     showInput: true,

                     inputPlaceholder: 'Gold, Gems (e.g. 500, 10)',

                     onConfirm: (val) => {

                       const [go, ge] = (val || "").split(',').map(s => parseInt(s.trim()));

                       if (!isNaN(go) && !isNaN(ge)) {

                         adminSetCurrency({ gold: go, gems: ge });

                         addNotification('Balances updated.', 'info');

                       }

                     }

                   });

                }}>Override Total Balances</Button>

              </CardContent>

            </Card>



            <Card className="folk-card border-fire-100 bg-fire-50/10">

              <CardHeader className="pb-2">

                <CardTitle className="text-2xl font-black italic flex items-center gap-3">

                  <Trophy className="text-fire-600" size={24} /> Show Prize Tiers

                </CardTitle>

                <p className="text-xs text-muted-foreground font-medium">Manage payouts for competition winners.</p>

              </CardHeader>

              <CardContent className="space-y-4 pt-4">

                <div className="grid grid-cols-1 gap-2">

                  {Object.entries(showConfig).map(([level, config]) => (

                    <div key={level} className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl group hover:border-primary/20 transition-all">

                      <div>

                        <span className="font-black text-foreground tracking-tight block uppercase text-xs">{level} Circuit</span>

                        <div className="flex gap-3 mt-1 text-[10px] font-bold text-muted-foreground uppercase">

                          <span>BIS: <span className="text-moss-600">{config.bis}g</span></span>

                          <span>1st: <span className="text-moss-600">{config.first}g</span></span>

                        </div>

                      </div>

                      <Button variant="ghost" size="sm" className="rounded-lg h-8 w-8 p-0 text-muted-foreground/30 hover:text-primary">

                        <Plus size={16} />

                      </Button>

                    </div>

                  ))}

                </div>

              </CardContent>

            </Card>

          </div>

        </TabsContent>



        {/* Analytics Display */}

        <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <Card className="folk-card p-10 text-center border-moss-100 bg-moss-50/10 relative overflow-hidden group">

               <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700">

                  <History size={120} />

               </div>

               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest relative z-10">Total Fox Population</p>

               <h2 className="text-6xl font-black text-foreground mt-4 tracking-tighter relative z-10 italic">{Object.keys(foxes).length}</h2>

               <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-moss-100 rounded-full text-moss-700 font-black text-[10px] uppercase tracking-widest relative z-10">

                  <TrendingUp size={12} /> Stable Growth

               </div>

            </Card>



            <Card className="folk-card p-10 text-center border-amber-100 bg-amber-50/10 relative overflow-hidden group">

               <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700">

                  <Coins size={120} />

               </div>

               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest relative z-10">Economic Velocity</p>

               <h2 className="text-6xl font-black text-foreground mt-4 tracking-tighter relative z-10 italic">{Math.floor(gold / 1000)}k</h2>

               <p className="text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-widest relative z-10">Total Circulating Gold</p>

            </Card>



            <Card className="folk-card p-10 text-center border-fire-100 bg-fire-50/10 relative overflow-hidden group">

               <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-700">

                  <Shield size={120} />

               </div>

               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest relative z-10">Active Reports</p>

               <h2 className="text-6xl font-black text-destructive mt-4 tracking-tighter relative z-10 italic">0</h2>

               <p className="text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-widest relative z-10 italic">System is Secure</p>

            </Card>

          </div>



          <Card className="folk-card">

            <CardHeader className="border-b border-border pb-6 flex flex-row items-center justify-between">

              <div>

                <CardTitle className="text-3xl font-black italic">Security Audit Log</CardTitle>

                <p className="text-sm text-muted-foreground font-medium">Recent administrative actions and system events.</p>

              </div>

              <History className="text-muted-foreground/20" size={32} />

            </CardHeader>

            <CardContent className="p-0">

              <div className="divide-y divide-border">

                {adminLogs.length === 0 ? (

                  <div className="p-20 text-center space-y-4">

                    <History size={48} className="mx-auto text-muted-foreground/10" />

                    <p className="text-muted-foreground font-bold italic">No administrative logs currently recorded.</p>

                  </div>

                ) : (

                  adminLogs.map((log) => (

                    <div key={log.id} className="p-6 flex items-start gap-6 hover:bg-muted/10 transition-colors">

                      <div className="mt-1">

                        {log.action.includes('Spawn') ? <Plus className="text-moss-500" /> :

                         log.action.includes('Ban') || log.action.includes('Warn') ? <AlertTriangle className="text-fire-600" /> :

                         <History className="text-cyan-600" />}

                      </div>

                      <div className="flex-1">

                        <div className="flex items-center gap-3">

                          <span className="text-sm font-black text-foreground uppercase italic tracking-tight">{log.action}</span>

                          <span className="text-[9px] font-bold text-muted-foreground/50 bg-muted px-2 py-0.5 rounded-md uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</span>

                        </div>

                        <p className="text-sm text-muted-foreground font-medium mt-1 leading-relaxed">{log.details}</p>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>

    </div>

  );

}

