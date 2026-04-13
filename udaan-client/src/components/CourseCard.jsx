import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course, isEnrolled }) {
  const { id, name, thumbnailUrl, thumbnail, price, discountedPrice, about, mentorName, successPercentage, whatsappLink } = course;
  const courseImage = thumbnailUrl || thumbnail;
  
  // Clean 'about' for concise display
  const shortAbout = about ? (about.length > 80 ? about.substring(0, 80) + '...' : about) : '';

  // Calculate discount dynamically if discountedPrice exists
  const hasDiscount = discountedPrice && discountedPrice < price;
  const discount = hasDiscount 
    ? Math.round(((price - discountedPrice) / price) * 100) 
    : 0;
    
  const currentPrice = hasDiscount ? discountedPrice : price;

  return (
    <div className="bg-white border rounded-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden border-gray-200/80 group">
      
      {/* Banner / Header Image Area */}
      <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
        {courseImage ? (
           <img src={courseImage} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-brand-light to-blue-50 flex items-center justify-center">
             <span className="text-brand-blue font-heading font-bold text-xl opacity-30">{name}</span>
           </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Title & WhatsApp Row */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-heading font-bold text-xl text-gray-900 leading-tight">{name}</h3>
          {(whatsappLink) && (
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition" title="Ask about this course">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.573-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.666.598 1.216.782 1.391.867.176.086.275.072.378-.043l.421-.505c.101-.13.203-.108.363-.049l1.114.526c.159.079.261.121.299.191.037.073.037.42-.107.825z" /></svg>
              </a>
            </div>
          )}
        </div>

        {/* Mentor Info */}
        {(mentorName || successPercentage) && (
          <div className="mb-3 text-sm text-gray-500 font-medium flex items-center justify-between">
            {mentorName && (
              <div className="flex items-center gap-1.5 text-gray-600">
                 <svg className="w-4 h-4 text-brand-blue/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                 By {mentorName}
              </div>
            )}
            {successPercentage && (
              <div className="text-green-600 flex items-center gap-1 font-bold text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                {successPercentage}% success rate
              </div>
            )}
          </div>
        )}

        {/* Short description */}
        <p className="text-gray-600 text-sm mb-5 leading-relaxed">{shortAbout}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-4">
          {!isEnrolled && (
          <div className="flex justify-between items-end">
             <div>
                {hasDiscount && (
                  <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
                     <span className="line-through text-sm font-medium">₹{(price || 0).toLocaleString('en-IN')}</span>
                     <span className="text-[10px] font-medium tracking-wide">(ORIGINAL)</span>
                  </div>
                )}
                <div className="font-heading font-bold text-2xl text-brand-blue">
                   ₹{currentPrice ? currentPrice.toLocaleString('en-IN') : 'Free'}
                </div>
             </div>
             {discount > 0 && (
                <div className="bg-green-50 text-green-700 border border-green-200/60 text-xs font-bold px-2 py-1.5 rounded flex items-center gap-1 shrink-0">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                   {discount}% OFF
                </div>
             )}
          </div>
          )}
          
          <div className={`${isEnrolled ? 'flex justify-center' : 'grid grid-cols-2'} gap-3`}>
            {isEnrolled ? (
               <Link 
                  to={`/course/${id}`}
                  className="w-full text-center bg-brand-blue hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-blue/30 text-white font-heading font-semibold rounded-lg px-4 py-2.5 transition duration-300 transform"
               >
                  CONTINUE LEARNING
               </Link>
            ) : (
               <>
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
               </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
