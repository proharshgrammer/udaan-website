import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import StickyBar from '../components/StickyBar';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white flex flex-col pt-16 md:pt-20">
      <Helmet>
        <title>Contact Us — Udaan Vidyapeeth</title>
        <meta name="description" content="Get in touch with Udaan Vidyapeeth. Book a counselling session or ask a question on WhatsApp." />
      </Helmet>
      <div className="absolute top-0 w-full z-50"><Navbar /></div>

      <div className="flex-1 container mx-auto max-w-6xl px-6 py-12 md:py-16 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left info side */}
          <div className="lg:col-span-5 relative z-10">
            <h1 className="font-heading font-extrabold text-5xl md:text-6xl text-gray-900 mb-6 leading-tight">Let's connect.</h1>
            <p className="font-body text-gray-600 text-[17px] mb-12 leading-relaxed max-w-md">
              Whether you need to book a counselling session, or just have a quick question about your entrance results, we are here to clear your doubts.
            </p>
            
            <div className="bg-[#25D366]/5 rounded-3xl p-8 border border-[#25D366]/20 mb-10 hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <h3 className="font-heading font-semibold text-gray-900 text-xl mb-3 flex items-center gap-3">
                <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Fastest way to reach us
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">Drop us a message on WhatsApp. Our team usually replies within a few hours.</p>
              <a 
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=Hi! I have a query regarding counselling.`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white rounded-2xl px-6 py-4 font-heading font-semibold transition"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="flex gap-4">
               <a href={import.meta.env.VITE_PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="bg-gray-50 hover:bg-gray-100 transition rounded-2xl p-4 flex-1 flex flex-col items-center justify-center gap-2 border border-gray-100 shadow-sm">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Play Store" className="w-8 h-8 grayscale opacity-70" />
                 <span className="text-gray-600 font-medium text-xs uppercase tracking-wider">Play Store</span>
               </a>
               <a href={import.meta.env.VITE_APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="bg-gray-50 hover:bg-gray-100 transition rounded-2xl p-4 flex-1 flex flex-col items-center justify-center gap-2 border border-gray-100 shadow-sm">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" alt="App Store" className="w-8 h-8 invert opacity-40" />
                 <span className="text-gray-600 font-medium text-xs uppercase tracking-wider">App Store</span>
               </a>
            </div>
            
          </div>

          {/* Right form side */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-[0_20px_50px_rgb(0,0,0,0.06)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light rounded-bl-full pointer-events-none opacity-50 -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <h3 className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900 mb-3 tracking-tight">Book a Free Call</h3>
              <p className="text-gray-500 text-[15px] mb-10 font-body max-w-md leading-relaxed">Fill out this quick form and our counsellors will get back to you to schedule your session.</p>
              <LeadForm isLight={true} onSuccess={() => alert('Thanks! We will contact you soon on WhatsApp.')} />
            </div>
          </div>
          
        </div>
      </div>

      <Footer />
      <StickyBar />
    </div>
  );
}
