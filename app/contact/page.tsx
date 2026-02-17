import { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support | Discord Video Compressor",
  description: "Have questions or found a bug? Reach out to the Discord Video Compressor support team for help with bulk uploads and video optimization.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* NAVIGATION */}
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all mb-8 group">
          <Icons.ArrowLeft className="w-4 h-4" /> 
          <span>Back to Compressor</span>
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* LEFT COLUMN: INFO & TRUST */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                How can we help?
              </h1>
              <p className="text-slate-500 leading-relaxed">
                Found a bug? Have a feature request? Our team usually responds to inquiries within 24-48 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-indigo-50 rounded-xl h-fit">
                  <Icons.Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Direct Email</h4>
                  <p className="text-xs text-slate-500 font-medium">support@discordcompression.com</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-indigo-50 rounded-xl h-fit">
                  <Icons.Bug className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Bug Reports</h4>
                  <p className="text-xs text-slate-500 font-medium">Please include your file type and browser.</p>
                </div>
              </div>
            </div>

            {/* TRUST BADGE */}
            <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-lg shadow-indigo-100">
               <Icons.ShieldCheck className="w-8 h-8 mb-4 text-indigo-200" />
               <h4 className="font-bold mb-1">Secure & Private</h4>
               <p className="text-xs text-indigo-100 leading-relaxed">
                 We never see your files. If you're having an issue, we only see the technical error logs, never your video content.
               </p>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="md:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-200">
              
              <form 
                action="https://formspree.io/f/xqedbvkl" 
                method="POST"
                className="space-y-6"
              >
                {/* FORMSPREE REDIRECT */}
                <input type="hidden" name="_next" value="https://discordcompression.com/contact/success" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="Enter your name"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Reason for contact</label>
                  <div className="relative">
                    <select 
                      name="subject"
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-medium appearance-none cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Partnership">Advertising / Partnership</option>
                    </select>
                    <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Your Message</label>
                  <textarea 
                    name="message"
                    required
                    rows={6} 
                    placeholder="Describe your issue or request..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-medium resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                  <Icons.Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* FOOTER AREA */}
        <footer className="mt-20 py-8 border-t border-slate-200 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            Discord Video Compression Tool &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}
