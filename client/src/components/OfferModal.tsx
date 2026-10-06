import React, { useState } from 'react';
import { X, ShieldCheck, Clock, CheckCircle2, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property } from '../types';

interface OfferModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({ property, isOpen, onClose }) => {
  const [offerAmount, setOfferAmount] = useState<number>(Math.round(property.price * 0.95 / 10000) * 10000);
  const [earnestDeposit, setEarnestDeposit] = useState<number>(100000);
  const [contingency, setContingency] = useState<boolean>(true);
  const [step, setStep] = useState<'form' | 'submitted' | 'counter'>('form');
  const [counterPrice, setCounterPrice] = useState<number>(Math.round(property.price * 0.98 / 10000) * 10000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('submitted');

    // Simulate seller review and counter-offer after 2 seconds
    setTimeout(() => {
      setStep('counter');
    }, 2200);
  };

  const handleAcceptCounter = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert('Tebrikler! Satıcı ile anlaşma sağlandı. Dijital Ön Protokol SMS ve E-posta adresinize gönderildi.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' && (
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Güvenli & Şeffaf Pazarlık Altyapısı</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Resmi Teklif Oluştur</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Teklifiniz doğrudan mülk sahibine ve yetkili danışmana 48 saatlik geçerlilik süresiyle iletilir.
            </p>

            {/* Property Summary Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Liste Satış Fiyatı</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {property.price.toLocaleString('tr-TR')} ₺
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-700/40">
                  AVM: {property.avm.estimatedPrice.toLocaleString('tr-TR')} ₺
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Teklif Ettiğiniz Tutar (₺)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₺</span>
                  <input
                    type="number"
                    step="10000"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                  <span>Fark: {(offerAmount - property.price).toLocaleString('tr-TR')} ₺</span>
                  <span className="text-brand-600 dark:text-brand-400 font-medium">
                    %{Math.round(((offerAmount - property.price) / property.price) * 100)} İndirim Teklifi
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Dijital Kapora Taahhüdü (Escrow Güvencesi)
                </label>
                <select
                  value={earnestDeposit}
                  onChange={(e) => setEarnestDeposit(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  <option value={50000}>50.000 ₺ (Standart Ön Rezervasyon)</option>
                  <option value={100000}>100.000 ₺ (Önerilen - Yüksek Alıcı Güveni)</option>
                  <option value={250000}>250.000 ₺ (Ciddi Alıcı Taahhüdü)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  *Kapora tutarı satıcı teklifi onaylayana kadar bloke edilmez, yalnızca niyet teminatıdır.
                </p>
              </div>

              {/* Contingency */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <input
                  type="checkbox"
                  id="contingency"
                  checked={contingency}
                  onChange={(e) => setContingency(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="contingency" className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold block text-slate-900 dark:text-white">Banka Konut Kredisi Onay Şartı</span>
                  Banka kredisi onaylanmazsa teklif cezai şart olmaksızın iptal edilebilir.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Resmi Teklifi Satıcıya İlet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 'submitted' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-950/80 border border-brand-500/30 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Teklif Satıcıya İletildi</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Teklifiniz <span className="font-bold text-slate-800 dark:text-slate-200">{offerAmount.toLocaleString('tr-TR')} ₺</span> olarak iletildi. Mülk sahibi inceliyor...
            </p>
            <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="w-full h-full bg-brand-500 animate-pulse" />
            </div>
          </div>
        )}

        {step === 'counter' && (
          <div>
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Satıcı Karşı Teklif Sundu!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Satıcı teklifinizi değerlendirdi ve aşağıdaki fiyat ile anlaşmaya hazır olduğunu belirtti.
            </p>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold uppercase tracking-wider">
                  Satıcının Karşı Teklifi:
                </span>
                <span className="text-xs bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                  Kalan Süre: 47:54:12
                </span>
              </div>
              <p className="text-3xl font-extrabold text-amber-900 dark:text-amber-200 mb-2">
                {counterPrice.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                (Orijinal fiyata göre {(property.price - counterPrice).toLocaleString('tr-TR')} ₺ avantaj)
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAcceptCounter}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Karşı Teklifi Kabul Et & Ön Protokol İmzala</span>
              </button>

              <button
                onClick={() => setStep('form')}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-colors"
              >
                Yeni Bir Teklif Yaz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
