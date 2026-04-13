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
            {number && (
              <a href={`tel:${number}`} className="bg-[#E6F1FB] hover:bg-[#D0E4F7] text-[#0C447C] text-[12px] px-3 py-1 rounded-full font-medium tracking-wide transition flex items-center gap-1.5 shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                Contact
              </a>
            )}
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
