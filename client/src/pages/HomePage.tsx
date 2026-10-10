import React, { useState } from 'react';
import { Search, Sparkles, MapPin, ArrowRight, ShieldCheck, TrendingUp, Layers, Compass, ChevronRight, CheckCircle2, Bed, Bath, Maximize, Star } from 'lucide-react';
import { Property } from '../types';
import { calculateAVMValuation } from '../utils/avmEngine';
import { MarketPulseTicker } from '../components/MarketPulseTicker';

interface HomePageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  onSelectProperty,
  onNavigate
}) => {
  const [nlpQuery, setNlpQuery] = useState('');
  
  // Quick AVM state on Homepage
  const [calcDistrict, setCalcDistrict] = useState('Kadıköy - Caferağa (Moda)');
  const [calcSqm, setCalcSqm] = useState(120);
  const [calcAge, setCalcAge] = useState(0);
  const [quickAvmResult, setQuickAvmResult] = useState(() => calculateAVMValuation({
    city: 'İstanbul',
    district: 'Kadıköy - Caferağa (Moda)',
    grossSqm: 120,
    buildingAge: 0,
    floor: 3,
    totalFloors: 6,
    hasElevator: true,
    hasParking: true,
    hasView: true,
    deedStatus: 'Kat Mülkiyeti'
  }));

  const promptPills = [
    "Antalya'da denize 10 dk, havuzlu, 3+1 sıfır daire",
    "Kadıköy Moda'da metroya 5 dk 3+1 daire",
    "Bodrum Yalıkavak'ta sonsuzluk havuzlu taş villa",
    "Ankara Çankaya GOP'ta krediye uygun 4+1",
    "Fırsat fiyatlı AVM değerinin altında ilanlar"
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search', { query: nlpQuery });
  };

  const handlePillClick = (pill: string) => {
    setNlpQuery(pill);
    onNavigate('search', { query: pill });
  };

  const handleRecalculateQuickAvm = (newDistrict = calcDistrict, newSqm = calcSqm, newAge = calcAge) => {
    setCalcDistrict(newDistrict);
    setCalcSqm(newSqm);
    setCalcAge(newAge);
    const res = calculateAVMValuation({
      city: 'İstanbul',
      district: newDistrict,
      grossSqm: newSqm,
      buildingAge: newAge,
      floor: 3,
      totalFloors: 6,
      hasElevator: true,
      hasParking: true,
      hasView: true,
      deedStatus: 'Kat Mülkiyeti'
    });
    setQuickAvmResult(res);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION WITH NLP SEARCH */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100/80 dark:bg-brand-950/80 border border-brand-300 dark:border-brand-800 text-brand-800 dark:text-brand-300 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Zillow, Redfin ve Rightmove Standartlarında Yapay Zeka Altyapısı</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight mb-6">
            Emlak Dünyasının Yeni Nabzı: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-500">
              Yapay Zeka ile Doğru Fiyat, Şeffaf Teklif
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Otomatize AVM değerleme motoru, doğal dil işleme (NLP) ile arama, 360° sanal tur ve tek tıkla sanal mobilyalama (Virtual Staging) ile hayalinizdeki evi bulun.
          </p>

          {/* NLP SMART SEARCH BOX */}
          <div className="max-w-3xl mx-auto mb-6">
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-3 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative flex-1 w-full flex items-center pl-4">
                <Search className="w-5 h-5 text-brand-500 shrink-0 mr-3" />
                <input
                  type="text"
                  value={nlpQuery}
                  onChange={(e) => setNlpQuery(e.target.value)}
                  placeholder="Örn: Antalya'da denize 10 dk, havuzlu, 3+1 sıfır daire..."
                  className="w-full py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Akıllı Ara</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* PROMPT PILLS */}
          <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Popüler Aramalar:</span>
            {promptPills.map((pill, i) => (
              <button
                key={i}
                onClick={() => handlePillClick(pill)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all font-medium shadow-sm hover:scale-105"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MARKET PULSE TICKER */}
      <MarketPulseTicker />

      {/* 3. QUICK AI VALUATION ENGINE ON HOMEPAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-950 rounded-3xl p-6 md:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Explanations & Controls */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>EstatePulse AVM (Automated Valuation Model)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Evinizin Gerçek Değerini 10 Saniyede Hesaplayın
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Zillow Zestimate benzeri makine öğrenmesi algoritmamız; konum, bina yaşı, kat ve son 10 yıllık tapu satış verilerini analiz ederek mülkünüzün adil piyasa değerini ve 1 yıllık prim potansiyelini öngörür.
              </p>

              {/* Quick Input Controls */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Bölge & Mahalle</label>
                  <select
                    value={calcDistrict}
                    onChange={(e) => handleRecalculateQuickAvm(e.target.value, calcSqm, calcAge)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Kadıköy - Caferağa (Moda)">Kadıköy - Caferağa (Moda) / İstanbul</option>
                    <option value="Kadıköy - Suadiye">Kadıköy - Suadiye / İstanbul</option>
                    <option value="Beşiktaş - Bebek">Beşiktaş - Bebek / İstanbul</option>
                    <option value="Antalya - Konyaaltı">Antalya - Konyaaltı (Gürsu)</option>
                    <option value="Ankara - Çankaya (GOP)">Ankara - Çankaya (GOP)</option>
                    <option value="Bodrum - Yalıkavak">Bodrum - Yalıkavak / Muğla</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Brüt Alan (m²)</label>
                    <input
                      type="number"
                      value={calcSqm}
                      onChange={(e) => handleRecalculateQuickAvm(calcDistrict, Number(e.target.value), calcAge)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Bina Yaşı</label>
                    <select
                      value={calcAge}
                      onChange={(e) => handleRecalculateQuickAvm(calcDistrict, calcSqm, Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      <option value={0}>0 (Sıfır Yapı)</option>
                      <option value={3}>1-5 Yaş</option>
                      <option value={10}>6-15 Yaş</option>
                      <option value={22}>20+ Yaş</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('valuation')}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>Kapsamlı SHAP Raporu ve Resmi Ekspertiz Görünümü &rarr;</span>
                </button>
              </div>
            </div>

            {/* Right: Real-time Live Result Card */}
            <div className="lg:col-span-6 bg-slate-950/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-slate-700/80 shadow-inner space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tahmini Piyasa Değeri</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-brand-950 text-brand-300 border border-brand-800 font-bold">
                  Güven Skoru: %{quickAvmResult.confidenceScore}
                </span>
              </div>

              <div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {quickAvmResult.estimatedPrice.toLocaleString('tr-TR')} ₺
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Güven Aralığı: <span className="font-semibold text-slate-200">{quickAvmResult.lowBound.toLocaleString('tr-TR')} ₺</span> — <span className="font-semibold text-slate-200">{quickAvmResult.highBound.toLocaleString('tr-TR')} ₺</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400 font-medium">Birim m² Değeri</p>
                  <p className="text-lg font-bold text-white mt-0.5">{quickAvmResult.pricePerSqm.toLocaleString('tr-TR')} ₺/m²</p>
                </div>
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <p className="text-[11px] text-slate-400 font-medium">1 Yıllık Prim Tahmini</p>
                  <p className="text-lg font-bold text-brand-400 mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +%{quickAvmResult.appreciation1YearPct}
                  </p>
                </div>
              </div>

              {/* Factors pill */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <p className="text-slate-400 font-semibold">Fiyatı Etkileyen Faktörler (SHAP Değerleri):</p>
                <div className="space-y-1.5">
                  {quickAvmResult.shapBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-300">
                      <span>• {item.factor}</span>
                      <span className={item.positive ? 'text-brand-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {item.positive ? '+' : '-'}{item.amountTRY.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED LISTINGS / HOT DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Yapay Zeka Seçkisi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Öne Çıkan ve Değerinde Fırsatlar
            </h2>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Tüm İlanları Haritada Gör ({properties.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 6).map((property) => (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Image Cover with Badges */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={property.coverImage}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {property.avm.valuationVerdict === 'firsat' && (
                      <span className="bg-brand-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                        ⚡ Fırsat İlanı ({property.avm.discountPercentage}%)
                      </span>
                    )}
                    {property.hasVirtualTour360 && (
                      <span className="bg-slate-950/80 backdrop-blur-md text-white font-bold text-[10px] px-2 py-1 rounded-full border border-white/20 flex items-center gap-1">
                        <Compass className="w-3 h-3 text-brand-400" />
                        360° Tur
                      </span>
                    )}
                    {property.hasVirtualStaging && (
                      <span className="bg-indigo-950/80 backdrop-blur-md text-indigo-300 font-bold text-[10px] px-2 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-indigo-400" />
                        AI Staging
                      </span>
                    )}
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xl font-extrabold tracking-tight drop-shadow-md">
                      {property.price.toLocaleString('tr-TR')} ₺
                    </p>
                    <p className="text-[11px] text-slate-200">
                      AVM Değeri: {property.avm.estimatedPrice.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span className="truncate">{property.neighborhood}, {property.district}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {property.title}
                  </h3>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-slate-400" />
                      <span>{property.roomCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-slate-400" />
                      <span>{property.bathrooms} Banyo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-3.5 h-3.5 text-slate-400" />
                      <span>{property.netSqm} m²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Lifestyle & Agent */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-[11px]">
                    Walk: {property.lifestyle.walkScore}
                  </span>
                  <span className="text-[11px] text-slate-400">Deprem Skoru: {property.lifestyle.earthquakeSoilRisk}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <Star className="w-3 h-3 text-amber-400 fill-current" />
                  <span>{property.agent.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VIRTUAL STAGING & 360 BANNER PROMOTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white border border-emerald-800/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
              Yenilikçi Görselleştirme Teknolojisi
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Boş Daireleri Eşyalandırın, 360° Panoramik Gezin
            </h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Matterport 3D uyumlu web oynatıcı ve Stable Diffusion tabanlı Virtual Staging ile mekanları yerinde hissetmeden evinizden çıkmadan keşfedin.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onSelectProperty(properties[0])}
                className="px-6 py-3 bg-white text-slate-900 hover:bg-emerald-50 rounded-2xl font-bold text-xs shadow-lg transition-all"
              >
                Moda Dairesinde Sanal Turu Aç
              </button>
              <button
                onClick={() => onNavigate('valuation')}
                className="px-6 py-3 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-500/40 text-emerald-200 rounded-2xl font-bold text-xs transition-all"
              >
                Kendi Dairenize AI Staging Uygulayın
              </button>
            </div>
          </div>
          <div className="w-full md:w-80 h-52 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
              alt="Virtual Staging Demo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-slate-900/90 text-brand-300 text-xs font-bold border border-brand-500/40">
                ✨ AI Virtual Staging Aktif
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
