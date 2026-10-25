import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="preview-section" aria-labelledby="not-found-title">
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-lg)' }}>
        <span className="alu-badge alu-badge--accent">HTTP 404</span>
        <h1 id="not-found-title" className="alu-display">
          Aradığınız Sayfa Bulunamadı
        </h1>
        <p className="alu-body preview-meta">
          İstediğiniz adres taşınmış, kaldırılmış veya geçici olarak kullanım dışı olabilir. Aşağıdaki bağlantılardan ürün, çözüm ve eğitim sayfalarımıza ulaşabilirsiniz.
        </p>
        <div className="alu-cluster">
          <Link href="/" className="alu-button alu-button--primary alu-button--md">
            Ana Sayfaya Dön
          </Link>
          <Link href="/products" className="alu-button alu-button--secondary alu-button--md">
            Tüm Ürünler
          </Link>
          <Link href="/solutions" className="alu-button alu-button--secondary alu-button--md">
            Tüm Çözümler
          </Link>
          <Link href="/search" className="alu-button alu-button--ghost alu-button--md">
            Site İçi Arama
          </Link>
        </div>
      </div>
    </section>
  );
}
