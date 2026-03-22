import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import LeadPopup from '../components/LeadPopup';
import StickyBar from '../components/StickyBar';
import WhatsAppFAB from '../components/WhatsAppFAB';
import { useCollection } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';

export default function Courses() {
  const { data: courses, loading } = useCollection('courses', [orderBy('order')]);
  const [filter, setFilter] = useState('All');

  const exams = ['All', 'JEE', 'NEET', 'CUET', 'State'];
  
  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(c => c.exam === filter || (filter === 'State' && !['JEE','NEET','CUET'].includes(c.exam)));

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Counselling Courses & Pricing — Udaan Vidyapeeth</title>
        <meta name="description" content="Affordable college counselling packages for JEE, NEET, CUET, and state exams." />
      </Helmet>
      <Navbar />

      <div className="bg-brand-bg text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">Our Counselling Programs</h1>
          <p className="font-body text-gray-300 max-w-2xl mx-auto text-lg">Choose the right guidance plan for your specific entrance exam.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {exams.map(e => (
            <button 
              key={e}
              onClick={() => setFilter(e)}
              className={`px-5 py-2.5 rounded-full font-heading font-semibold transition text-sm ${
                filter === e ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue hover:text-brand-blue'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium font-body flex gap-3 justify-center items-center">
            <svg className="animate-spin h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading courses...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(c => <CourseCard key={c.id} course={c} />)}
            {filteredCourses.length === 0 && (
              <div className="col-span-full text-center py-20 font-body bg-brand-light/10 rounded-2xl border border-brand-light/30 shadow-sm flex flex-col items-center justify-center gap-3">
                <svg className="w-12 h-12 text-brand-muted opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <p className="text-lg font-medium text-brand-dark">No courses available for this category right now.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Freemium CTA */}
      <section className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-heading font-bold text-3xl mb-4">Not sure which course is right for you?</h2>
          <p className="font-body text-gray-600 mb-8 max-w-xl mx-auto">
            Talk to us first — completely free. Get a 15-minute call to understand exactly what kind of support you need.
          </p>
          <a 
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=Hi! I want a free counselling call`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-green-600 text-white rounded-full px-8 py-4 font-heading font-semibold transition shadow-md hover:-translate-y-0.5"
          >
            Chat on WhatsApp <span className="text-white/80 font-normal ml-1 text-sm tracking-wide">→ free</span>
          </a>
        </div>
      </section>

      <Footer />
      <LeadPopup />
      <StickyBar />
      <WhatsAppFAB />
    </div>
  );
}
