import React, { useState } from 'react';

interface SearchFilters {
  propertyType: string;
  priceRange: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
}

const PropertySearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: '',
    priceRange: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    amenities: []
  });
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const propertyTypes = [
    'All Types', 'Residential', 'Agricultural', 'Commercial', 'Solar Projects'
  ];

  const priceRanges = [
    'Any Price', 'Under ₱5M', '₱5M - ₱10M', '₱10M - ₱20M', '₱20M+'
  ];

  const locations = [
    'All Locations', 'Vigan City', 'Laoag City', 'Candon City', 'Bantay', 'Sto. Domingo'
  ];

  const availableAmenities = [
    'Swimming Pool', 'Garden', 'Garage', 'Modern Kitchen', 'Balcony', 
    'Security', 'Clubhouse', 'Beach Access', 'Irrigation', 'Solar Ready'
  ];

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSearch = () => {
    // Integrate with property listing or trigger search results
    console.log('Search initiated with filters:', filters, 'Query:', searchQuery);
    // Here you would typically call an API or filter your property listings
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      priceRange: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      amenities: []
    });
    setSearchQuery('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-primary-900 flex items-center">
          <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Find Your Perfect Property
        </h3>
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          {isAdvancedOpen ? 'Simple Search' : 'Advanced Filters'}
        </button>
      </div>

      {/* Main Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by property name, location, or features..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={filters.propertyType}
          onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {propertyTypes.map(type => (
            <option key={type} value={type === 'All Types' ? '' : type}>{type}</option>
          ))}
        </select>

        <select
          value={filters.location}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {locations.map(location => (
            <option key={location} value={location === 'All Locations' ? '' : location}>{location}</option>
          ))}
        </select>

        <select
          value={filters.priceRange}
          onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {priceRanges.map(range => (
            <option key={range} value={range === 'Any Price' ? '' : range}>{range}</option>
          ))}
        </select>
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 animate-slide-up">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Advanced Search Options</h4>
          
          {/* Bedrooms and Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <select
                value={filters.bathrooms}
                onChange={(e) => setFilters(prev => ({ ...prev, bathrooms: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Amenities & Features</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="sr-only"
                  />
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filters.amenities.includes(amenity)
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300'
                  }`}>
                    {amenity}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Interactive Map Placeholder */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Search by Map Area</label>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600 font-medium">Interactive Map Search</p>
              <p className="text-sm text-gray-500">Click and drag to define your preferred area</p>
              <button className="mt-3 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Open Map Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSearch}
          className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Properties
        </button>
        <button
          onClick={clearFilters}
          className="sm:w-auto bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Clear Filters
        </button>
      </div>

      {/* Search Results Count */}
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          <span className="font-semibold text-primary-600">47 properties</span> found matching your criteria
        </p>
      </div>
    </div>
  );
};

export default PropertySearch;
