import { NextResponse } from 'next/server';

function getRequiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function randomState() {
  return crypto.randomUUID();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const isHttps = url.protocol === 'https:';

  const clientId = getRequiredEnv('GITHUB_CLIENT_ID');
  const state = randomState();

  const redirectUri = `${origin}/api/callback`;

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
}
