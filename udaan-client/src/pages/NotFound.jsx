import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
      <Helmet>
        <title>Page Not Found | Udaan Vidyapeeth</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="mb-8 relative">
        <h1 className="text-8xl md:text-9xl font-extrabold text-gray-200 tracking-widest">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-brand-blue text-white px-2 text-sm rounded shadow">
            Page Not Found
          </span>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Oops! Looks like you're lost.
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track!
      </p>
      
      <Link 
        to="/"
        className="px-8 py-3 bg-brand-blue text-white rounded-full font-semibold shadow-lg hover:bg-blue-600 transition-all hover:-translate-y-1"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
