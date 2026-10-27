import React, { useState, useEffect } from 'react';
import { adminVolunteersApi } from '../../services/adminApi';
import {
  UserPlus,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Heart,
  Calendar,
  Sparkles,
  Award,
  CheckCheck
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import AdminPagination from '../../components/admin/AdminPagination';

export default function AdminJoinRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchJoinRequests = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const data = await adminVolunteersApi.list(params);
      if (data.results) {
        setRequests(data.results);
        setTotalItems(data.count || data.results.length);
      } else {
        setRequests(Array.isArray(data) ? data : []);
        setTotalItems(Array.isArray(data) ? data.length : 0);
      }
    } catch (err) {
      console.error('Error fetching join requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinRequests();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJoinRequests();
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await adminVolunteersApi.update(id, { status: newStatus });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
      setToastMessage(`Application status updated to ${newStatus}.`);
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
      await adminVolunteersApi.update(id, { internal_notes: notes });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, internal_notes: notes } : r))
      );
      setToastMessage('Coordinator notes saved.');
      setTimeout(() => setToastMessage(null), 3000);
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
      await adminVolunteersApi.delete(deleteCandidate.id);
      setRequests((prev) => prev.filter((r) => r.id !== deleteCandidate.id));
      setDeleteCandidate(null);
      if (selectedRequest?.id === deleteCandidate.id) {
        setIsDetailOpen(false);
      }
      setToastMessage('Membership request record deleted.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to delete request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      await adminVolunteersApi.downloadCsv();
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
            <UserPlus className="w-6 h-6 text-emerald-400" />
            Foundation Join & Membership Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, verify, and induct applicants who registered to join Yuva Social Foundation's youth brigade.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Requests (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search applicants by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Stage:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Stages</option>
            <option value="pending">Pending Review</option>
            <option value="under_review">Under Verification</option>
            <option value="approved">Approved for Induction</option>
            <option value="active">Active Foundation Member</option>
            <option value="contacted">Contacted</option>
            <option value="rejected">Rejected / Ineligible</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
            <p className="text-xs font-semibold">Loading membership applications...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-20 text-center">
            <UserPlus className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No join requests found</h3>
            <p className="text-xs text-slate-500 mt-1">
              New applicants who fill the Join Us form will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">City / Area</th>
                  <th className="py-3 px-4">Primary Interest</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Induction Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{req.full_name || `${req.first_name} ${req.last_name}`}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Applied {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-mono text-[11px] text-emerald-400">{req.phone}</div>
                      <div className="text-slate-400 text-[11px] truncate max-w-[150px]">{req.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{req.city || 'Chandrapur'}</div>
                      <span className="text-[10px] text-slate-500">{req.state || 'Maharashtra'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-200 truncate max-w-[200px]">
                        {req.interests || 'General Welfare'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {req.availability || 'Weekends / On-Call'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} type="volunteer" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(req.id, 'approved')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                            title="Quick Approve for Induction"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="View Complete Application Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(req)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
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
      {selectedRequest && (
        <AdminModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Join Foundation Application: ${selectedRequest.full_name || `${selectedRequest.first_name} ${selectedRequest.last_name}`}`}
          subtitle={`Submitted on ${new Date(selectedRequest.created_at).toLocaleString()}`}
        >
          <div className="space-y-6 text-xs text-slate-300">
            {/* Quick Summary Pill */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/40 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Current Application Status</p>
                <div className="mt-1">
                  <StatusBadge status={selectedRequest.status} type="volunteer" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-slate-400">Registered From</p>
                <p className="font-bold text-white mt-0.5">{selectedRequest.city}, {selectedRequest.state}</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Applicant Full Name</p>
                <p className="text-sm font-bold text-white mt-0.5">{selectedRequest.full_name || `${selectedRequest.first_name} ${selectedRequest.last_name}`}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Mobile Phone</p>
                <a href={`tel:${selectedRequest.phone}`} className="text-sm font-mono font-bold text-emerald-400 hover:underline block mt-0.5">
                  {selectedRequest.phone}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Email Address</p>
                <a href={`mailto:${selectedRequest.email}`} className="font-medium text-slate-200 hover:underline block mt-0.5">
                  {selectedRequest.email}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Availability Commitment</p>
                <p className="font-medium text-white mt-0.5">{selectedRequest.availability || 'Weekends & On Call'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] font-bold uppercase text-slate-500">Address Details</p>
                <p className="font-medium text-slate-200 mt-0.5">
                  {selectedRequest.address_line1} {selectedRequest.address_line2 || ''}
                </p>
              </div>
            </div>

            {/* Interest & Skills */}
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Chosen Areas of Service</p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-emerald-300">
                  {selectedRequest.interests || 'General Volunteer Support'}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Special Skills / Experience</p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-medium text-slate-200">
                  {selectedRequest.skills || 'None specified'}
                </div>
              </div>

              {selectedRequest.message && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Why They Want to Join YSF</p>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 italic text-slate-300 leading-relaxed">
                    "{selectedRequest.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Status & Coordinator Log */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Update Induction Stage</p>
                  <p className="text-[11px] text-slate-400">Change status upon phone interview or verification</p>
                </div>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Verification</option>
                  <option value="approved">Approved for Induction</option>
                  <option value="active">Active Member</option>
                  <option value="contacted">Contacted</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Coordinator & Background Notes
                </label>
                <textarea
                  defaultValue={selectedRequest.internal_notes || ''}
                  rows={3}
                  placeholder="Record identity check, volunteer ID badge issued, assigned committee..."
                  onBlur={(e) => handleNotesSave(selectedRequest.id, e.target.value)}
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Membership Request?"
        message={`Are you sure you want to permanently delete the application for ${deleteCandidate?.full_name || 'this applicant'}?`}
        confirmLabel="Yes, Delete Application"
        isLoading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
