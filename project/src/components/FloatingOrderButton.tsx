import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingOrderButtonProps {
  onNavigate: (page: string) => void;
}

const FloatingOrderButton: React.FC<FloatingOrderButtonProps> = ({ onNavigate }) => {
  return (
    <button
      onClick={() => onNavigate('menu')}
      className="fixed bottom-6 left-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-110 z-40 md:hidden"
      aria-label="Order Now"
    >
      <ShoppingCart size={24} />
    </button>
  );
};

export default FloatingOrderButton;