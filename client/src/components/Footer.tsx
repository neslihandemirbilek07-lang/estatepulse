import React from 'react';
import { Building, ShieldCheck, Heart, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & USP */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                <Building className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Estate<span className="text-brand-500">Pulse</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Zillow'un AVM değerleme gücü, Redfin'in şeffaflığı ve Rightmove'un bölgesel analitiğini Türkiye ve küresel gayrimenkul pazarına taşıyan yapay zeka destekli gayrimenkul ekosistemi.
            </p>
            <div className="flex items-center gap-3 text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>%100 e-Devlet & Tapu Doğrulamalı</span>
              </span>
            </div>
          </div>

          {/* Col 2: Hızlı Keşif */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-xs">Platform Keşfi</p>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('search')} className="hover:text-white transition-colors">Bölünmüş Harita Araması</button></li>
              <li><button onClick={() => onNavigate('valuation')} className="hover:text-white transition-colors">EstatePulse AI Değerleme</button></li>
              <li><button onClick={() => onNavigate('search')} className="hover:text-white transition-colors">360° Sanal Turlu İlanlar</button></li>
              <li><button onClick={() => onNavigate('search')} className="hover:text-white transition-colors">Virtual Staged Portföy</button></li>
              <li><button onClick={() => onNavigate('search')} className="hover:text-white transition-colors">Fırsat Değerlemeli İlanlar</button></li>
            </ul>
          </div>

          {/* Col 3: Kurumsal & Danışman */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-xs">Danışman & Broker</p>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Danışman CRM & Analitik</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Üyelik Paketleri</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Doping & Vitrin Seçenekleri</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Banka & Sigorta Ortaklığı</button></li>
            </ul>
          </div>

          {/* Col 4: İletişim & Lokasyon */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-wider text-xs">İletişim & Merkez</p>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Büyükdere Cad. No: 195, Levent, İstanbul</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+90 (212) 800 24 24</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>destek@estatepulse.ai</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 EstatePulse Inc. Tüm hakları saklıdır. KVKK & GDPR uyumludur.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Kullanım Koşulları</span>
            <span className="hover:text-slate-400 cursor-pointer">Gizlilik Politikası</span>
            <span className="hover:text-slate-400 cursor-pointer">Çerez Tercihleri</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
