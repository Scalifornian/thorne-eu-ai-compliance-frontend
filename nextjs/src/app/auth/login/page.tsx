'use client';

import { createSPASassClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SSOButtons from '@/components/SSOButtons';
import { sendMagicLink } from './magic-link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMFAPrompt, setShowMFAPrompt] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const client = await createSPASassClient();
      const { error: signInError } = await client.loginEmail(email, password);
      if (signInError) throw signInError;

      const supabase = client.getSupabaseClient();
      const { data: mfaData, error: mfaError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (mfaError) throw mfaError;

      if (mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
        setShowMFAPrompt(true);
      } else {
        router.push('/app');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Enter your email first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendMagicLink(email);
      setMagicSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showMFAPrompt) router.push('/auth/2fa');
  }, [showMFAPrompt, router]);

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {magicSent && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
          Magic link sent. Check your email.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary-600 py-2 px-4 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <button
        type="button"
        onClick={handleMagicLink}
        disabled={!email || loading}
        className="mt-4 w-full rounded-md border border-primary-600 py-2 px-4 text-sm font-medium text-primary-600 hover:bg-primary-50 disabled:opacity-50"
      >
        Email me a magic link
      </button>

      <SSOButtons onError={setError} />

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Don’t have an account?</span>{' '}
        <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
          Sign up
        </Link>
      </div>
    </div>
  );
}
