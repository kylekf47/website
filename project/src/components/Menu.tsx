import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Filter, X } from 'lucide-react';
import Cart from './Cart';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  spicy?: boolean;
}

interface MenuProps {
  cartItems: any[];
  addToCart: (item: MenuItem) => void;
  updateCartItem: (id: number, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ cartItems, addToCart, updateCartItem }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'sides', name: 'Sides' },
    { id: 'drinks', name: 'Drinks' }
  ];

  const menuItems: MenuItem[] = [
    // Pizzas
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomato sauce, basil, olive oil',
      price: 280,
      category: 'pizza',
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      popular: true
    },
    {
      id: 2,
      name: 'Pepperoni Pizza',
      description: 'Spicy pepperoni, mozzarella cheese, tomato sauce',
      price: 320,
      category: 'pizza',
      image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400',
      popular: true
    }, 
    {
      id: 3,
      name: 'Ethiopian Special Pizza',
      description: 'Local spices, berbere sauce, cheese, vegetables',
      price: 350,
      category: 'pizza',
      image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400',
      spicy: true
    },
    {
      id: 4,
      name: 'Veggie Supreme Pizza',
      description: 'Bell peppers, mushrooms, onions, olives, cheese',
      price: 300,
      category: 'pizza',
      image: 'https://images.pexels.com/photos/1552635/pexels-photo-1552635.jpeg?auto=compress&cs=tinysrgb&w=400'
    },

    // Burgers
    {
      id: 5,
      name: 'Classic Beef Burger',
      description: 'Beef patty, lettuce, tomato, onion, cheese, special sauce',
      price: 220,
      category: 'burgers',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
      popular: true
    },
    {
      id: 6,
      name: 'Chicken Burger',
      description: 'Grilled chicken breast, avocado, lettuce, mayo',
      price: 200,
      category: 'burgers',
      image: 'https://images.pexels.com/photos/552056/pexels-photo-552056.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 7,
      name: 'Veggie Burger',
      description: 'Plant-based patty, fresh vegetables, vegan sauce',
      price: 180,
      category: 'burgers',
      image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 8,
      name: 'BBQ Bacon Burger',
      description: 'Beef patty, bacon, BBQ sauce, onion rings, cheese',
      price: 280,
      category: 'burgers',
      image: 'https://images.pexels.com/photos/3738755/pexels-photo-3738755.jpeg?auto=compress&cs=tinysrgb&w=400'
    },

    // Sides
    {
      id: 9,
      name: 'French Fries',
      description: 'Golden crispy fries with seasoning',
      price: 60,
      category: 'sides',
      image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 10,
      name: 'Mozzarella Sticks',
      description: 'Breaded mozzarella with marinara sauce',
      price: 80,
      category: 'sides',
      image: 'https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 11,
      name: 'Chicken Wings',
      description: 'Spicy buffalo wings with ranch dip',
      price: 120,
      category: 'sides',
      image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400',
      spicy: true
    },

    // Drinks
    {
      id: 12,
      name: 'Ethiopian Coffee',
      description: 'Traditional Ethiopian coffee ceremony style',
      price: 40,
      category: 'drinks',
      image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 13,
      name: 'Fresh Juice',
      description: 'Orange, mango, or mixed fruit juice',
      price: 50,
      category: 'drinks',
      image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 14,
      name: 'Soft Drinks',
      description: 'Coca-Cola, Sprite, Fanta, or local beverages',
      price: 30,
      category: 'drinks',
      image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 15,
      name: 'Soft Drinks',
      description: 'Coca-Cola, Sprite, Fanta, or local beverages',
      price: 30,
      category: 'drinks',
  
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const getItemQuantity = (itemId: number) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-poppins font-bold text-4xl md:text-5xl text-gray-800 mb-4">
            Our Menu
          </h1>
          <p className="font-merriweather text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our selection of handcrafted pizzas, gourmet burgers, and delicious sides
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
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
              </div>

              <div className="p-4">
                <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
                  {item.name}
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

        {/* Floating Cart Button */}
        {totalCartItems > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center space-x-2 z-40"
          >
            <ShoppingCart size={20} />
            <span className="font-medium">Cart ({totalCartItems})</span>
          </button>
        )}

        {/* Cart Modal */}
        {showCart && (
          <Cart
            cartItems={cartItems}
            updateCartItem={updateCartItem}
            onClose={() => setShowCart(false)}
          />
        )}
      </div>
    </section>
  );
};

export default Menu;