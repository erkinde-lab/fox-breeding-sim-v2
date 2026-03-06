'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, Tag, Coins, Diamond, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function InventoryPage() {
  const { inventory, listItemOnMarket } = useGameStore();
  const [listingItemId, setListingItemId] = useState<string | null>(null);
  const [listPrice, setListPrice] = useState(100);
  const [listCurrency, setListCurrency] = useState<'gold' | 'gems'>('gold');

  const inventoryItems = Object.entries(inventory).filter(([, count]) => count > 0);

  const handleList = () => {
    if (listingItemId) {
        listItemOnMarket('item', listingItemId, listPrice, listCurrency);
        setListingItemId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-earth-900 tracking-tight flex items-center gap-3">
            <Package className="text-fire-600" /> Your Inventory
        </h1>
        <p className="text-earth-500 mt-2">Manage your items, specialty feeds, and equipment.</p>
      </div>

      {inventoryItems.length === 0 ? (
        <Card className="folk-card p-12 text-center bg-earth-50/50 border-dashed border-2 border-earth-200">
          <Package className="mx-auto text-earth-200 mb-4" size={48} />
          <p className="text-earth-400 font-bold italic">Your inventory is currently empty. Visit the shop to acquire supplies!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventoryItems.map(([id, count]) => (
            <Card key={id} className="folk-card group hover:border-fire-200 transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-earth-100 rounded-2xl text-earth-600 group-hover:bg-fire-100 group-hover:text-fire-600 transition-colors">
                    <Package size={24} />
                  </div>
                  <Badge variant="secondary" className="bg-earth-900 text-white border-none font-black px-3 py-1">
                    x{count}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4 capitalize">{id.replace('_', ' ')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-earth-500 font-medium">Standard issue equipment for kennel management and showing.</p>

                <div className="pt-4 border-t border-earth-100 flex gap-2">
                   <Button
                    variant="outline" 
                    className="flex-1 border-earth-200 font-bold text-xs uppercase tracking-widest h-10 rounded-xl"
                    onClick={() => setListingItemId(id)}
                   >
                     <Tag size={14} className="mr-2" /> List
                   </Button>
                   <Button className="flex-1 bg-earth-900 hover:bg-earth-800 font-bold text-xs uppercase tracking-widest h-10 rounded-xl">
                     Use Item
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Listing Modal Placeholder */}
      {listingItemId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <Card className="max-w-md w-full folk-card p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-earth-900">List on Marketplace</h3>
                <p className="text-sm text-earth-500 font-medium capitalize">Setting price for: {listingItemId.replace('_', ' ')}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-earth-400 tracking-widest">Listing Price</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full p-4 bg-earth-50 border-2 border-earth-100 rounded-2xl font-black text-xl outline-none focus:border-fire-300 transition-colors"
                      value={listPrice}
                      onChange={(e) => setListPrice(parseInt(e.target.value))}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {listCurrency === 'gold' ? <Coins className="text-amber-500" /> : <Diamond className="text-gems" />}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className={`flex-1 h-12 rounded-xl font-bold border-2 transition-all ${listCurrency === 'gold' ? 'bg-gold/5 border-gold/50 text-gold' : 'border-earth-100 text-earth-400 opacity-50'}`}
                    onClick={() => setListCurrency('gold')}
                  >
                    Gold
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex-1 h-12 rounded-xl font-bold border-2 transition-all ${listCurrency === 'gems' ? 'bg-gems/5 border-gems/50 text-gems' : 'border-earth-100 text-earth-400 opacity-50'}`}
                    onClick={() => setListCurrency('gems')}
                  >
                    Gems
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1 h-12 font-bold text-earth-400" onClick={() => setListingItemId(null)}>Cancel</Button>
                <Button className="flex-1 h-12 bg-fire-600 hover:bg-fire-500 font-black uppercase tracking-widest rounded-xl shadow-lg shadow-fire-100" onClick={handleList}>
                  Confirm Listing
                </Button>
              </div>
           </Card>
        </div>
      )}

      <div className="bg-earth-100/50 p-6 rounded-3xl border border-earth-200 flex items-start gap-4">
        <div className="p-2 bg-white rounded-xl text-earth-400 border border-earth-200">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-bold text-earth-900">Inventory Capacity</h4>
          <p className="text-sm text-earth-500 leading-relaxed font-medium">Your global inventory has no weight limit, but active listings on the marketplace will freeze the items until sold or cancelled.</p>
        </div>
      </div>
    </div>
  );
}
