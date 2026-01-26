'use client';

import { useState } from 'react';
import { sendMagicLink } from './magic-link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [msg, setMsg] = useState<string>('');

  // SINGLE SOURCE OF TRUTH
  const fieldWidth = '320px';

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
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <section
        style={{
          width: 'min(400px, calc(100vw - 48px))',
          background: '#1c0f2e',
          borderRadius: 24,
          padding: '64px 48px',
          textAlign: 'center',
        }}
      >
        {status === 'sent' ? (
          <div
            style={{
              minHeight: 260,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                color: '#ffffff',
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: 400,
                whiteSpace: 'nowrap',
              }}
            >
              Magic link sent. Check your email.
            </p>
          </div>
        ) : (
          <>
            <h1
              style={{
                margin: 0,
                color: '#ffffff',
                fontFamily:
                  'var(--font-title, ui-serif, Georgia, "Times New Roman", serif)',
                fontSize: 'clamp(40px, 6vw, 50px)',
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: '-0.02em',
              }}
            >
              Log In
            </h1>

            <p
              style={{
                margin: '16px auto 36px auto',
                maxWidth: 'none',
                whiteSpace: 'nowrap',
                color: 'rgba(255,255,255,0.9)',
                fontSize: 'clamp(16px, 1.4vw, 18px)',
                lineHeight: 1.4,
                fontWeight: 400,
              }}
            >
              Enter your email and we’ll send you a magic link.
            </p>

            <form
              onSubmit={onSubmit}
              style={{
                display: 'grid',
                gap: 20,
                justifyItems: 'center',
              }}
            >
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: fieldWidth,
                  boxSizing: 'border-box',
                  height: 56,
                  borderRadius: 14,
                  border: 'none',
                  outline: 'none',
                  background: '#ffffff',
                  padding: '0 18px',
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#1f1f1f',
                }}
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: fieldWidth,
                  boxSizing: 'border-box',
                  height: 56,
                  borderRadius: 14,
                  border: 'none',
                  background: '#F2EDF8',
                  color: '#314D55',
                  fontSize: 18,
                  fontWeight: 500,
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  opacity: status === 'sending' ? 0.85 : 1,
                }}
              >
                {status === 'sending' ? 'Sending…' : 'Email me a Magic Link'}
              </button>
            </form>

            <div style={{ marginTop: 36 }}>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: 16,
                  lineHeight: 1.35,
                  fontWeight: 400,
                }}
              >
                Don&apos;t have an account?{' '}
                <a
                  href="/auth/signup"
                  style={{
                    color: '#ffffff',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Sign Up
                </a>
              </p>

              {status === 'error' && msg ? (
                <p
                  style={{
                    marginTop: 16,
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: 14,
                  }}
                >
                  {msg}
                </p>
              ) : null}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
