'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSPASassClient } from '@/lib/supabase/client';

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const client = await createSPASassClient();
        const supabase = client.getSupabaseClient();
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (!data.user) {
          router.replace('/auth/login');
          return;
        }

        const meta = (data.user.user_metadata || {}) as any;

        setForm({
          firstName: meta.firstName || '',
          lastName: meta.lastName || '',
          email: data.user.email ?? '',
        });

        // If in future we store avatar info in metadata, we can prefill preview here.
      } catch (e: any) {
        setStatus(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setAvatarError(null);
    setAvatarFile(null);
    setAvatarPreview(null);

    if (!file) return;

    // 1) type check
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError('Only JPG and PNG images are allowed.');
      return;
    }

    // 2) size check (2 MB)
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setAvatarError('Image must be 2MB or smaller.');
      return;
    }

    // 3) dimensions check (max 1080x1080)
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      URL.revokeObjectURL(objectUrl);

      if (width > 1080 || height > 1080) {
        setAvatarError('Image must be at most 1080×1080 pixels.');
        return;
      }

      // All checks passed
      setAvatarFile(file);
      setAvatarPreview(objectUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setAvatarError('Could not read image file.');
    };
    img.src = objectUrl;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const client = await createSPASassClient();
      const supabase = client.getSupabaseClient();

      // For now we only persist text fields + a flag that avatar passed validation.
      // Actual file upload/storage will be wired later (e.g. Supabase Storage).
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          hasAvatar: !!avatarFile,
        },
      });

      if (error) throw error;
      setStatus('Profile saved (avatar validated).');
    } catch (e: any) {
      setStatus(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'system-ui',
        maxWidth: 640,
      }}
    >
      <h1>Account</h1>
      {loading && <p style={{ marginTop: 8 }}>Loading profile…</p>}

      {!loading && (
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Email</label>
            <input
              type="email"
              value={form.email}
              disabled
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 6,
                border: '1px solid #ccc',
                background: '#f5f5f5',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>First name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Last name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>
              Avatar image (JPG/PNG, max 1080×1080, 2MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleAvatarChange}
            />
            {avatarError && (
              <p style={{ marginTop: 8, color: 'red', fontSize: 14 }}>
                {avatarError}
              </p>
            )}
          </div>

          {avatarPreview && !avatarError && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Avatar preview</label>
              <img
                src={avatarPreview}
                alt="Avatar preview"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #ddd',
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '8px 16px',
              borderRadius: 999,
              border: 'none',
              background: '#4b0082',
              color: '#fff',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Saving…' : 'Save changes'}
          </button>

          {status && (
            <p style={{ marginTop: 12, fontSize: 14 }}>
              {status}
            </p>
          )}
        </form>
      )}
    </main>
  );
}
