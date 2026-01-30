import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string;
  startedAt?: number;
  token?: string;
};

declare global {
  var __rikonimContactRate__: Map<string, number[]> | undefined;
}

function getRateMap() {
  if (!globalThis.__rikonimContactRate__) {
    globalThis.__rikonimContactRate__ = new Map();
  }
  return globalThis.__rikonimContactRate__;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token })
  });

  if (!res.ok) return false;
  const json = (await res.json()) as { success?: boolean };
  return Boolean(json.success);
}

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subject = String(body.subject ?? '').trim();
  const message = String(body.message ?? '').trim();
  const company = String(body.company ?? '').trim();
  const startedAt = typeof body.startedAt === 'number' ? body.startedAt : undefined;
  const token = String(body.token ?? '').trim();

  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  if (name.length > 120 || email.length > 200 || subject.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: 'Message too long.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }

  if (startedAt && Date.now() - startedAt < 1500) {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = `ip:${ip}`;
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 6;

  const rate = getRateMap();
  const events = (rate.get(key) ?? []).filter((t) => now - t < windowMs);
  if (events.length >= max) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }
  events.push(now);
  rate.set(key, events);

  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!token) {
      return NextResponse.json({ error: 'Verification required.' }, { status: 400 });
    }

    const ok = await verifyTurnstile(token);
    if (!ok) {
      return NextResponse.json({ error: 'Verification failed.' }, { status: 400 });
    }
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  const to = process.env.CONTACT_TO;

  if (!host || !port || !from || !to) {
    return NextResponse.json(
      { error: 'Email delivery is not configured on the server.' },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined
  });

  const composedSubject = subject ? `${subject} — Website enquiry` : 'Website enquiry';

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: composedSubject,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });
  } catch {
    return NextResponse.json({ error: 'Message failed to send.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
