import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getServices, resolveImageUrl } from '../services/api';
import * as Icons from 'lucide-react';
import { X, CheckCircle2, Heart, Users, ArrowRight } from 'lucide-react';

export default function Services({ onOpenVolunteerModal, onOpenDonationModal }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to fetch services list.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Health4.jpg"
            alt="Yuva Social Foundation Services"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
            Our Work & Services
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Welfare Initiatives for a Better Society
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Delivering selfless support through healthcare checkups, 24/7 emergency ambulance, hunger relief, child literacy, and community welfare.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="15 Dedicated Services"
          title="Explore How We Serve Communities"
          subtitle="Click on any initiative to learn more about our ground operations and how you can participate."
          center={true}
        />

        {loading ? (
          <LoadingSpinner text="Loading welfare services..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={(s) => setSelectedService(s)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
              <img
                src={resolveImageUrl(selectedService.image)}
                alt={selectedService.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/YSFLogo.jpg";
                }}
              />
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4 max-h-[50vh] overflow-y-auto">
              <h3 className="text-2xl font-black text-slate-900">
                {selectedService.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedService.detailed_description || selectedService.short_description}
              </p>

              {/* Key Points */}
              {selectedService.key_points && (
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    What We Provide:
                  </h4>
                  <ul className="space-y-2">
                    {selectedService.key_points.split('\n').filter(p => p.trim()).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    onOpenVolunteerModal();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Volunteer for this
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    onOpenDonationModal();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" /> Support this Initiative
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
