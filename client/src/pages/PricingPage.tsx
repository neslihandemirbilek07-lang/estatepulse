import React from 'react';
import { Check, Sparkles, Zap, Shield, Building, Award, ArrowRight } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const packages = [
    {
      title: 'Bireysel / Starter',
      target: 'Mülk Sahipleri & Bağımsızlar',
      price: '1.490 ₺',
      period: '/ ay',
      features: [
        '15 Aktif İlan Kotası',
        'Temel EstatePulse AVM Raporları',
        '360° Sanal Tur Entegrasyonu',
        '2 Adet Vitrin Dopingi',
        'SMS & E-Posta Bildirimleri'
      ],
      popular: false,
      btnText: 'Hemen Başla'
    },
    {
      title: 'Pro Danışman',
      target: 'Büyüyen Profesyonel Acenteler',
      price: '3.250 ₺',
      period: '/ ay',
      features: [
        '50 Aktif İlan Kotası',
        'Sınırsız AI AVM Değerleme Raporu',
        '10 Adet AI Virtual Staging Kredisi',
        'Öncelikli Lead ve Müşteri Yönlendirme',
        'Gelişmiş CRM Kanban Pipeline',
        'WhatsApp Entegrasyonlu İlan Paylaşımı'
      ],
      popular: true,
      btnText: 'Pro Pakete Katıl'
    },
    {
      title: 'Enterprise Brokerage',
      target: 'Kurumsal Ofisler & Zincirler',
      price: '8.900 ₺',
      period: '/ ay',
      features: [
        '200+ Aktif İlan Kotası',
        '10+ Danışman Hesabı Yönetimi',
        'Sınırsız Virtual Staging Kredisi',
        'Matterport 3D Doğrudan SDK',
        'Özel Ofis Mikro-Web Sitesi',
        'Özel API Erişimi & Dedicated Yönetici'
      ],
      popular: false,
      btnText: 'Kurumsal İletişime Geç'
    }
  ];

  const dopings = [
    { name: 'AI Top Pick (Akıllı Vitrin)', price: '590 ₺ / Hafta', desc: 'NLP aramasında en nitelikli alıcıların karşısına %98 eşleşme etiketiyle ilk sırada çıkar.' },
    { name: 'Bölgesel Vitrin & Kategori Sabit', price: '750 ₺ / Hafta', desc: 'İlanın bulunduğu ilçedeki tüm aramalarda en üst sabit vitrin bandında yer alır.' },
    { name: 'Harita İğnesi Parlama (Map Pin Glow)', price: '290 ₺ / Hafta', desc: 'Mapbox haritasında diğer pinlerden 2 kat büyük, animasyonlu parlayan pin.' },
    { name: 'Bölgesel Akıllı Push Bildirimi', price: '950 ₺ / Seferlik', desc: 'O bölgede son 30 günde arama yapmış 2.500+ aktif alıcıya anlık mobil bildirim.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fadeIn">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-300 dark:border-brand-800 uppercase tracking-wider">
          Monetization & Üyelik Modelleri
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          İşinizi Büyütecek Profesyonel Planlar
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Hem bireysel mülk sahipleri hem de kurumsal brokerajlar için tasarlanmış şeffaf ve yüksek getirili üyelik paketleri.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 border flex flex-col justify-between transition-all ${
              pkg.popular
                ? 'bg-gradient-to-b from-slate-900 to-navy-950 text-white border-brand-500 shadow-2xl relative scale-105 z-10'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg text-slate-900 dark:text-white'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                En Çok Tercih Edilen
              </span>
            )}

            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-brand-500 mb-1">{pkg.target}</p>
              <h3 className="text-2xl font-bold mb-4">{pkg.title}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">{pkg.price}</span>
                <span className="text-xs text-slate-400 font-semibold">{pkg.period}</span>
              </div>

              <ul className="space-y-3 text-xs mb-8">
                {pkg.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-brand-500 shrink-0" />
                    <span className={pkg.popular ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => alert(`${pkg.title} paketi seçildi. Ödeme altyapısına yönlendiriliyorsunuz.`)}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                pkg.popular
                  ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
              }`}
            >
              <span>{pkg.btnText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Doping Options */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl space-y-6">
        <div>
          <span className="text-xs text-brand-400 font-bold uppercase tracking-wider">AdTech İlan Güçlendiriciler</span>
          <h2 className="text-2xl font-bold mt-1">Doping & Öne Çıkarma Seçenekleri</h2>
          <p className="text-xs text-slate-400 mt-1">İlanlarınızın alıcı adayları tarafından 5 kata kadar daha hızlı fark edilmesini sağlayın.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dopings.map((d, i) => (
            <div key={i} className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">{d.name}</span>
                <span className="text-xs font-bold text-brand-400">{d.price}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
