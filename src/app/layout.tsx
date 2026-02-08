import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { site } from '@/lib/site';
import { getSiteUrl } from '@/lib/siteUrl';

const verificationOther: Record<string, string> = {};

if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
  verificationOther['msvalidate.01'] = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${site.name} | Construction Company in Ghana`,
    template: `%s | ${site.name}`
  },
  description: site.overview,
  keywords: [
    'construction company in Ghana',
    'civil engineering company in Ghana',
    'building construction in Accra',
    'road construction Ghana',
    'drainage works Ghana',
    'project management Ghana',
    'renovation and refurbishment Ghana',
    site.name
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/brand/logo.png', type: 'image/png' }
    ],
    apple: [{ url: '/brand/logo.png' }]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: `${site.name} | Construction Company in Ghana`,
    description: site.overview,
    type: 'website',
    url: '/',
    siteName: site.name,
    images: [
      {
        url: '/brand/logo.png',
        width: 1200,
        height: 630,
        alt: site.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | Construction Company in Ghana`,
    description: site.overview,
    images: ['/brand/logo.png']
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: verificationOther
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const headquartersParts = site.headquarters.split(',').map((p) => p.trim());
  const addressLocality = headquartersParts[0] || 'Accra';

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: getSiteUrl(),
    email: site.contact.email,
    telephone: site.contact.phone,
    description: site.overview,
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
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
