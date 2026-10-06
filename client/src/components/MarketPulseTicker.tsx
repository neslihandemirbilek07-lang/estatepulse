import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';
import { mockMarketPulse } from '../data/mockData';

export const MarketPulseTicker: React.FC = () => {
  return (
    <div className="bg-slate-900 border-y border-slate-800 text-slate-300 py-2.5 overflow-hidden text-xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Title */}
        <div className="flex items-center gap-2 font-bold text-white shrink-0 pr-3 border-r border-slate-700">
          <Activity className="w-4 h-4 text-brand-400 animate-pulse" />
          <span className="tracking-wide">Piyasa Nabzı (Ekim 2026):</span>
        </div>

        {/* Scrolling item list */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
          {mockMarketPulse.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">{item.city}</span>
              <span className="text-slate-400">Ort. m²: {item.avgSqm}</span>
              <span className="inline-flex items-center gap-0.5 text-brand-400 font-bold bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-800/40">
                <TrendingUp className="w-3 h-3" />
                {item.changeMonth}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
