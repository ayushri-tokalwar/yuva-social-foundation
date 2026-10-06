import React from 'react';
import { Phone, ShieldCheck, User } from 'lucide-react';
import { resolveImageUrl } from '../services/api';

export default function TeamCard({ member }) {
  if (!member) return null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-150 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col text-center group hover:-translate-y-1.5 p-5">
      {/* Circular Profile Photo */}
      <div className="relative mx-auto mb-4">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-brand-50 shadow-md mx-auto group-hover:border-brand-200 transition-colors bg-slate-100 flex items-center justify-center">
          <img
            src={resolveImageUrl(member.photo)}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/YSFLogo.jpg";
            }}
          />
        </div>
        {member.is_leader && (
          <span className="absolute bottom-0 right-1/2 translate-x-1/2 px-2.5 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
            Core Lead
          </span>
        )}
      </div>

      {/* Member Details */}
      <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
        {member.name}
      </h4>
      <p className="text-xs font-semibold text-brand-700 mt-0.5">
        {member.role}
      </p>

      {member.bio && (
        <p className="mt-2.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {member.bio}
        </p>
      )}

      {/* Contact info link if available */}
      {member.phone && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <a
            href={`tel:${member.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors bg-slate-50 hover:bg-brand-50 px-3 py-1.5 rounded-xl border border-slate-200 w-full"
          >
            <Phone className="w-3 h-3 text-brand-500" />
            <span>{member.phone}</span>
          </a>
        </div>
      )}
    </div>
  );
}
