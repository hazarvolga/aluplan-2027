'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { AluIcon } from '@/components/ui/AluIcon';
import { handleStructuredTabKey } from './structured-tab-key';

type ProductTab = { name: string; description: string; detail: string; href: string };
export function ProductTabs({ items, label = 'Ürünleri keşfedin', actionLabel = 'Ürünü keşfedin' }: { items: readonly ProductTab[]; label?: string; actionLabel?: string }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const activeIndex = selected < items.length ? selected : 0;
  const product = items[activeIndex];
  if (!product) return null;
  return <section className="alu-quick-ribbon alu-preview-product-ribbon" aria-label={label}>
    <div className="alu-container">
      <div className="alu-quick-ribbon__grid" role="tablist" aria-label={label}>
        {items.map((item, index) => <button key={item.name} id={`${id}-tab-${index}`} type="button" role="tab"
          className="alu-quick-ribbon__item alu-preview-product-ribbon__item" aria-selected={activeIndex === index} aria-controls={`${id}-panel`}
          tabIndex={activeIndex === index ? 0 : -1} onClick={() => setSelected(index)}
          onKeyDown={event => handleStructuredTabKey(event, index, items.length, setSelected)}>
          <span className="alu-preview-product-ribbon__text"><span>{item.name}</span><span className="alu-preview-product-ribbon__description">{item.description}</span></span>
        </button>)}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${activeIndex}`} tabIndex={0} className="alu-preview-product-panel">
        <div key={product.name} className="alu-preview-product-panel__content"><span className="preview-kicker">{product.description}</span><h2 className="alu-h2">{product.name}</h2><p className="alu-body preview-meta">{product.detail}</p>
          <Link className="alu-button alu-button--secondary" href={product.href}><span>{actionLabel}</span><AluIcon name="arrow-right" size="sm" /></Link>
        </div>
      </div>
    </div>
  </section>;
}
