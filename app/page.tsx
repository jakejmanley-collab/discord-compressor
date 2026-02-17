import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { CompressorTool } from "@/components/CompressorTool";
import { ShieldCheck, Zap, Files, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Bulk Discord Video Compressor | 8MB Unlimited",
  description: "Compress multiple videos at once. No limits. No Nitro.",
};

export default function Home() {
  const formats = ["mp4", "mov", "mkv", "avi", "webm", "wmv"];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10">
      <div className="w-full flex flex-col items-center max-w-5xl px-4">
        
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Bulk Discord Compressor</h1>
          <p className="text-slate-500 text-xl">Shrink multiple clips to <span className="text-indigo-600 font-bold">under 8MB</span> at once.</p>
        </div>

        {/* This is a server component calling a client component */}
        <Suspense fallback={<div className="h-64 w-full max-w-2xl bg-white rounded-3xl animate-pulse" />}>
          <CompressorTool format="VIDEO" />
        </Suspense>

        <section className="grid md:grid-cols-3 gap-6 w-full max-w-4xl mt-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <Files className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold">Bulk Upload</h3>
            <p className="text-sm text-slate-500">Drop as many files as you want. We queue them.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <Lock className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold">100% Private</h3>
            <p className="text-sm text-slate-500">Files never leave your browser.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-bold">Unlimited</h3>
            <p className="text-sm text-slate-500">No hourly limits or watermarks.</p>
          </div>
        </section>

      </div>
    </main>
  );
}
