import { cookies, draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || url.searchParams.get('redirect') || '/';
  const dm = await draftMode();
  if (!dm.isEnabled) dm.enable();

  const isSecure = process.env.NODE_ENV === 'production';
  const cookieStore = await cookies();
  const bypass = cookieStore.get('__prerender_bypass');

  cookieStore.set({
    name: '__prerender_bypass',
    value: bypass?.value ?? '',
    httpOnly: true,
    path: '/',
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax'
  });

  return NextResponse.redirect(new URL(redirectTo, url.origin));
}
