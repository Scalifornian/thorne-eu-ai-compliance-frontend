'use client';

import { useState } from 'react';
import { sendMagicLink } from './magic-link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [msg, setMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setMsg('');
    try {
      await sendMagicLink(email.trim());
      setStatus('sent');
      setMsg('Magic link sent. Check your email.');
    } catch (err: any) {
      setStatus('error');
      setMsg(err?.message ?? 'Failed to send magic link.');
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 520 }}>
      <h1>Login</h1>
      <p>Enter your email and we’ll send you a magic link.</p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          type="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 12, fontSize: 16 }}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          style={{ padding: 12, fontSize: 16, cursor: 'pointer' }}
        >
          {status === 'sending' ? 'Sending…' : 'Email me a magic link'}
        </button>
      </form>

      {msg ? <p style={{ marginTop: 16 }}>{msg}</p> : null}
    </main>
  );
}
