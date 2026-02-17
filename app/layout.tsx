import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Video Compressor | 8MB Tool",
  description: "Compress videos for Discord automatically. No Cloud uploads.",
  verification: {
    // Paste ONLY the random string from Google here (e.g., "AbCd123...")
    google: "import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Video Compressor | 8MB Tool",
  description: "Compress videos for Discord automatically. No Cloud uploads.",
  verification: {
    // Paste ONLY the random string from Google here (e.g., "AbCd123...")
    google: "gLJ7oZmuzx34lgeaCsnQnDQyUyKvrBUt0Ol66dLkPjw", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* AdSense Script - Replace 'ca-pub-YOUR_PUBLISHER_ID' with your ID */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}", 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* AdSense Script - Replace 'ca-pub-YOUR_PUBLISHER_ID' with your ID */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
