'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, Info, ArrowLeftRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InventoryPage() {
  const { inventory, listItemOnMarket } = useGameStore();
  const [listingItemId, setListingItemId] = useState<string | null>(null);
  const [listPrice, setListPrice] = useState(100);
  const [listCurrency, setListCurrency] = useState<'gold' | 'gems'>('gold');

  const inventoryItems = Object.entries(inventory).filter(([, count]) => count > 0);

  const handleList = () => {
    if (listingItemId) {
        listItemOnMarket(listingItemId, listPrice, listCurrency);
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

      {listingItemId && (
          <Card className="border-moss-200 bg-moss-50/50 folk-card">
              <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-end">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-black uppercase text-moss-700 tracking-widest">
                            Listing: <span className="text-earth-900">{listingItemId.replace(/-/g, ' ')}</span>
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                value={listPrice} 
                                onChange={(e) => setListPrice(parseInt(e.target.value) || 0)}
                                className="flex-1 bg-white border border-moss-200 p-3 rounded-xl font-bold text-lg"
                            />
                            <select 
                                value={listCurrency}
                                onChange={(e) => setListCurrency(e.target.value as 'gold' | 'gems')}
                                className="bg-white border border-moss-200 p-3 rounded-xl font-bold uppercase"
                            >
                                <option value="gold">Gold</option>
                                <option value="gems">Gems</option>
                            </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleList} className="bg-moss-600 hover:bg-moss-500 px-8 h-12 font-black">Confirm Listing</Button>
                        <Button variant="ghost" onClick={() => setListingItemId(null)} className="h-12"><X size={18}/></Button>
                      </div>
                  </div>
              </CardContent>
          </Card>
      )}

      {inventoryItems.length === 0 ? (
        <Card className="border-dashed border-2 border-earth-200 bg-earth-50/50 rounded-[32px]">
          <CardContent className="flex flex-col items-center justify-center py-20 text-earth-300">
            <Package size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-bold">Your inventory is currently empty.</p>
            <p className="text-sm">Visit the shops to purchase items and equipment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventoryItems.map(([id, count]) => (
            <Card key={id} className="folk-card hover:shadow-md transition-shadow group">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-fire-50 rounded-2xl text-fire-600 group-hover:scale-110 transition-transform">
                  <Package size={24} />
                </div>
                <div>
                  <CardTitle className="text-lg capitalize text-earth-900 leading-tight">{id.replace(/-/g, ' ')}</CardTitle>
                  <p className="text-xs font-black text-earth-400 uppercase tracking-widest mt-1">Qty: {count}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-earth-400 bg-earth-50 p-2 rounded-lg">
                  <Info size={14} className="text-fire-600" />
                  <span>Use from Fox profile</span>
                </div>
                <Button 
                    variant="outline" 
                    className="w-full gap-2 border-earth-200 hover:bg-earth-50 rounded-xl"
                    onClick={() => {
                        setListingItemId(id);
                        setListPrice(100);
                    }}
                >
                    <ArrowLeftRight size={14} className="text-moss-600" /> List on Market
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
