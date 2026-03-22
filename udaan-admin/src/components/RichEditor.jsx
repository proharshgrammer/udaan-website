import React, { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function RichEditor({ value, onChange }) {
  const quillRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const loadingToast = toast.loading('Uploading to Cloudinary...');

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');
        
        const res = await fetch('https://api.cloudinary.com/v1_1/daomfdgss/image/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await res.json();
        
        if (data.secure_url) {
           await addDoc(collection(db, 'mediaLibrary'), {
              name: file.name,
              url: data.secure_url,
              type: 'images',
              createdAt: serverTimestamp()
           });
           
           toast.success('Image uploaded');
           toast.dismiss(loadingToast);
           
           const quill = quillRef.current.getEditor();
           const range = quill.getSelection(true);
           quill.insertEmbed(range.index, 'image', data.secure_url);
        } else {
           throw new Error('No URL returned from Cloudinary');
        }
      } catch (error) {
         toast.error('Image upload failed');
         toast.dismiss(loadingToast);
         console.error(error);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'blockquote'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      <ReactQuill 
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-[400px] mb-10"
      />
    </div>
  );
}
