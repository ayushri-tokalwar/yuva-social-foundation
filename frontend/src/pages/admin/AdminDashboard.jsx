import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminDashboardApi } from '../../services/adminApi';
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
  Sparkles
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

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

  const recentActivity = stats?.recent_activity || [];

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
            Real-time management metrics, pending applications, and foundation activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
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
          <button
            onClick={fetchStats}
            className="underline font-bold hover:text-white"
          >
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
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Volunteers Registered</p>
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
              metrics.pending_volunteers > 0 ? 'text-amber-400' : 'text-slate-400'
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
              metrics.pending_donations > 0 ? 'text-amber-400' : 'text-slate-400'
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

      {/* Quick Actions Panel */}
      <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800/80">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            to="/admin/campaigns?action=new"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Add Campaign</span>
          </Link>

          <Link
            to="/admin/gallery?action=upload"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Upload Photo</span>
          </Link>

          <Link
            to="/admin/volunteers"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">View Volunteers</span>
          </Link>

          <Link
            to="/admin/donations"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Donation Requests</span>
          </Link>

          <Link
            to="/admin/messages"
            className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 group col-span-2 sm:col-span-1"
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Recent Activity & Submissions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest form submissions from the live website
            </p>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Updated {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No submissions recorded yet</p>
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
