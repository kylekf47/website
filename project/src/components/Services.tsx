import React from 'react';
import { Store, Truck, Users, Gift, Clock, Shield } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Store,
      title: 'Dine-In Experience',
      description: 'Enjoy our cozy atmosphere with friends and family. Perfect for dates, celebrations, or casual meals.',
      features: ['Comfortable seating', 'Free WiFi', 'Family-friendly', 'Outdoor terrace']
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Hot, fresh food delivered to your doorstep within 30-45 minutes across Addis Ababa.',
      features: ['30-45 min delivery', 'Hot & fresh guarantee', 'Live order tracking', 'Contactless delivery']
    },
    {
      icon: Users,
      title: 'Event Catering',
      description: 'Make your special events memorable with our catering services for parties, offices, and celebrations.',
      features: ['Corporate events', 'Birthday parties', 'Custom menu options', 'Professional service']
    }
  ];

  const additionalServices = [
    {
      icon: Gift,
      title: 'Loyalty Program',
      description: 'Earn points with every order and redeem for free meals, discounts, and exclusive offers.'
    },
    {
      icon: Clock,
      title: 'Pre-Order Service',
      description: 'Schedule your orders in advance for pickup or delivery at your preferred time.'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Not satisfied? We\'ll remake your order or provide a full refund, no questions asked.'
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl md:text-5xl text-gray-800 mb-6">
              Our Services
            </h2>
            <p className="font-merriweather text-xl text-gray-600 max-w-3xl mx-auto">
              From dine-in experiences to catering services, we're here to serve you 
              with excellence in every way possible.
            </p>
          </div>

          {/* Main Services */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-300">
                  <service.icon className="text-red-600 group-hover:text-white transition-colors duration-300" size={24} />
                </div>
                
                <h3 className="font-poppins font-semibold text-xl text-gray-800 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Services */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-2xl text-gray-800 mb-8 text-center">
              Additional Services
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {additionalServices.map((service, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
                >
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="text-yellow-600" size={20} />
                  </div>
                  
                  <h4 className="font-poppins font-semibold text-lg text-gray-800 mb-3">
                    {service.title}
                  </h4>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white">
              <h3 className="font-poppins font-bold text-2xl mb-4">
                Ready to Experience Roha Restaurant?
              </h3>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                Whether you're dining in, ordering delivery, or planning an event, 
                we're here to make your experience exceptional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Book a Table
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;