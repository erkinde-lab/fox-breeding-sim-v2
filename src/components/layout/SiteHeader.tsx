import React from 'react';
import Link from 'next/link';
import { Menu, X, Coins, Diamond, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SiteHeaderProps {
  gold: number;
  gems: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenSettings: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  gold,
  gems,
  isDarkMode,
  toggleDarkMode,
  onOpenSettings
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-fire-600">Red Fox Sim</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="/kennel" className="transition-colors hover:text-fire-600">Kennel</Link>
            <Link href="/breeding" className="transition-colors hover:text-fire-600">Breeding</Link>
            <Link href="/shows" className="transition-colors hover:text-fire-600">Shows</Link>
            <Link href="/market" className="transition-colors hover:text-fire-600">Market</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 mr-2">
            <div className="flex items-center gap-1 bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
              <Coins className="w-4 h-4 text-gold" />
              <span className="text-sm font-bold text-gold">{gold.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 bg-gems/10 px-3 py-1 rounded-full border border-gems/20">
              <Diamond className="w-4 h-4 text-gems" />
              <span className="text-sm font-bold text-gems">{gems.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onOpenSettings}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
