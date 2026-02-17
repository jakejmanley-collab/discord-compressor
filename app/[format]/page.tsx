import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompressorTool } from "@/components/CompressorTool";
import { ShieldCheck, Zap, HelpCircle, Settings } from "lucide-react";

// --- 1. CONTENT DICTIONARY ---
const contentMap: Record<string, { title: string; subtitle: string; p1: string; p2: string; p3: string; guide: string[]; faq: {q: string, a: string}[] }> = {
  mp4: {
    title: "Compress MP4 for Discord (8MB Fix)",
    subtitle: "The Ultimate Guide to Discord's File Size Limit",
    p1: "Discord's standard 8MB file upload limit is the most common frustration for gamers. The MP4 format, while universal, often creates files that are slightly too large, resulting in the dreaded 'Your files are too powerful' error message.",
    p2: "Most users try to trim the video or use shady websites. Our tool solves this by intelligently adjusting the bitrate to hit exactly 7.9MB, allowing you to keep the full 1080p resolution.",
    p3: "By using client-side FFmpeg technology, your personal memes and gameplay clips are never uploaded to a cloud server. They stay on your device.",
    guide: [
      "Click the upload box and select your MP4 file.",
      "Wait for the engine to analyze the bitrate.",
      "Our tool calculates the settings to hit 8MB.",
      "Download your Discord-ready clip."
    ],
    faq: [
      { q: "Why is the limit 8MB?", a: "Discord enforces a strict 8MB limit for free accounts to save storage costs." },
      { q: "Does this reduce quality?", a: "We use 'Smart Bitrate Targeting' to remove invisible data while keeping the video crisp." }
    ]
  },
  mov: {
    title: "Compress MOV for Discord (iPhone Fix)",
    subtitle: "Fixing Black Screens and Upload Failures",
    p1: "If you record clips on an iPhone or Mac, you are likely using the MOV format with HEVC (H.265). Discord struggles with this, often showing a black screen or hitting the size limit immediately.",
    p2: "Our tool converts your heavy Apple MOV file into a widely compatible H.264 MP4. This reduces the file size drastically and fixes the black screen playback issues.",
    p3: "Stop emailing files to yourself to shrink them. Our browser-based converter handles the heavy lifting instantly.",
    guide: [
      "Select your .MOV file from your device.",
      "We detect the HEVC codec automatically.",
      "The tool converts it to a standard MP4.",
      "Download and share without errors."
    ],
    faq: [
      { q: "Why won't my iPhone video play?", a: "Discord has poor support for Apple's HEVC codec. We convert it to H.264 MP4 to fix this." },
      { q: "Will I lose audio?", a: "No. We passthrough or convert the audio stream without quality loss." }
    ]
  },
  mkv: {
    title: "Compress OBS MKV for Discord",
    subtitle: "Share Gameplay Without Remuxing",
    p1: "Streamers record in MKV to prevent file corruption, but Discord does not support MKV playback. You usually have to Remux in OBS and then compress in Handbrake.",
    p2: "Skip the extra steps. Our tool accepts raw OBS MKV files directly, strips the container, and compresses the high-bitrate gameplay down to a chat-friendly 8MB MP4.",
    p3: "Drag the raw file straight from your captures folder and get a shareable link in seconds.",
    guide: [
      "Drag your .MKV recording from OBS.",
      "The tool analyzes the stream.",
      "We re-encode it to fit the 8MB limit.",
      "Download the MP4 and share."
    ],
    faq: [
      { q: "Why does Discord hate MKV?", a: "MKV is a container format that browsers don't natively support for streaming playback." },
      { q: "Is this faster than Handbrake?", a: "Yes, because it is purpose-built to target the 8MB limit automatically." }
    ]
  },
  avi: {
    title: "Convert AVI to Discord MP4",
    subtitle: "Modernize Legacy Video Files",
    p1: "AVI is an older format that creates massive uncompressed files. A 10-second AVI clip can easily exceed 50MB.",
    p2: "We modernize your video by converting the heavy AVI stream into a highly efficient H.264 MP4. The result is a video that looks identical but is often 90% smaller.",
    p3: "Perfect for sharing old Fraps recordings or legacy clips.",
    guide: [
      "Upload your large AVI file.",
      "We transcode the stream to H.264.",
      "The file size is reduced to < 8MB.",
      "Download the optimized MP4."
    ],
    faq: [
      { q: "Why are AVI files so big?", a: "AVI often uses less efficient compression methods compared to modern MP4s." },
      { q: "Will it play on mobile?", a: "Yes, the output MP4 will play on all mobile devices." }
    ]
  },
  webm: {
    title: "Optimize WebM for Discord",
    subtitle: "Perfect Compression for Web Clips",
    p1: "WebM is great for the web, but unoptimized exports can still exceed Discord's limits. We recalculate the bitrate to fit perfectly.",
    p2: "Our tool ensures transparency and quality are preserved while aggressively targeting the 8MB file size.",
    p3: "Ideal for web developers and designers sharing UI animations.",
    guide: [
      "Upload your WebM file.",
      "We optimize the bitrate.",
      "The file shrinks to under 8MB.",
      "Download and share."
    ],
    faq: [
      { q: "Does it keep transparency?", a: "We attempt to preserve alpha channels where possible, or convert to a high-quality MP4 background." },
      { q: "Is it fast?", a: "Yes, WebM processing is extremely fast in the browser." }
    ]
  },
  wmv: {
    title: "Compress WMV for Discord",
    subtitle: "Fix Windows Media Playback",
    p1: "Legacy Windows clips (WMV) often fail to embed on Discord mobile. We convert them to universal MP4s.",
    p2: "Ensure your friends on iPhone and Android can actually watch your clips by modernizing the format.",
    p3: "No software installation required.",
    guide: [
      "Select your WMV file.",
      "We convert it to MP4.",
      "The size is optimized for Discord.",
      "Download the fixed video."
    ],
    faq: [
      { q: "Why use this tool?", a: "WMV is an obsolete format for web sharing. MP4 is the standard." },
      { q: "Is it free?", a: "Yes, completely free and unlimited." }
    ]
  }
};

// --- 2. STATIC PATH GENERATION ---
export async function generateStaticParams() {
  return Object.keys(contentMap).map((format) => ({
    format: format,
  }));
}

// --- 3. METADATA ---
type Props = {
  params: { format: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const format = params.format.toLowerCase();
  const content = contentMap[format];
  
  if (!content) return { title: "Not Found" };

  return {
    title: content.title,
    description: `Free ${format.toUpperCase()} compressor for Discord. ${content.p1.substring(0, 120)}... Fix 'File too powerful' errors.`,
    alternates: { canonical: `/${format}` },
    keywords: [`compress ${format}`, "discord size limit", "8mb video", "discord nitro free"],
    openGraph: {
      title: content.title,
      description: "Fix 'File too powerful' errors instantly. Compress to < 8MB.",
      type: "website",
      url: `https://discordcompression.com/${format}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    }
  };
}

// --- 4. PAGE COMPONENT ---
export default function FormatPage({ params }: Props) {
  const formatKey = params.format.toLowerCase();
  const content = contentMap[formatKey];

  if (!content) return notFound();

  const displayFormat = params.format.toUpperCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="w-full flex flex-col items-center max-w-5xl px-4">
        
        {/* HEADER */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Compress {displayFormat} for Discord
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            Fix "File Too Powerful". Reduce {displayFormat} to <span className="text-indigo-600 font-bold">under 8MB</span>.
          </p>
        </div>

        {/* TOOL */}
        <Suspense fallback={<div className="h-96 w-full max-w-xl bg-white rounded-xl shadow-xl animate-pulse" />}>
          <CompressorTool format={displayFormat} />
        </Suspense>

        {/* SEO CONTENT */}
        <div className="mt-24 grid md:grid-cols-12 gap-12 w-full">
          <article className="md:col-span-8 prose prose-slate lg:prose-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">{content.subtitle}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{content.p1}</p>
            
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 my-8 rounded-r-lg">
              <h3 className="text-indigo-900 font-bold text-lg flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5" /> Why it happens
              </h3>
              <p className="text-indigo-800">{content.p2}</p>
            </div>

            <p className="text-slate-600 leading-relaxed mb-8">{content.p3}</p>

            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-600" />
              How to Compress {displayFormat}
            </h3>
            <ol className="space-y-4 list-decimal list-inside bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              {content.guide.map((step, i) => (
                <li key={i} className="text-slate-700 font-medium pl-2">{step}</li>
              ))}
            </ol>
          </article>

          <aside className="md:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" /> Privacy First
              </h3>
              <p className="text-sm text-slate-500 mb-4">No cloud uploads. 100% Client-side.</p>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold mb-2">Other Formats</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(contentMap).map(key => (
                  <Link key={key} href={`/${key}`} className="text-xs bg-slate-700 hover:bg-indigo-600 px-3 py-1 rounded-full transition-colors uppercase">
                    {key}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ */}
        <section className="w-full mt-24 mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-10 flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-indigo-600" /> FAQ
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {content.faq.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-2">{item.q}</h4>
                <p className="text-slate-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
      
      {/* FOOTER */}
      <footer className="mt-16 py-8 text-center text-slate-400 text-sm border-t border-slate-200 w-full">
        <p className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          All video processing is performed client-side. Your files never leave your device.
        </p>
        <p className="mt-2">&copy; {new Date().getFullYear()} Discord Compression Tool.</p>
      </footer>
    </main>
  );
}
