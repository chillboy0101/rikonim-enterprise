import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/projects';
import { getSiteUrl } from '@/lib/siteUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const projects = await getProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date()
    },
    {
      url: `${base}/about`,
      lastModified: new Date()
    },
    {
      url: `${base}/services`,
      lastModified: new Date()
    },
    {
      url: `${base}/projects`,
      lastModified: new Date()
    },
    {
      url: `${base}/leadership`,
      lastModified: new Date()
    },
    {
      url: `${base}/contact`,
      lastModified: new Date()
    }
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...projectRoutes];
}
