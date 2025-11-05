import React from 'react';
import AnimatedSection from './AnimatedSection';

const ServicesSection: React.FC = () => {
  const services = [
    {
      title: "Property Listing and Sales",
      description: "Residential, agricultural, commercial, and beachfront properties",
      features: [
        "Wide advertising reach via online platforms and local marketing",
        "Assistance in pricing, viewing, and negotiations"
      ],
      icon: "🏠",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Document Assistance and Preparation",
      description: "Authority to Sell (ATS), Special Power of Attorney (SPA), Deed of Sale, Lease Contracts",
      features: [
        "Notarization support and legal review guidance"
      ],
      icon: "📄",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Title Transfer Services",
      description: "Capital Gains Tax (CGT), Documentary Stamp Tax (DST), Transfer Tax computation",
      features: [
        "Coordination with BIR, Registry of Deeds, Municipal Assessor, and Treasurer's Office"
      ],
      icon: "🏛️",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Buyer and Seller Representation",
      description: "Accredited Real Estate Salesperson representation",
      features: [
        "Authorized coordination through signed ATS or SPA"
      ],
      icon: "🤝",
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Real Estate Advisory",
      description: "Guidance on land development, property potential, and investment returns",
      features: [
        "Risk analysis and due diligence for problematic lots or inherited properties"
      ],
      icon: "💡",
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <AnimatedSection>
      <section id="services" className="py-16 bg-beige-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">OUR SERVICES</h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`${service.bgColor} rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group relative overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon with animation */}
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start group-hover:text-gray-700 transition-colors">
                        <span className="text-green-500 mr-3 mt-0.5 transform group-hover:scale-110 transition-transform duration-300">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Learn More Button */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className={`bg-gradient-to-r ${service.gradient} text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300`}>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default ServicesSection;
