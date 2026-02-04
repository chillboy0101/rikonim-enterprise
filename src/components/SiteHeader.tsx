'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { Container } from '@/components/layout/Container';

const nav = [
  { href: '/about', label: 'Company' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/contact', label: 'Contact' }
];

const megaMenu = {
  '/about': {
    title: 'Company',
    items: [
      { href: '/about', label: 'Company Overview', description: 'Who we are and how we work.' },
      { href: '/leadership', label: 'Leadership', description: 'Meet the team leading delivery.' },
      { href: '/history', label: 'History', description: 'Our story and milestones.' },
      { href: '/impact-reports', label: 'Impact Reports', description: 'Commitments, progress, and reporting.' }
    ]
  },
  '/services': {
    title: 'Services',
    items: [
      { href: '/services', label: 'Our Services', description: 'What we deliver, end-to-end.' },
      { href: '/projects', label: 'Projects', description: 'See work delivered across sectors.' },
      { href: '/suppliers', label: 'Suppliers', description: 'Working with suppliers and partners.' },
      { href: '/contact', label: 'Contact', description: 'Talk to us about your next project.' }
    ]
  },
  '/projects': {
    title: 'Projects',
    items: [
      { href: '/projects', label: 'All Projects', description: 'Explore our completed and proposed work.' },
      { href: '/media', label: 'Media', description: 'Updates, photos, and highlights.' },
      { href: '/blog', label: 'Insights', description: 'News and articles.' },
      { href: '/search', label: 'Search', description: 'Find projects, pages, and more.' }
    ]
  },
  '/leadership': {
    title: 'Leadership',
    items: [
      { href: '/leadership', label: 'Leadership', description: 'Our leadership team.' },
      { href: '/careers', label: 'Careers', description: 'Join the team and grow with us.' },
      { href: '/about', label: 'Company', description: 'Learn more about our company.' },
      { href: '/contact', label: 'Contact', description: 'Let’s discuss your project needs.' }
    ]
  },
  '/contact': {
    title: 'Contact',
    items: [
      { href: '/contact', label: 'Contact', description: 'Let’s discuss your project needs.' },
      { href: '/careers', label: 'Careers', description: 'Open roles and opportunities.' },
      { href: '/projects', label: 'Projects', description: 'View our portfolio.' },
      { href: '/services', label: 'Services', description: 'See what we can deliver for you.' }
    ]
  }
} satisfies Record<
  string,
  {
    title: string;
    items: Array<{ href: string; label: string; description: string }>;
  }
>;

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [solid, setSolid] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<keyof typeof megaMenu | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [hoveringHeader, setHoveringHeader] = useState(false);
  const [hasHero, setHasHero] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(72);
  const [featuredProjects, setFeaturedProjects] = useState<
    Array<{
      slug: string;
      title: string;
      image?: string;
      location?: string;
      year?: string;
      status?: string;
      summary?: string;
    }>
  >([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollY = useRef(0);
  const isHome = pathname === '/';

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
    setMegaOpen(null);
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const measureHero = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const hero = document.getElementById('home-hero') || document.getElementById('page-hero');
        setHasHero(!!hero);
      });
    };

    measureHero();
    window.addEventListener('resize', measureHero);
    return () => {
      window.removeEventListener('resize', measureHero);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    const anyOverlayOpen = searchOpen || menuOpen;
    document.body.style.overflow = anyOverlayOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen, menuOpen]);

  useEffect(() => {
    if (!searchOpen && !menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, menuOpen]);

  useEffect(() => {
    if (!megaOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [megaOpen]);

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const headerEl = headerRef.current;
        if (!headerEl) return;
        const h = Math.round(headerEl.getBoundingClientRect().height);
        setHeaderOffset(h > 0 ? h : 72);
      });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const delta = y - lastScrollY.current;

        if (y < 12) {
          setCollapsed(false);
        } else if (delta > 6) {
          setCollapsed(true);
          setSearchOpen(false);
          setMenuOpen(false);
        } else if (delta < -6) {
          setCollapsed(false);
        }

        lastScrollY.current = y;

        const hero = document.getElementById('home-hero') || document.getElementById('page-hero');
        const headerEl = headerRef.current;

        if (!hero || !headerEl) {
          setSolid(true);
          return;
        }

        const headerHeight = headerEl.getBoundingClientRect().height;
        const heroBottom = hero.getBoundingClientRect().bottom;
        setSolid(heroBottom <= headerHeight + 1);
      });
    };

    lastScrollY.current = window.scrollY || 0;
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  const activeHref = useMemo(() => pathname || '/', [pathname]);
  const forceSolid = hoveringHeader || menuOpen || !!megaOpen;
  const heroTransparent = hasHero && !solid && !forceSolid;
  const activeMega = megaOpen ? megaMenu[megaOpen] : null;

  const onSubmitSearch = (value: string) => {
    const q = value.trim();
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const openSearch = () => {
    setCollapsed(false);
    setMenuOpen(false);
    setMegaOpen(null);
    setSearchOpen(true);
    setSearchValue('');
  };

  const openMenu = async () => {
    setCollapsed(false);
    setSearchOpen(false);
    setMegaOpen(null);
    setMenuOpen(true);

    if (featuredProjects.length) return;
    try {
      setFeaturedLoading(true);
      const res = await fetch('/api/featured-projects', { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as { featured?: typeof featuredProjects };
      setFeaturedProjects(Array.isArray(json.featured) ? json.featured : []);
    } finally {
      setFeaturedLoading(false);
    }
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full"
      onMouseEnter={() => setHoveringHeader(true)}
      onMouseLeave={() => {
        setHoveringHeader(false);
        setMegaOpen(null);
      }}
      onFocusCapture={() => setHoveringHeader(true)}
      onBlurCapture={() => setHoveringHeader(false)}
    >
      <div
        className={`relative z-10 w-full overflow-hidden bg-brand-orange transition-[opacity,height] duration-200 ${
          collapsed || heroTransparent
            ? 'h-[4px] opacity-100 shadow-[0_1px_0_rgba(11,18,32,0.18)]'
            : 'h-0 opacity-0'
        }`}
      />

      <div
        className={`relative overflow-hidden transition-transform duration-300 ${
          collapsed ? '-translate-y-full' : 'translate-y-0'
        } ${heroTransparent ? '' : ''}`}
      >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 transform bg-white transition-transform duration-300 ${
          heroTransparent ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-brand-ink/10" />
      </div>
      <Container>
        <div className="relative z-10 flex items-center py-4 md:py-5">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo className="h-10 w-[200px] sm:h-11 sm:w-[240px] md:h-12 md:w-[300px]" />
          </Link>

          <div className="ml-auto hidden items-center gap-6 md:flex">
            <nav className="hidden items-center gap-8 lg:gap-10 md:flex">
              {nav.map((n) => {
                const active = isHome ? n.href === activeHref : false;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onMouseEnter={() => {
                      if (searchOpen || menuOpen) return;
                      setMegaOpen(n.href as keyof typeof megaMenu);
                    }}
                    onFocus={() => {
                      if (searchOpen || menuOpen) return;
                      setMegaOpen(n.href as keyof typeof megaMenu);
                    }}
                    onClick={() => setMegaOpen(null)}
                    className={`relative text-[13px] font-semibold uppercase tracking-[0.14em] transition after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-brand-orange after:transition after:duration-200 hover:after:scale-x-100 ${
                      heroTransparent
                        ? active
                          ? 'text-white after:scale-x-100'
                          : 'text-white/80 hover:text-white'
                        : active
                          ? 'text-brand-ink after:scale-x-100'
                          : 'text-brand-steel hover:text-brand-ink'
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${
                searchOpen
                  ? 'bg-brand-orange text-white'
                  : heroTransparent
                    ? 'text-white/90 hover:bg-brand-orange hover:text-white'
                    : 'text-brand-ink/70 hover:bg-brand-orange/20 hover:text-brand-orange'
              }`}
              aria-label="Search"
              onClick={searchOpen ? () => setSearchOpen(false) : openSearch}
            >
              <span className="relative block h-5 w-5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    searchOpen ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    searchOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${
                menuOpen
                  ? 'bg-brand-orange text-white'
                  : heroTransparent
                    ? 'bg-white/90 text-brand-ink hover:bg-white'
                    : 'bg-brand-orange/15 text-brand-orange hover:bg-brand-orange hover:text-white'
              }`}
              aria-label="Menu"
              onClick={menuOpen ? () => setMenuOpen(false) : openMenu}
            >
              <span className="relative block h-5 w-5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    menuOpen ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    menuOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </span>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3 md:hidden">
            <button
              type="button"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${
                searchOpen
                  ? 'bg-brand-orange text-white'
                  : heroTransparent
                    ? 'text-white/90 hover:bg-brand-orange hover:text-white'
                    : 'text-brand-ink/70 hover:bg-brand-orange/20 hover:text-brand-orange'
              }`}
              aria-label="Search"
              onClick={searchOpen ? () => setSearchOpen(false) : openSearch}
            >
              <span className="relative block h-5 w-5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    searchOpen ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    searchOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${
                menuOpen
                  ? 'bg-brand-orange text-white'
                  : heroTransparent
                    ? 'bg-brand-ink/55 text-white hover:bg-brand-ink/70'
                    : 'bg-brand-orange/15 text-brand-orange hover:bg-brand-orange hover:text-white'
              }`}
              aria-label="Menu"
              onClick={menuOpen ? () => setMenuOpen(false) : openMenu}
            >
              <span className="relative block h-5 w-5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    menuOpen ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${
                    menuOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6l-12 12" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </Container>
      </div>

      {searchOpen ? (
        <div
          className="fixed left-0 right-0 z-40 border-b border-brand-ink/10 bg-white"
          style={{ top: headerOffset }}
        >
          <Container>
            <form
              className="flex items-center justify-center py-5"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitSearch(searchValue);
              }}
            >
              <div className="flex w-full max-w-2xl items-center gap-3 border-b border-brand-ink/15 pb-3">
                <input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-lg font-semibold text-brand-ink placeholder:text-brand-steel/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-brand-orange/15 hover:text-brand-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Submit search"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h13" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </form>
          </Container>
        </div>
      ) : null}

      {activeMega && !searchOpen && !menuOpen ? (
        <div
          className="fixed left-0 right-0 z-40 border-b border-brand-ink/10 bg-white"
          style={{ top: headerOffset }}
        >
          <Container>
            <div className="grid gap-8 py-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">EXPLORE</p>
                <p className="mt-3 text-2xl font-bold tracking-tightest text-brand-ink">{activeMega.title}</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-steel">
                  Navigate quickly to the pages you need.
                </p>
              </div>
              <div className="md:col-span-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeMega.items.map((item) => (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      className="group rounded-2xl border border-brand-ink/10 bg-white p-5 transition hover:border-brand-orange/30 hover:shadow-[0_16px_40px_rgba(11,18,32,0.08)]"
                      onClick={() => setMegaOpen(null)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-brand-ink group-hover:text-brand-orange">{item.label}</p>
                          <p className="mt-1 text-sm leading-relaxed text-brand-steel">{item.description}</p>
                        </div>
                        <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition group-hover:bg-brand-orange group-hover:text-white">
                          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h13" />
                            <path d="M13 6l6 6-6 6" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      ) : null}

      {menuOpen ? (
        <>
          <div className="fixed inset-0 z-[60] bg-white md:hidden">
            <div className="flex h-full flex-col">
              <div className="border-b border-brand-ink/10">
                <Container>
                  <div className="flex items-center justify-between py-4">
                    <Link
                      href="/"
                      className="flex items-center gap-3"
                      onClick={() => setMenuOpen(false)}
                    >
                      <BrandLogo className="h-9 w-[170px]" />
                    </Link>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-ink transition hover:bg-brand-ink/5"
                        aria-label="Search"
                        onClick={openSearch}
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="11" cy="11" r="7" />
                          <path d="M20 20l-3.5-3.5" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange text-white transition hover:bg-brand-orange/90"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
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
                      </button>
                    </div>
                  </div>
                </Container>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Container>
                  <div className="py-6">
                    <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">NAVIGATION</p>

                    <div className="mt-5 border-t border-brand-ink/10">
                      {nav.map((n) => (
                        <Link
                          key={n.href}
                          href={n.href}
                          className="flex items-center justify-between border-b border-brand-ink/10 py-5"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className="text-base font-semibold text-brand-orange">{n.label}</span>
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-5 w-5 text-brand-orange"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          </div>

          <div
            className="fixed inset-0 z-40 hidden bg-white md:block"
            style={{ top: headerOffset }}
          >
            <Container>
              <div className="grid gap-10 py-10 md:grid-cols-12">
                <div className="md:col-span-4">
                  <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Navigation</p>
                  <div className="mt-6 grid gap-2 border-t border-brand-ink/10 pt-6">
                    {nav.map((n) => (
                      <Link
                        key={n.href}
                        href={n.href}
                        className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-brand-ink hover:bg-brand-mist"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span>{n.label}</span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-4 w-4 text-brand-steel"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-10 border-t border-brand-ink/10 pt-6">
                    <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Quick links</p>
                    <div className="mt-4 grid gap-3">
                      <button
                        type="button"
                        className="text-left text-sm font-semibold text-brand-blue hover:underline"
                        onClick={openSearch}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Featured projects</p>
                    <Link
                      href="/projects"
                      className="text-xs font-semibold tracking-[0.14em] text-brand-orange hover:underline"
                      onClick={() => setMenuOpen(false)}
                    >
                      See all projects
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    {featuredLoading ? (
                      <div className="text-sm font-semibold text-brand-steel">Loading…</div>
                    ) : null}

                    {!featuredLoading && featuredProjects.length === 0 ? (
                      <div className="text-sm font-semibold text-brand-steel">
                        Featured projects will appear here.
                      </div>
                    ) : null}

                    {featuredProjects.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/projects/${p.slug}`}
                        className="group overflow-hidden rounded-2xl border border-brand-ink/10 bg-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className="aspect-[4/3] w-full bg-brand-mist">
                          {p.image ? (
                            <img src={p.image} alt="" className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <div className="p-5">
                          <p className="text-[11px] font-semibold tracking-[0.14em] text-brand-steel">
                            {[p.location, p.year].filter(Boolean).join(' • ') || 'Project'}
                          </p>
                          <p className="mt-2 text-base font-semibold text-brand-ink group-hover:underline">
                            {p.title}
                          </p>
                          {p.summary ? (
                            <p className="mt-2 text-sm leading-relaxed text-brand-steel">{p.summary}</p>
                          ) : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </>
      ) : null}
    </header>
  );
}
