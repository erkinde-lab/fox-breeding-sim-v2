import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "info"
  | "gold"
  | "gems";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: BadgeVariant;
}) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
    secondary:
      "bg-secondary text-secondary-foreground hover:opacity-90 shadow-sm",
    destructive:
      "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm",
    outline: "text-foreground border border-border hover:bg-muted",
    success: "bg-success text-success-foreground hover:opacity-90 shadow-sm",
    warning: "bg-warning text-warning-foreground hover:opacity-90 shadow-sm",
    info: "bg-info text-info-foreground hover:opacity-90 shadow-sm",
    gold: "bg-gold text-white hover:opacity-90 shadow-sm",
    gems: "bg-gems text-white hover:opacity-90 shadow-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
