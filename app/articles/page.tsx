import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Revalidate the page every hour
export const revalidate = 3600;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize a standard read-only client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function ArticlesPage() {
  // Removed last_updated to prevent schema cache errors
  const { data: articles, error } = await supabase
    .from('seo_articles')
    .select('slug, title, description')
    .eq('site_tag', 'discord');

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8 text-slate-900">
          Compression Guides & Articles
        </h1>
        
        {/* Debug block to show exact Supabase errors on the screen */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-red-600 font-mono text-sm">
            <strong>Database Error:</strong> {error.message}
            <br/>
            <em>Hint: If it says "permission denied" or returns 0 rows but no error, you need to enable an RLS "Select" policy in Supabase.</em>
          </div>
        )}

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
                  <p className="text-slate-600">{article.description}</p>
                )}
              </Link>
            ))
          ) : !error ? (
            <div className="p-8 bg-white rounded-2xl border-2 border-slate-200 text-center">
              <p className="text-slate-500 font-medium">No articles found for the site_tag "discord". Check RLS policies.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
