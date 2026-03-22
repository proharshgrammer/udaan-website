import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExamBadge from '../components/ExamBadge';
import LeadPopup from '../components/LeadPopup';
import StickyBar from '../components/StickyBar';
import WhatsAppFAB from '../components/WhatsAppFAB';
import { useCollection } from '../hooks/useFirestore';
import { orderBy } from 'firebase/firestore';

export default function News() {
  const { data: notices, loading } = useCollection('notices', [orderBy('date', 'desc')]);

  const pinnedNotice = notices.find(n => n.pinned);
  const otherNotices = notices.filter(n => !n.pinned);

  const renderNotice = (n, isPinned = false) => (
    <div key={n.id} className={`bg-white rounded-2xl p-7 border ${isPinned ? 'border-[#ffecb3] bg-[#fffdf5] shadow-md relative overflow-hidden' : 'border-gray-100 shadow-sm'} mb-6 group transition hover:shadow-md`}>
      {isPinned && <div className="absolute top-0 right-0 w-16 h-16 bg-[#fff8e1] rounded-bl-full flex items-start justify-end p-3 pointer-events-none"><svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg></div>}
      
      <div className="flex justify-between items-start gap-4 mb-4">
        <h3 className={`font-heading font-semibold text-lg md:text-xl pr-6 ${isPinned ? 'text-gray-900' : 'text-gray-900'}`}>
           {isPinned && <span className="text-[11px] font-bold bg-[#ffecb3] text-yellow-800 px-2.5 py-1 rounded-sm mr-3 leading-none uppercase inline-flex items-center relative -top-0.5 tracking-wider">Pinned</span>}
           {n.title}
        </h3>
      </div>
      
      <p className="font-body text-[15px] text-gray-600 mb-6 leading-[1.7] whitespace-pre-wrap">{n.body}</p>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-5 border-t border-gray-100/60">
        <div className="flex gap-2 flex-wrap items-center">
           {n.exams?.map(e => <ExamBadge key={e} exam={e} />)}
           <span className="text-[13px] text-gray-400 font-medium ml-2 flex items-center gap-1">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             {n.date?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
           </span>
        </div>
        {n.sourceUrl && (
          <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue text-[13px] font-semibold hover:underline inline-flex items-center gap-1 shrink-0">
            Official Source
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Latest Counselling News & Notices — Udaan Vidyapeeth</title>
        <meta name="description" content="Stay updated with the latest JEE, NEET, CUET, and state counselling news and important dates." />
      </Helmet>
      <Navbar />

      <div className="bg-brand-bg text-white py-14 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">Notice Board</h1>
          <p className="font-body text-gray-300 max-w-xl mx-auto text-lg leading-relaxed">Official updates, result dates, and counselling announcements directly from authorities.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-6 py-12 flex-1 relative">
        {loading ? (
             <div className="text-center py-20 text-gray-500 font-medium font-body flex gap-3 justify-center items-center">
                 <svg className="animate-spin h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Loading notices...
             </div>
        ) : (
          <>
            {pinnedNotice && renderNotice(pinnedNotice, true)}
            
            {pinnedNotice && otherNotices.length > 0 && <div className="my-10 flex items-center"><div className="flex-1 border-t border-gray-200"></div><span className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50">Latest Updates</span><div className="flex-1 border-t border-gray-200"></div></div>}

            <div className="flex flex-col gap-2">
              {otherNotices.map(n => renderNotice(n))}
              {notices.length === 0 && (
                <div className="text-center py-20 font-body bg-brand-light/10 rounded-2xl border border-brand-light/30 shadow-sm flex flex-col items-center justify-center gap-3">
                  <svg className="w-12 h-12 text-brand-muted opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" /></svg>
                  <p className="text-lg font-medium text-brand-dark">No notices available at the moment. Check back soon.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
      <LeadPopup />
      <StickyBar />
      <WhatsAppFAB />
    </div>
  );
}
