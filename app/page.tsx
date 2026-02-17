import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CompressorTool } from "@/components/CompressorTool";
import { ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Discord Video Compressor | Free 8MB Tool",
  description: "Reduce video size to under 8MB for Discord. Fix 'Your files are too powerful' error. Free online compressor for MP4, MOV, MKV.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Discord Video Compressor",
    description: "Fix 'File too powerful' errors instantly. < 8MB.",
    url: "https://discordcompression.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  }
};

export default function Home() {
  const formats = ["mp4", "mov", "mkv", "avi", "webm", "wmv"];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 font-sans">
      <div className="w-full flex flex-col items-center max-w-5xl px-4">
        
        {/* HERO IMAGE */}
        <div className="relative w-full max-w-lg mx-auto mb-8">
          <Image 
            src="/og-image.png" 
            alt="Discord Video Compressor" 
            width={1200} 
            height={630} 
            className="rounded-2xl shadow-2xl border border-slate-200"
            priority
          />
        </div>

        {/* HEADER */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Discord Video Compressor
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            Reduce video file size to <span className="text-indigo-600 font-bold">under 8MB</span> without losing quality.
          </p>
        </div>

        {/* TOOL */}
        <Suspense fallback={<div className="h-96 w-full max-w-xl bg-white rounded-xl shadow-xl animate-pulse" />}>
          <CompressorTool format="VIDEO" />
        </Suspense>

        {/* LINKS GRID */}
        <section className="mt-20 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Supported Formats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formats.map((fmt) => (
              <Link key={fmt} href={`/${fmt}`} className="flex items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group">
                <div className="text-center">
                  <span className="block font-bold text-lg text-slate-800 group-hover:text-indigo-600 uppercase">
                    Compress {fmt}
                  </span>
                  <span className="text-xs text-slate-400">for Discord</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
