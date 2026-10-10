import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Compass, Move, Sparkles } from 'lucide-react';

interface PanoramaViewerProps {
  imageUrl: string;
  roomTitle?: string;
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({
  imageUrl,
  roomTitle = 'Ana Salon & Manzara'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [yaw, setYaw] = useState(0); // horizontal angle
  const [pitch, setPitch] = useState(0); // vertical angle
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const img = imageRef.current;

    ctx.clearRect(0, 0, width, height);

    // Dynamic cylindrical projection slice simulation
    const srcWidth = img.width / zoom;
    const srcHeight = img.height / zoom;
    
    // Normalize yaw to [0, img.width]
    const normYaw = (((yaw % 360) + 360) % 360) / 360;
    const srcX = normYaw * img.width;
    const srcY = Math.max(0, Math.min(img.height - srcHeight, (img.height / 2 - srcHeight / 2) - (pitch * 3)));

    // Draw wrapping panorama
    ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, width, height);
    if (srcX + srcWidth > img.width) {
      const remainingWidth = (srcX + srcWidth) - img.width;
      const screenRemaining = (remainingWidth / srcWidth) * width;
      ctx.drawImage(img, 0, srcY, remainingWidth, srcHeight, width - screenRemaining, 0, screenRemaining, height);
    }

    // Overlay grid / VR vignette
    const gradient = ctx.createRadialGradient(width / 2, height / 2, width / 4, width / 2, height / 2, width / 1.5);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

  }, [imageLoaded, yaw, pitch, zoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    setYaw(prev => prev - deltaX * 0.4);
    setPitch(prev => Math.max(-40, Math.min(40, prev + deltaY * 0.2)));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full h-[450px] md:h-[520px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl select-none group border border-slate-700/50">
      {/* Top Banner */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white">
        <Compass className="w-5 h-5 text-brand-400 animate-spin-slow" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">360° Sanal Tur (WebXR Modu)</p>
          <p className="text-sm font-medium">{roomTitle}</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 text-xs">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Matterport 3D Uyumlu</span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full object-cover ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      />

      {/* Center Drag Hint (fades out on interact) */}
      {!isDragging && yaw === 0 && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-white/90">
          <div className="p-4 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 mb-3 shadow-xl">
            <Move className="w-8 h-8 text-brand-400 animate-pulse" />
          </div>
          <p className="text-sm font-semibold tracking-wide drop-shadow-md">Gezinmek için basılı tutup sürükleyin</p>
          <p className="text-xs text-slate-300">360° Panoramik Görüş</p>
        </div>
      )}

      {/* Floating Control Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white shadow-xl">
        <button
          onClick={() => setZoom(prev => Math.min(1.8, prev + 0.2))}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
          title="Yakınlaştır"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.8, prev - 0.2))}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
          title="Uzaklaştır"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        <button
          onClick={() => { setYaw(0); setPitch(0); setZoom(1); }}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
          title="Açıyı Sıfırla"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
