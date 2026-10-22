import React, { useState, useEffect } from 'react';
import { adminVolunteersApi } from '../../services/adminApi';
import {
  Users,
  Search,
  Filter,
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

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const data = await adminVolunteersApi.list(params);
      if (data.results) {
        setVolunteers(data.results);
        setTotalItems(data.count || data.results.length);
      } else {
        setVolunteers(Array.isArray(data) ? data : []);
        setTotalItems(Array.isArray(data) ? data.length : 0);
      }
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchVolunteers();
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      const updated = await adminVolunteersApi.update(id, { status: newStatus });
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
      );
      if (selectedVolunteer && selectedVolunteer.id === id) {
        setSelectedVolunteer({ ...selectedVolunteer, status: newStatus });
      }
      setToastMessage(`Volunteer status updated to ${newStatus}.`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to update volunteer status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNotesSave = async (id, notes) => {
    setActionLoading(true);
    try {
      await adminVolunteersApi.update(id, { internal_notes: notes });
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, internal_notes: notes } : v))
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
      await adminVolunteersApi.delete(deleteCandidate.id);
      setVolunteers((prev) => prev.filter((v) => v.id !== deleteCandidate.id));
      setDeleteCandidate(null);
      if (selectedVolunteer?.id === deleteCandidate.id) {
        setIsDetailOpen(false);
      }
      setToastMessage('Volunteer registration record deleted.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to delete volunteer.');
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-400" />
            Volunteer Registrations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage submissions received through the Join Us / Volunteer application form.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="active">Active Volunteer</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
            <p className="text-xs font-semibold">Loading volunteer submissions...</p>
          </div>
        ) : volunteers.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No volunteer applications found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Interests & Skills</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{vol.full_name || `${vol.first_name} ${vol.last_name}`}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Availability: {vol.availability || 'Not specified'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-mono text-[11px]">{vol.phone}</div>
                      <div className="text-slate-400 text-[11px] truncate max-w-[160px]">
                        {vol.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{vol.city || 'Chandrapur'}</div>
                      <span className="text-[10px] text-slate-500">{vol.state || 'Maharashtra'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs">
                      <div className="font-medium text-slate-300 truncate">
                        {vol.interests || 'General volunteer'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        Skills: {vol.skills || 'None listed'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={vol.status}
                        onChange={(e) => handleStatusChange(vol.id, e.target.value)}
                        className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="active">Active</option>
                        <option value="contacted">Contacted</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                      {new Date(vol.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedVolunteer(vol);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Full Submission"
                        >
                          <Eye className="w-4 h-4 text-sky-400" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(vol)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Submission"
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

      {/* Volunteer Details Modal */}
      {selectedVolunteer && (
        <AdminModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Volunteer Application: ${selectedVolunteer.full_name || `${selectedVolunteer.first_name} ${selectedVolunteer.last_name}`}`}
          subtitle={`Submitted on ${new Date(selectedVolunteer.created_at).toLocaleString()}`}
        >
          <div className="space-y-6 text-xs text-slate-300">
            {/* Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Contact Number</p>
                <p className="text-sm font-mono font-bold text-white mt-0.5">{selectedVolunteer.phone}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Email Address</p>
                <p className="text-sm font-bold text-white mt-0.5">{selectedVolunteer.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">City & State</p>
                <p className="font-medium text-slate-200 mt-0.5">
                  {selectedVolunteer.city}, {selectedVolunteer.state}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Address Details</p>
                <p className="font-medium text-slate-200 mt-0.5">
                  {selectedVolunteer.address_line1} {selectedVolunteer.address_line2 || ''}
                </p>
              </div>
            </div>

            {/* Service & Skills */}
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Interests & Areas of Support</p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-medium text-slate-200">
                  {selectedVolunteer.interests || 'None specified'}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Skills & Capabilities</p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-medium text-slate-200">
                  {selectedVolunteer.skills || 'None specified'}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Availability</p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-medium text-slate-200">
                  {selectedVolunteer.availability || 'Flexible / On Call'}
                </div>
              </div>

              {selectedVolunteer.message && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Applicant Motivation / Message</p>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 italic text-slate-300 leading-relaxed">
                    "{selectedVolunteer.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Status & Notes Management */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Application Status</p>
                  <p className="text-[11px] text-slate-400">Current status in Yuva Social Foundation</p>
                </div>
                <select
                  value={selectedVolunteer.status}
                  onChange={(e) => handleStatusChange(selectedVolunteer.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="active">Active</option>
                  <option value="contacted">Contacted</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Admin Internal Notes
                </label>
                <textarea
                  defaultValue={selectedVolunteer.internal_notes || ''}
                  rows={3}
                  placeholder="Add verification notes, call outcomes, background check info..."
                  onBlur={(e) => handleNotesSave(selectedVolunteer.id, e.target.value)}
                  className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Changes are saved automatically when clicking outside.</p>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Volunteer Submission?"
        message={`Are you sure you want to permanently delete the registration record for ${deleteCandidate?.full_name || 'this volunteer'}?`}
        confirmLabel="Yes, Delete Record"
        isLoading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
