import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, SlidersHorizontal, Layers, Sparkles, Compass, CheckCircle2, Bed, Bath, Maximize, Star, ChevronDown, Filter, ShieldCheck, X } from 'lucide-react';
import { Property } from '../types';
import { filterAndScoreProperties } from '../utils/nlpSearch';
import L from 'leaflet';

interface SearchPageProps {
  properties: Property[];
  initialQuery?: string;
  onSelectProperty: (property: Property) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  properties,
  initialQuery = '',
  onSelectProperty
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState('Hepsi');
  const [selectedRoom, setSelectedRoom] = useState('Hepsi');
  const [only3D, setOnly3D] = useState(false);
  const [onlyStaged, setOnlyStaged] = useState(false);
  const [onlyFirsat, setOnlyFirsat] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'none' | 'metro' | 'schools' | 'earthquake'>('none');
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  // Filter and score properties
  let filtered = filterAndScoreProperties(properties, query);

  if (selectedCity !== 'Hepsi') {
    filtered = filtered.filter(f => f.property.city === selectedCity);
  }
  if (selectedRoom !== 'Hepsi') {
    filtered = filtered.filter(f => f.property.roomCount === selectedRoom);
  }
  if (only3D) {
    filtered = filtered.filter(f => f.property.hasVirtualTour360);
  }
  if (onlyStaged) {
    filtered = filtered.filter(f => f.property.hasVirtualStaging);
  }
  if (onlyFirsat) {
    filtered = filtered.filter(f => f.property.avm.valuationVerdict === 'firsat');
  }

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([39.9, 32.8], 6);

      // Clean, modern CartoDB Positron / OSM tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add markers for filtered properties
    const bounds = L.latLngBounds([]);

    filtered.forEach(({ property }) => {
      const isSelected = highlightedPropertyId === property.id;
      const isFirsat = property.avm.valuationVerdict === 'firsat';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: ${isSelected ? '#059669' : isFirsat ? '#10b981' : '#0f172a'};
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid ${isSelected ? '#ffffff' : '#34d399'};
            white-space: nowrap;
            cursor: pointer;
            transform: scale(${isSelected ? '1.15' : '1.0'});
            transition: all 0.2s ease;
          ">
            ${isFirsat ? '⚡ ' : ''}${(property.price / 1000000).toFixed(1)}M ₺
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });

      const marker = L.marker([property.lat, property.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setHighlightedPropertyId(property.id);
          onSelectProperty(property);
        });

      bounds.extend([property.lat, property.lng]);
      markersRef.current[property.id] = marker;
    });

    if (filtered.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [filtered.length, highlightedPropertyId, activeLayer]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shrink-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* NLP Search Input */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-brand-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Doğal dille filtrele (örn: deniz, havuz, 3+1)..."
              className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Selects */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="Hepsi">Tüm Şehirler</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Antalya">Antalya</option>
              <option value="Ankara">Ankara</option>
              <option value="Muğla">Muğla (Bodrum)</option>
            </select>

            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="Hepsi">Oda Sayısı (Tümü)</option>
              <option value="3+1">3+1</option>
              <option value="4+1">4+1</option>
              <option value="6+2">6+2 (Villa)</option>
            </select>

            {/* Feature Toggles */}
            <button
              onClick={() => setOnlyFirsat(!onlyFirsat)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap ${
                onlyFirsat
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              <span>⚡ Fırsat İlanlar</span>
            </button>

            <button
              onClick={() => setOnly3D(!only3D)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap ${
                only3D
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>360° Tur</span>
            </button>

            <button
              onClick={() => setOnlyStaged(!onlyStaged)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap ${
                onlyStaged
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Virtual Staged</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Feed (%50), Right Map (%50) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Column: Properties Feed */}
        <div className="w-full md:w-1/2 lg:w-5/12 h-full overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {filtered.length} İlan Bulundu
            </span>
            <span className="text-slate-400">Akıllı Eşleşme Skoruna Göre Sıralı</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="font-semibold">Arama kriterlerine uygun ilan bulunamadı.</p>
              <p className="text-xs">Filtreleri sıfırlamayı veya doğal dil sorgusunu değiştirmeyi deneyin.</p>
            </div>
          ) : (
            filtered.map(({ property, score, matchReasons }) => (
              <div
                key={property.id}
                onMouseEnter={() => setHighlightedPropertyId(property.id)}
                onClick={() => onSelectProperty(property)}
                className={`bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border transition-all cursor-pointer shadow-sm hover:shadow-xl flex flex-col sm:flex-row ${
                  highlightedPropertyId === property.id
                    ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Thumbnail */}
                <div className="sm:w-48 h-44 sm:h-auto relative shrink-0">
                  <img
                    src={property.coverImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.avm.valuationVerdict === 'firsat' && (
                    <span className="absolute top-2 left-2 bg-brand-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow">
                      FIRSAT
                    </span>
                  )}
                  {property.hasVirtualTour360 && (
                    <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/20">
                      360°
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        {property.price.toLocaleString('tr-TR')} ₺
                      </p>
                      {score > 60 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                          % {score} Eşleşme
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-500" />
                      {property.district}, {property.city}
                    </p>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 mb-2">
                      {property.title}
                    </h4>

                    {/* Match reason pills */}
                    {matchReasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {matchReasons.slice(0, 3).map((r, i) => (
                          <span key={i} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium">
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                    <span>{property.roomCount} • {property.netSqm} m²</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      Walk: {property.lifestyle.walkScore}/100
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Interactive Map */}
        <div className="w-full md:w-1/2 lg:w-7/12 h-full relative border-l border-slate-200 dark:border-slate-800">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Lifestyle Layer Controls on Map */}
          <div className="absolute top-4 right-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Yaşam & Risk Katmanları</p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setActiveLayer(activeLayer === 'metro' ? 'none' : 'metro')}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                  activeLayer === 'metro'
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>🚇 Metro & Raylı Sistem</span>
              </button>

              <button
                onClick={() => setActiveLayer(activeLayer === 'schools' ? 'none' : 'schools')}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                  activeLayer === 'schools'
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>🏫 Okul & Başarı Skoru</span>
              </button>

              <button
                onClick={() => setActiveLayer(activeLayer === 'earthquake' ? 'none' : 'earthquake')}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                  activeLayer === 'earthquake'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>🛡️ Zemin / Deprem Haritası</span>
              </button>
            </div>
          </div>

          {/* Active Layer Legend Notification */}
          {activeLayer === 'earthquake' && (
            <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 text-white p-3 rounded-2xl border border-amber-500/40 shadow-2xl text-xs max-w-xs">
              <p className="font-bold text-amber-400 mb-1">MTA & AFAD Zemin Sağlamlık Verisi</p>
              <p className="text-[11px] text-slate-300">
                1.0 - 2.0 arası: Yüksek taşıma kapasiteli kayaç zemin. Listelenen tüm binalarımız zemin etütlüdür.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
