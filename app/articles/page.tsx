import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Revalidate the page every hour so new articles appear automatically
export const revalidate = 3600;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize a standard read-only client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function ArticlesPage() {
  // Fetch the dynamically generated SEO articles specifically for Discord
  const { data: articles, error } = await supabase
    .from('seo_articles')
    .select('slug, title, description, last_updated')
    .eq('site_tag', 'discord')
    .order('last_updated', { ascending: false });

  if (error) {
    console.error('Supabase error fetching articles:', error);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8 text-slate-900">
          Compression Guides & Articles
        </h1>
        
        <div className="grid gap-6">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <Link 
                href={`/${article.slug}`} 
                key={article.slug}
                className="block bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:shadow-lg transition-all"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {article.title || article.slug.replace(/-/g, ' ')}
                </h2>
                {article.description && (
                  <p className="text-slate-600 mb-4">{article.description}</p>
                )}
                {article.last_updated && (
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Updated: {new Date(article.last_updated).toLocaleDateString()}
                  </span>
                )}
              </Link>
            ))
          ) : (
            <div className="p-8 bg-white rounded-2xl border-2 border-slate-200 text-center">
              <p className="text-slate-500 font-medium">No articles found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
