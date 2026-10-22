'use strict';
const data = window.previewData;
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const url = path => path.startsWith('/') ? `https://aluplan.com.tr${path}` : path;
const link = (path, label, css='') => `<a class="${css}" href="${escapeHtml(url(path))}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ↗</a>`;
const card = (item, extra='') => `<article class="card ${extra}">${item.subtitle ? `<div class="small">${escapeHtml(item.subtitle)}</div>` : ''}<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p>${item.href ? `<div class="tail">${link(item.href,item.cta || 'İncele')}</div>` : ''}</article>`;
const put = (id, html) => {document.getElementById(id).innerHTML=html;};
put('hero-tags',['CLOUD NATIVE','BIM LEVEL 3','PARAMETRIC','AUTOMATION','INTEROPERABILITY','AX3000','PYTHONPARTS','OPENBIM','REAL-TIME','PRECAST','CIVIL','BRIDGE','@CONNECTION','DATA_NODE'].map(x=>`<span>${x}</span>`).join(''));
put('quick-links',data.quickLinks.map(([label,path])=>link(path,label)).join(''));
put('roles',data.roles.map((r,i)=>`<button type="button" data-role="${r.id}" aria-pressed="${i===0}">${escapeHtml(r.label)}</button>`).join(''));
function selectRole(id){
 const role=data.roles.find(r=>r.id===id);
 if(!role)return;
 document.querySelectorAll('[data-role]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.role===id)));
 put('role-content',`<div><h3>${escapeHtml(role.title)}</h3><p>${escapeHtml(role.description)}</p>${link(role.href,'Bu Akışı Detaylı İncele','button')}</div><ul class="features">${role.features.map(f=>`<li>✓ ${escapeHtml(f)}</li>`).join('')}</ul>`);
 put('product-cards',data.products.map(p=>card(p,p.relatedRoles.includes(id)?'highlight':'')).join(''));
}
document.getElementById('roles').addEventListener('click',event=>{const button=event.target.closest('[data-role]');if(button)selectRole(button.dataset.role);});selectRole(data.roles[0].id);
put('solution-cards',data.solutions.map((s,i)=>{const image=i===0?'architecture-hero.jpg':i===2?'precast-hero.jpg':null;return `<article class="card">${image?`<img src="../assets/${image}" alt="${escapeHtml(s.title)}" width="500" height="180" style="width:100%;height:160px;object-fit:cover;margin-bottom:20px" loading="lazy">`:''}<div class="small">${escapeHtml(s.subtitle)}</div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.description)}</p><div class="tail">${link(s.href,s.cta)}</div></article>`;}).join(''));
const pdf='/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf';
put('package-cards',data.packages.map(p=>card({...p,href:pdf,cta:'PDF’yi aç'})).join(''));
const primary=['Eğitim','Teknik Destek','Destek Platformu'];
put('primary-services',primary.map(t=>card(data.services.find(s=>s.title===t))).join(''));
const groups=[['ÖĞREN VE YARDIM AL',['Danışmanlık','Sertifika']],['YAZILIM VE LİSANS İŞLEMLERİ',['Download','Connect: Giriş','Admin Lisans : Lisans Yöneticisi Bilgi Formu','CodeMeter WebDepot','Deklarasyon Formu']],['BİLGİ VE GÜNCELLEMELER',['ALLPLAN FAQ','Blog Global','Canlı Webinarlar','BIM Rehberi','OPENBIM','Sistem Gereksinimleri','Tüm Gereksinimler','Sürüm Notları','IFC Export El Kitabı']],['PARTNER ERİŞİMİ',['Partner']]];
put('service-groups',groups.map(([title,names])=>`<h3 class="service-heading">${title}</h3><div class="service-list">${names.map(t=>card(data.services.find(s=>s.title===t))).join('')}</div>`).join(''));
put('innovation-cards',data.innovations.map(i=>card({...i,subtitle:i.badge})).join(''));
put('footer-products',data.products.map(p=>`<li>${link(p.href,p.title)}</li>`).join(''));
put('footer-solutions',data.solutions.map(p=>`<li>${link(p.href,p.title)}</li>`).join(''));
put('socials',[['Facebook','https://www.facebook.com/Allplan.Turkey'],['X','https://twitter.com/Allplan_Turkey'],['LinkedIn','https://www.linkedin.com/company/allplan-turkey/'],['Instagram','https://www.instagram.com/allplan_turkey/'],['YouTube','https://www.youtube.com/c/AllplanTurkey']].map(([n,u])=>link(u,n)).join(' · '));
