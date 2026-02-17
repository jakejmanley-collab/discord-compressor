import { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Discord Video Compressor",
  description: "Learn how we protect your data with 100% client-side video compression. No uploads, no servers, zero data retention.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl border border-slate-200">
        
        {/* HEADER */}
        <header className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all mb-8 group">
            <Icons.ArrowLeft className="w-4 h-4" /> 
            <span>Back to Compressor</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 font-medium">Last Updated: February 17, 2026</p>
        </header>

        {/* CORE PRIVACY PILLARS */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
            <Icons.ServerOff className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2 text-lg">No Server Uploads</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Your videos never leave your browser. We process your data locally using your device's own hardware.</p>
          </div>
          <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
            <Icons.ShieldCheck className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Zero Retention</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Since we never receive your files, we cannot store, view, or share them. You are in total control.</p>
          </div>
        </div>

        {/* DETAILED CONTENT */}
        <div className="prose prose-slate prose-indigo max-w-none text-slate-600 leading-relaxed">
          <h2 className="text-2xl font-black text-slate-900 mt-10 mb-4">1. Our Technology approach</h2>
          <p>
            Discord Video Compressor uses <strong>WebAssembly (FFmpeg.wasm)</strong> technology. This allows us to run heavy video processing software directly inside your web browser (Chrome, Safari, Firefox). 
            When you select a video, your browser handles the computation. 
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10 mb-4">2. Information We Collect</h2>
          <p>We believe in radical data minimization. We only collect the following:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Usage Analytics:</strong> We use anonymous tools to see which pages are popular (e.g., .MOV vs .MP4) to help us improve the tool.</li>
            <li><strong>Error Logging:</strong> If the compression engine fails, we may receive an anonymous technical report to fix the bug.</li>
            <li><strong>Cookies:</strong> Standard cookies are used to remember your preferences and manage advertisements.</li>
          </ul>

          <h2 className="text-2xl font-black text-slate-900 mt-10 mb-4">3. Advertising & Third Parties</h2>
          <p>
            To keep this tool 100% free and unlimited, we display advertisements. These third-party vendors (such as Google AdSense) may use cookies to serve ads based on your prior visits to this or other websites. 
            You can opt out of personalized advertising by visiting your browser settings or <a href="https://www.aboutads.info" target="_blank" className="text-indigo-600 underline">AboutAds.info</a>.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10 mb-4">4. Security</h2>
          <p>
            By processing files client-side, we eliminate the biggest security risk in video compression: the transit of your personal files over the internet to a remote server. 
            Your data remains encrypted by your own OS environment throughout the entire process.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-10 mb-4">5. Contact Us</h2>
          <p>
            If you have questions about our privacy approach or the WebAssembly technology we use, please reach out to us via our GitHub repository or official contact channels.
          </p>
        </div>

        {/* FOOTER */}
        <footer className="mt-16 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Discord Video Compressor
          </p>
        </footer>
      </div>
    </main>
  );
}
