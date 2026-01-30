import { NextResponse } from 'next/server';

function getRequiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const isHttps = url.protocol === 'https:';

  const expectedState = request.headers
    .get('cookie')
    ?.split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith('decap_oauth_state='))
    ?.split('=')[1];

  if (!code || !state || !expectedState || state !== expectedState) {
    return new NextResponse('Invalid OAuth state.', { status: 400 });
  }

  const clientId = getRequiredEnv('GITHUB_CLIENT_ID');
  const clientSecret = getRequiredEnv('GITHUB_CLIENT_SECRET');

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code
    })
  });

  if (!tokenRes.ok) {
    return new NextResponse('Failed to exchange code for token.', { status: 500 });
  }

  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  const token = tokenJson.access_token;

  if (!token) {
    return new NextResponse('No access token returned from GitHub.', { status: 500 });
  }

  const html = `<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function () {
        var token = ${JSON.stringify(token)};
        var targetOrigin = window.location.origin;
        if (window.opener) {
          window.opener.postMessage('authorization:github:' + token, targetOrigin);
          window.close();
        } else {
          document.body.innerText = 'Authorization complete. You can close this window.';
        }
      })();
    </script>
  </body>
</html>`;

  const res = new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });

  res.cookies.set('decap_oauth_state', '', {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  return res;
}
