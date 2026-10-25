import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, escapeHtml, isValidEmail } from '@/lib/security';

const ALLOWED_INTENTS = new Set(['quote', 'trial_assistance', 'training_request']);

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  if (!checkRateLimit(`request:${ip}`, 10, 600_000)) {
    return NextResponse.json(
      { error: 'Çok fazla istek gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const intent = String(body.intent || 'quote').trim();
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim();
    const company = String(body.company || '').trim();
    const phone = String(body.phone || '').trim();
    const productSelection = String(body.productSelection || 'ALLPLAN').trim();
    const message = String(body.message || '').trim();
    const sourcePageRef = String(body.sourcePageRef || '/').trim();

    if (!ALLOWED_INTENTS.has(intent)) {
      return NextResponse.json({ error: 'Geçersiz talep türü.' }, { status: 400 });
    }
    if (fullName.length < 1 || fullName.length > 120) {
      return NextResponse.json({ error: 'Ad soyad alanı 1–120 karakter arasında olmalıdır.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    }
    if (company.length > 160 || phone.length > 40 || message.length > 2000) {
      return NextResponse.json({ error: 'Alan uzunluk sınırları aşıldı.' }, { status: 400 });
    }
    if (intent === 'training_request' && message.length < 1) {
      return NextResponse.json({ error: 'Lütfen eğitim ihtiyacınızı kısaca belirtiniz.' }, { status: 400 });
    }

    const requestId = `REQ-2027-${Date.now().toString(36).toUpperCase()}`;

    const safeRecord = {
      requestId,
      intent,
      formContractVersion: '2026-10-22.v1',
      createdAt: new Date().toISOString(),
      fullName: escapeHtml(fullName),
      email: escapeHtml(email),
      company: escapeHtml(company),
      phone: escapeHtml(phone),
      productSelection: escapeHtml(productSelection),
      message: escapeHtml(message),
      sourcePageRef: escapeHtml(sourcePageRef),
      status: 'new'
    };

    return NextResponse.json(
      {
        ok: true,
        requestId: safeRecord.requestId,
        intent: safeRecord.intent,
        createdAt: safeRecord.createdAt
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek gövdesi.' }, { status: 400 });
  }
}
