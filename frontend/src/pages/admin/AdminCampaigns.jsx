import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminCampaignsApi } from '../../services/adminApi';
import { resolveImageUrl } from '../../services/api';
import {
  Megaphone,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  MapPin,
  Loader2,
  ExternalLink,
  Target
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploadWidget from '../../components/admin/ImageUploadWidget';

const EMPTY_CAMPAIGN = {
  title: '',
  subtitle: '',
  category: '',
  description: '',
  story: '',
  location: 'Chandrapur, Maharashtra',
  start_date: '',
  end_date: '',
  featured_image: '',
  banner_image: '',
  target_beneficiaries: '',
  beneficiaries_helped: '',
  goal_amount: '',
  raised_amount: '0',
  status: 'active',
  is_featured: false,
  order: 0
};

export default function AdminCampaigns() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState(EMPTY_CAMPAIGN);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchCampaignsAndCategories = async () => {
    setLoading(true);
    try {
      const [campData, catData] = await Promise.all([
        adminCampaignsApi.list({
          search: search.trim() || undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }),
        adminCampaignsApi.getCategories()
      ]);

      const items = campData.results || (Array.isArray(campData) ? campData : []);
      setCampaigns(items);
      setCategories(catData.results || (Array.isArray(catData) ? catData : []));

      // Check URL query param ?action=new
      if (searchParams.get('action') === 'new') {
        handleOpenCreate();
        setSearchParams({});
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignsAndCategories();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCampaignsAndCategories();
  };

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setFormData({
      ...EMPTY_CAMPAIGN,
      category: categories[0]?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title || '',
      subtitle: campaign.subtitle || '',
      category: campaign.category || (categories[0]?.id || ''),
      description: campaign.description || '',
      story: campaign.story || '',
      location: campaign.location || 'Chandrapur, Maharashtra',
      start_date: campaign.start_date || '',
      end_date: campaign.end_date || '',
      featured_image: campaign.featured_image || '',
      banner_image: campaign.banner_image || '',
      target_beneficiaries: campaign.target_beneficiaries || '',
      beneficiaries_helped: campaign.beneficiaries_helped || '',
      goal_amount: campaign.goal_amount || '',
      raised_amount: campaign.raised_amount || '0',
      status: campaign.status || 'active',
      is_featured: !!campaign.is_featured,
      order: campaign.order || 0
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in title and description.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        category: formData.category || null,
        goal_amount: formData.goal_amount ? parseFloat(formData.goal_amount) : null,
        raised_amount: formData.raised_amount ? parseFloat(formData.raised_amount) : 0,
        order: parseInt(formData.order, 10) || 0
      };

      if (editingCampaign) {
        const updated = await adminCampaignsApi.update(editingCampaign.id, payload);
        setCampaigns((prev) => prev.map((c) => (c.id === editingCampaign.id ? updated : c)));
        setToastMessage(`Campaign "${updated.title}" updated successfully.`);
      } else {
        const created = await adminCampaignsApi.create(payload);
        setCampaigns((prev) => [created, ...prev]);
        setToastMessage(`New campaign "${created.title}" created successfully.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save campaign.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setSaving(true);
    try {
      await adminCampaignsApi.delete(deleteCandidate.id);
      setCampaigns((prev) => prev.filter((c) => c.id !== deleteCandidate.id));
      setToastMessage(`Campaign "${deleteCandidate.title}" removed.`);
      setDeleteCandidate(null);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to delete campaign.');
    } finally {
      setSaving(false);
    }
  };

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
            <Megaphone className="w-6 h-6 text-brand-400" />
            Social Welfare Campaigns
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update, and manage public campaigns, photos, goals, and on-ground impact.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/25 flex items-center gap-2 transition-all self-start sm:self-auto hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug || c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
          <p className="text-xs font-semibold">Loading foundation campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="py-20 text-center bg-slate-950/60 rounded-3xl border border-dashed border-slate-800">
          <Megaphone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No campaigns found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Click "Create Campaign" to add a new initiative.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="group bg-slate-950/80 rounded-3xl overflow-hidden border border-slate-800/80 hover:border-brand-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/5 flex flex-col"
            >
              {/* Image banner */}
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                <img
                  src={resolveImageUrl(camp.featured_image)}
                  alt={camp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/YSFLogo.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <StatusBadge status={camp.status} />
                  {camp.is_featured && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
                      Featured
                    </span>
                  )}
                </div>
                {camp.category_name && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                    {camp.category_name}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {camp.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-900 text-xs text-slate-400">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      {camp.location || 'Chandrapur'}
                    </span>
                    {camp.target_beneficiaries && (
                      <span className="flex items-center gap-1.5 font-medium text-slate-300">
                        <Target className="w-3.5 h-3.5 text-sky-400" />
                        {camp.target_beneficiaries}
                      </span>
                    )}
                  </div>

                  {camp.goal_amount && (
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold mb-1">
                        <span className="text-slate-400">Raised: ₹{Number(camp.raised_amount || 0).toLocaleString()}</span>
                        <span className="text-emerald-400">Goal: ₹{Number(camp.goal_amount).toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                          style={{
                            width: `${Math.min(100, ((camp.raised_amount || 0) / camp.goal_amount) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                  <a
                    href={`/campaigns/${camp.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    Preview <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(camp)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors border border-slate-800 flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5 text-sky-400" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(camp)}
                      className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Form Modal (Add / Edit) */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampaign ? `Edit Campaign: ${editingCampaign.title}` : 'Create New Campaign'}
        subtitle="Manage campaign storytelling, impact goals, and image assets."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Campaign Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Free 24/7 Emergency Ambulance Service"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">None / Unassigned</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="active">Active / Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Short Description / Overview *
              </label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary displayed on cards and previews..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Detailed Story & Background
              </label>
              <textarea
                rows={4}
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                placeholder="Comprehensive description of the challenge, solution, and impact..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Image upload widget */}
            <div className="sm:col-span-2">
              <ImageUploadWidget
                label="Campaign Featured Image"
                currentImage={formData.featured_image}
                onImageUploaded={(url) => setFormData({ ...formData, featured_image: url })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Chandrapur, Maharashtra"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Target Beneficiaries
              </label>
              <input
                type="text"
                value={formData.target_beneficiaries}
                onChange={(e) => setFormData({ ...formData, target_beneficiaries: e.target.value })}
                placeholder="e.g. 500+ Patients / Month"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Fundraising Goal (₹) (Optional)
              </label>
              <input
                type="number"
                value={formData.goal_amount}
                onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                placeholder="e.g. 100000"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Funds Raised (₹)
              </label>
              <input
                type="number"
                value={formData.raised_amount}
                onChange={(e) => setFormData({ ...formData, raised_amount: e.target.value })}
                placeholder="e.g. 25000"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-slate-950 border-slate-800"
              />
              <label htmlFor="is_featured" className="text-xs font-bold text-white cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/25 flex items-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{editingCampaign ? 'Save Changes' : 'Create Campaign'}</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Campaign?"
        message={`Are you sure you want to permanently delete "${deleteCandidate?.title}"? All campaign records and associated updates will be deleted.`}
        confirmLabel="Yes, Delete Campaign"
        isLoading={saving}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
