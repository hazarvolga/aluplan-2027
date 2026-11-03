export interface RecordedWebinar {
  title: string;
  date: string;
  description: string;
  /** Local poster; empty for recordings added from the channel, which use the YouTube thumbnail. */
  image: string;
  /** YouTube video id of the recording; null until the link is known. */
  youtubeId: string | null;
}

export interface RecordedWebinarsContent {
  kicker: string;
  title: string;
  lead: string;
  overviewTitle: string;
  overview: string;
  stats: { value: string; label: string }[];
  benefitsTitle: string;
  benefits: { title: string; description: string }[];
  audienceTitle: string;
  audience: string[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  archiveTitle: string;
  archiveLead: string;
  webinars: RecordedWebinar[];
}

// Content of the former /solutions-v2/training/webinar page (2026 source), kept here after that page was removed.
// Recording links and the two entries without a poster come from the Allplan Turkey YouTube channel (@AllplanTurkey).
export const recordedWebinars: RecordedWebinarsContent = {
  "kicker": "BİLGİ PAYLAŞIMI",
  "title": "Webinarlar",
  "lead": "Kısa, odaklanmış ve bilgi dolu çevrimiçi seminerler.",
  "overviewTitle": "Genel Bakış",
  "overview": "Webinarlarımız, belirli bir konu, yeni bir özellik veya sektörel bir gelişme hakkında hızlı ve yoğun bilgi aktarımı sağlar. Genellikle 45-60 dakika süren bu oturumlar, öğle molasında bile kendinizi geliştirmeniz için mükemmel bir fırsattır.",
  "stats": [
    {
      "value": "45-60",
      "label": "Dakika Süre"
    },
    {
      "value": "Ücretsiz",
      "label": "Genellikle"
    },
    {
      "value": "Uzman",
      "label": "Konuşmacılar"
    },
    {
      "value": "Soru",
      "label": "Cevap Bölümü"
    }
  ],
  "benefitsTitle": "Kazanımlarınız",
  "benefits": [
    {
      "title": "Zaman Verimliliği",
      "description": "Kısa sürede, belirli bir konuda derinlemesine bilgi sahibi olun."
    },
    {
      "title": "Güncel Konular",
      "description": "Sektördeki en son trendleri, yönetmelik değişikliklerini ve yazılım yeniliklerini takip edin."
    },
    {
      "title": "Kolay Erişim",
      "description": "Kayıt olun ve linke tıklayın. Herhangi bir kurulum gerektirmez."
    },
    {
      "title": "Tekrar İzleme",
      "description": "Webinar kayıtlarına arşivimizden dilediğiniz zaman ulaşın."
    }
  ],
  "audienceTitle": "Kimler İçin Uygun?",
  "audience": [
    "Yenilikleri takip etmek isteyen yoğun profesyoneller",
    "Belirli bir özellik hakkında hızlı bilgi almak isteyen kullanıcılar",
    "Allplan potansiyelini keşfetmek isteyen yöneticiler",
    "Sürekli mesleki gelişimi hedefleyen öğrenciler ve akademisyenler"
  ],
  "ctaTitle": "Hazır mısınız?",
  "ctaText": "Eğitim takvimini incelemek veya özel bir teklif almak için bizimle iletişime geçin.",
  "ctaLabel": "Webinar Takvimine Göz At",
  "archiveTitle": "Kaydedilmiş Webinarlar",
  "archiveLead": "Kaçırdığınız veya tekrar izlemek istediğiniz webinarlarımıza buradan ulaşabilirsiniz.",
  "webinars": [
    {
      "title": "Allplan Bridge 2022 Webinar",
      "date": "19 Nisan 2022",
      "description": "Bir 3B modelleme ve hesap yazılımı olan Allplan Bridge hakkındaki sunumumuzu izleyin. Yazılım öngermeli, artgermeli, asma, ekstradoz, çelik, betonarme, ahşap, kompozit ve diğer köprülerin birebir modellenmesi ve hesabının yapılmasını sağlar.",
      "image": "",
      "youtubeId": "tTQ1fL-9P9M"
    },
    {
      "title": "IMO / ALLPLAN BRIDGE 2022 WEBİNAR",
      "date": "23 Kasım 2021",
      "description": "Allplan Bridge eğitmeni Şaman Bayyurt yazılımın hangi ihtiyaçlara cevap verdiği, kimler için kullanışlı olduğu ve çalışma yöntemleri hakkında bilgiler verecektir.",
      "image": "/assets/images/webinars/allplan-bridge-2022.png",
      "youtubeId": null
    },
    {
      "title": "IMO / ALLPLAN ENGINEERING 2022 WEBINAR",
      "date": "16 Kasım 2021",
      "description": "Allplan ile her türlü gerçek 3B yapınızı modelleyip, donatıyı 3B olarak nasıl döşeyebileceğinizi ve bu yönteminin avantajlarını keşfedin.",
      "image": "/assets/images/webinars/allplan-engineering-2022.png",
      "youtubeId": null
    },
    {
      "title": "Allplan Bridge 2021",
      "date": "6 Ağustos 2021",
      "description": "Allplan Bridge 2021 sürümü ile gelen yenilikler ve köprü tasarımı süreçleri üzerine kapsamlı bir webinar.",
      "image": "/assets/images/webinars/allplan-bridge-2021.jpg",
      "youtubeId": "cQ57NOYXwJA"
    },
    {
      "title": "BIMX5 Online Webinar - İmar Yönetmeliği",
      "date": "13 Temmuz 2021",
      "description": "BIMX5 ve İmar Yönetmeliği uyumluluğu üzerine detaylı inceleme.",
      "image": "/assets/images/webinars/bimx5.jpg",
      "youtubeId": "Cvf_nwrSPBQ"
    },
    {
      "title": "BIMX5 Online Webinar - Genel",
      "date": "9 Temmuz 2021",
      "description": "BIMX5 araçlarının genel tanıtımı ve kullanım alanları.",
      "image": "/assets/images/webinars/bimx5.jpg",
      "youtubeId": null
    },
    {
      "title": "BIMX5 Kurum Rapor Eklentisi",
      "date": "9 Temmuz 2021",
      "description": "",
      "image": "",
      "youtubeId": "3L-AuAXlqz0"
    },
    {
      "title": "BIMX5 Online Webinar - 2B DWG Converter",
      "date": "6 Temmuz 2021",
      "description": "2B DWG dosyalarını BIM modellerine dönüştürme süreçleri ve BIMX5 Converter özellikleri.",
      "image": "/assets/images/webinars/bimx5.jpg",
      "youtubeId": "dBr2W3Qyd0Y"
    },
    {
      "title": "Bimplus Online Webinar: BIM İşbirliği",
      "date": "2 Temmuz 2021",
      "description": "Günlük openBIM iş akışınız için özel yenilikler ve BIM işbirliği çözümleri.",
      "image": "/assets/images/webinars/qa-seminar.jpg",
      "youtubeId": "yF1GQhPJclI"
    },
    {
      "title": "Bimfili Youtube Kanalı: BIMX5 Nedir?",
      "date": "10 Haziran 2021",
      "description": "Ahmet Melih Dinekli ve Ferdi Dinekli'nin anlatımı ile 'BIMX5 Nedir?' ve nasıl kullanılır?",
      "image": "/assets/images/webinars/bimx5-youtube.jpeg",
      "youtubeId": null
    },
    {
      "title": "ALLPLAN PRECAST SEVİYENİZİ YÜKSELTİN",
      "date": "8 Haziran 2021",
      "description": "Yapısal detaycılar ve yükleniciler için tüm süreçleri destekleyen üst düzey BIM yazılımı Allplan Precast.",
      "image": "/assets/images/webinars/allplan-precast.jpg",
      "youtubeId": "-_6LiE0H-Sw"
    },
    {
      "title": "Soru Cevap Semineri",
      "date": "15 Ocak 2021",
      "description": "Allplan Architecture ve Engineering ile ilgili teknik sorular ve kullanım ipuçları üzerine interaktif oturum.",
      "image": "/assets/images/webinars/qa-seminar.jpg",
      "youtubeId": "UaDnMdrmJ4w"
    },
    {
      "title": "Allplan Engineering 2021 ve Yenilikler",
      "date": "7 Ocak 2021",
      "description": "Parametrik tasarım, modelleme ve Allplan Engineering 2021 sürümünün getirdiği tüm yenilikler.",
      "image": "/assets/images/webinars/qa-seminar.jpg",
      "youtubeId": "MhtYjJKLZtc"
    },
    {
      "title": "Allplan 2018-2021: İpuçları",
      "date": "30 Aralık 2020",
      "description": "Ayarlar, seçenekler ve verimlilik artırıcı ipuçları ile Allplan deneyiminizi iyileştirin.",
      "image": "/assets/images/webinars/qa-seminar.jpg",
      "youtubeId": "vXZBQ0IPVsQ"
    },
    {
      "title": "Görsel Komut Dosyalarına Giriş (Visual Scripting)",
      "date": "19 Şubat 2020",
      "description": "Visual Scripting dünyasına giriş yapın ve parametrik tasarımın gücünü keşfedin.",
      "image": "/assets/images/webinars/visual-scripting.jpg",
      "youtubeId": null
    }
  ]
};
