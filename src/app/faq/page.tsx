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
    a: "Gems are earned through achievements, special show placements, or selling high-quality foxes to other players."
  },
  {
    q: "What are lethal genes?",
    a: "Some mutations (like Platinum or White Marked) are lethal in homozygous form (WpWp). These kits will be stillborn."
  }
];

export default function FAQPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto font-sans">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-earth-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-earth-500 font-medium italic">Quick answers to common questions about the simulation.</p>
      </div>

      <div className="space-y-6 mt-12">
        {FAQS.map((faq, i) => (
          <Card key={i} className="folk-card border-earth-100 shadow-sm hover:shadow-md transition-shadow rounded-[32px] overflow-hidden">
            <CardHeader className="pb-2 bg-earth-50/50">
              <CardTitle className="text-xl font-black flex items-start gap-4 text-earth-900">
                <HelpCircle className="text-fire-600 mt-1 flex-shrink-0" size={24} />
                {faq.q}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex gap-4">
                <Info className="text-moss-600 mt-1 flex-shrink-0" size={24} />
                <p className="text-earth-700 leading-relaxed font-medium text-lg">{faq.a}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
