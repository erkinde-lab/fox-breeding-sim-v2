"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BroadcastBanner } from "@/components/layout/BroadcastBanner";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const store = useGameStore();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    store.initializeGame?.();
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen flex flex-col font-sans ${store.isDarkMode ? "dark" : ""}`}>
      <BroadcastBanner
        message={store.broadcast}
        onClear={() => store.setBroadcast(null)}
      />

      <SiteHeader
        gold={store.gold}
        gems={store.gems}
        isDarkMode={store.isDarkMode}
        toggleDarkMode={store.toggleDarkMode}
        onOpenSettings={() => {}} // Placeholder
      />

      <main className="flex-grow bg-background text-foreground transition-colors duration-300">
        {children}
      </main>

      <footer className="border-t py-6 bg-muted/30">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Red Fox Sim. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/news" className="hover:text-fire-600 transition-colors">News</Link>
            <Link href="/credits" className="hover:text-fire-600 transition-colors">Credits</Link>
            <Link href="/settings" className="hover:text-fire-600 transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple Link wrapper for the footer
function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>{children}</a>
  );
}
