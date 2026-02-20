'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export function LayoutChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname === '/studio' || pathname.startsWith('/studio/');

  if (isStudio) return <>{children}</>;

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
