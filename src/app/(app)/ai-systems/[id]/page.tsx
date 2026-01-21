'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createSPASassClient } from '@/lib/supabase/client';

type AiSystem = {
  id: string;
  name: string | null;
  status: string | null;
  created_at: string | null;
};

type PackageRow = {
  id: string;
  pdf_url: string | null;
  json_url: string | null;
  pdf_name: string | null;
  generated_at: string | null;
};

type IntakeRow = {
  id: string;
  ai_system_id: string;
  section: string;
  question_key: string;
  answer_json: any;
  created_at?: string | null;
};

function extractIdFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

export default function AiSystemDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const id = useMemo(() => extractIdFromPath(pathname), [pathname]);

  const [system, setSystem] = useState<AiSystem | null>(null);
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // EU AI Act classification intake
  const [riskClass, setRiskClass] = useState<string>('unknown');
  const [savingClass, setSavingClass] = useState(false);
  const [classSaved, setClassSaved] = useState(false);

  function formatDateTime(value: string | null) {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
  }

  async function loadPackages(aiSystemId: string) {
    setLoadingPackages(true);
    try {
      const res = await fetch(
        `/api/compliance-packages?ai_system_id=${encodeURIComponent(aiSystemId)}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to load packages');
      setPackages(json.rows || []);
    } catch (e: any) {
      setErrorMsg(e?.message || String(e));
    } finally {
      setLoadingPackages(false);
    }
  }

  async function loadClassification(aiSystemId: string) {
    try {
      const client = await createSPASassClient();
      const supabase = client.getSupabaseClient();

      const { data, error } = await supabase
        .from('ai_intake_answers')
        .select('id,ai_system_id,section,question_key,answer_json,created_at')
        .eq('ai_system_id', aiSystemId)
        .eq('section', 'eu_ai_act_classification')
        .eq('question_key', 'risk_class')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      const row = (data?.[0] as IntakeRow | undefined) || null;
      const value = row?.answer_json?.value;

      if (typeof value === 'string' && value.trim()) {
        setRiskClass(value);
      } else {
        setRiskClass('unknown');
      }
    } catch (e: any) {
      // do not hard-fail the whole page for this
      console.error(e);
    }
  }

  async function saveClassification(aiSystemId: string) {
    setClassSaved(false);
    setSavingClass(true);
    try {
      const client = await createSPASassClient();
      const supabase = client.getSupabaseClient();

      const payload = {
        ai_system_id: aiSystemId,
        section: 'eu_ai_act_classification',
        question_key: 'risk_class',
        answer_json: {
          value: riskClass,
        },
      };

      const { error } = await supabase.from('ai_intake_answers').insert([payload]);
      if (error) throw error;

      setClassSaved(true);
    } catch (e: any) {
      setErrorMsg(e?.message || String(e));
    } finally {
      setSavingClass(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setErrorMsg(null);
        setLoading(true);

        if (!id) throw new Error('Missing AI system id in URL');

        const client = await createSPASassClient();
        const supabase = client.getSupabaseClient();

        const { data: auth, error: authErr } = await supabase.auth.getUser();
        if (authErr) throw authErr;

        if (!auth?.user) {
          router.replace('/auth/login');
          return;
        }

        const { data, error } = await supabase
          .from('ai_systems')
          .select('id,name,status,created_at')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('AI system not found');

        if (cancelled) return;

        setSystem(data);

        await loadClassification(data.id);
        await loadPackages(data.id);
      } catch (e: any) {
        if (!cancelled) setErrorMsg(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (errorMsg) return <div style={{ padding: 24, color: 'red' }}>{errorMsg}</div>;
  if (!system) return <div style={{ padding: 24 }}>Not found</div>;

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <a href="/dashboard" style={{ fontSize: 14 }}>
        ← Back to dashboard
      </a>

      <h1 style={{ fontSize: 36, marginTop: 16 }}>{system.name}</h1>

      <div style={{ marginTop: 12 }}>
        <strong>Status:</strong> {system.status || 'Draft'}
      </div>

      {/* EU AI Act classification intake */}
      <div
        style={{
          marginTop: 18,
          padding: 14,
          border: '1px solid #eee',
          borderRadius: 10,
          background: '#fafafa',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          EU AI Act classification
        </div>

        <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>
          Risk level
        </label>

        <select
          value={riskClass}
          onChange={(e) => setRiskClass(e.target.value)}
          style={{
            width: '100%',
            height: 44,
            padding: '0 12px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: 'white',
            fontSize: 14,
          }}
        >
          <option value="unknown">Unknown (not assessed yet)</option>
          <option value="unacceptable">Unacceptable risk (prohibited)</option>
          <option value="high">High risk</option>
          <option value="limited">Limited risk (transparency obligations)</option>
          <option value="minimal">Minimal risk</option>
          <option value="gpaI">General-purpose AI (GPAI)</option>
        </select>

        <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            disabled={savingClass}
            onClick={async () => {
              await saveClassification(system.id);
            }}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #5b21b6',
              background: savingClass ? '#a78bfa' : '#6d28d9',
              color: 'white',
              cursor: savingClass ? 'not-allowed' : 'pointer',
              opacity: savingClass ? 0.75 : 1,
            }}
          >
            {savingClass ? 'Saving…' : 'Save classification'}
          </button>

          {classSaved ? (
            <span style={{ fontSize: 14, color: '#166534' }}>Saved</span>
          ) : null}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button
          disabled={generating}
          onClick={async () => {
            setGenerating(true);
            try {
              const res = await fetch('/api/generate-compliance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ai_system_id: system.id }),
              });

              const json = await res.json();
              if (!res.ok) throw new Error(json?.error || 'Generation failed');

              if (json.pdf_url) {
                window.open(json.pdf_url, '_blank', 'noopener,noreferrer');
              }

              await loadPackages(system.id);
            } catch (e: any) {
              alert(e?.message || String(e));
            } finally {
              setGenerating(false);
            }
          }}
        >
          {generating ? 'Generating…' : 'Generate compliance package'}
        </button>
      </div>

      <h2 style={{ marginTop: 32 }}>Archive</h2>

      {loadingPackages ? (
        <div>Loading archive…</div>
      ) : packages.length === 0 ? (
        <div>No generated reports yet.</div>
      ) : (
        <table style={{ width: '100%', marginTop: 12 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Generated</th>
              <th style={{ textAlign: 'left' }}>Name</th>
              <th style={{ textAlign: 'left' }}>PDF</th>
              <th style={{ textAlign: 'left' }}>JSON</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p.id}>
                <td>{formatDateTime(p.generated_at)}</td>
                <td>{p.pdf_name}</td>
                <td>
                  {p.pdf_url ? (
                    <a href={p.pdf_url} target="_blank" rel="noopener noreferrer">
                      PDF
                    </a>
                  ) : null}
                </td>
                <td>
                  {p.json_url ? (
                    <a href={p.json_url} target="_blank" rel="noopener noreferrer">
                      JSON
                    </a>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
