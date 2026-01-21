'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSPASassClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [message, setMessage] = useState('Completing sign-in…');
  const [details, setDetails] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        const client = await createSPASassClient();
        const supabase = client.getSupabaseClient();

        // force Supabase to read the URL and establish a session
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Auth callback error:', error);
          setMessage('Sign-in failed.');
          setDetails(error.message || String(error));
          // no redirect yet – we want to see the error
          return;
        }

        if (data.user) {
          setMessage('Signed in. Redirecting to dashboard…');
          setDetails(null);
          setTimeout(() => router.replace('/dashboard'), 800);
        } else {
          setMessage('No active session.');
          setDetails('Supabase returned no user.');
        }
      } catch (e: any) {
        console.error('Unexpected callback error:', e);
        setMessage('Unexpected error.');
        setDetails(e?.message || String(e));
      }
    }

    run();
  }, [router, search]);

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 640 }}>
      <h1>THØRN EU AI Compliance</h1>
      <p>{message}</p>
      {details && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: '#111',
            color: '#f88',
            whiteSpace: 'pre-wrap',
            fontSize: 14,
          }}
        >
          {details}
        </pre>
      )}
    </main>
  );
}
