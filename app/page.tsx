import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CompressorTool } from "@/components/CompressorTool";
import { BannerRotator } from "@/components/BannerRotator";
import { ShieldCheck, Zap, Files, Lock, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
  title: "Bulk Discord Video Compressor | Free Unlimited 8MB Tool",
  description: "Compress multiple videos at once for Discord. Fix 'Your files are too powerful' error. 100% free, unlimited bulk processing for MP4, MOV, MKV.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const formats = ["mp4", "mov", "mkv", "avi", "webm", "wmv"];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-10 font-sans">
      <div className="w-full flex flex-col items-center max-w-5xl px-4">
        
        {/* HEADER SECTION */}
        <header className="text-center mb-10 space-y-4">
          <div className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            Bulk Processing Enabled
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Discord Video Compressor
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            Automatically shrink clips to <span className="text-indigo-600 font-bold">under 8MB</span>.
          </p>
        </header>

        {/* THE MAIN TOOL */}
        <section className="w-full flex justify-center mb-8">
          <Suspense fallback={<div className="h-96 w-full max-w-xl bg-white rounded-3xl animate-pulse" />}>
            <CompressorTool format="VIDEO" />
          </Suspense>
        </section>

        {/* AD SPOT 1 */}
        <BannerRotator
          mode="affiliate"
          slot="1234567890"
          affiliateLink="https://nordvpn.com/"
          affiliateImage="https://placehold.co/600x100/4f46e5/ffffff?text=Protect+Your+IP+on+Discord+-+Get+NordVPN"
        />

        {/* --- RESTORED FORMAT BUTTONS SECTION --- */}
        <section className="mt-12 w-full max-w-4xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <LayoutGrid className="text-indigo-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-slate-900">Specific Format Tools</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formats.map((fmt) => (
              <Link 
                key={fmt} 
                href={`/${fmt}`} 
                className="flex items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-white hover:shadow-lg transition-all group"
              >
                <div className="text-center">
                  <span className="block font-black text-xl text-slate-800 group-hover:text-indigo-600 uppercase">
                    .{fmt}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Compressor
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURE GRID */}
        <section className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 text-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Files className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900">Bulk Upload</h3>
            <p className="text-xs text-slate-500">Queue dozens of files at once.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Lock className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900">100% Private</h3>
            <p className="text-xs text-slate-500">Processing happens in your browser.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900">Unlimited</h3>
            <p className="text-xs text-slate-500">No daily limits or watermarks.</p>
          </div>
        </section>

        {/* AD SPOT 2 */}
        <div className="mt-12 w-full max-w-3xl">
          <BannerRotator
            mode="affiliate"
            slot="0987654321"
            affiliateLink="https://www.cdkeys.com/"
            affiliateImage="https://placehold.co/728x90/10b981/ffffff?text=Cheap+Steam+Keys+&+Windows+Licenses"
          />
        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-20 py-10 text-center text-slate-400 text-sm border-t border-slate-200 w-full px-4">
        <div className="flex justify-center gap-8 mb-6 font-bold uppercase tracking-widest text-[10px]">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-indigo-600 transition-colors">Contact</Link>
          <Link href="/" className="hover:text-indigo-600 transition-colors">Terms</Link>
        </div>
        <p className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4" />
          Client-Side Secure: No files are uploaded to our servers.
        </p>
        <p>&copy; {new Date().getFullYear()} Discord Compression Tool.</p>
      </footer>
    </main>
  );
}
