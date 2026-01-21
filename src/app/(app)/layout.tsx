'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const client = await createSPASassClient();
        const supabase = client.getSupabaseClient();
        const { data } = await supabase.auth.getUser();
        setEmail(data.user?.email ?? null);
      } catch {
        setEmail(null);
      }
    }
    load();
  }, []);

  async function handleLogout() {
    const client = await createSPASassClient();
    const supabase = client.getSupabaseClient();
    await supabase.auth.signOut();
    router.replace('/auth/login');
  }

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <header
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div style={{ fontWeight: 700 }}>THØRN EU AI Compliance</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <nav style={{ display: 'flex', gap: 16 }}>
            <Link href="/dashboard">Dashboard</Link>
	    <Link href="/archive">Archive</Link>
            <Link href="/account">Account</Link>
          </nav>

          {email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14 }}>{email}</span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  background: '#f5f5f5',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}
