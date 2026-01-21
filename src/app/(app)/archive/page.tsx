'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createSPASassClient } from '@/lib/supabase/client';

type ArchiveRow = {
  id: string;
  ai_system_id: string;
  generated_at: string | null;
  status: string | null;
  package_version: string | null;
  pdf_url: string | null;
  json_url: string | null;
  pdf_name: string | null;
  // joined
  ai_system_name?: string | null;
};

export default function ArchivePage() {
  const [rows, setRows] = useState<ArchiveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | 'ready' | 'generating' | 'failed'>('all');
  const [sort, setSort] = useState<'generated_desc' | 'generated_asc' | 'name_asc' | 'name_desc'>('generated_desc');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const client = await createSPASassClient();
        const supabase = client.getSupabaseClient();

        // NOTE: this assumes you have a FK from compliance_packages.ai_system_id -> ai_systems.id
        const { data, error } = await supabase
          .from('compliance_packages')
          .select(
            `
            id,
            ai_system_id,
            generated_at,
            status,
            package_version,
            pdf_url,
            json_url,
            pdf_name,
            ai_systems:ai_system_id (
              name
            )
          `,
          )
          .order('generated_at', { ascending: false });

        if (error) throw error;

        const mapped: ArchiveRow[] =
          (data ?? []).map((r: any) => ({
            id: r.id,
            ai_system_id: r.ai_system_id,
            generated_at: r.generated_at,
            status: r.status,
            package_version: r.package_version,
            pdf_url: r.pdf_url,
            json_url: r.json_url,
            pdf_name: r.pdf_name,
            ai_system_name: r.ai_systems?.name ?? null,
          })) ?? [];

        if (!cancelled) setRows(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load archive');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();

    let out = rows;

    if (status !== 'all') out = out.filter((r) => (r.status ?? '').toLowerCase() === status);

    if (qq) {
      out = out.filter((r) => {
        const name = (r.ai_system_name ?? '').toLowerCase();
        const pdf = (r.pdf_name ?? '').toLowerCase();
        const ver = (r.package_version ?? '').toLowerCase();
        return name.includes(qq) || pdf.includes(qq) || ver.includes(qq);
      });
    }

    const byDate = (a: ArchiveRow, b: ArchiveRow) =>
      (a.generated_at ? new Date(a.generated_at).getTime() : 0) - (b.generated_at ? new Date(b.generated_at).getTime() : 0);

    const byName = (a: ArchiveRow, b: ArchiveRow) => (a.ai_system_name ?? '').localeCompare(b.ai_system_name ?? '');

    switch (sort) {
      case 'generated_asc':
        return [...out].sort(byDate);
      case 'generated_desc':
        return [...out].sort((a, b) => byDate(b, a));
      case 'name_asc':
        return [...out].sort(byName);
      case 'name_desc':
        return [...out].sort((a, b) => byName(b, a));
      default:
        return out;
    }
  }, [rows, q, status, sort]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Archive</h1>
          <p className="text-sm text-muted-foreground">All generated compliance packages across all AI systems.</p>
        </div>

        <Link
          href="/dashboard"
          className="rounded-xl border px-4 py-2 text-sm hover:bg-muted"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search system, PDF name, version..."
          className="md:col-span-2 rounded-xl border bg-background px-3 py-2 text-sm"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="rounded-xl border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="ready">Ready</option>
          <option value="generating">Generating</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="rounded-xl border bg-background px-3 py-2 text-sm"
        >
          <option value="generated_desc">Date: newest</option>
          <option value="generated_asc">Date: oldest</option>
          <option value="name_asc">System: A–Z</option>
          <option value="name_desc">System: Z–A</option>
        </select>
      </div>

      <div className="mt-6 rounded-2xl border">
        <div className="grid grid-cols-12 gap-3 border-b px-4 py-3 text-xs font-medium text-muted-foreground">
          <div className="col-span-4">AI system</div>
          <div className="col-span-2">Generated</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Version</div>
          <div className="col-span-2 text-right">Files</div>
        </div>

        {loading && <div className="px-4 py-6 text-sm">Loading…</div>}
        {!loading && error && <div className="px-4 py-6 text-sm text-red-500">{error}</div>}
        {!loading && !error && filtered.length === 0 && <div className="px-4 py-6 text-sm">No packages found.</div>}

        {!loading &&
          !error &&
          filtered.map((r) => (
            <div key={r.id} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm border-b last:border-b-0">
              <div className="col-span-4">
                <div className="font-medium">{r.ai_system_name ?? 'Unnamed system'}</div>
                <div className="text-xs text-muted-foreground">{r.pdf_name ?? ''}</div>
              </div>

              <div className="col-span-2 text-xs text-muted-foreground">
                {r.generated_at ? new Date(r.generated_at).toLocaleString() : '—'}
              </div>

              <div className="col-span-2">
                <span className="rounded-full border px-2 py-1 text-xs">
                  {(r.status ?? '—').toUpperCase()}
                </span>
              </div>

              <div className="col-span-2 text-xs text-muted-foreground">{r.package_version ?? '—'}</div>

              <div className="col-span-2 flex items-center justify-end gap-2">
                {r.pdf_url ? (
                  <a className="rounded-xl border px-3 py-1 text-xs hover:bg-muted" href={r.pdf_url} target="_blank" rel="noreferrer">
                    PDF
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">PDF —</span>
                )}
                {r.json_url ? (
                  <a className="rounded-xl border px-3 py-1 text-xs hover:bg-muted" href={r.json_url} target="_blank" rel="noreferrer">
                    JSON
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">JSON —</span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
