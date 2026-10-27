import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminDashboardApi, adminVolunteersApi, adminDonationsApi } from '../../services/adminApi';
import {
  Megaphone,
  Users,
  HeartHandshake,
  Mail,
  Images,
  HandHeart,
  PlusCircle,
  Upload,
  ArrowRight,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Calendar,
  Sparkles,
  Download,
  BarChart3,
  TrendingUp,
  UserPlus,
  FileText
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [dateFilter, setDateFilter] = useState('all'); // all, 30days, 7days

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminDashboardApi.getStats();
      setStats(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError('Failed to fetch real-time dashboard metrics from Django backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const metrics = stats?.metrics || {
    total_campaigns: 0,
    active_campaigns: 0,
    total_volunteers: 0,
    pending_volunteers: 0,
    total_donations: 0,
    pending_donations: 0,
    total_messages: 0,
    unread_messages: 0,
    total_gallery: 0,
    total_services: 0,
  };

  const rawActivity = stats?.recent_activity || [];

  // Filter activities by selected date range
  const recentActivity = rawActivity.filter(act => {
    if (dateFilter === 'all') return true;
    const itemDate = new Date(act.created_at);
    const now = new Date();
    const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
    if (dateFilter === '7days') return diffDays <= 7;
    if (dateFilter === '30days') return diffDays <= 30;
    return true;
  });

  const handleExportVolunteers = async () => {
    try {
      await adminVolunteersApi.downloadCsv();
    } catch (err) {
      alert('Failed to export volunteers.');
    }
  };

  const handleExportDonations = async () => {
    try {
      await adminDonationsApi.downloadCsv();
    } catch (err) {
      alert('Failed to export donations.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Yuva Social Foundation &bull; Chandrapur, Maharashtra</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Executive Foundation Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time management metrics, pending applications, and verified database activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportVolunteers}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Download Volunteer CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Volunteers CSV</span>
          </button>

          <button
            onClick={handleExportDonations}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Download Donations CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Donations CSV</span>
          </button>

          <Link
            to="/admin/campaigns?action=new"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Campaign</span>
          </Link>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchStats} className="underline font-bold hover:text-white">
            Try Again
          </button>
        </div>
      )}

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Campaigns */}
        <Link
          to="/admin/campaigns"
          className="group relative bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Campaigns</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {loading ? '...' : metrics.total_campaigns}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {metrics.active_campaigns} active initiatives
            </span>
            <span className="text-slate-500 group-hover:text-brand-400 transition-colors flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Card 2: Volunteers */}
        <Link
          to="/admin/volunteers"
          className="group relative bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 hover:border-sky-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Volunteers & Join Requests</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {loading ? '...' : metrics.total_volunteers}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
            <span className={`font-semibold flex items-center gap-1.5 ${
              metrics.pending_volunteers > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {metrics.pending_volunteers} pending review
            </span>
            <span className="text-slate-500 group-hover:text-sky-400 transition-colors flex items-center gap-1">
              View roster <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Card 3: Donation Requests */}
        <Link
          to="/admin/donations"
          className="group relative bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Donation Pledges</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {loading ? '...' : metrics.total_donations}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
            <span className={`font-semibold flex items-center gap-1.5 ${
              metrics.pending_donations > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {metrics.pending_donations} awaiting receipt/contact
            </span>
            <span className="text-slate-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
              Review pledges <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Card 4: Contact Messages */}
        <Link
          to="/admin/messages"
          className="group relative bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Messages</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {loading ? '...' : metrics.total_messages}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
            <span className={`font-semibold flex items-center gap-1.5 ${
              metrics.unread_messages > 0 ? 'text-red-400 font-bold' : 'text-slate-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {metrics.unread_messages} unread inquiries
            </span>
            <span className="text-slate-500 group-hover:text-red-400 transition-colors flex items-center gap-1">
              Open inbox <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Card 5: Gallery Images */}
        <Link
          to="/admin/gallery"
          className="group relative bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Gallery Media</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {loading ? '...' : metrics.total_gallery}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Images className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
            <span className="text-purple-400 font-semibold">
              Media archives & newspaper clippings
            </span>
            <span className="text-slate-500 group-hover:text-purple-400 transition-colors flex items-center gap-1">
              Browse <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Card 6: Welfare Services */}
        <Link
          to="/admin/services"
          className="group relative bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Social Services</p>
              <h3 className="text-3xl font-black text-white mt-2">
                {loading ? '...' : metrics.total_services}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HandHeart className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-semibold">
              Ambulance, Blood, Food, Kits
            </span>
            <span className="text-slate-500 group-hover:text-amber-400 transition-colors flex items-center gap-1">
              Configure <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* Database Analytics & Submission Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Submission Activity Breakdown */}
        <div className="lg:col-span-2 bg-slate-950/80 rounded-3xl p-6 border border-slate-800/80 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-400" />
                Database Activity & Ingestion Distribution
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Real distribution of active records across portal modules</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
              <Database className="w-3.5 h-3.5" /> Connected
            </span>
          </div>

          {/* Graphical Proportional Bars */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Social Services Catalog</span>
                <span className="text-white font-mono font-bold">{metrics.total_services}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(15, metrics.total_services * 6))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Active & Published Campaigns</span>
                <span className="text-white font-mono font-bold">{metrics.total_campaigns} ({metrics.active_campaigns} Active)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(20, metrics.total_campaigns * 14))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">High-Resolution Gallery Assets</span>
                <span className="text-white font-mono font-bold">{metrics.total_gallery}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, metrics.total_gallery * 5))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Volunteer Applications</span>
                <span className="text-white font-mono font-bold">{metrics.total_volunteers} ({metrics.pending_volunteers} Pending)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(8, metrics.total_volunteers * 20))}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Donation & In-Kind Requests</span>
                <span className="text-white font-mono font-bold">{metrics.total_donations} ({metrics.pending_donations} Pending)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, metrics.total_donations * 25))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* System & Verification Status Card */}
        <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Administrative Verification Desk
            </h3>
            <p className="text-[11px] text-slate-400">Immediate action items awaiting staff attention</p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Pending Volunteers</p>
                  <p className="text-[10px] text-slate-400">Awaiting induction call</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {metrics.pending_volunteers}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Unread Messages</p>
                  <p className="text-[10px] text-slate-400">Contact & ambulance inquiries</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-red-500/20 text-red-300 font-mono font-bold">
                  {metrics.unread_messages}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Donation Pledges</p>
                  <p className="text-[10px] text-slate-400">Awaiting bank verification</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {metrics.pending_donations}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              to="/admin/volunteers"
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Process Pending Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800/80">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/admin/campaigns?action=new"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">New Campaign</span>
          </Link>

          <Link
            to="/admin/gallery?action=upload"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Upload Media</span>
          </Link>

          <Link
            to="/admin/join-requests"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Join Requests</span>
          </Link>

          <Link
            to="/admin/content"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Edit Website</span>
          </Link>

          <Link
            to="/admin/donations"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Donations</span>
          </Link>

          <Link
            to="/admin/messages"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Contact Inbox</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Recent Activity & Submissions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live submissions recorded from the Yuva Social Foundation portal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  dateFilter === 'all' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setDateFilter('30days')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  dateFilter === '30days' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setDateFilter('7days')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  dateFilter === '7days' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Last 7 Days
              </button>
            </div>

            <span className="text-xs text-slate-500 hidden md:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No submissions recorded for this timeframe</p>
            <p className="text-xs text-slate-500 mt-1">
              New volunteer applications, donation intents, and inquiries will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subject / Name</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {recentActivity.map((act) => {
                  const targetUrl =
                    act.type === 'volunteer'
                      ? '/admin/volunteers'
                      : act.type === 'donation'
                      ? '/admin/donations'
                      : '/admin/messages';

                  return (
                    <tr
                      key={`${act.type}-${act.id}`}
                      className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                      onClick={() => navigate(targetUrl)}
                    >
                      <td className="py-3.5 px-4 font-bold uppercase text-[11px]">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          act.type === 'volunteer'
                            ? 'bg-sky-500/10 text-sky-400'
                            : act.type === 'donation'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {act.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-200">
                        {act.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                        {act.subtitle}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={act.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                        {new Date(act.created_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={targetUrl}
                          className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 font-bold group-hover:underline"
                        >
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
