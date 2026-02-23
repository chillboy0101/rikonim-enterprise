import { getSanityServices } from '@/lib/sanityQueries';

export type Service = {
  slug: string;
  title: string;
  summary?: string;
  bullets: string[];
  imageUrl?: string;
  videoUrl?: string;
  order?: number;
};

export async function getServices(): Promise<Service[]> {
  const sanityServices = (await getSanityServices()) as Array<{
    slug?: string;
    title?: string;
    summary?: string;
    bullets?: string[];
    imageUrl?: string;
    videoUrl?: string;
    order?: number;
  }>;

  return sanityServices
    .filter((s) => typeof s.slug === 'string' && s.slug.trim().length > 0)
    .map((s) => {
      const slug = String(s.slug);
      return {
        slug,
        title: String(s.title ?? slug),
        summary: s.summary ? String(s.summary) : undefined,
        bullets: Array.isArray(s.bullets) ? s.bullets.map(String) : [],
        imageUrl: s.imageUrl ? String(s.imageUrl) : undefined,
        videoUrl: s.videoUrl ? String(s.videoUrl) : undefined,
        order: typeof s.order === 'number' ? s.order : undefined
      } satisfies Service;
    });
}
