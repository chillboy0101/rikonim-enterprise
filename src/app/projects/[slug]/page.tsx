import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getProjects } from '@/lib/projects';
import { markdownToHtml } from '@/lib/markdownToHtml';
import { site } from '@/lib/site';

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
            <div className="md:col-span-5">
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
            <div className="md:col-span-7">
              <div className="border-t border-brand-ink/10 pt-7">
                {project.image ? (
                  <div className="mb-7 overflow-hidden border border-brand-ink/10 bg-brand-mist">
                    <div className="aspect-[16/7]">
                      <img src={project.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  </div>
                ) : null}
                {project.video ? (
                  <div className="mb-7 overflow-hidden border border-brand-ink/10 bg-black">
                    <div className="aspect-[16/9]">
                      <video
                        className="h-full w-full object-cover"
                        controls
                        preload="metadata"
                        poster={project.image ?? undefined}
                      >
                        <source src={project.video} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                ) : null}
                <div
                  className="prose prose-slate max-w-none prose-p:leading-relaxed prose-a:text-brand-blue"
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
