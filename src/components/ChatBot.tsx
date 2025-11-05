import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your West Gate Realty assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced Real estate specific responses without specific pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      if (lowerMessage.includes('agricultural') || lowerMessage.includes('farm')) {
        return "Agricultural land pricing varies depending on several factors:\n• Location and accessibility\n• Soil quality and irrigation systems\n• Proximity to markets and transportation\n• Government zoning and land classification\n\nWe offer flexible payment terms and can assist with agricultural loan applications. For current market rates and specific property pricing, please contact us directly at 0939 499 4234 or visit our office for a detailed consultation.";
      }
      if (lowerMessage.includes('residential') || lowerMessage.includes('house') || lowerMessage.includes('home')) {
        return "Residential property pricing varies based on:\n• Location and neighborhood\n• Property size and lot area\n• House design and construction quality\n• Amenities and features included\n• Market conditions\n\nWe offer various financing options including in-house financing and bank loan assistance. All prices include complete documentation and title transfer services. Please contact us at 0939 499 4234 for current pricing and to schedule property viewings.";
      }
      if (lowerMessage.includes('commercial')) {
        return "Commercial property investments offer excellent opportunities in prime Ilocos locations. Pricing depends on:\n• Strategic location and foot traffic\n• Property size and configuration\n• Market demand and growth potential\n• Infrastructure and accessibility\n\nWe provide complete market analysis and investment projections to help you make informed decisions. Contact us at 0939 499 4234 for detailed feasibility studies and current market rates.";
      }
      return "Our pricing is competitive and transparent across all property types:\n\n🏡 RESIDENTIAL PROPERTIES\n🌾 AGRICULTURAL LANDS\n🏢 COMMERCIAL SPACES\n☀️ SOLAR INVESTMENT PROJECTS\n\nAll transactions include complete documentation assistance and professional guidance. We offer flexible payment terms and financing coordination. For specific pricing and detailed quotations, please contact us at 0939 499 4234 or visit our office.";
    }
    
    if (lowerMessage.includes('agricultural') || lowerMessage.includes('farm') || lowerMessage.includes('land')) {
      return "🌾 AGRICULTURAL PROPERTIES IN ILOCOS:\n\n✅ AVAILABLE LOCATIONS:\n• Vigan City - Prime irrigated rice fields\n• Bantay - Vegetable farming areas\n• Santa - Mixed crop agricultural zones\n• Candon - Coastal agricultural lands\n\n✅ FEATURES:\n• Established irrigation systems\n• Rich, fertile soil (Class A)\n• Year-round water supply\n• Government support programs\n• Easy road access\n\n✅ IDEAL FOR:\n• Rice production (2-3 harvests/year)\n• Vegetable farming\n• Fruit cultivation\n• Livestock raising\n\nSizes available: 1-50 hectares\nFree site inspection and soil analysis included!\nCall 0939 499 4234 to schedule a viewing.";
    }
    
    if (lowerMessage.includes('solar') || lowerMessage.includes('energy') || lowerMessage.includes('renewable')) {
      return "☀️ SOLAR FARM INVESTMENT OPPORTUNITIES:\n\n✅ CURRENT PROJECTS:\n• Large-scale Ilocos Sur Solar Farm\n• Vigan Solar Development Project\n• Candon Renewable Energy Initiative\n\n✅ INVESTMENT BENEFITS:\n• Government incentives and tax holidays\n• Long-term Power Purchase Agreements\n• Guaranteed grid connection\n• Professional O&M services included\n• Stable long-term returns\n\n✅ PROJECT FEATURES:\n• High-efficiency solar panels\n• Professional installation and maintenance\n• Environmental sustainability\n• Community development support\n\nEco-friendly investment with excellent potential!\nContact us at 0939 499 4234 for detailed project information and investment requirements.";
    }
    
    if (lowerMessage.includes('commercial') || lowerMessage.includes('business') || lowerMessage.includes('office')) {
      return "🏢 COMMERCIAL REAL ESTATE PORTFOLIO:\n\n✅ PRIME LOCATIONS AVAILABLE:\n• Vigan Heritage District - Tourist hotspots\n• Laoag Business Center - High foot traffic\n• Candon Commercial Hub - Growing market\n\n✅ PROPERTY TYPES:\n• Retail spaces: Various sizes available\n• Office buildings: Modern facilities\n• Mixed-use developments\n• Warehouse facilities\n\n✅ INVESTMENT FEATURES:\n• Excellent rental potential\n• Strategic locations with growth potential\n• Complete business permits assistance\n• Tenant placement services\n\n✅ FINANCING OPTIONS:\n• In-house financing available\n• Bank loan coordination\n• Flexible payment terms\n\nLet's find the perfect business location for you!\nCall 0939 499 4234 for property viewings and pricing information.";
    }
    
    if (lowerMessage.includes('document') || lowerMessage.includes('title') || lowerMessage.includes('transfer') || lowerMessage.includes('legal')) {
      return "📋 COMPLETE LEGAL DOCUMENTATION SERVICES:\n\n✅ PROPERTY DOCUMENTS:\n• Authority to Sell (ATS)\n• Special Power of Attorney (SPA)\n• Deed of Sale preparation\n• Lease Contracts\n\n✅ TITLE TRANSFER SERVICES:\n• Capital Gains Tax (CGT) computation & payment\n• Documentary Stamp Tax (DST) processing\n• Transfer Tax calculation\n• BIR clearance assistance\n• Registry of Deeds coordination\n\n✅ GOVERNMENT COORDINATION:\n• Municipal Assessor liaison\n• Treasurer's Office processing\n• Notarization services\n• Legal review and guidance\n\n✅ PROFESSIONAL TEAM:\n• PRC-accredited professionals\n• Licensed attorneys\n• Experienced processors\n\nTimeline: 30-45 days\nCall 0939 499 4234 for service fees and document consultation.";
    }
    
    if (lowerMessage.includes('residential') || lowerMessage.includes('house') || lowerMessage.includes('home') || lowerMessage.includes('villa')) {
      return "🏡 RESIDENTIAL PROPERTIES COLLECTION:\n\n✅ AVAILABLE HOMES:\n• Modern Family Homes (Vigan) - 4BR/3BA\n• Traditional Filipino Villas (Bantay) - 5BR/4BA\n• Beachfront Bungalows (Candon) - 3BR/2BA\n• Executive Townhouses (Laoag) - 3BR/2BA\n\n✅ PREMIUM FEATURES:\n• Modern kitchen & appliances\n• Landscaped gardens\n• Secure parking\n• Quality finishes\n• Strategic locations\n\n✅ FINANCING OPTIONS:\n• In-house financing available\n• Bank loan assistance\n• Rent-to-own programs\n• Flexible payment terms\n\n✅ COMPLETE PACKAGE INCLUDES:\n• Full documentation\n• Title transfer\n• Utility connections\n• Move-in ready condition\n\nSchedule a home tour today!\nCall 0939 499 4234 for pricing and property viewings.";
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('address')) {
      return "📍 WEST GATE REALTY SERVICES OFFICE:\n\n🏢 ADDRESS:\nBrgy Cabigbigaan, Sto. Domingo, Ilocos Sur\n\n🕒 BUSINESS HOURS:\nMonday-Friday: 8:00 AM - 6:00 PM\nSaturday: 8:00 AM - 5:00 PM\nSunday: By appointment only\n\n🚗 DIRECTIONS:\n• 15 minutes from Vigan City proper\n• Near Sto. Domingo Municipal Hall\n• Accessible via public transport\n• Free parking available\n\n📞 CONTACT OPTIONS:\n• Phone: 0939 499 4234\n• Email: westgaterealestateserviceshr@gmail.com\n• WhatsApp: Available for quick queries\n\n🗺️ SERVICE AREAS:\nWe serve the entire Ilocos region and conduct site visits throughout Northern Luzon.\n\nVisit us for free consultation and property brochures!";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
      return "You can reach us at:\n📞 0939 499 4234\n📧 westgaterealestateserviceshr@gmail.com\n📍 Brgy Cabigbigaan, Sto. Domingo, Ilocos Sur\n\nWe're also available on WhatsApp for quick consultations!";
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do') || lowerMessage.includes('help')) {
      return "West Gate Realty Services offers:\n• Property Listing & Sales\n• Document Assistance & Preparation\n• Title Transfer Services\n• Buyer & Seller Representation\n• Real Estate Advisory\n\nWe're your complete real estate solution in Ilocos!";
    }
    
    if (lowerMessage.includes('certification') || lowerMessage.includes('license') || lowerMessage.includes('accredited')) {
      return "We're fully licensed and accredited! Our credentials include:\n• DTI Business Registration No. 7087904\n• PRC Accreditation No. 22818 (Jonathan Rocero Rabanal)\n• Licensed broker partnerships\n• Legal attorney collaborations\n\nYou can trust our professional expertise!";
    }
    
    if (lowerMessage.includes('investment') || lowerMessage.includes('roi') || lowerMessage.includes('return')) {
      return "Real estate investment in Ilocos offers excellent opportunities! Our solar projects typically yield 15-20% annual returns, while agricultural and commercial properties provide steady appreciation. We offer complete investment analysis and risk assessment. Let's discuss your investment goals!";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('good')) {
      return "Hello! Welcome to West Gate Realty Services. I'm here to help you with any questions about our properties, services, or real estate opportunities in Ilocos. What would you like to know?";
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! Is there anything else you'd like to know about our real estate services? I'm here to help with properties, documentation, investments, or any other questions you might have.";
    }
    
    // Default response
    return "I'd be happy to help you with that! For detailed information about our real estate services, properties, or specific inquiries, please feel free to contact our team directly at 0939 499 4234 or visit our office at Brgy Cabigbigaan, Sto. Domingo, Ilocos Sur. Is there a specific property type or service you're interested in?";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <div className="flex items-center justify-center text-white">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </div>
        
        {/* Notification dot for new messages when closed */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">West Gate Assistant</h3>
                <p className="text-xs text-primary-100">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our properties..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by West Gate AI Assistant
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
