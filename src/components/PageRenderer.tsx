import type { ReactElement } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { PageHero } from '@/components/PageHero';
import { markdownToHtml } from '@/lib/markdownToHtml';
import type { SanityPageSection } from '@/lib/sanityPages';
import { PortableText } from 'next-sanity';
import { createDataAttribute } from '@sanity/visual-editing';

export async function PageRenderer({
  sections,
  skipHero,
  pageId
}: {
  sections: SanityPageSection[];
  skipHero?: boolean;
  pageId?: string;
}) {
  const dataAttribute = pageId ? createDataAttribute({ id: pageId, type: 'page' }) : null;
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
      const sectionKey = (section as unknown as { _key?: string })?._key;
      const imageDataSanity =
        dataAttribute && sectionKey
          ? dataAttribute(['sections', { _key: sectionKey }, 'image'])
          : undefined;

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
                    <div
                      data-sanity={imageDataSanity}
                      data-sanity-edit-target
                      className="h-full w-full"
                    >
                      <img
                        src={section.imageUrl}
                        alt="Page media"
                        className="h-full w-full object-cover"
                        data-sanity={imageDataSanity}
                        data-sanity-edit-target
                      />
                    </div>
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
