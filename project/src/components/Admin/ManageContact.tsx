import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface ContactInfo {
  id?: number;
  phone: string;
  email: string;
  address: string;
  map_embed_url: string;
  whatsapp_number: string;
}

const ManageContact: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    map_embed_url: '',
    whatsapp_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      toast.error('Failed to load contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        ...contactInfo,
        updated_at: new Date().toISOString()
      };

      if (contactInfo.id) {
        // Update existing record
        const { error } = await supabase
          .from('contact_info')
          .update(updateData)
          .eq('id', contactInfo.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('contact_info')
          .insert(updateData)
          .select()
          .single();

        if (error) throw error;
        setContactInfo(data);
      }

      toast.success('Contact information updated successfully!');
    } catch (error) {
      console.error('Error updating contact info:', error);
      toast.error('Failed to update contact information');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl text-gray-800 mb-4">
              Manage Contact Information
            </h1>
            <p className="font-merriweather text-xl text-gray-600">
              Update your restaurant's contact details
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="+251953037583"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="rohaburgerandpizza@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Address *
                </label>
                <textarea
                  name="address"
                  value={contactInfo.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Bole Road, Near Atlas Hotel, Addis Ababa, Ethiopia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle size={16} className="inline mr-2" />
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={contactInfo.whatsapp_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="+251953037583"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This number will be used for WhatsApp chat links
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Google Maps Embed URL
                </label>
                <input
                  type="url"
                  name="map_embed_url"
                  value={contactInfo.map_embed_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="https://maps.google.com/?q=Your+Location"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter a Google Maps URL for your restaurant location
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Preview</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="text-red-600" size={18} />
                    <span>{contactInfo.phone || 'Phone number not set'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-red-600" size={18} />
                    <span>{contactInfo.email || 'Email not set'}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-red-600 mt-1" size={18} />
                    <span>{contactInfo.address || 'Address not set'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="text-red-600" size={18} />
                    <span>{contactInfo.whatsapp_number || 'WhatsApp number not set'}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Contact Information'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageContact;