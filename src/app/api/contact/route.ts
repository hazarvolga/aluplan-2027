import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, escapeHtml, isValidEmail } from '@/lib/security';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  if (!checkRateLimit(`contact:${ip}`, 10, 600_000)) {
    return NextResponse.json(
      { error: 'Çok fazla iletişim isteği gönderildi. Lütfen daha sonra tekrar deneyin.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (fullName.length < 1 || fullName.length > 120) {
      return NextResponse.json({ error: 'Ad soyad alanı zorunludur (maks. 120 karakter).' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    }
    if (subject.length < 1 || subject.length > 160) {
      return NextResponse.json({ error: 'Konu alanı zorunludur (maks. 160 karakter).' }, { status: 400 });
    }
    if (message.length < 1 || message.length > 2000) {
      return NextResponse.json({ error: 'Mesaj alanı zorunludur (maks. 2000 karakter).' }, { status: 400 });
    }

    const referenceId = `CNT-2027-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json(
      {
        ok: true,
        referenceId,
        sanitized: {
          fullName: escapeHtml(fullName),
          email: escapeHtml(email),
          phone: escapeHtml(phone),
          subject: escapeHtml(subject)
        }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek formatı.' }, { status: 400 });
  }
}
