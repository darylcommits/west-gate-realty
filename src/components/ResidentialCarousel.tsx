import React, { useState, useEffect } from 'react';
import { supabase, ResidentialProperty } from '../lib/supabase';

const ResidentialCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [properties, setProperties] = useState<ResidentialProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('residential_properties')
        .select('*')
        .eq('status', 'Available')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProperties(data);
      } else {
        // Fallback to mock data if no properties in database
        setProperties([
          {
            id: '1',
            title: "Modern Family Home",
            location: "Vigan City, Ilocos Sur",
            bedrooms: 4,
            bathrooms: 3,
            area: "250 sqm",
            type: "Single Family House",
            features: ["2-Car Garage", "Garden", "Modern Kitchen", "Balcony"],
            image: "/assets/images/modern-home.jpg",
            description: "Beautiful modern family home with contemporary design and premium finishes.",
            status: "Available",
            is_featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Fallback to mock data on error
      setProperties([
        {
          id: '1',
          title: "Modern Family Home",
          location: "Vigan City, Ilocos Sur",
          bedrooms: 4,
          bathrooms: 3,
          area: "250 sqm",
          type: "Single Family House",
          features: ["2-Car Garage", "Garden", "Modern Kitchen", "Balcony"],
          image: "/assets/images/modern-home.jpg",
          description: "Beautiful modern family home with contemporary design and premium finishes.",
          status: "Available",
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % properties.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, properties.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % properties.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + properties.length) % properties.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentProperty = properties[currentSlide];

  if (loading) {
    return (
      <div className="relative w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="relative w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="text-center p-8">
          <p className="text-gray-600">No properties available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl">
      {/* Main Image/Content Area */}
      <div className="relative h-64 overflow-hidden">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600">
          <img 
            src={currentProperty.image}
            alt={currentProperty.title}
            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-primary-900 px-3 py-1 rounded-full text-xs font-semibold">
            {currentProperty.type}
          </span>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Property Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
          <h3 className="text-lg font-bold mb-1">{currentProperty.title}</h3>
          <p className="text-sm text-gray-200 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {currentProperty.location}
          </p>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {currentProperty.description}
        </p>

        {/* Property Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-4 h-4 text-primary-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-xs text-gray-500">Bedrooms</span>
            </div>
            <span className="font-semibold text-primary-900">{currentProperty.bedrooms}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-4 h-4 text-blue-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 17H7v-7h2m6 7h-2v-7h2m4-5H6l6-6 6 6z"/>
              </svg>
              <span className="text-xs text-gray-500">Bathrooms</span>
            </div>
            <span className="font-semibold text-primary-900">{currentProperty.bathrooms}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5h14v14H5z"/>
              </svg>
              <span className="text-xs text-gray-500">Area</span>
            </div>
            <span className="font-semibold text-primary-900 text-xs">{currentProperty.area}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
          <div className="flex flex-wrap gap-1">
            {currentProperty.features.map((feature, index) => (
              <span key={index} className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => {
            const element = document.getElementById('contact');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Inquire About This Property
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {properties.map((_, index) => (
          <button
            key={index}
            onClick={() => { goToSlide(index); setIsAutoPlaying(false); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white shadow-lg scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-1 rounded-full transition-all duration-300"
          title={isAutoPlaying ? 'Pause slideshow' : 'Resume slideshow'}
        >
          {isAutoPlaying ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResidentialCarousel;
