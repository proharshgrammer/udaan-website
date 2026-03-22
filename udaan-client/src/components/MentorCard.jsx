import React from 'react';

export default function MentorCard({ mentor }) {
  const { name, role, bio, photo, initials, avatarColor, examsExpertise, studentsGuided, yearsExp } = mentor;
  
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex">
      <div className="w-2 shrink-0" style={{ backgroundColor: avatarColor || '#4A72A8' }}></div>
      <div className="p-5 flex gap-5 w-full items-start">
        <div className="shrink-0 flex items-center justify-center">
          {photo ? (
            <img src={photo} alt={name} className="w-20 h-20 rounded-full object-cover shadow-sm" />
          ) : (
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-heading font-semibold text-2xl shadow-sm"
              style={{ backgroundColor: avatarColor || '#4A72A8' }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-[17px] font-heading font-semibold text-gray-900">{name}</h3>
            {mentor.coFounder && (
              <span className="bg-[#E6F1FB] text-[#0C447C] text-[11px] px-2.5 py-0.5 rounded-full font-medium tracking-wide">
                Co-founder
              </span>
            )}
          </div>
          <p className="text-[13px] text-gray-500 mt-1">{role} · {yearsExp} years experience</p>
          <p className="text-[13px] leading-[1.65] mt-3 font-body text-gray-700">{bio}</p>
          <div className="text-[13px] font-medium text-gray-800 mt-4 flex gap-2 flex-wrap items-center bg-white border border-gray-100 px-3 py-2 rounded-lg max-w-fit">
            <span className="text-brand-blue">{studentsGuided}+ students</span>
            <span className="text-gray-300">•</span>
            <span>{yearsExp} yrs</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600">{examsExpertise?.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
