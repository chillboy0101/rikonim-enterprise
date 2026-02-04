import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Construction services in Ghana: building construction, civil engineering works, project management and renovation—delivered with safety and quality control.'
};

export default function ServicesPage() {
  const fallbackImage =
    'https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=2400';

  return (
    <>
      <PageHero
        title="Services"
        subtitle="Engineering services built for long-term value."
        imageUrl="https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.services}
      />

      <PageBreadcrumb current="Services" />

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel md:text-base">Services</p>
            </div>
            <div className="md:col-span-7">
              <p className="text-base leading-relaxed text-brand-steel">
                We provide an integrated set of services for public and private sector clients—delivered with strict quality control, safety discipline, and transparent project management.
              </p>
              <p className="mt-5 text-base leading-relaxed text-brand-steel">
                From concept planning to closeout, we help clients manage complexity, reduce risk, and deliver durable assets that perform over the long term.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {site.services.map((s, idx) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className={`group overflow-hidden rounded-2xl border border-brand-ink/10 bg-white shadow-[0_10px_30px_rgba(11,18,32,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(11,18,32,0.12)] ${idx === 0 || idx === 3 ? 'md:col-span-2' : ''}`}
              >
                <div className="aspect-[16/9] w-full bg-brand-mist">
                  {s.video ? (
                    <video
                      className="h-full w-full object-cover"
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
        </Container>
      </Section>

      {site.services.map((s, idx) => (
        <Section key={s.slug} className={idx % 2 === 1 ? 'bg-brand-mist' : ''}>
          <Container>
            <div id={s.slug} className="scroll-mt-32" />
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className={idx % 2 === 1 ? 'md:col-span-6 md:order-2' : 'md:col-span-6'}>
                <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Service</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tightest text-brand-ink md:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-brand-steel">{s.summary}</p>
                <ul className="mt-6 space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="text-sm leading-relaxed text-brand-steel">
                      <span className="mr-3 inline-block h-[6px] w-[6px] translate-y-[-2px] rounded-full bg-brand-orange" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={idx % 2 === 1 ? 'md:col-span-6 md:order-1' : 'md:col-span-6'}>
                <div className="overflow-hidden rounded-3xl bg-brand-mist shadow-[0_18px_50px_rgba(11,18,32,0.12)]">
                  {s.video ? (
                    <div className="aspect-[16/10] w-full bg-black">
                      <video
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        poster={s.image || fallbackImage}
                      >
                        <source src={s.video} type="video/mp4" />
                      </video>
                    </div>
                  ) : (
                    <div className="aspect-[16/10] w-full bg-brand-mist">
                      <img
                        src={s.image || fallbackImage}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      <Section className="bg-brand-mist">
        <Container>
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
        </Container>
      </Section>
    </>
  );
}
