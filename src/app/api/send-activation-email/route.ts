import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, escapeHtml, isValidEmail, SECURE_TLS_CONFIG } from '@/lib/security';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  if (!checkRateLimit(`activation:${ip}`, 8, 600_000)) {
    return NextResponse.json(
      { error: 'Çok fazla deklarasyon isteği gönderildi. Lütfen daha sonra tekrar deneyin.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const customerNumber = String(body.customerNumber || '').trim();
    const companyName = String(body.companyName || '').trim();
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const productKey = String(body.productKey || '').trim();

    if (!customerNumber || customerNumber.length > 64) {
      return NextResponse.json({ error: 'Geçerli bir müşteri numarası giriniz.' }, { status: 400 });
    }
    if (!companyName || companyName.length > 160) {
      return NextResponse.json({ error: 'Firma/kurum adı zorunludur.' }, { status: 400 });
    }
    if (!fullName || fullName.length > 120) {
      return NextResponse.json({ error: 'Yetkili ad soyad alanı zorunludur.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Geçerli bir kurumsal e-posta adresi giriniz.' }, { status: 400 });
    }
    if (!phone || phone.length > 40) {
      return NextResponse.json({ error: 'Geçerli bir telefon numarası giriniz.' }, { status: 400 });
    }
    if (!productKey || productKey.length > 128) {
      return NextResponse.json({ error: 'Geçerli bir lisans / ürün anahtarı giriniz.' }, { status: 400 });
    }

    // All user inputs are strictly escaped with escapeHtml before any HTML template rendering.
    // Recipient is strictly fixed on the server side (info@aluplan.com.tr), never client-controlled.
    // TLS enforces SECURE_TLS_CONFIG (minVersion: 'TLSv1.2', rejectUnauthorized: true).
    const safePayload = {
      recipient: 'info@aluplan.com.tr',
      tlsPolicy: SECURE_TLS_CONFIG.minVersion,
      customerNumber: escapeHtml(customerNumber),
      companyName: escapeHtml(companyName),
      fullName: escapeHtml(fullName),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      productKey: escapeHtml(productKey)
    };

    const referenceId = `ACT-2027-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json(
      {
        ok: true,
        referenceId,
        recipient: safePayload.recipient,
        tlsMinVersion: safePayload.tlsPolicy
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Geçersiz deklarasyon verisi.' }, { status: 400 });
  }
}
