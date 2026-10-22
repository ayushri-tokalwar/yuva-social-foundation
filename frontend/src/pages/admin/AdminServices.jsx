import React, { useState, useEffect } from 'react';
import { adminServicesApi } from '../../services/adminApi';
import { resolveImageUrl } from '../../services/api';
import {
  HandHeart,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploadWidget from '../../components/admin/ImageUploadWidget';

const AVAILABLE_ICONS = [
  'Heart', 'Ambulance', 'Droplet', 'Utensils', 'BookOpen', 'Trees',
  'ShieldCheck', 'Users', 'Activity', 'Award', 'HandHeart', 'Flame'
];

const EMPTY_SERVICE = {
  title: '',
  icon: 'Heart',
  short_description: '',
  detailed_description: '',
  image: '',
  key_points: '',
  is_highlighted: false,
  is_active: true,
  order: 0
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(EMPTY_SERVICE);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await adminServicesApi.list({
        search: search.trim() || undefined
      });
      const list = data.results || (Array.isArray(data) ? data : []);
      setServices(list);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData(EMPTY_SERVICE);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      icon: service.icon || 'Heart',
      short_description: service.short_description || '',
      detailed_description: service.detailed_description || '',
      image: service.image || '',
      key_points: service.key_points || '',
      is_highlighted: !!service.is_highlighted,
      is_active: service.is_active !== false,
      order: service.order || 0
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (service) => {
    try {
      const updated = await adminServicesApi.update(service.id, {
        is_active: !service.is_active
      });
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, is_active: updated.is_active } : s))
      );
      setToastMessage(`Service ${updated.is_active ? 'published' : 'unpublished'}.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      alert('Failed to update status.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.short_description.trim()) {
      alert('Please fill in title and short description.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        order: parseInt(formData.order, 10) || 0
      };

      if (editingService) {
        const updated = await adminServicesApi.update(editingService.id, payload);
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? updated : s))
        );
        setToastMessage(`Service "${updated.title}" updated.`);
      } else {
        const created = await adminServicesApi.create(payload);
        setServices((prev) => [...prev, created]);
        setToastMessage(`Service "${created.title}" created.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setSaving(true);
    try {
      await adminServicesApi.delete(deleteCandidate.id);
      setServices((prev) => prev.filter((s) => s.id !== deleteCandidate.id));
      setToastMessage('Service removed.');
      setDeleteCandidate(null);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to delete service.');
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
            <HandHeart className="w-6 h-6 text-amber-400" />
            Welfare Services & Initiatives
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure the 15+ core community initiatives (Ambulance, Blood Bank, Food Relief, Child Aid).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/25 flex items-center gap-2 transition-all self-start sm:self-auto hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-96 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </form>
        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          {services.length} Total Services
        </span>
      </div>

      {/* Services List / Table */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
          <p className="text-xs font-semibold">Loading welfare services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="py-20 text-center bg-slate-950/60 rounded-3xl border border-dashed border-slate-800">
          <HandHeart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No services found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Click "Add Service" to create a new welfare program.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((srv) => (
            <div
              key={srv.id}
              className={`bg-slate-950/80 rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                srv.is_active ? 'border-slate-800 hover:border-amber-500/50' : 'border-slate-900 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center flex-shrink-0 font-bold">
                    <HandHeart className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(srv)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
                        srv.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {srv.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {srv.is_active ? 'Active' : 'Draft'}
                    </button>
                    {srv.is_highlighted && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                        Priority
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-1">{srv.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {srv.short_description}
                </p>

                {srv.key_points_list && srv.key_points_list.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-900 space-y-1">
                    {srv.key_points_list.slice(0, 2).map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        <span className="truncate">{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px]">Display Order: {srv.order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold transition-colors border border-slate-800 flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3 text-sky-400" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(srv)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? `Edit Service: ${editingService.title}` : 'Add New Welfare Service'}
        subtitle="Services populate the public /services page and emergency contact channels."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Free 24/7 Ambulance Service"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Lucide Icon Name
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {AVAILABLE_ICONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Display Order Priority
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Short Description *
            </label>
            <textarea
              required
              rows={2}
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Brief description for cards and summary blocks..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={formData.detailed_description}
              onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
              placeholder="Detailed operating hours, equipment, coverage area..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <ImageUploadWidget
            label="Service Photo / Banner"
            currentImage={formData.image}
            onImageUploaded={(url) => setFormData({ ...formData, image: url })}
          />

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Key Offering Points (One per line)
            </label>
            <textarea
              rows={3}
              value={formData.key_points}
              onChange={(e) => setFormData({ ...formData, key_points: e.target.value })}
              placeholder="e.g.&#10;Oxygen cylinder equipped&#10;Free for underprivileged families&#10;Coverage across Chandrapur & Ballarpur"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="srv_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-slate-950 border-slate-800"
              />
              <label htmlFor="srv_active" className="text-xs font-bold text-white cursor-pointer">
                Published & Active
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="srv_highlight"
                checked={formData.is_highlighted}
                onChange={(e) => setFormData({ ...formData, is_highlighted: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-slate-950 border-slate-800"
              />
              <label htmlFor="srv_highlight" className="text-xs font-bold text-white cursor-pointer">
                Highlight on Homepage
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
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
              className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/25 flex items-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Welfare Service?"
        message={`Are you sure you want to delete "${deleteCandidate?.title}"?`}
        confirmLabel="Yes, Delete Service"
        isLoading={saving}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
