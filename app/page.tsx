import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CompressorTool } from "@/components/CompressorTool";
import * as Icons from "lucide-react";

export const metadata: Metadata = {
  title: "Bulk Discord Video Compressor | 8MB Unlimited",
  description: "Compress multiple videos at once. No limits. No Nitro.",
};

export default function Home() {
  const formats = ["mp4", "mov", "mkv", "avi", "webm", "wmv"];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-10">
      <div className="w-full flex flex-col items-center max-w-5xl px-4">
        
        {/* HEADER */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Bulk Discord Compressor
          </h1>
          <p className="text-slate-500 text-xl font-medium">
            Shrink multiple clips to <span className="text-indigo-600 font-bold">under 8MB</span> at once.
          </p>
        </div>

        {/* TOOL */}
        <div className="w-full flex justify-center mb-12">
          <Suspense fallback={<div className="h-64 w-full max-w-2xl bg-white rounded-3xl animate-pulse flex items-center justify-center">Loading Tool...</div>}>
            <CompressorTool format="VIDEO" />
          </Suspense>
        </div>

        {/* FORMAT BUTTONS - THE SECTION THAT WAS MISSING */}
        <section className="w-full max-w-4xl bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Icons.LayoutGrid className="text-indigo-600 w-8 h-8" />
            <h2 className="text-2xl font-black text-slate-900 uppercase">Tools by Format</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {formats.map((fmt) => (
              <Link 
                key={fmt} 
                href={`/${fmt}`} 
                className="group flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-indigo-500 hover:bg-white transition-all shadow-sm"
              >
                <span className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 uppercase">
                  .{fmt}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  8MB Optimizer
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-6 w-full max-w-4xl text-center mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <Icons.Files className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900">Bulk Upload</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Queue dozens of files at once. Our engine processes them one-by-one to save your RAM.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <Icons.Lock className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900">100% Private</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Files never leave your browser. Processing happens entirely on your hardware.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <Icons.Zap className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900">Unlimited</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">No daily limits, no hidden fees, and no watermarks on your video.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full pt-10 border-t border-slate-200 text-center text-slate-400">
          <div className="flex justify-center gap-6 mb-4 text-xs font-bold uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          </div>
          <p className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase">
            <Icons.ShieldCheck className="w-3 h-3" />
            Secure Client-Side Processing
          </p>
        </footer>
      </div>
    </main>
  );
}
