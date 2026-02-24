import { sanityReadClient } from '@/lib/sanityClient';
import { sanityNextClient } from '@/lib/sanityNextClient';
import { draftMode } from 'next/headers';

async function isDraftModeEnabledSafe(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return Boolean(isEnabled);
  } catch {
    return false;
  }
}

export type SanityPageSection =
  | {
      _type: 'heroSection';
      title?: string;
      subtitle?: string;
      imageUrl?: string;
      videoUrl?: string;
      image?: unknown;
      video?: unknown;
    }
  | {
      _type: 'markdownSection';
      title?: string;
      markdown?: string;
    }
  | {
      _type: 'richTextSection';
      title?: string;
      body?: unknown[];
    }
  | {
      _type: 'leadershipSection';
      kicker?: string;
      heading?: string;
      introParagraph1?: string;
      introParagraph2?: string;
      members?: Array<{
        _key?: string;
        role?: string;
        name?: string;
        bio?: string;
        highlights?: string[];
        imageUrl?: string;
        image?: unknown;
      }>;
      pillarsTitle?: string;
      pillars?: Array<{
        _key?: string;
        title?: string;
        body?: string;
      }>;
    }
  | {
      _type: 'homeHeroSection';
      tagline?: string;
      heading?: string;
      videoUrl?: string;
      posterUrl?: string;
      showFeaturedCarousel?: boolean;
    }
  | {
      _type: 'homeWorkSection';
      kicker?: string;
      heading?: string;
      paragraph1?: string;
      paragraph2?: string;
      primaryCtaLabel?: string;
      primaryCtaHref?: string;
      secondaryCtaLabel?: string;
      secondaryCtaHref?: string;
      videoUrl?: string;
    }
  | {
      _type: 'homePeopleSection';
      kicker?: string;
      heading?: string;
      paragraph?: string;
      ctaLabel?: string;
      ctaHref?: string;
      videoUrl?: string;
    }
  | {
      _type: 'homeApproachSection';
      kicker?: string;
      heading?: string;
      paragraph?: string;
      videoUrl?: string;
    }
  | {
      _type: 'homeStatementSection';
      heading?: string;
      paragraph?: string;
    }
  | {
      _type: 'homeFeaturedProjectsSection';
      heading?: string;
      ctaLabel?: string;
      ctaHref?: string;
    }
  | {
      _type: 'homeVisionMissionSection';
      heading?: string;
      vision?: string;
      commitmentTitle?: string;
      missionBullets?: string[];
    }
  | {
      _type: 'homeServicesTeaserSection';
      heading?: string;
      paragraph?: string;
      ctaLabel?: string;
      ctaHref?: string;
      services?: Array<{
        _key?: string;
        title?: string;
        body?: string;
      }>;
    }
  | {
      _type: 'servicesSection';
      kicker?: string;
      heading?: string;
      paragraph1?: string;
      paragraph2?: string;
      highlights?: Array<{
        _key?: string;
        title?: string;
        body?: string;
      }>;
      safetyHeading?: string;
      safetyBody?: string;
    }
  | {
      _type: 'aboutSection';
      overviewKicker?: string;
      overviewHeading?: string;
      overviewBody1?: string;
      overviewBody2?: string;
      overviewStats?: Array<{ _key?: string; label?: string; value?: string }>;
      capabilitiesKicker?: string;
      capabilitiesHeading?: string;
      companyKicker?: string;
      companyHeading?: string;
      companyBody?: string;
      companyImage1Url?: string;
      companyImage2Url?: string;
      galleryKicker?: string;
      galleryHeading?: string;
      galleryBody?: string;
      galleryCtaLabel?: string;
      galleryCtaHref?: string;
      galleryVideoUrl?: string;
      visionTitle?: string;
      visionBody?: string;
      missionTitle?: string;
      missionBullets?: string[];
      deliveryHeading?: string;
      deliveryCards?: Array<{ _key?: string; title?: string; body?: string }>;
    }
  | {
      _type: 'contactSection';
      officeTitle?: string;
      headOffice?: string;
      phoneTitle?: string;
      phoneNumbers?: string[];
      emailTitle?: string;
      email?: string;
      enquiryKicker?: string;
      enquiryBody?: string;
      locationKicker?: string;
      locationHeading?: string;
      addressLines?: string[];
      mapQuery?: string;
      mapLinkLabel?: string;
    }
  | {
      _type: 'projectsIntroSection';
      kicker?: string;
      body?: string;
    }
  | {
      _type: 'mediaSection';
      title?: string;
      markdown?: string;
      imageUrl?: string;
      videoUrl?: string;
      image?: unknown;
      video?: unknown;
    };

export type SanityPage = {
  _id: string;
  enabled?: boolean;
  route?: string;
  title?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  sections?: SanityPageSection[];
};

export async function getSanityPageByRoute(route: string): Promise<SanityPage | null> {
  const normalizedRoute = route === '' ? '/' : route;

  try {
    const isEnabled = await isDraftModeEnabledSafe();
    const client = isEnabled
      ? sanityNextClient.withConfig({
          token: process.env.SANITY_API_READ_TOKEN,
          useCdn: false,
          perspective: 'previewDrafts',
          stega: {
            enabled: true
          }
        })
      : sanityReadClient;

    return await client.fetch(
      `*[_type == "page" && route == $route][0]{
        _id,
        enabled,
        route,
        title,
        seo,
        sections[]{
          ...,
          "imageUrl": coalesce(image.asset->url, imageUrl),
          "videoUrl": coalesce(video.asset->url, videoUrl),
          "companyImage1Url": coalesce(companyImage1.asset->url, companyImage1Url),
          "companyImage2Url": coalesce(companyImage2.asset->url, companyImage2Url),
          "galleryVideoUrl": coalesce(galleryVideo.asset->url, galleryVideoUrl),
          members[]{
            ...,
            "imageUrl": coalesce(image.asset->url, imageUrl)
          }
        }
      }`,
      { route: normalizedRoute }
    );
  } catch {
    return null;
  }
}
