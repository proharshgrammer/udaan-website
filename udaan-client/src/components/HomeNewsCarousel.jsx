import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { orderBy, limit } from 'firebase/firestore';
import { COLLECTIONS } from '../config/collections';
import { Link } from 'react-router-dom';

export default function HomeNewsCarousel() {
  const { data: notices, loading } = useCollection(COLLECTIONS.ANNOUNCEMENTS, [
    orderBy('timestamp', 'desc'),
    limit(10)
  ]);
  
  const publicNotices = (notices?.filter(n => n.sentTo === 'all') || []).slice(0, 3);

  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef(null);

  const nextSlide = useCallback(() => {
    if (publicNotices.length > 0) {
      setActiveIndex((prev) => (prev + 1) % publicNotices.length);
    }
  }, [publicNotices.length]);

  const prevSlide = useCallback(() => {
    if (publicNotices.length > 0) {
      setActiveIndex((prev) => (prev === 0 ? publicNotices.length - 1 : prev - 1));
    }
  }, [publicNotices.length]);

  useEffect(() => {
    if (publicNotices.length <= 1) return;
    autoPlayRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, [publicNotices.length, nextSlide]);

  const pauseAutoPlay = () => clearInterval(autoPlayRef.current);
  const resumeAutoPlay = () => {
    if (publicNotices.length <= 1) return;
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(nextSlide, 5000);
  };

  if (loading || publicNotices.length === 0) return null;

  const currentNotice = publicNotices[activeIndex];

  return (
    <div className="mt-8 mx-auto max-w-4xl" onMouseEnter={pauseAutoPlay} onMouseLeave={resumeAutoPlay}>
      <div className="text-center mb-5">
        <h3 className="font-heading font-bold text-[22px] text-gray-900">News & Announcements</h3>
      </div>
      <div className="relative bg-white rounded-[20px] p-6 shadow-sm border border-gray-200 flex items-center justify-between h-[160px] group/carousel">
        {/* Nav Button Left */}
        {publicNotices.length > 1 && (
          <button 
            onClick={() => { pauseAutoPlay(); prevSlide(); resumeAutoPlay(); }}
            className="text-gray-400 hover:text-brand-blue hover:bg-gray-50 h-10 w-10 flex items-center justify-center rounded-full transition shrink-0"
            aria-label="Previous News"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}

        {/* Content */}
        <div className="flex-1 px-2 md:px-8 text-center flex flex-col justify-center h-full">
          <Link to="/news" className="block group">
            {currentNotice.title ? (
              <h4 className="font-heading font-bold text-[18px] text-brand-dark group-hover:text-brand-blue transition line-clamp-1 mb-2">
                {currentNotice.title}
              </h4>
            ) : (
              <div className="h-[28px] mb-2"></div>
            )}
            <div className="flex items-center justify-center h-[50px] mb-1">
              <p className="font-body text-[15px] text-gray-600 line-clamp-2 leading-relaxed">
                {currentNotice.message}
              </p>
            </div>
            <span className="inline-block text-[13px] text-gray-400 font-medium">
              {currentNotice.timestamp?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </Link>
        </div>

        {/* Nav Button Right */}
        {publicNotices.length > 1 && (
          <button 
            onClick={() => { pauseAutoPlay(); nextSlide(); resumeAutoPlay(); }}
            className="text-gray-400 hover:text-brand-blue hover:bg-gray-50 h-10 w-10 flex items-center justify-center rounded-full transition shrink-0"
            aria-label="Next News"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}

        {/* Optional Dot Indicators */}
        {publicNotices.length > 1 && (
           <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
             {publicNotices.map((_, i) => (
               <button
                 key={i}
                 onClick={() => { pauseAutoPlay(); setActiveIndex(i); resumeAutoPlay(); }}
                 className={`rounded-full transition-all duration-300 ${
                   i === activeIndex ? 'w-5 h-1.5 bg-brand-blue' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                 }`}
                 aria-label={`Go to news ${i + 1}`}
               />
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
