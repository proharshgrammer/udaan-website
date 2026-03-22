import React, { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import MediaUploader from '../components/MediaUploader';

export default function Team() {
  const { data: team, loading } = useCollection('team', [orderBy('order')]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState({ name: '', role: '', bio: '', photo: '', initials: '', avatarColor: '#4A72A8', examsExpertise: [], studentsGuided: 0, yearsExp: 0, order: 0, coFounder: false });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current.id) {
        await updateDoc(doc(db, 'team', current.id), { ...current });
        toast.success('Team member updated');
      } else {
        await addDoc(collection(db, 'team'), { ...current });
        toast.success('Team member created');
      }
      setIsEditing(false);
      setCurrent({ name: '', role: '', bio: '', photo: '', initials: '', avatarColor: '#4A72A8', examsExpertise: [], studentsGuided: 0, yearsExp: 0, order: 0, coFounder: false });
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team profile?')) return;
    try {
      await deleteDoc(doc(db, 'team', id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold font-heading text-gray-900">Manage Team</h1>
           <p className="text-gray-500 text-sm mt-1">Counsellor profiles and bios</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-brand-blue text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-dark transition shadow-sm">
            Add Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-6 font-heading">{current.id ? 'Edit' : 'Add'} Profile</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="md:col-span-1 border-r border-gray-100 pr-8">
               <label className="block text-sm font-medium text-gray-700 mb-2">Display Photo</label>
               {current.photo ? (
                  <div className="relative rounded-full overflow-hidden w-40 h-40 mx-auto border-4 border-gray-50 shadow-sm group">
                    <img src={current.photo} alt="Avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <button type="button" onClick={() => setCurrent({...current, photo: ''})} className="text-white font-medium text-sm hover:underline">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="scale-[0.85] transform origin-top w-full">
                    <MediaUploader type="images" onUploadSuccess={(url) => setCurrent({...current, photo: url})} />
                  </div>
                )}
                
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Or Initials (Fallback)</label>
                    <input type="text" maxLength={2} className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-brand-blue outline-none text-center font-heading text-xl uppercase tracking-widest" value={current.initials} onChange={e => setCurrent({...current, initials: e.target.value.toUpperCase()})} placeholder="RS" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Avatar Color (Fallback)</label>
                    <input type="color" className="w-full h-10 px-1 py-1 border rounded-md cursor-pointer bg-white" value={current.avatarColor || '#4A72A8'} onChange={e => setCurrent({...current, avatarColor: e.target.value})} />
                  </div>
                </div>
             </div>

             <div className="md:col-span-2 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.name} onChange={e => setCurrent({...current, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Title</label>
                    <input type="text" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.role} onChange={e => setCurrent({...current, role: e.target.value})} placeholder="e.g. Senior Counsellor" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea required rows="3" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.bio} onChange={e => setCurrent({...current, bio: e.target.value})} />
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Students Guided</label>
                    <input type="number" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.studentsGuided} onChange={e => setCurrent({...current, studentsGuided: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years Exp.</label>
                    <input type="number" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.yearsExp} onChange={e => setCurrent({...current, yearsExp: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input type="number" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.order} onChange={e => setCurrent({...current, order: Number(e.target.value)})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exams Expertise (comma sep)</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none transition" value={current.examsExpertise.join(', ')} onChange={e => setCurrent({...current, examsExpertise: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} placeholder="JEE, UPTU" />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="coFounder" className="w-4 h-4 text-brand-blue" checked={current.coFounder} onChange={e => setCurrent({...current, coFounder: e.target.checked})} />
                  <label htmlFor="coFounder" className="text-sm font-medium text-gray-700 cursor-pointer">Display "Co-founder" badge</label>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button type="submit" className="bg-brand-blue text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-dark transition shadow-sm">Save Profile</button>
                  <button type="button" onClick={() => { setIsEditing(false); setCurrent({ name: '', role: '', bio: '', photo: '', initials: '', avatarColor: '#4A72A8', examsExpertise: [], studentsGuided: 0, yearsExp: 0, order: 0, coFounder: false }); }} className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition">Cancel</button>
                </div>
             </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? <div className="col-span-full py-10 text-center text-gray-500">Loading team...</div> : team.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-5 shadow-sm group hover:border-brand-blue transition">
              <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-gray-50 shadow-sm flex items-center justify-center font-heading text-white text-xl font-bold" style={{ backgroundColor: m.avatarColor || '#4A72A8' }}>
                {m.photo ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" /> : m.initials}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-heading font-bold text-gray-900 truncate pr-2 tracking-tight text-lg mb-0.5">{m.name} {m.coFounder && <span className="ml-2 text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full relative -top-0.5 uppercase tracking-wide font-bold">Co-founder</span>}</h3>
                     <p className="text-sm text-gray-500 font-medium">{m.role}</p>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => { setCurrent({ ...m, examsExpertise: m.examsExpertise || [] }); setIsEditing(true); }} className="text-gray-400 hover:text-brand-blue bg-gray-50 hover:bg-blue-50 p-1.5 rounded transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                     <button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-1.5 rounded transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                   </div>
                 </div>
                 <div className="text-[13px] text-gray-500 mt-3 space-x-1 truncate font-medium bg-gray-50 px-2 py-1 rounded inline-block">
                   <span>{m.studentsGuided}+ students</span> <span className="text-gray-300">•</span> 
                   <span>{m.yearsExp} yrs exp</span> <span className="text-gray-300">•</span> 
                   <span>{m.examsExpertise?.join(', ')}</span> <span className="text-gray-300">•</span> 
                   <span>Ord: {m.order}</span>
                 </div>
              </div>
            </div>
          ))}
          {!loading && team.length === 0 && (
             <div className="col-span-full text-center py-20 bg-white border border-gray-100 rounded-xl font-medium text-gray-500">
                No team profiles found.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
