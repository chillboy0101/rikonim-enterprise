import Link from 'next/link';
import { FeaturedProjectCarousel } from '@/components/FeaturedProjectCarousel';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getProjects } from '@/lib/projects';
import { site } from '@/lib/site';

export default async function HomePage() {
  const projects = await getProjects();
  const featured = projects.slice(0, 3);

  return (
    <>
      <section
        id="home-hero"
        className="relative overflow-hidden pt-[76px] md:pt-[84px]"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          poster="/videos/rikonim-home-hero.jpg"
        >
          <source src={site.heroVideos.home} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-ink/35 to-brand-ink/80" />
        <Container className="relative">
          <div className="grid min-h-[calc(100svh-76px)] gap-10 py-14 md:min-h-[calc(100svh-84px)] md:items-start md:pb-20 md:pt-16 lg:grid-cols-12 lg:items-center lg:py-20">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold tracking-[0.16em] text-white/75 md:text-base">
                {site.tagline}
              </p>
              <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tightest text-white md:text-6xl lg:text-7xl">
                Building enduring infrastructure with discipline, integrity, and
                exceptional execution.
              </h1>
            </div>

            <div className="mt-10 md:mt-0 md:self-end md:justify-self-center md:translate-y-16 lg:col-span-5 lg:justify-self-center lg:-translate-x-6 lg:translate-y-10 xl:translate-x-0 xl:translate-y-14 xl:justify-self-end">
              <FeaturedProjectCarousel />
            </div>
          </div>
        </Container>
      </section>

      <section
        className="bg-white"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(11,18,32,0.08) 1px, transparent 0)',
          backgroundSize: '22px 22px'
        }}
      >
        <Container>
          <div className="grid gap-10 py-14 md:min-h-[76vh] md:grid-cols-12 md:items-center md:py-20">
            <div className="md:col-span-5">
              <p className="text-sm font-semibold tracking-[0.16em] text-brand-steel">Our Work</p>
              <h2 className="text-balance text-4xl font-semibold tracking-tightest text-brand-ink md:text-5xl">
                Extraordinary teams building inspiring projects.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-brand-steel">
                We deliver first-of-a-kind infrastructure and building works that improve quality of life, support economic growth, and strengthen critical systems.
              </p>
              <p className="mt-5 text-base leading-relaxed text-brand-steel">
                Our approach blends planning discipline, engineering judgement, and site execution—supported by transparent coordination and safety leadership.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 md:text-base"
                >
                  View projects
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange/15 px-7 py-3.5 text-sm font-semibold text-brand-orange transition hover:bg-brand-orange hover:text-white md:text-base"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="overflow-hidden rounded-3xl border border-brand-ink/10 bg-brand-mist shadow-[0_22px_70px_rgba(11,18,32,0.12)]">
                <div className="h-[280px] sm:h-[380px] md:h-[540px]">
                  <video className="h-full w-full object-cover" autoPlay muted playsInline loop preload="metadata">
                    <source src="/videos/home-services-section.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline loop preload="metadata">
          <source src="/videos/home-company-section.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/55 to-black/80" />
        <Container className="relative">
          <div className="grid min-h-[72vh] gap-10 py-14 md:grid-cols-12 md:items-end md:py-20">
            <div className="md:col-span-6">
              <p className="text-sm font-semibold tracking-[0.16em] text-white/70">Our People</p>
              <h2 className="text-balance text-5xl font-semibold tracking-tightest text-white md:text-6xl">
                Defined by the quality of our people.
              </h2>
              <div className="mt-7">
                <Link
                  href="/leadership"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-ink transition hover:bg-white/90 md:text-base"
                >
                  Meet leadership
                </Link>
              </div>
            </div>
            <div className="md:col-span-6">
              <p className="text-base leading-relaxed text-white/80 md:text-lg">
                We bring technical excellence, careful planning, and hands-on site leadership to every engagement. Our teams work with clients to solve complex challenges and deliver reliable outcomes.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-ink">
        <Container>
          <div className="grid gap-10 py-14 md:grid-cols-12 md:items-center md:py-20">
            <div className="md:col-span-5">
              <p className="text-sm font-semibold tracking-[0.16em] text-white/70">Our Approach</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tightest text-white md:text-5xl">
                Plan precisely. Build safely. Deliver with integrity.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/75">
                From procurement and scheduling through QA/QC and commissioning, we keep stakeholders aligned and risks controlled—without compromising workmanship.
              </p>
            </div>
            <div className="md:col-span-7">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
                <div className="h-[280px] sm:h-[380px] md:h-[520px]">
                  <video className="h-full w-full object-cover" autoPlay muted playsInline loop preload="metadata">
                    <source src="/videos/home-approach-section.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container>
          <div className="grid gap-10 py-14 md:grid-cols-12 md:py-20">
            <div className="md:col-span-3" />
            <div className="md:col-span-6">
              <h2 className="text-center text-4xl font-semibold tracking-tightest text-brand-ink md:text-5xl">
                Building tomorrow, together.
              </h2>
              <p className="mt-6 text-center text-base leading-relaxed text-brand-steel">
                With people, partners, and communities at the center of delivery, we focus on durability, safety, and transparency across every project lifecycle.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5">
              <h2 className="text-4xl font-semibold tracking-tightest text-brand-ink md:text-6xl">
                Featured Projects
              </h2>
              <div className="mt-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-3 text-sm font-semibold text-brand-orange"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/15">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 -rotate-45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h13" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  <span>Explore more projects</span>
                </Link>
              </div>
            </div>
            <div className="md:col-span-7">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="group relative overflow-hidden rounded-3xl bg-brand-mist shadow-[0_18px_50px_rgba(11,18,32,0.12)]"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="relative flex min-h-[260px] flex-col justify-end p-5">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-white/75">
                        {[p.location, p.year].filter(Boolean).join(' • ') || 'Project'}
                      </p>
                      <p className="mt-2 text-lg font-semibold leading-tight tracking-tightest text-white">
                        {p.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                Vision & Mission
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-steel">
                {site.vision}
              </p>
            </div>
            <div className="md:col-span-7">
              <div className="border-l border-brand-ink/10 pl-6">
                <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel">
                  What we commit to
                </p>
                <ul className="mt-5 space-y-4">
                  {site.missionBullets.map((b) => (
                    <li key={b} className="text-base leading-relaxed text-brand-steel">
                      <span className="mr-3 inline-block h-[6px] w-[6px] translate-y-[-2px] rounded-full bg-brand-blue" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-mist">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                Premium delivery, end to end.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-steel">
                From planning through execution, we bring rigorous project
                control, site discipline, and quality assurance to every
                engagement.
              </p>
            </div>
            <div className="md:col-span-7">
              <div className="grid gap-6 sm:grid-cols-2">
                {site.services.map((s) => (
                  <div
                    key={s.slug}
                    className="border-t border-brand-ink/10 pt-5"
                  >
                    <p className="text-sm font-semibold text-brand-ink">{s.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-brand-steel">
                      Precision planning, transparent coordination, and
                      workmanship built for longevity.
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/projects"
                  className="text-sm font-semibold text-brand-blue underline decoration-brand-blue/30 hover:decoration-brand-blue/60"
                >
                  View projects
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
