import { sanityReadClient } from '@/lib/sanityClient';
import { sanityNextClient } from '@/lib/sanityNextClient';
import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';

async function isDraftModeEnabledSafe(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return Boolean(isEnabled);
  } catch {
    return false;
  }
}

async function withRetry<T>(fn: () => Promise<T>, label: string, { retries = 3, baseDelayMs = 250 } = {}): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt >= retries) break;
      const waitMs = baseDelayMs * Math.pow(2, attempt);
      console.warn(`Retrying (${attempt + 1}/${retries}) after error in ${label}: ${err instanceof Error ? err.message : String(err)}`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  throw lastErr;
}

export async function getSanitySiteSettings() {
  const isEnabled = await isDraftModeEnabledSafe();
  if (isEnabled) {
    const previewClient = sanityNextClient.withConfig({
      token: process.env.SANITY_API_READ_TOKEN,
      useCdn: false,
      perspective: 'previewDrafts',
      stega: {
        enabled: true
      }
    });

    try {
      return await withRetry(() => previewClient.fetch(`*[_type == "siteSettings"][0]`), 'getSanitySiteSettings.preview');
    } catch {
      return null;
    }
  }

  return cachedSiteSettings();
}

export async function getSanityProjects() {
  const isEnabled = await isDraftModeEnabledSafe();
  if (isEnabled) {
    const previewClient = sanityNextClient.withConfig({
      token: process.env.SANITY_API_READ_TOKEN,
      useCdn: false,
      perspective: 'previewDrafts',
      stega: {
        enabled: true
      }
    });

    try {
      return await withRetry(
        () =>
          previewClient.fetch(`*[_type == "project" && !draft && !(_id in path("drafts.**"))]{
            _id,
            title,
            "slug": slug.current,
            image,
            video,
            video2,
            video2Poster,
            location,
            year,
            status,
            summary,
            content
          } | order(year desc)`),
        'getSanityProjects.preview'
      );
    } catch {
      return [];
    }
  }

  return cachedProjects();
}

export async function getSanityServices() {
  const isEnabled = await isDraftModeEnabledSafe();
  if (isEnabled) {
    const previewClient = sanityNextClient.withConfig({
      token: process.env.SANITY_API_READ_TOKEN,
      useCdn: false,
      perspective: 'previewDrafts',
      stega: {
        enabled: true
      }
    });

    try {
      return await withRetry(
        () =>
          previewClient.fetch(`*[_type == "service"] | order(order asc, title asc){
            _id,
            title,
            "slug": slug.current,
            summary,
            bullets,
            order,
            "imageUrl": coalesce(image.asset->url, imageUrl),
            "videoUrl": coalesce(video.asset->url, videoUrl)
          }`),
        'getSanityServices.preview'
      );
    } catch {
      return [];
    }
  }

  return cachedServices();
}

const cachedSiteSettings = unstable_cache(
  async () => {
    try {
      return await withRetry(
        () => sanityReadClient.fetch(`*[_type == "siteSettings"][0]`),
        'getSanitySiteSettings'
      );
    } catch {
      return null;
    }
  },
  ['sanity.siteSettings'],
  { revalidate: 60 }
);

const cachedProjects = unstable_cache(
  async () => {
    try {
      return await withRetry(
        () =>
          sanityReadClient.fetch(`*[_type == "project" && !draft && !(_id in path("drafts.**"))]{
            _id,
            title,
            "slug": slug.current,
            image,
            video,
            video2,
            video2Poster,
            location,
            year,
            status,
            summary,
            content
          } | order(year desc)`),
        'getSanityProjects'
      );
    } catch {
      return [];
    }
  },
  ['sanity.projects'],
  { revalidate: 60 }
);

const cachedServices = unstable_cache(
  async () => {
    try {
      return await withRetry(
        () =>
          sanityReadClient.fetch(`*[_type == "service"] | order(order asc, title asc){
            _id,
            title,
            "slug": slug.current,
            summary,
            bullets,
            order,
            "imageUrl": coalesce(image.asset->url, imageUrl),
            "videoUrl": coalesce(video.asset->url, videoUrl)
          }`),
        'getSanityServices'
      );
    } catch {
      return [];
    }
  },
  ['sanity.services'],
  { revalidate: 60 }
);
