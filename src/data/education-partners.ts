export interface EducationUniversity {
  name: string;
  programs: string[];
}

export interface EducationCenterContact {
  label: string;
  href?: string;
}

export interface EducationCenter {
  name: string;
  people: { name: string; title: string }[];
  lines: string[];
  contacts: EducationCenterContact[];
}

export const educationPartners = {
  title: 'Eğitim İş Ortaklarımız',
  intro: 'Akademik iş birliklerimiz ve yetkili eğitim merkezlerimiz.',
  universitiesTitle: 'Üniversiteler',
  centersTitle: 'Eğitim Merkezlerimiz',
  universities: [
    { name: 'Yıldız Teknik Üniversitesi', programs: ['İnşaat Mühendisliği', 'Mimarlık'] },
    { name: 'İstanbul Aydın Üniversitesi', programs: ['İnşaat Mühendisliği', 'Mimarlık'] },
    { name: 'Kastamonu MYO', programs: [] },
    { name: 'İstanbul Gelişim Üniversitesi', programs: ['İnşaat Teknolojisi', 'Mimarlık'] },
    { name: 'Orta Doğu Teknik Üniversitesi', programs: ['İnşaat Mühendisliği'] }
  ] satisfies EducationUniversity[],
  centers: [
    {
      name: 'IMO Ankara',
      people: [{ name: 'Mizgin Bektaş', title: 'Araştırma Görevlisi' }],
      lines: ['TMMOB İnşaat Mühendisleri Odası', 'Ankara Şubesi'],
      contacts: [{ label: '0 312 294 3060', href: 'tel:03122943060' }]
    },
    {
      name: 'LGN Proje Akademi',
      people: [],
      lines: ['Sahrayıcedit Mah. Ferit Bey Sok. No:24 / 12', '34734 Kadıköy / İstanbul'],
      contacts: [
        { label: 'info@lgnprojeakademi.com', href: 'mailto:info@lgnprojeakademi.com' },
        { label: '0 533 218 90 66', href: 'tel:05332189066' }
      ]
    }
  ] satisfies EducationCenter[]
};
