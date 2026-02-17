import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://discordcompression.com';
  const lastModified = new Date(); // Updates automatically whenever you deploy

  // 1. Define your static routes
  const routes = [
    '', // Homepage
    '/privacy',
    '/contact',
  ];

  // 2. Define your format-specific SEO pages
  const formats = ['mp4', 'mov', 'mkv', 'avi', 'webm', 'wmv'];

  // 3. Build the sitemap array
  return [
    // Homepage (High Priority)
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Format Pages (Medium Priority - This is your SEO juice)
    ...formats.map((fmt) => ({
      url: `${baseUrl}/${fmt}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // Trust Pages (Low Priority)
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
