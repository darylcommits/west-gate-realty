import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gold-500 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">West Gate Realty Services</h3>
              <p className="text-primary-200 text-sm">Your Gateway to Smart Real Estate Investment</p>
            </div>
          </div>
          <p className="text-primary-200 mb-4">
            Trusted Real Estate Intermediary for Local & Foreign Investors
          </p>
          <div className="border-t border-primary-700 pt-4">
            <p className="text-sm text-primary-300">
              © 2024 West Gate Realty Services. All rights reserved. | DTI Business Name No. 7087904 | PRC Accreditation No. 22818
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
