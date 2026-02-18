'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    _jfAgentIdentifiedUser?: {
      metadata?: Record<string, unknown>;
      userID: string;
      userHash: string;
    };
    AgentClientSDK?: { resetUser?: () => void };
  }
}

const JOTFORM_AGENT_EMBED_SRC = 'https://cdn.jotfor.ms/agent/embedjs/019c714ced157ac8a2b644f40415646e667c/embed.js';

function ensureEmbedScript() {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${JOTFORM_AGENT_EMBED_SRC}"]`);
  if (existing) return;

  const s = document.createElement('script');
  s.src = JOTFORM_AGENT_EMBED_SRC;
  s.async = true;
  document.body.appendChild(s);
}

function forceBottomLeft() {
  // Jotform controls left/right via their UI, but we also enforce it defensively.
  // We detect the injected agent container/iframe and flip it to bottom-left.
  const candidates: HTMLElement[] = [];

  document.querySelectorAll<HTMLElement>('iframe, div').forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'iframe') {
      const src = (el as HTMLIFrameElement).src || '';
      if (!src.includes('jotform')) return;
      candidates.push(el);
      return;
    }

    const id = el.id || '';
    const className = typeof el.className === 'string' ? el.className : '';
    const text = `${id} ${className}`.toLowerCase();
    if (text.includes('jotform') || text.includes('jf') || text.includes('agent')) {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        candidates.push(el);
      }
    }
  });

  for (const el of candidates) {
    const target = el.closest<HTMLElement>('div') ?? el;
    // Apply left/bottom and unset right. Use !important via style.setProperty.
    target.style.setProperty('left', '20px', 'important');
    target.style.setProperty('right', 'auto', 'important');
    target.style.setProperty('bottom', '20px', 'important');
  }
}

export function JotformAgentEmbed() {
  useEffect(() => {
    ensureEmbedScript();

    // Try a few times + observe DOM mutations because the embed injects asynchronously.
    const tryFix = () => {
      try {
        forceBottomLeft();
      } catch {
        // ignore
      }
    };

    tryFix();
    const t1 = window.setTimeout(tryFix, 800);
    const t2 = window.setTimeout(tryFix, 2000);

    const observer = new MutationObserver(() => tryFix());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      observer.disconnect();
    };
  }, []);

  return null;
}

export async function identifyJotformAgentUser(input: {
  userID: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch('/api/jotform/user-hash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userID: input.userID })
  });

  if (!res.ok) {
    throw new Error(`Failed to identify user (HTTP ${res.status})`);
  }

  const json = (await res.json()) as { userHash: string };

  window._jfAgentIdentifiedUser = {
    metadata: input.metadata ?? {},
    userID: input.userID,
    userHash: json.userHash
  };
}

export function resetJotformAgentUser() {
  window._jfAgentIdentifiedUser = undefined;
  window.AgentClientSDK?.resetUser?.();
}
