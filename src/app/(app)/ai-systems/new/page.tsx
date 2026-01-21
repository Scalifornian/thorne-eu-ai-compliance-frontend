'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSPASassClient } from '@/lib/supabase/client';

export default function NewAiSystemPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [aiSoftware, setAiSoftware] = useState(
    'OpenAI (ChatGPT / GPT-4 / GPT-4o)'
  );

  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const client = await createSPASassClient();
        const supabase = client.getSupabaseClient();

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (!data.user) {
          router.replace('/auth/login');
          return;
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onCreate() {
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required.');
      return;
    }

    setSaving(true);

    try {
      const client = await createSPASassClient();
      const supabase = client.getSupabaseClient();

      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) throw userErr;
      if (!user?.email) throw new Error('User email not found');

      // 1) Create AI system (MATCHES RLS)
      const { data: system, error: createErr } = await supabase
        .from('ai_systems')
        .insert([
          {
            name: trimmed,
            status: 'draft',
            owner_email: user.email,
          },
        ])
        .select('id')
        .single();

      if (createErr) throw createErr;
      if (!system?.id) throw new Error('Failed to create AI system');

      // 2) Create intake answers row (FIX: section is NOT NULL)
      const { error: intakeErr } = await supabase.from('ai_intake_answers').insert([
  {
    ai_system_id: system.id,
    section: 'system',
    question_key: 'ai_software_used',
    answer_json: {
      ai_software_used: aiSoftware,
    },
  },
]);


      if (intakeErr) throw intakeErr;

      // 3) Redirect
      router.push(`/ai-systems/${system.id}`);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  if (loadingUser) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <a href="/dashboard" style={{ textDecoration: 'none', fontSize: 14 }}>
        ← Back to dashboard
      </a>

      <h1 style={{ fontSize: 48, marginTop: 16, marginBottom: 24 }}>
        New AI system
      </h1>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Name <span style={{ color: '#b91c1c' }}>*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Customer Support Assistant"
          style={{
            width: '100%',
            height: 56,
            padding: '0 14px',
            borderRadius: 10,
            border: '1px solid #ddd',
            fontSize: 18,
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          AI software used
        </label>
        <select
          value={aiSoftware}
          onChange={(e) => setAiSoftware(e.target.value)}
          style={{
            width: '100%',
            height: 56,
            padding: '0 14px',
            borderRadius: 10,
            border: '1px solid #ddd',
            fontSize: 16,
            background: 'white',
          }}
        >
          <option>OpenAI (ChatGPT / GPT-4 / GPT-4o)</option>
          <option>Anthropic (Claude)</option>
          <option>Google (Gemini)</option>
          <option>Meta (LLaMA)</option>
          <option>Mistral</option>
          <option>Custom / Self-hosted</option>
        </select>
      </div>

      <button
        onClick={onCreate}
        disabled={saving}
        style={{
          padding: '12px 18px',
          borderRadius: 10,
          border: '1px solid #5b21b6',
          background: saving ? '#a78bfa' : '#6d28d9',
          color: 'white',
          fontSize: 18,
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.75 : 1,
          minWidth: 240,
        }}
      >
        {saving ? 'Creating…' : 'Create AI system'}
      </button>

      {error ? (
        <div style={{ marginTop: 14, color: 'red', fontSize: 14 }}>
          {error}
        </div>
      ) : null}
    </main>
  );
}
