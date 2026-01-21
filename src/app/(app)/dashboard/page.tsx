'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createSPASassClient } from '@/lib/supabase/client';

type AiSystem = {
  id: string;
  name: string | null;
  created_at: string | null;
  status?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [systems, setSystems] = useState<AiSystem[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSystems, setLoadingSystems] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [packagesCount, setPackagesCount] = useState<number | null>(null);
  const [loadingPackages, setLoadingPackages] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const client = await createSPASassClient();
        const supabase = client.getSupabaseClient();

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (!data.user) {
          router.replace('/auth/login');
          return;
        }

        if (!cancelled) setEmail(data.user.email ?? null);

        if (!cancelled) setLoadingSystems(true);
        const { data: systemsData, error: systemsError } = await supabase
          .from('ai_systems')
          .select('id,name,created_at,status')
          .order('created_at', { ascending: false });

        if (systemsError) throw systemsError;
        if (!cancelled) setSystems(systemsData || []);

        // ✅ compliance_packages count (uses RLS, so it will be tenant-safe)
        if (!cancelled) setLoadingPackages(true);
        const { count, error: countError } = await supabase
          .from('compliance_packages')
          .select('id', { count: 'exact', head: true });

        if (countError) throw countError;
        if (!cancelled) setPackagesCount(count ?? 0);
      } catch (e: any) {
        console.error(e);
        if (!cancelled) setStatus(e?.message || String(e));
      } finally {
        if (!cancelled) {
          setLoadingUser(false);
          setLoadingSystems(false);
          setLoadingPackages(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function formatDate(value: string | null): string {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString();
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 8,
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 4 }}>Dashboard</h1>
      </div>

      {email && (
        <p style={{ marginBottom: 20, fontSize: 14, opacity: 0.8 }}>
          Signed in as <strong>{email}</strong>
        </p>
      )}

      {/* ✅ PRIMARY ACTION */}
      <div style={{ marginBottom: 22 }}>
        <Link
          href="/compliance/new"
          style={{
            display: 'inline-block',
            padding: '12px 18px',
            borderRadius: 10,
            border: '1px solid #5b21b6',
            background: '#6d28d9',
            color: 'white',
            fontSize: 16,
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Generate compliance certificate
        </Link>
      </div>

      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ fontSize: 12, textTransform: 'uppercase', opacity: 0.7 }}>
            AI systems
          </div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>
            {loadingSystems ? '—' : systems.length}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, textTransform: 'uppercase', opacity: 0.7 }}>
            Compliance packages
          </div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>
            {loadingPackages ? '—' : packagesCount ?? 0}
          </div>
        </div>
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 20, margin: 0 }}>Your AI systems</h2>

          {/* secondary action */}
          <Link
            href="/ai-systems/new"
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid #ddd',
              background: 'white',
              color: '#111',
              fontSize: 14,
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            + Add AI system
          </Link>
        </div>

        {loadingUser || loadingSystems ? (
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              border: '1px solid #eee',
              background: '#fafafa',
              fontSize: 14,
            }}
          >
            Loading…
          </div>
        ) : systems.length === 0 ? (
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              border: '1px dashed #ddd',
              background: '#fafafa',
              fontSize: 14,
            }}
          >
            No AI systems yet. Click <strong>Generate compliance certificate</strong>{' '}
            to start.
          </div>
        ) : (
          <div
            style={{
              borderRadius: 8,
              border: '1px solid #eee',
              overflow: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
              }}
            >
              <thead style={{ background: '#fafafa' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Created</th>
                </tr>
              </thead>

              <tbody>
                {systems.map((s) => (
                  <tr key={s.id}>
                    <td style={{ padding: '10px 12px', borderTop: '1px solid #eee' }}>
                      <Link
                        href={`/ai-systems/${s.id}`}
                        style={{ color: '#000', textDecoration: 'underline' }}
                      >
                        {s.name || '(unnamed system)'}
                      </Link>
                    </td>

                    <td style={{ padding: '10px 12px', borderTop: '1px solid #eee' }}>
                      {s.status || 'Draft'}
                    </td>

                    <td style={{ padding: '10px 12px', borderTop: '1px solid #eee' }}>
                      {formatDate(s.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {status && (
          <p style={{ marginTop: 12, color: 'red', fontSize: 14 }}>{status}</p>
        )}
      </section>
    </main>
  );
}
