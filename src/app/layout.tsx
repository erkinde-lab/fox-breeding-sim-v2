
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "./layout-client";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
