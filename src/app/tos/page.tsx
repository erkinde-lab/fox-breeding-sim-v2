'use client';

import React from 'react';
import { Scale, ShieldAlert, Coins, Users, Image as ImageIcon, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TosPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-fire-100 rounded-2xl text-fire-600 mb-2">
          <Scale size={40} />
        </div>
        <h1 className="text-5xl font-black text-earth-900 tracking-tight">Terms of Service</h1>
        <p className="text-earth-500 font-medium italic">Last Updated: February 2025</p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <FileText className="text-fire-600" size={24} />
            <h2 className="text-2xl font-bold">1. Introduction</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 text-earth-700 leading-relaxed">
              Welcome to Red Fox Breeding Simulator. By accessing or using our website and services, you agree to be bound by these Terms of Service. These rules are designed to ensure a fair, safe, and enjoyable environment for all breeders.
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <Users className="text-fire-600" size={24} />
            <h2 className="text-2xl font-bold">2. Eligibility & Accounts</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-4 text-earth-700 leading-relaxed">
              <p>
                <span className="font-bold text-earth-900">Age Requirement:</span> You must be at least <span className="text-fire-600 font-bold">16 years of age</span> to create an account. This ensures compliance with international data protection laws.
              </p>
              <p>
                <span className="font-bold text-earth-900">Single Account Policy:</span> To maintain game balance, each person is permitted only <span className="font-bold uppercase underline">one (1) account</span>. Creation of multiple accounts ("multi-accounting") is strictly prohibited and will result in the permanent closure of all associated accounts.
              </p>
              <p>
                <span className="font-bold text-earth-900">Account Responsibility:</span> You are responsible for all activity on your account. Do not share your login credentials with others.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <ShieldAlert className="text-fire-600" size={24} />
            <h2 className="text-2xl font-bold">3. Prohibited Conduct</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "No harassment, stalking, or doxxing.",
                  "No hate speech or adult content.",
                  "No bots, scripts, or automation.",
                  "No exploiting bugs for advantage.",
                  "No impersonating staff members.",
                  "No malicious software or links."
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-earth-700">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-fire-500 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <Coins className="text-fire-600" size={24} />
            <h2 className="text-2xl font-bold">4. Virtual Assets & Economy</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-4 text-earth-700 leading-relaxed">
              <p>
                <span className="font-bold text-earth-900">Ownership:</span> All virtual assets (foxes, Gems, Gold) are the property of [GAME_OWNER_ENTITY]. Users are granted a limited, revocable license to use these assets within the game.
              </p>
              <p>
                <span className="font-bold text-earth-900">No Real-Money Trading (RMT):</span> Selling or trading in-game assets for real-world currency outside of the provided game systems is strictly prohibited.
              </p>
              <p>
                <span className="font-bold text-earth-900">Refunds:</span> Purchases of Gems are eligible for a refund only if they remain <span className="italic">unspent</span> and the request is made within 14 days. Once Gems are spent, all sales are final.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <ImageIcon className="text-fire-600" size={24} />
            <h2 className="text-2xl font-bold">5. User Content & Licensing</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-4 text-earth-700 leading-relaxed">
              <p>
                By creating content (naming foxes, forum posts), you grant us a <span className="font-bold">perpetual, worldwide license</span> to display that content. We reserve the right to use screenshots of the game for promotional purposes.
              </p>
              <p>
                <span className="font-bold text-earth-900">Account Closure:</span> If an account is banned, forum posts typically remain to preserve conversation context. Foxes from banned accounts may be "rehomed" into the game world, retaining their history and names.
              </p>
            </CardContent>
          </Card>
        </section>

        <div className="pt-8 text-center space-y-6">
          <p className="text-earth-500 text-sm max-w-lg mx-auto">
            These terms are subject to change. Continued use of the service constitutes acceptance of updated terms. Questions? Contact [CONTACT_EMAIL].
          </p>
          <Link href="/">
            <Button variant="outline" className="border-earth-200 text-earth-600 hover:bg-earth-50 font-bold px-8">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
