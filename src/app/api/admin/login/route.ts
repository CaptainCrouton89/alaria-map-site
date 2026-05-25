import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_TOKEN, verifyPassword } from '@/lib/admin';

// POST { password } — sets the admin cookie when the password matches.
export async function POST(request: NextRequest) {
  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid body' }, { status: 400 });
  }

  if (typeof password !== 'string' || !verifyPassword(password)) {
    return NextResponse.json({ ok: false, error: 'wrong password' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, ADMIN_TOKEN, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false, // client reads presence to show/hide admin UI; value is a hash, not the password
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}
