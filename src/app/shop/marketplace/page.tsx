'use client';
import { cn } from '@/lib/utils';

import React, { useState } from 'react';
import { useGameStore, MarketListing } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, ShoppingBag, Coins, Diamond, User, ArrowLeftRight, Trash2, Edit2, Check, X } from 'lucide-react';
import { FoxIllustration } from '@/components/FoxIllustration';

export default function MarketplacePage() {
  const { marketListings, gold, gems, buyFromMarket, cancelListing, updateMarketListing } = useGameStore();
  const [activeTab, setActiveTab] = useState<'foxes' | 'items'>('foxes');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);

  const filteredListings = marketListings.filter(l => {
    if (l.type !== (activeTab === 'foxes' ? 'fox' : 'item')) return false;
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      if (l.type === 'fox' && l.foxData) {
        return l.foxData.name.toLowerCase().includes(term) || l.foxData.phenotype.toLowerCase().includes(term);
      }
      return l.targetId.toLowerCase().includes(term);
    }
    return true;
  });

  const myListings = filteredListings.filter(l => l.sellerId === 'player');
  const otherListings = filteredListings.filter(l => l.sellerId !== 'player');

  const handleStartEdit = (listing: MarketListing) => {
    setEditingId(listing.id);
    setEditPrice(listing.price);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      updateMarketListing(editingId, { price: editPrice });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-folksy text-foreground tracking-tight flex items-center gap-3" style={{ fontWeight: 400 }}>
            <ShoppingBag className="text-primary" /> Marketplace
          </h1>
          <p className="text-muted-foreground mt-2">Trade foxes and items with other breeders worldwide.</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm text-sm"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-border bg-card">
            <SlidersHorizontal size={18} />
          </Button>
        </div>
      </div>

      <div className="flex border-b border-border gap-8">
        <button
          onClick={() => setActiveTab('foxes')}
          className={cn(
            "pb-4 px-2 text-lg font-black transition-all border-b-2",
            activeTab === 'foxes' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Foxes for Sale
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={cn(
            "pb-4 px-2 text-lg font-black transition-all border-b-2",
            activeTab === 'items' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Item Exchange
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {otherListings.length === 0 ? (
            <div className="py-20 text-center bg-card rounded-3xl border-2 border-dashed border-border text-muted-foreground italic font-medium">
              No {activeTab} currently listed by others.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherListings.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  onAction={() => buyFromMarket(l.id)}
                  canAfford={l.currency === 'gold' ? gold >= l.price : gems >= l.price}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black italic text-foreground flex items-center gap-2">
            <ArrowLeftRight className="text-secondary" size={20} /> Your Listings
          </h3>
          <div className="space-y-3">
            {myListings.map((l) => (
              <div key={l.id} className="p-4 bg-card border border-border rounded-2xl flex flex-col gap-3 group">
                <div className="flex justify-between items-center w-full">
                   <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground text-sm truncate uppercase tracking-tight italic">
                        {l.type === 'fox' ? l.foxData?.name : l.targetId.replace(/-/g, ' ')}
                      </p>
                      {editingId === l.id ? (
                         <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                              className="w-24 bg-muted border border-border rounded px-2 py-1 text-xs font-black"
                            />
                            <button onClick={handleSaveEdit} className="text-secondary hover:text-secondary transition-colors"><Check size={16}/></button>
                            <button onClick={() => setEditingId(null)} className="text-destructive hover:text-destructive transition-colors"><X size={16}/></button>
                         </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-accent flex items-center gap-0.5">
                            {l.currency === 'gold' ? <Coins size={12} /> : <Diamond size={12} />}
                            {l.price.toLocaleString()}
                          </span>
                        </div>
                      )}
                   </div>
                   <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(l)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cancelListing(l.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                   </div>
                </div>
              </div>
            ))}
            {myListings.length === 0 && (
              <p className="text-sm text-muted-foreground italic bg-muted/30 p-8 rounded-[32px] border-2 border-dashed border-border text-center">
                No active {activeTab} listings.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingCard({ listing, onAction, canAfford }: { listing: MarketListing, onAction: () => void, canAfford: boolean }) {
  const isFox = listing.type === 'fox' && listing.foxData;

  return (
    <Card className="folk-card overflow-hidden border-border bg-card">
      <div className="p-4 flex gap-4">
        <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          {isFox ? (
            <FoxIllustration phenotype={listing.foxData!.phenotype} size={10} />
          ) : (
            <ShoppingBag size={24} className="text-muted-foreground/30" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-foreground truncate uppercase italic">
              {isFox ? listing.foxData!.name : listing.targetId.replace(/-/g, ' ')}
            </h4>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate mb-2">
            {isFox ? listing.foxData!.phenotype : 'Specialty Item'}
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase">
            <User size={10} /> {listing.sellerName}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-border flex items-center justify-between gap-4 bg-muted/20">
        <div className={cn(
          "text-lg font-black flex items-center gap-1",
          listing.currency === 'gold' ? "text-accent" : "text-accent"
        )}>
          {listing.currency === 'gold' ? <Coins size={18} /> : <Diamond size={18} />}
          {listing.price.toLocaleString()}
        </div>
        <Button
          size="sm"
          onClick={onAction}
          disabled={!canAfford}
          className={cn(
            "font-black px-6 rounded-xl uppercase text-[10px] tracking-widest",
            listing.currency === 'gold' ? "bg-accent hover:bg-accent text-primary-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
        >
          Buy Now
        </Button>
      </div>
    </Card>
  );
}

