import React, { useState, useEffect } from 'react';

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  description: string;
  features: string[];
  images: PropertyImage[];
  virtualTour?: string;
  droneFootage?: string;
  floorPlan?: string;
}

interface PropertyImage {
  url: string;
  alt: string;
  type: 'main' | 'gallery' | 'drone' | 'floor_plan';
}

const PropertyShowcase360: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'gallery' | 'virtual' | 'drone' | 'floor'>('gallery');
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyId: ''
  });

  // Sample property data - in real implementation, this would come from your API/CRM
  const properties: Property[] = [
    {
      id: 'prop-001',
      title: 'Modern Luxury Villa',
      type: 'Residential',
      location: 'Vigan Heritage District',
      price: 'Contact for pricing',
      bedrooms: 5,
      bathrooms: 4,
      area: '350 sqm',
      description: 'Stunning modern villa combining contemporary design with traditional Filipino architecture. Features premium finishes, smart home technology, and panoramic city views.',
      features: [
        'Smart Home System',
        'Infinity Pool',
        'Roof Deck',
        'Wine Cellar',
        'Home Theater',
        'Solar Panels',
        'Security System',
        'Landscaped Garden'
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Modern luxury villa exterior', type: 'main' },
        { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80', alt: 'Spacious modern living room', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1631889993959-41b8bec24c09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Luxury master bedroom', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Modern kitchen with island', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80', alt: 'Infinity pool and outdoor area', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Aerial view of luxury villa', type: 'drone' },
        { url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Modern villa floor plan', type: 'floor_plan' }
      ],
      virtualTour: 'https://example.com/virtual-tour-001',
      droneFootage: 'https://example.com/drone-video-001',
      floorPlan: '/api/placeholder/800/600?text=Detailed+Floor+Plan'
    },
    {
      id: 'prop-002',
      title: 'Prime Agricultural Land',
      type: 'Agricultural',
      location: 'Bantay, Ilocos Sur',
      price: 'Contact for pricing',
      area: '5 hectares',
      description: 'Fertile agricultural land with established irrigation system, perfect for rice farming and crop cultivation. Includes farm equipment storage and processing facilities.',
      features: [
        'Irrigation System',
        'Storage Facilities',
        'Equipment Shed',
        'Access Road',
        'Water Rights',
        'Fertile Soil',
        'Flat Terrain',
        'Government Support'
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2059&q=80', alt: 'Lush rice fields in Ilocos', type: 'main' },
        { url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Agricultural irrigation system', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1582510003544-4ac00fbb413b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Farm equipment and storage', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Rural access road', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Aerial view of farmland', type: 'drone' }
      ],
      droneFootage: 'https://scontent.fmnl17-6.fna.fbcdn.net/v/t39.30808-6/489753241_122096762528840206_8257846173278025918_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGaRi2TnaYe2JU-ncYXpmIOGQUnzbIfWL4ZBSfNsh9YvrMFgTsq7d7gwT21TTPzb9RUvsvWkkUC3iu9ftCO-aWF&_nc_ohc=AzViIwtWjU8Q7kNvwGjLYmZ&_nc_oc=AdlzcByRsUQ0BA1cvQjddufSUmctjFuS5ni8zfs-FezE47qhEr3cIxZSf7vJUM3B52s&_nc_zt=23&_nc_ht=scontent.fmnl17-6.fna&_nc_gid=mBcuI-esurBcTcLzhq3tpQ&oh=00_AfZ_Scz5FYcuMGzaEh3voQ3fAr5Fql1U4TKM06YPsZyU8Q&oe=68CA1CDE'
    },
    {
      id: 'prop-003',
      title: 'Solar Farm Investment',
      type: 'Solar Project',
      location: 'Candon City, Ilocos Sur',
      price: 'Contact for pricing',
      area: '25 MW capacity',
      description: 'State-of-the-art solar farm with high-efficiency panels and grid connection. Fully operational with guaranteed power purchase agreement.',
      features: [
        '25 MW Capacity',
        'Grid Connected',
        'Power Purchase Agreement',
        'Monitoring System',
        'Maintenance Facility',
        'Security Fencing',
        'Access Roads',
        'Environmental Compliance'
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Solar panel arrays', type: 'main' },
        { url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Solar farm control room', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Grid connection facility', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Solar farm maintenance area', type: 'gallery' },
        { url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', alt: 'Aerial view of solar farm', type: 'drone' }
      ],
      droneFootage: 'https://example.com/drone-solar-001'
    }
  ];

  const nextImage = () => {
    if (selectedProperty) {
      const galleryImages = selectedProperty.images.filter(img => 
        viewMode === 'gallery' ? img.type === 'main' || img.type === 'gallery' :
        viewMode === 'drone' ? img.type === 'drone' :
        img.type === 'floor_plan'
      );
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      const galleryImages = selectedProperty.images.filter(img => 
        viewMode === 'gallery' ? img.type === 'main' || img.type === 'gallery' :
        viewMode === 'drone' ? img.type === 'drone' :
        img.type === 'floor_plan'
      );
      setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const openPropertyDetails = (property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setViewMode('gallery');
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setCurrentImageIndex(0);
    setShowContactForm(false);
  };

  const handleVirtualTour = (property: Property) => {
    setIsLoading(true);
    // Simulate loading for virtual tour
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would open the virtual tour
      window.open(property.virtualTour, '_blank');
    }, 1500);
  };

  const handleDroneFootage = (property: Property) => {
    setIsLoading(true);
    // Simulate loading for drone footage
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would open the drone footage
      window.open(property.droneFootage, '_blank');
    }, 1500);
  };

  const handleContactForm = (property: Property) => {
    setContactFormData({
      name: '',
      email: '',
      phone: '',
      message: `I'm interested in ${property.title} located in ${property.location}. Please provide more information.`,
      propertyId: property.id
    });
    setShowContactForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      alert('Thank you for your interest! We will contact you within 24 hours.');
      setShowContactForm(false);
      setContactFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        propertyId: ''
      });
    }, 2000);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentImages = () => {
    if (!selectedProperty) return [];
    return selectedProperty.images.filter(img => 
      viewMode === 'gallery' ? img.type === 'main' || img.type === 'gallery' :
      viewMode === 'drone' ? img.type === 'drone' :
      img.type === 'floor_plan'
    );
  };

  return (
    <div>
      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
            {/* Property Image */}
            <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
              <img
                src={property.images[0]?.url}
                alt={property.images[0]?.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f3f4f6"/><text x="400" y="300" text-anchor="middle" fill="%236b7280" font-size="24">${property.title}</text></svg>`;
                }}
              />
              
              {/* Property Type Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {property.type}
                </span>
              </div>

              {/* View Options */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                {property.virtualTour && (
                  <button 
                    onClick={() => handleVirtualTour(property)}
                    disabled={isLoading}
                    className="bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Virtual Tour"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
                {property.droneFootage && (
                  <button 
                    onClick={() => handleDroneFootage(property)}
                    disabled={isLoading}
                    className="bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Drone Footage"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 110 2h-1v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6H4a1 1 0 110-2h3z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                  <button
                    onClick={() => openPropertyDetails(property)}
                    className="w-full bg-white text-primary-900 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
                  >
                    View Details & Virtual Tour
                  </button>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-primary-900 mb-2">{property.title}</h3>
              <p className="text-gray-600 flex items-center mb-3 text-sm sm:text-base">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="truncate">{property.location}</span>
              </p>

              {/* Property Stats */}
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
                {property.bedrooms && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">{property.bedrooms}</span>
                    <span className="ml-1">BR</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">{property.bathrooms}</span>
                    <span className="ml-1">BA</span>
                  </div>
                )}
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">{property.area}</span>
                </div>
              </div>

              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                {property.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <span className="text-base sm:text-lg font-bold text-primary-900">
                  {property.price}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openPropertyDetails(property)}
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm sm:text-base"
                  >
                    Learn More →
                  </button>
                  <button
                    onClick={() => handleContactForm(property)}
                    className="bg-primary-600 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-primary-900 truncate">{selectedProperty.title}</h2>
                <p className="text-sm sm:text-base text-gray-600 truncate">{selectedProperty.location}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* View Mode Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => { setViewMode('gallery'); setCurrentImageIndex(0); }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'gallery' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📸 Photo Gallery
                </button>
                {selectedProperty.virtualTour && (
                  <button
                    onClick={() => setViewMode('virtual')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'virtual' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🥽 Virtual Tour
                  </button>
                )}
                {selectedProperty.droneFootage && (
                  <button
                    onClick={() => { setViewMode('drone'); setCurrentImageIndex(0); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'drone' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🚁 Drone View
                  </button>
                )}
                {selectedProperty.floorPlan && (
                  <button
                    onClick={() => { setViewMode('floor'); setCurrentImageIndex(0); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewMode === 'floor' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📐 Floor Plan
                  </button>
                )}
              </div>

              {/* Content Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Media Display */}
                <div>
                  {viewMode === 'virtual' && selectedProperty.virtualTour ? (
                    <div className="bg-gray-100 rounded-xl p-8 text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">360° Virtual Tour</h3>
                      <p className="text-gray-600 mb-4">Experience this property from every angle</p>
                      <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                        Launch Virtual Tour
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      {(() => {
                        const currentImages = getCurrentImages();
                        if (currentImages.length === 0) return null;
                        
                        return (
                          <>
                            <img
                              src={currentImages[currentImageIndex]?.url}
                              alt={currentImages[currentImageIndex]?.alt}
                              className="w-full h-96 object-cover rounded-xl"
                              onError={(e) => {
                                e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f3f4f6"/><text x="400" y="300" text-anchor="middle" fill="%236b7280" font-size="24">Image Not Available</text></svg>`;
                              }}
                            />
                            
                            {currentImages.length > 1 && (
                              <>
                                <button
                                  onClick={prevImage}
                                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={nextImage}
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                  {currentImages.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setCurrentImageIndex(index)}
                                      className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-primary-900 mb-3">Property Details</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedProperty.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-primary-900 mb-3">Features & Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProperty.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Stats */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="text-lg font-semibold text-primary-900 mb-3">Property Information</h4>
                    <div className="space-y-2">
                      {selectedProperty.bedrooms && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bedrooms:</span>
                          <span className="font-medium">{selectedProperty.bedrooms}</span>
                        </div>
                      )}
                      {selectedProperty.bathrooms && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bathrooms:</span>
                          <span className="font-medium">{selectedProperty.bathrooms}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-medium">{selectedProperty.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedProperty.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => handleContactForm(selectedProperty)}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Request More Information
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-primary-900">Contact Us</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 sm:p-2"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactFormData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactFormData.phone}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                    placeholder="+63 912 345 6789"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactFormData.message}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base resize-none"
                    placeholder="Tell us about your interest in this property..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 text-center">
            <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyShowcase360;
