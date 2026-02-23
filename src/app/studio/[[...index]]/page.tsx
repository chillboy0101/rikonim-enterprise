import { redirect } from 'next/navigation';

export default function StudioPage() {
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://studio.rikonim.com';
  redirect(studioUrl);
}
