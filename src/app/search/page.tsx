import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getProjects } from '@/lib/projects';
import { site } from '@/lib/site';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

type ResultItem = {
  type: 'Project' | 'Service' | 'Page';
  title: string;
  href: string;
  image?: string;
  kicker?: string;
  meta?: string;
};

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search Rikonim Enterprise projects and services—building construction, civil engineering works, project management and renovations delivered in Ghana.'
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default async function SearchPage({ searchParams }: Props) {
  const rawQ = searchParams?.q;
  const q = normalize(Array.isArray(rawQ) ? rawQ[0] ?? '' : rawQ ?? '');
  const terms = q ? q.split(/\s+/).filter(Boolean) : [];

  const pages: ResultItem[] = [
    {
      type: 'Page',
      title: 'Home',
      href: '/',
      meta: site.tagline
    },
    {
      type: 'Page',
      title: 'Company',
      href: '/about',
      meta: site.overview
    },
    {
      type: 'Page',
      title: 'Services',
      href: '/services',
      meta: 'Engineering services built for long-term value.'
    },
    {
      type: 'Page',
      title: 'Projects',
      href: '/projects',
      meta: 'Current work and selected engagements.'
    },
    {
      type: 'Page',
      title: 'Leadership',
      href: '/leadership',
      meta: 'Responsible governance. Clear accountability.'
    },
    {
      type: 'Page',
      title: 'Contact',
      href: '/contact',
      meta: 'Let’s discuss your project.'
    }
  ];

  const projects = await getProjects();

  const projectResults: ResultItem[] = projects
    .filter((p) => {
      if (!q) return true;
      const haystack = [
        p.title,
        p.location ?? '',
        p.year ?? '',
        p.status ?? '',
        p.summary ?? '',
        p.content
      ]
        .join(' ')
        .toLowerCase();
      return terms.every((t) => haystack.includes(t));
    })
    .map((p) => ({
      type: 'Project',
      title: p.title,
      href: `/projects/${p.slug}`,
      image: p.image,
      kicker: [p.year, p.status].filter(Boolean).join(' • '),
      meta: [p.location].filter(Boolean).join(' • ') || p.summary
    }));

  const serviceResults: ResultItem[] = site.services
    .filter((s) => {
      if (!q) return true;
      const haystack = [s.title, s.summary ?? '', ...(s.bullets ?? [])].join(' ').toLowerCase();
      return terms.every((t) => haystack.includes(t));
    })
    .map((s) => ({
      type: 'Service',
      title: s.title,
      href: `/services#${s.slug}`,
      kicker: 'Service',
      meta: s.summary
    }));

  const pageResults: ResultItem[] = pages.filter((p) => {
    if (!q) return true;
    const haystack = [p.title, p.meta ?? ''].join(' ').toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });

  const results = [...pageResults, ...serviceResults, ...projectResults].slice(0, q ? 60 : 18);

  return (
    <div className="pt-24 md:pt-28">
      <div className="border-b border-brand-ink/10 bg-brand-mist">
        <Container>
          <div className="flex items-center gap-2 py-5 text-xs font-semibold tracking-[0.14em] text-brand-steel">
            <Link href="/" className="hover:text-brand-orange">
              Home
            </Link>
            <span className="text-brand-steel/60">›</span>
            <span className="text-brand-orange">Search</span>
          </div>
        </Container>
      </div>

      <Section className="pt-10 pb-12 md:pt-12 md:pb-16">
        <Container>
          <form action="/search" className="flex items-center gap-4">
            <div className="flex w-full items-center gap-3 border-b border-brand-ink/20 pb-4">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-brand-steel"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                name="q"
                defaultValue={q}
                placeholder="Search..."
                className="w-full bg-transparent text-xl font-semibold text-brand-ink placeholder:text-brand-steel/60 focus:outline-none"
              />
              {q ? (
                <a
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-mist text-brand-ink hover:bg-brand-mist/70"
                  href="/search"
                  aria-label="Clear"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6l-12 12" />
                  </svg>
                </a>
              ) : null}
            </div>

            <button
              type="submit"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange text-white"
              aria-label="Submit"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h13" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          <div className="mt-6 text-sm font-semibold text-brand-steel">
            {q ? (
              <p>
                {results.length} result{results.length === 1 ? '' : 's'} for “{q}”.
              </p>
            ) : (
              <p>Showing featured results. Enter a keyword to refine.</p>
            )}
          </div>

          {q && results.length === 0 ? (
            <div className="mt-10">
              <p className="text-sm font-semibold text-brand-ink">No results found.</p>
              <p className="mt-2 text-sm text-brand-steel">
                Try a different keyword or search by location, project year, or service name.
              </p>
            </div>
          ) : null}

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {results.map((r) => (
              <Link
                key={`${r.type}:${r.href}:${r.title}`}
                href={r.href}
                className="group overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(11,18,32,0.08)]"
              >
                <div className="aspect-[4/3] w-full bg-brand-mist">
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={`${r.title} image`}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-brand-steel">
                    {r.kicker ? r.kicker : r.type}
                  </p>
                  <h2 className="mt-3 text-lg font-semibold text-brand-ink group-hover:underline">
                    {r.title}
                  </h2>
                  {r.meta ? (
                    <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                      {r.meta}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
