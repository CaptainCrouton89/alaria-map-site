'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MapEdge, EdgeKind } from '@/types/location';
import { EDGE_KINDS } from '@/types/location';

interface AdminPanelProps {
  isAdmin: boolean;
  error: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  edges: MapEdge[];
  visibleEdgeKinds: Set<EdgeKind>;
  toggleEdgeKind: (kind: EdgeKind) => void;
}

export function AdminPanel({
  isAdmin,
  error,
  login,
  logout,
  edges,
  visibleEdgeKinds,
  toggleEdgeKind,
}: AdminPanelProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(password);
    setSubmitting(false);
    if (ok) setPassword('');
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col-reverse items-end gap-2">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Admin panel"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#4d4436] bg-[#2c2416]/90 text-[#9a8f7a] shadow-lg backdrop-blur-sm transition hover:text-[#c9a227]"
      >
        {/* lock / unlock glyph */}
        <span className="text-base leading-none">{isAdmin ? '🔓' : '🔒'}</span>
      </button>
      {open && (
        <div className="w-64 rounded-lg border border-[#4d4436] bg-[#2c2416]/95 p-4 text-[#e8e0d0] shadow-xl backdrop-blur-sm">
          {!isAdmin ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <h3 className="font-display text-sm font-semibold tracking-wide">Admin login</h3>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full rounded border border-[#4d4436] bg-[#1a1612] px-2 py-1.5 text-sm text-[#e8e0d0] outline-none focus:border-[#c9a227]"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting || !password}
                className="w-full rounded bg-[#c9a227] px-3 py-1.5 text-sm font-medium text-[#1a1612] transition hover:bg-[#d9b237] disabled:opacity-50"
              >
                {submitting ? 'Checking…' : 'Sign in'}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold tracking-wide">Relationships</h3>
                <button onClick={logout} className="text-xs text-[#9a8f7a] hover:text-[#c9a227]">
                  Log out
                </button>
              </div>
              <ul className="space-y-2">
                {(Object.keys(EDGE_KINDS) as EdgeKind[]).map((kind) => {
                  const { label, color } = EDGE_KINDS[kind];
                  const count = edges.filter((e) => e.kind === kind).length;
                  const on = visibleEdgeKinds.has(kind);
                  return (
                    <li key={kind}>
                      <label className="flex cursor-pointer items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleEdgeKind(kind)}
                          className="accent-[#c9a227]"
                        />
                        <span
                          className="inline-block h-0.5 w-5 rounded"
                          style={{ background: color, opacity: on ? 1 : 0.3 }}
                        />
                        <span className={on ? '' : 'opacity-50'}>{label}</span>
                        <span className="ml-auto tabular-nums text-[#9a8f7a]">{count}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-[#4d4436] pt-2">
                <Link href="/pin" className="text-xs text-[#9a8f7a] hover:text-[#c9a227]">
                  Pinning tool →
                </Link>
                <p className="mt-1 text-[10px] text-[#9a8f7a]">Hover a line for details</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
