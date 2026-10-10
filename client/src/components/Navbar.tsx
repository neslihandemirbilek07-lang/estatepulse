import React from 'react';
import { Building, Search, Sparkles, MapPin, LayoutDashboard, PlusCircle, Moon, Sun, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Estate<span className="text-brand-500">Pulse</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded-full border border-brand-300 dark:border-brand-800">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Yeni Nesil Emlak Ekosistemi</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              currentPage === 'home'
                ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ana Sayfa
          </button>

          <button
            onClick={() => onNavigate('search')}
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              currentPage === 'search'
                ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4 text-brand-500" />
            <span>İlanlar & Harita</span>
          </button>

          <button
            onClick={() => onNavigate('valuation')}
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              currentPage === 'valuation'
                ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Değerleme (AVM)</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              currentPage === 'dashboard'
                ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-500" />
            <span>Danışman Paneli</span>
          </button>

          <button
            onClick={() => onNavigate('pricing')}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              currentPage === 'pricing'
                ? 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paketler & Gelir
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Koyu / Açık Mod"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick List Property CTA */}
          <button
            onClick={() => onNavigate('valuation')}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>İlan Ver & AI Değerle</span>
          </button>

          {/* User Avatar */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-brand-500 cursor-pointer overflow-hidden flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200"
            title="Profilim / Danışman Paneli"
          >
            EP
          </div>
        </div>
      </div>
    </header>
  );
};
