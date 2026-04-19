import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../config/collections';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function EnrolledCourseView({ course, enrollmentDetails }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen font-body flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 lg:py-12 mt-20">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button 
             onClick={() => setActiveTab('Overview')}
             className={`pb-4 px-4 font-heading font-bold text-[15px] transition-colors ${activeTab === 'Overview' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Overview
          </button>
          <button 
             onClick={() => setActiveTab('Announcements')}
             className={`pb-4 px-4 font-heading font-bold text-[15px] transition-colors ${activeTab === 'Announcements' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Announcements
          </button>
        </div>

        {activeTab === 'Overview' ? (
          <OverviewTab course={course} enrollmentDetails={enrollmentDetails} navigate={navigate} />
        ) : (
          <AnnouncementsTab courseId={course.id} />
        )}

      </main>
      <Footer />
    </div>
  );
}

function OverviewTab({ course, enrollmentDetails, navigate }) {
  const purchasePrice = course.price;
  const enrolledAt = enrollmentDetails?.enrolledAt?.toDate?.() || new Date();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Banner Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
           {(course.thumbnail || course.thumbnailUrl) ? (
             <div className="w-full h-48 md:h-64 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100/60">
               <img src={course.thumbnail || course.thumbnailUrl} alt={course.name} className="max-w-full max-h-full object-contain mix-blend-multiply rounded-lg" />
             </div>
           ) : (
             <div className="w-full h-48 md:h-64 bg-gradient-to-br from-brand-light to-brand-blue flex items-center justify-center p-8 text-center text-white font-heading font-bold text-2xl">
                {course.name}
             </div>
           )}
           <div className="p-6">
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mb-2">{course.name}</h1>
              <p className="text-gray-500 text-sm font-medium">
                 Purchased at: <span className="text-green-600 font-bold">₹{purchasePrice || '0.0'}</span>
              </p>
           </div>
        </div>

        {/* Stats Row */}
        {course.successPercentage && (
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center gap-3">
              <div className="bg-green-50 p-3 rounded-full text-green-600">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div>
                 <p className="text-xl font-bold text-green-600">{course.successPercentage}%</p>
                 <p className="text-sm font-medium text-gray-500">Success Rate</p>
              </div>
           </div>
        )}

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
           <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">About This Course</h2>
           <div className="prose prose-blue max-w-none text-gray-700 font-medium">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                 {course.about}
              </ReactMarkdown>
           </div>
           {course.moreDetails && course.moreDetails !== '<p><br></p>' && (
             <div className="prose prose-blue max-w-none text-gray-700 font-medium mt-4 pt-4 border-t border-gray-100" dangerouslySetInnerHTML={{ __html: course.moreDetails }} />
           )}
        </div>

      </div>

      {/* Sidebar Content */}
      <div className="space-y-6">
         {/* Mentor Assignment */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-3">Your Mentor</h3>
            <p className="text-gray-500 font-medium mb-1">
               {course.mentorName ? (
                 <span className="text-gray-800 font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {course.mentorName}
                 </span>
               ) : (
                 "No mentor assigned yet."
               )}
            </p>
         </div>

         {/* Course Support Action */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Course Support</h3>
            <button 
               onClick={() => navigate(`/chat/${course.id}`)}
               className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-brand-blue font-bold px-4 py-3 rounded-xl hover:bg-gray-50 transition shadow-sm hover:shadow"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
               Chat with Mentor
            </button>
         </div>
      </div>
    </div>
  );
}

function AnnouncementsTab({ courseId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const q = query(
           collection(db, COLLECTIONS.ANNOUNCEMENTS),
           where('sentTo', '==', 'course'),
           where('courseId', '==', courseId)
           // Firestore requires index if we use orderBy alongside equality where. Let's do it client-side.
        );
        const snap = await getDocs(q);
        const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        results.sort((a, b) => {
           const timeA = a.timestamp?.toMillis() || 0;
           const timeB = b.timestamp?.toMillis() || 0;
           return timeB - timeA;
        });

        setAnnouncements(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, [courseId]);

  if (loading) return <div className="py-12 text-center text-gray-500">Loading announcements...</div>;
  if (announcements.length === 0) return <div className="py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">No announcements for this course yet.</div>;

  return (
    <div className="space-y-4">
      {announcements.map(ann => (
        <div key={ann.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-start gap-4">
            <div className="bg-orange-50 text-orange-500 p-3 rounded-xl shrink-0">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase tracking-wider">
                   {ann.type === 'IMAGE' ? 'Media' : 'Alert'}
                 </span>
                 <span className="text-gray-400 text-xs font-medium">
                   {ann.timestamp?.toDate().toLocaleDateString(undefined, { dateStyle: 'medium' })}
                 </span>
               </div>
               <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">{ann.title}</h3>
               <p className="text-gray-600 font-medium leading-relaxed">{ann.message}</p>
               
               {ann.imageUrl && (
                 <img src={ann.imageUrl} alt="Announcement attached" className="mt-4 rounded-xl border border-gray-100 max-h-60 object-contain bg-gray-50" />
               )}
               {ann.link && (
                 <a href={ann.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-4 text-brand-blue font-bold hover:underline">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                   Action Link
                 </a>
               )}
            </div>
        </div>
      ))}
    </div>
  );
}
