import React, { useState } from 'react';
import SwiperCarousel from './SwiperCarousel';
import PropertyDetailModal from './PropertyDetailModal';

const HeroSection: React.FC = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (isScrolling) return; // Prevent multiple rapid clicks
    
    setIsScrolling(true);
    const element = document.getElementById(sectionId);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Reset scrolling state after animation
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    } else {
      console.warn(`Section with id "${sectionId}" not found`);
      setIsScrolling(false);
    }
  };

  const handleCardClick = (sectionId: string, cardType: string) => {
    console.log(`Clicked ${cardType} card, navigating to ${sectionId}`);
    scrollToSection(sectionId);
  };

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };
  return (
        <section
          id="home"
          className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-slate-50/50"></div>
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse" style={{ background: '#00284b' }}></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000" style={{ background: '#00284b' }}></div>
      
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center animate-fade-in mt-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#00284b' }}>
                  WEST GATE REALTY SERVICES
                  <span className="block" style={{ color: '#c52528' }}></span>
                </h1>
          <p className="text-2xl md:text-3xl mb-8 italic" style={{ color: '#c52528' }}>
            Turning Dreams to Reality
          </p>
          <p className="text-lg max-w-3xl mx-auto mb-8" style={{ color: '#00284b' }}>
            West Gate Realty Services is your all-in-one real estate partner in Ilocos!
            We are proud to offer professional, honest, and complete real estate services,
            in collaboration with a licensed broker and partner attorney.
          </p>
        
          
          {/* Property Carousel Showcase */}
          <SwiperCarousel onPropertyClick={handlePropertyClick} />
        </div>
      </div>
      
      {/* Property Detail Modal */}
      <PropertyDetailModal 
        property={selectedProperty} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </section>
  );
};

export default HeroSection;
