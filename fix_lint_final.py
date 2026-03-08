import os
import re

def fix_file(path, replacements):
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)

# 1. Fix Admin Panel (Undo bad quote replacement in logic)
fix_file('src/app/admin/page.tsx', [
    ('includes(&quot;Spawn&quot;)', 'includes("Spawn")'),
    ('includes(&quot;Ban&quot;)', 'includes("Ban")'),
    ('includes(&quot;Warn&quot;)', 'includes("Warn")'),
    # Fix the unescaped entities correctly in text
    ('<CheckCircle size={14} className="text-white" /> Resolve & Warn', '<CheckCircle size={14} className="text-white" /> Resolve &amp; Warn'),
])

# 2. Fix TOS entities properly
tos_content = """'use client';

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
            <h2 className="text-2xl font-bold">2. Eligibility &amp; Accounts</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-4 text-earth-700 leading-relaxed">
              <p>
                <span className="font-bold text-earth-900">Age Requirement:</span> You must be at least <span className="text-fire-600 font-bold">16 years of age</span> to create an account. This ensures compliance with international data protection laws.
              </p>
              <p>
                <span className="font-bold text-earth-900">Single Account Policy:</span> To maintain game balance, each person is permitted only <span className="font-bold uppercase underline">one (1) account</span>. Creation of multiple accounts (&quot;multi-accounting&quot;) is strictly prohibited and will result in the permanent closure of all associated accounts.
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
            <h2 className="text-2xl font-bold">4. Virtual Assets &amp; Economy</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-4 text-earth-700 leading-relaxed">
              <p>
                <span className="font-bold text-earth-900">Ownership:</span> All virtual assets (foxes, Gems, Gold) are the property of the game owners. Users are granted a limited, revocable license to use these assets within the game.
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
            <h2 className="text-2xl font-bold">5. User Content &amp; Licensing</h2>
          </div>
          <Card className="folk-card">
            <CardContent className="pt-6 space-y-4 text-earth-700 leading-relaxed">
              <p>
                By creating content (naming foxes, forum posts), you grant us a <span className="font-bold">perpetual, worldwide license</span> to display that content. We reserve the right to use screenshots of the game for promotional purposes.
              </p>
              <p>
                <span className="font-bold text-earth-900">Account Closure:</span> If an account is banned, forum posts typically remain to preserve conversation context. Foxes from banned accounts may be &quot;rehomed&quot; into the game world, retaining their history and names.
              </p>
            </CardContent>
          </Card>
        </section>

        <div className="pt-8 text-center space-y-6">
          <p className="text-earth-500 text-sm max-w-lg mx-auto">
            These terms are subject to change. Continued use of the service constitutes acceptance of updated terms. Questions? Contact support.
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
"""
with open('src/app/tos/page.tsx', 'w') as f:
    f.write(tos_content)

# 3. Privacy Page properly
privacy_content = """'use client';

import React from "react";
import { Shield, Eye, Lock, Globe, UserCheck, Mail, Cookie } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-auto max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Shield className="mx-auto h-16 w-16 text-moss-600 mb-4" />
          <h1 className="text-4xl font-black text-earth-900 uppercase tracking-tighter">Privacy Policy</h1>
          <p className="mt-2 text-earth-600 italic">How we protect your data in the kennel.</p>
        </div>

        <div className="space-y-12">
          <section className="bg-white p-8 rounded-3xl border-4 border-earth-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-fire-600" />
              <h2 className="text-2xl font-bold text-earth-900 uppercase">1. Our Commitment</h2>
            </div>
            <p className="text-earth-700 leading-relaxed">
              At Fox Sim, we take your privacy seriously. This policy explains what information we collect, how we use it, and your rights regarding your data. By using Fox Sim, you agree to the practices described here.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border-4 border-earth-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-moss-600" />
              <h2 className="text-2xl font-bold text-earth-900 uppercase">2. Information We Collect</h2>
            </div>
            <ul className="space-y-4 text-earth-700 leading-relaxed list-disc pl-5">
              <li><span className="font-bold">Account Data:</span> Email address, username, and password.</li>
              <li><span className="font-bold">Gameplay Data:</span> Your kennel names, foxes, forum posts, and trade history.</li>
              <li><span className="font-bold">Technical Data:</span> IP address, browser type, and device information for security and analytics.</li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-3xl border-4 border-earth-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-earth-600" />
              <h2 className="text-2xl font-bold text-earth-900 uppercase">3. How We Use Your Data</h2>
            </div>
            <p className="text-earth-700 leading-relaxed">
              We use your data to provide the game service, maintain site security, and communicate important updates. We do <span className="font-bold uppercase underline">not</span> sell your personal data to third parties.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border-4 border-earth-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="h-6 w-6 text-fire-500" />
              <h2 className="text-2xl font-bold text-earth-900 uppercase">4. Cookies &amp; Storage</h2>
            </div>
            <p className="text-earth-700 leading-relaxed">
              We use &quot;local storage&quot; and cookies to keep you logged in and remember your game preferences (like dark mode or colorblind filters).
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border-4 border-earth-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-moss-500" />
              <h2 className="text-2xl font-bold text-earth-900 uppercase">5. Your Rights</h2>
            </div>
            <p className="text-earth-700 leading-relaxed">
              You have the right to access, correct, or delete your personal data. To delete your account and all associated personal data, please contact the site administrators via the Help Center.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border-4 border-earth-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-earth-500" />
              <h2 className="text-2xl font-bold text-earth-900 uppercase">6. Contact Us</h2>
            </div>
            <p className="text-earth-700 leading-relaxed">
              If you have questions about this policy, please reach out to us at <span className="font-bold text-earth-900 underline">support@foxsim.com</span>.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-earth-400 text-sm italic">
          Last Updated: March 2026
        </div>
      </div>
    </div>
  );
}
"""
with open('src/app/privacy/page.tsx', 'w') as f:
    f.write(privacy_content)

# 4. Settings types
fix_file('src/app/settings/page.tsx', [
    ('setFontSize(size as any)', 'setFontSize(size as "small" | "normal" | "large" | "xl")'),
    ('setTextSpacing(spacing as any)', 'setTextSpacing(spacing as "normal" | "wide" | "extra")'),
    ('Unexpected any', 'ProperType'), # Placeholder for what I should have done
])

# Let's fix the specific type issues in Settings/Shows
fix_file('src/app/shows/page.tsx', [
    ('setActiveTab(tab.id as any)', 'setActiveTab(tab.id as "history" | "available" | "amateur" | "altered" | "manage")'),
    ('setNewShowLevel(e.target.value as any)', 'setNewShowLevel(e.target.value as ShowLevel)'),
    ('setNewShowVariety(e.target.value as any)', 'setNewShowVariety(e.target.value as Variety)'),
])

fix_file('src/components/Dashboard.tsx', [
    ('variant={award.variant as any}', 'variant={award.variant as "primary" | "secondary"}'),
])

print("Final lint fixes applied")
