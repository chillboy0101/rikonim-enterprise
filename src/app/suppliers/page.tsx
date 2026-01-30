import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Suppliers'
};

export default function SuppliersPage() {
  return (
    <>
      <PageHero
        title="Suppliers"
        subtitle="Partner with us on materials, equipment, and services."
        imageUrl="https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.services}
      />

      <PageBreadcrumb current="Suppliers" />

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                Supplier enquiries
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-base leading-relaxed text-brand-steel">
                To submit capability information or register as a supplier, email {site.contact.email}.
              </p>
              <p className="mt-5 text-sm leading-relaxed text-brand-steel">
                You can expand this page with documents, compliance requirements, and a secure
                supplier onboarding form.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
