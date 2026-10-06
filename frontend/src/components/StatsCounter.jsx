import React from 'react';
import * as Icons from 'lucide-react';

export default function StatsCounter({ metrics = [] }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 text-white relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {metrics.map((item, idx) => {
          const IconComponent = Icons[item.icon] || Icons.Heart;
          return (
            <div key={idx} className={`text-center ${idx !== 0 ? 'pt-6 lg:pt-0 lg:px-6' : 'lg:pr-6'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-primary-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 mx-auto mb-3.5 shadow-sm">
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {item.prefix && <span className="text-lg sm:text-xl text-brand-400 font-semibold">{item.prefix}</span>}
                {item.value}
                {item.suffix && <span className="text-sm font-bold text-slate-300 ml-1">{item.suffix}</span>}
              </div>
              <p className="mt-1 text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
                {item.label}
              </p>
              {item.description && (
                <p className="mt-1 text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
