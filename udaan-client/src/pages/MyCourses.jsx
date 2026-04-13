import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { collectionGroup, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { COLLECTIONS } from '../config/collections';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';

import VantaBackground from '../components/VantaBackground';

export default function MyCourses() {
  const { currentUser } = useAuth();
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMyCourses() {
      if (!currentUser) return;
      try {
        setLoading(true);
        // 1. Fetch the user's purchased courses using collectionGroup matches
        const q = query(
          collectionGroup(db, 'students'), 
          where('studentId', '==', currentUser.uid)
        );
        const purchasesSnap = await getDocs(q);
        
        const courseIds = [];
        purchasesSnap.forEach(docSnap => {
          const courseId = docSnap.ref.parent.parent?.id;
          if (courseId) {
            courseIds.push(courseId);
          }
        });

        // If no purchases exist, stop early
        if (courseIds.length === 0) {
          setPurchasedCourses([]);
          setLoading(false);
          return;
        }

        // 2. Fetch the corresponding Course data
        // For simplicity and to avoid complex 'in' queries breaking if length > 10, 
        // we'll fetch them individually or assume we have a global course list strategy.
        // We will fetch them by ID directly.
        const loadedCourses = [];
        for (const cid of courseIds) {
          if (!cid) continue;
          const courseDocRef = doc(db, COLLECTIONS.COURSES, cid);
          const courseSnap = await getDoc(courseDocRef);
          if (courseSnap.exists()) {
            loadedCourses.push({ id: courseSnap.id, ...courseSnap.data() });
          }
        }
        
        setPurchasedCourses(loadedCourses);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
        setError("Could not load your courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyCourses();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>My Courses — Udaan Vidyapeeth</title>
      </Helmet>
      <Navbar />

      <VantaBackground className="bg-slate-900 py-12 px-6">
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-2">My Dashboard</h1>
          <p className="font-body text-slate-300 max-w-xl mx-auto text-lg">Continue where you left off.</p>
        </div>
      </VantaBackground>

      <div className="container mx-auto max-w-6xl px-6 py-12 flex-1">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium flex justify-center items-center gap-3">
             <svg className="animate-spin h-6 w-6 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             Loading your courses...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl max-w-2xl mx-auto border border-red-100">
             {error}
          </div>
        ) : purchasedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {purchasedCourses.map(course => <CourseCard key={course.id} course={course} isEnrolled={true} />)}
          </div>
        ) : (
          <div className="text-center py-20 font-body bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-4 max-w-3xl mx-auto">
            <div className="bg-blue-50 text-brand-blue p-4 rounded-full">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 className="text-xl font-heading font-bold text-gray-900">No courses yet</h3>
            <p className="text-gray-500 mb-2">You haven't purchased or enrolled in any courses.</p>
            <Link to="/courses" className="bg-brand-blue hover:bg-brand-dark text-white rounded-lg px-6 py-2.5 font-heading font-semibold transition shadow hover:shadow-md">
              Explore Courses
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
