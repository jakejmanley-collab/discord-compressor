import { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";

export const metadata: Metadata = {
  title: "Message Sent | Discord Video Compressor",
  description: "Thank you for reaching out. We have received your message.",
};

export default function ContactSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4 font-sans">
      <div className="max-w-md w-full bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-slate-200 text-center">
        
        {/* SUCCESS ICON */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <Icons.CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
          Message Sent!
        </h1>
        
        <p className="text-slate-500 leading-relaxed mb-10">
          Thank you for reaching out. We've received your inquiry and our team will get back to you within 24-48 hours.
        </p>

        <div className="space-y-4">
          <Link 
            href="/" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Icons.Video className="w-5 h-5" />
            <span>Back to Compressor</span>
          </Link>
          
          <Link 
            href="/contact" 
            className="block text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
          >
            Send another message
          </Link>
        </div>

        {/* SOCIAL LINKS / TRUST */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center gap-6 text-slate-300">
           <Icons.Twitter className="w-5 h-5 hover:text-sky-400 cursor-pointer transition-colors" />
           <Icons.Github className="w-5 h-5 hover:text-slate-900 cursor-pointer transition-colors" />
           <Icons.Disc className="w-5 h-5 hover:text-indigo-500 cursor-pointer transition-colors" />
        </div>
      </div>
    </main>
  );
}
