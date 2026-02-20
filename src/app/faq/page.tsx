'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: "Why can't I breed my foxes?",
    a: "Breeding is only available during the Winter season. Also, ensure both foxes are at least 2 years old and not retired."
  },
  {
    q: "What is COI?",
    a: "COI stands for Coefficient of Inbreeding. It measures how related the parents are. High COI (above 15%) increases the risk of lower stats and health issues."
  },
  {
    q: "How do I earn Gems?",
    a: "Gems are the premium currency. You earn them through rare achievements, placing #1 in major shows, or selling high-quality foxes to other players."
  },
  {
    q: "What are lethal genes?",
    a: "Some mutations (like Platinum or White Marked) are lethal in homozygous form (WpWp). These kits will be stillborn. Always check genotypes before breeding!"
  },
  {
    q: "How do Staff members help?",
    a: "Hiring staff provides permanent kennel-wide bonuses. For example, a Groomer boosts Coat Quality, while a Veterinarian improves physical trait scores for all kits."
  },
  {
    q: "What determines Show Placement?",
    a: "Placement is based on a fox's total score (Head + Topline + Hindquarters + Forequarters + Presence + Temperament + Coat Quality + Tail). Higher stats mean better ranks!"
  }
];

export default function FAQPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>Frequently Asked Questions</h1>
        <p className="text-muted-foreground font-medium italic text-lg">Quick answers to common questions about the simulation.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-16">
        {FAQS.map((faq, i) => (
          <Card key={i} className="folk-card border-border shadow-sm hover:shadow-md transition-shadow rounded-[32px] overflow-hidden bg-card">
            <CardHeader className="pb-2 bg-muted/30">
              <CardTitle className="text-xl font-black flex items-start gap-4 text-foreground">
                <HelpCircle className="text-primary mt-1 flex-shrink-0" size={24} />
                {faq.q}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex gap-4">
                <Info className="text-secondary mt-1 flex-shrink-0" size={24} />
                <p className="text-foreground/80 leading-relaxed font-medium text-lg">{faq.a}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
