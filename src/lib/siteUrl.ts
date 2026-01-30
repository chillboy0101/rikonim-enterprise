export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv && fromEnv.startsWith('http')) return fromEnv;
  return 'https://rikonim.example';
}
