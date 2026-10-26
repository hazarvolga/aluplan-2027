import { NextResponse } from 'next/server';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-data';

// Retired endpoint: do not read, store, forward or acknowledge a personal-data payload.
export async function POST() {
  return NextResponse.json(
    { error: 'İletişim için mevcut talep formunu veya doğrudan iletişim kanallarını kullanınız.', formUrl: MAIN_QUOTE_FORM_URL },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  );
}
