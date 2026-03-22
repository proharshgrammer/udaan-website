import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img src="/logo-light.png" alt="Udaan Vidyapeeth" className="h-10 object-contain" />
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-brand-blue font-body text-sm font-medium transition tracking-wide">Home</Link>
            <Link to="/courses" className="text-gray-700 hover:text-brand-blue font-body text-sm font-medium transition tracking-wide">Counselling</Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-blue font-body text-sm font-medium transition tracking-wide">About</Link>
            <Link to="/blog" className="text-gray-700 hover:text-brand-blue font-body text-sm font-medium transition tracking-wide">Blog</Link>
            <Link to="/news" className="text-gray-700 hover:text-brand-blue font-body text-sm font-medium transition tracking-wide">News</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/contact" className="text-gray-700 hover:text-brand-blue font-body text-sm font-medium transition tracking-wide">Contact</Link>
            <Link to="/contact" className="bg-brand-blue hover:bg-brand-dark text-white rounded-full px-7 py-2.5 font-heading font-semibold transition tracking-wide text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
              Book Free Call
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-brand-blue focus:outline-none p-2 transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 {isOpen ? (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                 ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                 )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="px-5 pt-3 pb-8 space-y-2 flex flex-col">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-lg font-medium block px-4 py-3 transition">Home</Link>
          <Link to="/courses" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-lg font-medium block px-4 py-3 transition">Courses</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-lg font-medium block px-4 py-3 transition">About</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-lg font-medium block px-4 py-3 transition">Blog</Link>
          <Link to="/news" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-lg font-medium block px-4 py-3 transition">News</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-lg font-medium block px-4 py-3 transition">Contact</Link>
          <div className="pt-4 px-2 mt-2 border-t border-gray-100">
             <Link to="/contact" onClick={() => setIsOpen(false)} className="bg-brand-blue text-center block w-full hover:bg-brand-dark text-white rounded-full px-6 py-3.5 font-heading font-semibold transition shadow-md">
               Book Free Call
             </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
