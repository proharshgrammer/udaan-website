import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VantaBackground from '../components/VantaBackground';
import LeadPopup from '../components/LeadPopup';
import StickyBar from '../components/StickyBar';
import WhatsAppFAB from '../components/WhatsAppFAB';
import { useCollection } from '../hooks/useFirestore';
import { orderBy, where } from 'firebase/firestore';
import { COLLECTIONS } from '../config/collections';

// Extract YouTube video ID from various URL formats
function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function YouTubeEmbed({ url, title }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(url);

  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="bg-gray-100 rounded-xl aspect-video overflow-hidden relative group cursor-pointer shadow-sm">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title || 'YouTube video'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div onClick={() => setPlaying(true)} className="w-full h-full relative">
          <img
            src={thumbnailUrl}
            alt={title || 'Video thumbnail'}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition">
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          {title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-heading font-semibold text-sm truncate">{title}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Blog() {
  const { data: blogs, loading } = useCollection('blogs', [where('published', '==', true), orderBy('date', 'desc')]);
  const { data: featuredVideos, loading: videosLoading } = useCollection(COLLECTIONS.FEATURED_VIDEOS, [orderBy('order', 'asc')]);
  const [filter, setFilter] = useState('All');

  const exams = ['All', 'JEE', 'NEET', 'CUET', 'AKTU', 'MHT-CET', 'IPU'];
  
  const filteredBlogs = filter === 'All' 
    ? blogs 
    : blogs.filter(b => b.exams?.includes(filter));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Blog & Resources — Udaan Vidyapeeth</title>
        <meta name="description" content="Free articles, guides, and videos on JEE, NEET, CUET, and state counselling." />
      </Helmet>
      <Navbar />

      <VantaBackground className="bg-brand-bg text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">Blog & Resources</h1>
          <p className="font-body text-gray-300 max-w-2xl mx-auto text-lg">Free articles, guides, and tools to help you navigate college counselling.</p>
        </div>
      </VantaBackground>

      <div className="container mx-auto max-w-6xl px-6 py-12 flex-1">
        
        {/* Exam Filters */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-gray-200 pb-4">
          {exams.map(e => (
            <button 
              key={e}
              onClick={() => setFilter(e)}
              className={`px-4 py-2 rounded-full font-body font-medium transition text-sm ${
                filter === e ? 'bg-brand-blue text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue hover:text-brand-blue'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="mb-16">
          <h2 className="font-heading font-bold text-2xl mb-6 text-gray-900 border-l-4 border-brand-blue pl-4">Latest Articles</h2>
          {loading ? (
             <div className="text-center py-20 text-gray-500 font-medium font-body flex gap-3 justify-center items-center">
                 <svg className="animate-spin h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Loading articles...
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map(b => (
                <article key={b.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col group cursor-pointer">
                  {b.thumbnail ? (
                    <img src={b.thumbnail} alt={b.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-48 bg-brand-light flex items-center justify-center text-brand-blue font-heading font-bold opacity-70 group-hover:scale-105 transition duration-500">
                       Udaan Vidyapeeth
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {b.exams?.map((e, index) => (
                        <span key={index} className="text-[11px] font-bold tracking-wider text-brand-blue uppercase bg-brand-light px-2.5 py-1 rounded-sm">{e}</span>
                      ))}
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-3 group-hover:text-brand-blue transition">{b.title}</h3>
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>{b.date?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>{b.readTime || 5} min read</span>
                    </div>
                  </div>
                </article>
              ))}
              {filteredBlogs.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  No articles found for this category.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Featured Videos Section */}
        <div className="mb-16">
          <h2 className="font-heading font-bold text-2xl mb-6 text-gray-900 border-l-4 border-red-500 pl-4">Featured Videos</h2>
          {videosLoading ? (
            <div className="text-center py-12 text-gray-500 font-medium flex gap-3 justify-center items-center">
              <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading videos...
            </div>
          ) : featuredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredVideos.map(video => (
                <YouTubeEmbed key={video.id} url={video.url} title={video.title} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <p className="font-medium">No featured videos yet. Check back soon!</p>
            </div>
          )}
          <div className="mt-6 text-center">
             <a href={import.meta.env.VITE_YOUTUBE_URL || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-600 font-medium hover:underline">
               Subscribe to our channel →
             </a>
          </div>
        </div>

      </div>

      <Footer />
      <LeadPopup />
      <StickyBar />
      <WhatsAppFAB />
    </div>
  );
}
