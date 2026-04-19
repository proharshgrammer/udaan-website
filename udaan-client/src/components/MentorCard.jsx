import React, { useState } from 'react';

export default function MentorCard({ mentor }) {
  const { name, number, about, imageUrl, expertise } = mentor;
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Extract initials if no image is available
  const getInitials = (nameStr) => {
    if (!nameStr) return '?';
    return nameStr.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 shadow-sm">
      <div 
        className="flex cursor-pointer hover:bg-gray-100/80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-2 shrink-0 bg-brand-blue"></div>
        <div className="p-4 sm:p-5 flex gap-4 sm:gap-5 w-full items-center">
          <div className="shrink-0 flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-16 h-16 sm:w-16 sm:h-16 rounded-full object-cover shadow-sm bg-white border border-gray-200" />
            ) : (
              <div className="w-16 h-16 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-heading font-semibold text-xl shadow-sm bg-brand-blue">
                {getInitials(name)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-heading font-semibold text-gray-900 truncate">{name}</h3>
            {expertise && expertise.length > 0 && (
               <p className="text-[13px] text-gray-500 mt-1 truncate">{expertise.join(' • ')}</p>
            )}
          </div>
          <div className="shrink-0 text-gray-400 pl-2">
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      <div 
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
           <div className="p-4 sm:p-5 border-t border-gray-200/60 bg-white">
             {about && <p className="text-[14px] leading-relaxed font-body text-gray-700 whitespace-pre-wrap">{about}</p>}
             
             {expertise && expertise.length > 0 && (
               <div className="text-[12px] font-medium text-gray-800 mt-5 flex gap-2 flex-wrap items-center bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-lg max-w-fit">
                 <span className="text-gray-400 uppercase tracking-widest font-bold text-[10px]">Expertise:</span>
                 <span className="text-brand-blue font-semibold">{expertise.join(' • ')}</span>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
