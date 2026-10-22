import React, { useState, useEffect } from 'react';
import { adminMessagesApi } from '../../services/adminApi';
import {
  Mail,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  Loader2,
  MessageSquare,
  Ambulance,
  CheckCheck
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import AdminPagination from '../../components/admin/AdminPagination';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const data = await adminMessagesApi.list(params);
      if (data.results) {
        setMessages(data.results);
        setTotalItems(data.count || data.results.length);
      } else {
        setMessages(Array.isArray(data) ? data : []);
        setTotalItems(Array.isArray(data) ? data.length : 0);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMessages();
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await adminMessagesApi.update(id, { status: newStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      setToastMessage(`Message marked as ${newStatus}.`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to update message status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDetail = async (msg) => {
    setSelectedMessage(msg);
    setIsDetailOpen(true);
    // Automatically mark as read if unread
    if (msg.status === 'unread') {
      try {
        await adminMessagesApi.update(msg.id, { status: 'read' });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
        setSelectedMessage({ ...msg, status: 'read' });
      } catch (e) {
        console.warn('Auto mark-read failed:', e);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setActionLoading(true);
    try {
      await adminMessagesApi.delete(deleteCandidate.id);
      setMessages((prev) => prev.filter((m) => m.id !== deleteCandidate.id));
      setDeleteCandidate(null);
      if (selectedMessage?.id === deleteCandidate.id) {
        setIsDetailOpen(false);
      }
      setToastMessage('Contact message deleted.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert('Failed to delete message.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNotesSave = async (id, notes) => {
    setActionLoading(true);
    try {
      await adminMessagesApi.update(id, { internal_notes: notes });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, internal_notes: notes } : m))
      );
      setToastMessage('Notes updated.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      alert('Failed to save notes.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
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
            <Mail className="w-6 h-6 text-red-400" />
            Contact & Emergency Inquiries
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            General public questions, partnership inquiries, and 24/7 ambulance emergency requests.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search messages, names, email, phone..."
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
            <option value="all">All Inquiries</option>
            <option value="unread">Unread / New</option>
            <option value="read">Read</option>
            <option value="in_progress">In Progress</option>
            <option value="replied">Resolved / Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
            <p className="text-xs font-semibold">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center">
            <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No messages in inbox</h3>
            <p className="text-xs text-slate-500 mt-1">
              New inquiries submitted from the website contact page will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-900">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenDetail(msg)}
                className={`p-4 sm:p-5 hover:bg-slate-900/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  msg.status === 'unread' ? 'bg-red-500/[0.04]' : ''
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.subject === 'ambulance_emergency'
                      ? 'bg-red-500/20 text-red-400'
                      : msg.status === 'unread'
                      ? 'bg-brand-500/20 text-brand-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {msg.subject === 'ambulance_emergency' ? (
                      <Ambulance className="w-5 h-5 animate-pulse" />
                    ) : (
                      <MessageSquare className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      <span className="text-xs font-semibold text-brand-400">
                        &bull; {msg.subject_display || msg.subject}
                      </span>
                      {msg.status === 'unread' && (
                        <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span>{msg.phone}</span>
                      <span>&bull;</span>
                      <span>{msg.email}</span>
                      {msg.address && (
                        <>
                          <span>&bull;</span>
                          <span className="truncate max-w-[200px]">{msg.address}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-3 flex-shrink-0">
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(msg.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={msg.status}
                      onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                      className="text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="in_progress">In Progress</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={() => setDeleteCandidate(msg)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Message Modal */}
      {selectedMessage && (
        <AdminModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Message from ${selectedMessage.name}`}
          subtitle={`Subject: ${selectedMessage.subject_display || selectedMessage.subject}`}
        >
          <div className="space-y-6 text-xs text-slate-300">
            {/* Emergency Alert if applicable */}
            {selectedMessage.subject === 'ambulance_emergency' && (
              <div className="p-3.5 rounded-2xl bg-red-950/50 border border-red-800 text-red-200 flex items-center gap-3">
                <Ambulance className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-xs">24/7 Ambulance & Medical Emergency Alert</p>
                  <p className="text-[11px] text-red-300">Direct Contact: {selectedMessage.phone}</p>
                </div>
              </div>
            )}

            {/* Sender Contact Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Contact Number</p>
                <a href={`tel:${selectedMessage.phone}`} className="text-sm font-mono font-bold text-brand-400 hover:underline block mt-0.5">
                  {selectedMessage.phone}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Email Address</p>
                <a href={`mailto:${selectedMessage.email}`} className="text-sm font-bold text-brand-400 hover:underline block mt-0.5">
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.address && (
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Address / Location</p>
                  <p className="font-medium text-slate-200 mt-0.5">{selectedMessage.address}</p>
                </div>
              )}
            </div>

            {/* Message Body */}
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Message Content</p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            {/* Actions & Internal Log */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Status</p>
                  <p className="text-[11px] text-slate-400">Update resolution status</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMessage.status !== 'replied' && (
                    <button
                      onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  )}
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="in_progress">In Progress</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Response Log & Coordinator Notes
                </label>
                <textarea
                  defaultValue={selectedMessage.internal_notes || ''}
                  rows={3}
                  placeholder="Record call summary, who contacted the sender, resolution details..."
                  onBlur={(e) => handleNotesSave(selectedMessage.id, e.target.value)}
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
        title="Delete Contact Inquiry?"
        message={`Are you sure you want to delete the message from ${deleteCandidate?.name}?`}
        confirmLabel="Yes, Delete Message"
        isLoading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
