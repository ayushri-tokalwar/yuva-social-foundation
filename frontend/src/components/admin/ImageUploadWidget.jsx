import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { adminGalleryApi } from '../../services/adminApi';
import { resolveImageUrl } from '../../services/api';

export default function ImageUploadWidget({
  currentImage,
  onImageUploaded,
  label = "Upload Image",
  helpText = "Supports JPG, PNG, WebP (Max 15MB)"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Image file size must be less than 15MB.");
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, and WebP images are supported.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const res = await adminGalleryApi.uploadImage(file);
      if (res.url) {
        onImageUploaded(res.url);
      }
    } catch (err) {
      setUploadError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Image upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      onImageUploaded(customUrlInput.trim());
      setCustomUrlInput('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-brand-600 hover:text-brand-700 font-semibold transition-colors"
        >
          {showUrlInput ? "Hide Direct URL" : "Enter File/URL Manually"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <input
            type="text"
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            placeholder="e.g. YSF13.jpeg or /media/uploads/... or https://..."
            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
          <button
            type="button"
            onClick={handleApplyCustomUrl}
            className="px-3 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Apply
          </button>
        </div>
      )}

      {/* Preview if exists */}
      {currentImage ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 aspect-video flex items-center justify-center group">
          <img
            src={resolveImageUrl(currentImage)}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/YSFLogo.jpg';
            }}
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold hover:bg-white shadow transition-transform hover:scale-105"
            >
              Replace Image
            </button>
            <button
              type="button"
              onClick={() => onImageUploaded('')}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow transition-transform hover:scale-105 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] text-white font-mono truncate max-w-[80%]">
            {currentImage}
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Box */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20 hover:bg-brand-50/30"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-brand-600 py-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold">Uploading & validating image...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drop image here
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {helpText}
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
