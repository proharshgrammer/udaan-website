import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCollection } from '../hooks/useFirestore';
import MentorCard from '../components/MentorCard';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: mentors } = useCollection('team');

  useEffect(() => {
    async function fetchCourse() {
      try {
        const docRef = doc(db, 'courses', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourse({ id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Failed to fetch course", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 rounded-full border-4 border-brand-blue border-t-transparent animate-spin"></div></div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found.</div>;

  const discount = (course.originalPrice && course.price && course.originalPrice > course.price) 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen font-body flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 lg:py-12 mt-20">
         {/* Course Header Sheet */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 flex flex-col md:flex-row items-stretch">
            {/* Left Content */}
            <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center relative">
               <div className="absolute top-6 right-6 lg:top-8 lg:right-10 flex gap-3 text-gray-400">
                 <button className="hover:text-brand-blue transition"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
               </div>

               <div className="flex items-center gap-3 mb-4 mt-2">
                  <span className={`text-[11px] font-bold px-3 py-1.5 rounded-sm text-white uppercase tracking-wider ${course.courseType === 'Offline' ? 'bg-red-500' : 'bg-brand-blue'}`}>{course.courseType || 'ONLINE'}</span>
                  {course.language && <span className="text-[11px] font-bold px-3 py-1.5 rounded-sm border border-gray-200 text-gray-600 uppercase tracking-wider">{course.language}</span>}
               </div>
               
               <h1 className="font-heading font-bold text-3xl md:text-5xl text-gray-900 leading-tight mb-4 pr-8">{course.name}</h1>
               
               <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-600 mb-8 font-medium">
                  {course.targetAudience && <div className="flex items-center gap-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>{course.targetAudience}</div>}
                  {course.startDate && <div className="flex items-center gap-2"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Starts {course.startDate}</div>}
               </div>
               
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-col">
                     {course.originalPrice && <div className="flex items-center gap-2 text-gray-400 line-through font-medium text-lg"><span>₹{course.originalPrice.toLocaleString('en-IN')}</span><span className="text-xs font-bold tracking-wide">(FULL BATCH)</span></div>}
                     <div className="flex items-center gap-4 mt-0.5">
                        <span className="font-heading font-bold text-4xl text-brand-dark">₹{course.price ? course.price.toLocaleString('en-IN') : 'Free'}</span>
                        {discount > 0 && <span className="bg-green-50 text-green-700 text-sm font-bold px-2.5 py-1.5 rounded border border-green-200">{discount}% OFF</span>}
                     </div>
                  </div>
                  <button className="bg-brand-blue hover:bg-brand-dark text-white font-heading font-bold text-xl px-10 py-4 rounded-xl shadow-lg shadow-brand-blue/30 transition-all transform hover:scale-105 w-full sm:w-auto mt-2 sm:mt-0 tracking-wide">
                     BUY NOW
                  </button>
               </div>
            </div>
            {/* Right Banner Image */}
            <div className="w-full md:w-[45%] shrink-0 bg-gray-100 relative min-h-[250px] md:min-h-full">
               {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.name} className="absolute inset-0 w-full h-full object-cover" />
               ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-light to-brand-blue flex items-center justify-center p-8 text-center text-white font-heading font-bold text-3xl">
                     {course.name}
                  </div>
               )}
            </div>
         </div>

         {/* Grid Layout for Body */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
               
               {/* About the Batch */}
               {course.aboutBatch && (
                  <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10">
                     <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-[#E5C77A] rounded-full block"></span>
                        About the Batch
                     </h2>
                     <ul className="space-y-4">
                        {course.aboutBatch.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                           <li key={idx} className="flex items-start gap-4 text-gray-700 leading-relaxed font-medium">
                              <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-brand-blue opacity-80 shadow-sm"></span>
                              <span>{line}</span>
                           </li>
                        ))}
                     </ul>
                  </section>
               )}

               {/* Teachers */}
               {mentors && mentors.length > 0 && (
                  <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10 overflow-hidden">
                     <h2 className="font-heading font-bold text-2xl text-gray-900 mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-[#E5C77A] rounded-full block"></span>
                        Know your Teachers
                     </h2>
                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                        {mentors.map(mentor => (
                           <MentorCard key={mentor.id} mentor={mentor} />
                        ))}
                     </div>
                  </section>
               )}

               {/* More Details (Wordpad Content) */}
               {course.moreDetails && course.moreDetails !== '<p><br></p>' && (
                  <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10">
                     <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                        <span className="w-1.5 h-6 bg-[#E5C77A] rounded-full block"></span>
                        More Details
                     </h2>
                     <div className="prose prose-blue max-w-none text-gray-700 prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-li:marker:text-brand-blue font-medium" dangerouslySetInnerHTML={{ __html: course.moreDetails }} />
                  </section>
               )}

            </div>

            {/* Sticky Sidebar */}
            <div className="space-y-6">
               <div className="sticky top-28 pt-1">
                  
                  {/* Features Widget */}
                  {course.features && course.features.length > 0 && (
                     <div className="bg-brand-dark rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
                        <h3 className="font-heading font-bold text-xl mb-6 relative z-10 flex items-center gap-2">
                           <svg className="w-5 h-5 text-[#E5C77A]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                           Course Highlights
                        </h3>
                        <ul className="space-y-4 relative z-10">
                           {course.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-300 font-medium text-[15px] leading-snug">
                                 <svg className="w-5 h-5 shrink-0 text-[#E5C77A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                 {f}
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}

                  {/* App Promo */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                     <div className="w-20 h-20 bg-gray-50 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-gray-200 shadow-inner">
                        <svg className="w-10 h-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                     </div>
                     <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Learn On The Go!</h3>
                     <p className="text-gray-500 text-[15px] font-medium mb-6">Download the Udaan Vidyapeeth app for live classes and doubt solving.</p>
                     <div className="flex flex-col gap-3">
                        <a href={course.playStoreUrl || '#'} className="bg-gray-900 hover:bg-black text-white px-4 py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow hover:shadow-lg">
                           Get it on Google Play
                        </a>
                        <a href={course.appStoreUrl || '#'} className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-3.5 rounded-xl text-sm font-bold transition border border-gray-200 shadow flex items-center justify-center gap-2 hover:shadow-lg">
                           Download on App Store
                        </a>
                     </div>
                  </div>

               </div>
            </div>
         </div>
         
         {/* FAQs */}
         <section className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-8 mb-16 overflow-hidden">
            <h2 className="font-heading font-bold text-2xl text-gray-900 px-8 py-6 sm:p-10 border-b border-gray-100 mb-0 flex items-center gap-3">
               <span className="w-1.5 h-6 bg-[#E5C77A] rounded-full block"></span>
               Frequently Asked Questions
            </h2>
            <div className="divide-y divide-gray-100">
               {[
                  { q: "When are the classes held?", a: "Classes are held daily as per the schedule provided post enrollment in the batch." },
                  { q: "Will I get recordings of the live classes?", a: "Yes, all live classes are recorded and made available in the app within 24 hours of completion." },
                  { q: "Is there any refund policy?", a: "No, purchases are final unless specified in our terms of service." }
               ].map((faq, i) => (
                  <details key={i} className="group p-6 sm:px-10 hover:bg-gray-50 transition cursor-pointer text-gray-900">
                     <summary className="font-bold text-[17px] list-none flex justify-between items-center outline-none select-none">
                        {faq.q}
                        <span className="transition duration-300 group-open:rotate-180 text-brand-blue opacity-70 group-hover:opacity-100">
                           <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9" /></svg>
                        </span>
                     </summary>
                     <div className="text-gray-600 mt-4 font-medium leading-relaxed leading-7 animate-fade-in text-[16px] max-w-4xl cursor-text">
                        {faq.a}
                     </div>
                  </details>
               ))}
            </div>
         </section>
      </main>

      <Footer />
    </div>
  );
}
