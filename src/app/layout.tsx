import type { Metadata } from "next";
import { Alice, Quicksand } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout-client";

const alice = Alice({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-alice',
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: "Red Fox Breeding Simulator",
  description: "Breed and show beautiful red foxes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${alice.variable} ${quicksand.variable}`}>
      <body className={quicksand.className} suppressHydrationWarning>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
