import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, XCircle, AlertCircle, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  order_details: string;
  total_amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  related_order_id: number | null;
  created_at: string;
}

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'notifications'>('orders');

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchNotifications();
      
      // Set up real-time subscription for order updates
      const orderSubscription = supabase
        .channel('order_updates')
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'orders',
            filter: `customer_id=eq.${user.id}`
          }, 
          (payload) => {
            setOrders(prev => 
              prev.map(order => 
                order.id === payload.new.id ? payload.new as Order : order
              )
            );
            toast.success('Order status updated!');
          }
        )
        .subscribe();

      // Set up real-time subscription for notifications
      const notificationSubscription = supabase
        .channel('notification_updates')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            setNotifications(prev => [payload.new as Notification, ...prev]);
            toast.info('New notification received!');
          }
        )
        .subscribe();

      return () => {
        orderSubscription.unsubscribe();
        notificationSubscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'accepted':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />;
      case 'preparing':
        return <AlertCircle className="text-blue-600" size={20} />;
      case 'ready':
        return <Package className="text-purple-600" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-700" size={20} />;
      default:
        return <Clock className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-200 text-green-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Your order is waiting for confirmation';
      case 'accepted':
        return 'Your order has been accepted and will be prepared soon';
      case 'rejected':
        return 'Your order has been rejected';
      case 'preparing':
        return 'Your order is being prepared';
      case 'ready':
        return 'Your order is ready for pickup/delivery';
      case 'delivered':
        return 'Your order has been delivered';
      default:
        return 'Order status unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
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
              My Orders & Notifications
            </h1>
            <p className="font-merriweather text-xl text-gray-600">
              Track your orders and stay updated with notifications
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              My Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                activeTab === 'notifications'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Bell size={16} className="inline mr-2" />
              Notifications
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <>
              {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Package className="mx-auto text-gray-400 mb-4" size={64} />
                  <h2 className="font-poppins font-semibold text-2xl text-gray-800 mb-2">
                    No Orders Yet
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You haven't placed any orders yet.
                  </p>
                  <button
                    onClick={() => window.location.href = '/order'}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Place Your First Order
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            order.status === 'pending' ? 'bg-yellow-100' :
                            order.status === 'accepted' ? 'bg-green-100' :
                            order.status === 'rejected' ? 'bg-red-100' :
                            order.status === 'preparing' ? 'bg-blue-100' :
                            order.status === 'ready' ? 'bg-purple-100' :
                            'bg-gray-100'
                          }`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <h3 className="font-poppins font-semibold text-lg text-gray-800">
                              Order #{order.id}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </span>
                          <p className="text-lg font-bold text-red-600 mt-1">
                            {order.total_amount} ETB
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                          {getStatusMessage(order.status)}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-800 mb-2">Order Details:</h4>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                            {order.order_details}
                          </pre>
                        </div>

                        {order.admin_notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <h5 className="font-medium text-yellow-800 mb-1">Restaurant Note:</h5>
                            <p className="text-sm text-yellow-700">{order.admin_notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div>
                            <p><strong>Name:</strong> {order.customer_name}</p>
                            <p><strong>Phone:</strong> {order.customer_phone}</p>
                          </div>
                          {order.status === 'ready' && (
                            <div className="text-right">
                              <p className="text-purple-600 font-medium">
                                🎉 Your order is ready!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <>
              {notifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Bell className="mx-auto text-gray-400 mb-4" size={64} />
                  <h2 className="font-poppins font-semibold text-2xl text-gray-800 mb-2">
                    No Notifications
                  </h2>
                  <p className="text-gray-600">
                    You don't have any notifications yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                        !notification.read ? 'border-l-4 border-red-600 bg-red-50' : ''
                      }`}
                      onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-800">{notification.title}</h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">{formatDate(notification.created_at)}</p>
                        </div>
                        {notification.related_order_id && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Order #{notification.related_order_id}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;