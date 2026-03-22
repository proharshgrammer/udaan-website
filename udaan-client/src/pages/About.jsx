import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MentorCard from '../components/MentorCard';
import LeadPopup from '../components/LeadPopup';
import StickyBar from '../components/StickyBar';
import WhatsAppFAB from '../components/WhatsAppFAB';
import { useCollection } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';

export default function About() {
  const { data: mentors, loading } = useCollection('team', [orderBy('order')]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>About Us — Udaan Vidyapeeth</title>
        <meta name="description" content="Meet Ritik and Abhishek — co-founders of Udaan Vidyapeeth. 3 years of counselling expertise, 6000+ students guided." />
      </Helmet>
      <Navbar />

      {/* Story */}
      <section className="bg-brand-bg text-white py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-6">Our Story</h1>
          <p className="font-body text-gray-300 text-lg leading-relaxed mb-6">
            We started Udaan Vidyapeeth because we saw a massive gap in the Indian education system: students spend two years preparing for entrance exams, but are left completely clueless about the college admission process.
          </p>
          <p className="font-body text-gray-300 text-lg leading-relaxed">
            One wrong choice filling decision can cost a student their dream seat. We are here to make sure that doesn't happen. Your rank is your hard work, figuring out the best college for it is our job.
          </p>
        </div>
      </section>

      {/* Mentors */}
      <section id="mentors" className="py-24 px-6 bg-white shrink-0 scroll-mt-20 border-b border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">Meet the Mentors</h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto">The experts who will guide you from the day your results are out, until your orientation day.</p>
          </div>
          
          <div className="flex flex-col gap-8">
            {loading && (
               <div className="text-center py-10 text-gray-400 flex items-center justify-center gap-2">
                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Loading profiles...
               </div>
            )}
            {mentors.map(m => <MentorCard key={m.id} mentor={m} />)}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-brand-blue text-white py-20 px-6 text-center">
        <div className="container mx-auto max-w-5xl">
          <h3 className="font-heading font-bold text-2xl md:text-3xl mb-12">Trusted by 6000+ Aspirants across India</h3>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-90 font-heading font-bold text-xl drop-shadow-sm tracking-wide">
             <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">NITs</div>
             <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">IIITs</div>
             <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">GFTIs</div>
             <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">Top State Colleges</div>
             <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">Medical Colleges</div>
          </div>
        </div>
      </section>

      <Footer />
      <LeadPopup />
      <StickyBar />
      <WhatsAppFAB />
    </div>
  );
}
