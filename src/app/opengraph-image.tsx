import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A4C86 0%, #0B1220 65%)',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, rgba(227,106,27,0.35), transparent 55%), radial-gradient(circle at 85% 35%, rgba(255,255,255,0.12), transparent 55%)'
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            padding: 72,
            width: '100%'
          }}
        >
          <div style={{ fontSize: 62, fontWeight: 700, color: 'white' }}>
            RIKONIM ENTERPRISE
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '0.10em',
              color: 'rgba(255,255,255,0.86)'
            }}
          >
            Building & Civil Engineering Company
          </div>
        </div>
      </div>
    ),
    size
  );
}
