import React from 'react';

export default function MentorCard({ mentor }) {
  const { name, number, about, imageUrl, expertise } = mentor;
  
  // Extract initials if no image is available
  const getInitials = (nameStr) => {
    if (!nameStr) return '?';
    return nameStr.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex">
      <div className="w-2 shrink-0 bg-brand-blue"></div>
      <div className="p-5 flex gap-5 w-full items-start">
        <div className="shrink-0 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-20 h-20 rounded-full object-cover shadow-sm bg-white" />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-heading font-semibold text-2xl shadow-sm bg-brand-blue">
              {getInitials(name)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-[17px] font-heading font-semibold text-gray-900">{name}</h3>
          </div>
          
          {about && <p className="text-[13px] leading-[1.65] mt-3 font-body text-gray-700">{about}</p>}
          
          {expertise && expertise.length > 0 && (
            <div className="text-[13px] font-medium text-gray-800 mt-4 flex gap-2 flex-wrap items-center bg-white border border-gray-100 px-3 py-2 rounded-lg max-w-fit">
              <span className="text-gray-500 text-xs uppercase tracking-widest font-bold mr-1">Expertise</span>
              <span className="text-brand-blue">{expertise.join(' • ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
