import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getCampaignBySlug, resolveImageUrl } from '../services/api';

export default function CampaignDetail({ onOpenDonationModal, setSelectedCampaignForDonation }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCampaignBySlug(slug);
        if (data) {
          setCampaign(data);
        } else {
          setError('Campaign not found.');
        }
      } catch (err) {
        console.error('Error fetching campaign detail:', err);
        setError('Unable to load campaign details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) return <LoadingSpinner text="Loading campaign details..." />;
  if (error || !campaign) return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <ErrorMessage message={error || "Campaign could not be found"} />
      <div className="text-center mt-4">
        <Link to="/campaigns" className="text-sm font-bold text-brand-600 hover:underline">
          ← Return to All Campaigns
        </Link>
      </div>
    </div>
  );

  const isCompleted = campaign.status === 'completed';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Campaigns
        </Link>
      </div>

      {/* Main Campaign Header & Featured Image */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-soft">
        <div className="relative aspect-[21/9] sm:aspect-[16/7] overflow-hidden bg-slate-100">
          <img
            src={resolveImageUrl(campaign.featured_image)}
            alt={campaign.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/YSFLogo.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              isCompleted
                ? 'bg-slate-900/85 text-emerald-300 border border-emerald-500/30'
                : 'bg-brand-600/90 text-white border border-brand-400/30'
            }`}>
              {isCompleted ? '✓ Completed Drive' : '● Active Campaign'}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            {campaign.category_name && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/20 backdrop-blur-md text-brand-200 mb-2 inline-block">
                {campaign.category_name}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {campaign.title}
            </h1>
          </div>
        </div>

        {/* Key Info Bar */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Location</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-brand-500" /> {campaign.location || "Chandrapur, Maharashtra"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Beneficiaries Target</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-primary-500" /> {campaign.target_beneficiaries || "Community Wide"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Timeline / Status</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> {campaign.status === 'completed' ? 'Successfully Finished' : 'Active Ongoing'}
            </span>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                setSelectedCampaignForDonation(campaign);
                onOpenDonationModal();
              }}
              className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" /> Support This Cause
            </button>
          </div>
        </div>
      </div>

      {/* Story & Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Detailed Story */}
        <div className="lg:col-span-8 space-y-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              About This Campaign
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {campaign.description}
            </p>
          </div>

          {campaign.story && (
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Ground Reality & Motivation
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {campaign.story}
              </p>
            </div>
          )}

          {/* Updates if any */}
          {campaign.updates && campaign.updates.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Campaign Progress Updates
              </h3>
              <div className="space-y-4">
                {campaign.updates.map(up => (
                  <div key={up.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-brand-600 uppercase">{up.update_date}</span>
                    <h4 className="text-sm font-bold text-slate-800 mt-0.5">{up.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{up.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: How to Contribute & Transparency Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Direct Support
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your contribution directly covers essential items for this initiative with zero intermediary waste.
            </p>

            <div className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% on-ground verified execution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Official YSF acknowledgment receipt</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Local Chandrapur volunteer coordination</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCampaignForDonation(campaign);
                onOpenDonationModal();
              }}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" /> Pledge Support Now
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
