import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Ambulance, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function Footer({ onOpenVolunteerModal, onOpenDonationModal }) {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-900">
      {/* Pre-footer Callout Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30 mb-3">
                Join Our Mission
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Together, We Can Bring Hope to Those in Need
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-300">
                Whether you wish to volunteer your time or contribute resources for food relief, healthcare, or emergency medical aid, your support directly transforms lives in Chandrapur.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3.5 flex-shrink-0">
              <button
                onClick={onOpenVolunteerModal}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold transition-all shadow-sm hover:scale-105"
              >
                Become a Volunteer
              </button>
              <button
                onClick={onOpenDonationModal}
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-lg shadow-brand-500/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" /> Support a Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: About Foundation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 flex-shrink-0">
                <img
                  src="/images/YSFLogo.jpg"
                  alt="Yuva Social Foundation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-base font-bold text-white tracking-wide">
                  YUVA SOCIAL FOUNDATION
                </h4>
                <p className="text-xs text-brand-400 font-medium">
                  Chandrapur, Maharashtra
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              A community-driven non-profit foundation founded in 2017 and registered in 2021. Dedicated to selfless service to humanity through healthcare initiatives, 24/7 ambulance emergency aid, hunger relief, child education, and youth empowerment.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3.5 py-2 rounded-xl max-w-sm">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Registered Non-Profit NGO • Dedicated to Social Welfare</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-500" /> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-500" /> About Our Journey
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-500" /> Social Welfare Initiatives
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-500" /> Active & Past Campaigns
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-500" /> Photo & Media Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-500" /> Contact & Reach Out
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Welfare Areas */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Key Focus Areas
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> 24/7 Ambulance Assistance
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Hunger Relief & Meal Drives
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Blood Donation Camps
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Child Welfare & Study Kits
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Medical Checkup Camps
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> COVID-19 Relief Brigade
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Helpline */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>Chandrapur, Maharashtra 442401, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:yuvasocialch34@gmail.com" className="hover:text-white transition-colors">
                  yuvasocialch34@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="tel:+918669264943" className="hover:text-white transition-colors">
                  +91 8669264943
                </a>
              </li>
              <li className="pt-2">
                <div className="bg-red-950/40 border border-red-800/40 p-2.5 rounded-xl text-[11px] text-red-300 flex items-start gap-2">
                  <Ambulance className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">Ambulance Hotline</span>
                    Govt. Hospital, Chandrapur: +91 8669264943
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Yuva Social Foundation. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Dedicated to the service of humanity <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> Chandrapur, Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
}
