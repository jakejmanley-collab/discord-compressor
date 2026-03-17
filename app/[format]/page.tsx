import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompressorTool } from "@/components/CompressorTool";
import { ShieldCheck, Zap, HelpCircle, Settings, Globe } from "lucide-react";
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
    content: "<p>Our tool solves this by intelligently adjusting the bitrate to hit exactly 7.9MB.</p>",
    faq: [{ q: "Why 8MB?", a: "Discord enforces this for free accounts." }]
  ,
  // ... (Keep your other local formats: mov, mkv, avi, webm, wmv here)
};

// --- 3. DYNAMIC METADATA ---
export async function generateMetadata({ params }: { params: { format: string } }): Promise<Metadata> {
  const formatKey = params.format.toLowerCase();
  
  // Try to find in Supabase first
  const { data: article } = await supabase
    .from('seo_articles')
    .select('*')
    .eq('slug', formatKey)
    .eq('site_tag', 'discord')
    .single();

  const content = article || contentMap[formatKey];
  if (!content) return { title: "Not Found" };

  return {
    title: content.title || content.h1,
    description: content.description || `Compress ${formatKey} for Discord.`,
  };
}

// --- 4. PAGE COMPONENT ---
export default async function FormatPage({ params }: { params: { format: string } }) {
  const formatKey = params.format.toLowerCase();

  // 1. Fetch from Supabase (The "Traffic Weapon" content)
  const { data: article } = await supabase
    .from('seo_articles')
    .select('*')
    .eq('slug', formatKey)
    .eq('site_tag', 'discord')
    .single();

  // 2. Fallback to local map if no DB article exists
  const localContent = contentMap[formatKey];
  const isBaseFormat = !!localContent;

  if (!article && !isBaseFormat) return notFound();

  // Unified data object
  const title = article?.h1 || localContent?.title;
  const subtitle = article?.description || localContent?.subtitle;
  const bodyContent = article?.content || localContent?.p1; // Fallback logic

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
        <div className="mt-20 grid md:grid-cols-12 gap-12 w-full">
          <article className="md:col-span-8">
            {article ? (
              // This renders the "Blasted" content from your Admin Panel
              <div 
                className="prose prose-slate lg:prose-lg max-w-none
                  prose-h2:text-2xl prose-h2:font-black prose-h2:uppercase prose-h2:italic
                  prose-p:text-slate-600 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              // This renders your original hardcoded MP4/MOV guides
              <div className="prose prose-slate lg:prose-lg">
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
                 This tool uses <b>WebAssembly (WASM)</b> to process video locally. Your data never touches a server.
               </p>
             </div>

             <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl">
               <h3 className="font-bold mb-4 flex items-center gap-2 text-indigo-400">
                 <Globe className="w-4 h-4" /> All Guides
               </h3>
               <div className="flex flex-wrap gap-2">
                 {/* This links to your base formats */}
                 {Object.keys(contentMap).map(key => (
                   <Link key={key} href={`/${key}`} className="text-[10px] font-bold bg-slate-800 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest">
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
