import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Leadership'
};

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        title="Leadership"
        subtitle="Responsible governance. Clear accountability."
        imageUrl="https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.leadership}
      />

      <PageBreadcrumb current="Leadership" />

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel md:text-base">Leadership</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-brand-ink md:text-4xl">
                Built on accountability.
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-base leading-relaxed text-brand-steel">
                Rikonim Enterprise is led by experienced professionals focused on disciplined execution, client outcomes, and long-term partnerships.
              </p>
              <p className="mt-5 text-base leading-relaxed text-brand-steel">
                Our leadership team sets clear standards for safety, quality, and project controls—ensuring that stakeholders receive consistent reporting, reliable schedules, and durable results.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {site.leadership.map((l) => (
              <div
                key={l.role}
                className="overflow-hidden rounded-3xl border border-brand-ink/10 bg-white shadow-[0_18px_50px_rgba(11,18,32,0.08)]"
              >
                <div className="grid gap-0 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <div className="aspect-[4/5] w-full bg-brand-mist">
                      {l.image ? (
                        <img
                          src={l.image}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="p-6 md:col-span-7 md:p-7">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-brand-steel">{l.role}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tightest text-brand-ink">{l.name}</p>
                    {'bio' in l ? (
                      <p className="mt-4 text-sm leading-relaxed text-brand-steel">
                        {(l as { bio?: string }).bio}
                      </p>
                    ) : null}
                    {'highlights' in l ? (
                      <ul className="mt-5 space-y-2">
                        {((l as { highlights?: string[] }).highlights ?? []).map((h) => (
                          <li key={h} className="text-sm text-brand-steel">
                            <span className="mr-3 inline-block h-[6px] w-[6px] translate-y-[-2px] rounded-full bg-brand-orange" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-mist">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                How we lead.
              </h2>
            </div>
            <div className="md:col-span-7">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-ink/10 bg-white p-6">
                  <p className="text-sm font-semibold text-brand-ink">Safety first</p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                    We set expectations for site discipline, risk controls, and a culture where every worker goes home safely.
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-ink/10 bg-white p-6">
                  <p className="text-sm font-semibold text-brand-ink">Quality and compliance</p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                    We standardize QA/QC checks, documentation, and handover requirements to protect long-term asset performance.
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-ink/10 bg-white p-6">
                  <p className="text-sm font-semibold text-brand-ink">Transparent reporting</p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                    Stakeholders receive clear progress updates, change control visibility, and schedule performance tracking.
                  </p>
                </div>
                <div className="rounded-2xl border border-brand-ink/10 bg-white p-6">
                  <p className="text-sm font-semibold text-brand-ink">Client partnership</p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                    We collaborate early, align expectations, and make decisions that protect scope, cost, and delivery outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
