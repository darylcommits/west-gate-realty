import React, { useState } from 'react';

interface LeadData {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  budget: string;
  timeline: string;
  message: string;
  source: string;
}

interface LeadCaptureProps {
  variant?: 'modal' | 'inline' | 'sidebar';
  title?: string;
  subtitle?: string;
  propertyId?: string;
  onClose?: () => void;
}

const LeadCapture: React.FC<LeadCaptureProps> = ({ 
  variant = 'inline', 
  title = "Get Property Information", 
  subtitle = "Leave your details and we'll contact you within 24 hours",
  propertyId,
  onClose 
}) => {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    budget: '',
    timeline: '',
    message: '',
    source: propertyId ? `Property ID: ${propertyId}` : 'Website Contact Form'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<LeadData>>({});

  const propertyTypes = [
    'Residential Properties', 
    'Agricultural Land', 
    'Commercial Properties', 
    'Solar Projects',
    'Investment Opportunities'
  ];

  const budgetRanges = [
    'Under ₱5 Million',
    '₱5M - ₱10M', 
    '₱10M - ₱20M',
    '₱20M - ₱50M',
    'Above ₱50M',
    'Discuss with agent'
  ];

  const timelines = [
    'Immediately',
    'Within 1 month',
    '1-3 months',
    '3-6 months',
    '6+ months',
    'Just browsing'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate CRM integration - replace with actual API call
      const leadSubmission = {
        ...formData,
        timestamp: new Date().toISOString(),
        leadScore: calculateLeadScore(formData),
        status: 'new'
      };

      // Mock API call - replace with actual CRM endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Lead submitted to CRM:', leadSubmission);
      
      // In real implementation, you would:
      // await fetch('/api/leads', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(leadSubmission)
      // });

      setIsSubmitted(true);
      
      // Track conversion event for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'lead_form_submit', {
          'event_category': 'Lead Generation',
          'event_label': formData.propertyType || 'General Inquiry'
        });
      }

    } catch (error) {
      console.error('Error submitting lead:', error);
      // Handle error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateLeadScore = (data: LeadData): number => {
    let score = 0;
    
    // Budget scoring
    if (data.budget.includes('Above ₱50M')) score += 30;
    else if (data.budget.includes('₱20M - ₱50M')) score += 25;
    else if (data.budget.includes('₱10M - ₱20M')) score += 20;
    else if (data.budget.includes('₱5M - ₱10M')) score += 15;
    
    // Timeline scoring
    if (data.timeline === 'Immediately') score += 25;
    else if (data.timeline === 'Within 1 month') score += 20;
    else if (data.timeline === '1-3 months') score += 15;
    
    // Property type scoring
    if (data.propertyType.includes('Solar') || data.propertyType.includes('Commercial')) score += 15;
    
    // Message length (shows engagement)
    if (data.message.length > 50) score += 10;
    
    return Math.min(score, 100);
  };

  const handleInputChange = (field: keyof LeadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className={`${variant === 'modal' ? 'bg-white rounded-2xl p-8' : 'bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8'} text-center`}>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700 mb-4">
          Your inquiry has been received. Our property specialist will contact you within 24 hours.
        </p>
        <div className="bg-white/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-600">
            <strong>Reference ID:</strong> WG{Date.now().toString().slice(-6)}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${variant === 'modal' ? 'bg-white rounded-2xl' : 'bg-white rounded-2xl shadow-xl'} p-6`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-primary-900">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0939 XXX XXXX"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Property Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type of Interest
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select property type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <select
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select budget range</option>
              {budgetRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeline
          </label>
          <select
            value={formData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">When are you looking to purchase?</option>
            {timelines.map(timeline => (
              <option key={timeline} value={timeline}>{timeline}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Tell us more about your requirements..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Inquiry
            </>
          )}
        </button>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to our privacy policy and consent to being contacted about property opportunities.
        </p>
      </form>
    </div>
  );
};

export default LeadCapture;
