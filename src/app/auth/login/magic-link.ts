'use client';

import { createSPASassClient } from '@/lib/supabase/client';

export async function sendMagicLink(email: string) {
  const client = await createSPASassClient();
  const supabase = client.getSupabaseClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'http://localhost:3000/auth/callback',
    },
  });

  if (error) throw error;
}
