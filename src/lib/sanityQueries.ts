import { sanityReadClient } from '@/lib/sanityClient';

export async function getSanitySiteSettings() {
  return sanityReadClient.fetch(`*[_type == "siteSettings"][0]`);
}

export async function getSanityProjects() {
  return sanityReadClient.fetch(`*[_type == "project" && !draft && !(_id in path("drafts.**"))]{
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
  } | order(year desc)`);
}
