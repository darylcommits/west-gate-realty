import React from 'react';
import AnimatedSection from './AnimatedSection';

const WhyChooseUsSection: React.FC = () => {
  return (
    <AnimatedSection>
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose West Gate Realty Services?</h2>
            <div className="w-20 h-1 bg-gold-400 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-slide-in-left">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Licensed and Accredited Professionals</h3>
              <p className="text-primary-100">Certified experts you can trust</p>
            </div>
            <div className="text-center animate-slide-up">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized and Honest Client Support</h3>
              <p className="text-primary-100">Dedicated service tailored to your needs</p>
            </div>
            <div className="text-center animate-slide-up">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast and Reliable Document Processing</h3>
              <p className="text-primary-100">Efficient handling of all paperwork</p>
            </div>
            <div className="text-center animate-slide-in-right">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.21 9l-4.38-6.56a1 1 0 00-1.66 0L6.79 9a1 1 0 00.83 1.51h.83L7.66 21a1 1 0 001 .74h6.68a1 1 0 001-.74l-.79-10.49h.83A1 1 0 0017.21 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Deep Understanding of Ilocos Property Market</h3>
              <p className="text-primary-100">Local expertise and market knowledge</p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default WhyChooseUsSection;
