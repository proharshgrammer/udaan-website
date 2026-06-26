import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc, orderBy, writeBatch } from 'firebase/firestore';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

// ─── Icons ───────────────────────────────────────────────────────────────────
const SortIcon = ({ direction }) => {
  if (!direction) return (
    <svg className="inline-block ml-1 w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
  return direction === 'asc' ? (
    <svg className="inline-block ml-1 w-3.5 h-3.5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="inline-block ml-1 w-3.5 h-3.5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (ts) =>
  ts?.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) ?? '—';
const formatTime = (ts) =>
  ts?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '';

function buildExportRows(leads) {
  return leads.map(l => ({
    Name: l.name ?? '',
    Phone: l.phone ?? '',
    Email: l.email ?? '',
    Exam: l.exam ?? '',
    Rank: l.rank ?? '',
    City: l.city ?? '',
    Status: l.read ? 'Read' : 'Unread',
    Date: formatDate(l.createdAt),
    Time: formatTime(l.createdAt),
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Leads() {
  const { data: leads, loading } = useCollection('leads', [orderBy('createdAt', 'desc')]);

  // Sorting
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterExam, setFilterExam] = useState('all');

  // Selection (state declared here; derived values are below after `sorted`)
  const [selected, setSelected] = useState(new Set());

  // Export dropdown
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Unique exam values for filter dropdown
  const examOptions = useMemo(() => {
    const set = new Set(leads.map(l => l.exam).filter(Boolean));
    return Array.from(set).sort();
  }, [leads]);

  // ── Filter ──
  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (filterStatus === 'unread' && l.read) return false;
      if (filterStatus === 'read' && !l.read) return false;
      if (filterExam !== 'all' && l.exam !== filterExam) return false;
      return true;
    });
  }, [leads, filterStatus, filterExam]);

  // ── Sort ──
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'createdAt':
          aVal = a.createdAt?.toMillis() ?? 0;
          bVal = b.createdAt?.toMillis() ?? 0;
          break;
        case 'name':
          aVal = (a.name ?? '').toLowerCase();
          bVal = (b.name ?? '').toLowerCase();
          break;
        case 'exam':
          aVal = (a.exam ?? '').toLowerCase();
          bVal = (b.exam ?? '').toLowerCase();
          break;
        case 'read':
          aVal = a.read ? 1 : 0;
          bVal = b.read ? 1 : 0;
          break;
        default:
          return 0;
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortDir]);

  // ── Selection derived values & handlers (after sorted so they can reference it) ──
  const allVisibleSelected = sorted.length > 0 && sorted.every(l => selected.has(l.id));
  const someSelected = selected.size > 0;

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sorted.map(l => l.id)));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir(field === 'createdAt' ? 'desc' : 'asc');
    }
  };

  const sortIndicator = (field) => sortField === field ? sortDir : null;

  // ── Actions ──
  const toggleRead = async (id, currentRead) => {
    try { await updateDoc(doc(db, 'leads', id), { read: !currentRead }); }
    catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead forever?')) return;
    try { await deleteDoc(doc(db, 'leads', id)); toast.success('Lead deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const handleBulkDelete = async () => {
    const count = selected.size;
    if (!window.confirm(`Permanently delete ${count} lead${count !== 1 ? 's' : ''}? This cannot be undone.`)) return;
    try {
      const batch = writeBatch(db);
      selected.forEach(id => batch.delete(doc(db, 'leads', id)));
      await batch.commit();
      setSelected(new Set());
      toast.success(`${count} lead${count !== 1 ? 's' : ''} deleted`);
    } catch {
      toast.error('Bulk delete failed');
    }
  };

  // ── Export ──
  const exportExcel = () => {
    const rows = buildExportRows(sorted);
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [18, 14, 24, 10, 10, 14, 8, 14, 8].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `udaan-leads-${new Date().toISOString().slice(0, 10)}.xlsx`);
    setExportOpen(false);
    toast.success('Excel file downloaded!');
  };

  const exportCSV = () => {
    const rows = buildExportRows(sorted);
    if (!rows.length) { toast.error('No leads to export'); return; }
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => `"${String(r[h]).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `udaan-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    toast.success('CSV downloaded — import into Google Sheets via File → Import!');
  };

  const unreadCount = leads.filter(l => !l.read).length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900 flex items-center gap-2">
            Leads Inbox
            {unreadCount > 0 && (
              <span className="text-xs font-semibold bg-brand-blue text-white px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {filtered.length} of {leads.length} leads shown
          </p>
        </div>

        {/* Export Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setExportOpen(o => !o)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
            <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {exportOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-fade-in">
              <button
                onClick={exportExcel}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
              >
                <span className="w-5 h-5 bg-green-600 text-white text-xs font-bold rounded flex items-center justify-center">X</span>
                Download as Excel (.xlsx)
              </button>
              <button
                onClick={exportCSV}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.99 3H4.01C2.9 3 2 3.9 2 5v14c0 1.1.9 2 2.01 2H20c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2.01-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                </svg>
                Export CSV (Google Sheets)
              </button>
              <div className="px-4 py-1.5 text-xs text-gray-400 border-t border-gray-100 mt-1">
                Exports current filtered &amp; sorted view
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Status toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden text-sm shadow-sm">
          {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilterStatus(val)}
              className={`px-3 py-1.5 transition-colors font-medium ${filterStatus === val ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {label}
              {val === 'unread' && unreadCount > 0 && (
                <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${filterStatus === 'unread' ? 'bg-white/20 text-white' : 'bg-blue-100 text-brand-blue'}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Exam filter */}
        {examOptions.length > 0 && (
          <select
            value={filterExam}
            onChange={e => setFilterExam(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="all">All Exams</option>
            {examOptions.map(exam => <option key={exam} value={exam}>{exam}</option>)}
          </select>
        )}

        {/* Clear filters */}
        {(filterStatus !== 'all' || filterExam !== 'all') && (
          <button
            onClick={() => { setFilterStatus('all'); setFilterExam('all'); }}
            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Bulk action bar — slides in when rows are selected */}
      {someSelected && (
        <div className="flex items-center justify-between mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
          <span className="text-sm font-medium text-red-700">
            {selected.size} lead{selected.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelected(new Set())}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Deselect all
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete {selected.size} selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Loading leads...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                {/* Select-all checkbox */}
                <th className="pl-5 pr-2 py-3.5 w-8">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-brand-blue cursor-pointer accent-brand-blue"
                    title="Select all visible"
                  />
                </th>
                {/* Read-dot column */}
                <th className="px-2 py-3.5 w-4"></th>
                <th
                  className="px-6 py-3.5 font-medium cursor-pointer select-none hover:text-gray-700 transition-colors whitespace-nowrap"
                  onClick={() => handleSort('name')}
                >
                  Student Info <SortIcon direction={sortIndicator('name')} />
                </th>
                <th
                  className="px-6 py-3.5 font-medium cursor-pointer select-none hover:text-gray-700 transition-colors whitespace-nowrap"
                  onClick={() => handleSort('exam')}
                >
                  Context <SortIcon direction={sortIndicator('exam')} />
                </th>
                <th
                  className="px-6 py-3.5 font-medium cursor-pointer select-none hover:text-gray-700 transition-colors whitespace-nowrap"
                  onClick={() => handleSort('createdAt')}
                >
                  Date <SortIcon direction={sortIndicator('createdAt')} />
                </th>
                <th
                  className="px-6 py-3.5 font-medium cursor-pointer select-none hover:text-gray-700 transition-colors whitespace-nowrap"
                  onClick={() => handleSort('read')}
                >
                  Status <SortIcon direction={sortIndicator('read')} />
                </th>
                <th className="px-6 py-3.5 font-medium text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map(lead => (
                <tr key={lead.id} className={`transition-colors ${selected.has(lead.id) ? 'bg-red-50/40' : !lead.read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-gray-50'}`}>
                  {/* Row checkbox */}
                  <td className="pl-5 pr-2 py-4 align-top pt-5">
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-brand-blue"
                    />
                  </td>
                  {/* Read dot */}
                  <td className="px-2 py-4 align-top pt-5">
                    <button
                      onClick={() => toggleRead(lead.id, lead.read)}
                      className={`w-3.5 h-3.5 rounded-full block transition-all ${lead.read ? 'bg-gray-200 hover:bg-gray-300' : 'bg-brand-blue ring-4 ring-blue-100'}`}
                      title={lead.read ? 'Mark as unread' : 'Mark as read'}
                    />
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className={`font-medium text-[15px] ${!lead.read ? 'text-brand-dark' : 'text-gray-900'}`}>{lead.name}</div>
                    <div className="text-gray-600 mt-0.5">{lead.phone}</div>
                    {lead.email && <div className="text-gray-400 text-xs mt-0.5">{lead.email}</div>}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="text-sm font-medium mb-1">
                      <span className="text-gray-400 inline-block w-12">Exam:</span>
                      <span className="text-brand-blue bg-brand-light px-1.5 rounded">{lead.exam}</span>
                    </div>
                    <div className="text-sm mb-1"><span className="text-gray-400 font-medium inline-block w-12">Rank:</span> {lead.rank}</div>
                    <div className="text-sm"><span className="text-gray-400 font-medium inline-block w-12">City:</span> {lead.city}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 align-top">
                    <div className="font-medium text-gray-700">{formatDate(lead.createdAt)}</div>
                    <div className="text-xs">{formatTime(lead.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${lead.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-brand-blue'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${lead.read ? 'bg-gray-400' : 'bg-brand-blue'}`}></span>
                      {lead.read ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4 align-top pt-5">
                    <a
                      href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20we%20received%20your%20inquiry%20from%20Udaan%20Vidyapeeth.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-medium hover:text-green-700 transition"
                    >
                      WhatsApp
                    </a>
                    <button onClick={() => handleDelete(lead.id)} className="text-gray-400 hover:text-red-500 transition font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500 italic">
                    {leads.length === 0 ? 'No leads yet.' : 'No leads match the current filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {sorted.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          Click any column header to sort · Click the dot to toggle read status · Use checkboxes to bulk delete
        </p>
      )}
    </div>
  );
}
