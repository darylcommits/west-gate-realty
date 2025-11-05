import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="shadow-lg fixed w-full top-0 z-50" style={{ backgroundColor: '#c52528' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
                <img
                  src="/assets/images/logo.jpg"
                  alt="West Gate Realty Services"
                  className="h-13 w-12 rounded-full object-cover shadow-lg transition-transform hover:scale-110 border-2 border-primary-500"
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <div className="hidden">
                  <div className="text-xl font-bold text-primary-900">
                    <span className="text-primary-600">WEST</span> <span className="text-gold-500">GATE</span>
                    <div className="text-xs text-gray-600 -mt-1">REALTY SERVICES</div>
                  </div>
                </div>
              </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-white hover:text-gray-200 transition-all duration-300 hover:scale-105 relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('about')} className="text-white hover:text-gray-200 transition-all duration-300 hover:scale-105 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('properties')} className="text-white hover:text-gray-200 transition-all duration-300 hover:scale-105 relative group">
              Properties
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('listings')} className="text-white hover:text-gray-200 transition-all duration-300 hover:scale-105 relative group">
              Listings
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('services')} className="text-white hover:text-gray-200 transition-all duration-300 hover:scale-105 relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('certifications')} className="text-white hover:text-gray-200 transition-all duration-300 hover:scale-105 relative group">
              Certifications
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-white hover:text-gray-200 transition-all duration-300 hover:scale-105 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </button>

          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('home')} className="text-left text-white hover:text-gray-200 transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-left text-white hover:text-gray-200 transition-colors">About</button>
              <button onClick={() => scrollToSection('properties')} className="text-left text-white hover:text-gray-200 transition-colors">Properties</button>
              <button onClick={() => scrollToSection('listings')} className="text-left text-white hover:text-gray-200 transition-colors">Listings</button>
              <button onClick={() => scrollToSection('services')} className="text-left text-white hover:text-gray-200 transition-colors">Services</button>
              <button onClick={() => scrollToSection('certifications')} className="text-left text-white hover:text-gray-200 transition-colors">Certifications</button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-white hover:text-gray-200 transition-colors">Contact</button>

            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
