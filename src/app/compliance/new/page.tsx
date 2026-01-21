'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewComplianceWizard() {
  const router = useRouter();

  // Wizard step index
  const [step, setStep] = useState(1);

  // Shared wizard state (will grow step by step)
  const [form, setForm] = useState({
    provider: '',
    provider_custom: '',
    system_name: '',
    purpose: '',
    purpose_other: '',
    affected_groups: [] as string[],
  });

  function next() {
    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>
        Generate EU AI Act Compliance Certificate
      </h1>

      <div style={{ marginBottom: 24, color: '#555' }}>
        Step {step} of 5
      </div>

      {step === 1 && (
        <>
          <h2>AI provider</h2>

          <select
            value={form.provider}
            onChange={(e) =>
              setForm({ ...form, provider: e.target.value })
            }
            style={{ width: '100%', height: 48 }}
          >
            <option value="">Select AI provider</option>
            <option>OpenAI</option>
            <option>Anthropic</option>
            <option>Google</option>
            <option>Meta</option>
            <option>Mistral</option>
            <option>Custom / Self-hosted</option>
          </select>

          {form.provider === 'Custom / Self-hosted' && (
            <input
              placeholder="Describe your AI system"
              value={form.provider_custom}
              onChange={(e) =>
                setForm({ ...form, provider_custom: e.target.value })
              }
              style={{ width: '100%', height: 48, marginTop: 12 }}
            />
          )}

          <button
            onClick={next}
            disabled={!form.provider}
            style={{ marginTop: 24 }}
          >
            Continue
          </button>
        </>
      )}

      <div style={{ marginTop: 32 }}>
        {step > 1 && (
          <button onClick={back}>
            ← Back
          </button>
        )}
      </div>
    </main>
  );
}
