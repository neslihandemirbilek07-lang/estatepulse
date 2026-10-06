import React, { useState, useRef } from 'react';
import { Sparkles, SlidersHorizontal, Layers, CheckCircle2 } from 'lucide-react';
import { VirtualStagingPair } from '../types';

interface VirtualStagingSliderProps {
  stagingPairs?: VirtualStagingPair[];
}

export const VirtualStagingSlider: React.FC<VirtualStagingSliderProps> = ({ stagingPairs }) => {
  const defaultPair = stagingPairs && stagingPairs.length > 0 ? stagingPairs[0] : {
    roomName: 'Salon & Yaşam Alanı',
    styleName: 'Modern İskandinav',
    emptyImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    stagedImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
  };

  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedStyle, setSelectedStyle] = useState('Modern İskandinav');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const styles = [
    { id: 'scandinavian', name: 'Modern İskandinav', color: 'from-emerald-500 to-teal-600' },
    { id: 'luxury', name: 'Lüks Modern', color: 'from-amber-500 to-orange-600' },
    { id: 'minimalist', name: 'Minimalist Japandi', color: 'from-indigo-500 to-purple-600' }
  ];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl text-white">
      {/* Header with Style Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-brand-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Generative AI Virtual Staging (Sanal Mobilyalama)</span>
          </div>
          <h3 className="text-xl font-bold text-white">Boş Alanı Yapay Zeka ile Canlandırın</h3>
          <p className="text-xs text-slate-400">Kaydırıcıyı sağa-sola çekerek boş daire ile mobilyalanmış hali arasındaki farkı görün.</p>
        </div>

        {/* Style Selector Pills */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-white/10 overflow-x-auto">
          {styles.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedStyle === style.name
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {selectedStyle === style.name && <CheckCircle2 className="w-3.5 h-3.5" />}
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Slider Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-slate-700/60 group"
      >
        {/* After Image (Full width background - Furnished) */}
        <img
          src={defaultPair.stagedImageUrl}
          alt="AI Mobilyalanmış"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Before Image (Clipped overlay - Empty) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={defaultPair.emptyImageUrl}
            alt="Orijinal Boş Hali"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          />
        </div>

        {/* Slider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-brand-500 text-slate-800 transition-transform group-hover:scale-110">
            <SlidersHorizontal className="w-4 h-4 text-brand-600 rotate-90" />
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-slate-200">
          📍 Orijinal Boş Daire
        </div>

        <div className="absolute bottom-4 right-4 z-20 bg-brand-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-brand-500/30 text-xs font-semibold text-brand-300 flex items-center gap-1.5 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>AI Tasarım: {selectedStyle}</span>
        </div>
      </div>

      {/* Feature Footnote */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          <span>Mimari perspektif kilitli Stable Diffusion XL + ControlNet mimarisi</span>
        </div>
        <span className="text-brand-400 font-medium cursor-pointer hover:underline">
          Bu daire için kendi mobilya tarzınızı deneyin &rarr;
        </span>
      </div>
    </div>
  );
};
