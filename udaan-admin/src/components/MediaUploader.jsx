import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function MediaUploader({ type = 'images', onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files) => {
    const file = files[0];
    if (!file) return;

    if (type === 'images' && !file.type.startsWith('image/')) {
      return toast.error('Only images are allowed here');
    }
    if (type === 'pdfs' && file.type !== 'application/pdf') {
      return toast.error('Only PDFs are allowed here');
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      
      const res = await fetch('https://api.cloudinary.com/v1_1/daomfdgss/auto/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (data.secure_url) {
        // Save to Firestore media library
        await addDoc(collection(db, 'mediaLibrary'), {
           name: file.name,
           url: data.secure_url,
           type: type,
           createdAt: serverTimestamp()
        });

        toast.success('Successfully uploaded');
        if (onUploadSuccess) onUploadSuccess(data.secure_url, file.name);
      } else {
        toast.error('Upload failed via Cloudinary');
      }
    } catch (error) {
       console.error(error);
       toast.error('Upload failed!');
    } finally {
       setUploading(false);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
        isDragging ? 'border-brand-blue bg-blue-50' : 'border-gray-300 hover:border-brand-blue hover:bg-gray-50'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleUpload(e.dataTransfer.files); }}
    >
      {uploading ? (
        <div className="py-6 max-w-sm mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden relative">
            <div className="bg-brand-blue h-2.5 rounded-full w-full animate-pulse absolute inset-0"></div>
          </div>
          <p className="text-sm font-medium text-gray-600">Uploading to Cloudinary...</p>
        </div>
      ) : (
        <div className="py-2">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-gray-800 font-medium mb-1">Drag and drop your file here</p>
          <p className="text-sm text-gray-500 mb-6">or click to browse</p>
          <label className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 cursor-pointer shadow-sm transition">
            Browse Files
            <input type="file" className="hidden" accept={type === 'images' ? 'image/*' : '.pdf'} onChange={(e) => handleUpload(e.target.files)} />
          </label>
        </div>
      )}
    </div>
  );
}
