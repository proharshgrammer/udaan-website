import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LeadPopup from '../components/LeadPopup';
import StickyBar from '../components/StickyBar';
import WhatsAppFAB from '../components/WhatsAppFAB';
import { useCollection } from '../hooks/useFirestore';
import { orderBy, where } from 'firebase/firestore';

export default function Blog() {
  const { data: blogs, loading } = useCollection('blogs', [where('published', '==', true), orderBy('date', 'desc')]);
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

      <div className="bg-brand-bg text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">Blog & Resources</h1>
          <p className="font-body text-gray-300 max-w-2xl mx-auto text-lg">Free articles, guides, and tools to help you navigate college counselling.</p>
        </div>
      </div>

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

        {/* Videos Section */}
        <div className="mb-16">
          <h2 className="font-heading font-bold text-2xl mb-6 text-gray-900 border-l-4 border-red-500 pl-4">Featured Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-xl aspect-video flex items-center justify-center relative group overflow-hidden cursor-pointer shadow-sm">
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
               <svg className="w-16 h-16 text-red-600 drop-shadow-md z-10 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </div>
            <div className="bg-gray-200 rounded-xl aspect-video flex items-center justify-center relative group overflow-hidden cursor-pointer shadow-sm">
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
               <svg className="w-16 h-16 text-red-600 drop-shadow-md z-10 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </div>
          </div>
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
