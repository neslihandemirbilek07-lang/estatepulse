import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Share2, Heart, ShieldCheck, Sparkles, Compass, Layers, 
  Bed, Bath, Maximize, Calendar, Phone, MessageSquare, TrendingUp, Check, 
  Building2, DollarSign, Clock, HelpCircle, Star, Award
} from 'lucide-react';
import { Property } from '../types';
import { PanoramaViewer } from '../components/PanoramaViewer';
import { VirtualStagingSlider } from '../components/VirtualStagingSlider';
import { OfferModal } from '../components/OfferModal';
import { AppointmentModal } from '../components/AppointmentModal';
import { MortgageCalculator } from '../components/MortgageCalculator';

interface PropertyDetailPageProps {
  property: Property;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  onBack,
  onNavigate
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | '360' | 'staging'>('photos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Arama Sonuçlarına Dön</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('İlan bağlantısı panoya kopyalandı!');
            }}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-500 shadow-sm transition-colors"
            title="Paylaş"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-2.5 rounded-xl border shadow-sm transition-colors ${
              isFavorited
                ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/60 dark:border-rose-900'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500'
            }`}
            title="Favorilere Ekle"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Title & Location Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-800">
            {property.propertyType.toUpperCase()} • {property.listingType === 'satilik' ? 'SATILIK' : 'KİRALIK'}
          </span>
          {property.isVerified && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900 text-white flex items-center gap-1 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Tapu Doğrulanmış İlan</span>
            </span>
          )}
          {property.avm.valuationVerdict === 'firsat' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fırsat İlanı (Piyasanın %{Math.abs(property.avm.discountPercentage || 0)} Altında)</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {property.title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
          <span>{property.addressLine} — {property.neighborhood}, {property.district} / {property.city}</span>
        </p>
      </div>

      {/* MEDIA SHOWCASE TABS */}
      <div className="space-y-4">
        {/* Media Switcher Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveMediaTab('photos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMediaTab === 'photos'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Fotoğraf Galerisi ({property.images.length})</span>
          </button>

          {property.hasVirtualTour360 && (
            <button
              onClick={() => setActiveMediaTab('360')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeMediaTab === '360'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                  : 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>360° Sanal Tur (WebXR)</span>
            </button>
          )}

          {property.hasVirtualStaging && (
            <button
              onClick={() => setActiveMediaTab('staging')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeMediaTab === 'staging'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>AI Virtual Staging (Sanal Mobilyalama)</span>
            </button>
          )}
        </div>

        {/* Tab 1: Photos Grid */}
        {activeMediaTab === 'photos' && (
          <div className="space-y-3">
            <div className="h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative">
              <img
                src={property.images[selectedPhotoIndex] || property.coverImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails row */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedPhotoIndex === idx
                      ? 'border-brand-500 scale-105 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="küçük görsel" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: 360 Panorama Canvas */}
        {activeMediaTab === '360' && property.panoramaImageUrl && (
          <PanoramaViewer imageUrl={property.panoramaImageUrl} roomTitle={property.title} />
        )}

        {/* Tab 3: Virtual Staging Slider */}
        {activeMediaTab === 'staging' && (
          <VirtualStagingSlider stagingPairs={property.stagingPairs} />
        )}
      </div>

      {/* Main Details Grid: Left Content (8 Cols), Right Sticky Action Box (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Specs Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="p-2">
              <p className="text-xs text-slate-400">Oda Sayısı</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{property.roomCount}</p>
            </div>
            <div className="p-2 border-l border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400">Net / Brüt Alan</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{property.netSqm} / {property.grossSqm} m²</p>
            </div>
            <div className="p-2 border-l border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400">Bulunduğu Kat</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{property.floor}. Kat / {property.totalFloors}</p>
            </div>
            <div className="p-2 border-l border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400">Bina Yaşı</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{property.buildingAge === 0 ? '0 (Sıfır)' : `${property.buildingAge} Yaş`}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">İlan Açıklaması</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-brand-500" />
                <span>Isıtma: {property.heating}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-brand-500" />
                <span>Balkon: {property.hasBalcony ? 'Mevcut' : 'Yok'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-brand-500" />
                <span>Otopark: {property.hasParking ? 'Kapalı Otopark' : 'Açık'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-brand-500" />
                <span>Asansör: {property.hasElevator ? 'Var' : 'Yok'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-brand-500" />
                <span>Havuz: {property.hasPool ? 'Açık Havuz' : 'Yok'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-brand-500" />
                <span>Tapu Durumu: {property.deedStatus}</span>
              </div>
            </div>
          </div>

          {/* ESTATEPULSE AI DEĞERLEME (AVM) DEEP DIVE CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-navy-950 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>EstatePulse AVM Değerleme Raporu</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-950 text-brand-300 border border-brand-700/60 font-bold">
                Algoritma Güveni: %{property.avm.confidenceScore}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-xs text-slate-400">Hesaplanan Adil Piyasa Değeri</p>
                <p className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {property.avm.estimatedPrice.toLocaleString('tr-TR')} ₺
                </p>
                <p className="text-xs text-slate-300 mt-2">
                  Değerleme Aralığı: <span className="font-semibold text-brand-400">{property.avm.lowBound.toLocaleString('tr-TR')} ₺</span> — <span className="font-semibold text-brand-400">{property.avm.highBound.toLocaleString('tr-TR')} ₺</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  <p className="text-slate-400">1 Yıllık Prim Tahmini</p>
                  <p className="text-lg font-bold text-brand-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +%{property.avm.projectedAppreciation1Year}
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  <p className="text-slate-400">Tahmini Aylık Kira</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {property.avm.rentalYieldEstimatedMonthly.toLocaleString('tr-TR')} ₺
                  </p>
                </div>
              </div>
            </div>

            {/* SHAP Factor Breakdown */}
            <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
              <p className="text-slate-400 font-semibold mb-2">Fiyatı Belirleyen Temel Özellikler (SHAP Analizi):</p>
              <div className="space-y-2">
                {property.avm.shapFactors.map((f, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                    <div>
                      <p className="font-bold text-slate-200">{f.factor}</p>
                      <p className="text-[11px] text-slate-400">{f.description}</p>
                    </div>
                    <span className={`font-bold ml-3 text-xs ${f.isPositive ? 'text-brand-400' : 'text-rose-400'}`}>
                      {f.isPositive ? '+' : '-'}{f.impactTRY.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LIFESTYLE MATRIX (15-MINUTE CITY INDEX) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Bölgesel Yaşam & Güvenlik Matrisi (15-Dakika Şehir İndeksi)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400">Yürüyüş Skoru</p>
                <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">{property.lifestyle.walkScore}/100</p>
                <p className="text-[10px] text-slate-500 mt-1">Günlük ihtiyaçlar yürüme menzilinde</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400">Toplu Taşıma Skoru</p>
                <p className="text-2xl font-black text-indigo-500 mt-1">{property.lifestyle.transitScore}/100</p>
                <p className="text-[10px] text-slate-500 mt-1">Metroya {property.lifestyle.nearestMetroDistanceMeters}m mesafe</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400">Okul & Eğitim Skoru</p>
                <p className="text-2xl font-black text-amber-500 mt-1">{property.lifestyle.schoolScore}/100</p>
                <p className="text-[10px] text-slate-500 mt-1">Yüksek sınav başarı ortalaması</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400">Zemin & Deprem Endeksi</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{property.lifestyle.earthquakeSoilRisk} / 5.0</p>
                <p className="text-[10px] text-slate-500 mt-1">Sağlam kayaç zemin katsayısı</p>
              </div>
            </div>
          </div>

          {/* PRICE HISTORY CHART */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">İlan Fiyat Geçmişi & Trend</h3>
            <div className="space-y-3">
              {property.priceHistory.map((point, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{point.date}</span>
                    <span className="text-slate-400 ml-2">({point.label})</span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {point.price.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Mortgage Calculator */}
          <MortgageCalculator propertyPrice={property.price} />
        </div>

        {/* Right Sticky Action Column (4 Cols) */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          {/* Main Action Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <p className="text-xs text-slate-400 font-medium">Satış Fiyatı</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {property.price.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Net m² birim fiyatı: <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.round(property.price / property.netSqm).toLocaleString('tr-TR')} ₺</span>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => setIsOfferModalOpen(true)}
                className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <DollarSign className="w-4 h-4" />
                <span>Şeffaf Teklif Ver (Pazarlık Yap)</span>
              </button>

              <button
                onClick={() => setIsAppointmentModalOpen(true)}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Canlı / Yerinde Randevu Al</span>
              </button>
            </div>

            {/* Certified Agent Card */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{property.agent.name}</p>
                    <Award className="w-4 h-4 text-brand-500 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-400 truncate">{property.agent.agency}</p>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{property.agent.rating} ({property.agent.reviewCount} Değerlendirme)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Ara</span>
                </a>
                <a
                  href={`https://wa.me/905325554433?text=Merhaba, EstatePulse'daki ${property.title} ilanınız hakkında bilgi almak istiyorum.`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      <OfferModal
        property={property}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        property={property}
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
};
