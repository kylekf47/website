import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Phone, User, LogOut, Users, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onShowLogin: () => void;
  cartItemCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onShowLogin, cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'menu', label: 'Menu' },
    { id: 'contact', label: 'Contact' },
  ];

  const customerNavItems = [
    { id: 'order', label: 'Order' },
    { id: 'my-orders', label: 'My Orders' },
    { id: 'my-profile', label: 'My Profile' },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Dashboard' },
    { id: 'admin-menu', label: 'Manage Menu' },
    { id: 'admin-orders', label: 'Orders' },
    { id: 'admin-users', label: 'Users' },
    { id: 'admin-contact', label: 'Contact Info' },
    { id: 'admin-logs', label: 'Activity Logs' },
  ];

  const getNavItems = () => {
    if (isAdmin) {
      return [...publicNavItems, ...adminNavItems];
    } else if (user) {
      return [...publicNavItems, ...customerNavItems];
    }
    return publicNavItems;
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg backdrop-blur-sm' 
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div>
              <h1 className="font-poppins font-bold text-xl text-gray-800">Roha</h1>
              <p className="text-xs text-gray-600 -mt-1">Restaurant</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {getNavItems().map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-medium transition-colors duration-200 hover:text-red-600 text-sm ${
                  currentPage === item.id
                    ? 'text-red-600 border-b-2 border-red-600 pb-1'
                    : 'text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+251953037583"
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <Phone size={18} />
              <span className="font-medium">Call Now</span>
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {profile?.full_name || 'User'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onShowLogin}
                className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <User size={18} />
                <span>Login</span>
              </button>
            )}
            
            {!isAdmin && (
              <button
                onClick={() => onNavigate(user ? 'order' : 'menu')}
                className="relative flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <ShoppingCart size={18} />
                <span>Order</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 mt-4">
              {getNavItems().map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`font-medium text-left transition-colors duration-200 hover:text-red-600 py-2 ${
                    currentPage === item.id ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <a
                  href="tel:+251953037583"
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <Phone size={18} />
                  <span className="font-medium">Call Now</span>
                </a>
                
                {user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Welcome, {profile?.full_name || 'User'}
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onShowLogin();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors w-fit"
                  >
                    <User size={18} />
                    <span>Login</span>
                  </button>
                )}
                
                {!isAdmin && (
                  <button
                    onClick={() => {
                      onNavigate(user ? 'order' : 'menu');
                      setIsMenuOpen(false);
                    }}
                    className="relative flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors w-fit"
                  >
                    <ShoppingCart size={18} />
                    <span>Order Now</span>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;