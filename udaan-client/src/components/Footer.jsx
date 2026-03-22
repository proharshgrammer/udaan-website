import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-1 border-b border-gray-800 pb-8 md:border-0 md:pb-0">
            <img src="/logo-dark.png" alt="Udaan Vidyapeeth" className="h-10 mb-4" />
            <p className="text-gray-400 text-sm font-body leading-relaxed max-w-xs">
              Your rank. Your dream college. Let's figure it out together.
            </p>
          </div>

          <div className="col-span-1 border-b border-gray-800 pb-8 md:border-0 md:pb-0">
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-brand-blue transition">Home</Link></li>
              <li><Link to="/courses" className="hover:text-brand-blue transition">Courses</Link></li>
              <li><Link to="/about" className="hover:text-brand-blue transition">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-brand-blue transition">Blog & Resources</Link></li>
              <li><Link to="/news" className="hover:text-brand-blue transition">Notices & News</Link></li>
              <li><Link to="/contact" className="hover:text-brand-blue transition">Contact Support</Link></li>
            </ul>
          </div>

          <div className="col-span-1 border-b border-gray-800 pb-8 md:border-0 md:pb-0">
            <h4 className="font-heading font-semibold text-lg mb-4">Connect With Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href={import.meta.env.VITE_YOUTUBE_URL || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-red-500 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                  YouTube
                </a>
              </li>
              <li>
                <a href={import.meta.env.VITE_INSTAGRAM_URL || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-500 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-500 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-heading font-semibold text-lg mb-4">Download App</h4>
            <div className="flex flex-col gap-3">
              <a href={import.meta.env.VITE_PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 transition rounded-lg p-2.5 flex items-center justify-center border border-gray-700">
                <span className="text-white font-medium text-sm">Google Play</span>
              </a>
              <a href={import.meta.env.VITE_APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 transition rounded-lg p-2.5 flex items-center justify-center border border-gray-700">
                <span className="text-white font-medium text-sm">App Store</span>
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm font-body">
          &copy; {new Date().getFullYear()} Udaan Vidyapeeth. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
