import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import PropertyShowcase from './components/PropertyShowcase';
import PropertyListings from './components/PropertyListings';
import ServicesSection from './components/ServicesSection';
import CertificationsSection from './components/CertificationsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import ProtectedRoute from './components/admin/ProtectedRoute';
import './App.css';

const HomePage: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <AboutSection />
      <PropertyShowcase />
      <PropertyListings />
      <ServicesSection />
      <CertificationsSection />
      <WhyChooseUsSection />
      <ContactSection />
      <Footer />
      <ChatBot />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/*" element={<ProtectedRoute />} />
      </Routes>
    </Router>
  );
};

export default App;