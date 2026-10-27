import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminGalleryApi } from '../../services/adminApi';
import { resolveImageUrl } from '../../services/api';
import {
  Images,
  Upload,
  Search,
  Filter,
  Trash2,
  Edit,
  MapPin,
  CheckCircle,
  X,
  Loader2,
  ZoomIn,
  Star,
  Layers,
  UploadCloud,
  ArrowUpDown
} from 'lucide-react';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ImageUploadWidget from '../../components/admin/ImageUploadWidget';

const EMPTY_ITEM = {
  title: '',
  caption: '',
  category: '',
  image: '',
  location: 'Chandrapur, Maharashtra',
  event_date: '',
  is_featured: false,
  order: 0
};

export default function AdminGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Single Edit/Create Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_ITEM);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Batch Multi-Image Upload states
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchCategory, setBatchCategory] = useState('');
  const [batchLocation, setBatchLocation] = useState('Chandrapur, Maharashtra');
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, active: false });
  const batchFileInputRef = useRef(null);

  // Full-screen Preview modal
  const [previewImage, setPreviewImage] = useState(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const [galleryData, catData] = await Promise.all([
        adminGalleryApi.list({
          search: search.trim() || undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined
        }),
        adminGalleryApi.getCategories()
      ]);

      const list = galleryData.results || (Array.isArray(galleryData) ? galleryData : []);
      setItems(list);
      setCategories(catData.results || (Array.isArray(catData) ? catData : []));

      if (searchParams.get('action') === 'upload') {
        handleOpenCreate();
        setSearchParams({});
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGallery();
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      ...EMPTY_ITEM,
      category: categories[0]?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      caption: item.caption || '',
      category: item.category || (categories[0]?.id || ''),
      image: item.image || '',
      location: item.location || 'Chandrapur, Maharashtra',
      event_date: item.event_date || '',
      is_featured: !!item.is_featured,
      order: item.order || 0
    });
    setIsModalOpen(true);
  };

  const handleToggleFeatured = async (item) => {
    try {
      const newFeatured = !item.is_featured;
      await adminGalleryApi.update(item.id, { is_featured: newFeatured });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_featured: newFeatured } : i));
      setToastMessage(`"${item.title}" ${newFeatured ? 'marked as featured' : 'unmarked from featured'}.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      alert('Failed to toggle featured status.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please provide an image title.');
      return;
    }
    if (!formData.image.trim()) {
      alert('Please upload or select an image file.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        category: formData.category || null,
        order: parseInt(formData.order, 10) || 0
      };

      if (editingItem) {
        const updated = await adminGalleryApi.update(editingItem.id, payload);
        setItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
        setToastMessage(`Gallery photo "${updated.title}" updated.`);
      } else {
        const created = await adminGalleryApi.create(payload);
        setItems((prev) => [created, ...prev]);
        setToastMessage(`New photo "${created.title}" uploaded to gallery.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save gallery item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setSaving(true);
    try {
      await adminGalleryApi.delete(deleteCandidate.id);
      setItems((prev) => prev.filter((i) => i.id !== deleteCandidate.id));
      setToastMessage('Gallery image deleted successfully.');
      setDeleteCandidate(null);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to delete image.');
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // BATCH MULTI-IMAGE UPLOAD
  // ==========================================
  const handleBatchFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setBatchFiles(files);
  };

  const handleBatchUploadStart = async () => {
    if (batchFiles.length === 0) {
      alert('Please select at least one image file.');
      return;
    }

    setBatchProgress({ current: 0, total: batchFiles.length, active: true });
    let successCount = 0;

    for (let i = 0; i < batchFiles.length; i++) {
      const file = batchFiles[i];
      setBatchProgress({ current: i + 1, total: batchFiles.length, active: true });

      try {
        // 1. Upload image to server
        const uploadRes = await adminGalleryApi.uploadImage(file);
        if (uploadRes && uploadRes.url) {
          // 2. Create GalleryItem in database
          const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          await adminGalleryApi.create({
            title: title.charAt(0).toUpperCase() + title.slice(1),
            caption: 'Yuva Social Foundation Community Welfare Drive',
            category: batchCategory || null,
            image: uploadRes.url,
            location: batchLocation || 'Chandrapur, Maharashtra',
            is_featured: false,
            order: 0
          });
          successCount++;
        }
      } catch (err) {
        console.warn(`Failed to upload ${file.name}:`, err);
      }
    }

    setBatchProgress({ current: batchFiles.length, total: batchFiles.length, active: false });
    setIsBatchOpen(false);
    setBatchFiles([]);
    setToastMessage(`Successfully uploaded ${successCount} photos to gallery!`);
    setTimeout(() => setToastMessage(null), 4000);
    fetchGallery();
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
            <Images className="w-6 h-6 text-purple-400" />
            Media & Gallery Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload photos, newspaper clippings, ambulance handovers, and camp pictures with full metadata control.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setBatchFiles([]);
              setBatchCategory(categories[0]?.id || '');
              setIsBatchOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Batch Multi-Upload</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Picture</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, location, caption..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Gallery Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug || c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
          <p className="text-xs font-semibold">Loading media archive...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center bg-slate-950/60 rounded-3xl border border-dashed border-slate-800">
          <Images className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No photos in gallery</h3>
          <p className="text-xs text-slate-500 mt-1">
            Click "Upload Picture" or "Batch Multi-Upload" to add photos to the public gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                <img
                  src={resolveImageUrl(item.image)}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setPreviewImage(item)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/YSFLogo.jpg';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setPreviewImage(item)}
                  className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <span className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-5 h-5 text-purple-600" />
                  </span>
                </button>
                {item.category_name && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                    {item.category_name}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFeatured(item);
                  }}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                    item.is_featured
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-black/60 text-slate-400 hover:text-white'
                  }`}
                  title={item.is_featured ? 'Click to unfeature' : 'Click to feature on homepage'}
                >
                  <Star className={`w-3.5 h-3.5 ${item.is_featured ? 'fill-white' : ''}`} />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                  {item.caption && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 truncate max-w-[120px]">
                    <MapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />
                    {item.location || 'Chandrapur'}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit photo metadata"
                    >
                      <Edit className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete photo"
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

      {/* Upload / Edit Single Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit Photo: ${editingItem.title}` : 'Upload Photo to Foundation Gallery'}
        subtitle="Manage photo title, category, high-res image, and featured status."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Photo Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Free Blood Donation Camp at Chandrapur Hospital"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">None / Unassigned</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <ImageUploadWidget
            label="Photo File *"
            currentImage={formData.image}
            onImageUploaded={(url) => setFormData({ ...formData, image: url })}
            helpText="JPG, PNG, or WebP. Backend validates file type and dimensions."
          />

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Caption / Story
            </label>
            <textarea
              rows={2}
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Brief description of the event, attendees, or achievement..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Event Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Chandrapur, Maharashtra"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Event Date / Year
              </label>
              <input
                type="text"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                placeholder="e.g. October 2024 or 2024-10-15"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="gallery_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-950 border-slate-800"
            />
            <label htmlFor="gallery_featured" className="text-xs font-bold text-white cursor-pointer">
              Highlight in Featured Gallery Carousel
            </label>
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
              className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/25 flex items-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{editingItem ? 'Save Changes' : 'Upload to Gallery'}</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Batch Multi-Upload Modal */}
      <AdminModal
        isOpen={isBatchOpen}
        onClose={() => !batchProgress.active && setIsBatchOpen(false)}
        title="Batch Multi-Image Upload"
        subtitle="Select multiple photos to upload and register them simultaneously."
      >
        <div className="space-y-5 text-xs text-slate-300">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Select Photos (Multiple Selection Allowed) *
            </label>
            <div
              onClick={() => batchFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-purple-500 p-8 rounded-2xl bg-slate-950/60 text-center cursor-pointer transition-colors"
            >
              <UploadCloud className="w-10 h-10 text-purple-400 mx-auto mb-2" />
              <p className="font-bold text-white text-sm">
                {batchFiles.length > 0 ? `${batchFiles.length} files selected` : 'Click to Browse Files'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WebP (up to 15MB each)</p>
            </div>
            <input
              type="file"
              ref={batchFileInputRef}
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleBatchFileSelect}
              className="hidden"
            />
          </div>

          {batchFiles.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-1 p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
              {batchFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 hover:bg-slate-900 rounded">
                  <span className="text-white truncate max-w-[260px]">{file.name}</span>
                  <span className="text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Assign Category
              </label>
              <select
                value={batchCategory}
                onChange={(e) => setBatchCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="">General Welfare</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Default Location
              </label>
              <input
                type="text"
                value={batchLocation}
                onChange={(e) => setBatchLocation(e.target.value)}
                placeholder="Chandrapur, Maharashtra"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          {batchProgress.active && (
            <div className="space-y-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>Uploading Batch...</span>
                <span>{batchProgress.current} / {batchProgress.total}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={batchProgress.active}
              onClick={() => setIsBatchOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={batchProgress.active || batchFiles.length === 0}
              onClick={handleBatchUploadStart}
              className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
            >
              {batchProgress.active && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Upload All {batchFiles.length > 0 ? `(${batchFiles.length})` : ''}</span>
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Full Screen Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-4">
              <img
                src={resolveImageUrl(previewImage.image)}
                alt={previewImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="px-2">
              <h3 className="text-lg font-bold text-white">{previewImage.title}</h3>
              {previewImage.caption && (
                <p className="text-xs text-slate-400 mt-1">{previewImage.caption}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                <span>{previewImage.location}</span>
                <span>&bull;</span>
                <span>{previewImage.category_name}</span>
                {previewImage.event_date && (
                  <>
                    <span>&bull;</span>
                    <span>{previewImage.event_date}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Gallery Photo?"
        message={`Are you sure you want to delete "${deleteCandidate?.title}"? The associated file will be cleaned from server storage if not in use elsewhere.`}
        confirmLabel="Yes, Delete Photo"
        isLoading={saving}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
