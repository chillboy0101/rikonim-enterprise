import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Construction services in Ghana: building construction, civil engineering works, project management and renovation—delivered with safety and quality control.'
};

export default function ServicesPage() {
  const fallbackImage = '/uploads/services-1.jpeg';
  const highlights = [
    {
      title: 'Safety-led delivery',
      body: 'Daily planning, workfront controls, and supervision that protects people and assets.'
    },
    {
      title: 'Quality controls',
      body: 'Clear hold points, inspections, and documentation to verify workmanship and materials.'
    },
    {
      title: 'Project management',
      body: 'Transparent reporting, coordinated procurement, and schedule discipline from start to closeout.'
    }
  ];

  return (
    <>
      <PageHero
        title="Services"
        subtitle="Engineering services built for long-term value."
        imageUrl="/uploads/services-1.jpeg"
        videoUrl={site.heroVideos.services}
      />

      <PageBreadcrumb current="Services" />

      <Section>
        <Container>
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel md:text-base">Services</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-brand-ink md:text-4xl">
                  Built for speed, performance, and long-term value.
                </h2>
              </div>
              <div className="md:col-span-7">
                <p className="text-base leading-relaxed text-brand-steel">
                  We provide an integrated set of services for public and private sector clients—delivered with strict quality control, safety discipline, and transparent project management.
                </p>
                <p className="mt-5 text-base leading-relaxed text-brand-steel">
                  From concept planning to closeout, we help clients manage complexity, reduce risk, and deliver durable assets that perform over the long term.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {highlights.map((h) => (
                    <div key={h.title} className="rounded-2xl border border-brand-ink/10 bg-white p-5">
                      <p className="text-sm font-semibold text-brand-ink">{h.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-brand-steel">{h.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                  {site.services.map((s) => (
                    <a
                      key={s.slug}
                      href={`#${s.slug}`}
                      className="rounded-full border border-brand-ink/10 bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist"
                    >
                      {s.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <div>
        {site.services.map((s, idx) => {
          const pointsAlignClass =
            idx % 3 === 0
              ? 'md:justify-start'
              : idx % 3 === 1
                ? 'md:justify-end'
                : 'md:justify-center';

          return (
            <div key={s.slug} className={idx === 0 ? 'mt-10 md:mt-14' : undefined}>
              <section className="relative overflow-hidden">
                <div id={s.slug} className="scroll-mt-32" />
                {s.video ? (
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    poster={s.image || fallbackImage}
                  >
                    <source src={s.video} type="video/mp4" />
                  </video>
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url('${s.image || fallbackImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/85" />
                <Container className="relative">
                  <Reveal>
                    <div className="grid min-h-[62vh] gap-10 py-14 md:grid-cols-12 md:items-end md:py-20">
                      <div className="md:col-span-7">
                        <p className="text-xs font-semibold tracking-[0.14em] text-white/70">Service</p>
                        <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tightest text-white md:text-5xl">
                          {s.title}
                        </h2>
                        <p className="mt-5 text-base leading-relaxed text-white/80 md:text-lg">{s.summary}</p>
                      </div>
                    </div>
                  </Reveal>
                </Container>
              </section>

            {idx < site.services.length - 1 ? (
              <section className="bg-brand-ink mb-24 md:mb-32">
                <Container>
                  <Reveal>
                    <div className="flex py-14 md:py-16 lg:py-20">
                      <div className={`flex w-full ${pointsAlignClass}`}>
                        <ul className="w-full max-w-2xl space-y-4">
                          {s.bullets.map((b) => (
                            <li key={b} className="text-base leading-relaxed text-white/80 md:text-lg">
                              <span className="mr-3 inline-block h-[6px] w-[6px] translate-y-[-2px] rounded-full bg-brand-orange" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pb-14 md:pb-16 lg:pb-20">
                      <div className="flex w-full justify-center">
                        <div className="grid place-items-center">
                          <div className="animate-bounce text-brand-orange">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </Container>
              </section>
            ) : null}
            </div>
          );
        })}
      </div>

      <Section className="bg-brand-mist">
        <Container>
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                  Safety & environmental responsibility.
                </h2>
              </div>
              <div className="md:col-span-7">
                <p className="text-base leading-relaxed text-brand-steel">
                  We maintain high standards of safety and environmental
                  responsibility, aligned with the mission of delivering durable,
                  cost-effective, and high-quality outcomes.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
