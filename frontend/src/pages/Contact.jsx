import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Ambulance, 
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import { contactApi } from '../services/api';
import SectionHeading from '../components/SectionHeading';

export default function Contact({ onOpenVolunteerModal, onOpenDonationModal }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await contactApi.send(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
      });
    } catch (err) {
      console.error('Contact submission error:', err);
      const backendErr = err.response?.data;
      if (backendErr) {
        if (typeof backendErr === 'object') {
          const firstKey = Object.keys(backendErr)[0];
          const val = backendErr[firstKey];
          setError(`${firstKey}: ${Array.isArray(val) ? val.join(', ') : val}`);
        } else {
          setError(String(backendErr));
        }
      } else {
        setError('Failed to send message. Please check your connection or backend status.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-brand-900 via-slate-900 to-slate-900 text-white py-16 px-4 mb-12">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" /> 24/7 Active Infoline & Headquarters
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Connect with Yuva Social Foundation
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Have a question, need emergency ambulance dispatch, or wish to partner with our grassroots initiatives? Our dedicated Chandrapur team is here to assist.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Urgent Emergency Ambulance Bar */}
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-2xl p-6 shadow-xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-red-500/30">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Ambulance className="w-8 h-8 text-white animate-bounce" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-white text-red-700 text-xs font-black uppercase tracking-wider">
                Emergency 24x7 Ambulance Helpline
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1">
                Call +91 91583 67100 / +91 84217 63782
              </h3>
              <p className="text-red-100 text-xs sm:text-sm mt-0.5">
                Free & subsidized critical patient transport service operating across Chandrapur and surrounding talukas.
              </p>
            </div>
          </div>
          <a
            href="tel:+919158367100"
            className="px-6 py-3 rounded-xl bg-white text-red-600 font-extrabold text-sm hover:bg-red-50 transition-all shadow-md hover:scale-105 shrink-0"
          >
            Direct Emergency Call
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Headquarters & Information
              </h2>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Office</h4>
                  <p className="text-slate-800 text-sm font-semibold mt-0.5 leading-relaxed">
                    Yuva Social Foundation<br />
                    Near Gandhi Chowk / Jatpura Gate Area,<br />
                    Chandrapur, Maharashtra – 442401, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Helpline</h4>
                  <p className="text-slate-800 text-sm font-semibold mt-0.5">
                    +91 91583 67100<br />
                    +91 84217 63782
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Electronic Mail</h4>
                  <p className="text-slate-800 text-sm font-semibold mt-0.5">
                    yuvasocialfoundation2017@gmail.com<br />
                    contact@yuvasocialfoundation.org
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Hours of Operation</h4>
                  <p className="text-slate-800 text-sm font-semibold mt-0.5">
                    Office: Mon - Sat: 9:00 AM – 7:00 PM<br />
                    Ambulance & Blood Relief: <strong>24 Hours, 365 Days</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="bg-gradient-to-br from-brand-900 to-slate-900 rounded-2xl p-6 text-white space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-brand-400" />
                Be Part of the Movement
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Join our roster of dedicated youth volunteers or support our community feeding and patient aid programs with a transparent pledge.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {onOpenVolunteerModal && (
                  <button
                    onClick={onOpenVolunteerModal}
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-md"
                  >
                    Volunteer Registration
                  </button>
                )}
                {onOpenDonationModal && (
                  <button
                    onClick={onOpenDonationModal}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
                  >
                    Support a Cause
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send an Official Message</h2>
              <p className="text-slate-500 text-sm mb-6">
                Fill out the form below and our executive team will respond within 24 to 48 hours.
              </p>

              {success ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-900">Message Received Successfully!</h3>
                  <p className="text-emerald-700 text-sm mt-1 max-w-md mx-auto">
                    Thank you for reaching out to Yuva Social Foundation. Our team has received your message and will review it promptly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Patil"
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Subject / Topic
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="ambulance">Ambulance Service Assistance</option>
                        <option value="donation">Donation / Sponsorship Inquiry</option>
                        <option value="volunteer">Volunteer Enrollment</option>
                        <option value="blood_camp">Organizing a Blood Camp</option>
                        <option value="media">Press & Media Query</option>
                        <option value="other">Other Concern</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe how we can assist you or your inquiry details..."
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Inquiry to Foundation
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" />
            Location & Service Map (Chandrapur, Maharashtra)
          </h3>
          <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <iframe
              title="Yuva Social Foundation Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.51865492219!2d79.23194091219921!3d19.954605928646944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd2d5d8525b6c31%3A0xe54efb5ef60d5b20!2sChandrapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
