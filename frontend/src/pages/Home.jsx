import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Ambulance, 
  ArrowRight, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Utensils, 
  BookOpen, 
  Calendar,
  Layers,
  ChevronRight,
  Award
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import CampaignCard from '../components/CampaignCard';
import ServiceCard from '../components/ServiceCard';
import StatsCounter from '../components/StatsCounter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  getFoundationOverview, 
  getFeaturedCampaigns, 
  getServices, 
  getGalleryItems,
  resolveImageUrl 
} from '../services/api';

export default function Home({ onOpenVolunteerModal, onOpenDonationModal, setSelectedCampaignForDonation }) {
  const [overview, setOverview] = useState(null);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [services, setServices] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHomeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, campaignsData, servicesData, galleryData] = await Promise.all([
        getFoundationOverview(),
        getFeaturedCampaigns(),
        getServices(),
        getGalleryItems({ featured: 'true' })
      ]);
      setOverview(overviewData);
      setFeaturedCampaigns(campaignsData.slice(0, 3));
      setServices(servicesData.slice(0, 6));
      setGalleryPreview(galleryData.slice(0, 6));
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('Unable to load some parts of the homepage. Displaying offline snapshot.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleSupportCampaign = (campaign) => {
    setSelectedCampaignForDonation(campaign);
    onOpenDonationModal();
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      
      {/* =========================================================
          HERO SECTION (High-impact visual storytelling)
          ========================================================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white pt-12 pb-20">
        {/* Background Image Backdrop with Dark Tint */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/YSF51.jpeg"
            alt="Yuva Social Foundation Welfare Activity"
            className="w-full h-full object-cover object-center opacity-25 scale-105 animate-pulse-slow"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/logo.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />
        </div>

        {/* Hero Decorative Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-lg backdrop-blur-md animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
            Non-Profit Social Welfare Organization • Chandrapur, Maharashtra
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
            Welcome to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Yuva Social Foundation
            </span>
          </h1>

          {/* Mission Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed mb-10 font-normal">
            Standing by underprivileged communities since 2017. Providing <strong className="text-white">24/7 emergency ambulance support</strong>, <strong className="text-white">daily food donation</strong>, <strong className="text-white">blood donation camps</strong>, and <strong className="text-white">child education assistance</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenDonationModal}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2.5"
            >
              <Heart className="w-5 h-5 fill-white" />
              Donate / Support
            </button>

            <button
              onClick={onOpenVolunteerModal}
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base backdrop-blur-md border border-white/20 hover:border-white/40 transition-all hover:scale-105 flex items-center gap-2.5"
            >
              <Users className="w-5 h-5 text-brand-400" />
              Join as Volunteer
            </button>

            <Link
              to="/about"
              className="px-6 py-4 rounded-2xl text-slate-300 hover:text-white font-semibold text-base transition-colors flex items-center gap-1.5"
            >
              Our Story <ChevronRight className="w-4 h-4 text-brand-400" />
            </Link>
          </div>

          {/* Quick Pillars Banner */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                <Ambulance className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">24/7 Ambulance</span>
                <span className="text-slate-400">Govt. Hospital Liaison</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Food Donation</span>
                <span className="text-slate-400">Meals for Slum Areas</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Blood & Health</span>
                <span className="text-slate-400">Frequent Camps</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Child Education</span>
                <span className="text-slate-400">Study Kits & Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          IMPACT STATS COUNTER
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-20">
        <StatsCounter metrics={overview?.metrics || []} />
      </section>

      {/* =========================================================
          EMERGENCY AMBULANCE HIGHLIGHT SECTION
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 lg:p-16 border border-red-900/40 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            
            {/* Left: Text Details */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Critical Emergency Lifeline
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Emergency Support & Accident Assistance
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Yuva Social Foundation operates a dedicated ambulance in active coordination with the <strong className="text-white">Government Hospital in Chandrapur</strong>. We ensure road accident victims and critical patients in impoverished areas receive immediate transportation and first aid to the nearest medical center without financial delay.
              </p>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">24/7 Ambulance Emergency Dispatch</span>
                    <a href="tel:+918669264943" className="text-lg sm:text-xl font-black text-white hover:text-red-400 transition-colors">
                      +91 8669264943
                    </a>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Operates throughout Chandrapur district and surrounding rural corridors.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => {
                    setSelectedCampaignForDonation({
                      id: 1,
                      title: "Emergency Ambulance & Accident Assistance",
                      category_slug: "emergency"
                    });
                    onOpenDonationModal();
                  }}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" /> Sponsor Fuel & Emergency Runs
                </button>
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/20"
                >
                  Contact Foundation Office
                </Link>
              </div>
            </div>

            {/* Right: Authentic Ambulance Photo */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 aspect-[4/3]">
                <img
                  src="/images/aambulance.jpeg"
                  alt="Yuva Social Foundation Ambulance Vehicle"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/ambulance.png";
                  }}
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-2xl shadow-xl hidden sm:flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">Govt Hospital Certified Liaison</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT TEASER & FOUNDER SECTION
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-200 bg-slate-100 aspect-[4/5]">
              <img
                src="/images/anush.jpg"
                alt="Anush Raju Bhagat - Founder & President"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/YSFLogo.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3 py-1 rounded-lg bg-brand-500 text-white font-bold text-xs uppercase tracking-wider mb-2 inline-block">
                  President & Founder
                </span>
                <h3 className="text-2xl font-black tracking-tight">
                  ANUSH RAJU BHAGAT
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Leading Yuva Social Foundation Since 2017
                </p>
              </div>
            </div>

            {/* Established Badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-150 text-center">
              <span className="text-2xl font-black text-brand-600 block">2017</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Founded</span>
            </div>
          </div>

          {/* Right Text Description */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Who We Are
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Service to Humanity is the Greatest Service of All
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Yuva Social Foundation was established in 2017 in Chandrapur, Maharashtra, and officially registered in 2021. What began as an initiative by passionate local youth has transformed into a resilient community support system.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              From distributing free medicines and nutritious meals to accident victim rescue, hospital bed coordination during COVID-19, and organizing education drives for children in slum localities, our team remains on the ground every day.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  Our Vision
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To enhance human wellbeing through healthcare, educational support, and humanitarian aid.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  Our Mission
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To ensure no one suffers from hunger, homelessness, or lack of emergency medical aid.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all hover:scale-105 flex items-center gap-2"
              >
                Meet Our Leadership Team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          FEATURED CAMPAIGNS SECTION
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeading
            badge="Ongoing & Completed Drives"
            title="Featured Campaigns & Social Drives"
            subtitle="Explore our active community relief efforts and previous welfare programs conducted in Chandrapur."
            center={false}
            className="mb-0"
          />
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-800 hover:text-brand-700 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            View All Campaigns <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured campaigns..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampaigns.map(campaign => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onSupportClick={handleSupportCampaign}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          OUR WORK & WELFARE SERVICES PREVIEW
          ========================================================= */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="What We Do"
            title="Comprehensive Welfare Initiatives"
            subtitle="Addressing vital community needs across healthcare, emergency assistance, child literacy, hunger relief, and civic welfare."
            center={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              Explore All 15 Welfare Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          ACHIEVEMENTS IN MEDIA & NEWSPAPER CLIPPINGS
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Media Recognition"
          title="Recognized by Local Press & Media"
          subtitle="Our social relief activities and COVID relief efforts have been appreciated and featured across regional publications."
          center={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(overview?.achievements || []).map(item => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-soft p-4 flex flex-col group hover:-translate-y-1 transition-all">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-3 border border-slate-100">
                <img
                  src={resolveImageUrl(item.clipping_image)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/YSFLogo.jpg";
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                {item.publication_name || "Press Clipping"} • {item.date || "Recognition"}
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          GALLERY PREVIEW SECTION
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeading
            badge="Moments on the Ground"
            title="Real Actions, Real Lives Touched"
            subtitle="Actual photos from our food distribution drives, COVID frontline aid, and community camps."
            center={false}
            className="mb-0"
          />
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-800 hover:text-brand-700 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            Explore Full Gallery <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryPreview.map(item => (
            <Link
              key={item.id}
              to="/gallery"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
            >
              <img
                src={resolveImageUrl(item.image)}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/YSFLogo.jpg";
                }}
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-[11px] font-bold">
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
