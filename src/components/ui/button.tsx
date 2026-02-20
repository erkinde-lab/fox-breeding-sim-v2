
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'folk';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-lg shadow-fire-900/20',
    outline: 'border-2 border-border bg-transparent text-foreground hover:bg-muted',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90 shadow-lg shadow-secondary/20',
    ghost: 'hover:bg-muted text-foreground',
    link: 'text-primary underline-offset-4 hover:underline font-bold',
    folk: 'bg-primary text-primary-foreground hover:bg-primary/80 shadow-xl shadow-primary/20',
  };

  const sizes = {
    default: 'h-12 px-8 py-3 text-sm rounded-full font-bold uppercase tracking-widest',
    sm: 'h-9 px-4 py-2 text-[10px] rounded-full font-bold uppercase tracking-widest',
    lg: 'h-14 px-10 py-4 text-base rounded-full font-bold uppercase tracking-widest',
    icon: 'h-11 w-11 rounded-full',
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center ring-offset-white transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-apricot focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
