import { MetadataRoute } from 'next';
import { getPublishedBlogArticles } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch dynamic published articles for sitemap
  const dynamicPosts = await getPublishedBlogArticles('fr');

  const blogEntries = dynamicPosts.flatMap(post => {
    const path = `/blog/${post.slug}`;
    const lastModified = new Date(post.publishedAt || post.createdAt);
    return getSitemapEntries(path, 0.8, 'monthly' as const, lastModified);
  });

  // 3. City landing page routes
  const cityKeys = ['casablanca', 'rabat', 'marrakech', 'agadir', 'tanger'];
  const cityPaths = cityKeys.map(key => `/domiciliation-creation/${key}`);
  const cityEntries = cityPaths.flatMap(path => {
    return getSitemapEntries(path, 0.8, 'monthly' as const);
  });

  // Custom Local SEO Landing Pages entries (Primary URLs only)
  const landingEntries = [
    { url: `${baseUrl}/fr/domiciliation-entreprise-marrakech`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/fr/creation-entreprise-marrakech`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/fr/creation-societe-maroc`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/en/business-domiciliation-marrakech`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/en/company-formation-morocco`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/ar/%D8%AA%D9%88%D8%B7%D9%8A%D9%86-%D8%A7%D9%84%D8%B4%D8%B1%D9%83%D8%A7%D8%AA-%D9%85%D8%B1%D8%A7%D9%83%D8%B4`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/ar/%D8%A7%D9%86%D8%B4%D8%A7%D8%A1-%D8%B4%D8%B1%D9%83%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  return [...staticEntries, ...serviceEntries, ...blogEntries, ...cityEntries, ...landingEntries];
}
