import React, { useState } from 'react';
import { Mail, Gift } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Mail className="text-white" size={24} />
            </div>
          </div>

          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-4">
            Stay Updated with Roha Restaurant
          </h2>
          
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new menu items, 
            special offers, and exclusive deals. Plus, get 10% off your next order!
          </p>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Gift className="text-yellow-400 mx-auto mb-2" size={24} />
              <h3 className="font-semibold text-white mb-1">10% Off Welcome</h3>
              <p className="text-red-100 text-sm">Get instant discount on your first order</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Mail className="text-yellow-400 mx-auto mb-2" size={24} />
              <h3 className="font-semibold text-white mb-1">Exclusive Offers</h3>
              <p className="text-red-100 text-sm">Special deals only for subscribers</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-yellow-400 mx-auto mb-2 text-2xl">🍕</div>
              <h3 className="font-semibold text-white mb-1">New Menu Updates</h3>
              <p className="text-red-100 text-sm">First to try our latest creations</p>
            </div>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-4 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </div>
          </form>

          {/* Success Message */}
          {isSubscribed && (
            <div className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg inline-block">
              🎉 Thank you for subscribing! Check your email for your 10% discount code.
            </div>
          )}

          <p className="text-red-100 text-sm mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;