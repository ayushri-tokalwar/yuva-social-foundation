import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { resolveImageUrl } from '../services/api';

export default function GalleryLightbox({
  isOpen,
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]);

  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shadow-lg"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all border border-white/10 hover:scale-110"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all border border-white/10 hover:scale-110"
          aria-label="Next Image"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}

      {/* Image container */}
      <div 
        className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black flex items-center justify-center">
          <img
            src={resolveImageUrl(item.image)}
            alt={item.title}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl animate-scale-up"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/YSFLogo.jpg";
            }}
          />
        </div>

        {/* Caption bar */}
        <div className="mt-4 text-center text-white max-w-2xl px-4">
          <h4 className="text-lg font-bold tracking-tight text-white">
            {item.title}
          </h4>
          {item.caption && (
            <p className="text-xs text-slate-300 mt-1">
              {item.caption}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-2 font-medium">
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-400" /> {item.location}
              </span>
            )}
            {item.event_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-400" /> {item.event_date}
              </span>
            )}
            {item.category_name && (
              <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[11px] font-semibold">
                {item.category_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
