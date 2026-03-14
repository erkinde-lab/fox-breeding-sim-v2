import React from 'react';
import { Megaphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BroadcastBannerProps {
  message: string | null;
  onClear: () => void;
}

export const BroadcastBanner: React.FC<BroadcastBannerProps> = ({ message, onClear }) => {
  if (!message) return null;

  return (
    <div className="bg-fire-600 text-white py-2 px-4 shadow-md relative animate-in slide-in-from-top duration-300">
      <div className="container flex items-center justify-center gap-2 pr-10">
        <Megaphone className="w-4 h-4 animate-bounce" />
        <p className="text-sm font-bold text-center">{message}</p>
      </div>
      <button
        onClick={onClear}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 p-1 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
