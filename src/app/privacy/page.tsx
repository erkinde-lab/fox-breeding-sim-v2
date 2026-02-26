'use client';

import React from 'react';
import { Shield, Eye, Lock, Globe, UserCheck, Mail, Cookie } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-moss-100 rounded-2xl text-moss-600 mb-2">
          <Shield size={40} />
        </div>
        <h1 className="text-5xl font-black text-earth-900 tracking-tight">Privacy Policy</h1>
        <p className="text-earth-500 font-medium italic">Last Updated: February 2025</p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <Eye className="text-moss-600" size={24} />
            <h2 className="text-2xl font-bold">1. Information We Collect</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-4 text-earth-700 leading-relaxed">
              <p>To provide the best breeding experience, we collect limited personal data:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li><span className="font-bold">Account Data:</span> Email and username.</li>
                <li><span className="font-bold">Transaction Data:</span> Payments via Stripe/PayPal (we do not store card numbers).</li>
                <li><span className="font-bold">Usage Data:</span> We collect anonymous usage data (like page views and game actions) to improve your experience.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <Cookie className="text-moss-600" size={24} />
            <h2 className="text-2xl font-bold">2. Cookies & Analytics</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-4 text-earth-700 leading-relaxed">
              <p>
                We value your privacy and aim to be as transparent as possible. We use <span className="font-bold">Umami Analytics</span> to help us understand how players interact with the game.
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li><span className="font-bold">No Cookies:</span> Umami does not use cookies and does not collect any personally identifiable information.</li>
                <li><span className="font-bold">Privacy First:</span> All data is anonymized. We do not track you across other websites.</li>
                <li><span className="font-bold">Compliance:</span> This setup is fully compliant with <span className="font-bold">GDPR</span>, <span className="font-bold">CCPA (CPRA)</span>, and other international privacy laws without requiring a cookie banner.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <Lock className="text-moss-600" size={24} />
            <h2 className="text-2xl font-bold">3. How We Use Data</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-2 text-earth-700">
              <p>We use your information to:</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>Manage your account and game state.</li>
                <li>Process virtual currency purchases.</li>
                <li>Analyze game balance and improve features.</li>
                <li>Ensure a safe environment for all players.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <Globe className="text-moss-600" size={24} />
            <h2 className="text-2xl font-bold">4. Your Rights (GDPR & CCPA)</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 text-earth-700 leading-relaxed">
              <p>
                Regardless of your location, we aim to provide high standards of data privacy. You have the right to <span className="font-bold">access</span>, <span className="font-bold">correct</span>, or <span className="font-bold">delete</span> your personal data. To exercise these rights or request a data export, please contact us via the email below.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="do-not-sell" className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <Shield className="text-moss-600" size={24} />
            <h2 className="text-2xl font-bold">5. CCPA: Do Not Sell My Info</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 text-earth-700 leading-relaxed">
              <p>
                Under the California Consumer Privacy Act (CCPA), California residents have the right to opt-out of the "sale" of their personal information.
                <span className="font-bold">Red Fox Breeding Simulator does not sell your personal information</span> to third parties for money or other valuable consideration.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <Lock className="text-moss-600" size={24} />
            <h2 className="text-2xl font-bold">6. Right to Erasure & Portability</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-4 text-earth-700 leading-relaxed">
              <p>
                You have the right to request that we <span className="font-bold uppercase tracking-wide">delete</span> your account and all associated data.
                Additionally, you may request a machine-readable <span className="font-bold uppercase tracking-wide">export</span> of your data.
                To initiate either process, please send an email to the support address below with the subject "Data Request".
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <UserCheck className="text-moss-600" size={24} />
            <h2 className="text-2xl font-bold">7. Children's Privacy</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 text-earth-700 leading-relaxed text-sm">
              We do not knowingly collect data from children under <span className="font-bold">16 years of age</span>. If we discover an account belongs to a user under 16, it will be terminated and their data deleted in accordance with international laws.
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-earth-900">
            <Mail className="text-moss-600" size={24} />
            <h2 className="text-2xl font-bold">8. Contact Information</h2>
          </div>
          <Card className="folk-card border-moss-100 bg-moss-50/30">
            <CardContent className="pt-6 text-center">
              <p className="text-earth-900 font-bold mb-1">[GAME_OWNER_ENTITY]</p>
              <p className="text-moss-700 font-medium">[CONTACT_EMAIL]</p>
            </CardContent>
          </Card>
        </section>

        <div className="pt-8 text-center">
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
