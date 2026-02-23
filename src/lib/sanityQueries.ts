import { sanityReadClient } from '@/lib/sanityClient';

export async function getSanitySiteSettings() {
  try {
    return await sanityReadClient.fetch(`*[_type == "siteSettings"][0]`);
  } catch {
    return null;
  }
}

export async function getSanityProjects() {
  try {
    return await sanityReadClient.fetch(`*[_type == "project" && !draft && !(_id in path("drafts.**"))]{
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
  } catch {
    return [];
  }
}

export async function getSanityServices() {
  try {
    return await sanityReadClient.fetch(`*[_type == "service"] | order(order asc, title asc){
      _id,
      title,
      "slug": slug.current,
      summary,
      bullets,
      order,
      "imageUrl": coalesce(image.asset->url, imageUrl),
      "videoUrl": coalesce(video.asset->url, videoUrl)
    }`);
  } catch {
    return [];
  }
}
