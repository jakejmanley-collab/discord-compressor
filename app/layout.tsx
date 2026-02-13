import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Video Compressor | Free 8MB Compressor",
  description: "Compress videos for Discord automatically. Reduce file size to under 8MB without losing quality. Supports MP4, MOV, MKV, and more.",
  metadataBase: new URL("https://discordcompression.com"), // <--- THIS IS THE KEY
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
