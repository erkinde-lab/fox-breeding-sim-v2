'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: "How is Silver-marked different from the Cross coat?",
    a: "Silver-marked (Ss) is a modifier that adds silver hairs to any base color. Cross (Aa Bb) is a specific base genotype resulting from the interaction of Standard and Alaskan Silver alleles, characterized by a dark 'cross' pattern over the shoulders."
  },
  {
    q: "What does 'Brown' mean in the genetics?",
    a: "The 'Brown' (formerly Brown-Coat) mutation (brcbrc) is a recessive trait that replaces black areas of the coat (ears, legs, tail tip) with rich brownish-red pigment."
  },
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
    a: "Gems are earned through achievements, special show placements, or selling high-quality foxes to other players."
  },
  {
    q: "What are lethal genes?",
    a: "Some mutations (like Platinum or White Marked) are lethal in homozygous form (WpWp). These kits will be stillborn."
  }
];

export default function FAQPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-black text-earth-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-earth-500 mt-2">Quick answers to common questions about the simulation.</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <Card key={i} className="folk-card border-earth-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-start gap-3">
                <HelpCircle className="text-fire-600 mt-1 flex-shrink-0" size={20} />
                {faq.q}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Info className="text-moss-600 mt-1 flex-shrink-0" size={20} />
                <p className="text-earth-700 leading-relaxed">{faq.a}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
