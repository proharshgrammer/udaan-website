import React from 'react';
import { Link } from 'react-router-dom';

export default function MentorTeaser({ mentors }) {
  if (!mentors || mentors.length === 0) return null;
  
  return (
    <div className="bg-gray-50 rounded-[20px] p-5 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.slice(0, 2).map((mentor, i) => (
          <div key={i} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-50 hover:shadow-md transition">
            {mentor.photo ? (
              <img src={mentor.photo} alt={mentor.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
            ) : (
               <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading font-medium text-xl shrink-0"
                style={{ backgroundColor: mentor.avatarColor || '#4A72A8' }}
              >
                {mentor.initials}
              </div>
            )}
            <div>
              <h4 className="text-[15px] font-heading font-semibold text-gray-900">{mentor.name}</h4>
              <p className="text-[13px] text-brand-blue font-medium mt-0.5">{mentor.examsExpertise?.[0]} Specialist</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <Link to="/about" className="inline-flex items-center text-brand-dark font-medium text-[14px] hover:text-brand-blue group transition">
          Meet our mentors in detail 
          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
