import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://taw10.ma';
  const languages = ['fr', 'ar', 'en'];

  // 1. Static routes
  const staticPaths = ['', '/blog', '/legal'];
  
  // 2. Services routes (FR keys cover all languages)
  const serviceKeys = [
    'domiciliation',
    'creation-entreprise',
    'secretariat',
    'accompagnement-juridique',
    'support-administratif',
    'conseil-strategique'
  ];
  const servicePaths = serviceKeys.map(key => `/services/${key}`);

  // Helper to construct sitemap entries for a path across languages
  const getSitemapEntries = (
    path: string, 
    priority: number, 
    changeFrequency: 'weekly' | 'monthly' | 'yearly', 
    lastModified: Date = new Date()
  ) => {
    const entries = [
      // Base non-prefixed entry (defaults to FR in middleware)
      {
        url: `${baseUrl}${path}`,
        lastModified,
        changeFrequency,
        priority,
      }
    ];

    // Localized prefixed entries
    languages.forEach((lang) => {
      entries.push({
        url: `${baseUrl}/${lang}${path}`,
        lastModified,
        changeFrequency,
        priority,
      });
    });

    return entries;
  };

  const staticEntries = staticPaths.flatMap(path => {
    const priority = path === '' ? 1.0 : path === '/blog' ? 0.9 : 0.3;
    const freq = path === '/legal' ? ('yearly' as const) : ('weekly' as const);
    return getSitemapEntries(path, priority, freq);
  });

  const serviceEntries = servicePaths.flatMap(path => {
    return getSitemapEntries(path, 0.8, 'monthly' as const);
  });

  const blogEntries = BLOG_POSTS.flatMap(post => {
    const path = `/blog/${post.slug}`;
    const lastModified = new Date(post.date);
    return getSitemapEntries(path, 0.8, 'monthly' as const, lastModified);
  });

  // 3. City landing page routes
  const cityKeys = ['casablanca', 'rabat', 'marrakech', 'agadir', 'tanger'];
  const cityPaths = cityKeys.map(key => `/domiciliation-creation/${key}`);
  const cityEntries = cityPaths.flatMap(path => {
    return getSitemapEntries(path, 0.8, 'monthly' as const);
  });

  return [...staticEntries, ...serviceEntries, ...blogEntries, ...cityEntries];
}
