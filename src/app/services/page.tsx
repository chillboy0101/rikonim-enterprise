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
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal delayMs={120}>
            <div className="grid gap-6 md:grid-cols-2">
              {site.services.map((s, idx) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className={`group overflow-hidden rounded-2xl border border-brand-ink/10 bg-white shadow-[0_10px_30px_rgba(11,18,32,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(11,18,32,0.12)] ${idx === 0 || idx === 3 ? 'md:col-span-2' : ''}`}
                >
                  <div className="relative aspect-[16/9] w-full bg-brand-mist">
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
                      <img
                        src={s.image || fallbackImage}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {s.video ? (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-ink/10 via-brand-ink/35 to-brand-ink/75" />
                    ) : null}
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Service</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tightest text-brand-ink">{s.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-brand-steel">{s.summary}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                      <span>Explore</span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h13" />
                        <path d="M13 6l6 6-6 6" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {site.services.map((s) => (
        <section key={s.slug} className="relative overflow-hidden">
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
                <div className="md:col-span-6">
                  <p className="text-xs font-semibold tracking-[0.14em] text-white/70">Service</p>
                  <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tightest text-white md:text-5xl">
                    {s.title}
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-white/80 md:text-lg">{s.summary}</p>
                </div>

                <div className="md:col-span-6">
                  <ul className="space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="text-sm leading-relaxed text-white/80 md:text-base">
                        <span className="mr-3 inline-block h-[6px] w-[6px] translate-y-[-2px] rounded-full bg-brand-orange" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      ))}

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
