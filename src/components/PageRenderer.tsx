import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHero } from '@/components/PageHero';
import { markdownToHtml } from '@/lib/markdownToHtml';
import type { SanityPageSection } from '@/lib/sanityPages';
import { PortableText } from 'next-sanity';

export async function PageRenderer({
  sections,
  skipHero
}: {
  sections: SanityPageSection[];
  skipHero?: boolean;
}) {
  const rendered = [] as Array<ReactElement>;

  for (let idx = 0; idx < sections.length; idx += 1) {
    const section = sections[idx];

    if (section._type === 'heroSection') {
      if (skipHero) continue;
      const title = section.title ?? '';
      const imageUrl = section.imageUrl ?? '/uploads/company-2.jpeg';
      rendered.push(
        <PageHero
          key={`hero-${idx}`}
          title={title}
          subtitle={section.subtitle}
          imageUrl={imageUrl}
          videoUrl={section.videoUrl}
        />
      );
      continue;
    }

    if (section._type === 'richTextSection') {
      rendered.push(
        <Section key={`rt-${idx}`}>
          <Container>
            {section.title ? (
              <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                {section.title}
              </h2>
            ) : null}
            <div className="prose prose-slate mt-6 max-w-none text-left prose-p:leading-relaxed prose-a:text-brand-blue prose-headings:font-bold prose-headings:text-brand-ink prose-h2:text-2xl prose-h2:tracking-tightest prose-h3:text-xl prose-h3:tracking-tightest">
              <PortableText value={(section.body ?? []) as never} />
            </div>
          </Container>
        </Section>
      );
      continue;
    }

    if (section._type === 'markdownSection') {
      const html = await markdownToHtml(section.markdown ?? '');
      rendered.push(
        <Section key={`md-${idx}`}>
          <Container>
            {section.title ? (
              <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                {section.title}
              </h2>
            ) : null}
            <div
              dir="ltr"
              className="prose prose-slate mt-6 max-w-none text-left prose-p:leading-relaxed prose-a:text-brand-blue prose-headings:font-bold prose-headings:text-brand-ink prose-h2:text-2xl prose-h2:tracking-tightest prose-h3:text-xl prose-h3:tracking-tightest"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Container>
        </Section>
      );
      continue;
    }

    if (section._type === 'mediaSection') {
      const html = await markdownToHtml(section.markdown ?? '');
      const hasVideo = Boolean(section.videoUrl);
      const hasImage = Boolean(section.imageUrl);

      rendered.push(
        <Section key={`media-${idx}`}>
          <Container>
            {section.title ? (
              <h2 className="text-2xl font-semibold tracking-tightest text-brand-ink md:text-3xl">
                {section.title}
              </h2>
            ) : null}
            {hasImage || hasVideo ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-brand-ink/10 bg-brand-mist">
                <div className="relative aspect-[16/7]">
                  {hasVideo ? (
                    <video className="h-full w-full object-cover" preload="metadata" muted playsInline controls>
                      <source src={section.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={section.imageUrl}
                      alt={section.title ? `${section.title} media` : 'Page media'}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
            ) : null}
            {section.markdown ? (
              <div
                dir="ltr"
                className="prose prose-slate mt-6 max-w-none text-left prose-p:leading-relaxed prose-a:text-brand-blue prose-headings:font-bold prose-headings:text-brand-ink prose-h2:text-2xl prose-h2:tracking-tightest prose-h3:text-xl prose-h3:tracking-tightest"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : null}
          </Container>
        </Section>
      );
      continue;
    }
  }

  return <>{rendered}</>;
}
