import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 with Emoji */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-8xl font-bold text-white">4</span>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center relative">
              {/* Eyes */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-black rounded-full"></div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-black rounded-full"></div>
              {/* Mouth */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-black rounded-full"></div>
            </div>
            <span className="text-8xl font-bold text-white">4</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white mb-4">Oops!</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Well, this is awkward, the page you were trying to view does not exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
          >
            Go to Home
          </Link>
          
          <Link
            to="/pastes"
            className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-all duration-200"
          >
            Browse Pastes
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            Go Back
          </button>
        </div>

        {/* Decorative Number */}
        <div className="absolute bottom-4 right-4 text-white text-sm opacity-50">
          3,442
        </div>
      </div>
    </div>
  );
};

export default NotFound;
