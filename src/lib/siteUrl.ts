export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv && fromEnv.startsWith('http')) return fromEnv.replace(/\/$/, '');

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return 'http://localhost:3000';
}
