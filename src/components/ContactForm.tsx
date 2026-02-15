'use client';

import Script from 'next/script';
import { useEffect, useMemo, useRef, useState } from 'react';

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent' }
  | { state: 'error'; message: string };

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState<'individual' | 'company'>('individual');
  const [companyName, setCompanyName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const startedAt = useMemo(() => Date.now(), []);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const canSend =
    name.trim() &&
    email.trim() &&
    message.trim() &&
    (enquiryType === 'company' ? companyName.trim() : true) &&
    (siteKey ? Boolean(turnstileToken) : true);

  useEffect(() => {
    if (!siteKey) return;
    if (typeof window === 'undefined') return;
    if (!turnstileRef.current) return;

    const w = window as unknown as {
      turnstile?: {
        render: (
          el: HTMLElement,
          options: {
            sitekey: string;
            callback: (token: string) => void;
            'error-callback'?: () => void;
            'expired-callback'?: () => void;
          }
        ) => string;
        reset: (id: string) => void;
      };
    };

    if (!w.turnstile) return;
    if (turnstileWidgetIdRef.current) return;

    const widgetId = w.turnstile.render(turnstileRef.current, {
      sitekey: siteKey,
      callback: (token: string) => setTurnstileToken(token),
      'error-callback': () => setTurnstileToken(''),
      'expired-callback': () => setTurnstileToken('')
    });

    turnstileWidgetIdRef.current = widgetId;
  }, [siteKey]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSend) return;

    setStatus({ state: 'sending' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          enquiryType,
          companyName,
          subject,
          message,
          company,
          startedAt,
          token: turnstileToken
        })
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setStatus({
          state: 'error',
          message: json?.error ? String(json.error) : 'Message failed to send.'
        });
        return;
      }

      setStatus({ state: 'sent' });
      setName('');
      setEmail('');
      setEnquiryType('individual');
      setCompanyName('');
      setSubject('');
      setMessage('');
      setCompany('');
      setTurnstileToken('');

      const w = window as unknown as { turnstile?: { reset: (id: string) => void } };
      if (turnstileWidgetIdRef.current && w.turnstile) {
        w.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } catch {
      setStatus({ state: 'error', message: 'Message failed to send.' });
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {siteKey ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full border border-brand-ink/15 bg-white px-4 text-sm font-semibold text-brand-ink placeholder:text-brand-steel/60 focus:border-brand-orange focus:outline-none"
            placeholder="Your name"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="h-12 w-full border border-brand-ink/15 bg-white px-4 text-sm font-semibold text-brand-ink placeholder:text-brand-steel/60 focus:border-brand-orange focus:outline-none"
            placeholder="name@email.com"
            required
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Subject</span>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-12 w-full border border-brand-ink/15 bg-white px-4 text-sm font-semibold text-brand-ink placeholder:text-brand-steel/60 focus:border-brand-orange focus:outline-none"
          placeholder="Project enquiry"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Enquiry type</span>
          <select
            value={enquiryType}
            onChange={(e) => {
              const next = e.target.value === 'company' ? 'company' : 'individual';
              setEnquiryType(next);
              if (next !== 'company') setCompanyName('');
            }}
            className="h-12 w-full border border-brand-ink/15 bg-white px-4 text-sm font-semibold text-brand-ink focus:border-brand-orange focus:outline-none"
          >
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </label>

        {enquiryType === 'company' ? (
          <label className="grid gap-2">
            <span className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Company name</span>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-12 w-full border border-brand-ink/15 bg-white px-4 text-sm font-semibold text-brand-ink placeholder:text-brand-steel/60 focus:border-brand-orange focus:outline-none"
              placeholder="Your company name"
              required
            />
          </label>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      <label className="grid gap-2">
        <span className="text-xs font-semibold tracking-[0.14em] text-brand-steel">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[140px] w-full resize-y border border-brand-ink/15 bg-white px-4 py-3 text-sm font-semibold text-brand-ink placeholder:text-brand-steel/60 focus:border-brand-orange focus:outline-none"
          placeholder="Tell us about your project, location, and timeline."
          required
        />
      </label>

      {siteKey ? <div ref={turnstileRef} /> : null}

      <div className="hidden">
        <label>
          <span>Company</span>
          <input value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={!canSend || status.state === 'sending'}
          className="inline-flex items-center justify-center rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status.state === 'sending' ? 'Sending…' : 'Send message'}
        </button>

        {status.state === 'sent' ? (
          <p className="text-sm font-semibold text-brand-ink">Message sent.</p>
        ) : null}

        {status.state === 'error' ? (
          <p className="text-sm font-semibold text-brand-ink">{status.message}</p>
        ) : null}
      </div>
    </form>
  );
}
