import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  total: number;
  cartItems: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ total, cartItems, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'telebirr',
      name: 'TeleBirr',
      icon: Smartphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      account: '0911234567'
    },
    {
      id: 'abysinia',
      name: 'Abysinia Bank',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      account: '1234567890123'
    },
    {
      id: 'cbe',
      name: 'Commercial Bank of Ethiopia',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      account: '1000123456789'
    }
  ];

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);
    }, 2000);
  };

  if (orderSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-poppins font-bold text-2xl text-gray-800 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We'll start preparing your delicious meal right away!
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">Estimated delivery time:</p>
            <p className="font-semibold text-lg text-red-600">30-45 minutes</p>
          </div>
          <p className="text-sm text-gray-500">
            You'll receive SMS updates about your order status.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-poppins font-bold text-2xl text-gray-800">
            Payment & Checkout
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{item.price * item.quantity} ETB</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-600">{total} ETB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Choose Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-12 rounded-lg ${method.bgColor} flex items-center justify-center mr-4`}>
                    <method.icon className={method.color} size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{method.name}</p>
                    <p className="text-sm text-gray-600">Account: {method.account}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id
                      ? 'border-red-600 bg-red-600'
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === method.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          {selectedMethod && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Payment Instructions</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Transfer {total} ETB to {selectedMethod.name}</li>
                <li>Account Number: <span className="font-mono font-semibold">{selectedMethod.account}</span></li>
                <li>Account Name: <span className="font-semibold">Roha Restaurant</span></li>
                <li>Include your phone number in the transfer reference</li>
                <li>Click 'Confirm Payment' below after completing the transfer</li>
              </ol>
            </div>
          )}

          {/* Delivery Information */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Delivery Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="0911234567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 h-20"
                  placeholder="Enter your complete delivery address"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 h-16"
                  placeholder="Any special requests or delivery instructions"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Confirm Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <CreditCard size={20} />
                <span>Confirm Payment ({total} ETB)</span>
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              By confirming your payment, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;