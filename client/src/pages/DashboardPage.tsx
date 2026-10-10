import React, { useState } from 'react';
import { 
  LayoutDashboard, TrendingUp, Users, DollarSign, Eye, Clock, CheckCircle2, 
  MessageSquare, Calendar, ChevronRight, AlertCircle, ArrowUpRight 
} from 'lucide-react';
import { mockOffers, mockProperties } from '../data/mockData';
import { Property, Offer } from '../types';

interface DashboardPageProps {
  onSelectProperty: (property: Property) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectProperty }) => {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);

  const leads = [
    { name: 'Can Yılmaz', property: 'Kadıköy Moda 3+1', status: 'Teklif Aşamasında', date: 'Bugün 14:20', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    { name: 'Elena Petrova', property: 'Antalya Konyaaltı 3+1', status: 'Randevu Alındı', date: 'Dün 18:40', badge: 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300' },
    { name: 'Serkan Öztürk', property: 'Bodrum Taş Villa', status: 'İlk İletişim', date: '2 gün önce', badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' }
  ];

  const handleAcceptOffer = (offerId: string) => {
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'kabul_edildi' } : o));
    alert('Teklif başarıyla kabul edildi! Dijital Ön Protokol taraflara iletildi.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Danışman & Portföy Yönetim Paneli
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            RE/MAX Cadde & Moda — Mert Aksoy (Pro Danışman Hesabı)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xs border border-brand-300 dark:border-brand-800">
            ★ 4.95 Danışman Skoru
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Aktif Portföy</span>
            <LayoutDashboard className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">18 İlan</p>
          <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium mt-1">+2 yeni bu hafta</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">30 Günlük Ziyaret</span>
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">32.450</p>
          <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium mt-1">%18 artış</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Aktif Teklifler</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{offers.length} Teklif</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">1 karşı teklif beklemede</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Yanıt Süresi & Oranı</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">12 dk / %99</p>
          <p className="text-[11px] text-slate-400 mt-1">Platform ortalamasından %40 hızlı</p>
        </div>
      </div>

      {/* Main Grid: Active Offers (8 cols) & Leads Pipeline (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Offers Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Gelen Şeffaf Teklifler & Müzakereler
            </h2>
            <span className="text-xs text-slate-400">Canlı Senkronize</span>
          </div>

          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {offer.propertyTitle}
                    </span>
                    <p className="text-xs text-slate-500">
                      Alıcı: <span className="font-semibold text-slate-700 dark:text-slate-300">{offer.buyerName}</span> ({offer.buyerPhone})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {offer.amount.toLocaleString('tr-TR')} ₺
                    </p>
                    <p className="text-[11px] text-slate-400">Kapora Taahhüdü: {offer.earnestDeposit.toLocaleString('tr-TR')} ₺</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Geçerlilik: {offer.expiresInHours} Saat
                    </span>
                    {offer.contingentOnMortgage && (
                      <span className="text-slate-500 text-[11px]">• Banka Kredisi Şartlı</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {offer.status === 'kabul_edildi' ? (
                      <span className="px-3 py-1 bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 rounded-lg font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Kabul Edildi
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold shadow-sm transition-all"
                        >
                          Teklifi Kabul Et
                        </button>
                        <button
                          onClick={() => alert(`Karşı teklif modülü açıldı. Mevcut teklif: ${offer.amount.toLocaleString('tr-TR')} TL`)}
                          className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl font-bold transition-all"
                        >
                          Karşı Teklif Sun
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Leads Pipeline (CRM) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Müşteri Adayları (Leads)</h3>
            <span className="text-xs text-brand-600 font-semibold cursor-pointer hover:underline">Tümü</span>
          </div>

          <div className="space-y-3">
            {leads.map((lead, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 dark:text-white">{lead.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${lead.badge}`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-slate-500">{lead.property}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>{lead.date}</span>
                  <span className="text-brand-500 font-semibold cursor-pointer">Detay &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
