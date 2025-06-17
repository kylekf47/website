import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="font-poppins font-bold text-xl">Roha</h1>
                <p className="text-xs text-gray-400 -mt-1">Restaurant</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Experience bold flavors and honest ingredients in every meal. 
              Addis Ababa's favorite destination for authentic pizza and gourmet burgers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Us' },
                { id: 'services', label: 'Services' },
                { id: 'menu', label: 'Menu' },
                { id: 'contact', label: 'Contact' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-red-500 flex-shrink-0 mt-1" size={16} />
                <p className="text-gray-300 text-sm">
                  Bole Road, Near Atlas Hotel<br />
                  Addis Ababa, Ethiopia
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-red-500 flex-shrink-0" size={16} />
                <p className="text-gray-300 text-sm">+251 911 234 567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-red-500 flex-shrink-0" size={16} />
                <p className="text-gray-300 text-sm">info@roharestaurant.com</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Opening Hours</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Mon - Thu:</span>
                <span className="text-gray-300">10:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Fri - Sat:</span>
                <span className="text-gray-300">10:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Sunday:</span>
                <span className="text-gray-300">10:00 AM - 9:00 PM</span>
              </div>
            </div>
            <div className="bg-red-600 text-white p-3 rounded-lg text-center">
              <p className="text-sm font-medium">Open Now!</p>
              <p className="text-xs">Delivery until 11:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Roha Restaurant. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;