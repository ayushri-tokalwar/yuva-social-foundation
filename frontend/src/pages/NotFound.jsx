import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, Phone, ArrowLeft, Ambulance } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 py-24">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="relative inline-block">
          <span className="text-8xl sm:text-9xl font-black text-brand-500/20 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              Page Not Found
            </span>
          </div>
        </div>

        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let us help you find your way back.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-left">
          <Link
            to="/"
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-200"
          >
            <Home className="w-4 h-4 text-brand-400 shrink-0" />
            Home Page
          </Link>
          <Link
            to="/about"
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-200"
          >
            <Compass className="w-4 h-4 text-brand-400 shrink-0" />
            About YSF
          </Link>
          <Link
            to="/services"
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-200"
          >
            <Ambulance className="w-4 h-4 text-brand-400 shrink-0" />
            Our Services
          </Link>
          <Link
            to="/campaigns"
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-200"
          >
            <Compass className="w-4 h-4 text-brand-400 shrink-0" />
            Active Drives
          </Link>
          <Link
            to="/gallery"
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-200"
          >
            <Compass className="w-4 h-4 text-brand-400 shrink-0" />
            Photo Archive
          </Link>
          <Link
            to="/contact"
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2.5 text-xs font-semibold text-slate-200"
          >
            <Phone className="w-4 h-4 text-brand-400 shrink-0" />
            Contact Us
          </Link>
        </div>

        {/* Back Button */}
        <div className="pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-lg shadow-brand-600/30"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
