import { getSanityProjects } from '@/lib/sanityQueries';

export type Project = {
  slug: string;
  title: string;
  image?: string;
  video?: string;
  video2?: string;
  video2Poster?: string;
  draft?: boolean;
  location?: string;
  year?: string;
  status?: string;
  summary?: string;
  content: string;
};

export async function getProjects(): Promise<Project[]> {
  const sanityProjects = (await getSanityProjects()) as Array<{
    slug?: string;
    title?: string;
    image?: string;
    video?: string;
    video2?: string;
    video2Poster?: string;
    location?: string;
    year?: string;
    status?: string;
    summary?: string;
    content?: string;
  }>;

  return sanityProjects
    .filter((p) => typeof p.slug === 'string' && p.slug.trim().length > 0)
    .map((p) => {
      const slug = String(p.slug);
      return {
        slug,
        title: String(p.title ?? slug),
        image: p.image ? String(p.image) : undefined,
        video: p.video ? String(p.video) : undefined,
        video2: p.video2 ? String(p.video2) : undefined,
        video2Poster: p.video2Poster ? String(p.video2Poster) : undefined,
        location: p.location ? String(p.location) : undefined,
        year: p.year ? String(p.year) : undefined,
        status: p.status ? String(p.status) : undefined,
        summary: p.summary ? String(p.summary) : undefined,
        content: String(p.content ?? '')
      } satisfies Project;
    });
}
