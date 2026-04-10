import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Inner Mirror",
    template: "%s · Inner Mirror",
  },
  description: "Stories, updates, and news from Inner Mirror.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-stone-900">{children}</body>
    </html>
  );
}
