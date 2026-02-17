"use client";

import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    
    // Replace YOUR_UNIQUE_ID_HERE with your Formspree ID
    const response = await fetch("https://formspree.io/f/xqedbvkl", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* NAVIGATION */}
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all mb-8 group">
          <Icons.ArrowLeft className="w-4 h-4" /> 
          <span>Back to Compressor</span>
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* LEFT COLUMN: INFO */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                Get in Touch
              </h1>
              <p className="text-slate-500 leading-relaxed">
                Found a bug? Have a feature request? Our team usually responds within 24-48 hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-indigo-50 rounded-xl h-fit">
                  <Icons.Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest">Email</h4>
                  <p className="text-xs text-slate-500 font-medium lowercase">support@discordcompression.com</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-100">
               <Icons.ShieldCheck className="w-8 h-8 mb-4 text-indigo-200" />
               <h4 className="font-bold mb-1">100% Private</h4>
               <p className="text-xs text-indigo-100 leading-relaxed">
                 We value your privacy. We only use your email to respond to your specific inquiry.
               </p>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM / SUCCESS STATE */}
          <div className="md:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-200 min-h-[500px] flex flex-col justify-center">
              
              {status === "success" ? (
                <div className="text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icons.CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h2>
                  <p className="text-slate-500 mb-8">Thank you for reaching out. We've received your inquiry.</p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="text-indigo-600 font-bold hover:underline uppercase tracking-widest text-xs"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="Your Name"
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="you@example.com"
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-medium" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Subject</label>
                    <select 
                      name="subject"
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-medium appearance-none cursor-pointer"
                    >
                      <option value="General">General Inquiry</option>
                      <option value="Bug">Bug Report</option>
                      <option value="Feature">Feature Request</option>
                      <option value="Ads">Advertising</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Message</label>
                    <textarea 
                      name="message"
                      required
                      rows={5} 
                      placeholder="How can we help?"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-medium resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === "submitting"}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:bg-slate-300"
                  >
                    {status === "submitting" ? (
                      <Icons.Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Icons.Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {status === "error" && (
                    <p className="text-red-500 text-xs font-bold text-center">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </div>
          </div>

        </div>

        <footer className="mt-20 py-8 border-t border-slate-200 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            Discord Video Compression Tool &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}
