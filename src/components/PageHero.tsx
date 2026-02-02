import { Container } from '@/components/layout/Container';

export function PageHero({
  title,
  subtitle,
  imageUrl,
  videoUrl
}: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  videoUrl?: string;
}) {
  const posterUrl = videoUrl?.startsWith('/videos/')
    ? videoUrl.replace(/\.mp4$/, '.jpg')
    : undefined;

  return (
    <section
      id="page-hero"
      className="relative overflow-hidden pt-[76px] md:pt-[84px]"
    >
      {videoUrl ? (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            poster={posterUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-ink/35 to-brand-ink/80" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(11,18,32,0.18), rgba(11,18,32,0.7)), url('${imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </>
      )}
      <Container className="relative">
        <div className="grid min-h-[70vh] items-end py-14 md:min-h-[80vh] md:py-20">
          <div className="max-w-4xl">
            <h1 className="text-balance text-5xl font-semibold tracking-tightest text-white md:text-6xl lg:text-7xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-6 max-w-prose text-pretty text-lg leading-relaxed text-white/80 md:text-xl lg:text-2xl">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
