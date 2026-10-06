import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Phone, 
  Menu, 
  X, 
  Ambulance, 
  ShieldCheck,
  ChevronRight,
  HandHeart
} from 'lucide-react';

export default function Navbar({ onOpenVolunteerModal, onOpenDonationModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu upon route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Work', path: '/services' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top emergency announcement & registration bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold text-[11px] uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              24/7 Ambulance Emergency
            </span>
            <span className="hidden sm:inline text-slate-400">Govt Hospital Chandrapur:</span>
            <a href="tel:+918669264943" className="font-bold text-white hover:text-brand-400 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-red-400" /> +91 8669264943
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Reg. No: Registered Social Welfare NGO (Est. 2017)
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px]">Chandrapur, Maharashtra</span>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-soft py-3'
            : 'bg-white/95 backdrop-blur-md py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Foundation Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src="/images/YSFLogo.jpg"
                  alt="Yuva Social Foundation Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/logo.png";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-none group-hover:text-brand-600 transition-colors">
                  YUVA SOCIAL FOUNDATION
                </span>
                <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-1">
                  Empowering Lives • Serving Humanity
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors py-1.5 relative ${
                      isActive
                        ? 'text-brand-600 font-bold'
                        : 'text-slate-600 hover:text-brand-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full animate-fade-in" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* CTA Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={onOpenVolunteerModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-brand-400 bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-sm font-semibold transition-all shadow-sm"
              >
                <Users className="w-4 h-4 text-brand-600" />
                Join as Volunteer
              </button>

              <button
                onClick={onOpenDonationModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:-translate-y-0.5"
              >
                <Heart className="w-4 h-4 fill-white/30" />
                Donate / Support
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={onOpenDonationModal}
                className="p-2 rounded-lg bg-brand-500 text-white text-xs font-bold"
                aria-label="Donate"
              >
                <Heart className="w-4 h-4 fill-white" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 mt-3 shadow-xl animate-fade-in">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive
                        ? 'bg-brand-50 text-brand-600 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </NavLink>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVolunteerModal();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                <Users className="w-3.5 h-3.5 text-brand-600" />
                Volunteer
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDonationModal();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                Donate
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
