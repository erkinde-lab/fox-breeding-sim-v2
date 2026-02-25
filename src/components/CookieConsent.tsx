'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100] animate-in slide-in-from-bottom-10 duration-500">
      <Card className="folk-card border-fire-100 shadow-2xl bg-card">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="bg-fire-100 p-3 rounded-2xl text-fire-600">
              <Cookie size={24} />
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-earth-400 hover:text-earth-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black text-earth-900 leading-tight">We value your privacy</h4>
            <p className="text-sm text-earth-500 font-medium leading-relaxed">
              We use cookies to improve your breeding experience, analyze site traffic, and secure your account.
              By clicking "Accept", you agree to our usage of cookies as described in our{' '}
              <Link href="/privacy" className="text-fire-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={acceptCookies}
              className="flex-1 bg-fire-600 hover:bg-fire-500 h-10 font-bold"
            >
              Accept All
            </Button>
            <Button
              onClick={declineCookies}
              variant="outline"
              className="flex-1 border-earth-200 text-earth-600 hover:bg-earth-50 h-10 font-bold"
            >
              Decline Optional
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
