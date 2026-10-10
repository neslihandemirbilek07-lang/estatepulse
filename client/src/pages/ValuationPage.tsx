import React, { useState } from 'react';
import { Sparkles, Calculator, TrendingUp, ShieldCheck, CheckCircle2, ChevronRight, DollarSign, Building } from 'lucide-react';
import { calculateAVMValuation, AVMResult } from '../utils/avmEngine';

interface ValuationPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ValuationPage: React.FC<ValuationPageProps> = ({ onNavigate }) => {
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('Kadıköy - Caferağa (Moda)');
  const [grossSqm, setGrossSqm] = useState(135);
  const [buildingAge, setBuildingAge] = useState(0);
  const [floor, setFloor] = useState(3);
  const [totalFloors, setTotalFloors] = useState(6);
  const [hasElevator, setHasElevator] = useState(true);
  const [hasParking, setHasParking] = useState(true);
  const [hasView, setHasView] = useState(true);

  const [result, setResult] = useState<AVMResult | null>(() => calculateAVMValuation({
    city: 'İstanbul',
    district: 'Kadıköy - Caferağa (Moda)',
    grossSqm: 135,
    buildingAge: 0,
    floor: 3,
    totalFloors: 6,
    hasElevator: true,
    hasParking: true,
    hasView: true,
    deedStatus: 'Kat Mülkiyeti'
  }));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateAVMValuation({
      city,
      district,
      grossSqm,
      buildingAge,
      floor,
      totalFloors,
      hasElevator,
      hasParking,
      hasView,
      deedStatus: 'Kat Mülkiyeti'
    });
    setResult(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-300 dark:border-brand-800">
          <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Otomatize Gayrimenkul Değerleme Motoru (AVM)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Evinizin Gerçek Değerini ve Primini Keşfedin
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Tapu kayıtları, güncel piyasa satışları ve makroekonomik değişkenler CatBoost & Mekansal Regresyon modelimizle saniyeler içinde hesaplanır.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-500" />
            <span>Konut Parametreleri</span>
          </h2>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Şehir</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="İstanbul">İstanbul</option>
                <option value="Antalya">Antalya</option>
                <option value="Ankara">Ankara</option>
                <option value="Muğla">Muğla (Bodrum)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">İlçe / Mahalle</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Kadıköy - Caferağa (Moda)">Kadıköy - Caferağa (Moda)</option>
                <option value="Kadıköy - Suadiye">Kadıköy - Suadiye</option>
                <option value="Beşiktaş - Bebek">Beşiktaş - Bebek</option>
                <option value="Antalya - Konyaaltı">Antalya - Konyaaltı (Gürsu)</option>
                <option value="Ankara - Çankaya (GOP)">Ankara - Çankaya (GOP)</option>
                <option value="Bodrum - Yalıkavak">Bodrum - Yalıkavak</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Brüt Alan (m²)</label>
                <input
                  type="number"
                  value={grossSqm}
                  onChange={(e) => setGrossSqm(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bina Yaşı</label>
                <select
                  value={buildingAge}
                  onChange={(e) => setBuildingAge(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={0}>0 (Sıfır Yapı)</option>
                  <option value={2}>1 - 3 Yaş</option>
                  <option value={7}>4 - 10 Yaş</option>
                  <option value={15}>11 - 20 Yaş</option>
                  <option value={25}>20+ Yaş</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kat</label>
                <input
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Toplam Kat</label>
                <input
                  type="number"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={hasElevator}
                  onChange={(e) => setHasElevator(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Asansör Mevcut</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={hasParking}
                  onChange={(e) => setHasParking(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Otopark (Açık/Kapalı)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={hasView}
                  onChange={(e) => setHasView(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Deniz / Şehir / Doğa Manzarası</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Yeniden Değerle</span>
            </button>
          </form>
        </div>

        {/* Results Column (7 cols) */}
        {result && (
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                  EstatePulse AVM Raporu
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-950 text-brand-300 border border-brand-700/50 text-xs font-bold">
                  Model Doğruluğu: %{result.confidenceScore}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400">Öngörülen Piyasa Değeri</p>
                <p className="text-4xl sm:text-5xl font-black text-white mt-1">
                  {result.estimatedPrice.toLocaleString('tr-TR')} ₺
                </p>
                <p className="text-xs text-slate-300 mt-2">
                  %95 Güven Aralığı: <span className="font-bold text-brand-400">{result.lowBound.toLocaleString('tr-TR')} ₺</span> — <span className="font-bold text-brand-400">{result.highBound.toLocaleString('tr-TR')} ₺</span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-slate-400">Birim m²</p>
                  <p className="text-base font-bold text-white mt-0.5">{result.pricePerSqm.toLocaleString('tr-TR')} ₺</p>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-slate-400">1 Yıl Prim</p>
                  <p className="text-base font-bold text-brand-400 mt-0.5">+{result.appreciation1YearPct}%</p>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-slate-400">Aylık Kira</p>
                  <p className="text-base font-bold text-white mt-0.5">{result.rentalEstimateMonthly.toLocaleString('tr-TR')} ₺</p>
                </div>
              </div>

              {/* SHAP Breakdown */}
              <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
                <p className="font-bold text-slate-300 mb-2">Değerlemeyi Etkileyen Öznitelikler (SHAP Feature Importance):</p>
                {result.shapBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-300">• {item.factor}</span>
                    <span className={`font-bold ${item.positive ? 'text-brand-400' : 'text-rose-400'}`}>
                      {item.positive ? '+' : '-'}{item.amountTRY.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    alert('Değerleme verileriniz ile ilan taslağınız hazırlandı!');
                    onNavigate('dashboard');
                  }}
                  className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Bu Değerle İlan Yayınla & AI Staging Uygula</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
