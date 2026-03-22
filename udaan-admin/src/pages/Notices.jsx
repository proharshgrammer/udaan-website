import React, { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Notices() {
  const { data: notices, loading } = useCollection('notices', [orderBy('date', 'desc')]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState({ title: '', body: '', exams: [], pinned: false, sourceUrl: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current.id) {
        await updateDoc(doc(db, 'notices', current.id), { ...current });
        toast.success('Notice updated');
      } else {
        await addDoc(collection(db, 'notices'), { ...current, date: serverTimestamp() });
        toast.success('Notice added');
      }
      setIsEditing(false);
      setCurrent({ title: '', body: '', exams: [], pinned: false, sourceUrl: '' });
    } catch (err) {
      toast.error('Failed to save');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await deleteDoc(doc(db, 'notices', id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold font-heading text-gray-900">Manage Notices</h1>
           <p className="text-gray-500 text-sm mt-1">Publish news on the website</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-brand-blue text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-dark transition shadow-sm">
            Add New Notice
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">{current.id ? 'Edit' : 'Add'} Notice</h2>
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.title} onChange={e => setCurrent({...current, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <textarea required rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.body} onChange={e => setCurrent({...current, body: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source URL (optional)</label>
              <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.sourceUrl} onChange={e => setCurrent({...current, sourceUrl: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exams (comma separated)</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.exams.join(', ')} onChange={e => setCurrent({...current, exams: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} placeholder="JEE, NEET, CUET" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="pinned" className="w-4 h-4 text-brand-blue" checked={current.pinned} onChange={e => setCurrent({...current, pinned: e.target.checked})} />
              <label htmlFor="pinned" className="text-sm font-medium text-gray-700">Pin to top</label>
            </div>
            <div className="flex gap-3 pt-6">
              <button type="submit" className="bg-brand-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-dark transition">Save Notice</button>
              <button type="button" onClick={() => { setIsEditing(false); setCurrent({ title: '', body: '', exams: [], pinned: false, sourceUrl: '' }); }} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? <div className="p-12 text-center text-gray-500 font-medium">Loading notices...</div> : (
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 border-b">
                 <tr>
                   <th className="px-6 py-4 font-medium">Title</th>
                   <th className="px-6 py-4 font-medium">Exams</th>
                   <th className="px-6 py-4 font-medium">Pinned</th>
                   <th className="px-6 py-4 font-medium text-right border-r-0">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {notices.map(n => (
                   <tr key={n.id} className="hover:bg-gray-50 transition">
                     <td className="px-6 py-4 font-medium text-gray-900">{n.title}</td>
                     <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                           {n.exams?.map((e, idx) => <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{e}</span>)}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                       {n.pinned ? <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Yes</span> : <span className="text-gray-400">No</span>}
                     </td>
                     <td className="px-6 py-4 text-right space-x-4">
                       <button onClick={() => { setCurrent(n); setIsEditing(true); }} className="text-brand-blue font-medium hover:text-brand-dark">Edit</button>
                       <button onClick={() => handleDelete(n.id)} className="text-red-500 font-medium hover:text-red-700">Delete</button>
                     </td>
                   </tr>
                 ))}
                 {notices.length === 0 && (
                   <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">No notices found. Add one point.</td></tr>
                 )}
               </tbody>
             </table>
          )}
        </div>
      )}
    </div>
  );
}
