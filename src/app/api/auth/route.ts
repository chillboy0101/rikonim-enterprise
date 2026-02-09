import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/siteUrl';

function getRequiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function randomState() {
  return crypto.randomUUID();
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const siteUrl = getSiteUrl();
    const siteOrigin = new URL(siteUrl).origin;

    if (url.origin !== siteOrigin) {
      return NextResponse.redirect(`${siteOrigin}${url.pathname}${url.search}`);
    }

    const isHttps = siteOrigin.startsWith('https:');

    const clientId = getRequiredEnv('GITHUB_CLIENT_ID');
    const state = randomState();

    const redirectUri = `${siteOrigin}/api/callback`;

    const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
    authorizeUrl.searchParams.set('client_id', clientId);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('scope', 'repo');
    authorizeUrl.searchParams.set('state', state);

    const res = NextResponse.redirect(authorizeUrl.toString());
    res.cookies.set('decap_oauth_state', state, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/'
    });

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new NextResponse(`Decap CMS auth misconfigured: ${message}`, {
      status: 500
    });
  }
}
