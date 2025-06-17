import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface MenuItem {
  id?: number;
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

const ManageMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'sides', name: 'Sides' },
    { id: 'drinks', name: 'Drinks' }
  ];

  const initialFormData: MenuItem = {
    name: '',
    description: '',
    price: 0,
    category: 'pizza',
    image_url: '',
    size: 'Regular',
    popular: false,
    spicy: false,
    available: true
  };

  const [formData, setFormData] = useState<MenuItem>(initialFormData);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Menu item updated successfully!');
      } else {
        // Create new item
        const { error } = await supabase
          .from('menu_items')
          .insert(formData);

        if (error) throw error;
        toast.success('Menu item created successfully!');
      }

      await fetchMenuItems();
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success('Menu item deleted successfully!');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl text-gray-800 mb-4">
              Manage Menu
            </h1>
            <p className="font-merriweather text-xl text-gray-600">
              Add, edit, and manage your restaurant menu items
            </p>
          </div>

          {/* Add New Item Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add New Menu Item</span>
            </button>
          </div>

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

          {/* Menu Items Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    {!item.available && (
                      <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
                    {item.name} {item.size && `(${item.size})`}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-xl text-red-600">
                      {item.price} ETB
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="font-poppins font-bold text-2xl text-gray-800">
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter item name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (ETB) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter item description"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="pizza">Pizza</option>
                        <option value="burgers">Burgers</option>
                        <option value="sides">Sides</option>
                        <option value="drinks">Drinks</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                      </label>
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        placeholder="e.g., Regular, Large"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="popular"
                          checked={formData.popular}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Popular Item</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="spicy"
                          checked={formData.spicy}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Spicy</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="available"
                          checked={formData.available}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Available</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save size={18} />
                      <span>{editingItem ? 'Update Item' : 'Add Item'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageMenu;