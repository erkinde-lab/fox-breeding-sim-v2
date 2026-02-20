'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShopRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/shop/adoption');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-muted-foreground font-medium">Loading shops...</div>
        </div>
    );
}
