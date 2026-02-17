import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CompressorTool } from "@/components/CompressorTool";
import { BannerRotator } from "@/components/BannerRotator"; // <--- NEW IMPORT
import { ShieldCheck } from "lucide-react";

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

        {/* --- MONETIZATION SPOT 1 (High Visibility) --- */}
        <div className="w-full max-w-xl mt-8">
           <BannerRotator
             mode="affiliate" // <--- Change to "adsense" when approved
             slot="1234567890" // <--- Your AdSense Slot ID
             affiliateLink="https://nordvpn.com/" // <--- Your Affiliate Link
             affiliateImage="https://placehold.co/600x100/4f46e5/ffffff?text=Protect+Your+IP+on+Discord+-+Get+NordVPN"
             label="Sponsored"
           />
        </div>

        {/* LINKS GRID */}
        <section className="mt-12 w-full max-w-4xl">
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

        {/* --- MONETIZATION SPOT 2 (Footer) --- */}
        <div className="w-full max-w-3xl mt-12">
           <BannerRotator
             mode="affiliate"
             slot="0987654321"
             affiliateLink="https://www.cdkeys.com/"
             affiliateImage="https://placehold.co/728x90/10b981/ffffff?text=Cheap+Steam+Keys+&+Windows+Licenses"
             label="Gaming Deals"
           />
        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-16 py-8 text-center text-slate-400 text-sm border-t border-slate-200 w-full">
        <p className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4" />
          All video processing is performed client-side. Your files never leave your device.
        </p>
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-indigo-600 transition-colors">Contact</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Discord Compression Tool.</p>
      </footer>
    </main>
  );
}
