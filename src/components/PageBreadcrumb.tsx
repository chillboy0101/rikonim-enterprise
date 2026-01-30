import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export function PageBreadcrumb({ current }: { current: string }) {
  return (
    <div className="border-b border-brand-ink/10 bg-brand-mist">
      <Container>
        <div className="flex items-center gap-2 py-5 text-xs font-semibold tracking-[0.14em] text-brand-steel">
          <Link href="/" className="hover:text-brand-orange">
            Home
          </Link>
          <span className="text-brand-steel/60">›</span>
          <span className="text-brand-orange">{current}</span>
        </div>
      </Container>
    </div>
  );
}
