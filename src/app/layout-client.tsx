"use client";
import { cn } from "@/lib/utils";

import React, { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store";
import { TutorialTour } from "@/components/TutorialTour";
import Link from "next/link";
import {
  Menu,
  Home,
  PawPrint,
  Heart,
  Trophy,
  ShoppingBag,
  Settings,
  Users,
  LifeBuoy,
  ChevronDown,
  Package,
  Coins,
  Diamond,
  Calendar,
  Info,
  Star,
  MessageSquare,
  User,
  ExternalLink,
  HelpCircle,
  Rocket,
  UserPlus,
  Store,
  Baby,
  CheckSquare,
  Shield,
  FastForward,
  Search,
  Moon,
  Sun,
  Plus,
  X,
} from "lucide-react";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    colorblindMode,
    highContrast,
    fontSize,
    useOpenDyslexic,
    reducedMotion,
    alwaysUnderlineLinks,
    gold,
    gems,
    year,
    season,
    advanceTime,
    initializeGame,
    isAdmin,
    toggleAdminMode,
    bannerUrl,
    bannerPosition,
    isDarkMode,
    toggleDarkMode,
  } = useGameStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isKennelOpen, setIsKennelOpen] = useState(false);
  const [isBreedingOpen, setIsBreedingOpen] = useState(false);
  const [isShowsOpen, setIsShowsOpen] = useState(false);
  const [isShopsOpen, setIsShopsOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

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

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // If mobile menu is open, don't let handleClickOutside close individual categories
      // as they share state and it will cause sub-links to collapse before navigation
      if (isMobileMenuOpen) {
        if (mobileMenuRef.current && mobileMenuRef.current.contains(target))
          return;
      }

      if (mainRef.current && !mainRef.current.contains(target))
        setIsMainOpen(false);
      if (kennelRef.current && !kennelRef.current.contains(target))
        setIsKennelOpen(false);
      if (breedingRef.current && !breedingRef.current.contains(target))
        setIsBreedingOpen(false);
      if (showsRef.current && !showsRef.current.contains(target))
        setIsShowsOpen(false);
      if (shopsRef.current && !shopsRef.current.contains(target))
        setIsShopsOpen(false);
      if (communityRef.current && !communityRef.current.contains(target))
        setIsCommunityOpen(false);
      if (supportRef.current && !supportRef.current.contains(target))
        setIsSupportOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [initializeGame, isMobileMenuOpen]);

  return (
    <div
      className={`min-h-screen bg-oatmeal flex flex-col font-rounded selection:bg-apricot/30 transition-colors duration-500 ${cn(
        isDarkMode && "dark",
        colorblindMode && "colorblind-mode",
        highContrast && "high-contrast",
        `font-size-${fontSize}`,
        useOpenDyslexic && "use-opendyslexic",
        reducedMotion && "reduced-motion",
        alwaysUnderlineLinks && "underline-links",
      )}`}
    >
      {/* Top Utility Bar */}
      <div className="bg-moab text-[10px] font-black uppercase tracking-[0.2em] text-white py-2.5 px-4 sm:px-6 lg:px-8 flex justify-between items-center z-[60] shadow-sm">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <Calendar size={12} className="opacity-70" /> Year {year},{" "}
            <span className="font-bold">{season}</span>
          </span>
          {isAdmin && (
            <button
              onClick={() => advanceTime()}
              className="hover:bg-white/10 px-3 py-1 rounded-full transition-all flex items-center gap-1.5 border border-white/20"
            >
              <FastForward size={12} /> Advance Season
            </button>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div
            id="tutorial-currency"
            className="flex items-center gap-4 border-white/20 sm:pr-6 sm:border-r"
          >
            <span className="flex items-center gap-1.5">
              <Coins size={12} className="text-yellow-200" />{" "}
              {gold.toLocaleString()} Gold
            </span>
            <Link
              href="/shop/gems"
              className="flex items-center gap-1.5 hover:text-cyan-200 transition-colors group"
            >
              <Diamond
                size={12}
                className="text-cyan-200 group-hover:scale-110 transition-transform"
              />
              {gems.toLocaleString()} Gems
              <Plus
                size={10}
                className="bg-white/20 rounded-full p-0.5 ml-0.5"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleDarkMode()}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <Link
              href="/settings"
              className="hidden lg:block hover:underline underline-offset-4"
            >
              Settings
            </Link>
            <Link
              href="/help"
              className="hidden lg:block hover:underline underline-offset-4"
            >
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Site Banner */}
      <div
        className="w-full h-[220px] sm:h-[320px] bg-cover relative shadow-inner overflow-hidden border-b-8 border-sagebrush/20"
        style={{
          backgroundImage: `url(${bannerUrl})`,
          backgroundPosition: `center ${bannerPosition}`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--banner-overlay)] via-[var(--banner-overlay)]/40 to-transparent flex items-end pb-8">
          <div className="w-full px-4 sm:px-6 lg:px-8 text-left">
            <div className="text-ink max-w-2xl">
              <h2 className="text-5xl sm:text-7xl font-folksy tracking-tight leading-[0.85] text-earth-900">
                Welcome
                <br />
                Home
              </h2>
              <div className="h-1.5 lg:w-24 bg-apricot mt-6 mb-4 rounded-full"></div>
              <p className="font-bold sm:text-xl tracking-tight uppercase font-rounded text-foreground/80 drop-shadow-sm">
                Professional Red Fox Breeding Simulation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="bg-background/80 backdrop-blur-md text-foreground sticky top-0 z-50 border-b border-border shadow-sm transition-colors duration-500">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Desktop Nav */}
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3 group shrink-0">
                <button
                  className="p-3 bg-apricot rounded-[1.2rem] hover:bg-fire-400 transition-all hover:rotate-6 shadow-xl shadow-apricot/20 cursor-help border-none outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAdminMode();
                  }}
                  title="Toggle Admin Mode"
                >
                  <PawPrint size={28} className="text-white" />
                </button>
                <Link
                  href="/"
                  className="flex flex-col hover:opacity-80 transition-opacity"
                >
                  <span className="text-2xl font-folksy tracking-tight leading-none text-foreground">
                    Red Fox
                  </span>
                  <span className="text-[11px] font-black tracking-[0.3em] text-secondary uppercase leading-none mt-1 opacity-80">
                    Simulator v2
                  </span>
                </Link>
              </div>

              <nav className="hidden xl:flex items-center gap-2 flex-1 justify-center max-w-5xl">
                {/* Main Dropdown */}
                <Dropdown
                  label="Main"
                  icon={<Home size={18} />}
                  isOpen={isMainOpen}
                  setIsOpen={setIsMainOpen}
                  dropdownRef={mainRef}
                >
                  <DropdownLink
                    href="/news"
                    icon={<Info size={16} />}
                    label="Game News"
                    onClick={() => setIsMainOpen(false)}
                  />
                </Dropdown>

                {/* Kennel Dropdown */}
                <Dropdown
                  label="Kennel"
                  icon={<Home size={18} />}
                  isOpen={isKennelOpen}
                  setIsOpen={setIsKennelOpen}
                  dropdownRef={kennelRef}
                >
                  <DropdownLink
                    href="/kennel"
                    icon={<PawPrint size={16} />}
                    label="My Foxes"
                    onClick={() => setIsKennelOpen(false)}
                  />
                  <DropdownLink
                    href="/inventory"
                    icon={<Package size={16} />}
                    label="Inventory"
                    onClick={() => setIsKennelOpen(false)}
                  />
                </Dropdown>

                {/* Breeding Dropdown */}
                <Dropdown
                  label="Breeding"
                  icon={<Heart size={18} />}
                  isOpen={isBreedingOpen}
                  setIsOpen={setIsBreedingOpen}
                  dropdownRef={breedingRef}
                >
                  <DropdownLink
                    href="/breeding"
                    icon={<Heart size={16} />}
                    label="Breeding Center"
                    onClick={() => setIsBreedingOpen(false)}
                  />
                  <DropdownLink
                    href="/stud-barn"
                    icon={<Shield size={16} />}
                    label="Stud Barn"
                    onClick={() => setIsBreedingOpen(false)}
                  />
                </Dropdown>

                {/* Shows Dropdown */}
                <Dropdown
                  label="Shows"
                  icon={<Trophy size={18} />}
                  isOpen={isShowsOpen}
                  setIsOpen={setIsShowsOpen}
                  dropdownRef={showsRef}
                >
                  <DropdownLink
                    href="/shows"
                    icon={<Trophy size={16} />}
                    label="Competitive Shows"
                    onClick={() => setIsShowsOpen(false)}
                  />
                  <DropdownLink
                    href="/quests"
                    icon={<CheckSquare size={16} />}
                    label="Quests & Achievements"
                    onClick={() => setIsShowsOpen(false)}
                  />
                </Dropdown>

                {/* Shops Dropdown */}
                <Dropdown
                  label="Shops"
                  icon={<ShoppingBag size={18} />}
                  isOpen={isShopsOpen}
                  setIsOpen={setIsShopsOpen}
                  dropdownRef={shopsRef}
                >
                  <DropdownLink
                    href="/shop/adoption"
                    icon={<Baby size={16} />}
                    label="Foundation Adoption"
                    onClick={() => setIsShopsOpen(false)}
                  />
                  <DropdownLink
                    href="/shop/supplies"
                    icon={<Package size={16} />}
                    label="Supplies & Feeds"
                    onClick={() => setIsShopsOpen(false)}
                  />
                  <DropdownLink
                    href="/shop/staff"
                    icon={<UserPlus size={16} />}
                    label="Staff & Services"
                    onClick={() => setIsShopsOpen(false)}
                  />
                  <DropdownLink
                    href="/shop/marketplace"
                    icon={<Store size={16} />}
                    label="Marketplace"
                    onClick={() => setIsShopsOpen(false)}
                  />
                  <DropdownLink
                    href="/shop/custom"
                    icon={<Star size={16} />}
                    label="Custom Foxes"
                    onClick={() => setIsShopsOpen(false)}
                  />
                </Dropdown>

                {/* Community Dropdown */}
                <Dropdown
                  label="Community"
                  icon={<Users size={18} />}
                  isOpen={isCommunityOpen}
                  setIsOpen={setIsCommunityOpen}
                  dropdownRef={communityRef}
                >
                  <DropdownLink
                    href="/forum"
                    icon={<MessageSquare size={16} />}
                    label="Forums"
                    onClick={() => setIsCommunityOpen(false)}
                  />
                  <DropdownLink
                    href="/members"
                    icon={<User size={16} />}
                    label="Members"
                    onClick={() => setIsCommunityOpen(false)}
                  />
                  <DropdownLink
                    href="/coming-soon"
                    icon={<ExternalLink size={16} />}
                    label="Discord Server"
                    onClick={() => setIsCommunityOpen(false)}
                  />
                </Dropdown>

                {/* Support Dropdown */}
                <Dropdown
                  label="Support"
                  icon={<LifeBuoy size={18} />}
                  isOpen={isSupportOpen}
                  setIsOpen={setIsSupportOpen}
                  dropdownRef={supportRef}
                >
                  <DropdownLink
                    href="/help"
                    icon={<HelpCircle size={16} />}
                    label="Help Center"
                    onClick={() => setIsSupportOpen(false)}
                  />
                  <DropdownLink
                    href="/faq"
                    icon={<Info size={16} />}
                    label="FAQ"
                    onClick={() => setIsSupportOpen(false)}
                  />
                  <DropdownLink
                    href="/privacy"
                    icon={<Shield size={16} />}
                    label="Privacy Policy"
                    onClick={() => setIsSupportOpen(false)}
                  />
                  <DropdownLink
                    href="/tos"
                    icon={<Shield size={16} />}
                    label="Terms of Service"
                    onClick={() => setIsSupportOpen(false)}
                  />
                  <DropdownLink
                    href="/coming-soon"
                    icon={<Rocket size={16} />}
                    label="Roadmap"
                    onClick={() => setIsSupportOpen(false)}
                  />
                  <DropdownLink
                    href="/contact"
                    icon={<MessageSquare size={16} />}
                    label="Contact Staff"
                    onClick={() => setIsSupportOpen(false)}
                  />
                </Dropdown>
              </nav>

              {/* Desktop Search / Utility */}
              <div className="hidden xl:flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-2 mr-2">
                  <button className="flex items-center gap-2 px-5 py-2 hover:bg-muted rounded-full text-foreground/70 font-black text-[10px] uppercase tracking-widest transition-all">
                    <User size={14} /> Login
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2 bg-secondary hover:bg-secondary/80 rounded-full text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-secondary/10">
                    <UserPlus size={14} /> Register
                  </button>
                </div>

                <div className="h-8 w-px bg-border mx-1"></div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/80 rounded-full text-primary-foreground font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
                  >
                    <Settings size={14} /> Admin Access
                  </Link>
                )}
                <button className="p-2.5 bg-muted rounded-full text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              className="xl:hidden p-2 text-foreground/70 hover:bg-muted rounded-lg ml-auto relative z-[60]"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
        {children}
        <TutorialTour />
      </main>

      {/* Site Map & Legal Footer */}
      <footer className="bg-card text-foreground border-t border-border pt-8 transition-colors duration-500">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-10">
            {/* Branding Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sagebrush rounded-2xl">
                  <PawPrint size={24} className="text-white" />
                </div>
                <span className="text-2xl font-folksy text-foreground tracking-tight">
                  Red Fox Simulator
                </span>
              </div>
              <p className="text-[13px] leading-relaxed max-w-xs font-medium text-foreground opacity-70">
                The world&apos;s premier digital kennel management system for
                red fox enthusiasts. Compete, breed, and build your legacy in
                our thriving community.
              </p>
              <div className="flex gap-4">
                <button className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all text-foreground/70 border border-border">
                  <MessageSquare size={18} />
                </button>
                <button className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all text-foreground/70 border border-border">
                  <Users size={18} />
                </button>
                <button className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all text-foreground/70 border border-border">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-foreground font-folksy text-lg flex items-center gap-2 pb-3 border-b border-border">
                Game Center
              </h4>
              <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-foreground opacity-60">
                <li>
                  <Link
                    href="/"
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="hover:text-primary transition-colors"
                  >
                    Game News
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-primary transition-colors"
                  >
                    Frequently Asked Questions
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      href="/admin"
                      className="text-primary hover:text-fire-400 transition-colors"
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-foreground font-folksy text-lg flex items-center gap-2 pb-3 border-b border-border">
                Kennel
              </h4>
              <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-foreground opacity-60">
                <li>
                  <Link
                    href="/kennel?tab=dashboard"
                    className="hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kennel"
                    className="hover:text-primary transition-colors"
                  >
                    My Foxes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/inventory"
                    className="hover:text-primary transition-colors"
                  >
                    Stockpile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/breeding"
                    className="hover:text-primary transition-colors"
                  >
                    Breeding Center
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-foreground font-folksy text-lg flex items-center gap-2 pb-3 border-b border-border">
                Economy
              </h4>
              <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-foreground opacity-60">
                <li>
                  <Link
                    href="/shop/adoption"
                    className="hover:text-primary transition-colors"
                  >
                    Foundation Adopt
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/marketplace"
                    className="hover:text-primary transition-colors"
                  >
                    Player Market
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/supplies"
                    className="hover:text-primary transition-colors"
                  >
                    Supplies & Feeds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/custom"
                    className="hover:text-primary transition-colors"
                  >
                    Custom Designer
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-foreground font-folksy text-lg flex items-center gap-2 pb-3 border-b border-border">
                Support & Community
              </h4>
              <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-foreground opacity-60">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-primary transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-primary transition-colors"
                  >
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forum"
                    className="hover:text-primary transition-colors"
                  >
                    Discussion Forums
                  </Link>
                </li>
                <li>
                  <Link
                    href="/members"
                    className="hover:text-primary transition-colors"
                  >
                    Staff Directory
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tos"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-border gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground opacity-60">
            <div className="flex items-center gap-8">
              <span className="flex items-center gap-2 text-sagebrush">
                <Shield size={16} className="opacity-70" /> Verified Kennel
                System
              </span>
              <span className="opacity-50 border-l border-moab/20 pl-8">
                Build v2.4.1
              </span>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 text-right">
              <div className="opacity-50">
                &copy; 2024 Red Fox Breeding Simulator.
              </div>
              <Link
                href="/privacy#do-not-sell"
                className="opacity-40 hover:opacity-100 hover:text-fire-600 transition-all uppercase tracking-widest text-[9px]"
              >
                Do Not Sell My Personal Information
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Menu Refined */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] xl:hidden animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Right Side Drawer */}
          <div
            className="xl:hidden fixed top-0 right-0 bottom-0 w-[300px] z-[100] bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-border"
            ref={mobileMenuRef}
          >
            {/* Drawer Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-border bg-muted/30">
              <div className="flex flex-col">
                <span className="text-xl font-folksy tracking-tight text-foreground">
                  Menu
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] text-secondary uppercase opacity-70">
                  Navigation
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors text-foreground/50 hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="flex flex-col gap-1">
                <div className="px-6 py-2 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                  Quick Links
                </div>
                <MobileNavLink
                  href="/"
                  icon={<Home size={18} />}
                  label="Home"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileNavLink
                  href="/news"
                  icon={<Info size={18} />}
                  label="Game News"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                {isAdmin && (
                  <MobileNavLink
                    href="/admin"
                    icon={<Settings size={18} />}
                    label="Admin Panel"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                )}

                <MobileCategory
                  label="Kennel"
                  icon={<Home size={18} />}
                  isOpen={isKennelOpen}
                  setIsOpen={setIsKennelOpen}
                >
                  <MobileNavLink
                    href="/kennel"
                    icon={<PawPrint size={18} />}
                    label="My Foxes"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/inventory"
                    icon={<Package size={18} />}
                    label="Inventory"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </MobileCategory>

                <MobileCategory
                  label="Breeding"
                  icon={<Heart size={18} />}
                  isOpen={isBreedingOpen}
                  setIsOpen={setIsBreedingOpen}
                >
                  <MobileNavLink
                    href="/breeding"
                    icon={<Heart size={18} />}
                    label="Breeding Center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/stud-barn"
                    icon={<Shield size={18} />}
                    label="Stud Barn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </MobileCategory>

                <MobileCategory
                  label="Shows"
                  icon={<Trophy size={18} />}
                  isOpen={isShowsOpen}
                  setIsOpen={setIsShowsOpen}
                >
                  <MobileNavLink
                    href="/shows"
                    icon={<Trophy size={18} />}
                    label="Competitive Shows"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/quests"
                    icon={<CheckSquare size={18} />}
                    label="Quests & Achievements"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </MobileCategory>

                <MobileCategory
                  label="Shops"
                  icon={<ShoppingBag size={18} />}
                  isOpen={isShopsOpen}
                  setIsOpen={setIsShopsOpen}
                >
                  <MobileNavLink
                    href="/shop/adoption"
                    icon={<Baby size={18} />}
                    label="Foundation Adoption"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/shop/supplies"
                    icon={<Package size={18} />}
                    label="Supplies & Feeds"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/shop/staff"
                    icon={<UserPlus size={18} />}
                    label="Staff & Services"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/shop/marketplace"
                    icon={<Store size={18} />}
                    label="Marketplace"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/shop/custom"
                    icon={<Star size={18} />}
                    label="Custom Foxes"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </MobileCategory>

                <MobileCategory
                  label="Community"
                  icon={<Users size={18} />}
                  isOpen={isCommunityOpen}
                  setIsOpen={setIsCommunityOpen}
                >
                  <MobileNavLink
                    href="/forum"
                    icon={<MessageSquare size={18} />}
                    label="Forums"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/members"
                    icon={<User size={18} />}
                    label="Members"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </MobileCategory>

                <MobileCategory
                  label="Support"
                  icon={<LifeBuoy size={18} />}
                  isOpen={isSupportOpen}
                  setIsOpen={setIsSupportOpen}
                >
                  <MobileNavLink
                    href="/help"
                    icon={<HelpCircle size={18} />}
                    label="Help Center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/faq"
                    icon={<Info size={18} />}
                    label="FAQ"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/privacy"
                    icon={<Shield size={18} />}
                    label="Privacy Policy"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    href="/tos"
                    icon={<Shield size={18} />}
                    label="Terms of Service"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </MobileCategory>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 bg-muted/30 border-t border-border mt-auto">
              <div className="flex items-center justify-between text-[10px] text-foreground/50 font-black uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar size={12} className="text-secondary" /> Year {year},{" "}
                  {season}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => advanceTime()}
                    className="px-3 py-1.5 bg-primary rounded-full transition text-primary-foreground font-black hover:bg-primary/80 shadow-lg shadow-primary/20"
                  >
                    Advance
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Dropdown({
  label,
  icon,
  isOpen,
  setIsOpen,
  dropdownRef,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-bold text-sm whitespace-nowrap",
          isOpen
            ? "bg-primary text-primary-foreground"
            : "text-foreground opacity-70 hover:opacity-100 hover:bg-muted",
        )}
      >
        {icon}
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-xl bg-card border border-border py-2 overflow-hidden ring-1 ring-black ring-opacity-10 animate-in fade-in zoom-in duration-150 origin-top-left z-[60] !opacity-100 shadow-2xl shadow-black/25 mb-4">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 text-foreground/80 hover:text-primary transition-colors"
    >
      {icon}
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </Link>
  );
}

function MobileCategory({
  label,
  icon,
  isOpen,
  setIsOpen,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-4 text-xs font-black uppercase tracking-widest text-foreground/70 hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>
      {isOpen && <div className="bg-muted/30 pb-2">{children}</div>}
    </div>
  );
}

function MobileNavLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-8 py-3 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-primary"
    >
      {icon}
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </Link>
  );
}
