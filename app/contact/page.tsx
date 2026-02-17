import { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support | Discord Video Compressor",
  description: "Have questions or found a bug? Reach out to the Discord Video Compressor support team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* BACK BUTTON */}
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all mb-8 group">
          <Icons.ArrowLeft className="w-4 h-4" /> 
          <span>Back to Compressor</span>
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* LEFT COL: INFO */}
          <div className="md:col-span-2 space-y-8 text-center md:text-left">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Get in Touch</h1>
              <p className="text-slate-500 leading-relaxed">
                Found a bug with the bulk uploader? Have a feature request? We'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 h-fit text-indigo-600">
                  <Icons.Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email</h4>
                  <p className="text-sm text-slate-500">support@discordcompression.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COL: FORM */}
          <div className="md:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-200">
              
              {/* UPDATED FORM TAG */}
              <form 
                action="https://formspree.io/f/xqedbvkl" // <--- PASTE YOUR URL HERE
                method="POST"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                    <input 
                      type="text" 
                      name="name" // <--- ADDED NAME ATTRIBUTE
                      required
                      placeholder="Your Name"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      type="email" 
                      name="email" // <--- ADDED NAME ATTRIBUTE
                      required
                      placeholder="Email Address"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <select 
                    name="subject" // <--- ADDED NAME ATTRIBUTE
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Advertising / Business</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    name="message" // <--- ADDED NAME ATTRIBUTE
                    required
                    rows={5} 
                    placeholder="How can we help?"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Icons.Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        <footer className="mt-20 pt-8 border-t border-slate-200 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Average response time: 24-48 hours
          </p>
        </footer>
      </div>
    </main>
  );
}
