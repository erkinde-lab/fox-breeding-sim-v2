'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-black text-earth-900 tracking-tight">Contact Staff</h1>
        <p className="text-earth-500 mt-2">Need help with a bug or have a suggestion? We&apos;re here to help.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="folk-card">
          <CardContent className="pt-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-fire-100 p-4 rounded-full text-fire-600">
                <Mail size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-earth-900">Support Ticket</h3>
                <p className="text-earth-500">Direct assistance for account or technical issues.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-earth-400 tracking-widest">Subject</label>
                <input className="w-full p-3 bg-earth-50 border border-earth-200 rounded-xl" placeholder="Describe the issue..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-earth-400 tracking-widest">Message</label>
                <textarea className="w-full p-3 bg-earth-50 border border-earth-200 rounded-xl h-32" placeholder="Tell us more details..." />
              </div>
              <Button className="w-full bg-fire-600 hover:bg-fire-500 h-12 text-lg font-bold">
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="folk-card border-cyan-100 bg-cyan-50/30">
            <CardContent className="pt-6 text-center">
              <Shield className="mx-auto text-cyan-600 mb-3" size={32} />
              <h4 className="font-bold text-earth-900">Report Abuse</h4>
              <p className="text-xs text-earth-500 mt-1">For harassment or TOS violations.</p>
            </CardContent>
          </Card>
          <Card className="folk-card border-moss-100 bg-moss-50/30">
            <CardContent className="pt-6 text-center">
              <MessageSquare className="mx-auto text-moss-600 mb-3" size={32} />
              <h4 className="font-bold text-earth-900">Suggestions</h4>
              <p className="text-xs text-earth-500 mt-1">Help us improve the game.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
