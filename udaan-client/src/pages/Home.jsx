import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MentorTeaser from '../components/MentorTeaser';
import CourseCard from '../components/CourseCard';
import HomeNewsCarousel from '../components/HomeNewsCarousel';
import LeadForm from '../components/LeadForm';
import LeadPopup from '../components/LeadPopup';
import StickyBar from '../components/StickyBar';
import WhatsAppFAB from '../components/WhatsAppFAB';
import { useCollection } from '../hooks/useFirestore';
import { orderBy, limit } from 'firebase/firestore';
import { COLLECTIONS } from '../config/collections';

const testimonials = [
  { name: "Arnav Deshmukh", exam: "JEE Main", rank: "AIR 1,385", college: "NIT Trichy — Computer Science & Engineering", quote: "I was confused between NIT Trichy and IIIT Hyderabad. Ritik sir's deep dive into the placement data and the 'Home State' advantage analysis made the choice clear. Securely locked my seat in Round 1!", avatar: "AD" },
  { name: "Priyanshu Gupta", exam: "JEE Main", rank: "AIR 18,420", college: "IET Lucknow — CSE (AI & ML)", quote: "With my rank, I was almost sure I'd have to go to a private college. Abhishek sir's AKTU choice-filling strategy was a game-changer. Getting into the top government college of UP is a dream come true.", avatar: "PG" },
  { name: "Sameer Khan", exam: "JEE Main", rank: "AIR 1,12,400", college: "NIT Mizoram — Civil Engineering", quote: "I had lost all hope of becoming an NITian after JoSAA Round 6. Udaan Vidyapeeth's CSAB Special Round strategy helped me grab a vacant seat in the final round. Don't give up until the end!", avatar: "SK" },
  { name: "Neha Kulkarni", exam: "MHT-CET", rank: "98.6 %ile", college: "VJTI Mumbai — Electrical Engineering", quote: "VJTI has a very tricky seat matrix. The breakdown provided by the Udaan team helped me navigate the CAP rounds perfectly. Their preference list got me my first choice in Round 2.", avatar: "NK" }
];

import BannerCarousel from '../components/BannerCarousel';

export default function Home() {
  const { data: mentors } = useCollection(COLLECTIONS.MENTORS);
  const { data: courses } = useCollection(COLLECTIONS.COURSES, [orderBy('createdDate', 'desc')]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Udaan Vidyapeeth — College Counselling for JEE, NEET, CUET & More</title>
        <meta name="description" content="Expert college counselling for JEE, NEET, CUET, AKTU, MHT-CET, IPU. 6000+ students guided. Book a free call today." />
      </Helmet>
      
      <Navbar />
      
      <BannerCarousel />

      {/* Hero Section */}
      <section className="relative bg-brand-bg text-white pt-20 pb-28 px-6 overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.png')" }}></div>
        {/* Dark Overlay for better contrast (adjusted for higher image visibility) */}
        <div className="absolute inset-0 bg-brand-bg/45 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['JEE', 'NEET', 'CUET', 'AKTU', 'MHT-CET', 'IPU'].map(e => (
               <span key={e} className="bg-brand-muted/20 border border-brand-muted/50 text-brand-accent text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">{e}</span>
            ))}
          </div>
          <h1 className="font-heading font-extrabold text-5xl md:text-7xl leading-tight mb-6">
            Your rank. <br/><span className="text-brand-accent drop-shadow-md">Your dream college.</span><br/>Let's figure it out together.
          </h1>
          <p className="font-body text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Expert counselling for JEE, NEET, CUET, AKTU, MHT-CET, IPU and every major state counselling across India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="w-full sm:w-auto bg-brand-blue hover:bg-brand-dark text-white rounded-full px-8 py-4 font-heading font-semibold transition text-lg shadow-lg shadow-brand-blue/30">
              Book your free call
            </Link>
            <Link to="/courses" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full px-8 py-4 font-heading font-semibold transition text-lg backdrop-blur-sm">
              Explore courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-brand-blue py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="border-r border-white/20 md:border-r"><div className="font-heading font-bold text-3xl md:text-4xl text-white mb-1">6000+</div><div className="text-brand-light/90 font-medium text-sm">Students guided</div></div>
            <div className="md:border-r md:border-white/20"><div className="font-heading font-bold text-3xl md:text-4xl text-white mb-1">50+</div><div className="text-brand-light/90 font-medium text-sm">Colleges covered</div></div>
            <div className="border-r border-white/20 md:border-r"><div className="font-heading font-bold text-3xl md:text-4xl text-white mb-1">10+</div><div className="text-brand-light/90 font-medium text-sm">Exams we handle</div></div>
            <div><div className="font-heading font-bold text-3xl md:text-4xl text-white mb-1">3</div><div className="text-brand-light/90 font-medium text-sm">Years of expertise</div></div>
          </div>
        </div>
      </section>

      {/* Mentor Teaser */}
      <section className="bg-gray-50 pt-16 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl">Guided by experts who care.</h2>
            <p className="font-body text-gray-600 mt-4 max-w-2xl mx-auto">Meet the counsellors behind 6000+ successful college admissions.</p>
          </div>
          <MentorTeaser mentors={mentors} />
          <HomeNewsCarousel />
        </div>
      </section>

      {/* Course Preview */}
      <section className="bg-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-3">Find your perfect plan.</h2>
              <p className="font-body text-gray-600">Tailored counselling for your specific exam.</p>
            </div>
            <Link to="/courses" className="hidden md:inline-flex text-brand-blue font-medium hover:underline">View all courses &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.slice(0, 3).map(c => <CourseCard key={c.id} course={c} />)}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/courses" className="text-brand-blue font-medium hover:underline">View all courses &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="bg-brand-blue py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-brand-dark/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">Got your rank?</h2>
              <p className="font-body text-lg text-white/90 mb-8 leading-relaxed">
                Let's find your college. Book a free 20-minute call with our counselling experts — no cost, no strings attached. 
              </p>
              <div className="flex items-center gap-4 text-white/90 font-medium">
                <div className="bg-white/10 rounded-full p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                100% Free Consultation
              </div>
            </div>
            <div className="bg-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
              <h3 className="font-heading font-semibold text-2xl text-white mb-6">Book Your Free Call</h3>
              <LeadForm isLight={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-16">Stories from our students.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-light/30 text-brand-dark flex items-center justify-center font-heading font-bold text-lg">{t.avatar}</div>
                  <div>
                    <h4 className="font-heading font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-brand-blue font-medium">{t.exam} · {t.rank}</p>
                  </div>
                </div>
                <p className="font-body text-sm text-gray-600 italic mb-4 flex-grow">"{t.quote}"</p>
                <div className="pt-4 border-t border-gray-100 font-medium text-xs text-gray-800">
                  Secured: {t.college}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Strip */}
      <section className="bg-brand-bg text-white py-20 px-6 border-b border-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Take Udaan with you.</h2>
          <p className="font-body text-gray-300 mb-10 max-w-xl mx-auto">
            Download the app for full course access, recorded masterclasses, and advanced choice filling tools to track your college preferences.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={import.meta.env.VITE_PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-100 text-brand-bg rounded-lg px-6 py-3 font-heading font-semibold transition flex items-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19.7 10.9L4.8 1.9C3.6 1.2 2 2.1 2 3.5v17.1c0 1.4 1.6 2.3 2.8 1.6l14.9-9c1.1-.7 1.1-2.4 0-3.3z"/></svg>
              Google Play
            </a>
            <a href={import.meta.env.VITE_APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-gray-100 text-brand-bg rounded-lg px-6 py-3 font-heading font-semibold transition flex items-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 14.1c-.1-3.2 2.6-4.8 2.7-4.8-1.5-2.2-3.8-2.5-4.6-2.5-2-.2-3.8 1.1-4.8 1.1-1 0-2.6-1.1-4.2-1.1-1.9 0-3.6 1.1-4.6 2.8-2 3.4-.5 8.4 1.4 11.2 1 1.4 2.1 3 3.6 2.9 1.5-.1 2.1-1 3.9-1 1.8 0 2.3 1 3.9.9 1.6-.1 2.5-1.5 3.5-2.9 1.1-1.6 1.6-3.2 1.6-3.3 0-.1-3.1-1.2-3.1-4.3zm-3.2-9.4c.8-1 1.4-2.4 1.2-3.7-1.1.1-2.6.7-3.4 1.7-.7.8-1.4 2.1-1.2 3.5 1.3.1 2.6-.5 3.4-1.5z"/></svg>
              App Store
            </a>
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
