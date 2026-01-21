import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { ai_system_id } = await req.json();

    if (!ai_system_id) {
      return NextResponse.json({ error: 'Missing ai_system_id' }, { status: 400 });
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local' },
        { status: 500 }
      );
    }

    const supabase = createClient(url, key);

    const fnUrl = `${url}/functions/v1/bright-api`;

    const resp = await fetch(fnUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ai_system_id }),
    });

    const text = await resp.text();

    if (!resp.ok) {
      return NextResponse.json(
        { error: `Edge function error: ${text}` },
        { status: resp.status }
      );
    }

    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON from edge function' },
        { status: 500 }
      );
    }

    const { pdf_url, json_url } = json;

    if (!pdf_url || !json_url) {
      return NextResponse.json(
        { error: 'Missing pdf_url or json_url from edge function' },
        { status: 500 }
      );
    }

    const generatedAt = new Date().toISOString();
    const pdfName = `EU_AI_Act_${ai_system_id}_${generatedAt.slice(0, 10)}.pdf`;

    // ✅ FIX: package_version is REQUIRED by the table
    const { error: insertError } = await supabase
      .from('compliance_packages')
      .insert({
        ai_system_id,
        package_version: 1,
        status: 'generated',
        generated_at: generatedAt,
        pdf_url,
        json_url,
        pdf_name: pdfName,
      });

    if (insertError) {
      return NextResponse.json(
        { error: `Archive insert failed: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        pdf_url,
        json_url,
        pdf_name: pdfName,
        generated_at: generatedAt,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Internal error' },
      { status: 500 }
    );
  }
}
