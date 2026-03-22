import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const { id, name, courseType, language, targetAudience, startDate, endDate, thumbnail, originalPrice, price, features } = course;
  
  // Calculate discount dynamically
  const discount = (originalPrice && price && originalPrice > price) 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <div className="bg-white border rounded-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden border-gray-200/80 group">
      
      {/* Banner / Header Image Area */}
      <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
        {thumbnail ? (
           <img src={thumbnail} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-brand-light to-blue-50 flex items-center justify-center">
             <span className="text-brand-blue font-heading font-bold text-xl opacity-30">{name}</span>
           </div>
        )}
        
        {/* Course Type Badge */}
        <div className={`absolute top-0 left-0 text-[10px] font-bold text-white px-3 py-1 rounded-br-lg uppercase tracking-wide shadow-sm z-10 ${courseType === 'Offline' ? 'bg-red-600' : 'bg-brand-blue'}`}>
          {courseType || 'ONLINE'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Title & Language Row */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="font-heading font-bold text-xl text-gray-900 leading-tight">{name}</h3>
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            {language && <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-gray-200 uppercase tracking-widest">{language}</span>}
            <a href={`https://wa.me/91919876543210?text=Hi,%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(name)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.573-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.666.598 1.216.782 1.391.867.176.086.275.072.378-.043l.421-.505c.101-.13.203-.108.363-.049l1.114.526c.159.079.261.121.299.191.037.073.037.42-.107.825z" /></svg>
            </a>
          </div>
        </div>

        {/* Target & Schedule */}
        <div className="mb-4 text-sm text-gray-500 space-y-1.5 font-medium">
          {targetAudience && (
            <div className="flex items-center gap-2 text-gray-600">
               <svg className="w-4 h-4 text-brand-blue/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
               {targetAudience}
            </div>
          )}
          {(startDate || endDate) && (
             <div className="flex items-center gap-2">
                 <svg className="w-4 h-4 text-brand-blue/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 <span>Starts on <strong className="text-gray-900">{startDate}</strong> {endDate && `Ends on ${endDate}`}</span>
             </div>
          )}
        </div>

        {/* Feature Badges */}
        {features && features.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
             {features.map((feature, i) => (
                <div key={i} className="bg-gray-900 text-[#E5C77A] text-[11px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm border border-gray-800">
                   <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                   {feature}
                </div>
             ))}
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between items-end">
             <div>
                {originalPrice && (
                  <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
                     <span className="line-through text-sm font-medium">₹{originalPrice.toLocaleString('en-IN')}</span>
                     <span className="text-[10px] font-medium tracking-wide">(FOR FULL BATCH)</span>
                  </div>
                )}
                <div className="font-heading font-bold text-2xl text-brand-blue">
                   ₹{price ? price.toLocaleString('en-IN') : 'Free'}
                </div>
             </div>
             {discount > 0 && (
                <div className="bg-green-50 text-green-700 border border-green-200/60 text-xs font-bold px-2 py-1.5 rounded flex items-center gap-1">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                   Discount of {discount}% applied
                </div>
             )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to={`/course/${id}`}
              className="text-center bg-white border-2 border-brand-blue/20 text-brand-blue hover:text-white hover:bg-brand-blue hover:border-brand-blue font-heading font-semibold rounded-lg px-4 py-2.5 transition duration-300"
            >
              EXPLORE
            </Link>
            <Link 
              to={`/course/${id}`}
              className="text-center bg-brand-blue hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-blue/30 text-white font-heading font-semibold rounded-lg px-4 py-2.5 transition duration-300 transform"
            >
              BUY NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
