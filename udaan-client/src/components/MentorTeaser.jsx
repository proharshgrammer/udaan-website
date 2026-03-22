import React from 'react';
import { Link } from 'react-router-dom';

export default function MentorTeaser({ mentors }) {
  if (!mentors || mentors.length === 0) return null;
  
  return (
    <div className="bg-gray-50 rounded-[24px] p-8 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mentors.slice(0, 2).map((mentor, i) => (
          <div key={i} className="flex items-center gap-6 bg-white rounded-2xl p-8 shadow-sm border border-gray-50 hover:shadow-md transition">
            {mentor.photo ? (
              <img src={mentor.photo} alt={mentor.name} className="w-20 h-20 rounded-full object-cover shrink-0 shadow-sm" />
            ) : (
               <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-heading font-medium text-2xl shrink-0 shadow-sm"
                style={{ backgroundColor: mentor.avatarColor || '#4A72A8' }}
              >
                {mentor.initials}
              </div>
            )}
            <div>
              <h4 className="text-xl font-heading font-bold text-gray-900">{mentor.name}</h4>
              <p className="text-base text-brand-blue font-semibold mt-1">{mentor.examsExpertise?.[0]} Specialist</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/about" className="inline-flex items-center text-brand-dark font-semibold text-base hover:text-brand-blue group transition">
          Meet our mentors in detail 
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
