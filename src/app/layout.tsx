import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { DraftModeTools } from '@/components/DraftModeTools';
import { LayoutChrome } from '@/components/LayoutChrome';
import { site } from '@/lib/site';
import { getSanitySiteSettings } from '@/lib/sanityQueries';
import { getSiteUrl } from '@/lib/siteUrl';

const verificationOther: Record<string, string> = {};

if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
  verificationOther['msvalidate.01'] = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
}

type SiteSettings = typeof site;

function mergeSiteSettings(fallback: SiteSettings, sanity: unknown): SiteSettings {
  if (!sanity || typeof sanity !== 'object') return fallback;
  const doc = sanity as Partial<SiteSettings>;
  return {
    ...fallback,
    ...doc,
    heroVideos: {
      ...fallback.heroVideos,
      ...(doc.heroVideos ?? {})
    },
    contact: {
      ...fallback.contact,
      ...(doc.contact ?? {})
    },
    missionBullets: Array.isArray(doc.missionBullets) ? doc.missionBullets : fallback.missionBullets,
    services: Array.isArray(doc.services) ? doc.services : fallback.services,
    leadership: Array.isArray(doc.leadership) ? doc.leadership : fallback.leadership
  } as SiteSettings;
}

export async function generateMetadata(): Promise<Metadata> {
  const sanitySettings = await getSanitySiteSettings();
  const settings = mergeSiteSettings(site, sanitySettings);

  return {
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: '/'
    },
    title: {
      default: `${settings.name} | Construction Company in Ghana`,
      template: `%s | ${settings.name}`
    },
    description: settings.overview,
    keywords: [
      'construction company in Ghana',
      'civil engineering company in Ghana',
      'building construction in Accra',
      'road construction Ghana',
      'drainage works Ghana',
      'project management Ghana',
      'renovation and refurbishment Ghana',
      settings.name
    ],
    icons: {
      icon: [
        { url: '/favicon-v2.ico', type: 'image/x-icon', sizes: 'any' },
        { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
        { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
        { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
        { url: '/icon-512x512.png', type: 'image/png', sizes: '512x512' },
        { url: '/favicon.png', type: 'image/png' },
        { url: '/brand/logo.png', type: 'image/png' }
      ],
      apple: [{ url: '/brand/logo.png' }]
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: `${settings.name} | Construction Company in Ghana`,
      description: settings.overview,
      type: 'website',
      url: '/',
      siteName: settings.name,
      images: [
        {
          url: '/brand/logo.png',
          width: 1200,
          height: 630,
          alt: settings.name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${settings.name} | Construction Company in Ghana`,
      description: settings.overview,
      images: ['/brand/logo.png']
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      other: verificationOther
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const sanitySettings = await getSanitySiteSettings();
  const settings = mergeSiteSettings(site, sanitySettings);

  const headquartersParts = settings.headquarters.split(',').map((p) => p.trim());
  const addressLocality = headquartersParts[0] || 'Accra';

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.name,
    url: getSiteUrl(),
    email: settings.contact.email,
    telephone: settings.contact.phone,
    description: settings.overview,
    address: {
      '@type': 'PostalAddress',
      addressLocality,
      addressCountry: 'GH'
    }
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <LayoutChrome siteSettings={settings}>{children}</LayoutChrome>
        <DraftModeTools />
      </body>
    </html>
  );
}
