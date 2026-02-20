import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getProjects } from '@/lib/projects';
import { site } from '@/lib/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore building and civil engineering projects delivered in Ghana—construction, roads and drainage works completed with disciplined planning and safety.'
};

function ProjectMedia({
  title,
  href,
  image,
  video,
  hasVideo
}: {
  title: string;
  href: string;
  image?: string;
  video?: string;
  hasVideo: boolean;
}) {
  if (!image && !video) return null;

  return (
    <Link
      href={href}
      className="mb-5 block overflow-hidden border border-brand-ink/10 bg-brand-mist"
      aria-label={`Open project ${title}`}
    >
      <div className="relative aspect-[16/7]">
        {image ? (
          <img src={image} alt={`${title} project image`} className="h-full w-full object-cover" />
        ) : (
          <video
            className="h-full w-full object-cover"
            preload="metadata"
            muted
            playsInline
            autoPlay
            loop
          >
            <source src={video} type="video/mp4" />
          </video>
        )}
        {hasVideo ? (
          <>
            <div className="absolute left-4 top-4 rounded-full bg-brand-blueDark/90 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white">
              VIDEO
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-brand-blueDark shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Link>
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        title="Projects"
        subtitle="Current work and selected engagements."
        imageUrl="https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.projects}
      />

      <PageBreadcrumb current="Projects" />

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel md:text-base">Projects</p>
            </div>
            <div className="md:col-span-7">
              <p className="text-base leading-relaxed text-brand-steel">
                Explore current work and selected engagements delivered with disciplined planning, quality controls, and safety leadership.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="border-t border-brand-ink/10">
            {projects.map((p, idx) => (
              <div
                key={p.slug}
                className="grid gap-4 border-b border-brand-ink/10 py-8 md:grid-cols-12 md:items-start"
              >
                {idx % 3 === 0 ? (
                  <>
                    <div className="md:col-span-4">
                      <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">
                        {p.year ? p.year : '—'} {p.status ? `• ${p.status}` : ''}
                      </p>
                      <h2 className="mt-3 text-lg font-semibold text-brand-ink">
                        <Link href={`/projects/${p.slug}`} className="hover:underline">
                          {p.title}
                        </Link>
                      </h2>
                      {p.location ? (
                        <p className="mt-2 text-sm text-brand-steel">{p.location}</p>
                      ) : null}
                    </div>

                    <div className="md:col-span-8">
                      <ProjectMedia
                        title={p.title}
                        href={`/projects/${p.slug}`}
                        image={p.image}
                        video={p.video}
                        hasVideo={Boolean(p.video)}
                      />
                      {p.summary ? (
                        <p className="text-sm leading-relaxed text-brand-steel">{p.summary}</p>
                      ) : null}
                      <div className="mt-4">
                        <Link
                          href={`/projects/${p.slug}`}
                          className="text-sm font-semibold text-brand-blue underline decoration-brand-blue/30 hover:decoration-brand-blue/60"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </>
                ) : idx % 3 === 1 ? (
                  <>
                    <div className="md:col-span-8 md:order-1">
                      <ProjectMedia
                        title={p.title}
                        href={`/projects/${p.slug}`}
                        image={p.image}
                        video={p.video}
                        hasVideo={Boolean(p.video)}
                      />
                      {p.summary ? (
                        <p className="text-sm leading-relaxed text-brand-steel">{p.summary}</p>
                      ) : null}
                      <div className="mt-4">
                        <Link
                          href={`/projects/${p.slug}`}
                          className="text-sm font-semibold text-brand-blue underline decoration-brand-blue/30 hover:decoration-brand-blue/60"
                        >
                          View details
                        </Link>
                      </div>
                    </div>

                    <div className="md:col-span-4 md:order-2">
                      <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">
                        {p.year ? p.year : '—'} {p.status ? `• ${p.status}` : ''}
                      </p>
                      <h2 className="mt-3 text-lg font-semibold text-brand-ink">
                        <Link href={`/projects/${p.slug}`} className="hover:underline">
                          {p.title}
                        </Link>
                      </h2>
                      {p.location ? (
                        <p className="mt-2 text-sm text-brand-steel">{p.location}</p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:col-span-8 md:col-start-3">
                      <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">
                        {[p.year ? p.year : '—', p.status ? p.status : '', p.location ? p.location : '']
                          .filter(Boolean)
                          .join(' • ')}
                      </p>
                      <h2 className="mt-3 text-lg font-semibold text-brand-ink">
                        <Link href={`/projects/${p.slug}`} className="hover:underline">
                          {p.title}
                        </Link>
                      </h2>
                    </div>

                    <div className="md:col-span-8 md:col-start-3">
                      <div className="mt-5">
                        <ProjectMedia
                          title={p.title}
                          href={`/projects/${p.slug}`}
                          image={p.image}
                          video={p.video}
                          hasVideo={Boolean(p.video)}
                        />
                      </div>
                      {p.summary ? (
                        <p className="text-sm leading-relaxed text-brand-steel">{p.summary}</p>
                      ) : null}
                      <div className="mt-4">
                        <Link
                          href={`/projects/${p.slug}`}
                          className="text-sm font-semibold text-brand-blue underline decoration-brand-blue/30 hover:decoration-brand-blue/60"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
