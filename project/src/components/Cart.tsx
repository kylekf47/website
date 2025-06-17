import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  cartItems: CartItem[];
  updateCartItem: (id: number, quantity: number) => void;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, updateCartItem, onClose }) => {
  const [showPayment, setShowPayment] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    setShowPayment(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="font-poppins font-bold text-2xl text-gray-800 flex items-center space-x-2">
              <ShoppingCart size={24} />
              <span>Your Order</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto max-h-96 p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 text-lg">Your cart is empty</p>
                <p className="text-gray-500">Add some delicious items to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-red-600 font-semibold">{item.price} ETB</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium text-lg min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {(item.price * item.quantity)} ETB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{subtotal} ETB</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'Free' : `${deliveryFee} ETB`}</span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-green-600 text-sm">🎉 Free delivery on orders over 500 ETB!</p>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>{total} ETB</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard size={20} />
                <span>Proceed to Checkout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          total={total}
          cartItems={cartItems}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            setShowPayment(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default Cart;