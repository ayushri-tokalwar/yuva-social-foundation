import React from 'react';
import * as Icons from 'lucide-react';
import { resolveImageUrl } from '../services/api';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ServiceCard({ service, onSelect }) {
  if (!service) return null;

  // Dynamically resolve icon from Lucide
  const IconComponent = Icons[service.icon] || Icons.Heart;

  const keyPoints = service.key_points_list || (
    service.key_points ? service.key_points.split('\n').filter(p => p.trim()) : []
  );

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-150 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group hover:-translate-y-1.5">
      {/* Visual Image Header */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={resolveImageUrl(service.image)}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/YSFLogo.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        
        {/* Floating Icon Box */}
        <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-brand-600 border border-white/40">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            {service.title}
          </h3>

          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            {service.short_description}
          </p>

          {/* Key Bullet Highlights */}
          {keyPoints.length > 0 && (
            <ul className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
              {keyPoints.slice(0, 3).map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Read More / Learn Action */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider">
            Community Welfare
          </span>
          {onSelect && (
            <button
              onClick={() => onSelect(service)}
              className="text-xs font-bold text-slate-700 hover:text-brand-600 flex items-center gap-1 transition-colors"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
