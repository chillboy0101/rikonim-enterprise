'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

type SiteSettings = {
  name: string;
  contact: {
    phone: string;
    email: string;
  };
};

export function LayoutChrome({
  children,
  siteSettings
}: {
  children: ReactNode;
  siteSettings: SiteSettings;
}) {
  const pathname = usePathname();
  const isStudio = pathname === '/studio' || pathname.startsWith('/studio/');

  if (isStudio) return <>{children}</>;

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter siteSettings={siteSettings} />
    </>
  );
}
