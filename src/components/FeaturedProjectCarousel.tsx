'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type FeaturedProject = {
  slug: string;
  title: string;
  image?: string;
};

export function FeaturedProjectCarousel() {
  const AUTOPLAY_MS = 6000;
  const COMPLETE_HOLD_MS = 250;
  const [items, setItems] = useState<FeaturedProject[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [autoplayKey, setAutoplayKey] = useState(0);
  const lastTickRef = useRef<number | null>(null);
  const completeHoldRef = useRef(false);
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      setProgress(1);
      return;
    }

    let rafId = 0;
    let realElapsedMs = 0;
    let visualElapsedMs = 0;

    const tick = (now: number) => {
      const last = lastTickRef.current;
      lastTickRef.current = now;

      if (completeHoldRef.current) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      const delta = last == null ? 0 : Math.max(0, now - last);
      realElapsedMs += delta;

      const backlog = Math.max(0, realElapsedMs - visualElapsedMs);
      const baseStep = Math.min(delta, 50);
      const catchUpStep = Math.min(25, backlog);
      const step = Math.min(backlog, baseStep + catchUpStep);
      visualElapsedMs += step;

      const visualProgress = Math.min(visualElapsedMs / AUTOPLAY_MS, 1);
      const realProgress = Math.min(realElapsedMs / AUTOPLAY_MS, 1);
      const nextProgress = Math.max(visualProgress, realProgress);
      setProgress(nextProgress);

      if (realProgress >= 1) {
        completeHoldRef.current = true;
        setProgress(1);

        if (completeTimeoutRef.current) {
          clearTimeout(completeTimeoutRef.current);
        }

        completeTimeoutRef.current = setTimeout(() => {
          completeHoldRef.current = false;
          realElapsedMs = 0;
          visualElapsedMs = 0;
          setProgress(0);
          setActive((v) => (v + 1) % items.length);
        }, COMPLETE_HOLD_MS);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      completeHoldRef.current = false;
      if (completeTimeoutRef.current) {
        clearTimeout(completeTimeoutRef.current);
        completeTimeoutRef.current = null;
      }
    };
  }, [AUTOPLAY_MS, autoplayKey, items.length]);

  const current = items[active];

  const goTo = (index: number) => {
    if (!items.length) return;
    const clamped = ((index % items.length) + items.length) % items.length;
    completeHoldRef.current = false;
    if (completeTimeoutRef.current) {
      clearTimeout(completeTimeoutRef.current);
      completeTimeoutRef.current = null;
    }
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
      className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[380px] xl:mx-0 xl:ml-auto xl:max-w-[320px]"
    >
      <div className="pointer-events-none absolute inset-0 -translate-x-6 -translate-y-6 rounded-[28px] border border-white/15 bg-white/30" />

      <button
        type="button"
        aria-label="Previous"
        onClick={prev}
        className="absolute left-2 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white/90 shadow-[0_16px_40px_rgba(11,18,32,0.25)] ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/25 hover:text-white sm:left-[-32px] sm:h-12 sm:w-12"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M14 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 overflow-hidden rounded-[28px] border border-white/20 bg-white/95 shadow-[0_22px_70px_rgba(11,18,32,0.35)]">
        <div className="p-5 sm:p-6">
          <div className="aspect-video overflow-hidden bg-brand-mist">
            {current.image ? (
              <img
                src={current.image}
                alt={`${current.title} project image`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>

          <p className="mt-6 text-lg font-semibold leading-tight tracking-tightest text-brand-ink">
            {current.title}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to item ${i + 1}`}
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => goTo(i)}
                    className={`h-2 overflow-hidden rounded-full transition-[width,background-color] duration-250 ease-in-out ${
                      i === active ? 'w-14 bg-brand-ink/20' : 'w-2 bg-brand-ink/20 hover:bg-brand-ink/30'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="block h-full w-full origin-left rounded-full bg-brand-orange transition-[transform,opacity] duration-150 ease-linear will-change-transform"
                      style={{
                        transform: `scaleX(${i === active ? progress : 0})`,
                        opacity: i === active ? 1 : 0,
                      }}
                    />
                  </button>
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
        className="absolute right-2 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white/90 shadow-[0_16px_40px_rgba(11,18,32,0.25)] ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/25 hover:text-white sm:right-[-32px] sm:h-12 sm:w-12"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M10 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
