'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type FeaturedProject = {
  slug: string;
  title: string;
  image?: string;
};

export function FeaturedProjectCarousel() {
  const AUTOPLAY_MS = 5500;
  const [items, setItems] = useState<FeaturedProject[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplayKey, setAutoplayKey] = useState(0);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/featured-projects', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { featured?: FeaturedProject[] };
        if (cancelled) return;
        if (Array.isArray(json.featured)) setItems(json.featured);
      } catch {
        // ignore
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    if (active >= items.length) setActive(0);
  }, [active, items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      setProgress(0);
      return;
    }

    let rafId = 0;
    let start = performance.now();

    const tick = (now: number) => {
      const last = lastTickRef.current;
      lastTickRef.current = now;

      if (paused && last != null) {
        start += now - last;
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - start;
      const nextProgress = Math.min(elapsed / AUTOPLAY_MS, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        start = now;
        setProgress(0);
        setActive((v) => (v + 1) % items.length);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [AUTOPLAY_MS, autoplayKey, items.length, paused]);

  const current = items[active];

  const progressWidth = `${progress * 100}%`;

  const goTo = (index: number) => {
    if (!items.length) return;
    const clamped = ((index % items.length) + items.length) % items.length;
    setActive(clamped);
    setProgress(0);
    setAutoplayKey((v) => v + 1);
  };

  const next = () => {
    if (!items.length) return;
    goTo(active + 1);
  };

  const prev = () => {
    if (!items.length) return;
    goTo(active - 1);
  };

  if (!current) {
    return (
      <div className="border border-white/10 bg-white/95 p-7 shadow-[0_22px_70px_rgba(11,18,32,0.35)]">
        <p className="text-sm font-semibold text-brand-steel">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className="relative ml-auto w-full max-w-[300px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 -translate-x-6 -translate-y-6 rounded-[28px] border border-white/15 bg-white/30" />

      <button
        type="button"
        aria-label="Previous"
        onClick={prev}
        className="absolute left-[-44px] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-white/70 transition hover:text-white md:inline-flex"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 overflow-hidden rounded-[28px] border border-white/20 bg-white/95 shadow-[0_22px_70px_rgba(11,18,32,0.35)]">
        <div className="p-5 sm:p-6">
          <div className="aspect-video overflow-hidden bg-brand-mist">
            {current.image ? (
              <img src={current.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>

          <p className="mt-6 text-lg font-semibold leading-tight tracking-tightest text-brand-ink">
            {current.title}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="h-[6px] flex-1 rounded-full bg-brand-mist">
                <div className="h-[6px] rounded-full bg-brand-orange" style={{ width: progressWidth }} />
              </div>

              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to item ${i + 1}`}
                    onClick={() => goTo(i)}
                    className={`h-[6px] w-[6px] rounded-full transition ${
                      i === active ? 'bg-brand-orange' : 'bg-brand-ink/15 hover:bg-brand-ink/25'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Link
              href={`/projects/${current.slug}`}
              className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand-orange/20 text-brand-orange transition hover:bg-brand-orange hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              aria-label="Open project"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 -rotate-45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h13" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Next"
        onClick={next}
        className="absolute right-[-44px] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-white/70 transition hover:text-white md:inline-flex"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
