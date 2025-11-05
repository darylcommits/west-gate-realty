import React, { useState, useEffect } from 'react';
import AnimatedSection from './AnimatedSection';

const API_BASE_URL = 'http://localhost:5000/api';

interface FeaturedProject {
  title: string;
  description: string;
  image: string;
  bgGradient: string;
  bg_gradient: string;
  features: string[];
  stats: { [key: string]: string };
  type: string;
}

const PropertyShowcase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured projects from local API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/featured-projects`);
        const data = await response.json();

        // Transform data to match component's expected format
        const transformedProjects = data.map((proj: any) => ({
          ...proj,
          bgGradient: proj.bg_gradient,
          image: proj.image.startsWith('http')
            ? proj.image
            : `http://localhost:5000${proj.image}`
        }));

        setProperties(transformedProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
        // Fallback to empty array if fetch fails
        setProperties([]);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLearnMore = (propertyType: string) => {
    setIsLoading(true);

    // Simulate loading and then scroll to listings section
    setTimeout(() => {
      setIsLoading(false);
      const element = document.getElementById('listings');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      // In a real app, this would filter properties by type
      console.log(`Navigating to ${propertyType} properties`);
    }, 1000);
  };

  const handleScheduleViewing = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadBrochure = () => {
    // In a real app, this would trigger a download
    alert('Brochure download feature would be implemented here');
  };

  return (
    <AnimatedSection>
      <section id="properties" className="py-16 bg-gradient-to-br from-beige-100 to-beige-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary-200 to-green-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-gold-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6">
              Featured Properties & Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-gold-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exceptional real estate opportunities in Ilocos, from agricultural lands to cutting-edge solar developments
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#c52528' }}></div>
              <p className="mt-4" style={{ color: '#00284b' }}>Loading featured projects...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl" style={{ color: '#00284b' }}>No featured projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {properties.map((property, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Property Image Section */}
                <div className={`relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br ${property.bgGradient} overflow-hidden`}>
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to gradient background with icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback icon if image doesn't load */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center" style={{display: 'none'}}>
                    <div className="text-8xl text-gray-500 animate-float">
                      {property.title.includes('Agricultural') ? '🌾' : 
                       property.title.includes('Solar') ? '☀️' : '🏢'}
                    </div>
                  </div>
                  
                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(property.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="font-semibold text-gray-900 capitalize">{key}</p>
                          <p className="text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {property.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Key Features:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      {property.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs sm:text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => handleLearnMore(property.type)}
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r ${property.bgGradient} text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      'Learn More'
                    )}
                  </button>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent"></div>
              </div>
            ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Explore These Opportunities?</h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Contact our expert team to learn more about these exceptional properties and find the perfect investment for your needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={handleScheduleViewing}
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  Schedule a Viewing
                </button>
                <button 
                  onClick={handleDownloadBrochure}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
                >
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default PropertyShowcase;
