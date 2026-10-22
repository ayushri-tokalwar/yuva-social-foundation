import React, { useState, useEffect } from 'react';
import { adminDonationsApi } from '../../services/adminApi';
import {
  HeartHandshake,
  Search,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Loader2
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import AdminPagination from '../../components/admin/AdminPagination';

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supportTypeFilter, setSupportTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (supportTypeFilter !== 'all') params.support_type = supportTypeFilter;

      const data = await adminDonationsApi.list(params);
      if (data.results) {
        setDonations(data.results);
        setTotalItems(data.count || data.results.length);
      } else {
        setDonations(Array.isArray(data) ? data : []);
        setTotalItems(Array.isArray(data) ? data.length : 0);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [page, statusFilter, supportTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDonations();
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await adminDonationsApi.update(id, { status: newStatus });
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
      if (selectedDonation && selectedDonation.id === id) {
        setSelectedDonation({ ...selectedDonation, status: newStatus });
      }
      setToastMessage(`Donation request status updated to ${newStatus}.`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNotesSave = async (id, notes) => {
    setActionLoading(true);
    try {
      await adminDonationsApi.update(id, { notes });
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, notes } : d))
      );
      setToastMessage('Admin notes saved successfully.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to save notes.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setActionLoading(true);
    try {
      await adminDonationsApi.delete(deleteCandidate.id);
      setDonations((prev) => prev.filter((d) => d.id !== deleteCandidate.id));
      setDeleteCandidate(null);
      if (selectedDonation?.id === deleteCandidate.id) {
        setIsDetailOpen(false);
      }
      setToastMessage('Donation request deleted.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to delete request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      await adminDonationsApi.downloadCsv();
    } catch (err) {
      alert('Failed to export CSV.');
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
            <HeartHandshake className="w-6 h-6 text-emerald-400" />
            Donation & Support Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review transparent contribution pledges, reference IDs, and verification statuses.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reference, donor, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="contacted">Contacted</option>
              <option value="received">Confirmed</option>
              <option value="receipt_issued">Receipt Issued</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Cause:</span>
            <select
              value={supportTypeFilter}
              onChange={(e) => {
                setSupportTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Causes</option>
              <option value="monetary">Monetary Support</option>
              <option value="food_relief">Food Distribution</option>
              <option value="medical_aid">Medical Aid</option>
              <option value="ambulance_fuel">Ambulance Fuel</option>
              <option value="child_education">Child Education</option>
              <option value="in_kind">In-Kind Material</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
            <p className="text-xs font-semibold">Loading donation requests...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="py-20 text-center">
            <HeartHandshake className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No donation requests found</h3>
            <p className="text-xs text-slate-500 mt-1">
              New donation pledges will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Donor Name</th>
                  <th className="py-3 px-4">Cause / Campaign</th>
                  <th className="py-3 px-4">Amount / Support</th>
                  <th className="py-3 px-4">Preference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {donations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                      {don.reference_id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{don.full_name}</div>
                      <span className="text-[10px] text-slate-400 font-mono font-normal">
                        {don.phone} &bull; {don.city}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-medium">{don.support_type_display || don.support_type}</div>
                      {don.campaign_title && (
                        <div className="text-[10px] text-brand-400 truncate max-w-[150px]">
                          {don.campaign_title}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {don.intended_amount ? `₹${Number(don.intended_amount).toLocaleString('en-IN')}` : 'In-Kind / Non-Cash'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 uppercase text-[10px] font-semibold">
                      {don.payment_preference_display || don.payment_preference}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={don.status}
                        onChange={(e) => handleStatusChange(don.id, e.target.value)}
                        className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="contacted">Contacted</option>
                        <option value="received">Confirmed</option>
                        <option value="receipt_issued">Receipt Issued</option>
                        <option value="completed">Completed</option>
                        <option value="closed">Closed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                      {new Date(don.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedDonation(don);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-emerald-400" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(don)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination
          currentPage={page}
          totalPages={Math.ceil(totalItems / 20) || 1}
          totalItems={totalItems}
          pageSize={20}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Details Modal */}
      {selectedDonation && (
        <AdminModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Donation Request: ${selectedDonation.reference_id}`}
          subtitle={`Submitted on ${new Date(selectedDonation.created_at).toLocaleString()}`}
        >
          <div className="space-y-6 text-xs text-slate-300">
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-emerald-400">Intended Contribution</p>
                <p className="text-xl font-black text-white mt-0.5">
                  {selectedDonation.intended_amount ? `₹${Number(selectedDonation.intended_amount).toLocaleString('en-IN')}` : 'In-Kind Contribution'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-slate-400">Payment Preference</p>
                <p className="font-bold text-slate-200 mt-0.5 uppercase">
                  {selectedDonation.payment_preference_display || selectedDonation.payment_preference}
                </p>
              </div>
            </div>

            {/* Donor Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Donor Name</p>
                <p className="text-sm font-bold text-white mt-0.5">{selectedDonation.full_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Phone</p>
                <p className="text-sm font-mono font-bold text-white mt-0.5">{selectedDonation.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Email Address</p>
                <p className="font-medium text-slate-200 mt-0.5">{selectedDonation.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Location</p>
                <p className="font-medium text-slate-200 mt-0.5">
                  {selectedDonation.city}, {selectedDonation.state}
                </p>
              </div>
              {selectedDonation.pan_number && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500">PAN Number (for Receipt)</p>
                  <p className="font-mono font-bold text-brand-400 mt-0.5">{selectedDonation.pan_number}</p>
                </div>
              )}
            </div>

            {/* Message / Cause */}
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Target Cause / Campaign</p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-medium text-slate-200">
                {selectedDonation.support_type_display || selectedDonation.support_type}
                {selectedDonation.campaign_title && ` — ${selectedDonation.campaign_title}`}
              </div>
            </div>

            {selectedDonation.message && (
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Donor Note</p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 italic text-slate-300 leading-relaxed">
                  "{selectedDonation.message}"
                </div>
              </div>
            )}

            {/* Notes & Status */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Verification Status</p>
                  <p className="text-[11px] text-slate-400">Update status after confirming bank/UPI details</p>
                </div>
                <select
                  value={selectedDonation.status}
                  onChange={(e) => handleStatusChange(selectedDonation.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="contacted">Contacted</option>
                  <option value="received">Confirmed</option>
                  <option value="receipt_issued">Receipt Issued</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Admin Internal Notes / Receipt Number
                </label>
                <textarea
                  defaultValue={selectedDonation.notes || ''}
                  rows={3}
                  placeholder="Record UPI reference ID, bank receipt number, certificate sent date..."
                  onBlur={(e) => handleNotesSave(selectedDonation.id, e.target.value)}
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Changes are saved automatically when clicking outside.</p>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Donation Request Record?"
        message={`Are you sure you want to delete donation request ${deleteCandidate?.reference_id} from ${deleteCandidate?.full_name}?`}
        confirmLabel="Yes, Delete Record"
        isLoading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
