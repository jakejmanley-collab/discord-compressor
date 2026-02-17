import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CompressorTool } from "@/components/CompressorTool";
import { BannerRotator } from "@/components/BannerRotator";
import { ShieldCheck, Zap, Files, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Bulk Discord Video Compressor | Free Unlimited 8MB Tool",
  description: "Compress multiple videos at once for Discord. Fix 'Your files are too powerful' error. 100% free, unlimited bulk processing for MP4, MOV, MKV.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bulk Discord Video Compressor",
    description: "Compress multiple clips to < 8MB at once. Fast, private, and unlimited.",
    url: "https://discordcompression.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  }
};

export default function Home() {
  const formats = ["mp4", "mov", "mkv", "avi", "webm", "wmv"];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 font-sans">
      <div className="w-full flex flex-col items-center max-w-5xl px-4 text-center">
        
        {/* HEADER */}
        <div className="mb-10 space-y-4">
          <div className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            New: Bulk Processing Support
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Bulk Video Compressor <br className="hidden md:block" /> for Discord
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            Automatically shrink multiple clips to <span className="text-indigo-600 font-bold">under 8MB</span>. No limits, no watermarks, no Nitro.
          </p>
        </div>

        {/* THE TOOL */}
        <Suspense fallback={<div className="h-96 w-full max-w-xl bg-white rounded-3xl shadow-xl animate-pulse" />}>
          <CompressorTool format="VIDEO" />
        </Suspense>

        {/* MONETIZATION SPOT 1 (Ad/Affiliate) */}
        <div className="w-full max-w-xl mt-8">
           <BannerRotator
             mode="affiliate"
             slot="1234567890"
             affiliateLink="https://nordvpn.com/"
             affiliateImage="https://placehold.co/600x100/4f46e5/ffffff?text=Protect+Your+IP+on+Discord+-+Get+NordVPN"
             label="Sponsored"
           />
        </div>

        {/* FEATURE HIGHLIGHTS */}
        <section className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mt-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Files className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Bulk Upload</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Drop dozens of files at once. We process them in a queue so your browser never crashes.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Lock className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Privacy First</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Your clips stay on your machine. We use WebAssembly to compress files locally in your browser.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Unlimited Use</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Since we don't pay for cloud servers to process your video, we never have to limit your usage.</p>
          </div>
        </section>

        {/* SEO FORMAT LINKS GRID (RESTORED) */}
        <section className="mt-20 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Format-Specific Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formats.map((fmt) => (
              <Link key={fmt} href={`/${fmt}`} className="flex items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group">
                <div className="text-center">
                  <span className="block font-bold text-lg text-slate-800 group-hover:text-indigo-600 uppercase">
                    {fmt}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Compressor</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* MONETIZATION SPOT 2 (Ad/Affiliate) */}
        <div className="w-full max-w-3xl mt-16">
           <BannerRotator
             mode="affiliate"
             slot="0987654321"
             affiliateLink="https://www.cdkeys.com/"
             affiliateImage="https://placehold.co/728x90/10b981/ffffff?text=Cheap+Steam+Keys+&+Windows+Licenses"
             label="Gaming Deals"
           />
        </div>

      </div>

      {/* FOOTER (RESTORED WITH LINKS) */}
      <footer className="mt-16 py-8 text-center text-slate-400 text-sm border-t border-slate-200 w-full px-4">
        <p className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4" />
          Secure Client-Side Processing: Your files never leave your device.
        </p>
        <div className="flex justify-center gap-6 mb-4 font-medium">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link href="/" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Discord Compression Tool. No Cloud Uploads.</p>
      </footer>
    </main>
  );
}
