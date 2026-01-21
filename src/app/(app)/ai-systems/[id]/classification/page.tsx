'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createSPASassClient } from '@/lib/supabase/client';
import { CLASSIFICATION_QUESTIONS } from '@/lib/intake/classification';
import { classifyFromAnswers } from '@/lib/intake/classification-engine';

function extractIdFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  // /ai-systems/[id]/classification
  return parts[parts.indexOf('ai-systems') + 1] || '';
}

type Row = {
  section: string;
  question_key: string;
  answer_json: any;
};

export default function ClassificationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const aiSystemId = useMemo(() => extractIdFromPath(pathname), [pathname]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        setLoading(true);

        const client = await createSPASassClient();
        const supabase = client.getSupabaseClient();

        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) {
          router.replace('/auth/login');
          return;
        }

        const { data, error } = await supabase
          .from('ai_intake_answers')
          .select('section,question_key,answer_json')
          .eq('ai_system_id', aiSystemId)
          .eq('section', 'classification');

        if (error) throw error;

        const next: Record<string, any> = {};
        (data as Row[] | null)?.forEach((r) => {
          const v =
            r?.answer_json?.[r.question_key] !== undefined
              ? r.answer_json[r.question_key]
              : r.answer_json;
          next[r.question_key] = v;
        });

        if (!cancelled) setAnswers(next);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (aiSystemId) load();

    return () => {
      cancelled = true;
    };
  }, [aiSystemId, router]);

  const result = useMemo(() => classifyFromAnswers(answers), [answers]);

  async function saveAll() {
    setError(null);
    setSaving(true);

    try {
      const client = await createSPASassClient();
      const supabase = client.getSupabaseClient();

      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        router.replace('/auth/login');
        return;
      }

      const rows = CLASSIFICATION_QUESTIONS.map((q) => ({
        ai_system_id: aiSystemId,
        section: 'classification',
        question_key: q.question_key,
        answer_json: {
          [q.question_key]: answers[q.question_key],
        },
      }));

      const { error } = await supabase.from('ai_intake_answers').upsert(rows, {
        onConflict: 'ai_system_id,section,question_key',
      });

      if (error) throw error;

      router.push(`/ai-systems/${aiSystemId}`);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <a href={`/ai-systems/${aiSystemId}`} style={{ fontSize: 14 }}>
        ← Back to AI system
      </a>

      <h1 style={{ fontSize: 34, marginTop: 16 }}>EU AI Act classification</h1>

      <div style={{ marginTop: 12, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
        <div style={{ fontWeight: 700 }}>Current classification (auto)</div>
        <div style={{ marginTop: 6 }}>
          <strong>Tier:</strong> {result.risk_tier}
        </div>
        <div style={{ marginTop: 6 }}>
          <strong>Reasons:</strong>
          <ul style={{ marginTop: 6 }}>
            {result.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        {CLASSIFICATION_QUESTIONS.map((q) => (
          <div key={q.question_key} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
              {q.label} {q.required ? <span style={{ color: '#b91c1c' }}>*</span> : null}
            </label>
            {q.help ? <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>{q.help}</div> : null}

            {q.type === 'text' ? (
              <input
                value={answers[q.question_key] ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.question_key]: e.target.value }))}
                style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 8, border: '1px solid #ddd' }}
              />
            ) : null}

            {q.type === 'yes_no' ? (
              <select
                value={answers[q.question_key] ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.question_key]: e.target.value }))}
                style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 8, border: '1px solid #ddd' }}
              >
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            ) : null}

            {q.type === 'single_select' ? (
              <select
                value={answers[q.question_key] ?? ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.question_key]: e.target.value }))}
                style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 8, border: '1px solid #ddd' }}
              >
                <option value="">Select…</option>
                {q.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : null}

            {q.type === 'multi_select' ? (
              <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 10 }}>
                {q.options?.map((o) => {
                  const arr: string[] = Array.isArray(answers[q.question_key]) ? answers[q.question_key] : [];
                  const checked = arr.includes(o.value);
                  return (
                    <label key={o.value} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...arr, o.value]
                            : arr.filter((x) => x !== o.value);
                          setAnswers((a) => ({ ...a, [q.question_key]: next }));
                        }}
                      />
                      <span>{o.label}</span>
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <button
          onClick={saveAll}
          disabled={saving}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #111',
            background: saving ? '#999' : '#111',
            color: 'white',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Save classification'}
        </button>

        <a href={`/ai-systems/${aiSystemId}`} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd' }}>
          Cancel
        </a>
      </div>
    </main>
  );
}
