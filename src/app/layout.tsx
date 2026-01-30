import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { site } from '@/lib/site';
import { getSiteUrl } from '@/lib/siteUrl';

const fontSans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: site.name,
    template: `%s | ${site.name}`
  },
  description: site.overview,
  openGraph: {
    title: site.name,
    description: `${site.tagline} headquartered in ${site.headquarters}.`,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image'
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
    <html lang="en" className={fontSans.variable}>
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
