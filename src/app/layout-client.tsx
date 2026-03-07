"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import {
  Menu,
  X,
  ChevronDown,
  Calendar,
  Coins,
  Diamond,
  Plus,
  Moon,
  Sun,
  Settings,
  HelpCircle,
  Home,
  Heart,
  Trophy,
  ShoppingBag,
  Users,
  MessageSquare,
  User,
  Info,
  Shield, Crown,
  LifeBuoy,
  LogOut,
  FastForward,
  CheckSquare,
  Package,
  PawPrint,
  ShieldCheck,
  UserPlus,
  Store,
  Star,
  Megaphone,
  Baby,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TutorialTour } from "@/components/TutorialTour";
import { ColorblindFilters } from "@/components/ColorblindFilters";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    gold,
    gems,
    year,
    season,
    advanceTime,
    isAdmin,
    isDarkMode,
    toggleDarkMode,
    toggleAdminMode,
    // Accessibility Settings
    colorblindMode,
    highContrast,
    fontSize,
    useOpenDyslexic,
    reducedMotion,
    alwaysUnderlineLinks,
    highVisibilityFocus,
    simplifiedUI,
    textSpacing,
    broadcast,
    bannerUrl,
    bannerXPosition,
    bannerYPosition,
    members,
    currentMemberId,
  } = useGameStore();
  const currentPlayer = members.find((m) => m.id === currentMemberId);
  const isStaff = isAdmin || currentPlayer?.role === "administrator" || currentPlayer?.role === "moderator";
  const isActualAdmin = isAdmin || currentPlayer?.role === "administrator";


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isKennelOpen, setIsKennelOpen] = useState(false);
  const [isBreedingOpen, setIsBreedingOpen] = useState(false);
  const [isShowsOpen, setIsShowsOpen] = useState(false);
  const [isShopsOpen, setIsShopsOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mobile-specific dropdown states
  const [isMobileKennelOpen, setIsMobileKennelOpen] = useState(false);
  const [isMobileBreedingOpen, setIsMobileBreedingOpen] = useState(false);
  const [isMobileShowsOpen, setIsMobileShowsOpen] = useState(false);
  const [isMobileShopsOpen, setIsMobileShopsOpen] = useState(false);
  const [isMobileCommunityOpen, setIsMobileCommunityOpen] = useState(false);
  const [isMobileSupportOpen, setIsMobileSupportOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Handle accessibility classes on HTML element
  useEffect(() => {
    const root = document.documentElement;

    // Cleanup old classes
    const classesToRemove = [
      "protanopia",
      "protanomaly",
      "deuteranopia",
      "deuteranomaly",
      "tritanopia",
      "tritanomaly",
      "achromatopsia",
      "achromatomaly",
      "high-contrast",
      "use-opendyslexic",
      "reduced-motion",
      "underline-links",
      "high-visibility-focus",
      "simplified-ui",
    ];
    root.classList.remove(...classesToRemove);
    root.classList.remove(
      "font-size-small",
      "font-size-normal",
      "font-size-large",
      "font-size-xl",
    );
    root.classList.remove(
      "text-spacing-normal",
      "text-spacing-wide",
      "text-spacing-extra",
    );

    // Apply new classes
    if (colorblindMode !== "none") root.classList.add(colorblindMode);
    if (highContrast) root.classList.add("high-contrast");
    if (useOpenDyslexic) root.classList.add("use-opendyslexic");
    if (reducedMotion) root.classList.add("reduced-motion");
    if (alwaysUnderlineLinks) root.classList.add("underline-links");
    if (highVisibilityFocus) root.classList.add("high-visibility-focus");
    if (simplifiedUI) root.classList.add("simplified-ui");

    root.classList.add(`font-size-${fontSize}`);
    root.classList.add(`text-spacing-${textSpacing}`);

    // Apply SVG filter for colorblindness
    if (colorblindMode !== "none") {
      root.style.filter = `url(#${colorblindMode})`;
    } else {
      root.style.filter = "";
    }
  }, [
    colorblindMode,
    highContrast,
    fontSize,
    useOpenDyslexic,
    reducedMotion,
    alwaysUnderlineLinks,
    highVisibilityFocus,
    simplifiedUI,
    textSpacing,
  ]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-rounded selection:bg-primary/30 transition-colors duration-500">
      <ColorblindFilters />
      <TutorialTour />
      {/* Global Broadcast Banner */}
      {broadcast && (
        <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-top duration-500 border-b border-primary-foreground/10 relative z-[70]">
          <div className="flex items-center justify-center gap-3">
            <Megaphone size={14} className="animate-pulse" />
            <span>{broadcast}</span>
          </div>
        </div>
      )}
      {/* Top Utility Bar */}
      <div
        className="bg-card text-[10px] font-black uppercase tracking-[0.2em] text-foreground py-2.5 px-4 sm:px-6 lg:px-8 flex justify-between items-center z-[60] border-b border-border"
        role="region"
        aria-label="User and Game Status"
      >
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <Calendar size={12} className="opacity-70" /> Year {year},{" "}
            <span className="font-bold">{season}</span>
          </span>
          {isActualAdmin && (
            <button
              onClick={() => advanceTime()}
              className="hover:bg-foreground/10 px-3 py-1 rounded-full transition-all flex items-center gap-1.5 border border-foreground/20"
            >
              <FastForward size={12} /> Advance Season
            </button>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div
            id="tutorial-currency"
            className="flex items-center gap-4 border-foreground/20 sm:pr-6 sm:border-r"
          >
            <span className="flex items-center gap-1.5 hover:text-gold dark:hover:text-yellow-200 transition-colors">
              <Coins
                size={12}
                className="text-yellow-500 dark:text-yellow-200"
              />{" "}
              {gold.toLocaleString()} Gold
            </span>
            <Link
              href="/shop/gems"
              className="flex items-center gap-1.5 hover:text-gems dark:hover:text-cyan-200 transition-colors group"
            >
              <Diamond
                size={12}
                className="text-gems dark:text-cyan-200 group-hover:scale-110 transition-transform"
              />
              {gems.toLocaleString()} Gems
              <Plus
                size={10}
                className="bg-foreground/10 rounded-full p-0.5 ml-0.5"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleDarkMode()}
              className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors border border-foreground/10"
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
        className="w-full h-[320px] sm:h-[420px] bg-cover relative shadow-inner overflow-hidden border-b-8 border-sagebrush/20"
        style={{
          backgroundImage: `url(${bannerUrl})`,
          backgroundPosition: `center ${bannerYPosition}`,
        }}
        title={`Banner position: Y=${bannerYPosition}`}
        onMouseEnter={() =>
          console.log("Banner CSS applied:", {
            bannerYPosition,
    members,
    currentMemberId,
            cssPosition: `center ${bannerYPosition}`,
          })
        }
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--banner-overlay)] via-[var(--banner-overlay)]/40 to-transparent flex items-end pb-8">
          <div className="w-full px-4 sm:px-6 lg:px-8 text-left">
            <div className="text-foreground max-w-2xl">
              <div className="inline-flex items-center gap-4 group mb-4">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleAdminMode();
                    }}
                    aria-label="Toggle Admin Mode"
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-[2rem] rotate-3 hover:rotate-6 transition-transform flex items-center justify-center shadow-xl shadow-primary/20"
                  >
                    <PawPrint
                      className="text-white -rotate-3 hover:-rotate-6 transition-transform"
                      size={40}
                    />
                  </button>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-lg rotate-12 flex items-center justify-center shadow-lg pointer-events-none">
                    <Star className="text-white" size={12} />
                  </div>
                </div>
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <h1 className="text-4xl sm:text-6xl font-folksy tracking-tight leading-none">
                    Red Fox <span className="text-primary">Simulator</span>
                  </h1>
                  <p className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] opacity-60 mt-2">
                    Est. {year} • Rare Genetics • Show Excellence
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8 hidden lg:block opacity-20 pointer-events-none">
          <PawPrint size={120} className="rotate-12" />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 bg-card/90 backdrop-blur-md border-b border-border z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-2">
              <Link
                href="/kennel"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm",
                  pathname === "/kennel"
                    ? "bg-primary text-primary-foreground shadow-btn-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                )}
              >
                <PawPrint size={16} />
                My Kennel
              </Link>
              <div className="h-6 w-px bg-border mx-2" />

              <Dropdown
                label="Shops"
                icon={<ShoppingBag size={18} />}
                isOpen={isShopsOpen}
                setIsOpen={setIsShopsOpen}
                dropdownRef={useRef(null)}
              >
                <DropdownLink
                  href="/foundation-fox-store"
                  icon={<ShoppingCart size={16} />}
                  label="Foundations"
                  onClick={() => setIsShopsOpen(false)}
                />
                <DropdownLink
                  href="/shop/supplies"
                  icon={<Package size={16} />}
                  label="Supplies"
                  onClick={() => setIsShopsOpen(false)}
                />
                <DropdownLink
                  href="/shop/staff"
                  icon={<UserPlus size={16} />}
                  label="Staff"
                  onClick={() => setIsShopsOpen(false)}
                />
                <DropdownLink
                  href="/shop/marketplace"
                  icon={<Store size={16} />}
                  label="Market"
                  onClick={() => setIsShopsOpen(false)}
                />
                <DropdownLink
                  href="/shop/custom"
                  icon={<Star size={16} />}
                  label="Customs"
                  onClick={() => setIsShopsOpen(false)}
                />
              </Dropdown>

              <Dropdown
                label="Shows"
                icon={<Trophy size={18} />}
                isOpen={isShowsOpen}
                setIsOpen={setIsShowsOpen}
                dropdownRef={useRef(null)}
              >
                <DropdownLink
                  href="/shows"
                  icon={<Trophy size={16} />}
                  label="Arena"
                  onClick={() => setIsShowsOpen(false)}
                />
                <DropdownLink
                  href="/quests"
                  icon={<CheckSquare size={16} />}
                  label="Quests"
                  onClick={() => setIsShowsOpen(false)}
                />
              </Dropdown>

              <Dropdown
                label="Breeding"
                icon={<Heart size={18} />}
                isOpen={isBreedingOpen}
                setIsOpen={setIsBreedingOpen}
                dropdownRef={useRef(null)}
              >
                <DropdownLink
                  href="/breeding"
                  icon={<Heart size={16} />}
                  label="Center"
                  onClick={() => setIsBreedingOpen(false)}
                />
                <DropdownLink
                  href="/stud-barn"
                  icon={<Shield size={16} />}
                  label="Studs"
                  onClick={() => setIsBreedingOpen(false)}
                />
              </Dropdown>

              <Dropdown
                label="Community"
                icon={<Users size={18} />}
                isOpen={isCommunityOpen}
                setIsOpen={setIsCommunityOpen}
                dropdownRef={useRef(null)}
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
                  label="Search"
                  onClick={() => setIsCommunityOpen(false)}
                />
              </Dropdown>
            </div>

            {/* Logo area (center/left on mobile) */}
            <div className="flex items-center xl:hidden">
              <Link href="/" className="font-folksy text-2xl text-primary">
                RF<span className="text-secondary">Sim</span>
              </Link>
            </div>

            {/* Profile/Actions Area */}
            <div className="flex items-center gap-3">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-[1.5rem] border border-border bg-card hover:bg-muted transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-2xl bg-sagebrush/20 flex items-center justify-center text-sagebrush">
                    <User size={20} />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black uppercase tracking-wider leading-none">
                        {currentPlayer?.name || "Kennel #123"}
                      </p>
                      {currentPlayer?.role === "administrator" && <Crown size={12} className="text-gold" />}
                      {currentPlayer?.role === "moderator" && <Shield size={12} className="text-info" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">
                      {currentPlayer?.role || "Player"} Member
                    </p>
                  </div>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform",
                      isProfileOpen ? "rotate-180" : "",
                    )}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-[2rem] bg-card border-2 border-primary/10 py-3 shadow-2xl z-[60] animate-in fade-in zoom-in slide-in-from-top-4">
                    <div className="px-6 py-4 border-b border-border mb-2">
                      <p className="text-xs font-black uppercase text-primary">
                        Your Account
                      </p>
                      <p className="text-[10px] text-muted-foreground font-bold mt-0.5">
                        Member since Year 1
                      </p>
                    </div>
                    {isStaff && (
                      <DropdownLink
                        href="/admin"
                        icon={<Shield size={16} />}
                        label="Admin Panel"
                        onClick={() => setIsProfileOpen(false)}
                      />
                    )}
                    <DropdownLink
                      href="/kennel"
                      icon={<PawPrint size={16} />}
                      label="Dashboard"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <DropdownLink
                      href="/inventory"
                      icon={<Package size={16} />}
                      label="Inventory"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <DropdownLink
                      href="/settings"
                      icon={<Settings size={16} />}
                      label="Settings"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="my-2 border-t border-border mx-4" />
                    <button className="w-full flex items-center gap-3 px-6 py-3 text-destructive hover:bg-destructive/5 transition-colors">
                      <LogOut size={16} />
                      <span className="text-xs font-black uppercase tracking-wide">
                        Logout
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="xl:hidden p-3 rounded-2xl bg-primary text-white shadow-btn-primary"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground border-t border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                  <PawPrint size={24} />
                </div>
                <span className="font-folksy text-2xl">
                  Red Fox <span className="text-primary">Sim</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
                The premier fox breeding and showing simulator. Dive into
                complex genetics, compete for prestige, and build your legacy.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <div className="w-4 h-4 bg-muted-foreground/40 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-foreground/40">
                Kennel
              </h4>
              <ul className="space-y-4 text-sm font-bold">
                <li>
                  <Link
                    href="/kennel"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    My Kennel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/inventory"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stud-barn"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Stud Barn
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-foreground/40">
                Game
              </h4>
              <ul className="space-y-4 text-sm font-bold">
                <li>
                  <Link
                    href="/shop/supplies"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Market
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shows"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Show Arena
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forum"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forums
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-foreground/40">
                Support
              </h4>
              <ul className="space-y-4 text-sm font-bold">
                <li>
                  <Link
                    href="/news"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    News
                  </Link>
                </li>
                <li>
                  <Link
                    href="/credits"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Credits
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tos"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              © {new Date().getFullYear()} Red Fox Simulator. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-secondary" /> Secure
                Gameplay
              </span>
              <span className="flex items-center gap-2">
                <Heart size={14} className="text-primary" /> Community Driven
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-[320px] bg-card z-[80] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white">
                  <PawPrint size={20} />
                </div>
                <div>
                  <h4 className="font-folksy text-lg text-foreground">Menu</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                    Navigation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 hover:bg-muted rounded-2xl transition-colors border border-border"
              >
                <X size={24} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-grow overflow-y-auto relative z-[90]">
              <div className="p-4 space-y-2">
                {isStaff && (
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
                  isOpen={isMobileKennelOpen}
                  setIsOpen={setIsMobileKennelOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
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
                  isOpen={isMobileBreedingOpen}
                  setIsOpen={setIsMobileBreedingOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
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
                  isOpen={isMobileShowsOpen}
                  setIsOpen={setIsMobileShowsOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
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
                  isOpen={isMobileShopsOpen}
                  setIsOpen={setIsMobileShopsOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                >
                  <MobileNavLink
                    href="/foundation-fox-store"
                    icon={<ShoppingCart size={18} />}
                    label="Foundations"
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
                  isOpen={isMobileCommunityOpen}
                  setIsOpen={setIsMobileCommunityOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
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
                  isOpen={isMobileSupportOpen}
                  setIsOpen={setIsMobileSupportOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
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
                {isActualAdmin && (
                  <button
                    onClick={() => advanceTime()}
                    className="px-3 py-1.5 bg-primary rounded-full transition text-primary-foreground font-black hover:bg-primary/80 shadow-btn-primary"
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
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, dropdownRef, setIsOpen]);

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
        <div className="absolute left-0 mt-2 w-56 rounded-xl bg-card/ui-blur border border-border py-2 overflow-hidden backdrop-blur-ui ring-1 ring-black ring-opacity-10 animate-in fade-in zoom-in duration-150 origin-top-left z-[60] !opacity-100 shadow-popover mb-4">
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
  href,
  setIsMobileMenuOpen,
}: {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  children: React.ReactNode;
  href?: string;
  setIsMobileMenuOpen: (v: boolean) => void;
}) {
  const router = useRouter();

  const handleHeaderClick = () => {
    console.log("MobileCategory header clicked:", { label, href, isOpen });
    console.log(`About to toggle ${label} dropdown, current state: ${isOpen}`);
    if (href) {
      console.log("Navigating to:", href);
      router.push(href);
      setIsMobileMenuOpen(false);
    } else {
      console.log(`Toggling ${label} dropdown, new state: ${!isOpen}`);
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="border-t border-border">
      <button
        onClick={handleHeaderClick}
        className="w-full flex items-center justify-between px-4 py-4 text-xs font-black uppercase tracking-widest text-foreground/70 hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {!href && (
          <ChevronDown
            size={14}
            className={cn(
              "transition-transform duration-200",
              isOpen ? "rotate-180" : "",
            )}
          />
        )}
      </button>
      {isOpen && !href && <div className="bg-muted/30 pb-2">{children}</div>}
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
  const handleClick = () => {
    console.log(`MobileNavLink clicked: ${label} -> ${href}`);
    onClick();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="flex items-center gap-3 px-8 py-3 rounded-lg hover:bg-muted transition-colors text-foreground/80 hover:text-primary"
    >
      {icon}
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </Link>
  );
}
