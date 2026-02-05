import Link from 'next/link';
import { BrandLogo } from '@/components/BrandLogo';
import { Container } from '@/components/layout/Container';
import { site } from '@/lib/site';

export function SiteFooter() {
  const phoneParts = site.contact.phone
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <footer className="overflow-x-hidden bg-brand-blueDark text-white subpixel-antialiased">
      <Container className="flex flex-col xl:min-h-screen">
        <nav
          className="grid gap-y-14 pt-20 sm:grid-cols-2 md:pt-24 md:grid-cols-3 md:gap-x-12 lg:grid-cols-5 lg:gap-x-20"
          aria-label="footer navigation"
        >
          <div className="min-w-0">
            <Link href="/about" className="footer-link text-base font-semibold md:text-xl">
              People
            </Link>
            <div className="mt-6 flex flex-col gap-4 text-sm font-semibold text-white/90 md:text-[15px]">
              <Link href="/about" className="footer-link hover:text-white">
                Vision, Values &amp; Commitments
              </Link>
              <Link href="/leadership" className="footer-link hover:text-white">
                Leadership
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <Link href="/projects" className="footer-link text-base font-semibold md:text-xl">
              Projects
            </Link>
            <div className="mt-6 flex flex-col gap-4 text-sm font-semibold text-white/90 md:text-[15px]">
              <Link href="/projects" className="footer-link hover:text-white">
                View More Projects
              </Link>
              <Link href="/projects" className="footer-link hover:text-white">
                Markets
              </Link>
              <Link href="/projects" className="footer-link hover:text-white">
                Regions
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <Link href="/about" className="footer-link text-base font-semibold md:text-xl">
              Approach
            </Link>
            <div className="mt-6 flex flex-col gap-4 text-sm font-semibold text-white/90 md:text-[15px]">
              <Link href="/about" className="footer-link hover:text-white">
                Safety
              </Link>
              <Link href="/services" className="footer-link hover:text-white">
                Services
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <Link href="/careers" className="footer-link text-base font-semibold md:text-xl">
              Careers
            </Link>
            <div className="mt-6 flex flex-col gap-4 text-sm font-semibold text-white/90 md:text-[15px]">
              <Link href="/careers" className="footer-link hover:text-white">
                Why Rikonim
              </Link>
              <Link href="/careers" className="footer-link hover:text-white">
                Career Opportunities
              </Link>
              <Link href="/careers" className="footer-link hover:text-white">
                Life at Rikonim
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-col gap-4 text-base font-semibold md:text-xl">
              <Link href="/history" className="footer-link hover:text-white/90">
                History
              </Link>
              <Link href="/contact" className="footer-link hover:text-white/90">
                Contact
              </Link>
              <Link href="/media" className="footer-link hover:text-white/90">
                Media
              </Link>
              <Link href="/blog" className="footer-link hover:text-white/90">
                Blog
              </Link>
              <Link href="/suppliers" className="footer-link hover:text-white/90">
                Suppliers
              </Link>
              <Link href="/impact-reports" className="footer-link hover:text-white/90">
                Impact Reports
              </Link>
            </div>
          </div>
        </nav>

        <div className="hidden xl:block xl:flex-1" />

        <div className="mt-12 h-px w-full bg-white/20 md:my-6 xl:my-2" />

        <div className="hidden xl:block xl:flex-1" />

        <div className="grid gap-10 pb-20 pt-8 md:grid-cols-2 md:gap-x-12 md:py-24 lg:grid-cols-12 lg:items-start lg:gap-x-16 lg:py-20 xl:py-24">
          <div className="grid min-w-0 gap-10 md:col-span-2 lg:col-span-9 lg:grid-cols-3 lg:gap-x-16">
            <div className="min-w-0">
              <Link href="/" className="inline-flex items-start">
                <BrandLogo className="h-12 w-[210px] sm:h-12 sm:w-[240px]" />
              </Link>
            </div>

            <div className="min-w-0">
              <div className="flex flex-col gap-2 text-base font-semibold leading-6 text-white/90 sm:text-lg sm:leading-7">
                {phoneParts.map((p) => (
                  <a
                    key={p}
                    className="footer-link block break-words hover:text-white"
                    href={`tel:${p.replace(/\s+/g, '')}`}
                  >
                    {p}
                  </a>
                ))}
                <a className="footer-link block break-words hover:text-white" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </div>
            </div>

            <div className="min-w-0">
              <nav className="flex flex-col gap-5 text-sm font-semibold text-white/90 md:text-[15px]" aria-label="legal navigation">
                <Link className="footer-link hover:text-white" href="/privacy-policy">
                  Privacy Policy
                </Link>
                <Link className="footer-link hover:text-white" href="/terms-of-use">
                  Terms of Use
                </Link>
              </nav>
            </div>
          </div>

          <div className="min-w-0 md:col-span-2 lg:col-span-12">
            <div className="flex w-full items-center justify-center gap-3 md:justify-end">
              <a
                className="inline-flex aspect-square h-11 w-11 shrink-0 items-center justify-center overflow-hidden !rounded-full bg-white text-brand-blueDark transition-all duration-200 hover:bg-white hover:text-brand-orange hover:shadow-[0_0_28px_rgba(246,127,36,0.65)] hover:ring-4 hover:ring-brand-orange/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/25"
                style={{ borderRadius: 9999, clipPath: 'circle(50% at 50% 50%)' }}
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3c0-2.6-1.4-3.8-3.3-3.8-1.5 0-2.2.8-2.6 1.4v-1.2H10v8.9h2.6v-5c0-1.3.2-2.5 1.8-2.5s1.6 1.5 1.6 2.6v4.9h2.5zM7.9 8.4c.9 0 1.6-.7 1.6-1.6S8.8 5.2 7.9 5.2s-1.6.7-1.6 1.6.7 1.6 1.6 1.6zM9.2 18.5V9.6H6.6v8.9h2.6z" />
                  </svg>
              </a>
              <a
                className="inline-flex aspect-square h-11 w-11 shrink-0 items-center justify-center overflow-hidden !rounded-full bg-white text-brand-blueDark transition-all duration-200 hover:bg-white hover:text-brand-orange hover:shadow-[0_0_28px_rgba(246,127,36,0.65)] hover:ring-4 hover:ring-brand-orange/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/25"
                style={{ borderRadius: 9999, clipPath: 'circle(50% at 50% 50%)' }}
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H8v3h2.7v8h2.8z" />
                </svg>
              </a>
              <a
                className="inline-flex aspect-square h-11 w-11 shrink-0 items-center justify-center overflow-hidden !rounded-full bg-white text-brand-blueDark transition-all duration-200 hover:bg-white hover:text-brand-orange hover:shadow-[0_0_28px_rgba(246,127,36,0.65)] hover:ring-4 hover:ring-brand-orange/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/25"
                style={{ borderRadius: 9999, clipPath: 'circle(50% at 50% 50%)' }}
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M18.9 2H22l-6.8 7.8L23 22h-6.6l-5.1-6.7L5.7 22H2.6l7.3-8.4L1 2h6.8l4.6 6.1L18.9 2zm-1.2 18h1.7L6.9 3.9H5.1L17.7 20z" />
                </svg>
              </a>
              <a
                className="inline-flex aspect-square h-11 w-11 shrink-0 items-center justify-center overflow-hidden !rounded-full bg-white text-brand-blueDark transition-all duration-200 hover:bg-white hover:text-brand-orange hover:shadow-[0_0_28px_rgba(246,127,36,0.65)] hover:ring-4 hover:ring-brand-orange/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/25"
                style={{ borderRadius: 9999, clipPath: 'circle(50% at 50% 50%)' }}
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M21.6 7.2c.2 1 .4 2.4.4 4.8s-.2 3.8-.4 4.8c-.2 1.1-.9 1.9-1.9 2.2-1.6.5-7.7.5-7.7.5s-6.1 0-7.7-.5c-1-.3-1.7-1.1-1.9-2.2C2.2 15.8 2 14.4 2 12s.2-3.8.4-4.8c.2-1.1.9-1.9 1.9-2.2C5.9 4.5 12 4.5 12 4.5s6.1 0 7.7.5c1 .3 1.7 1.1 1.9 2.2zM10 15.5 16 12l-6-3.5v7z" />
                </svg>
              </a>
            </div>

            <p className="mt-8 text-left text-xs font-semibold text-white/85">© {new Date().getFullYear()} {site.name}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
