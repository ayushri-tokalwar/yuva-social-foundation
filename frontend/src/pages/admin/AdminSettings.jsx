import React, { useState, useEffect } from 'react';
import { adminFoundationApi } from '../../services/adminApi';
import { resolveImageUrl } from '../../services/api';
import {
  Settings,
  Building,
  Users,
  Activity,
  Save,
  CheckCircle,
  Loader2,
  PlusCircle,
  Trash2,
  Edit
} from 'lucide-react';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploadWidget from '../../components/admin/ImageUploadWidget';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [team, setTeam] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Team Member Modal State
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    photo: '',
    bio: '',
    is_leader: false,
    is_active: true,
    order: 0
  });

  // Metric Modal State
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [metricForm, setMetricForm] = useState({
    label: '',
    value: '',
    prefix: '',
    suffix: '',
    description: '',
    icon: 'Heart',
    order: 0,
    is_active: true
  });

  // Delete Candidate
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const fetchAllSettings = async () => {
    setLoading(true);
    try {
      const [profData, teamData, metricData, achieveData] = await Promise.all([
        adminFoundationApi.getProfile(),
        adminFoundationApi.getTeam(),
        adminFoundationApi.getMetrics(),
        adminFoundationApi.getAchievements()
      ]);
      setProfile(profData || {});
      setTeam(teamData.results || (Array.isArray(teamData) ? teamData : []));
      setMetrics(metricData.results || (Array.isArray(metricData) ? metricData : []));
      setAchievements(achieveData.results || (Array.isArray(achieveData) ? achieveData : []));
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminFoundationApi.updateProfile(profile);
      setProfile(updated);
      setToastMessage('Foundation profile and contact information updated successfully.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Team Member Handlers
  const handleOpenTeamCreate = () => {
    setEditingTeamMember(null);
    setTeamForm({
      name: '',
      role: '',
      phone: '',
      email: '',
      photo: '',
      bio: '',
      is_leader: false,
      is_active: true,
      order: team.length
    });
    setIsTeamModalOpen(true);
  };

  const handleOpenTeamEdit = (tm) => {
    setEditingTeamMember(tm);
    setTeamForm({
      name: tm.name || '',
      role: tm.role || '',
      phone: tm.phone || '',
      email: tm.email || '',
      photo: tm.photo || '',
      bio: tm.bio || '',
      is_leader: !!tm.is_leader,
      is_active: tm.is_active !== false,
      order: tm.order || 0
    });
    setIsTeamModalOpen(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTeamMember) {
        const res = await adminFoundationApi.updateTeamMember(editingTeamMember.id, teamForm);
        setTeam((prev) => prev.map((m) => (m.id === editingTeamMember.id ? res : m)));
        setToastMessage(`Team member "${res.name}" updated.`);
      } else {
        const res = await adminFoundationApi.createTeamMember(teamForm);
        setTeam((prev) => [...prev, res]);
        setToastMessage(`Team member "${res.name}" added.`);
      }
      setIsTeamModalOpen(false);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to save team member.');
    } finally {
      setSaving(false);
    }
  };

  // Metric Handlers
  const handleOpenMetricCreate = () => {
    setEditingMetric(null);
    setMetricForm({
      label: '',
      value: '',
      prefix: '',
      suffix: '',
      description: '',
      icon: 'Heart',
      order: metrics.length,
      is_active: true
    });
    setIsMetricModalOpen(true);
  };

  const handleOpenMetricEdit = (mt) => {
    setEditingMetric(mt);
    setMetricForm({
      label: mt.label || '',
      value: mt.value || '',
      prefix: mt.prefix || '',
      suffix: mt.suffix || '',
      description: mt.description || '',
      icon: mt.icon || 'Heart',
      order: mt.order || 0,
      is_active: mt.is_active !== false
    });
    setIsMetricModalOpen(true);
  };

  const handleMetricSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMetric) {
        const res = await adminFoundationApi.updateMetric(editingMetric.id, metricForm);
        setMetrics((prev) => prev.map((m) => (m.id === editingMetric.id ? res : m)));
        setToastMessage(`Impact metric "${res.label}" updated.`);
      } else {
        const res = await adminFoundationApi.createMetric(metricForm);
        setMetrics((prev) => [...prev, res]);
        setToastMessage(`Impact metric "${res.label}" created.`);
      }
      setIsMetricModalOpen(false);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to save metric.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setSaving(true);
    try {
      if (deleteCandidate.type === 'team') {
        await adminFoundationApi.deleteTeamMember(deleteCandidate.id);
        setTeam((prev) => prev.filter((m) => m.id !== deleteCandidate.id));
        setToastMessage('Team member removed.');
      } else if (deleteCandidate.type === 'metric') {
        await adminFoundationApi.deleteMetric(deleteCandidate.id);
        setMetrics((prev) => prev.filter((m) => m.id !== deleteCandidate.id));
        setToastMessage('Impact metric removed.');
      }
      setDeleteCandidate(null);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      alert('Failed to delete item.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
        <p className="text-xs font-semibold">Loading foundation configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-brand-400" />
            Foundation Content & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update NGO contact channels, emergency ambulance hotline, mission statement, and leadership.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-brand-500 text-brand-400 bg-slate-950/60'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" /> Foundation Profile & Hotlines
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'team'
              ? 'border-brand-500 text-brand-400 bg-slate-950/60'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Executive Team ({team.length})
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'metrics'
              ? 'border-brand-500 text-brand-400 bg-slate-950/60'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Impact Metrics ({metrics.length})
        </button>
      </div>

      {/* Tab 1: Profile & Contact */}
      {activeTab === 'profile' && profile && (
        <form onSubmit={handleProfileSubmit} className="space-y-6 text-xs bg-slate-950/80 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-900">
            <div>
              <h3 className="text-base font-bold text-white">General Information & Contact Hotlines</h3>
              <p className="text-xs text-slate-400 mt-0.5">These details power the footer, contact page, and header banners.</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/25 flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Foundation Official Name
              </label>
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Tagline / Motto
              </label>
              <input
                type="text"
                value={profile.tagline || ''}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Official Foundation Phone
              </label>
              <input
                type="text"
                value={profile.official_phone || ''}
                onChange={(e) => setProfile({ ...profile, official_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">
                24/7 Ambulance & Emergency Hotline
              </label>
              <input
                type="text"
                value={profile.ambulance_contact || ''}
                onChange={(e) => setProfile({ ...profile, ambulance_contact: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-red-900/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={profile.official_email || ''}
                onChange={(e) => setProfile({ ...profile, official_email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Headquarters / Registered City
              </label>
              <input
                type="text"
                value={profile.headquarters || ''}
                onChange={(e) => setProfile({ ...profile, headquarters: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Registered Physical Address
              </label>
              <input
                type="text"
                value={profile.address || ''}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Mission Statement
              </label>
              <textarea
                rows={2}
                value={profile.mission || ''}
                onChange={(e) => setProfile({ ...profile, mission: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Vision Statement
              </label>
              <textarea
                rows={2}
                value={profile.vision || ''}
                onChange={(e) => setProfile({ ...profile, vision: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                About Foundation Narrative
              </label>
              <textarea
                rows={3}
                value={profile.about_text || ''}
                onChange={(e) => setProfile({ ...profile, about_text: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t border-slate-900">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Social Media Channels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={profile.facebook_url || ''}
                  onChange={(e) => setProfile({ ...profile, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={profile.instagram_url || ''}
                  onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Foundation Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Team Members */}
      {activeTab === 'team' && (
        <div className="space-y-5 bg-slate-950/80 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-900">
            <div>
              <h3 className="text-base font-bold text-white">Foundation Leadership & Department Heads</h3>
              <p className="text-xs text-slate-400 mt-0.5">Profiles shown on the public About page team roster.</p>
            </div>
            <button
              onClick={handleOpenTeamCreate}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/25 flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" /> Add Team Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 transition-all flex items-start gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                  <img
                    src={resolveImageUrl(m.photo)}
                    alt={m.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/YSFLogo.jpg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-white text-xs truncate">{m.name}</h4>
                    {m.is_leader && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-brand-500/20 text-brand-400 border border-brand-500/30">
                        Leader
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] truncate mt-0.5">{m.role}</p>
                  <p className="text-slate-500 font-mono text-[10px] mt-1">{m.phone || 'No phone'}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenTeamEdit(m)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate({ id: m.id, name: m.name, type: 'team' })}
                      className="p-1 rounded text-slate-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Impact Metrics */}
      {activeTab === 'metrics' && (
        <div className="space-y-5 bg-slate-950/80 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-900">
            <div>
              <h3 className="text-base font-bold text-white">Impact Numbers & Achievements</h3>
              <p className="text-xs text-slate-400 mt-0.5">Stats showcased in hero counters and impact badges.</p>
            </div>
            <button
              onClick={handleOpenMetricCreate}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/25 flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" /> Add Metric
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((mt) => (
              <div
                key={mt.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">{mt.label}</span>
                  <div className="text-2xl font-black text-brand-400 mt-1">
                    {mt.prefix}{mt.value}{mt.suffix}
                  </div>
                  {mt.description && (
                    <p className="text-[11px] text-slate-400 mt-1">{mt.description}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">Order: {mt.order}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenMetricEdit(mt)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate({ id: mt.id, name: mt.label, type: 'metric' })}
                      className="p-1 rounded text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Member Modal */}
      <AdminModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title={editingTeamMember ? `Edit Team Member: ${editingTeamMember.name}` : 'Add Executive Team Member'}
        subtitle="Manage leadership roster displayed on public About page."
      >
        <form onSubmit={handleTeamSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={teamForm.name}
              onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">Role / Department Head *</label>
            <input
              type="text"
              required
              value={teamForm.role}
              onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                value={teamForm.phone}
                onChange={(e) => setTeamForm({ ...teamForm, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={teamForm.email}
                onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <ImageUploadWidget
            label="Member Photo"
            currentImage={teamForm.photo}
            onImageUploaded={(url) => setTeamForm({ ...teamForm, photo: url })}
          />

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_leader"
                checked={teamForm.is_leader}
                onChange={(e) => setTeamForm({ ...teamForm, is_leader: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-slate-950 border-slate-800"
              />
              <label htmlFor="is_leader" className="text-xs font-bold text-white cursor-pointer">
                Core Foundation Leader
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsTeamModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
            >
              {saving ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Metric Modal */}
      <AdminModal
        isOpen={isMetricModalOpen}
        onClose={() => setIsMetricModalOpen(false)}
        title={editingMetric ? `Edit Metric: ${editingMetric.label}` : 'Add Impact Metric'}
        subtitle="Manage figures showcased across the website."
      >
        <form onSubmit={handleMetricSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">Metric Label *</label>
            <input
              type="text"
              required
              value={metricForm.label}
              onChange={(e) => setMetricForm({ ...metricForm, label: e.target.value })}
              placeholder="e.g. Free Ambulance Rides"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">Prefix</label>
              <input
                type="text"
                value={metricForm.prefix}
                onChange={(e) => setMetricForm({ ...metricForm, prefix: e.target.value })}
                placeholder="e.g. ₹"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">Value *</label>
              <input
                type="text"
                required
                value={metricForm.value}
                onChange={(e) => setMetricForm({ ...metricForm, value: e.target.value })}
                placeholder="e.g. 500"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">Suffix</label>
              <input
                type="text"
                value={metricForm.suffix}
                onChange={(e) => setMetricForm({ ...metricForm, suffix: e.target.value })}
                placeholder="e.g. +"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">Short Description</label>
            <input
              type="text"
              value={metricForm.description}
              onChange={(e) => setMetricForm({ ...metricForm, description: e.target.value })}
              placeholder="e.g. 24/7 service covering rural talukas"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsMetricModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
            >
              {saving ? 'Saving...' : 'Save Metric'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Remove Item?"
        message={`Are you sure you want to delete "${deleteCandidate?.name}"?`}
        confirmLabel="Yes, Delete"
        isLoading={saving}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
