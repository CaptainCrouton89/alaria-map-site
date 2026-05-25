import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin-cookie';

// POST — clears the admin cookie.
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
