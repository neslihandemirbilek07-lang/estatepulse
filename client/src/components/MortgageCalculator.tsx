import React, { useState } from 'react';
import { Calculator, Percent, Building2, ChevronRight, Check } from 'lucide-react';

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ propertyPrice }) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(120); // 10 years
  const monthlyRate = 0.0299; // 2.99% per month

  const downPaymentAmount = Math.round((propertyPrice * downPaymentPercent) / 100);
  const loanPrincipal = propertyPrice - downPaymentAmount;

  // Monthly annuity formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  const r = monthlyRate;
  const n = loanTermMonths;
  const monthlyPayment = Math.round(
    loanPrincipal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  );
  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - loanPrincipal;

  // Additional purchase fees
  const deedTax = Math.round(propertyPrice * 0.04); // %4 tapu harcı
  const revolvingFundFee = 14500; // Döner sermaye
  const agentCommission = Math.round(propertyPrice * 0.02 * 1.20); // %2 + KDV

  const banks = [
    { name: 'İş Bankası', rate: '%2.95', badge: 'En Uygun Faiz' },
    { name: 'Garanti BBVA', rate: '%2.99', badge: 'Anında Ön Onay' },
    { name: 'Yapı Kredi', rate: '%3.05', badge: 'Esnek Ödemeli' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs uppercase tracking-wider mb-1">
        <Calculator className="w-4 h-4" />
        <span>Finansman & Kredi Hesaplayıcı</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Aylık Kredi Taksit Analizi</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Sliders & Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Peşinat Tutarı (%{downPaymentPercent})</span>
              <span className="text-slate-900 dark:text-white font-bold">{downPaymentAmount.toLocaleString('tr-TR')} ₺</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Vade Süresi</span>
              <span className="text-slate-900 dark:text-white font-bold">{loanTermMonths} Ay ({loanTermMonths / 12} Yıl)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[36, 60, 120, 180].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setLoanTermMonths(term)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    loanTermMonths === term
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {term} Ay
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/50 flex justify-between items-center text-xs">
            <span className="text-slate-500">Kredi Tutarı (Anapara):</span>
            <span className="font-bold text-slate-900 dark:text-white">{loanPrincipal.toLocaleString('tr-TR')} ₺</span>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between border border-slate-800">
          <div>
            <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-1">Tahmini Aylık Taksit</p>
            <p className="text-3xl font-extrabold text-white mb-2">
              {monthlyPayment.toLocaleString('tr-TR')} ₺
              <span className="text-xs font-normal text-slate-400 ml-1">/ ay</span>
            </p>
            <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Toplam Geri Ödeme:</span>
                <span className="font-semibold">{totalPayment.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Aylık Faiz Oranı:</span>
                <span className="font-semibold text-brand-400">%{(monthlyRate * 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Anlaşmalı bankalara konut kredisi ön başvurunuz yönlendirildi.')}
            className="w-full mt-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-brand-500/20"
          >
            <span>Ön Onaylı Krediye Başvur</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Additional Acquisition Expenses Breakdown */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
          Öngörülen Ek Alım Masrafları
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <p className="text-slate-400">Tapu Harcı (%4):</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{deedTax.toLocaleString('tr-TR')} ₺</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <p className="text-slate-400">Hizmet Bedeli (%2+KDV):</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{agentCommission.toLocaleString('tr-TR')} ₺</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
            <p className="text-slate-400">Döner Sermaye Harcı:</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{revolvingFundFee.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
      </div>
    </div>
  );
};
