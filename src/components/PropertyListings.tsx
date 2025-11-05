import React, { useState, useEffect } from 'react';
import PropertySearch from './PropertySearch';
import LeadCapture from './LeadCapture';
import MortgageCalculator from './MortgageCalculator';
import AnimatedSection from './AnimatedSection';

const API_BASE_URL = 'http://localhost:5000/api';

interface Neighborhood {
  name: string;
  description: string;
  highlights: string[];
  image: string;
  location: string;
}

const PropertyListings: React.FC = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch neighborhoods from local API
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/neighborhoods`);
        const data = await response.json();

        // Transform data to match component's expected format
        const transformedNeighborhoods = data.map((hood: any) => ({
          name: hood.name,
          description: hood.description,
          highlights: hood.highlights,
          image: hood.image.startsWith('http')
            ? hood.image
            : `http://localhost:5000${hood.image}`,
          location: hood.location
        }));

        setNeighborhoods(transformedNeighborhoods);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
        // Fallback to empty array if fetch fails
        setNeighborhoods([]);
        setLoading(false);
      }
    };

    fetchNeighborhoods();
  }, []);

  const handlePropertyTypeClick = (type: string) => {
    setSelectedPropertyType(type);
    // Scroll to properties section
    const element = document.getElementById('properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // In a real app, this would filter the properties by type
    console.log(`Filtering properties by type: ${type}`);
  };

  return (
    <AnimatedSection>
      <section id="listings" className="py-16 bg-gradient-to-br from-beige-100 to-beige-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         


          {/* Neighborhood Highlights */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-primary-900 mb-8 text-center">Popular Neighborhoods</h3>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#c52528' }}></div>
                <p className="mt-4" style={{ color: '#00284b' }}>Loading neighborhoods...</p>
              </div>
            ) : neighborhoods.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl" style={{ color: '#00284b' }}>No neighborhoods available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {neighborhoods.map((neighborhood, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src={neighborhood.image} 
                      alt={neighborhood.name}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-size="16">${neighborhood.name}</text></svg>`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                        <button 
                          onClick={() => {
                            // Scroll to properties section and filter by location
                            const element = document.getElementById('properties');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="w-full bg-white text-primary-900 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
                        >
                          Explore Properties
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                      <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {neighborhood.location}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-primary-900 mb-2">{neighborhood.name}</h4>
                  <p className="text-gray-600 mb-3 text-sm sm:text-base">{neighborhood.description}</p>
                  <div className="space-y-1">
                    {neighborhood.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-xs sm:text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>

          {/* Mortgage Calculator */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Calculate Your Investment</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Use our mortgage calculator to plan your property purchase and understand your financing options.
              </p>
            </div>
            <MortgageCalculator />
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Property?</h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Our property experts are here to help you navigate the Ilocos real estate market and find the perfect investment or home.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setShowLeadForm(true)}
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
                >
                  Schedule Consultation
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all transform hover:scale-105">
                  Browse All Listings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Capture Modal */}
        {showLeadForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
              <LeadCapture
                variant="modal"
                title="Get Personalized Property Recommendations"
                subtitle="Tell us about your preferences and we'll send you matching properties"
                onClose={() => setShowLeadForm(false)}
              />
            </div>
          </div>
        )}
      </section>
    </AnimatedSection>
  );
};

export default PropertyListings;
