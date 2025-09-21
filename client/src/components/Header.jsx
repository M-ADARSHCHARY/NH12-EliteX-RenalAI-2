import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <svg className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">RenalAI</h1>
              <p className="text-blue-200 text-xs sm:text-sm">Medical Image Analysis</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition duration-200 ${location.pathname === '/' ? 'text-white' : 'text-blue-200 hover:text-white'}`}
            >
              Home
            </Link>
            <a href="#" className="text-blue-200 hover:text-white transition duration-200">About</a>
            <a href="#" className="text-blue-200 hover:text-white transition duration-200">Contact</a>
            <Link 
              to="/get-started" 
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                location.pathname === '/get-started' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-200 hover:text-white p-2 rounded-md transition duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-700 py-4 space-y-3">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block transition duration-200 py-2 ${
                location.pathname === '/' ? 'text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              Home
            </Link>
            <a href="#" className="block text-blue-200 hover:text-white transition duration-200 py-2">About</a>
            <a href="#" className="block text-blue-200 hover:text-white transition duration-200 py-2">Contact</a>
            <Link 
              to="/get-started" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition duration-200 text-center ${
                location.pathname === '/get-started' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;