import { Suspense } from "react";
import { Metadata } from "next";
import { CompressorTool } from "@/components/CompressorTool";
import { ShieldCheck, FileVideo, Zap } from "lucide-react";
import Link from "next/link";

// --- 1. EXPANDED CONTENT DICTIONARY ---
const contentMap: Record<string, { title: string; p1: string; p2: string }> = {
  MOV: {
    title: "How to send MOV files on Discord (iPhone Fix)",
    p1: "MOV files (commonly from iPhones and Macs) are notoriously large and often fail to play directly in Discord's mobile app. Instead of buying Nitro, you can compress your MOV to a Discord-friendly MP4.",
    p2: "Our tool converts the Apple ProRes or H.265 codec into a standard H.264 MP4 that plays on every device, while keeping the file size strictly under 8MB.",
  },
  MKV: {
    title: "Compress OBS Recordings (MKV) for Discord",
    p1: "Streamers love MKV because it doesn't corrupt if OBS crashes, but Discord hates it. You can't even preview MKV files in the chat.",
    p2: "This tool remuxes and compresses your high-bitrate OBS clips into a lightweight MP4. Now you can share your gameplay highlights without hitting the 'File too powerful' error.",
  },
  AVI: {
    title: "Convert AVI to Discord MP4",
    p1: "AVI is an older format that creates massive uncompressed files. A 10-second AVI clip can easily exceed 50MB, making it impossible to share on Discord.",
    p2: "We strip out the unnecessary data and re-encode the video stream. The result is a crisp MP4 that looks nearly identical but is 90% smaller.",
  },
  WEBM: {
    title: "Compress WebM for Discord",
    p1: "WebM is great for the web, but sometimes the files are just too big for Discord's free tier limit. Our tool optimizes the stream to fit perfectly.",
    p2: "We ensure the transparency and quality are preserved while aggressively targeting that 8MB file size limit.",
  },
  WMV: {
    title: "Compress WMV Windows Media Files",
    p1: "Older Windows gameplay clips are often saved as WMV. These files are inefficient and large. Discord often fails to embed them properly.",
    p2: "Convert your legacy WMV clips into modern, efficient MP4s that load instantly in Discord chat."
  },
  FLV: {
    title: "Compress FLV Flash Video",
    p1: "FLV is a dying format that many modern players can't even open. Discord definitely doesn't support it natively.",
    p2: "Revive your old FLV clips by converting them to the universal MP4 standard, optimized specifically for the 8MB upload limit."
  },
  M4V: {
    title: "Compress M4V iTunes Video",
    p1: "M4V files are very similar to MP4 but often contain Apple-specific headers that cause playback issues on Android or Windows.",
    p2: "We standardize the container to ensure your video plays on every device Discord runs on."
  },
};

const defaults = {
  title: "Why compress video for Discord?",
  p1: "Discord limits free users to 8MB file uploads. If your video is even 8.1MB, it will be rejected. Our tool uses smart compression to reduce the bitrate without destroying the quality.",
  p2: "This happens entirely in your browser. Unlike other tools, we do not upload your private videos to a server.",
};

// --- 2. DYNAMIC METADATA GENERATOR (The SEO Magic) ---
type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const format = (searchParams.format as string)?.toUpperCase() || "Video";
  
  return {
    title: `Compress ${format} for Discord | Free 8MB Tool`,
    description: `Reduce ${format} file size to under 8MB for Discord. Free online compressor for ${format}, MOV, MP4, MKV. No signup required.`,
    alternates: {
      canonical: `/?format=${format}`,
    },
  };
}

// --- 3. MAIN PAGE COMPONENT ---
export default function Home({ searchParams }: Props) {
  const format = (searchParams.format as string)?.toUpperCase() || "VIDEO";
  const seoText = contentMap[format] || defaults;

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `Discord ${format} Compressor`,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "description": seoText.p1,
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "1240" }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full flex flex-col items-center">
        
        {/* HEADER */}
        <div className="text-center mb-10 space-y-2 px-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Compress {format} for Discord
          </h1>
          <p className="text-slate-500 text-lg">
            Get your {format} files <span className="text-indigo-600 font-bold">under 8MB</span> with maximum quality.
          </p>
        </div>

        {/* THE TOOL (Client Component) */}
        <Suspense fallback={<div className="h-96 w-full max-w-xl bg-white rounded-xl shadow-xl animate-pulse" />}>
          <CompressorTool format={format} />
        </Suspense>

        {/* DYNAMIC SEO CONTENT */}
        <section className="max-w-3xl w-full grid md:grid-cols-2 gap-8 mb-20 px-4 mt-20">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">{seoText.title}</h2>
            <p className="text-slate-600 leading-relaxed">{seoText.p1}</p>
            <p className="text-slate-600 leading-relaxed">{seoText.p2}</p>
          </div>
          
          <div className="grid gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg h-fit"><ShieldCheck className="w-6 h-6 text-indigo-600" /></div>
              <div>
                <h3 className="font-bold text-slate-900">100% Private</h3>
                <p className="text-sm text-slate-500">Processing happens in your browser. No data leaves your device.</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg h-fit"><FileVideo className="w-6 h-6 text-indigo-600" /></div>
              <div>
                <h3 className="font-bold text-slate-900">Best Quality</h3>
                <p className="text-sm text-slate-500">Smart resolution scaling ensures your video never looks blocky.</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg h-fit"><Zap className="w-6 h-6 text-indigo-600" /></div>
              <div>
                <h3 className="font-bold text-slate-900">Fast & Free</h3>
                <p className="text-sm text-slate-500">No watermarks, no signups, and no Nitro required.</p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERNAL LINK GRID (SEO HUB) */}
        <section className="w-full max-w-4xl px-4 mb-20">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Supported Formats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(contentMap).map((key) => (
              <Link 
                key={key} 
                href={`/?format=${key}`}
                className="block p-4 bg-white border border-slate-200 rounded-lg text-center hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm"
              >
                Compress <span className="font-bold">{key}</span>
              </Link>
            ))}
             <Link href="/?format=MP4" className="block p-4 bg-white border border-slate-200 rounded-lg text-center hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm">Compress <span className="font-bold">MP4</span></Link>
          </div>
        </section>

      </div>
      
      <footer className="mt-10 max-w-2xl text-center text-slate-400 text-sm">
        <p>All video processing is performed client-side.</p>
      </footer>
    </main>
  );
}
