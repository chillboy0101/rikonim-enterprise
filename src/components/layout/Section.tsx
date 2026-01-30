import type { ReactNode } from 'react';

export function Section({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`py-14 md:py-20 ${className}`}>{children}</section>;
}
