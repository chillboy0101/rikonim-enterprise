import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin"'
    }
  });
}

export function proxy(request: NextRequest) {
  const user = process.env.CMS_ADMIN_USER;
  const pass = process.env.CMS_ADMIN_PASS;

  if (!user || !pass) {
    return new NextResponse('CMS admin credentials are not configured.', { status: 500 });
  }

  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return unauthorized();
  }

  let decoded = '';
  try {
    decoded = Buffer.from(auth.slice('Basic '.length), 'base64').toString('utf8');
  } catch {
    return unauthorized();
  }

  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return unauthorized();
  }

  const providedUser = decoded.slice(0, separatorIndex);
  const providedPass = decoded.slice(separatorIndex + 1);

  if (providedUser !== user || providedPass !== pass) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
