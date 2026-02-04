import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/Reveal';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Company',
  description:
    'Company profile of Rikonim Enterprise—an Accra, Ghana building and civil engineering contractor delivering quality construction, infrastructure and renovations.'
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Company"
        subtitle="Company profile, vision, and mission."
        imageUrl="https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.company}
      />

      <PageBreadcrumb current="Company" />

      <Section>
        <Container>
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel md:text-base">
                  Company Overview
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-brand-ink md:text-4xl">
                  {site.name}
                </h2>
              </div>
              <div className="md:col-span-7">
                <p className="text-base leading-relaxed text-brand-steel">{site.overview}</p>
                <p className="mt-5 text-base leading-relaxed text-brand-steel">
                  We partner with public and private sector clients to deliver buildings and civil works that are safe, durable, and cost-effective—supported by disciplined project controls and transparent coordination.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-brand-ink/10 bg-white p-5">
                    <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Industry</p>
                    <p className="mt-2 text-sm font-semibold text-brand-ink">{site.industry}</p>
                  </div>
                  <div className="rounded-2xl border border-brand-ink/10 bg-white p-5">
                    <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Business Type</p>
                    <p className="mt-2 text-sm font-semibold text-brand-ink">{site.businessType}</p>
                  </div>
                  <div className="rounded-2xl border border-brand-ink/10 bg-white p-5">
                    <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Headquarters</p>
                    <p className="mt-2 text-sm font-semibold text-brand-ink">{site.headquarters}</p>
                  </div>
                  <div className="rounded-2xl border border-brand-ink/10 bg-white p-5">
                    <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Founded</p>
                    <p className="mt-2 text-sm font-semibold text-brand-ink">{site.founded}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-brand-mist">
        <Container>
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel md:text-base">Capabilities</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-brand-ink md:text-4xl">
                  What we deliver.
                </h2>
              </div>
              <div className="md:col-span-7">
                <div className="grid gap-6 sm:grid-cols-2">
                  {site.services.map((s) => (
                    <div
                      key={s.slug}
                      className="rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-[0_10px_30px_rgba(11,18,32,0.06)]"
                    >
                      <p className="text-sm font-semibold text-brand-ink">{s.title}</p>
                      <p className="mt-3 text-sm leading-relaxed text-brand-steel">{s.summary}</p>
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
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12 md:items-start">
              <div className="md:col-span-5">
                <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel md:text-base">Company</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-brand-ink md:text-4xl">
                  Work that shows up on site.
                </h2>
                <p className="mt-6 text-base leading-relaxed text-brand-steel">
                  From planning through closeout, we emphasize visible discipline on site—coordination, workmanship, and safety leadership.
                </p>
              </div>
              <div className="md:col-span-7" />

              <div className="md:col-span-12">
                <div className="grid gap-6 md:grid-cols-12">
                  <div className="overflow-hidden rounded-3xl border border-brand-ink/10 bg-brand-mist shadow-[0_18px_50px_rgba(11,18,32,0.10)] md:col-span-5">
                    <div className="aspect-[4/5] w-full">
                      <img
                        src="/uploads/company-1.jpeg"
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-brand-ink/10 bg-brand-mist shadow-[0_18px_50px_rgba(11,18,32,0.10)] md:col-span-7">
                    <div className="aspect-[16/10] w-full">
                      <img
                        src="/uploads/company-3.jpeg"
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <section className="relative overflow-hidden">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted playsInline loop preload="metadata">
          <source src="/videos/company-gallery.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/55 to-black/80" />
        <Container className="relative">
          <div className="grid min-h-[62vh] gap-10 py-14 md:grid-cols-12 md:items-end md:py-20">
            <div className="md:col-span-6">
              <p className="text-sm font-semibold tracking-[0.16em] text-white/70">On Site</p>
              <h2 className="text-balance text-5xl font-semibold tracking-tightest text-white md:text-6xl">
                Work that shows up on site.
              </h2>
              <div className="mt-7">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-ink transition hover:bg-white/90 md:text-base"
                >
                  View projects
                </Link>
              </div>
            </div>
            <div className="md:col-span-6">
              <p className="text-base leading-relaxed text-white/80 md:text-lg">
                From planning through closeout, we emphasize visible discipline on site—coordination, workmanship, and safety leadership.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                  Vision
                </h2>
              </div>
              <div className="md:col-span-7">
                <p className="text-base leading-relaxed text-brand-steel">{site.vision}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="mt-12 grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                  Mission
                </h2>
              </div>
              <div className="md:col-span-7">
                <ul className="space-y-4">
                  {site.missionBullets.map((b) => (
                    <li key={b} className="text-base leading-relaxed text-brand-steel">
                      <span className="mr-3 inline-block h-[6px] w-[6px] translate-y-[-2px] rounded-full bg-brand-orange" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">How we deliver.</h2>
              </div>
              <div className="md:col-span-7">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-brand-ink/10 bg-white p-5">
                    <p className="text-sm font-semibold text-brand-ink">Plan & mobilize</p>
                    <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                      We define scope, schedule, and risk controls early—then mobilize the right people, materials, and partners to execute with confidence.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-brand-ink/10 bg-white p-5">
                    <p className="text-sm font-semibold text-brand-ink">Build with discipline</p>
                    <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                      Site coordination, safety leadership, and quality checks are embedded into daily execution, backed by clear reporting and change control.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-brand-ink/10 bg-white p-5">
                    <p className="text-sm font-semibold text-brand-ink">Closeout & handover</p>
                    <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                      We complete documentation, inspections, and client walkthroughs to support smooth handover and long-term asset performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-brand-mist">
        <Container>
          <Reveal>
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                  Safety, quality, and integrity.
                </h2>
              </div>
              <div className="md:col-span-7">
                <p className="text-base leading-relaxed text-brand-steel">
                  We maintain high standards of safety and environmental responsibility, supported by disciplined supervision, QA/QC documentation, and transparent communication.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
