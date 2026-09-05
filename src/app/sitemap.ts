import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { HYDERABAD_LOCALITIES } from '@/components/seo/AreasServedSection';
import { BLOG_ARTICLES } from '@/data/blogArticles';

const FALLBACK_SERVICE_SLUGS = [
  'im-iv-injections',
  'wound-surgical-dressing',
  'urinary-catheter-change',
  'dedicated-24-7-nursing',
  'iv-infusion-hydration',
  'at-home-ivf-support',
  'post-surgical-care',
  'physiotherapy-rehab',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://neethanursing.in';
  const now = new Date();

  // Core Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Clinical Service Detail Routes
  let serviceSlugs = FALLBACK_SERVICE_SLUGS;
  try {
    const dbServices = await prisma.service.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    if (dbServices.length > 0) {
      serviceSlugs = dbServices.map((s) => s.slug);
    }
  } catch {}

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Locality Programmatic Hub Routes
  const locationRoutes: MetadataRoute.Sitemap = HYDERABAD_LOCALITIES.map((loc) => ({
    url: `${baseUrl}/locations/${loc.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Clinical Blog Article Detail Routes
  const blogRoutes: MetadataRoute.Sitemap = BLOG_ARTICLES.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...blogRoutes];
}
