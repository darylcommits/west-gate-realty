import React from 'react';
import AnimatedSection from './AnimatedSection';

const AboutSection: React.FC = () => {
  return (
    <AnimatedSection>
      <section id="about" className="py-16 bg-beige-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">ABOUT US</h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto"></div>
          </div>

          {/* Owner Introduction Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Professional Photo */}
              <div className="flex justify-center md:justify-end">
                <img
                  src="/assets/images/logo.jpg"
                  alt="Owner - West Gate Realty Services"
                  className="w-full max-w-md h-auto object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full max-w-md h-96 rounded-2xl flex items-center justify-center text-white text-6xl font-bold shadow-2xl';
                      fallback.style.backgroundColor = '#00284b';
                      fallback.textContent = 'WG';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>

              {/* Professional Introduction */}
              <div className="text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#00284b' }}>
                  Your Full-Package Real Estate Marketing & Transaction Management Partner
                </h3>
                <div className="w-16 h-1 mb-6" style={{ backgroundColor: '#c52528' }}></div>
                <p className="text-lg leading-relaxed mb-4" style={{ color: '#00284b' }}>
                  <span className="font-semibold">West Gate Realty Services</span> is a full-package real estate marketing arm
                  dedicated to providing strategic, professional, and end-to-end solutions for property owners, buyers,
                  and investors across Ilocos.
                </p>
                <p className="text-lg leading-relaxed mb-4" style={{ color: '#00284b' }}>
                  We specialize in high-impact property marketing, client-property matching, documentation coordination,
                  and seamless transaction management—ensuring every real estate deal is handled with accuracy,
                  transparency, and compliance.
                </p>
                <p className="text-lg leading-relaxed font-semibold" style={{ color: '#c52528' }}>
                  We don't just market properties. We provide solutions, structure, and confidence.
                </p>
              </div>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#00284b' }}>
                What West Gate Does
              </h3>
              <div className="w-16 h-1 mx-auto" style={{ backgroundColor: '#c52528' }}></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Strategic Property Marketing */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#00284b' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: '#00284b' }}>Strategic Property Marketing</h4>
                <p className="text-gray-600 text-sm">
                  We position properties with professional branding, advertising, and digital campaigns to reach qualified buyers and investors.
                </p>
              </div>

              {/* Client-Property Matching */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#00284b' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: '#00284b' }}>Client-Property Matching</h4>
                <p className="text-gray-600 text-sm">
                  West Gate carefully matches verified property owners with serious, legitimate buyers to ensure safe and efficient transactions.
                </p>
              </div>

              {/* Transaction Management */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#00284b' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: '#00284b' }}>End-to-End Transaction Management</h4>
                <p className="text-gray-600 text-sm">
                  From inquiries and site viewings to negotiation and documentation, West Gate coordinates the entire process to keep everything organized and compliant.
                </p>
              </div>

              {/* Legal & Technical Coordination */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#00284b' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: '#00284b' }}>Legal & Technical Coordination</h4>
                <p className="text-gray-600 text-sm">
                  We work closely with a licensed real estate broker, partner attorneys, surveyors, assessors, and LGUs to ensure each transaction is properly guided and legally aligned.
                </p>
              </div>

              {/* Investment & Market Advisory */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#00284b' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: '#00284b' }}>Investment & Market Advisory</h4>
                <p className="text-gray-600 text-sm">
                  We help clients understand market value, location opportunities, and investment potential—giving confidence and clarity in every decision.
                </p>
              </div>

              {/* Due Diligence */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#00284b' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ color: '#00284b' }}>Due Diligence & Coordination</h4>
                <p className="text-gray-600 text-sm">
                  We work closely with licensed brokers, attorneys, surveyors, assessors, and LGUs to ensure accuracy and legal compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Why Clients Choose West Gate */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#00284b' }}>
                Why Clients Choose West Gate
              </h3>
              <div className="w-16 h-1 mx-auto" style={{ backgroundColor: '#c52528' }}></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg className="w-10 h-10 text-primary-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.8 9 10 5.16-.2 9-4.45 9-10V7l-10-5z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">Transparent & Compliant</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Compliant with PRC & RESA Law with strong legal & broker backing</p>
              </div>
              <div className="text-center group transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-gold-100 to-gold-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg className="w-10 h-10 text-gold-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">Professional Marketing</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Full-package professional support that elevates property visibility</p>
              </div>
              <div className="text-center group transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">Fast & Organized</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Fast communication, organized processing, and local market expertise across Ilocos</p>
              </div>
            </div>
          </div>

          {/* Commitment Section */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#00284b' }}>
                Our Commitment
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: '#00284b' }}>
                West Gate Realty Services is committed to delivering a smooth, secure, and expertly managed
                real estate experience—from the first inquiry to the final signing of documents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default AboutSection;
