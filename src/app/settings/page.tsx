"use client";

import React, { useState } from "react";
import { useGameStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  Shield,
  Eye,
  Type,
  Bell,
  Palette,
  Camera,
  Check,
  ChevronRight,
  Monitor,
  Layout,
  MousePointer2,
  Accessibility,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/components/NotificationProvider";

const AVATAR_COLORS = [
  "bg-fire-500",
  "bg-amber-500",
  "bg-moss-500",
  "bg-cyan-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-earth-600",
  "bg-slate-700",
];



export default function SettingsPage() {
  const { addNotification } = useNotifications();
  const {
    members,
    // Accessibility State
    colorblindMode,
    highContrast,
    fontSize,
    useOpenDyslexic,
    reducedMotion,
    alwaysUnderlineLinks,
    highVisibilityFocus,
    simplifiedUI,
    textSpacing,
    isDarkMode,
    // Actions
    toggleColorblindMode,
    toggleHighContrast,
    setFontSize,
    toggleOpenDyslexic,
    toggleReducedMotion,
    toggleAlwaysUnderlineLinks,
    toggleHighVisibilityFocus,
    toggleSimplifiedUI,
    setTextSpacing,
    toggleDarkMode,
  } = useGameStore();

  const player = members[0];
  const [activeTab, setActiveTab] = useState<"profile" | "accessibility">(
    "profile",
  );

  const handleSave = () => {
    addNotification("Settings saved successfully!", "success");
    // Refresh to ensure all global styles are reapplied and state is fully synced
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
          <Settings className="text-primary" /> Kennel Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Personalize your experience and configure accessibility options.
        </p>
      </div>

      <div className="flex gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
            activeTab === "profile"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          <User size={18} /> Profile
        </button>
        <button
          onClick={() => setActiveTab("accessibility")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
            activeTab === "accessibility"
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          <Accessibility size={18} /> Accessibility
        </button>
      </div>

      {activeTab === "profile" ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">


          <Card className="folk-card bg-muted/30 border-dashed border-2">
            <CardContent className="p-8 text-center space-y-4">
              <Shield size={32} className="mx-auto text-muted-foreground/30" />
              <div>
                <h3 className="font-black text-lg italic text-foreground/50">
                  Account Security
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  Advanced account management tools and MFA settings are coming
                  soon in the next major update.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visual Settings */}
            <Card className="folk-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg italic flex items-center gap-2">
                  <Eye className="text-primary" size={18} /> Visual Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                      isDarkMode ? "bg-primary" : "bg-muted border border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                        isDarkMode ? "translate-x-6 bg-white" : "translate-x-0 bg-white shadow-sm",
                      )}
                    >
                      {isDarkMode && <Check size={12} className="text-primary" />}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">High Contrast</p>
                    <p className="text-xs text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <button
                    onClick={toggleHighContrast}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                      highContrast ? "bg-primary" : "bg-muted border border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                        highContrast
                          ? "translate-x-6 bg-white"
                          : "translate-x-0 bg-white shadow-sm",
                      )}
                    >
                      {highContrast && <Check size={12} className="text-primary" />}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Colorblind Friendly</p>
                    <p className="text-xs text-muted-foreground">
                      Universal colorblind-friendly palette
                    </p>
                  </div>
                  <button
                    onClick={() => toggleColorblindMode(colorblindMode === "protanopia" ? "none" : "protanopia")}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                      colorblindMode !== "none"
                        ? "bg-primary"
                        : "bg-muted border border-border",
                    )}
                    aria-label="Toggle Colorblind Mode"
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                        colorblindMode !== "none"
                          ? "translate-x-6 bg-white"
                          : "translate-x-0 bg-white shadow-sm",
                      )}
                    >
                      {colorblindMode !== "none" && (
                        <Check size={12} className="text-primary" />
                      )}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">Reduced Motion</p>
                    <p className="text-xs text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <button
                    onClick={toggleReducedMotion}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                      reducedMotion ? "bg-primary" : "bg-muted border border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                        reducedMotion
                          ? "translate-x-6 bg-white"
                          : "translate-x-0 bg-white shadow-sm",
                      )}
                    >
                      {reducedMotion && <Check size={12} className="text-primary" />}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Typography Settings */}
            <Card className="folk-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg italic flex items-center gap-2">
                  <Type className="text-primary" size={18} /> Text & Reading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-bold">Base Font Size</p>
                  <div className="grid grid-cols-4 gap-2">
                    {["small", "normal", "large", "xl"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size as any)}
                        className={cn(
                          "py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                          fontSize === size
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "border-border text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">OpenDyslexic</p>
                    <p className="text-xs text-muted-foreground">
                      Use a specialized font for easier reading
                    </p>
                  </div>
                  <button
                    onClick={toggleOpenDyslexic}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                      useOpenDyslexic
                        ? "bg-primary"
                        : "bg-muted border border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                        useOpenDyslexic
                          ? "translate-x-6 bg-white"
                          : "translate-x-0 bg-white shadow-sm",
                      )}
                    >
                      {useOpenDyslexic && (
                        <Check size={12} className="text-primary" />
                      )}
                    </div>
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold">Text Spacing</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["normal", "wide", "extra"].map((spacing) => (
                      <button
                        key={spacing}
                        onClick={() => setTextSpacing(spacing as any)}
                        className={cn(
                          "py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                          textSpacing === spacing
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "border-border text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {spacing}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interaction Settings */}
            <Card className="folk-card md:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg italic flex items-center gap-2">
                  <Layout className="text-primary" size={18} /> Interface & Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center justify-between md:flex-col md:items-start md:gap-4">
                  <div>
                    <p className="font-bold">Underline Links</p>
                    <p className="text-xs text-muted-foreground">
                      Always show underlines for clickable links
                    </p>
                  </div>
                  <button
                    onClick={toggleAlwaysUnderlineLinks}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                      alwaysUnderlineLinks
                        ? "bg-primary"
                        : "bg-muted border border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                        alwaysUnderlineLinks
                          ? "translate-x-6 bg-white"
                          : "translate-x-0 bg-white shadow-sm",
                      )}
                    >
                      {alwaysUnderlineLinks && (
                        <Check size={12} className="text-primary" />
                      )}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-start md:gap-4">
                  <div>
                    <p className="font-bold">High Visibility Focus</p>
                    <p className="text-xs text-muted-foreground">
                      Bold outlines for keyboard navigation
                    </p>
                  </div>
                  <button
                    onClick={toggleHighVisibilityFocus}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                      highVisibilityFocus
                        ? "bg-primary"
                        : "bg-muted border border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                        highVisibilityFocus
                          ? "translate-x-6 bg-white"
                          : "translate-x-0 bg-white shadow-sm",
                      )}
                    >
                      {highVisibilityFocus && (
                        <Check size={12} className="text-primary" />
                      )}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-start md:gap-4">
                  <div>
                    <p className="font-bold">Simplified UI</p>
                    <p className="text-xs text-muted-foreground">
                      Remove complex decorative elements
                    </p>
                  </div>
                  <button
                    onClick={toggleSimplifiedUI}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                      simplifiedUI ? "bg-primary" : "bg-muted border border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                        simplifiedUI
                          ? "translate-x-6 bg-white"
                          : "translate-x-0 bg-white shadow-sm",
                      )}
                    >
                      {simplifiedUI && <Check size={12} className="text-primary" />}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="pt-8 border-t border-border flex justify-end gap-3">
        <Button
          variant="outline"
          className="px-8 rounded-xl font-bold border-2"
          onClick={() => window.location.href = '/'}
        >
          Cancel
        </Button>
        <Button variant="ghost" className="px-6 rounded-xl font-bold text-muted-foreground hover:text-primary" onClick={() => window.location.reload()}>Refresh App</Button>
        <Button
          className="px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 h-12"
          onClick={handleSave}
        >
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
