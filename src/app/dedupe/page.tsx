'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AuditGroup, DedupeDecision, MergeGroup, PinnedLocation } from '@/types/pinning';
import { Button } from '@/components/ui/button';

type FilterKind = 'needs-review' | 'multi-pinned' | 'auto-merge' | 'auto-distinct' | 'all';

interface Stats {
  total: number;
  decided: number;
  pending: number;
  byVerdict: Record<string, number>;
  multiPinned: number;
  filteredTotal: number;
  filteredDecided: number;
  filteredPending: number;
}

interface ApiState {
  filter: FilterKind;
  currentGroup: AuditGroup | null;
  decision: DedupeDecision | null;
  pinnedCoords: Record<string, PinnedLocation>;
  stats: Stats;
}

const FILTERS: Array<{ key: FilterKind; label: string }> = [
  { key: 'needs-review', label: 'Needs review' },
  { key: 'multi-pinned', label: 'Multi-pinned' },
  { key: 'auto-merge', label: 'Auto-merge' },
  { key: 'auto-distinct', label: 'Auto-distinct' },
  { key: 'all', label: 'All' },
];

export default function DedupePage() {
  const [filter, setFilter] = useState<FilterKind>('needs-review');
  const [state, setState] = useState<ApiState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local UI state for the current group's selection workflow
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [primaryId, setPrimaryId] = useState<string | null>(null);
  const [pendingMergeGroups, setPendingMergeGroups] = useState<MergeGroup[]>([]);
  const [note, setNote] = useState('');

  const resetLocal = () => {
    setSelectedIds(new Set());
    setPrimaryId(null);
    setPendingMergeGroups([]);
    setNote('');
  };

  const fetchState = useCallback(async (nextFilter: FilterKind) => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/dedupe?filter=${nextFilter}`);
    if (!res.ok) {
      setError(`API error: ${res.status}`);
      setLoading(false);
      return;
    }
    const data: ApiState = await res.json();
    setState(data);
    resetLocal();
    // Pre-load existing decision if any
    if (data.decision) {
      setPendingMergeGroups(data.decision.mergeGroups);
      setNote(typeof data.decision.note === 'string' ? data.decision.note : '');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchState(filter);
  }, [filter, fetchState]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (primaryId === id) setPrimaryId(null);
      } else {
        next.add(id);
        if (primaryId === null) setPrimaryId(id);
      }
      return next;
    });
  };

  const handleSetPrimary = (id: string) => {
    if (!selectedIds.has(id)) {
      setSelectedIds(prev => new Set(prev).add(id));
    }
    setPrimaryId(id);
  };

  const isMemberInPending = (id: string) =>
    pendingMergeGroups.some(g => g.memberIds.includes(id));

  const unassignedMembers = (group: AuditGroup) =>
    group.members.filter(m => !isMemberInPending(m.id));

  const handleAddMergeGroup = () => {
    if (selectedIds.size < 2 || !primaryId) return;
    const ids = [...selectedIds];
    setPendingMergeGroups(prev => [...prev, { memberIds: ids, primaryId }]);
    setSelectedIds(new Set());
    setPrimaryId(null);
  };

  const handleRemoveMergeGroup = (idx: number) => {
    setPendingMergeGroups(prev => prev.filter((_, i) => i !== idx));
  };

  const submitDecision = async (
    type: DedupeDecision['type'],
    mergeGroups: MergeGroup[],
    distinctMemberIds: string[]
  ) => {
    if (!state?.currentGroup) return;
    setLoading(true);
    const res = await fetch('/api/dedupe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        normalizedName: state.currentGroup.normalizedName,
        type,
        mergeGroups,
        distinctMemberIds,
        note: note.trim().length > 0 ? note.trim() : undefined,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Submit failed');
      setLoading(false);
      return;
    }
    await fetchState(filter);
  };

  const handleSaveDecision = () => {
    if (!state?.currentGroup) return;
    const remaining = unassignedMembers(state.currentGroup).map(m => m.id);
    let type: DedupeDecision['type'];
    if (pendingMergeGroups.length === 0) {
      type = 'all-distinct';
    } else if (pendingMergeGroups.length === 1 && remaining.length === 0) {
      type = 'merge-all';
    } else {
      type = 'merge-subset';
    }
    submitDecision(type, pendingMergeGroups, remaining);
  };

  const handleQuickMergeAll = () => {
    if (!state?.currentGroup) return;
    if (!primaryId) {
      setError('Pick a primary member first (click "Make primary" on one card).');
      return;
    }
    const ids = state.currentGroup.members.map(m => m.id);
    if (!ids.includes(primaryId)) {
      setError('Selected primary is not in the group.');
      return;
    }
    submitDecision('merge-all', [{ memberIds: ids, primaryId }], []);
  };

  const handleQuickAllDistinct = () => {
    if (!state?.currentGroup) return;
    submitDecision('all-distinct', [], state.currentGroup.members.map(m => m.id));
  };

  const handleSkip = () => {
    fetchState(filter); // skip locally; reload to get the next group (won't change since no decision recorded)
    // To actually skip, we'd need a server-side cursor. For now this just resets the form.
  };

  const handleUndo = async () => {
    if (!state?.currentGroup || !state.decision) return;
    setLoading(true);
    const res = await fetch('/api/dedupe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ normalizedName: state.currentGroup.normalizedName }),
    });
    if (!res.ok) {
      setError('Undo failed');
      setLoading(false);
      return;
    }
    await fetchState(filter);
  };

  if (loading && !state) {
    return <div className="p-8 text-ink-muted">Loading…</div>;
  }
  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }
  if (!state) return null;

  const { currentGroup, stats, pinnedCoords, decision } = state;

  return (
    <div className="min-h-screen bg-parchment p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-semibold text-ink">Dedupe Review</h1>
          <a href="/pin" className="text-sm text-ink-muted hover:text-ink">← Back to /pin</a>
        </div>

        {/* Stats + filter */}
        <div className="bg-parchment-light border border-border rounded p-3 mb-4 flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm text-ink-muted">
            <span className="font-medium text-ink">
              {stats.filteredDecided} / {stats.filteredTotal}
            </span>{' '}
            decided in this filter ·{' '}
            <span>{stats.decided} / {stats.total} total</span> ·{' '}
            <span>multi-pinned: {stats.multiPinned}</span>
          </div>
          <div className="flex gap-1">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-2 py-1 text-xs rounded border ${
                  filter === f.key
                    ? 'bg-accent-gold text-white border-accent-gold'
                    : 'bg-parchment border-border text-ink-muted hover:border-ink-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {!currentGroup ? (
          <div className="bg-parchment-light border border-border rounded p-8 text-center">
            <p className="text-ink-muted">No groups remaining in &quot;{filter}&quot;.</p>
          </div>
        ) : (
          <>
            {/* Current group header */}
            <div className="bg-parchment-light border border-border rounded p-4 mb-3">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-display text-xl font-semibold text-ink">{currentGroup.displayName}</h2>
                <span
                  className={`px-2 py-0.5 text-xs rounded ${
                    currentGroup.verdict === 'auto-merge'
                      ? 'bg-green-100 text-green-800'
                      : currentGroup.verdict === 'auto-distinct'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {currentGroup.verdict} ({currentGroup.confidence})
                </span>
                {currentGroup.pinnedCount >= 2 && (
                  <span className="px-2 py-0.5 text-xs rounded bg-orange-100 text-orange-800">
                    {currentGroup.pinnedCount} pinned
                  </span>
                )}
                {decision && (
                  <span className="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-800">
                    decided: {decision.type}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-muted">{currentGroup.reason}</p>
              <p className="text-xs text-ink-muted mt-1">
                Normalized name: <code>{currentGroup.normalizedName}</code> · {currentGroup.size} members
              </p>
            </div>

            {/* Member cards */}
            <div className="space-y-2 mb-4">
              {currentGroup.members.map(m => {
                const inPending = isMemberInPending(m.id);
                const inSelection = selectedIds.has(m.id);
                const pin = pinnedCoords[m.id];
                const pendingGroupIdx = pendingMergeGroups.findIndex(g => g.memberIds.includes(m.id));
                const pendingPrimary = pendingMergeGroups[pendingGroupIdx]?.primaryId === m.id;
                return (
                  <div
                    key={m.id}
                    className={`border rounded p-3 ${
                      inPending
                        ? 'bg-green-50 border-green-300 opacity-80'
                        : inSelection
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-parchment-light border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={inSelection || inPending}
                        disabled={inPending}
                        onChange={() => handleToggleSelect(m.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-ink">id={m.id} {m.name}</span>
                          <span className="text-xs text-ink-muted bg-parchment px-1 py-0.5 rounded font-mono">
                            {m.sourceFile.replace('.md', '')}:{m.lineNumber} (L{m.headerLevel})
                          </span>
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            m.status === 'pinned' ? 'bg-blue-100 text-blue-800'
                              : m.status === 'skipped' ? 'bg-gray-200 text-gray-700'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>{m.status}</span>
                          {pin && (
                            <span className="text-xs text-ink-muted font-mono">
                              📌 [{pin.coordinates[0]}, {pin.coordinates[1]}] z{pin.zoomLevel} {pin.type}
                            </span>
                          )}
                          {inPending && (
                            <span className="text-xs px-1 py-0.5 rounded bg-green-200 text-green-900">
                              merge group #{pendingGroupIdx + 1}{pendingPrimary ? ' (primary)' : ''}
                            </span>
                          )}
                          {inSelection && !inPending && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(m.id)}
                              className={`text-xs px-1 py-0.5 rounded border ${
                                primaryId === m.id
                                  ? 'bg-accent-gold text-white border-accent-gold'
                                  : 'border-border text-ink-muted hover:border-ink-muted'
                              }`}
                            >
                              {primaryId === m.id ? 'primary ✓' : 'make primary'}
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-ink-muted mt-1">
                          {m.parentChain.length > 0
                            ? m.parentChain.map(p => p.name).join(' › ')
                            : '(no parent)'}
                        </div>
                        <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                          {m.contentPreview.length > 0 ? m.contentPreview : '(no preview)'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pending merge groups */}
            {pendingMergeGroups.length > 0 && (
              <div className="bg-green-50 border border-green-300 rounded p-3 mb-4">
                <div className="text-xs font-medium text-green-900 mb-2">
                  Pending merge groups (will save when you click Save):
                </div>
                {pendingMergeGroups.map((g, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1">
                    <span>
                      <span className="font-medium">#{i + 1}:</span> primary={g.primaryId},
                      members=[{g.memberIds.join(', ')}]
                    </span>
                    <button
                      onClick={() => handleRemoveMergeGroup(i)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action bar */}
            <div className="bg-parchment-light border border-border rounded p-3 flex flex-wrap gap-2 items-center sticky bottom-2">
              <input
                type="text"
                placeholder="Optional note..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="flex-1 px-2 py-1 text-sm bg-parchment border border-border rounded min-w-[200px]"
              />
              <Button
                variant="outline"
                onClick={handleAddMergeGroup}
                disabled={selectedIds.size < 2 || !primaryId}
                title="Add the currently selected members as a merge group (requires 2+ selected and a primary)"
              >
                Add merge group ({selectedIds.size})
              </Button>
              <Button
                variant="ghost"
                onClick={handleQuickMergeAll}
                disabled={!primaryId}
                title="Treat all members as one merge group with the selected primary"
              >
                Merge all
              </Button>
              <Button
                variant="ghost"
                onClick={handleQuickAllDistinct}
                title="All members are different places that share a name"
              >
                All distinct
              </Button>
              <Button
                variant="accent"
                onClick={handleSaveDecision}
                disabled={
                  pendingMergeGroups.length === 0 &&
                  unassignedMembers(currentGroup).length === currentGroup.members.length
                  // (no merge groups AND no quick-action used → use one of the buttons)
                }
                title="Save: any unassigned members will be marked distinct"
              >
                Save decision
              </Button>
              {decision && (
                <Button variant="ghost" onClick={handleUndo} title="Remove the recorded decision">
                  Undo decision
                </Button>
              )}
              <Button variant="ghost" onClick={handleSkip}>
                Reset form
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
