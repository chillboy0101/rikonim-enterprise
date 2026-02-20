'use client';

import { usePathname } from 'next/navigation';
import { VisualEditing } from 'next-sanity/visual-editing';
import { useCallback, useState } from 'react';

export function VisualEditingOverlay({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  const isStudio = pathname === '/studio' || pathname.startsWith('/studio/');

  const disable = useCallback(async () => {
    setPending(true);
    try {
      await fetch('/api/draft-mode/disable', { method: 'GET' });
      window.location.reload();
    } finally {
      setPending(false);
    }
  }, []);

  if (!enabled || isStudio) return null;

  return (
    <>
      <VisualEditing />
      <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-3 rounded-full border border-black/10 bg-white/95 px-4 py-2 text-sm text-black shadow-lg">
        <span className="font-semibold">Preview mode</span>
        <button
          type="button"
          onClick={disable}
          disabled={pending}
          className="rounded-full bg-black px-3 py-1 text-white disabled:opacity-60"
        >
          {pending ? 'Disabling…' : 'Disable'}
        </button>
      </div>
    </>
  );
}
