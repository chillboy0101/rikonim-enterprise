import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { ProjectVideoPlayer } from '@/components/ProjectVideoPlayer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getProjects } from '@/lib/projects';
import { markdownToHtml } from '@/lib/markdownToHtml';
import { site } from '@/lib/site';

export const revalidate = 60;

type Props = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projects = await getProjects();
  const resolvedParams = await params;
  const rawSlug = typeof resolvedParams.slug === 'string' ? resolvedParams.slug : '';
  const normalizedSlug = decodeURIComponent(rawSlug).trim().replace(/\/+$/, '');
  const project =
    projects.find((p) => p.slug === normalizedSlug) ??
    projects.find((p) => p.slug.toLowerCase() === normalizedSlug.toLowerCase());
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const projects = await getProjects();
  const resolvedParams = await params;
  const rawSlug = typeof resolvedParams.slug === 'string' ? resolvedParams.slug : '';
  const normalizedSlug = decodeURIComponent(rawSlug).trim().replace(/\/+$/, '');
  const project =
    projects.find((p) => p.slug === normalizedSlug) ??
    projects.find((p) => p.slug.toLowerCase() === normalizedSlug.toLowerCase());

  if (!project) return notFound();

  const html = await markdownToHtml(project.content);

  return (
    <>
      <PageHero
        title={project.title}
        subtitle={project.summary ?? 'Project overview'}
        imageUrl={
          project.image ??
          'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=2400'
        }
        videoUrl={site.heroVideos.projects}
      />

      <PageBreadcrumb current="Projects" />

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:sticky md:top-28 md:self-start md:col-span-4 lg:col-span-3">
              <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel">Project</p>
              <div className="mt-6 space-y-2 text-sm text-brand-steel">
                {project.location ? <p>{project.location}</p> : null}
                {project.year ? <p>Year: {project.year}</p> : null}
                {project.status ? <p>Status: {project.status}</p> : null}
              </div>
              <div className="mt-7">
                <Link
                  href="/projects"
                  className="text-sm font-semibold text-brand-blue underline decoration-brand-blue/30 hover:decoration-brand-blue/60"
                >
                  Back to projects
                </Link>
              </div>
            </div>
            <div className="md:col-span-8 lg:col-span-9">
              <div className="border-t border-brand-ink/10 pt-7">
                {project.video ? (
                  <div className="mb-7 overflow-hidden rounded-3xl border border-brand-ink/10 bg-black shadow-[0_18px_50px_rgba(11,18,32,0.12)]">
                    <div className="aspect-[16/9] w-full">
                      <ProjectVideoPlayer
                        src={project.video}
                        poster={project.image ?? undefined}
                        buttonPlacement="bottomLeft"
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                ) : null}
                {project.video2 ? (
                  <div className="mb-7 overflow-hidden rounded-3xl border border-brand-ink/10 bg-black shadow-[0_18px_50px_rgba(11,18,32,0.12)]">
                    <div className="aspect-[16/9] w-full">
                      <ProjectVideoPlayer
                        src={project.video2}
                        poster={project.video2Poster ?? project.image ?? undefined}
                        buttonPlacement="bottomLeft"
                        className="h-full w-full"
                      />
                    </div>
                  </div>
                ) : null}
                {!project.video && project.image ? (
                  <div className="mb-7 overflow-hidden border border-brand-ink/10 bg-brand-mist">
                    <div className="aspect-[16/7]">
                      <img
                        src={project.image}
                        alt={`${project.title} project image`}
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  </div>
                ) : null}
                <div
                  dir="ltr"
                  className="prose prose-slate max-w-none text-left prose-p:leading-relaxed prose-a:text-brand-blue prose-headings:font-bold prose-headings:text-brand-ink prose-h2:text-2xl prose-h2:tracking-tightest prose-h3:text-xl prose-h3:tracking-tightest"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
