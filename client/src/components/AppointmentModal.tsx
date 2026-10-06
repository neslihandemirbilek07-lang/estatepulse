import React, { useState } from 'react';
import { X, Calendar, Video, MapPin, CheckCircle, Clock, Star } from 'lucide-react';
import { Property } from '../types';

interface AppointmentModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ property, isOpen, onClose }) => {
  const [tourType, setTourType] = useState<'in_person' | 'live_video'>('in_person');
  const [selectedDate, setSelectedDate] = useState('Yarın (Salı)');
  const [selectedSlot, setSelectedSlot] = useState('14:30');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const dates = [
    { label: 'Bugün', desc: '5 Ekim' },
    { label: 'Yarın (Salı)', desc: '6 Ekim' },
    { label: 'Çarşamba', desc: '7 Ekim' },
    { label: 'Perşembe', desc: '8 Ekim' }
  ];

  const slots = ['10:30', '13:00', '14:30', '16:00', '17:30', '19:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Calendar className="w-4 h-4" />
              <span>Anlık Randevu & Tur Planlama</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Daireyi Gezin</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Yetkili danışmandan randevu alın veya evinizden canlı video tur ile keşfedin.
            </p>

            {/* Agent preview */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 mb-5">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-500"
              />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Yetkili Danışman</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{property.agent.name}</p>
                <p className="text-xs text-slate-500">{property.agent.agency}</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{property.agent.rating}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tour Type Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTourType('in_person')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    tourType === 'in_person'
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-xs font-bold">Yerinde Gezinti</span>
                  <span className="text-[10px] opacity-75">Dairede Birebir Ziyaret</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTourType('live_video')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    tourType === 'live_video'
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span className="text-xs font-bold">Canlı Video Tur</span>
                  <span className="text-[10px] opacity-75">360° Danışman Rehberliğinde</span>
                </button>
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Tarih Seçin
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setSelectedDate(d.label)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDate === d.label
                          ? 'border-brand-500 bg-brand-500 text-white font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <p className="text-[11px] leading-tight">{d.label}</p>
                      <p className={`text-[10px] ${selectedDate === d.label ? 'text-white/80' : 'text-slate-400'}`}>
                        {d.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Saat Dilimi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        selectedSlot === slot
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 opacity-70" />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all mt-4"
              >
                Randevuyu Onayla ({selectedDate} - {selectedSlot})
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Randevunuz Onaylandı!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              {property.agent.name} randevunuzu takvimine ekledi. Detaylar ve Google Takvim daveti SMS ile iletildi.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
              📅 {selectedDate} — ⏰ {selectedSlot} ({tourType === 'in_person' ? 'Yerinde Ziyaret' : 'Video Tur'})
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
