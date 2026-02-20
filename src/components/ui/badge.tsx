
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'destructive' | 'outline' }) {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90 shadow-sm',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm',
    outline: 'text-foreground border border-border hover:bg-muted',
  };

  return (
    <div className={cn("inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2", variants[variant], className)} {...props} />
  );
}
