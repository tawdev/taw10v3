import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://taw10.ma';

  const languages = ['fr', 'ar', 'en'];

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }
  ];

  // Map each route to include alternates
  const localizedRoutes = staticRoutes.flatMap((route) => [
    route,
    ...languages.map((lang) => ({
      ...route,
      url: `${route.url === baseUrl ? baseUrl : route.url}/${lang}`,
    })),
  ]);

  const blogEntries = BLOG_POSTS.flatMap((post) => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    return [
      {
        url: postUrl,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      ...languages.map((lang) => ({
        url: `${postUrl}/${lang}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ];
  });

  return [...localizedRoutes, ...blogEntries];
}
