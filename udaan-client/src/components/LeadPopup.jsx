import React, { useEffect, useState } from 'react';
import LeadForm from './LeadForm';
import { useLeadCapture } from '../hooks/useLeadCapture';

export default function LeadPopup() {
  const { isDismissed, dismiss } = useLeadCapture();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrolled / totalHeight >= 0.5) {
        setShowModal(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!showModal || isDismissed) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center px-4 pt-[15vh] overflow-y-auto pb-10 fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative animate-slide-up">
        <button 
          onClick={() => {
            setShowModal(false);
            dismiss();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <img src="/logo-light.png" alt="Udaan" className="h-8 mx-auto mb-3" />
            <h2 className="font-heading font-bold text-2xl text-gray-900">Your rank.<br/>Your dream college.</h2>
            <p className="text-gray-500 font-body text-sm mt-2 max-w-xs mx-auto">Let's figure it out together. Book a free 20-minute call with our experts.</p>
          </div>
          
          <LeadForm onSuccess={() => {
            setShowModal(false);
            dismiss();
          }} isLight={true} />
        </div>
      </div>
    </div>
  );
}
