import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

function getRequiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(request: Request) {
  try {
    const secretKey = getRequiredEnv('JOTFORM_AGENT_SECRET_KEY');

    const body = (await request.json().catch(() => null)) as null | {
      userID?: unknown;
    };

    const userID = typeof body?.userID === 'string' ? body.userID.trim() : '';
    if (!userID) {
      return NextResponse.json({ error: 'Missing userID' }, { status: 400 });
    }

    const userHash = crypto.createHmac('sha256', secretKey).update(userID).digest('hex');

    return NextResponse.json({ userHash });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
