import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';

export default function NotFound() {
  return (
    <Section className="pt-24 md:pt-28">
      <Container>
        <p className="text-sm font-semibold tracking-[0.14em] text-brand-steel">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tightest text-brand-ink md:text-4xl">
          Page not found.
        </h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-brand-steel">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <div className="mt-7">
          <Link
            href="/"
            className="text-sm font-semibold text-brand-blue underline decoration-brand-blue/30 hover:decoration-brand-blue/60"
          >
            Return home
          </Link>
        </div>
      </Container>
    </Section>
  );
}
