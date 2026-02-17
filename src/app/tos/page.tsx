'use client';

import React from 'react';
import { Scale } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="p-6 bg-fire-100 rounded-full text-fire-600">
        <Scale size={48} />
      </div>
      <h1 className="text-4xl font-black text-earth-900 tracking-tight">Terms of Service</h1>
      <p className="text-earth-500 max-w-md">
        Our Terms of Service are currently being drafted. We want to ensure a fair and safe environment for all breeders.
      </p>
      <Link href="/">
        <Button variant="default" className="bg-fire-600 hover:bg-fire-500 text-white font-bold px-8">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
