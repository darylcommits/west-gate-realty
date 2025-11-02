import React, { useState } from 'react';
import AnimatedSection from './AnimatedSection';

const CertificationsSection: React.FC = () => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<string>('');

  const certificates = [
    {
      id: 'dti',
      title: 'DTI Business Registration Certificate',
      type: 'DTI Certificate',
      number: '7087904',
      validFrom: '15 April 2025',
      validTo: '15 April 2030',
      certificateId: 'WXYZ93511759066',
      image: "/assets/images/dti.jpg",
      description: 'Official business registration certificate from the Department of Trade and Industry'
    },
    {
      id: 'prc',
      title: 'PRC Professional License',
      type: 'PRC Accreditation',
      number: '22818',
      validFrom: '2023',
      validTo: '2025',
      certificateId: 'PRC-22818-2023',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      description: 'Professional Regulation Commission accreditation for real estate services'
    }
  ];

  const openCertificateModal = (certId: string) => {
    setSelectedCertificate(certId);
    setShowCertificateModal(true);
  };

  const closeCertificateModal = () => {
    setShowCertificateModal(false);
    setSelectedCertificate('');
  };

  return (
    <AnimatedSection>
      <section id="certifications" className="py-16 bg-beige-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">LEGITIMACY CERTIFICATIONS</h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* DTI Certificate */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-8 mb-8 border-l-4 border-green-500">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-primary-900 mb-4">
                    Department of Trade and Industry (DTI) Certificate
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Business Name:</strong> WEST GATE REALTY SERVICES (NATIONAL)</p>
                    <p><strong>Registered to:</strong> JONATHAN ROCERO RABANAL</p>
                    <p><strong>Business Name No.:</strong> 7087904</p>
                    <p><strong>Valid from:</strong> 15 April 2025 to 15 April 2030</p>
                    <p><strong>Certificate ID:</strong> WXYZ93511759066</p>
                  </div>
                </div>
                <div className="md:w-1/3 mt-6 md:mt-0">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🏛️</div>
                      <p className="text-sm font-semibold text-green-600">DTI CERTIFIED</p>
                      <p className="text-xs text-gray-500 mb-4">Business Registration</p>
                      <button
                        onClick={() => openCertificateModal('dti')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        View Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRC Accreditation */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 border-l-4 border-blue-500">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary-900 mb-4">
                  Professional Regulation Commission (PRC) Accreditation
                </h3>
                <div className="max-w-2xl mx-auto">
                  <p className="text-gray-700 mb-4">
                    <strong>Jonathan Rocero Rabanal</strong><br />
                    PRC Accreditation No. 22818
                  </p>
                  <p className="text-sm text-gray-600">
                    Handled by PRC-accredited professionals you can trust
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <div className="text-3xl mb-2">🎓</div>
                      <p className="text-sm font-semibold text-blue-600">PRC ACCREDITED</p>
                      <p className="text-xs text-gray-500 mb-4">Professional License</p>
                      <button
                        onClick={() => openCertificateModal('prc')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View License
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Permits */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                <h4 className="text-lg font-semibold text-primary-900 mb-3">Service Offerings Include:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Land Acquisition</li>
                  <li>✓ Land Due Diligence</li>
                  <li>✓ Land Reclassification</li>
                  <li>✓ Municipal & Brgy. Endorsement</li>
                  <li>✓ LGU Local Building Permits</li>
                  <li>✓ Access Roads</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                <h4 className="text-lg font-semibold text-primary-900 mb-3">Additional Services:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Building Permit</li>
                  <li>✓ Locational Clearance</li>
                  <li>✓ Excavation & Ground Clearance</li>
                  <li>✓ Electrical Permit</li>
                  <li>✓ Sanitary Permit</li>
                  <li>✓ Fire Safety Clearance</li>
                  <li>✓ Occupancy Permit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-primary-900">
                  {certificates.find(cert => cert.id === selectedCertificate)?.title}
                </h3>
                <button
                  onClick={closeCertificateModal}
                  className="text-gray-400 hover:text-gray-600 p-1 sm:p-2"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedCertificate && (
                <div className="space-y-6">
                  {/* Certificate Image */}
                  <div className="text-center">
                    <img
                      src={certificates.find(cert => cert.id === selectedCertificate)?.image}
                      alt={certificates.find(cert => cert.id === selectedCertificate)?.title}
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f3f4f6"/><text x="400" y="300" text-anchor="middle" fill="%236b7280" font-size="24">Certificate Image</text></svg>`;
                      }}
                    />
                  </div>

                  {/* Certificate Details */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h4 className="text-lg font-semibold text-primary-900 mb-4">Certificate Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Certificate Type:</span>
                        <p className="text-primary-900 font-semibold">
                          {certificates.find(cert => cert.id === selectedCertificate)?.type}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Certificate Number:</span>
                        <p className="text-primary-900 font-semibold">
                          {certificates.find(cert => cert.id === selectedCertificate)?.number}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Valid From:</span>
                        <p className="text-primary-900 font-semibold">
                          {certificates.find(cert => cert.id === selectedCertificate)?.validFrom}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Valid To:</span>
                        <p className="text-primary-900 font-semibold">
                          {certificates.find(cert => cert.id === selectedCertificate)?.validTo}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-sm font-medium text-gray-600">Certificate ID:</span>
                        <p className="text-primary-900 font-semibold">
                          {certificates.find(cert => cert.id === selectedCertificate)?.certificateId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                    <h4 className="text-lg font-semibold text-primary-900 mb-2">About This Certificate</h4>
                    <p className="text-gray-700">
                      {certificates.find(cert => cert.id === selectedCertificate)?.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    
                   
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatedSection>
  );
};

export default CertificationsSection;
