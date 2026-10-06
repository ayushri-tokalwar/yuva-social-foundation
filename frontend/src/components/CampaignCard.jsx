import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Heart, Users, Calendar, ShieldCheck } from 'lucide-react';
import { resolveImageUrl } from '../services/api';

export default function CampaignCard({ campaign, onSupportClick }) {
  if (!campaign) return null;

  const isCompleted = campaign.status === 'completed';
  const isUpcoming = campaign.status === 'upcoming';

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col group hover:-translate-y-1.5">
      {/* Image Thumbnail with Overlay Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={resolveImageUrl(campaign.featured_image)}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/YSFLogo.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
            isCompleted
              ? 'bg-slate-900/85 text-emerald-300 border border-emerald-500/30'
              : isUpcoming
              ? 'bg-blue-900/85 text-blue-200 border border-blue-400/30'
              : 'bg-brand-600/90 text-white border border-brand-400/30'
          }`}>
            {isCompleted ? '✓ Completed' : isUpcoming ? 'Upcoming' : '● Active Drive'}
          </span>
        </div>

        {/* Category Tag */}
        {campaign.category_name && (
          <div className="absolute bottom-3.5 left-3.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
              {campaign.category_name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
            <Link to={`/campaigns/${campaign.slug}`}>
              {campaign.title}
            </Link>
          </h3>

          <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {campaign.description}
          </p>

          {/* Key metadata points */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
            {campaign.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                <span className="truncate max-w-[160px]">{campaign.location}</span>
              </span>
            )}
            {campaign.target_beneficiaries && (
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <Users className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                <span>{campaign.target_beneficiaries}</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Link
            to={`/campaigns/${campaign.slug}`}
            className="text-xs font-bold text-slate-700 hover:text-brand-600 transition-colors flex items-center gap-1"
          >
            Read Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {!isCompleted && onSupportClick && (
            <button
              onClick={() => onSupportClick(campaign)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white text-xs font-bold transition-all border border-brand-200 hover:border-transparent flex items-center gap-1.5 shadow-sm"
            >
              <Heart className="w-3 h-3 fill-current" /> Support
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
