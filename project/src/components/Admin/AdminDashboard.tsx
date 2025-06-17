import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCustomers: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch orders stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status');

      if (ordersError) throw ordersError;

      // Fetch customers count
      const { count: customersCount, error: customersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      if (customersError) throw customersError;

      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setStats({
        totalOrders,
        pendingOrders,
        totalRevenue,
        totalCustomers: customersCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Total Revenue',
      value: `${stats.totalRevenue} ETB`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100'
    }
  ];

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
              Admin Dashboard
            </h1>
            <p className="font-merriweather text-xl text-gray-600">
              Manage your restaurant operations
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`${stat.color.replace('bg-', 'text-')}`} size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="font-poppins font-bold text-2xl text-gray-800 mb-6">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => window.location.href = '/admin/orders'}
                className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors text-center"
              >
                <ShoppingBag className="mx-auto mb-2" size={24} />
                <span className="font-medium">View Orders</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/admin/menu'}
                className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                <TrendingUp className="mx-auto mb-2" size={24} />
                <span className="font-medium">Manage Menu</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/admin/contact'}
                className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                <Users className="mx-auto mb-2" size={24} />
                <span className="font-medium">Edit Contact</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/admin/settings'}
                className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
              >
                <DollarSign className="mx-auto mb-2" size={24} />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;