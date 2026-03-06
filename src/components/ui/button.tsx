import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'folk' | 'success' | 'warning' | 'info' | 'gold' | 'gems';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:opacity-90 shadow-btn-primary',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 shadow-lg shadow-black/20',
    outline: 'border-2 border-border bg-transparent text-foreground hover:bg-muted',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90 shadow-btn-secondary',
    ghost: 'hover:bg-muted text-foreground',
    link: 'text-primary underline-offset-4 hover:underline font-bold',
    folk: 'bg-primary text-primary-foreground hover:bg-primary/80 shadow-btn-primary',
    success: 'bg-success text-success-foreground hover:opacity-90 shadow-lg shadow-black/20',
    warning: 'bg-warning text-warning-foreground hover:opacity-90 shadow-lg shadow-black/20',
    info: 'bg-info text-info-foreground hover:opacity-90 shadow-lg shadow-black/20',
    gold: 'bg-gold text-white hover:opacity-90 shadow-lg shadow-black/20',
    gems: 'bg-gems text-white hover:opacity-90 shadow-lg shadow-black/20',
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
        "inline-flex items-center justify-center ring-offset-white transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
