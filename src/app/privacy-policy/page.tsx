import type { Metadata } from 'next';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { PageHero } from '@/components/PageHero';
import { PageRenderer } from '@/components/PageRenderer';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getSanityPageByRoute } from '@/lib/sanityPages';
import type { SanityPageSection } from '@/lib/sanityPages';
import { site } from '@/lib/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the privacy policy for the Rikonim Enterprise website, including how we handle enquiries, basic analytics and submitted information.'
};

export default async function PrivacyPolicyPage() {
  const page = await getSanityPageByRoute('/privacy-policy');

  if (page?.enabled && page?.sections?.length) {
    const hero = page.sections.find(
      (s): s is Extract<SanityPageSection, { _type: 'heroSection' }> => s._type === 'heroSection'
    );
    return (
      <>
        {hero ? (
          <PageHero
            title={hero.title ?? 'Privacy Policy'}
            subtitle={hero.subtitle}
            imageUrl={hero.imageUrl ?? 'https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=2400'}
            videoUrl={hero.videoUrl}
          />
        ) : null}
        <PageBreadcrumb current="Privacy policy" />
        <PageRenderer sections={page.sections} skipHero pageId={page._id} />
      </>
    );
  }

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
