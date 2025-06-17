import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  size: string;
  popular: boolean;
  spicy: boolean;
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const OrderPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState({
    customerName: profile?.full_name || '',
    customerPhone: profile?.phone || '',
    orderDetails: ''
  });

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'sides', name: 'Sides' },
    { id: 'drinks', name: 'Drinks' }
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (profile) {
      setOrderForm(prev => ({
        ...prev,
        customerName: profile.full_name,
        customerPhone: profile.phone
      }));
    }
  }, [profile]);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartItem = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const getItemQuantity = (itemId: number) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Please add items to your cart');
      return;
    }

    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    try {
      const orderDetails = cartItems.map(item => 
        `${item.name} (${item.size}) x${item.quantity} - ${item.price * item.quantity} ETB`
      ).join('\n');

      const { error } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          customer_name: orderForm.customerName,
          customer_phone: orderForm.customerPhone,
          order_details: orderDetails + '\n\nAdditional Details:\n' + orderForm.orderDetails,
          total_amount: totalAmount,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Order successfully created and confirmed!');
      setCartItems([]);
      setOrderForm(prev => ({ ...prev, orderDetails: '' }));
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-gray-800 mb-4">
            Place Your Order
          </h1>
          <p className="font-merriweather text-xl text-gray-600 max-w-2xl mx-auto">
            Select your favorite items and place your order
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex gap-2 mb-2">
                      {item.popular && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      {item.spicy && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          🌶️ Spicy
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
                      {item.name} {item.size && `(${item.size})`}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl text-red-600">
                        {item.price} ETB
                      </span>
                      
                      {getItemQuantity(item.id) > 0 ? (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateCartItem(item.id, getItemQuantity(item.id) - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium text-lg min-w-[2rem] text-center">
                            {getItemQuantity(item.id)}
                          </span>
                          <button
                            onClick={() => updateCartItem(item.id, getItemQuantity(item.id) + 1)}
                            className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <Plus size={16} />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="font-poppins font-bold text-xl text-gray-800 mb-4 flex items-center">
                <ShoppingCart size={20} className="mr-2" />
                Your Order
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Your cart is empty. Add some items to get started!
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">{item.size}</p>
                          <p className="text-red-600 font-semibold">{item.price} ETB x {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-red-600">{totalAmount} ETB</span>
                    </div>
                  </div>

                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={orderForm.customerName}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={orderForm.customerPhone}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Details (Optional)
                      </label>
                      <textarea
                        value={orderForm.orderDetails}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, orderDetails: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        placeholder="Special instructions, delivery address, etc."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Place Order ({totalAmount} ETB)
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderPage;