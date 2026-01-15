Στο νέο αρχείο `magic-link.ts` που άνοιξε, **επικόλλησε αυτόν τον κώδικα** και μετά πάτα **Commit changes**:

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://www.thorneindustries.eu/auth/callback',
    },
  });

  if (error) {
    throw error;
  }
}
```
