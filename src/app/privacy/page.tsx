'use client';

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
