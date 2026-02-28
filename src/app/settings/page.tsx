"use client";

import React from "react";
import { useGameStore } from "@/lib/store";
import {
  Settings,
  Eye,
  Type,
  Move,
  Link as LinkIcon,
  Check,
  Sun,
  Moon,
  Contrast,
  Accessibility,
  CheckSquare,
  Layout,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const {
    isDarkMode,
    toggleDarkMode,
    colorblindMode,
    toggleColorblindMode,
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    useOpenDyslexic,
    toggleOpenDyslexic,
    reducedMotion,
    toggleReducedMotion,
    alwaysUnderlineLinks,
    toggleAlwaysUnderlineLinks,
    setTextSpacing,
    textSpacing,
    toggleSimplifiedUI,
    simplifiedUI,
    toggleHighVisibilityFocus,
    highVisibilityFocus,
  } = useGameStore();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-apricot/20 rounded-2xl text-apricot">
          <Settings size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-folksy">Settings</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visual Settings */}
        <section
          className="folk-card p-8 space-y-6"
          role="group"
          aria-labelledby="visual-settings-title"
        >
          <div className="flex items-center gap-3 mb-2">
            <Eye className="text-primary" size={24} />
            <h2 id="visual-settings-title" className="text-2xl font-folksy">
              Visual Appearance
            </h2>
          </div>

          <div className="space-y-4">
            {/* Dark Mode */}
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
                aria-label="Toggle Dark Mode"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                    isDarkMode
                      ? "translate-x-6 bg-white"
                      : "translate-x-0 bg-white shadow-sm",
                  )}
                >
                  {isDarkMode ? (
                    <Moon size={12} className="text-primary" />
                  ) : (
                    <Sun size={12} className="text-amber-500" />
                  )}
                </div>
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">High Contrast</p>
                <p className="text-xs text-muted-foreground">
                  Increase contrast for better readability
                </p>
              </div>
              <button
                onClick={toggleHighContrast}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                  highContrast ? "bg-primary" : "bg-muted border border-border",
                )}
                aria-label="Toggle High Contrast"
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

            {/* Colorblind Mode */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Colorblind Friendly</p>
                <p className="text-xs text-muted-foreground">
                  Universal colorblind-friendly palette
                </p>
              </div>
              <button
                onClick={toggleColorblindMode}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                  colorblindMode
                    ? "bg-primary"
                    : "bg-muted border border-border",
                )}
                aria-label="Toggle Colorblind Mode"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                    colorblindMode
                      ? "translate-x-6 bg-white"
                      : "translate-x-0 bg-white shadow-sm",
                  )}
                >
                  {colorblindMode && (
                    <Check size={12} className="text-primary" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Text & Fonts */}
        <section
          className="folk-card p-8 space-y-6"
          role="group"
          aria-labelledby="visual-settings-title"
        >
          <div className="flex items-center gap-3 mb-2">
            <Type className="text-primary" size={24} />
            <h2 id="typography-settings-title" className="text-2xl font-folksy">
              Typography
            </h2>
          </div>

          <div className="space-y-6">
            {/* Font Size */}
            <div>
              <p className="font-bold mb-3">Font Size</p>
              <div className="grid grid-cols-4 gap-2">
                {(["small", "normal", "large", "xl"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={cn(
                      "py-2 rounded-xl text-xs font-bold uppercase transition-all border",
                      fontSize === size
                        ? "bg-primary text-white border-primary"
                        : "bg-muted/50 border-border hover:border-primary/50",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Spacing */}
            <div>
              <p className="font-bold mb-3">Text Spacing</p>
              <div className="grid grid-cols-3 gap-2">
                {(["normal", "wide", "extra"] as const).map((spacing) => (
                  <button
                    key={spacing}
                    onClick={() => setTextSpacing(spacing)}
                    className={cn(
                      "py-2 rounded-xl text-xs font-bold uppercase transition-all border",
                      textSpacing === spacing
                        ? "bg-primary text-white border-primary"
                        : "bg-muted/50 border-border hover:border-primary/50",
                    )}
                  >
                    {spacing}
                  </button>
                ))}
              </div>
            </div>

            {/* OpenDyslexic */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-bold">OpenDyslexic Font</p>
                <p className="text-xs text-muted-foreground">
                  Switch to a dyslexia-friendly typeface
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
                aria-label="Toggle OpenDyslexic Font"
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
          </div>
        </section>

        {/* Accessibility Extras */}
        <section
          className="folk-card p-8 space-y-6 md:col-span-2"
          role="group"
          aria-labelledby="extra-settings-title"
        >
          <div className="flex items-center gap-3 mb-2">
            <Accessibility className="text-primary" size={24} />
            <h2 id="extra-settings-title" className="text-2xl font-folksy">
              Additional Accessibility
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <Move size={18} />
                </div>
                <div>
                  <p className="font-bold">Reduced Motion</p>
                  <p className="text-xs text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
              </div>
              <button
                onClick={toggleReducedMotion}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                  reducedMotion
                    ? "bg-primary"
                    : "bg-muted border border-border",
                )}
                aria-label="Toggle Reduced Motion"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-transform",
                    reducedMotion
                      ? "translate-x-6 bg-white"
                      : "translate-x-0 bg-white shadow-sm",
                  )}
                >
                  {reducedMotion && (
                    <Check size={12} className="text-primary" />
                  )}
                </div>
              </button>
            </div>

            {/* Always Underline Links */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <LinkIcon size={18} />
                </div>
                <div>
                  <p className="font-bold">Underline Links</p>
                  <p className="text-xs text-muted-foreground">
                    Always show underlines for all links
                  </p>
                </div>
              </div>
              <button
                onClick={toggleAlwaysUnderlineLinks}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                  alwaysUnderlineLinks
                    ? "bg-primary"
                    : "bg-muted border border-border",
                )}
                aria-label="Toggle Underline Links"
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
            {/* High Visibility Focus */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <CheckSquare size={18} />
                </div>
                <div>
                  <p className="font-bold">Enhanced Focus</p>
                  <p className="text-xs text-muted-foreground">
                    High-visibility outlines for keyboard focus
                  </p>
                </div>
              </div>
              <button
                onClick={toggleHighVisibilityFocus}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                  highVisibilityFocus
                    ? "bg-primary"
                    : "bg-muted border border-border",
                )}
                aria-label="Toggle Enhanced Focus"
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

            {/* Simplified UI */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <Layout size={18} />
                </div>
                <div>
                  <p className="font-bold">Simplified UI</p>
                  <p className="text-xs text-muted-foreground">
                    Remove complex shadows and gradients
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSimplifiedUI}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors flex items-center px-1",
                  simplifiedUI ? "bg-primary" : "bg-muted border border-border",
                )}
                aria-label="Toggle Simplified UI"
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
          </div>
        </section>
      </div>

      <div className="mt-12 text-center text-xs text-muted-foreground">
        <p>
          Your preferences are saved locally and will be applied automatically.
        </p>
      </div>
    </div>
  );
}
