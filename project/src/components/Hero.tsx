import React from 'react';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Star className="text-yellow-400 fill-current" size={18} />
            <span className="font-medium">Addis Ababa's Favorite Restaurant</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-poppins font-bold text-5xl md:text-7xl mb-6 leading-tight">
            Bold Flavors.
            <br />
            <span className="text-yellow-400">Honest Ingredients.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-merriweather text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the authentic taste of handcrafted pizzas and gourmet burgers, 
            made with locally-sourced ingredients and served with Ethiopian hospitality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => onNavigate('menu')}
              className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Order Now</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            
            <button
              onClick={() => onNavigate('menu')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              View Menu
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Clock className="text-yellow-400" size={20} />
              <div className="text-left">
                <p className="font-semibold">Open Daily</p>
                <p className="text-sm opacity-90">10:00 AM - 11:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <MapPin className="text-yellow-400" size={20} />
              <div className="text-left">
                <p className="font-semibold">Location</p>
                <p className="text-sm opacity-90">Bole, Addis Ababa</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-current" />
                ))}
              </div>
              <div className="text-left">
                <p className="font-semibold">4.9/5</p>
                <p className="text-sm opacity-90">2,500+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;