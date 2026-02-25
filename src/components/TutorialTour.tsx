'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, Info, HelpCircle, Heart, Trophy, ShoppingBag, Home, Diamond, ShieldCheck } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const steps = [
  {
    title: "Welcome to Red Fox Simulator!",
    content: "We're excited to have you! You've been given 10,000 Gold and 100 Gems to start building your fox legacy. Let's take a quick tour.",
    icon: <Info className="text-primary" size={24} />,
    path: "/",
  },
  {
    title: "The Rules of the Game",
    content: "Your goal is to breed, raise, and show high-quality red foxes. Keep them healthy, compete in shows for gold, and build a world-class kennel through careful genetic selection.",
    icon: <ShieldCheck className="text-secondary" size={24} />,
    path: "/",
  },
  {
    title: "Your First Foxes",
    content: "Start your breeding program at the Adoption Kennel. Here you can find 'Foundational' foxes with known pedigrees to get you started.",
    icon: <Heart className="text-red-500" size={24} />,
    path: "/shop/adoption",
  },
  {
    title: "The Custom Designer",
    content: "Want a specific look or genetic trait? Use your Gems here to design a fox from scratch with a precise genetic blueprint.",
    icon: <Diamond className="text-cyan-500" size={24} />,
    path: "/shop/custom",
  },
  {
    title: "Supplies & Feed",
    content: "Foxes need daily care. Buy basic kibble or premium specialty feeds here. Some feeds even provide temporary stat bonuses for shows!",
    icon: <ShoppingBag className="text-amber-500" size={24} />,
    path: "/shop/supplies",
  },
  {
    title: "Kennel Management",
    content: "This is your home base. Here you'll feed, groom, and train your foxes. Healthy, well-cared-for foxes perform significantly better in the show ring.",
    icon: <Home className="text-sagebrush" size={24} />,
    path: "/kennel",
  },
  {
    title: "The Show Arena",
    content: "Test your foxes against the community! Entering shows earns you Gold and increases your kennel's reputation based on your fox's physical traits.",
    icon: <Trophy className="text-yellow-500" size={24} />,
    path: "/shows",
  },
  {
    title: "Breeding & Studs",
    content: "Breed your vixens with your own dogs or hire high-quality NPC studs. Study genotypes carefully to produce the best possible offspring.",
    icon: <Heart className="text-pink-500" size={24} />,
    path: "/stud-barn",
  },
  {
    title: "Help & Resources",
    content: "Genetics and showing can be complex. If you have questions, our Help Center and FAQ contain detailed guides on everything from loci to show classes.",
    icon: <HelpCircle className="text-blue-500" size={24} />,
    path: "/help",
  }
];

export function TutorialTour() {
  const { tutorialStep, setTutorialStep, completeTutorial, hasSeenTutorial } = useGameStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Automatically start the tutorial for brand new users
    if (!hasSeenTutorial && tutorialStep === null) {
      setTutorialStep(0);
    }
  }, [hasSeenTutorial, tutorialStep, setTutorialStep]);

  if (tutorialStep === null || hasSeenTutorial) return null;

  const currentStep = steps[tutorialStep];

  const handleNext = () => {
    if (tutorialStep < steps.length - 1) {
      const nextStep = tutorialStep + 1;
      setTutorialStep(nextStep);
      if (pathname !== steps[nextStep].path) {
        router.push(steps[nextStep].path);
      }
    } else {
      completeTutorial();
    }
  };

  const handleBack = () => {
    if (tutorialStep > 0) {
      const prevStep = tutorialStep - 1;
      setTutorialStep(prevStep);
      if (pathname !== steps[prevStep].path) {
        router.push(steps[prevStep].path);
      }
    }
  };

  const handleSkip = () => {
    completeTutorial();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tutorialStep}
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg"
      >
        <div className="bg-card border-2 border-primary/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="bg-primary/5 px-8 py-5 flex items-center justify-between border-b border-primary/10">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-background rounded-2xl border border-primary/20 shadow-inner">
                {currentStep.icon}
              </div>
              <div>
                <h3 className="font-folksy text-xl text-foreground leading-none">{currentStep.title}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${((tutorialStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Step {tutorialStep + 1} / {steps.length}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
              aria-label="Close tutorial"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-8 py-6">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
              {currentStep.content}
            </p>
          </div>

          <div className="px-8 py-5 bg-muted/20 flex items-center justify-between gap-4">
            <button
              onClick={handleSkip}
              className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-2 py-1"
            >
              Skip Tour
            </button>

            <div className="flex gap-3">
              {tutorialStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="rounded-2xl font-bold gap-2 px-4 h-10 border-2"
                >
                  <ChevronLeft size={16} /> <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleNext}
                className="rounded-2xl font-black uppercase tracking-widest px-8 h-10 gap-2 shadow-lg shadow-primary/20"
              >
                {tutorialStep === steps.length - 1 ? "Finish" : "Next"} <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
