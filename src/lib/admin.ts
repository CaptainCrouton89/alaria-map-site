import { createHash } from 'crypto';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE } from './admin-cookie';

// Single hardcoded admin password. Override via the ADMIN_PASSWORD env var in
// production (set it in the host dashboard). This is deliberately low-security —
// it gates the relationship overlay and the local pinning endpoints, nothing secret.
const PASSWORD = process.env.ADMIN_PASSWORD || 'alaria-gm';

// The cookie stores a sha256 of the password, never the password itself. The token
// can't be forged without knowing the password (sha256 is preimage-resistant), so a
// non-httpOnly cookie is fine: the client can read it to show/hide UI, while the
// server validates the value before honoring any admin endpoint.
export const ADMIN_TOKEN = createHash('sha256').update(PASSWORD).digest('hex');

export function verifyPassword(password: string): boolean {
  if (typeof password !== 'string' || !password) return false;
  return createHash('sha256').update(password).digest('hex') === ADMIN_TOKEN;
}

export function isAdmin(request: NextRequest): boolean {
  return request.cookies.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;
}

export { ADMIN_COOKIE };
