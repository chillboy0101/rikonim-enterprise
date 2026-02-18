import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { getProjects } from '@/lib/projects';
import { site } from '@/lib/site';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>;
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

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'has',
  'have',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'to',
  'was',
  'were',
  'with'
]);

type WeightedField = { text: string; weight: number };

type ScoredResultItem = ResultItem & { score: number };

const SYNONYMS: Record<string, string[]> = {
  constuction: ['construction'],
  constructions: ['construction'],
  build: ['building', 'construction'],
  building: ['construction'],
  road: ['roads'],
  roads: ['road'],
  drain: ['drainage'],
  drainage: ['drain'],
  refurb: ['refurbishment', 'renovation'],
  refurbishment: ['refurb', 'renovation'],
  renovation: ['renovation', 'refurbishment'],
  civil: ['infrastructure'],
  infrastructure: ['civil'],
  pm: ['project', 'management', 'project management']
};

function sanitizeTerm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '').trim();
}

function expandTerms(rawTerms: string[]) {
  const expanded = new Set<string>();
  for (const t of rawTerms) {
    const term = sanitizeTerm(t);
    if (!term || STOP_WORDS.has(term)) continue;
    expanded.add(term);
    const syns = SYNONYMS[term];
    if (syns) syns.forEach((s) => expanded.add(sanitizeTerm(s)));
  }
  return [...expanded].filter(Boolean);
}

function wordTokens(text: string) {
  return text.split(/[^a-z0-9]+/i).filter(Boolean);
}

function boundedEditDistance(a: string, b: string, max: number) {
  if (a === b) return 0;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > max) return max + 1;
  if (la === 0) return lb;
  if (lb === 0) return la;

  const prev = new Array(lb + 1);
  const curr = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;

  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= lb; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= lb; j++) prev[j] = curr[j];
  }

  return prev[lb];
}

type TermMatch = { matched: boolean; quality: 0 | 1 | 2 | 3; position: number };

function matchTerm(text: string, term: string): TermMatch {
  if (!text || !term) return { matched: false, quality: 0, position: -1 };

  const exactIndex = text.indexOf(term);
  const wordExact = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\[\]\\]/g, '\\$&')}\\b`, 'i');
  if (wordExact.test(text)) return { matched: true, quality: 3, position: exactIndex };

  const tokens = wordTokens(text);
  const prefixIndex = tokens.findIndex((t) => t.startsWith(term));
  if (prefixIndex !== -1) return { matched: true, quality: 2, position: exactIndex };

  const maxDist = term.length <= 4 ? 1 : term.length <= 7 ? 2 : 2;
  for (const token of tokens) {
    const d = boundedEditDistance(token, term, maxDist);
    if (d <= maxDist) return { matched: true, quality: 1, position: exactIndex };
  }

  return { matched: false, quality: 0, position: -1 };
}

function scoreForTerms(terms: string[], fields: WeightedField[]) {
  if (terms.length === 0) return 0;

  let score = 0;
  const matched = new Set<string>();

  for (const term of terms) {
    for (const field of fields) {
      if (!field.text) continue;
      const m = matchTerm(field.text, term);
      if (m.matched) {
        const qualityMultiplier = m.quality === 3 ? 1 : m.quality === 2 ? 0.75 : 0.4;
        score += field.weight * qualityMultiplier;
        if (field.weight >= 8 && m.position >= 0 && m.position <= 18) score += 2;
        matched.add(term);
        break;
      }
    }
  }

  // Small bonus if most terms match (helps ranking without making it too strict).
  if (matched.size >= Math.max(1, Math.ceil(terms.length * 0.75))) score += 3;
  if (matched.size === terms.length) score += 5;
  return score;
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = searchParams
    ? await Promise.resolve(searchParams)
    : ({} as { [key: string]: string | string[] | undefined });

  const rawQ = resolvedParams.q;
  const q = normalize(Array.isArray(rawQ) ? rawQ[0] ?? '' : rawQ ?? '');
  const terms = q
    ? q
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const expandedTerms = expandTerms(terms);

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
    .map((p) => {
      const score = q
        ? scoreForTerms(expandedTerms, [
            { text: normalize(p.title), weight: 8 },
            { text: normalize(p.location ?? ''), weight: 5 },
            { text: normalize(p.year ?? ''), weight: 3 },
            { text: normalize(p.status ?? ''), weight: 3 },
            { text: normalize(p.summary ?? ''), weight: 4 },
            { text: normalize(p.content), weight: 1 }
          ])
        : 0;

      return {
        type: 'Project',
        title: p.title,
        href: `/projects/${p.slug}`,
        image: p.image,
        kicker: [p.year, p.status].filter(Boolean).join(' • '),
        meta: [p.location].filter(Boolean).join(' • ') || p.summary,
        score
      } satisfies ScoredResultItem;
    })
    .filter((p) => (q ? p.score > 0 : true))
    .sort((a, b) => b.score - a.score)
    .map(({ score: _score, ...p }) => p);

  const serviceResults: ResultItem[] = site.services
    .map((s) => {
      const score = q
        ? scoreForTerms(expandedTerms, [
            { text: normalize(s.title), weight: 10 },
            { text: normalize(s.summary ?? ''), weight: 6 },
            { text: normalize((s.bullets ?? []).join(' ')), weight: 2 }
          ])
        : 0;

      return {
        type: 'Service',
        title: s.title,
        href: `/services#${s.slug}`,
        kicker: 'Service',
        meta: s.summary,
        score
      } satisfies ScoredResultItem;
    })
    .filter((s) => (q ? s.score > 0 : true))
    .sort((a, b) => b.score - a.score)
    .map(({ score: _score, ...s }) => s);

  const pageResults: ResultItem[] = pages
    .map((p) => {
      const score = q
        ? scoreForTerms(expandedTerms, [
            { text: normalize(p.title), weight: 10 },
            { text: normalize(p.meta ?? ''), weight: 3 }
          ])
        : 0;

      return {
        ...p,
        score
      } satisfies ScoredResultItem;
    })
    .filter((p) => (q ? p.score > 0 : true))
    .sort((a, b) => b.score - a.score)
    .map(({ score: _score, ...p }) => p);

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
