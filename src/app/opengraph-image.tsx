import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const logoUrl = new URL('/brand/logo.png', process.env.NEXT_PUBLIC_SITE_URL || 'https://rikonim.com');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff'
        }}
      >
        <img
          src={logoUrl.toString()}
          alt="Rikonim Enterprise"
          width={1000}
          height={260}
          style={{
            objectFit: 'contain'
          }}
        />
      </div>
    ),
    size
  );
}
