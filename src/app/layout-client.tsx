'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/lib/store';
import { 
  PawPrint, Home, ShoppingBag, Trophy, Heart, Calendar, 
  Coins, Diamond, MessageSquare, Shield, Menu, ChevronDown,
  Users, User, ShoppingCart, Info, Utensils, Star, Baby, UserPlus,
  Package, Store, CheckSquare, HelpCircle, LifeBuoy, Layout, ExternalLink,
  Scale, Award
} from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gold, gems, year, season, advanceTime, initializeGame, isAdmin } = useGameStore();
  
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isKennelOpen, setIsKennelOpen] = useState(false);
  const [isBreedingOpen, setIsBreedingOpen] = useState(false);
  const [isShowsOpen, setIsShowsOpen] = useState(false);
  const [isShopsOpen, setIsShopsOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const mainRef = useRef<HTMLDivElement>(null);
  const kennelRef = useRef<HTMLDivElement>(null);
  const breedingRef = useRef<HTMLDivElement>(null);
  const showsRef = useRef<HTMLDivElement>(null);
  const shopsRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (mainRef.current && !mainRef.current.contains(target)) setIsMainOpen(false);
      if (kennelRef.current && !kennelRef.current.contains(target)) setIsKennelOpen(false);
      if (breedingRef.current && !breedingRef.current.contains(target)) setIsBreedingOpen(false);
      if (showsRef.current && !showsRef.current.contains(target)) setIsShowsOpen(false);
      if (shopsRef.current && !shopsRef.current.contains(target)) setIsShopsOpen(false);
      if (communityRef.current && !communityRef.current.contains(target)) setIsCommunityOpen(false);
      if (supportRef.current && !supportRef.current.contains(target)) setIsSupportOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) setIsMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F4ED] flex flex-col font-serif">
      {/* Banner Placeholder */}
      <div className="w-full h-32 md:h-48 bg-[#E8E1D3] flex items-center justify-center border-b border-[#D8CFBC] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-cyan-500/10" />
        <div className="z-10 flex flex-col items-center gap-2">
            <PawPrint className="text-earth-200 w-12 h-12" />
            <span className="text-earth-500 font-bold uppercase tracking-widest text-xs md:text-sm">Banner Image Area</span>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="bg-[#3B3127] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-fire-600 p-1.5 rounded-lg group-hover:bg-fire-500 transition-colors">
                  <PawPrint size={20} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter">FoxSim</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-4">
                {/* Main Dropdown */}
                <Dropdown 
                  label="Main" 
                  icon={<Layout size={18} />} 
                  isOpen={isMainOpen} 
                  setIsOpen={setIsMainOpen} 
                  dropdownRef={mainRef}
                >
                  <DropdownLink href="/" icon={<Home size={16} />} label="Dashboard" onClick={() => setIsMainOpen(false)} />
                  <DropdownLink href="/news" icon={<Info size={16} />} label="Game News" onClick={() => setIsMainOpen(false)} />
                </Dropdown>

                {/* Kennel Dropdown */}
                <Dropdown 
                  label="Kennel" 
                  icon={<Home size={18} />} 
                  isOpen={isKennelOpen} 
                  setIsOpen={setIsKennelOpen} 
                  dropdownRef={kennelRef}
                >
                  <DropdownLink href="/" icon={<Home size={16} />} label="Dashboard" onClick={() => setIsKennelOpen(false)} />
                  <DropdownLink href="/inventory" icon={<Package size={16} />} label="Inventory" onClick={() => setIsKennelOpen(false)} />
                </Dropdown>

                {/* Breeding Dropdown */}
                <Dropdown 
                  label="Breeding" 
                  icon={<Heart size={18} />} 
                  isOpen={isBreedingOpen} 
                  setIsOpen={setIsBreedingOpen} 
                  dropdownRef={breedingRef}
                >
                  <DropdownLink href="/breeding" icon={<Heart size={16} />} label="Breeding Center" onClick={() => setIsBreedingOpen(false)} />
                  <DropdownLink href="/stud-barn" icon={<Shield size={16} />} label="Stud Barn" onClick={() => setIsBreedingOpen(false)} />
                </Dropdown>

                {/* Shows Dropdown */}
                <Dropdown 
                  label="Shows" 
                  icon={<Trophy size={18} />} 
                  isOpen={isShowsOpen} 
                  setIsOpen={setIsShowsOpen} 
                  dropdownRef={showsRef}
                >
                  <DropdownLink href="/shows" icon={<Trophy size={16} />} label="Competitive Shows" onClick={() => setIsShowsOpen(false)} />
                  <DropdownLink href="/quests" icon={<CheckSquare size={16} />} label="Quests & Achievements" onClick={() => setIsShowsOpen(false)} />
                </Dropdown>

                {/* Shops Dropdown */}
                <Dropdown 
                  label="Shops" 
                  icon={<ShoppingBag size={18} />} 
                  isOpen={isShopsOpen} 
                  setIsOpen={setIsShopsOpen} 
                  dropdownRef={shopsRef}
                >
                  <DropdownLink href="/shop/adoption" icon={<Baby size={16} />} label="Foundation Adoption" onClick={() => setIsShopsOpen(false)} />
                  <DropdownLink href="/shop/items" icon={<ShoppingCart size={16} />} label="Specialty Items" onClick={() => setIsShopsOpen(false)} />
                  <DropdownLink href="/shop/staff" icon={<UserPlus size={16} />} label="Staff & Services" onClick={() => setIsShopsOpen(false)} />
                  <DropdownLink href="/shop/feeds" icon={<Utensils size={16} />} label="Feeds" onClick={() => setIsShopsOpen(false)} />
                  <DropdownLink href="/shop/marketplace" icon={<Store size={16} />} label="Marketplace" onClick={() => setIsShopsOpen(false)} />
                  <DropdownLink href="/shop/custom" icon={<Star size={16} />} label="Custom Foxes" onClick={() => setIsShopsOpen(false)} />
                </Dropdown>

                {/* Community Dropdown */}
                <Dropdown 
                  label="Community" 
                  icon={<Users size={18} />} 
                  isOpen={isCommunityOpen} 
                  setIsOpen={setIsCommunityOpen} 
                  dropdownRef={communityRef}
                >
                  <DropdownLink href="/forum" icon={<MessageSquare size={16} />} label="Forums" onClick={() => setIsCommunityOpen(false)} />
                  <DropdownLink href="/members" icon={<User size={16} />} label="Members" onClick={() => setIsCommunityOpen(false)} />
                  <DropdownLink href="#" icon={<ExternalLink size={16} />} label="Discord Server" onClick={() => setIsCommunityOpen(false)} />
                </Dropdown>

                {/* Support Dropdown */}
                <Dropdown 
                  label="Support" 
                  icon={<LifeBuoy size={18} />} 
                  isOpen={isSupportOpen} 
                  setIsOpen={setIsSupportOpen} 
                  dropdownRef={supportRef}
                >
                  <DropdownLink href="/help" icon={<HelpCircle size={16} />} label="Help Center" onClick={() => setIsSupportOpen(false)} />
                  <DropdownLink href="/faq" icon={<Info size={16} />} label="FAQ" onClick={() => setIsSupportOpen(false)} />
                  <DropdownLink href="/contact" icon={<MessageSquare size={16} />} label="Contact Staff" onClick={() => setIsSupportOpen(false)} />
                </Dropdown>
              </nav>
            </div>

            {/* Right Side: Game Status & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden xl:flex items-center gap-3 text-sm text-earth-200 border-r border-earth-700 pr-4 mr-2 whitespace-nowrap font-mono">
                <Calendar size={14} className="text-fire-600" /> Year {year}, {season}
                {isAdmin && (
                  <button 
                    onClick={() => advanceTime()}
                    className="ml-2 px-2 py-1 bg-fire-600 hover:bg-fire-500 rounded text-xs transition text-white font-bold"
                  >
                    Next
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 text-yellow-500 font-black text-xs sm:text-sm bg-[#2A231C] px-3 py-1.5 rounded-full border border-yellow-500/20 shadow-inner">
                  <Coins size={14} className="sm:w-4 sm:h-4" /> <span>{gold.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-black text-xs sm:text-sm bg-[#2A231C] px-3 py-1.5 rounded-full border border-cyan-400/20 shadow-inner">
                  <Diamond size={14} className="sm:w-4 sm:h-4" /> <span>{gems.toLocaleString()}</span>
                </div>
              </div>

              <button 
                className="md:hidden p-2 text-earth-200 hover:text-fire-400 hover:bg-earth-700 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-earth-800 pb-4 px-2 max-h-[80vh] overflow-y-auto" ref={mobileMenuRef}>
              <div className="flex flex-col gap-1 mt-2">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</div>
                <MobileNavLink href="/" icon={<Home size={18} />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/news" icon={<Info size={18} />} label="Game News" onClick={() => setIsMobileMenuOpen(false)} />

                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-t border-earth-800/50 mt-1">Kennel</div>
                <MobileNavLink href="/" icon={<Home size={18} />} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/inventory" icon={<Package size={18} />} label="Inventory" onClick={() => setIsMobileMenuOpen(false)} />
                
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-t border-earth-800/50 mt-1">Breeding</div>
                <MobileNavLink href="/breeding" icon={<Heart size={18} />} label="Breeding Center" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/stud-barn" icon={<Shield size={18} />} label="Stud Barn" onClick={() => setIsMobileMenuOpen(false)} />
                
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-t border-earth-800/50 mt-1">Shows</div>
                <MobileNavLink href="/shows" icon={<Trophy size={18} />} label="Competitive Shows" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/quests" icon={<CheckSquare size={18} />} label="Quests & Achievements" onClick={() => setIsMobileMenuOpen(false)} />

                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-t border-earth-800/50 mt-1">Shops</div>
                <MobileNavLink href="/shop/adoption" icon={<Baby size={18} />} label="Foundation Adoption" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/shop/items" icon={<ShoppingCart size={18} />} label="Specialty Items" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/shop/staff" icon={<UserPlus size={18} />} label="Staff & Services" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/shop/feeds" icon={<Utensils size={18} />} label="Feeds" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/shop/marketplace" icon={<Store size={18} />} label="Marketplace" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/shop/custom" icon={<Star size={18} />} label="Custom Foxes" onClick={() => setIsMobileMenuOpen(false)} />

                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-t border-earth-800/50 mt-1">Community</div>
                <MobileNavLink href="/forum" icon={<MessageSquare size={18} />} label="Forums" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/members" icon={<User size={18} />} label="Members" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="#" icon={<ExternalLink size={18} />} label="Discord Server" onClick={() => setIsMobileMenuOpen(false)} />

                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-t border-earth-800/50 mt-1">Support</div>
                <MobileNavLink href="/help" icon={<HelpCircle size={18} />} label="Help Center" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/faq" icon={<Info size={18} />} label="FAQ" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink href="/contact" icon={<MessageSquare size={18} />} label="Contact Staff" onClick={() => setIsMobileMenuOpen(false)} />

                <div className="mt-4 px-4 flex items-center justify-between text-[10px] text-earth-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> Year {year}, {season}
                  </span>
                  {isAdmin && (
                    <button 
                      onClick={() => advanceTime()}
                      className="px-2 py-0.5 bg-fire-600 hover:bg-fire-500 rounded transition text-white"
                    >
                      Next Season
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Legal Footer */}
      <footer className="bg-[#2A231C] text-earth-400 py-6 px-4 sm:px-6 lg:px-8 border-t border-earth-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5"><Scale size={12} className="text-fire-600" /> Terms of Service</span>
                <span className="flex items-center gap-1.5"><Shield size={12} className="text-moss-600" /> Privacy Policy</span>
                <span className="flex items-center gap-1.5"><Award size={12} className="text-cyan-600" /> Game Credits</span>
            </div>
            <div className="text-earth-500">
                &copy; {new Date().getFullYear()} Red Fox Breeding Simulator. All Rights Reserved. Inspired by Black Foxes UK.
            </div>
        </div>
      </footer>
    </div>
  );
}

function Dropdown({ label, icon, isOpen, setIsOpen, dropdownRef, children }: { label: string; icon: React.ReactNode; isOpen: boolean; setIsOpen: (v: boolean) => void; dropdownRef: React.RefObject<HTMLDivElement | null>; children: React.ReactNode }) {
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-bold text-sm whitespace-nowrap",
                isOpen ? "bg-earth-800 text-white" : "text-earth-200 hover:text-fire-400 hover:bg-earth-700"
                )}
            >
                {icon}
                <span>{label}</span>
                <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen ? "rotate-180" : "")} />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[#3B3127] border border-earth-700 shadow-2xl py-2 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-150 origin-top-left z-[60]">
                    {children}
                </div>
            )}
        </div>
    );
}

function DropdownLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <Link 
            href={href} 
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-earth-700 text-earth-200 hover:text-fire-400 transition-colors"
        >
            {icon}
            <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        </Link>
    );
}

function MobileNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-earth-700 transition-colors text-earth-200 hover:text-fire-400"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
