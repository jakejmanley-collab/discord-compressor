import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Video Compressor | Free 8MB Compressor",
  description: "Compress videos for Discord automatically. Reduce file size to under 8MB without losing quality. Supports MP4, MOV, MKV, and more.",
  metadataBase: new URL("https://discordcompression.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Discord Video Compressor",
    description: "Fix 'File too powerful' errors instantly. Compress any video to under 8MB.",
    url: "https://discordcompression.com",
    siteName: "Discord Compressor",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Video Compressor",
    description: "Fix 'File too powerful' errors instantly.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google AdSense Script */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID_HERE" // <--- REPLACE THIS
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {children}
      </body>
    </html>
  );
}
