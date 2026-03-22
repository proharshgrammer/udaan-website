import React from 'react';
import { db } from '../firebase';
import { doc, deleteDoc, orderBy } from 'firebase/firestore';
import { useCollection } from '../hooks/useFirestore';
import MediaUploader from '../components/MediaUploader';
import toast from 'react-hot-toast';

export default function Media() {
  const { data: images, loading } = useCollection('mediaLibrary', [orderBy('createdAt', 'desc')]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this record from your library? (Note: It will not delete the actual file stored in Cloudinary)')) return;
    try {
      await deleteDoc(doc(db, 'mediaLibrary', id));
      toast.success('Removed');
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
         <h1 className="text-2xl font-bold font-heading text-gray-900">Media Library</h1>
         <p className="text-gray-500 text-sm mt-1">Upload and track assets hosted on Cloudinary</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-10 max-w-2xl">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-3">Upload New File</h2>
        <MediaUploader type="images" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex justify-between border-b border-gray-100 pb-3">
          <span>Uploaded Images ({images.length})</span>
        </h2>
        
        {loading ? <div className="py-12 text-center text-gray-500 font-medium">Loading media...</div> : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 aspect-square shadow-sm">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center gap-3 backdrop-blur-sm">
                  <button onClick={() => copyUrl(img.url)} className="bg-white text-gray-900 text-[11px] uppercase tracking-wider font-bold px-4 py-2 rounded shadow-sm hover:bg-gray-100 transition transform hover:scale-105">
                    Copy URL
                  </button>
                  <button onClick={() => handleDelete(img.id)} className="bg-red-500 text-white text-[11px] uppercase tracking-wider font-bold px-4 py-2 rounded shadow-sm hover:bg-red-600 transition transform hover:scale-105">
                    Remove
                  </button>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 pt-4">
                  <p className="text-white text-[10px] truncate max-w-full font-medium tracking-wide" title={img.name}>{img.name}</p>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 font-medium bg-gray-50 rounded-lg border border-dashed border-gray-200">No images uploaded yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
