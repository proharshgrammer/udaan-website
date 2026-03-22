import React from 'react';
import { useLeadCapture } from '../hooks/useLeadCapture';

export default function StickyBar() {
  const { isDismissed, dismiss } = useLeadCapture();

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-bg text-white py-3 px-4 shadow-xl border-t border-white/10 slide-up transform translate-y-0 transition-transform duration-300">
      <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
        <div className="text-sm font-body font-medium flex-1 truncate md:overflow-visible md:whitespace-normal">
          Got your rank? Get a free expert call <span className="hidden md:inline">→</span>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' }); // Just scroll up slightly or directly open popup? Actually, direct to contact page is better!
              window.location.href = '/contact';
            }}
            className="bg-brand-blue hover:bg-brand-dark text-white rounded-full px-5 py-2 font-heading font-semibold text-sm transition"
          >
            Book Now
          </button>
          <button onClick={dismiss} className="text-gray-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
