import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact'
};

export default function ContactPage() {
  const mapQuery = site.contact.mapQuery || site.contact.headOffice;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  return (
    <>
      <PageHero
        title="Contact"
        subtitle="Reach out for project enquiries, partnerships, or a consultation."
        imageUrl="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.contact}
      />

      <PageBreadcrumb current="Contact" />

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="border-t border-brand-ink/10 pt-6">
                <p className="text-sm font-semibold text-brand-ink">Head Office</p>
                <p className="mt-3 text-sm text-brand-steel">{site.contact.headOffice}</p>
              </div>

              <div className="mt-8 border-t border-brand-ink/10 pt-6">
                <p className="text-sm font-semibold text-brand-ink">Phone</p>
                <a
                  className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline"
                  href={`tel:${site.contact.phone.split('/')[0].trim()}`}
                >
                  {site.contact.phone}
                </a>
              </div>

              <div className="mt-8 border-t border-brand-ink/10 pt-6">
                <p className="text-sm font-semibold text-brand-ink">Email</p>
                <a
                  className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline"
                  href={`mailto:${site.contact.email}`}
                >
                  {site.contact.email}
                </a>
              </div>

              <div className="mt-8 border-t border-brand-ink/10 pt-6">
                <p className="text-sm font-semibold text-brand-ink">Location</p>
                <div className="mt-3 text-sm text-brand-steel">
                  {(site.contact.addressLines ?? [site.contact.headOffice]).map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
                <div className="mt-4">
                  <a
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue underline decoration-brand-blue/30 hover:decoration-brand-blue/60"
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>View on map</span>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h13" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="border border-brand-ink/10 bg-brand-mist">
                <div className="px-7 py-8">
                  <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel">
                    Enquiry
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                    Send a message and we’ll respond as soon as possible.
                  </p>
                  <div className="mt-7">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-mist">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel md:text-base">Location</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tightest text-brand-ink md:text-4xl">
                Find our head office.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-brand-steel">
                {(site.contact.addressLines ?? [site.contact.headOffice]).join(', ')}
              </p>
              <div className="mt-6">
                <a
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue underline decoration-brand-blue/30 hover:decoration-brand-blue/60"
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Open in Google Maps</span>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h13" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="overflow-hidden rounded-3xl border border-brand-ink/10 bg-white shadow-[0_18px_50px_rgba(11,18,32,0.12)]">
                <div className="aspect-[16/10] w-full bg-brand-mist">
                  <iframe
                    title="Rikonim Enterprise location map"
                    src={mapEmbedSrc}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
