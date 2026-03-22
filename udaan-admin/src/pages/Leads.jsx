import React from 'react';
import { useCollection } from '../hooks/useFirestore';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Leads() {
  const { data: leads, loading } = useCollection('leads', [orderBy('createdAt', 'desc')]);

  const toggleRead = async (id, currentRead) => {
    try {
      await updateDoc(doc(db, 'leads', id), { read: !currentRead });
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead forever?')) return;
    try {
      await deleteDoc(doc(db, 'leads', id));
      toast.success('Lead deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Leads Inbox</h1>
        <p className="text-gray-500 text-sm mt-1">Manage incoming student inquiries</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? <div className="p-12 text-center text-gray-500 font-medium">Loading leads...</div> : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b">
              <tr>
                <th className="px-6 py-4 font-medium w-4"></th>
                <th className="px-6 py-4 font-medium">Student Info</th>
                <th className="px-6 py-4 font-medium">Context</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right border-r-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead.id} className={`transition ${!lead.read ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 align-top pt-5">
                    <button 
                      onClick={() => toggleRead(lead.id, lead.read)}
                      className={`w-3.5 h-3.5 rounded-full block transition-colors ${lead.read ? 'bg-gray-200 hover:bg-gray-300' : 'bg-brand-blue ring-4 ring-blue-100'}`}
                      title={lead.read ? 'Mark as unread' : 'Mark as read'}
                    />
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className={`font-medium text-[15px] ${!lead.read ? 'text-brand-dark' : 'text-gray-900'}`}>{lead.name}</div>
                    <div className="text-gray-600 mt-0.5">{lead.phone}</div>
                    {lead.email && <div className="text-gray-400 text-xs mt-0.5">{lead.email}</div>}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="text-sm font-medium mb-1"><span className="text-gray-400 inline-block w-12">Exam:</span> <span className="text-brand-blue bg-brand-light px-1.5 rounded">{lead.exam}</span></div>
                    <div className="text-sm mb-1"><span className="text-gray-400 font-medium inline-block w-12">Rank:</span> {lead.rank}</div>
                    <div className="text-sm"><span className="text-gray-400 font-medium inline-block w-12">City:</span> {lead.city}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 align-top">
                    <div className="font-medium text-gray-700">{lead.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-xs">{lead.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4 align-top pt-5">
                    <a href={`https://wa.me/91${lead.phone.replace(/\D/g,'')}?text=Hi%20${lead.name},%20we%20received%20your%20inquiry%20from%20Udaan%20Vidyapeeth.`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:text-green-700 transition">WhatsApp</a>
                    <button onClick={() => handleDelete(lead.id)} className="text-gray-400 hover:text-red-500 transition font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
