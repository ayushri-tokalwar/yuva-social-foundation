import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Mail,
  Megaphone,
  Images,
  HandHeart,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Eye,
  Server,
  UserPlus,
  FileText
} from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/volunteers', icon: Users, label: 'Volunteers' },
  { to: '/admin/join-requests', icon: UserPlus, label: 'Join Requests' },
  { to: '/admin/donations', icon: HeartHandshake, label: 'Donation Requests' },
  { to: '/admin/messages', icon: Mail, label: 'Contact Messages' },
  { to: '/admin/campaigns', icon: Megaphone, label: 'Campaigns' },
  { to: '/admin/gallery', icon: Images, label: 'Gallery & Media' },
  { to: '/admin/services', icon: HandHeart, label: 'Services' },
  { to: '/admin/content', icon: FileText, label: 'Website Content' },
  { to: '/admin/settings', icon: Settings, label: 'Foundation Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = async () => {
    setLogoutModalOpen(false);
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white p-1 flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <img src="/images/YSFLogo.jpg" alt="YSF" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-sm font-black tracking-wider text-white flex items-center gap-1.5">
                YUVA SOCIAL FOUNDATION
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  Staff Admin
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Chandrapur NGO Management Platform</p>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick link to public website */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            title="Open Public Website in New Tab"
          >
            <Eye className="w-3.5 h-3.5 text-brand-400" />
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
              {user?.username?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{user?.username || 'Admin'}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {user?.is_superuser ? 'Super Administrator' : 'Staff Member'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors border border-red-500/20 flex items-center gap-1.5"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex w-64 flex-col justify-between bg-slate-950 border-r border-slate-800/80 p-4">
          <div className="space-y-6">
            <div>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Main Menu
              </p>
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 font-bold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                System Integration
              </p>
              <div className="space-y-1">
                <a
                  href="http://localhost:8000/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors group"
                >
                  <span className="flex items-center gap-3">
                    <Server className="w-4 h-4 text-emerald-400" />
                    Django Admin
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer of Sidebar */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-200">Encrypted Admin Session</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Django ORM + Supabase DB connected</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[80%] bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between z-10 animate-slideRight">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <span className="text-sm font-black text-white">MENU</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-brand-600 text-white font-bold'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <a
                  href="http://localhost:8000/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-900"
                >
                  <span className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" /> Django Admin
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 bg-slate-900/95 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation */}
      <ConfirmDialog
        isOpen={logoutModalOpen}
        title="Sign Out of Admin Portal"
        message="Are you sure you want to log out of the Yuva Social Foundation management dashboard?"
        confirmLabel="Log Out"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        onClose={() => setLogoutModalOpen(false)}
      />
    </div>
  );
}
