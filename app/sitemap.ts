import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://discordcompression.com';
  
  // 1. Define your static routes
  // These are the core pages of your site
  const staticRoutes = [
    '',          // Homepage
    '/privacy',  // Privacy Policy
    '/contact',  // Contact Page
  ];

  // 2. Define your format-specific SEO pages
  // These match the logic in your app/[format]/page.tsx
  const formats = ['mp4', 'mov', 'mkv', 'avi', 'webm', 'wmv'];

  // 3. Generate the sitemap array
  return [
    // Add Static Routes
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.3, // Homepage gets 1.0, others get 0.3
    })),

    // Add Format Routes (High Value SEO)
    ...formats.map((fmt) => ({
      url: `${baseUrl}/${fmt}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
