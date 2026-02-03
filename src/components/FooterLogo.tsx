'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  className?: string;
  alt?: string;
};

function isNearWhite(r: number, g: number, b: number, a: number) {
  return a > 0 && r >= 245 && g >= 245 && b >= 245;
}

export function FooterLogo({ className = '', alt = 'Rikonim Enterprise' }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  const originalSrc = useMemo(() => '/brand/logo.png', []);

  useEffect(() => {
    let cancelled = false;

    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = originalSrc;

    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        if (!w || !h) return;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        const visited = new Uint8Array(w * h);
        const queue = new Uint32Array(w * h);
        let qStart = 0;
        let qEnd = 0;

        const push = (x: number, y: number) => {
          const idx = y * w + x;
          if (visited[idx]) return;
          const o = idx * 4;
          if (!isNearWhite(data[o], data[o + 1], data[o + 2], data[o + 3])) return;
          visited[idx] = 1;
          queue[qEnd++] = idx;
        };

        for (let x = 0; x < w; x++) {
          push(x, 0);
          push(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          push(0, y);
          push(w - 1, y);
        }

        while (qStart < qEnd) {
          const idx = queue[qStart++];
          const o = idx * 4;

          data[o + 3] = 0;

          const x = idx % w;
          const y = (idx - x) / w;

          if (x > 0) push(x - 1, y);
          if (x < w - 1) push(x + 1, y);
          if (y > 0) push(x, y - 1);
          if (y < h - 1) push(x, y + 1);
        }

        ctx.putImageData(imageData, 0, 0);
        const nextSrc = canvas.toDataURL('image/png');
        if (cancelled) return;
        setSrc(nextSrc);
      } catch {
      }
    };

    return () => {
      cancelled = true;
    };
  }, [originalSrc]);

  return (
    <div className={`relative ${className}`.trim()}>
      <img
        src={src ?? originalSrc}
        alt={alt}
        className="h-full w-full object-contain object-left drop-shadow-[0_1px_10px_rgba(255,255,255,0.18)]"
      />
    </div>
  );
}
