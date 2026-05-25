'use client';

import { useCallback, useEffect, useState } from 'react';
import { ADMIN_COOKIE } from '@/lib/admin-cookie';

function hasAdminCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.startsWith(`${ADMIN_COOKIE}=`) && c.length > ADMIN_COOKIE.length + 1);
}

/**
 * Client-side admin state. Initialized from the (non-httpOnly) admin cookie so the
 * UI can show/hide without a network round-trip. The cookie value is validated
 * server-side before any admin endpoint acts, so this is purely cosmetic gating.
 */
export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsAdmin(hasAdminCookie());
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError('Incorrect password');
        return false;
      }
      setIsAdmin(true);
      return true;
    } catch {
      setError('Login failed');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setIsAdmin(false);
    }
  }, []);

  return { isAdmin, error, login, logout };
}
