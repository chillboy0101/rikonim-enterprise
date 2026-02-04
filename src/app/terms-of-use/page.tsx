import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Review the terms of use for the Rikonim Enterprise website, including general information, updates and enquiry contact details.'
};

export default function TermsOfUsePage() {
  return (
    <>
      <PageHero
        title="Terms of Use"
        subtitle="Legal"
        imageUrl="https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.legal}
      />

      <PageBreadcrumb current="Terms of Use" />

      <Section>
        <Container>
          <div className="max-w-prose space-y-5 text-sm leading-relaxed text-brand-steel">
            <p>
              By accessing and using this website, you agree to these Terms of Use. If you do not
              agree, please do not use the site.
            </p>
            <p>
              Information on this site is provided for general informational purposes and may be
              updated without notice.
            </p>
            <p>
              For enquiries, contact {site.name} at {site.contact.email}.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
