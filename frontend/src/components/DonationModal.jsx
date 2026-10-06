import React, { useState } from 'react';
import { X, Heart, CheckCircle2, AlertCircle, Loader2, QrCode, Building, ShieldCheck, IndianRupee, Sparkles } from 'lucide-react';
import { submitDonationRequest } from '../services/api';
import confetti from 'canvas-confetti';

const AMOUNT_PRESETS = [500, 1000, 2500, 5000, 10000];

const SUPPORT_TYPES = [
  { id: 'monetary', label: 'General Welfare Fund', desc: 'Used where relief is most urgently needed' },
  { id: 'food_relief', label: 'Food & Hunger Relief Drive', desc: 'Meals and grain kits for poor families' },
  { id: 'ambulance_fuel', label: 'Ambulance & Emergency Fuel', desc: '24/7 patient & accident victim transport' },
  { id: 'medical_aid', label: 'Medical Checkups & Medicines', desc: 'Free clinics and blood donation logistics' },
  { id: 'child_education', label: 'Child Education & School Kits', desc: 'Study materials, bags, and stationery' },
  { id: 'in_kind', label: 'In-Kind / Material Contribution', desc: 'Grains, clothes, blankets, medical kits' },
];

export default function DonationModal({ isOpen, onClose, preselectedCampaign = null }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: 'Chandrapur',
    state: 'Maharashtra',
    support_type: preselectedCampaign?.category_slug === 'emergency' ? 'ambulance_fuel' : 'monetary',
    campaign: preselectedCampaign?.id || '',
    intended_amount: 1000,
    custom_amount: '',
    payment_preference: 'upi',
    pan_number: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleAmountSelect = (amount) => {
    setUseCustomAmount(false);
    setFormData(prev => ({ ...prev, intended_amount: amount, custom_amount: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const amountToSend = useCustomAmount 
      ? parseFloat(formData.custom_amount || 0) 
      : parseFloat(formData.intended_amount || 0);

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      support_type: formData.support_type,
      campaign: formData.campaign || undefined,
      intended_amount: formData.support_type === 'in_kind' ? null : amountToSend,
      payment_preference: formData.payment_preference,
      pan_number: formData.pan_number,
      message: formData.message
    };

    try {
      const result = await submitDonationRequest(payload);
      setSubmitting(false);
      setSuccessData(result.data);
      
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err) {
      setSubmitting(false);
      const backendErr = err.response?.data;
      if (backendErr) {
        if (typeof backendErr === 'object') {
          const firstKey = Object.keys(backendErr)[0];
          const val = backendErr[firstKey];
          setErrorMessage(`${firstKey}: ${Array.isArray(val) ? val.join(', ') : val}`);
        } else {
          setErrorMessage(String(backendErr));
        }
      } else {
        setErrorMessage('Failed to connect to backend server. Please verify your connection.');
      }
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setErrorMessage('');
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      city: 'Chandrapur',
      state: 'Maharashtra',
      support_type: 'monetary',
      campaign: '',
      intended_amount: 1000,
      custom_amount: '',
      payment_preference: 'upi',
      pan_number: '',
      message: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-orange-600 p-6 text-white relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-white/20 text-white">
              <Heart className="w-4 h-4 fill-white" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-100">
              Yuva Social Foundation
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Support a Cause / Pledge Donation
          </h3>
          <p className="text-xs text-orange-100 mt-1">
            Every contribution directly funds meals, medicines, ambulance runs, and school kits in Chandrapur.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {successData ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Pledge Recorded Successfully!
              </h4>
              <p className="text-slate-600 mt-2 max-w-md mx-auto text-sm leading-relaxed">
                Thank you for your generous intention, <span className="font-bold text-slate-800">{successData.full_name || formData.full_name}</span>!
              </p>

              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 max-w-md mx-auto my-6 text-left">
                <div className="flex items-center justify-between border-b border-brand-200/80 pb-3 mb-3">
                  <span className="text-xs text-brand-900 font-semibold">Reference ID:</span>
                  <span className="text-sm font-extrabold text-brand-700 font-mono tracking-wider">
                    {successData.reference_id}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p><span className="font-semibold">Support Cause:</span> {successData.support_type}</p>
                  <p><span className="font-semibold">Amount / Type:</span> ₹{successData.intended_amount || formData.intended_amount}</p>
                  <p><span className="font-semibold">Preferred Mode:</span> {successData.payment_preference}</p>
                </div>
              </div>

              {/* Foundation Bank & UPI Details for genuine transparency */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs mb-6 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Building className="w-4 h-4 text-brand-600" />
                  Official Foundation Account Coordinates:
                </div>
                <p className="text-slate-600">
                  <span className="font-semibold">Account Name:</span> Yuva Social Foundation<br />
                  <span className="font-semibold">UPI ID / Mobile:</span> 8669264943@upi<br />
                  <span className="font-semibold">Branch:</span> Chandrapur, Maharashtra
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  *Our team will contact you on {formData.phone} to confirm receipt.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
              >
                Close & Finish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <span className="font-bold">Error:</span>
                    <p className="mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Cause / Support Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Cause / Support Initiative <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUPPORT_TYPES.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, support_type: type.id }))}
                      className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                        formData.support_type === type.id
                          ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20 text-brand-900'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className="font-bold">{type.label}</span>
                      <span className="text-[11px] text-slate-500 mt-1">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Presets (if not in-kind) */}
              {formData.support_type !== 'in_kind' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Intended Contribution Amount (INR ₹)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2.5">
                    {AMOUNT_PRESETS.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleAmountSelect(amt)}
                        className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          !useCustomAmount && formData.intended_amount === amt
                            ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomAmount(true);
                        setFormData(prev => ({ ...prev, custom_amount: '' }));
                      }}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        useCustomAmount
                          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      Custom Amount
                    </button>
                  </div>

                  {useCustomAmount && (
                    <div className="relative mt-2">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="50"
                        name="custom_amount"
                        required
                        value={formData.custom_amount}
                        onChange={handleChange}
                        placeholder="Enter custom amount in INR"
                        className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Chandrapur"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Payment Mode Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Mode of Contribution
                </label>
                <select
                  name="payment_preference"
                  value={formData.payment_preference}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm outline-none bg-white"
                >
                  <option value="upi">UPI / QR Code Transfer</option>
                  <option value="bank_transfer">Direct Bank Transfer (NEFT / IMPS / RTGS)</option>
                  <option value="cheque">Cheque / Demand Draft</option>
                  <option value="in_person">In-Person at Chandrapur Foundation Office</option>
                </select>
              </div>

              {/* Note / Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Special Note (Optional)
                </label>
                <textarea
                  name="message"
                  rows={2}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any specific note or campaign instructions..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      Submit Donation Request
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
