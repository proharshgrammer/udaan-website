import React, { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import MediaUploader from '../components/MediaUploader';
import RichEditor from '../components/RichEditor';

export default function Courses() {
  const { data: courses, loading } = useCollection('courses', [orderBy('order')]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState({
    name: '', courseType: 'Online', thumbnail: '', language: 'Hinglish',
    targetAudience: 'For IIT-JEE Aspirants', startDate: '', endDate: '',
    originalPrice: '', price: '', features: [], aboutBatch: '', moreDetails: '',
    order: 0, active: true, playStoreUrl: '', appStoreUrl: ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current.id) {
        await updateDoc(doc(db, 'courses', current.id), { ...current });
        toast.success('Course updated');
      } else {
        await addDoc(collection(db, 'courses'), { ...current });
        toast.success('Course created');
      }
      setIsEditing(false);
      resetCurrent();
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const resetCurrent = () => {
    setCurrent({
      name: '', courseType: 'Online', thumbnail: '', language: 'Hinglish',
      targetAudience: '', startDate: '', endDate: '',
      originalPrice: '', price: '', features: [], aboutBatch: '', moreDetails: '',
      order: 0, active: true, playStoreUrl: '', appStoreUrl: ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteDoc(doc(db, 'courses', id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold font-heading text-gray-900">Manage Courses</h1>
           <p className="text-gray-500 text-sm mt-1">Configure elaborate course details and pricing</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-brand-blue text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-dark transition shadow-sm">
            Add Course
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-8 font-heading border-b pb-4">{current.id ? 'Edit' : 'Add'} Course</h2>
          <form onSubmit={handleSave} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                 <div className="grid grid-cols-2 gap-5">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                     <input type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.name} onChange={e => setCurrent({...current, name: e.target.value})} placeholder="e.g. Arjuna JEE 2027"/>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Course Type</label>
                     <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.courseType} onChange={e => setCurrent({...current, courseType: e.target.value})}>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                     <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.language} onChange={e => setCurrent({...current, language: e.target.value})} placeholder="Hinglish" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                     <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.targetAudience} onChange={e => setCurrent({...current, targetAudience: e.target.value})} placeholder="For IIT-JEE Aspirants" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                     <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.startDate} onChange={e => setCurrent({...current, startDate: e.target.value})} placeholder="e.g. 13 Apr, 2026" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                     <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.endDate} onChange={e => setCurrent({...current, endDate: e.target.value})} placeholder="e.g. 30 Jun, 2028" />
                   </div>
                 </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Banner</label>
                {current.thumbnail ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={current.thumbnail} alt="Thumbnail preview" className="w-full h-32 object-cover" />
                    <button type="button" onClick={() => setCurrent({...current, thumbnail: ''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <MediaUploader type="images" onUploadSuccess={(url) => setCurrent({...current, thumbnail: url})} />
                )}
                <input type="url" placeholder="Or enter image URL..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mt-3 outline-none focus:border-brand-blue" value={current.thumbnail} onChange={e => setCurrent({...current, thumbnail: e.target.value})} />
              </div>
            </div>

            {/* Pricing Config */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (MRP)</label>
                <input type="number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.originalPrice} onChange={e => setCurrent({...current, originalPrice: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (Selling)</label>
                <input type="number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.price} onChange={e => setCurrent({...current, price: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input type="number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.order} onChange={e => setCurrent({...current, order: Number(e.target.value)})} />
              </div>
            </div>

            {/* Details and Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Highlight Badges (one per line)</label>
                <textarea rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.features.join('\n')} onChange={e => setCurrent({...current, features: e.target.value.split('\n').filter(Boolean)})} placeholder="Premium Features Included\nInfinity Pro" />
                <p className="text-xs text-gray-500 mt-1">These appear directly on the compact course card.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About the Batch (bullet points)</label>
                <textarea rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.aboutBatch} onChange={e => setCurrent({...current, aboutBatch: e.target.value})} placeholder="Paste bullet points here..." />
              </div>
            </div>

            {/* Rich Editor for Detailed Wordpad-like content */}
            <div className="pt-4 border-t">
                <label className="block text-sm font-bold text-gray-900 mb-2">More Details (Rich Text / Course Content)</label>
                <p className="text-xs text-gray-500 mb-3">Copy paste your wordpad documents here. Formatting and line breaks will be preserved.</p>
                <div className="bg-white">
                  <RichEditor value={current.moreDetails} onChange={val => setCurrent({...current, moreDetails: val})} />
                </div>
            </div>

            {/* Links and Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Play Store App Link</label>
                <input type="url" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.playStoreUrl} onChange={e => setCurrent({...current, playStoreUrl: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">App Store iOS Link</label>
                <input type="url" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none" value={current.appStoreUrl} onChange={e => setCurrent({...current, appStoreUrl: e.target.value})} />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="active" className="w-5 h-5 text-brand-blue rounded" checked={current.active} onChange={e => setCurrent({...current, active: e.target.checked})} />
              <label htmlFor="active" className="text-base font-medium text-gray-900 ml-2">Course is publicly visible on the website</label>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => { setIsEditing(false); resetCurrent(); }} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition">Cancel</button>
              <button type="submit" className="bg-brand-blue text-white px-8 py-2.5 rounded-lg font-medium hover:bg-brand-dark transition shadow-md text-lg">Save Course Details</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <div className="col-span-full py-10 text-center text-gray-500">Loading courses...</div> : courses.map(c => (
            <div key={c.id} className={`bg-white rounded-xl border ${c.active ? 'border-gray-200 shadow-sm' : 'border-dashed border-gray-300 opacity-70'} overflow-hidden flex flex-col`}>
              {c.thumbnail && <img src={c.thumbnail} alt={c.name} className="w-full h-40 object-cover border-b border-gray-100" />}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-white ${c.courseType === 'Offline' ? 'bg-red-500' : 'bg-brand-blue'}`}>
                    {c.courseType}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">{c.language}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">{c.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-heading font-bold text-gray-900 text-xl">₹{c.price?.toLocaleString('en-IN')}</span>
                  {c.originalPrice && <span className="text-gray-400 line-through text-sm">₹{c.originalPrice.toLocaleString('en-IN')}</span>}
                </div>
                <div className="text-xs text-gray-500 font-medium mb-4 flex-1">
                  {c.targetAudience}<br/>
                  {c.startDate && <span className="text-gray-400 block mt-1">Starts: {c.startDate}</span>}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                   <div className="text-xs text-brand-dark font-medium">Order: {c.order}</div>
                   <div className="flex gap-3">
                     <button onClick={() => { setCurrent(c); setIsEditing(true); }} className="text-gray-600 hover:text-brand-blue text-sm font-medium transition">Edit</button>
                     <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 text-sm font-medium transition">Delete</button>
                   </div>
                </div>
              </div>
            </div>
          ))}
          {!loading && courses.length === 0 && (
             <div className="col-span-full text-center py-20 bg-white border border-gray-100 rounded-xl">
                No advanced courses yet.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
