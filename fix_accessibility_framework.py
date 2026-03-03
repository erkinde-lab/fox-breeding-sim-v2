import re
import os

def update_store():
    with open('src/lib/store.ts', 'r') as f:
        content = f.read()

    # Add to GameState interface
    if 'isDarkMode: boolean;' not in content:
        content = content.replace('export interface GameState {', 'export interface GameState {\n  // Accessibility & Personalization\n  isDarkMode: boolean;\n  colorblindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";\n  highContrast: boolean;\n  fontSize: "small" | "normal" | "large" | "xl";\n  useOpenDyslexic: boolean;\n  reducedMotion: boolean;\n  alwaysUnderlineLinks: boolean;\n  highVisibilityFocus: boolean;\n  simplifiedUI: boolean;\n  textSpacing: "normal" | "wide" | "extra";\n\n  // Actions\n  toggleDarkMode: () => void;\n  setColorblindMode: (mode: "none" | "protanopia" | "deuteranopia" | "tritanopia") => void;\n  toggleHighContrast: () => void;\n  setFontSize: (size: "small" | "normal" | "large" | "xl") => void;\n  toggleOpenDyslexic: () => void;\n  toggleReducedMotion: () => void;\n  toggleAlwaysUnderlineLinks: () => void;\n  toggleHighVisibilityFocus: () => void;\n  toggleSimplifiedUI: () => void;\n  setTextSpacing: (spacing: "normal" | "wide" | "extra") => void;')

    # Add to initial state
    if 'isDarkMode: false,' not in content:
        content = re.sub(r'\(set, get\) => \(\{', '(set, get) => ({\n      isDarkMode: false,\n      colorblindMode: "none",\n      highContrast: false,\n      fontSize: "normal",\n      useOpenDyslexic: false,\n      reducedMotion: false,\n      alwaysUnderlineLinks: false,\n      highVisibilityFocus: false,\n      simplifiedUI: false,\n      textSpacing: "normal",\n\n      toggleDarkMode: () => set((state: any) => ({ isDarkMode: !state.isDarkMode })),\n      setColorblindMode: (mode: any) => set({ colorblindMode: mode }),\n      toggleHighContrast: () => set((state: any) => ({ highContrast: !state.highContrast })),\n      setFontSize: (size: any) => set({ fontSize: size }),\n      toggleOpenDyslexic: () => set((state: any) => ({ useOpenDyslexic: !state.useOpenDyslexic })),\n      toggleReducedMotion: () => set((state: any) => ({ reducedMotion: !state.reducedMotion })),\n      toggleAlwaysUnderlineLinks: () => set((state: any) => ({ alwaysUnderlineLinks: !state.alwaysUnderlineLinks })),\n      toggleHighVisibilityFocus: () => set((state: any) => ({ highVisibilityFocus: !state.highVisibilityFocus })),\n      toggleSimplifiedUI: () => set((state: any) => ({ simplifiedUI: !state.simplifiedUI })),\n      setTextSpacing: (spacing: any) => set({ textSpacing: spacing }),', content)

    # Update version and migration
    content = re.sub(r'version: \d+', 'version: 6', content)
    migration_block = '''      migrate: (persistedState: any, version: number) => {
        if (version < 6) {
          return {
            ...persistedState,
            isDarkMode: persistedState.isDarkMode ?? false,
            colorblindMode: persistedState.colorblindMode ?? "none",
            highContrast: persistedState.highContrast ?? false,
            fontSize: persistedState.fontSize ?? "normal",
            useOpenDyslexic: persistedState.useOpenDyslexic ?? false,
            reducedMotion: persistedState.reducedMotion ?? false,
            alwaysUnderlineLinks: persistedState.alwaysUnderlineLinks ?? false,
            highVisibilityFocus: persistedState.highVisibilityFocus ?? false,
            simplifiedUI: persistedState.simplifiedUI ?? false,
            textSpacing: persistedState.textSpacing ?? "normal",
          };
        }
        return persistedState;
      },'''
    content = re.sub(r'migrate: \(persistedState: unknown, version: number\) => \{.*?\},', migration_block, content, flags=re.DOTALL)

    with open('src/lib/store.ts', 'w') as f:
        f.write(content)

def update_layout():
    with open('src/app/layout-client.tsx', 'r') as f:
        content = f.read()

    if 'ColorblindFilters' not in content:
        content = content.replace("import { TutorialTour } from '@/components/TutorialTour';",
                                  "import { TutorialTour } from '@/components/TutorialTour';\nimport { ColorblindFilters } from '@/components/ColorblindFilters';")

    destructuring_match = re.search(r'const \{.*?\} = useGameStore\(\);', content, re.DOTALL)
    if destructuring_match:
        new_destructuring = '''  const {
    gold,
    gems,
    year,
    season,
    advanceTime,
    isAdmin,
    isDarkMode,
    colorblindMode,
    highContrast,
    fontSize,
    useOpenDyslexic,
    reducedMotion,
    alwaysUnderlineLinks,
    highVisibilityFocus,
    simplifiedUI,
    textSpacing,
  } = useGameStore();'''
        content = content.replace(destructuring_match.group(0), new_destructuring)

    accessibility_effect = '''
  useEffect(() => {
    const root = document.documentElement;

    // Cleanup old classes
    const classesToRemove = [
      'protanopia', 'protanomaly', 'deuteranopia', 'deuteranomaly',
      'tritanopia', 'tritanomaly', 'achromatopsia', 'achromatomaly',
      'high-contrast', 'use-opendyslexic', 'reduced-motion',
      'underline-links', 'high-visibility-focus', 'simplified-ui', 'dark'
    ];
    root.classList.remove(...classesToRemove);
    root.classList.remove('font-size-small', 'font-size-normal', 'font-size-large', 'font-size-xl');
    root.classList.remove('text-spacing-normal', 'text-spacing-wide', 'text-spacing-extra');

    // Apply new classes
    if (colorblindMode !== 'none') root.classList.add(colorblindMode);
    if (highContrast) root.classList.add('high-contrast');
    if (useOpenDyslexic) root.classList.add('use-opendyslexic');
    if (reducedMotion) root.classList.add('reduced-motion');
    if (alwaysUnderlineLinks) root.classList.add('underline-links');
    if (highVisibilityFocus) root.classList.add('high-visibility-focus');
    if (simplifiedUI) root.classList.add('simplified-ui');
    if (isDarkMode) root.classList.add('dark');

    root.classList.add(`font-size-${fontSize}`);
    root.classList.add(`text-spacing-${textSpacing}`);
  }, [
    colorblindMode, highContrast, fontSize, useOpenDyslexic,
    reducedMotion, alwaysUnderlineLinks, highVisibilityFocus,
    simplifiedUI, textSpacing, isDarkMode
  ]);
'''
    content = content.replace('  useEffect(() => {', accessibility_effect + '\n  useEffect(() => {', 1)
    content = content.replace('<TutorialTour />', '<ColorblindFilters />\n      <TutorialTour />')

    with open('src/app/layout-client.tsx', 'w') as f:
        f.write(content)

def update_tutorial():
    with open('src/components/TutorialTour.tsx', 'r') as f:
        content = f.read()
    insertion = '''    {
      target: 'body',
      title: 'Personalization & Accessibility',
      content: 'You can customize your experience in the Settings menu, including Dark Mode, high contrast, and other accessibility features.',
      icon: <Accessibility className="text-primary" size={24} />,
    },'''
    content = content.replace("import { Heart, Diamond, Trophy, ShoppingBag, Home, Users, HelpCircle, CheckCircle2, Coins } from 'lucide-react';",
                              "import { Heart, Diamond, Trophy, ShoppingBag, Home, Users, HelpCircle, CheckCircle2, Coins, Accessibility } from 'lucide-react';")
    content = content.replace('const steps = [', 'const steps = [\n' + insertion)
    with open('src/components/TutorialTour.tsx', 'w') as f:
        f.write(content)

def update_shop():
    with open('src/app/shop/supplies/page.tsx', 'r') as f:
        content = f.read()
    content = content.replace("tabs = ['Items', 'Feeds', 'All']", "tabs = ['All', 'Items', 'Feeds']")
    with open('src/app/shop/supplies/page.tsx', 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_store()
    update_layout()
    update_tutorial()
    update_shop()
