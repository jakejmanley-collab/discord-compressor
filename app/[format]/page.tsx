import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompressorTool } from "@/components/CompressorTool";
import { ShieldCheck, Zap, Globe } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// --- 1. SUPABASE CLIENT ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- 2. LOCAL FALLBACK CONTENT ---
const contentMap: Record<string, any> = {
  mp4: {
    title: "Compress MP4 for Discord (8MB Fix)",
    subtitle: "The Ultimate Guide to Discord's File Size Limit",
    p1: "Discord's standard 8MB file upload limit is the most common frustration for gamers.",
    p2: "Our tool solves this by intelligently adjusting the bitrate to hit exactly 7.9MB.",
    faq: [{ q: "Why 8MB?", a: "Discord enforces this for free accounts." }]
  },
  mov: {
    title: "Compress MOV for Discord (iPhone Fix)",
    subtitle: "Fixing Black Screens and Upload Failures",
    p1: "If you record clips on an iPhone or Mac, you are likely using the MOV format with HEVC (H.265).",
    p2: "Our tool converts your heavy Apple MOV file into a widely compatible H.264 MP4.",
    faq: [{ q: "Why won't my iPhone video play?", a: "Discord has poor support for Apple's HEVC codec." }]
  },
  mkv: {
    title: "Compress OBS MKV for Discord",
    subtitle: "Share Gameplay Without Remuxing",
    p1: "Streamers record in MKV to prevent file corruption, but Discord does not support MKV playback.",
    p2: "Skip the extra steps. Our tool accepts raw OBS MKV files directly.",
    faq: [{ q: "Why does Discord hate MKV?", a: "MKV is a container format that browsers don't natively support." }]
  },
  avi: {
    title: "Convert AVI to Discord MP4",
    subtitle: "Modernize Legacy Video Files",
    p1: "AVI is an older format that creates massive uncompressed files.",
    p2: "We modernize your video by converting the heavy AVI stream into a highly efficient H.264 MP4.",
    faq: [{ q: "Why are AVI files so big?", a: "AVI often uses less efficient compression methods." }]
  },
  webm: {
    title: "Optimize WebM for Discord",
    subtitle: "Perfect Compression for Web Clips",
    p1: "WebM is great for the web, but unoptimized exports can still exceed Discord's limits.",
    p2: "Our tool ensures transparency and quality are preserved.",
    faq: [{ q: "Is it fast?", a: "Yes, WebM processing is extremely fast in the browser." }]
  },
  wmv: {
    title: "Compress WMV for Discord",
    subtitle: "Fix Windows Media Playback",
    p1: "Legacy Windows clips (WMV) often fail to embed on Discord mobile.",
    p2: "Ensure your friends on iPhone and Android can actually watch your clips.",
    faq: [{ q: "Is it free?", a: "Yes, completely free and unlimited." }]
  }
};

// --- 3. DYNAMIC METADATA ---
export async function generateMetadata({ params }: { params: { format: string } }): Promise<Metadata> {
  const formatKey = params.format.toLowerCase();
  
  const { data: article } = await supabase
    .from('seo_articles')
    .select('*')
    .eq('slug', formatKey)
    .eq('site_tag', 'discord')
    .single();

  const content = article || contentMap[formatKey];
  if (!content) return { title: "Not Found" };

  return {
    title: article?.title || content.title,
    description: article?.description || `Compress ${formatKey} for Discord. ${content.p1.substring(0, 100)}...`,
  };
}

// --- 4. PAGE COMPONENT ---
export default async function FormatPage({ params }: { params: { format: string } }) {
  const formatKey = params.format.toLowerCase();

  // 1. Fetch from Supabase
  const { data: article } = await supabase
    .from('seo_articles')
    .select('*')
    .eq('slug', formatKey)
    .eq('site_tag', 'discord')
    .single();

  // 2. Fallback to local map
  const localContent = contentMap[formatKey];
  
  // 404 if neither exists
  if (!article && !localContent) return notFound();

  const title = article?.h1 || localContent?.title;
  const subtitle = article?.description || localContent?.subtitle;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-10 font-sans">
      <div className="w-full flex flex-col items-center max-w-5xl px-4">
        
        {/* HEADER */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-slate-900">
            {title}
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
            {subtitle}
          </p>
        </div>

        {/* TOOL */}
        <Suspense fallback={<div className="h-96 w-full max-w-xl bg-white rounded-xl shadow-xl animate-pulse" />}>
          <CompressorTool format={formatKey.toUpperCase()} />
        </Suspense>

        {/* SEO CONTENT AREA */}
        <div className="mt-20 grid md:grid-cols-12 gap-12 w-full text-left">
          <article className="md:col-span-8">
            {article ? (
              <div 
                className="prose prose-slate lg:prose-lg max-w-none
                  prose-h2:text-2xl prose-h2:font-black prose-h2:uppercase prose-h2:italic
                  prose-p:text-slate-600 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <div className="prose prose-slate lg:prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">{localContent.subtitle}</h2>
                <p className="text-slate-600 mb-6">{localContent.p1}</p>
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 my-8 rounded-r-lg">
                  <p className="text-indigo-800 font-bold">{localContent.p2}</p>
                </div>
              </div>
            )}
          </article>

          {/* SIDEBAR */}
          <aside className="md:col-span-4 space-y-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-green-600" /> Privacy Verified
               </h3>
               <p className="text-xs text-slate-500 font-medium">
                 This tool uses <b>WebAssembly (WASM)</b> to process video locally. Your files never leave your device.
               </p>
             </div>

             <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl">
               <h3 className="font-bold mb-4 flex items-center gap-2 text-indigo-400">
                 <Globe className="w-4 h-4" /> All Guides
               </h3>
               <div className="flex flex-wrap gap-2">
                 {Object.keys(contentMap).map(key => (
                   <Link 
                     key={key} 
                     href={`/${key}`} 
                     className="text-[10px] font-bold bg-slate-800 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest"
                   >
                     {key}
                   </Link>
                 ))}
               </div>
             </div>
          </aside>
        </div>
      </div>

      <footer className="mt-24 py-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-200 w-full">
        <p>&copy; {new Date().getFullYear()} Discord Compression Tool • Client-Side Only</p>
      </footer>
    </main>
  );
}
