'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
    description:
      'Our ultimate differentiator is the quality of our people and the discipline behind our delivery—built to serve clients and communities.',
    cta: { href: '/about', label: 'Get to Know Our Company' },
    cards: [
      {
        href: '/about',
        title: 'Who We Are',
        description: 'A Ghana-based construction partner focused on durable outcomes and trusted delivery.',
        image: '/uploads/company-1.jpeg'
      },
      {
        href: '/about',
        title: 'How We Deliver',
        description: 'Safety, quality controls, and planning discipline across every workfront.',
        image: '/uploads/company-2.jpeg'
      },
      {
        href: '/about',
        title: 'Capabilities',
        description: 'Building, civil works, renovation, and coordinated project management.',
        image: '/uploads/company-3.jpeg'
      }
    ]
  },
  '/services': {
    title: 'Services',
    description:
      'Integrated services across the project lifecycle—engineering, procurement support, construction delivery, and disciplined project management.',
    cta: { href: '/services', label: 'Explore Our Services' },
    cards: [
      {
        href: '/services#building-construction',
        title: 'Building Construction',
        description: 'Durable structures delivered with safety and quality control.',
        image: '/uploads/services-1.jpeg'
      },
      {
        href: '/services#civil-engineering-works',
        title: 'Civil Engineering',
        description: 'Roadworks, drainage, and infrastructure built to last.',
        image: '/uploads/services-2.jpeg'
      },
      {
        href: '/services#renovation-refurbishment',
        title: 'Renovation & Refurbishment',
        description: 'Upgrades with minimal disruption to operations.',
        image: '/uploads/services-3.jpeg'
      }
    ]
  },
  '/projects': {
    title: 'Projects',
    description:
      'Explore selected work across sectors—planned and delivered with discipline, quality assurance, and transparent reporting.',
    cta: { href: '/projects', label: 'See All Projects' },
    cards: [] as Array<never>
  },
  '/leadership': {
    title: 'Leadership',
    description:
      'Leadership that sets standards, builds capability, and ensures projects are executed safely, ethically, and effectively.',
    cta: { href: '/leadership', label: 'Meet Our Leadership' },
    cards: [
      {
        href: '/leadership',
        title: 'Leadership Team',
        description: 'Experienced professionals driving delivery excellence.',
        image: '/uploads/company-2.jpeg'
      },
      {
        href: '/leadership',
        title: 'Governance',
        description: 'Clear accountability and decision-making that protects delivery outcomes.',
        image: '/uploads/company-1.jpeg'
      },
      {
        href: '/leadership',
        title: 'Performance & Standards',
        description: 'A leadership culture focused on safety, quality, and continuous improvement.',
        image: '/uploads/company-3.jpeg'
      }
    ]
  },
  '/contact': {
    title: 'Contact',
    description:
      'Connect with us to discuss scope, timelines, and the delivery approach that best fits your project needs.',
    cta: { href: '/contact', label: 'Contact Us' },
    cards: [
      {
        href: '/contact',
        title: 'Project Enquiries',
        description: 'Reach out to discuss scope, timelines, and constraints.',
        image: '/uploads/services-1.jpeg'
      },
      {
        href: '/contact',
        title: 'Partnerships',
        description: 'Work with us on delivery, supply, or collaboration opportunities.',
        image: '/uploads/services-2.jpeg'
      },
      {
        href: '/contact',
        title: 'Consultation',
        description: 'Request a consultation and we’ll respond as soon as possible.',
        image: '/uploads/services-3.jpeg'
      }
    ]
  }
} as const;

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [solid, setSolid] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<keyof typeof megaMenu | null>(null);
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState<string | null>(null);
  const [mobileMenuSelected, setMobileMenuSelected] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [hoveringHeader, setHoveringHeader] = useState(false);
  const [hasHero, setHasHero] = useState(true);
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
  const megaCloseTimeout = useRef<number | null>(null);
  const overlayLockedScrollY = useRef(0);
  const overlayLockedBodyPaddingRight = useRef('');
  const overlayLockedHeaderPaddingRight = useRef('');
  const isHome = pathname === '/';

  const syncHeroState = () => {
    const hero = document.getElementById('home-hero') || document.getElementById('page-hero');
    setHasHero(!!hero);

    const headerEl = headerRef.current;
    if (!hero || !headerEl) {
      setSolid(true);
      return;
    }

    const headerHeight = headerEl.getBoundingClientRect().height;
    const heroBottom = hero.getBoundingClientRect().bottom;
    setSolid(heroBottom <= headerHeight + 1);
  };

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
    setMegaOpen(null);
    setMobileMenuExpanded(null);
    setMobileMenuSelected(null);
  }, [pathname]);

  useLayoutEffect(() => {
    syncHeroState();
    window.addEventListener('resize', syncHeroState);
    return () => {
      window.removeEventListener('resize', syncHeroState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const anyOverlayOpen = searchOpen || menuOpen || !!megaOpen;
    const wasLocked = anyOverlayOpen;

    if (anyOverlayOpen) {
      overlayLockedScrollY.current = window.scrollY || 0;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      overlayLockedBodyPaddingRight.current = document.body.style.paddingRight;
      overlayLockedHeaderPaddingRight.current = headerRef.current?.style.paddingRight ?? '';
      if (scrollbarWidth > 0) {
        const pr = `${scrollbarWidth}px`;
        document.body.style.paddingRight = pr;
        if (headerRef.current) headerRef.current.style.paddingRight = pr;
      }

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${overlayLockedScrollY.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = overlayLockedBodyPaddingRight.current;
      if (headerRef.current) headerRef.current.style.paddingRight = overlayLockedHeaderPaddingRight.current;
      window.scrollTo(0, overlayLockedScrollY.current);
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.paddingRight = overlayLockedBodyPaddingRight.current;
      if (headerRef.current) headerRef.current.style.paddingRight = overlayLockedHeaderPaddingRight.current;

      if (wasLocked) {
        window.scrollTo(0, overlayLockedScrollY.current);
      }
    };
  }, [searchOpen, menuOpen, megaOpen]);

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

  useEffect(() => {
    const sync = () => {
      setHoveringHeader(false);
      window.dispatchEvent(new Event('scroll'));
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') sync();
    };

    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const activeHref = useMemo(() => pathname || '/', [pathname]);
  const forceSolid = hoveringHeader || menuOpen || !!megaOpen;
  const heroTransparent = hasHero && !solid && !forceSolid;
  const activeMega = megaOpen ? megaMenu[megaOpen] : null;

  useEffect(() => {
    if (!megaOpen) return;
    if (searchOpen || menuOpen) return;
    if (megaOpen === '/projects') {
      void loadFeaturedProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [megaOpen]);

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

  const loadFeaturedProjects = async () => {
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

  const openMenu = async () => {
    setCollapsed(false);
    setSearchOpen(false);
    setMegaOpen(null);
    setMenuOpen(true);
    setMobileMenuExpanded(null);
    setMobileMenuSelected(null);

    await loadFeaturedProjects();
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full"
      onMouseEnter={() => setHoveringHeader(true)}
      onMouseLeave={() => {
        setHoveringHeader(false);
        if (megaCloseTimeout.current) {
          window.clearTimeout(megaCloseTimeout.current);
        }

        megaCloseTimeout.current = window.setTimeout(() => {
          setMegaOpen(null);
        }, 140);
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

          <div className="ml-auto hidden items-center gap-4 md:flex">
            <nav
              className="hidden items-center gap-6 lg:gap-8 md:flex"
              onMouseEnter={() => {
                if (megaCloseTimeout.current) {
                  window.clearTimeout(megaCloseTimeout.current);
                  megaCloseTimeout.current = null;
                }
              }}
              onMouseLeave={() => {
                if (megaCloseTimeout.current) {
                  window.clearTimeout(megaCloseTimeout.current);
                }

                megaCloseTimeout.current = window.setTimeout(() => {
                  setMegaOpen(null);
                }, 140);
              }}
            >
              {nav.map((n) => {
                const active = isHome ? n.href === activeHref : false;
                return (
                  <button
                    key={n.href}
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={megaOpen === (n.href as keyof typeof megaMenu)}
                    onMouseEnter={() => {
                      if (megaCloseTimeout.current) {
                        window.clearTimeout(megaCloseTimeout.current);
                        megaCloseTimeout.current = null;
                      }
                      setSearchOpen(false);
                      setMenuOpen(false);
                      setMegaOpen(n.href as keyof typeof megaMenu);
                    }}
                    onFocus={() => {
                      if (megaCloseTimeout.current) {
                        window.clearTimeout(megaCloseTimeout.current);
                        megaCloseTimeout.current = null;
                      }
                      setSearchOpen(false);
                      setMenuOpen(false);
                      setMegaOpen(n.href as keyof typeof megaMenu);
                    }}
                    onClick={() => {
                      if (megaCloseTimeout.current) {
                        window.clearTimeout(megaCloseTimeout.current);
                        megaCloseTimeout.current = null;
                      }
                      setSearchOpen(false);
                      setMenuOpen(false);
                      setMegaOpen(n.href as keyof typeof megaMenu);
                    }}
                    className={`relative !outline-0 focus:!outline-0 focus-visible:!outline-0 focus-visible:!outline-offset-0 hover:!shadow-none focus:!shadow-none focus-visible:!shadow-none focus:!ring-0 focus-visible:!ring-0 focus:!ring-offset-0 focus-visible:!ring-offset-0 focus-visible:after:scale-x-100 text-[13px] font-semibold uppercase tracking-[0.12em] transition after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-brand-orange after:transition after:duration-200 hover:after:scale-x-100 ${
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
                  </button>
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
          className="fixed inset-0 z-40 overscroll-contain overflow-y-auto bg-white"
          style={{ top: headerOffset, ...( { scrollbarGutter: 'stable' } as any ) }}
          onMouseEnter={() => {
            if (megaCloseTimeout.current) {
              window.clearTimeout(megaCloseTimeout.current);
              megaCloseTimeout.current = null;
            }
          }}
          onMouseLeave={() => {
            setMegaOpen(null);
          }}
        >
          <Container>
            <div className="grid gap-10 py-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">{activeMega.title}</p>
                <p className="mt-5 text-sm leading-relaxed text-brand-steel">{activeMega.description}</p>

                <Link
                  href={activeMega.cta.href}
                  className="group mt-8 inline-flex items-center gap-4 text-sm font-semibold text-brand-orange"
                  onClick={() => setMegaOpen(null)}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white transition group-hover:bg-brand-orange/90">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h13" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.14em]">{activeMega.cta.label}</span>
                </Link>
              </div>

              <div className="md:col-span-8">
                {megaOpen === '/projects' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Featured projects</p>
                      <Link
                        href="/projects"
                        className="text-xs font-semibold tracking-[0.14em] text-brand-orange hover:underline"
                        onClick={() => setMegaOpen(null)}
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

                      {featuredProjects.slice(0, 3).map((p) => (
                        <Link
                          key={p.slug}
                          href={`/projects/${p.slug}`}
                          className="group overflow-hidden rounded-2xl border border-brand-ink/10 bg-white"
                          onClick={() => setMegaOpen(null)}
                        >
                          <div className="aspect-[4/3] w-full bg-brand-mist">
                            {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : null}
                          </div>
                          <div className="p-5">
                            <p className="text-[11px] font-semibold tracking-[0.14em] text-brand-steel">
                              {[p.location, p.year].filter(Boolean).join(' • ') || 'Project'}
                            </p>
                            <p className="mt-2 text-base font-semibold text-brand-ink group-hover:underline">{p.title}</p>
                            {p.summary ? (
                              <p className="mt-2 text-sm leading-relaxed text-brand-steel">{p.summary}</p>
                            ) : null}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="grid gap-6 md:grid-cols-3">
                    {activeMega.cards.map((card) => (
                      <Link
                        key={card.href + card.title}
                        href={activeMega.cta.href}
                        className="group overflow-hidden rounded-2xl border border-brand-ink/10 bg-white"
                        onClick={() => setMegaOpen(null)}
                      >
                        <div className="aspect-[4/3] w-full bg-brand-mist">
                          {card.image ? <img src={card.image} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div className="p-5">
                          <p className="text-base font-semibold text-brand-ink group-hover:text-brand-orange">
                            {card.title}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-brand-steel">{card.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
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
                      {nav.map((n) => {
                        const expanded = mobileMenuExpanded === n.href;
                        const mega = megaMenu[n.href as keyof typeof megaMenu];
                        const children =
                          n.href === '/projects'
                            ? [
                                { href: '/projects', label: 'View More Projects' },
                                { href: '/projects', label: 'Markets' },
                                { href: '/projects', label: 'Regions' }
                              ]
                            : mega?.cards?.map((c) => ({ href: c.href, label: c.title })) ?? [];

                        return (
                          <div key={n.href} className="border-b border-brand-ink/10">
                            <div className="flex items-center justify-between py-5">
                              <Link
                                href={n.href}
                                className="text-base font-semibold text-brand-orange"
                                onClick={() => setMenuOpen(false)}
                              >
                                {n.label}
                              </Link>

                              <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-orange transition hover:bg-brand-orange/10"
                                aria-label={expanded ? `Collapse ${n.label}` : `Expand ${n.label}`}
                                aria-expanded={expanded}
                                onClick={() => setMobileMenuExpanded((prev) => (prev === n.href ? null : n.href))}
                              >
                                <svg
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                  className={`h-5 w-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M6 9l6 6 6-6" />
                                </svg>
                              </button>
                            </div>

                            {expanded && children.length ? (
                              <div className="pb-5 pl-4">
                                <ul className="grid gap-3">
                                  {children.map((c) => {
                                    const key = `${n.href}:${c.href}:${c.label}`;
                                    const selected = mobileMenuSelected === key;
                                    return (
                                      <li key={key}>
                                        <Link
                                          href={c.href}
                                          className={`flex items-center gap-3 text-sm font-semibold transition ${
                                            selected
                                              ? 'text-brand-orange'
                                              : 'text-brand-ink/80 hover:text-brand-ink'
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setMobileMenuSelected(key);
                                            window.setTimeout(() => {
                                              setMenuOpen(false);
                                              setMobileMenuExpanded(null);
                                              setMobileMenuSelected(null);
                                              router.push(c.href);
                                            }, 140);
                                          }}
                                        >
                                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                                          <span>{c.label}</span>
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
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
