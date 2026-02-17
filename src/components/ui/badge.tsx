
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'destructive' | 'outline' }) {
  const variants = {
    default: 'bg-earth-800 text-white hover:bg-slate-900/80',
    secondary: 'bg-earth-100 text-earth-900 hover:bg-earth-100/80',
    destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/80',
    outline: 'text-earth-900 border border-earth-200 hover:bg-earth-100',
  };
  
  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-fire-600 focus:ring-offset-2", variants[variant], className)} {...props} />
  );
}
