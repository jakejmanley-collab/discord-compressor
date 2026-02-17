import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Discord Video Compressor",
  description: "Our privacy commitment: No video uploads, 100% client-side processing.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 font-medium hover:underline mb-4 block">&larr; Back to Tool</Link>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-500">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="lead text-lg">
            At <strong>Discord Video Compressor</strong>, we take a fundamentally different approach to privacy. 
            Unlike other online tools, <strong>we do not upload your files to the cloud.</strong>
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <Server className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">No Server Uploads</h3>
              <p className="text-sm text-slate-600">Your videos never leave your device. All processing happens locally in your browser.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <ShieldCheck className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Zero Data Retention</h3>
              <p className="text-sm text-slate-600">Since we never receive your files, we cannot store, view, or share them. </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. How Our Technology Works</h3>
          <p>
            We use <strong>WebAssembly (FFmpeg.wasm)</strong> to run professional video editing software directly inside your web browser. 
            When you select a file, your browser processes the data using your own computer's CPU power. 
            No bytes are ever sent to a remote server.
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Data We Collect</h3>
          <p>We believe in data minimization. We only collect anonymous usage statistics to help us improve the tool:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Analytics:</strong> We may use tools like Google Analytics to see which pages are popular. This data is anonymous.</li>
            <li><strong>Errors:</strong> If the compression engine crashes, we may receive an anonymous error report.</li>
          </ul>

          <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Advertising</h3>
          <p>
            To keep this tool free, we may display advertisements. These third-party ad networks may use cookies to serve relevant ads based on your visits to this and other websites. 
            You can opt out of personalized advertising by visiting <a href="https://optout.aboutads.info" target="_blank" rel="nofollow noreferrer">aboutads.info</a>.
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Your Consent</h3>
          <p>
            By using our website, you consent to this Privacy Policy.
          </p>
        </div>

      </div>
    </main>
  );
}
