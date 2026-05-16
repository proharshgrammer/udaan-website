import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../config/collections';

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    async function loadBanners() {
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.BANNERS));
        const loadedBanners = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.imageUrl && data.imageUrl.includes('cloudinary.com')) {
            data.imageUrl = 'https://placehold.co/1200x400/1e3a8a/ffffff?text=Udaan+Vidyapeeth';
          }
          loadedBanners.push({ id: doc.id, ...data });
        });
        setBanners(loadedBanners);
      } catch (err) {
        console.error("Error loading banners:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBanners();
  }, []);

  const scrollToIndex = useCallback((index) => {
    if (scrollRef.current && banners.length > 0) {
      const safeIndex = ((index % banners.length) + banners.length) % banners.length;
      const scrollWidth = scrollRef.current.scrollWidth / banners.length;
      scrollRef.current.scrollTo({ left: scrollWidth * safeIndex, behavior: 'smooth' });
      setActiveIndex(safeIndex);
    }
  }, [banners.length]);

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % banners.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, [banners.length, scrollToIndex]);

  // Track scroll position for dot indicators
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || banners.length === 0) return;
    const handleScroll = () => {
      const scrollWidth = el.scrollWidth / banners.length;
      const newIndex = Math.round(el.scrollLeft / scrollWidth);
      setActiveIndex(newIndex);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [banners.length]);

  const pauseAutoPlay = () => clearInterval(autoPlayRef.current);
  const resumeAutoPlay = () => {
    if (banners.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % banners.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);
  };

  const scrollLeft = () => { pauseAutoPlay(); scrollToIndex(activeIndex - 1); resumeAutoPlay(); };
  const scrollRight = () => { pauseAutoPlay(); scrollToIndex(activeIndex + 1); resumeAutoPlay(); };

  if (loading || banners.length === 0) return null;

  return (
    <div className="relative w-full bg-brand-bg group" onMouseEnter={pauseAutoPlay} onMouseLeave={resumeAutoPlay}>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="relative w-full flex-shrink-0 snap-center">
            {banner.link ? (
              <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block w-full h-[300px] md:h-[450px]">
                <img src={banner.imageUrl} alt={banner.title || 'Udaan Vidyapeeth promotional banner'} className="w-full h-full object-cover" />
              </a>
            ) : (
              <div className="w-full h-[300px] md:h-[450px]">
                <img src={banner.imageUrl} alt={banner.title || 'Udaan Vidyapeeth promotional banner'} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => { pauseAutoPlay(); scrollToIndex(i); resumeAutoPlay(); }}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
