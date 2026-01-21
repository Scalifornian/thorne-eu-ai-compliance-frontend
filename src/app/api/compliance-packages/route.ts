import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local' },
        { status: 500 }
      );
    }

    const supabase = createClient(url, key);

    const u = new URL(req.url);
    const ai_system_id = u.searchParams.get('ai_system_id');

    if (!ai_system_id) {
      return NextResponse.json({ error: 'Missing ai_system_id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('compliance_packages')
      .select('id,pdf_url,json_url,pdf_name,generated_at')
      .eq('ai_system_id', ai_system_id)
      .order('generated_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rows: data || [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    );
  }
}
