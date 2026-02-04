import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the privacy policy for the Rikonim Enterprise website, including how we handle enquiries, basic analytics and submitted information.'
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="Legal"
        imageUrl="https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=2400"
        videoUrl={site.heroVideos.legal}
      />

      <PageBreadcrumb current="Privacy Policy" />

      <Section>
        <Container>
          <div className="max-w-prose space-y-5 text-sm leading-relaxed text-brand-steel">
            <p>
              This website is operated by {site.name}. We respect your privacy and are committed to
              protecting the information you share with us.
            </p>
            <p>
              We may collect basic analytics and information you submit through our contact channels
              (such as email or phone). We do not sell personal information.
            </p>
            <p>
              If you have any questions about this policy, contact us at {site.contact.email}.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
