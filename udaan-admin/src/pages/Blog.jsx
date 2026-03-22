import React, { useState } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import RichEditor from '../components/RichEditor';
import MediaUploader from '../components/MediaUploader';

export default function Blog() {
  const { data: blogs, loading } = useCollection('blogs', [orderBy('date', 'desc')]);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState({ title: '', body: '', exams: [], published: false, thumbnail: '', readTime: 5 });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!current.body) return toast.error('Body content is required');
    try {
      if (current.id) {
        await updateDoc(doc(db, 'blogs', current.id), { ...current });
        toast.success('Blog updated');
      } else {
        await addDoc(collection(db, 'blogs'), { ...current, date: serverTimestamp() });
        toast.success('Blog created');
      }
      setIsEditing(false);
      setCurrent({ title: '', body: '', exams: [], published: false, thumbnail: '', readTime: 5 });
    } catch (err) {
      toast.error('Failed to save');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await deleteDoc(doc(db, 'blogs', id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold font-heading text-gray-900">Manage Blogs</h1>
           <p className="text-gray-500 text-sm mt-1">Write and publish articles for the site</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-brand-blue text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-dark transition shadow-sm">
            Create Post
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-heading">{current.id ? 'Edit' : 'Create'} Post</h2>
            <div className="flex items-center gap-3">
               <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                 <input type="checkbox" className="w-4 h-4 text-brand-blue" checked={current.published} onChange={e => setCurrent({...current, published: e.target.checked})} />
                 Publish globally
               </label>
            </div>
          </div>
          
          <form id="blog-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/50 outline-none text-lg font-medium transition" placeholder="Catchy title..." value={current.title} onChange={e => setCurrent({...current, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <RichEditor value={current.body} onChange={val => setCurrent({...current, body: val})} />
              </div>
            </div>
            
            <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                {current.thumbnail ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={current.thumbnail} alt="Thumbnail preview" className="w-full h-40 object-cover" />
                    <button type="button" onClick={() => setCurrent({...current, thumbnail: ''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <MediaUploader type="images" onUploadSuccess={(url) => setCurrent({...current, thumbnail: url})} />
                )}
                <input type="url" placeholder="Or enter image URL..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md mt-3 outline-none focus:border-brand-blue" value={current.thumbnail} onChange={e => setCurrent({...current, thumbnail: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Exams</label>
                <input type="text" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-brand-blue transition" value={current.exams.join(', ')} onChange={e => setCurrent({...current, exams: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} placeholder="e.g. JEE, NEET" />
                <p className="text-xs text-gray-500 mt-1">Comma separated</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Read Time (minutes)</label>
                <input type="number" min="1" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md outline-none focus:border-brand-blue transition" value={current.readTime} onChange={e => setCurrent({...current, readTime: parseInt(e.target.value) || 5})} />
              </div>

              <div className="pt-6 border-t border-gray-200 space-y-3">
                <button type="submit" form="blog-form" className="w-full bg-brand-blue text-white px-5 py-3 rounded-lg font-medium hover:bg-brand-dark transition shadow-sm">Save Post</button>
                <button type="button" onClick={() => { setIsEditing(false); setCurrent({ title: '', body: '', exams: [], published: false, thumbnail: '', readTime: 5 }); }} className="w-full bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? <div className="p-12 text-center text-gray-500 font-medium">Loading posts...</div> : (
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 border-b">
                 <tr>
                   <th className="px-6 py-4 font-medium w-16">Image</th>
                   <th className="px-6 py-4 font-medium">Post Details</th>
                   <th className="px-6 py-4 font-medium">Status</th>
                   <th className="px-6 py-4 font-medium">Date</th>
                   <th className="px-6 py-4 font-medium text-right border-r-0">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {blogs.map(b => (
                   <tr key={b.id} className="hover:bg-gray-50 transition group">
                     <td className="px-6 py-4">
                       {b.thumbnail ? (
                         <img src={b.thumbnail} alt="" className="w-12 h-12 rounded object-cover border border-gray-200" />
                       ) : (
                         <div className="w-12 h-12 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                         </div>
                       )}
                     </td>
                     <td className="px-6 py-4">
                        <div className="font-semibold text-[15px] text-gray-900 mb-1 group-hover:text-brand-blue transition">{b.title}</div>
                        <div className="flex gap-1.5 flex-wrap">
                           {b.exams?.map((e, idx) => <span key={idx} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{e}</span>)}
                           {(!b.exams || b.exams.length === 0) && <span className="text-gray-400 text-xs italic">No tags</span>}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                       {b.published ? (
                         <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded text-xs font-bold border border-green-200">Published</span>
                       ) : (
                         <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-bold border border-gray-200">Draft</span>
                       )}
                     </td>
                     <td className="px-6 py-4 text-gray-500">
                       {b.date?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                     </td>
                     <td className="px-6 py-4 text-right space-x-4">
                       <button onClick={() => { setCurrent(b); setIsEditing(true); }} className="text-brand-blue font-medium hover:text-brand-dark">Edit</button>
                       <button onClick={() => handleDelete(b.id)} className="text-red-500 font-medium hover:text-red-700">Delete</button>
                     </td>
                   </tr>
                 ))}
                 {blogs.length === 0 && (
                   <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">No posts found. Start writing!</td></tr>
                 )}
               </tbody>
             </table>
          )}
        </div>
      )}
    </div>
  );
}
