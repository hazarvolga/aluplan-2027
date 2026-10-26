import { NextResponse } from 'next/server';

// Retired endpoint: do not read, store, forward or acknowledge a personal-data payload.
export async function POST() {
  return NextResponse.json(
    { error: 'Bu adresten deklarasyon gönderimi yapılmamaktadır. Lisans işlemleri için Aluplan ile iletişime geçiniz.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  );
}
