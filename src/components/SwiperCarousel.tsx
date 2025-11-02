import React, { useState, useEffect, useRef } from 'react';

interface Property {
  id: number;
  title: string;
  location: string;
  type: string;
  typeColor: string;
  backgroundImage: string;
  details: {
    price: string;
    size: string;
    features: string[];
    description: string;
  };
}

interface SwiperCarouselProps {
  onPropertyClick?: (property: Property) => void;
}

const SwiperCarousel: React.FC<SwiperCarouselProps> = ({ onPropertyClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const properties: Property[] = [
    {
      id: 1,
      title: "Prime Agricultural Land",
      location: "Ilocos Norte, Philippines",
      type: "AGRICULTURAL",
      typeColor: "#62667f",
      backgroundImage: "/assets/images/agricultural.jpg",
      details: {
        price: "Starting from ₱15,000/sqm",
        size: "2-50 hectares available",
        features: ["Fertile Soil", "Water Access", "Road Access"],
        description: "Prime farming properties with excellent soil quality and water access for agricultural development."
      }
    },
    {
      id: 2,
      title: "Solar Development Projects",
      location: "Ilocos Sur, Philippines",
      type: "RENEWABLE",
      typeColor: "#087ac4",
      backgroundImage: "/assets/images/ssolar.jpg",
      details: {
        price: "Investment Opportunity",
        size: "5-100 hectares",
        features: ["Solar Panels", "Grid Connection", "Government Incentives"],
        description: "Sustainable energy projects with modern solar infrastructure and government support."
      }
    },
    {
      id: 3,
      title: "Narvacan Coastal Properties",
      location: "Narvacan, Ilocos Sur",
      type: "RESIDENTIAL",
      typeColor: "#b45205",
      backgroundImage: "/assets/images/narvacan.jpg",
      details: {
        price: "Starting from ₱25,000/sqm",
        size: "500-2000 sqm lots",
        features: ["Beach Access", "Modern Design", "Security"],
        description: "Dream coastal properties with stunning ocean views and modern amenities."
      }
    },
    {
      id: 4,
      title: "Sinait Heritage District",
      location: "Sinait, Ilocos Sur",
      type: "COMMERCIAL",
      typeColor: "#087ac4",
      backgroundImage: "/assets/images/sinait.jpg",
      details: {
        price: "Starting from ₱30,000/sqm",
        size: "1000-5000 sqm",
        features: ["High Traffic", "Business District", "Heritage Location"],
        description: "Prime commercial properties in historic business districts with high foot traffic."
      }
    },
    {
      id: 5,
      title: "San Ildefonso Agricultural Lands",
      location: "San Ildefonso, Ilocos Sur",
      type: "AGRICULTURAL",
      typeColor: "#1b7402",
      backgroundImage: "/assets/images/sanil.jpg",
      details: {
        price: "Starting from ₱12,000/sqm",
        size: "1-20 hectares available",
        features: ["Rich Farmland", "Irrigation System", "Strategic Location", "Agricultural Support"],
        description: "Fertile agricultural lands in San Ildefonso with excellent farming potential and modern irrigation facilities."
      }
    }
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % properties.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + properties.length) % properties.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Auto-play functionality
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentSlide, isTransitioning]);

  const getSlideTransform = (index: number) => {
    const diff = index - currentSlide;
    const adjustedDiff = ((diff % properties.length) + properties.length) % properties.length;
    
    if (adjustedDiff === 0) {
      return 'translateX(0) scale(1) rotateY(0deg)';
    } else if (adjustedDiff === 1) {
      return 'translateX(120px) scale(0.85) rotateY(-15deg)';
    } else if (adjustedDiff === properties.length - 1) {
      return 'translateX(-120px) scale(0.85) rotateY(15deg)';
    } else if (adjustedDiff === 2) {
      return 'translateX(220px) scale(0.7) rotateY(-25deg)';
    } else if (adjustedDiff === properties.length - 2) {
      return 'translateX(-220px) scale(0.7) rotateY(25deg)';
    } else {
      return 'translateX(0) scale(0.5) rotateY(0deg)';
    }
  };

  const getSlideOpacity = (index: number) => {
    const diff = index - currentSlide;
    const adjustedDiff = ((diff % properties.length) + properties.length) % properties.length;
    
    if (adjustedDiff <= 2) return 1;
    return 0.3;
  };

  const getSlideZIndex = (index: number) => {
    const diff = index - currentSlide;
    const adjustedDiff = Math.abs(((diff % properties.length) + properties.length) % properties.length);
    return 10 - adjustedDiff;
  };

  return (
    <section className="relative w-full min-h-screen flex justify-center items-center overflow-hidden">
      <div className="w-full pt-8 pb-8">
        <div className="relative flex items-center justify-center h-[500px]">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="absolute transition-all duration-500 ease-out cursor-pointer"
              style={{
                transform: getSlideTransform(index),
                opacity: getSlideOpacity(index),
                zIndex: getSlideZIndex(index),
                filter: index === currentSlide ? 'blur(0px)' : 'blur(1px)',
              }}
              onClick={() => onPropertyClick?.(property)}
            >
              <div 
                className="w-96 h-[500px] rounded-lg shadow-2xl flex flex-col justify-end items-start relative overflow-hidden"
                style={{
                  background: `linear-gradient(to top, #0f2027, #203a4300, #2c536400), url(${property.backgroundImage}) no-repeat 50% 50% / cover`
                }}
              >
                {/* Type Badge */}
                <span 
                  className="text-white uppercase px-7 py-2 inline-block rounded-r-full text-xs tracking-wider font-open-sans mb-4"
                  style={{ backgroundColor: property.typeColor }}
                >
                  {property.type}
                </span>

                {/* Content */}
                <div className="px-6 pb-8">
                  <h2 className="text-white font-roboto font-normal text-xl leading-tight mb-4">
                    {property.title}
                  </h2>
                  <p className="text-white font-roboto font-light flex items-center">
                    <svg 
                      className="w-6 h-6 mr-2 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="1.5" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" 
                      />
                    </svg>
                    {property.location}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-2">Click for Details</div>
                    <div className="text-sm opacity-90">{property.details.price}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-20"
        >
          <svg className="w-6 h-6 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-20"
        >
          <svg className="w-6 h-6 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-3 mt-8">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SwiperCarousel;
