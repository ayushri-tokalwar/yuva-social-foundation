import React, { useState, useEffect } from 'react';
import { adminSettingsApi } from '../../services/adminApi';
import {
  FileText,
  Save,
  Sparkles,
  Eye,
  Megaphone,
  Heart,
  Target,
  Compass,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Loader2,
  AlertCircle,
  ExternalLink,
  Share2,
  Ambulance,
  RefreshCw
} from 'lucide-react';
import ImageUploadWidget from '../../components/admin/ImageUploadWidget';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [profile, setProfile] = useState({
    name: 'Yuva Social Foundation',
    tagline: '',
    description: '',
    about_text: '',
    mission: '',
    vision: '',
    established_year: 2017,
    registered_year: 2021,
    headquarters: 'Chandrapur, Maharashtra, India',
    official_email: 'yuvasocialch34@gmail.com',
    official_phone: '+91 8669264943',
    ambulance_contact: '+91 8669264943',
    address: 'Chandrapur, Maharashtra, India',
    founder_name: 'Anush Raju Bhagat',
    founder_title: 'President & Founder',
    founder_bio: '',
    founder_image: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    linkedin_url: '',
    hero_title: 'Welcome to Yuva Social Foundation',
    hero_subtitle: '',
    announcement_banner: '',
    announcement_active: true,
    ambulance_emergency_text: ''
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = await adminSettingsApi.getProfile();
      if (data) {
        setProfile(prev => ({
          ...prev,
          ...data,
          hero_title: data.hero_title || 'Welcome to Yuva Social Foundation',
          announcement_banner: data.announcement_banner || '',
          announcement_active: data.announcement_active !== false,
          ambulance_emergency_text: data.ambulance_emergency_text || ''
        }));
      }
    } catch (err) {
      console.error('Failed to load foundation content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminSettingsApi.updateProfile(profile);
      setProfile(prev => ({ ...prev, ...updated }));
      setToastMessage('Website content updated successfully! Public pages are refreshed.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      alert('Failed to save content changes. Please verify backend connection.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Homepage Hero & Headings', icon: Sparkles },
    { id: 'announcements', label: 'Announcements & Alerts', icon: Megaphone },
    { id: 'story', label: 'About Us & Mission / Vision', icon: Target },
    { id: 'emergency', label: 'Emergency Ambulance & Contact', icon: Ambulance },
    { id: 'founder', label: 'Leadership & Social Links', icon: Share2 },
    { id: 'preview', label: 'Live Hero Preview', icon: Eye }
  ];

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
            <FileText className="w-6 h-6 text-brand-400" />
            Website Content & Story Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update headings, descriptions, announcements, mission statements, and emergency contacts in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchContent}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || loading}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Publishing...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 bg-slate-950/60 rounded-3xl border border-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto mb-2" />
          <p className="text-xs font-semibold">Loading current website content...</p>
        </div>
      ) : (
        <div className="bg-slate-950/80 p-6 sm:p-8 rounded-3xl border border-slate-800 text-xs">
          
          {/* TAB 1: HERO & HEADINGS */}
          {activeTab === 'hero' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Homepage Hero Banner Configuration
                </h3>
                <p className="text-slate-400 mt-0.5">
                  The primary text visitors see when landing on the Yuva Social Foundation portal.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Hero Main Heading
                  </label>
                  <input
                    type="text"
                    name="hero_title"
                    value={profile.hero_title}
                    onChange={handleChange}
                    placeholder="Welcome to Yuva Social Foundation"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Featured prominently at the top of the homepage.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Hero Subtitle / Mission Pitch
                  </label>
                  <textarea
                    rows={4}
                    name="hero_subtitle"
                    value={profile.hero_subtitle}
                    onChange={handleChange}
                    placeholder="Standing by underprivileged communities since 2017..."
                    className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Foundation Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Foundation Tagline
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      value={profile.tagline}
                      onChange={handleChange}
                      placeholder="Empowering Lives Through Community Engagement"
                      className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-brand-400" />
                  Website Live Announcement & Alert Bar
                </h3>
                <p className="text-slate-400 mt-0.5">
                  Broadcast urgent updates, blood donation drives, or emergency relief notices globally across all pages.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">Enable Announcement Banner</p>
                    <p className="text-slate-400 text-[11px]">When enabled, this bar displays at the top of the homepage.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="announcement_active"
                      checked={profile.announcement_active}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Announcement Text
                  </label>
                  <input
                    type="text"
                    name="announcement_banner"
                    value={profile.announcement_banner}
                    onChange={handleChange}
                    placeholder="e.g. Urgent Blood Donation Drive this Sunday at Govt. Hospital Chandrapur"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {profile.announcement_banner && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 flex items-center gap-2 text-xs">
                    <Sparkles className="w-4 h-4 text-red-400 animate-pulse flex-shrink-0" />
                    <span><strong>Live Preview:</strong> {profile.announcement_banner}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT US, MISSION & VISION */}
          {activeTab === 'story' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Mission, Vision & Foundation Narrative
                </h3>
                <p className="text-slate-400 mt-0.5">
                  Manage the core values, detailed history, and guiding principles presented on the About page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Our Vision Statement
                  </label>
                  <textarea
                    rows={5}
                    name="vision"
                    value={profile.vision}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Our Mission Statement
                  </label>
                  <textarea
                    rows={5}
                    name="mission"
                    value={profile.mission}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Foundation Story & Detailed History (About Text)
                  </label>
                  <textarea
                    rows={6}
                    name="about_text"
                    value={profile.about_text}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Executive Summary / Short Description
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Established Year
                  </label>
                  <input
                    type="number"
                    name="established_year"
                    value={profile.established_year}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Registration Year
                  </label>
                  <input
                    type="number"
                    name="registered_year"
                    value={profile.registered_year}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EMERGENCY AMBULANCE & CONTACT */}
          {activeTab === 'emergency' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Ambulance className="w-4 h-4 text-red-400" />
                  Emergency Ambulance & Official Contacts
                </h3>
                <p className="text-slate-400 mt-0.5">
                  Manage the 24/7 hotline numbers, hospital liaison info, and emergency dispatch text.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Ambulance Highlight Text (Homepage Card)
                  </label>
                  <textarea
                    rows={4}
                    name="ambulance_emergency_text"
                    value={profile.ambulance_emergency_text}
                    onChange={handleChange}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      24/7 Ambulance Hotline
                    </label>
                    <input
                      type="text"
                      name="ambulance_contact"
                      value={profile.ambulance_contact}
                      onChange={handleChange}
                      placeholder="+91 8669264943"
                      className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Official Mobile Number
                    </label>
                    <input
                      type="text"
                      name="official_phone"
                      value={profile.official_phone}
                      onChange={handleChange}
                      placeholder="+91 8669264943"
                      className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Official Email
                    </label>
                    <input
                      type="email"
                      name="official_email"
                      value={profile.official_email}
                      onChange={handleChange}
                      placeholder="yuvasocialch34@gmail.com"
                      className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Headquarters / Physical Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Chandrapur, Maharashtra 442401, India"
                    className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LEADERSHIP & SOCIALS */}
          {activeTab === 'founder' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-sky-400" />
                  Leadership & Social Media Profiles
                </h3>
                <p className="text-slate-400 mt-0.5">
                  Update founder spotlight and connected social media profiles.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Founder Name
                    </label>
                    <input
                      type="text"
                      name="founder_name"
                      value={profile.founder_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Founder Title / Role
                    </label>
                    <input
                      type="text"
                      name="founder_title"
                      value={profile.founder_title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Founder Bio / Spotlight Narrative
                  </label>
                  <textarea
                    rows={4}
                    name="founder_bio"
                    value={profile.founder_bio}
                    onChange={handleChange}
                    placeholder="Brief background and leadership journey..."
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <ImageUploadWidget
                  label="Founder Portrait Photo"
                  currentImage={profile.founder_image}
                  onImageUploaded={(url) => setProfile(prev => ({ ...prev, founder_image: url }))}
                />

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                    Social Media Profiles
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Facebook URL</label>
                      <input
                        type="url"
                        name="facebook_url"
                        value={profile.facebook_url}
                        onChange={handleChange}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        name="instagram_url"
                        value={profile.instagram_url}
                        onChange={handleChange}
                        placeholder="https://instagram.com/..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Twitter / X URL</label>
                      <input
                        type="url"
                        name="twitter_url"
                        value={profile.twitter_url}
                        onChange={handleChange}
                        placeholder="https://twitter.com/..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">YouTube Channel URL</label>
                      <input
                        type="url"
                        name="youtube_url"
                        value={profile.youtube_url}
                        onChange={handleChange}
                        placeholder="https://youtube.com/..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-400" />
                  Live Hero Section Preview
                </h3>
                <p className="text-slate-400 mt-0.5">
                  This simulates how the hero section looks on the public website with the current content settings.
                </p>
              </div>

              {/* Simulated Hero Card */}
              <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 text-white p-8 sm:p-12 text-center relative shadow-2xl">
                {profile.announcement_active && profile.announcement_banner && (
                  <div className="mb-6 -mx-8 -mt-8 sm:-mx-12 sm:-mt-12 bg-gradient-to-r from-red-600 via-brand-600 to-amber-600 text-white text-xs font-bold py-2.5 px-4 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                    <span>{profile.announcement_banner}</span>
                  </div>
                )}

                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-6 border border-brand-500/30">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                  Non-Profit Social Welfare Organization • Chandrapur, Maharashtra
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
                  <span className="bg-gradient-to-r from-brand-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                    {profile.hero_title || profile.name}
                  </span>
                </h2>

                <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                  {profile.hero_subtitle || profile.description}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-600/30">
                    Donate / Support (CTA)
                  </span>
                  <span className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs border border-white/20">
                    Join as Volunteer (CTA)
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Publishing...' : 'Publish to Live Website'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
