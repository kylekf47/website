import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, User, Phone, Calendar, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Order {
  id: number;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  order_details: string;
  total_amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  admin_notes: string;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'delivered'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
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

  const updateOrderStatus = async (orderId: number, status: Order['status'], notes: string = '') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          admin_notes: notes,
          processed_by: user?.id,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { 
                ...order, 
                status, 
                admin_notes: notes,
                processed_by: user?.id || null,
                processed_at: new Date().toISOString(),
                updated_at: new Date().toISOString() 
              }
            : order
        )
      );

      // Create notification for customer
      const order = orders.find(o => o.id === orderId);
      if (order) {
        await supabase.rpc('create_notification', {
          p_user_id: order.customer_id,
          p_title: 'Order Status Updated',
          p_message: `Your order #${orderId} has been ${status}. ${notes ? `Note: ${notes}` : ''}`,
          p_type: status === 'accepted' ? 'success' : status === 'rejected' ? 'error' : 'info',
          p_order_id: orderId
        });
      }

      toast.success(`Order ${status} successfully!`);
      setSelectedOrder(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-poppins font-bold text-4xl md:text-5xl text-gray-800 mb-4">
              Manage Orders
            </h1>
            <p className="font-merriweather text-xl text-gray-600">
              Accept, reject, and track customer orders
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="bg-white rounded-lg shadow-md p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(status as Order['status'])}
                </div>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{status}</p>
              </div>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { id: 'all', label: 'All Orders', count: orders.length },
              { id: 'pending', label: 'Pending', count: statusCounts.pending },
              { id: 'accepted', label: 'Accepted', count: statusCounts.accepted },
              { id: 'preparing', label: 'Preparing', count: statusCounts.preparing },
              { id: 'ready', label: 'Ready', count: statusCounts.ready },
              { id: 'delivered', label: 'Delivered', count: statusCounts.delivered },
              { id: 'rejected', label: 'Rejected', count: statusCounts.rejected }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  filter === filterOption.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package className="mx-auto text-gray-400 mb-4" size={64} />
              <h2 className="font-poppins font-semibold text-2xl text-gray-800 mb-2">
                No Orders Found
              </h2>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No orders have been placed yet.'
                  : `No ${filter} orders found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
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
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar size={14} className="mr-1" />
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

                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <User size={16} className="mr-2" />
                        Customer Information
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p><strong>Name:</strong> {order.customer_name}</p>
                        <p className="flex items-center">
                          <Phone size={14} className="mr-1" />
                          <strong>Phone:</strong> {order.customer_phone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Order Details</h4>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                          {order.order_details}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {order.admin_notes && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Admin Notes</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">{order.admin_notes}</p>
                      </div>
                    </div>
                  )}

                  {order.processed_at && (
                    <div className="mb-4 text-sm text-gray-600">
                      <p>Processed on: {formatDate(order.processed_at)}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setAdminNotes('');
                          }}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle size={16} />
                          <span>Accept Order</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setAdminNotes('');
                          }}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <XCircle size={16} />
                          <span>Reject Order</span>
                        </button>
                      </>
                    )}
                    
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <AlertCircle size={16} />
                        <span>Start Preparing</span>
                      </button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <Package size={16} />
                        <span>Mark as Ready</span>
                      </button>
                    )}
                    
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors flex items-center space-x-2"
                      >
                        <CheckCircle size={16} />
                        <span>Mark as Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Action Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="font-poppins font-bold text-xl text-gray-800 mb-4">
                  Order #{selectedOrder.id} - Action Required
                </h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Add any notes for the customer..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'accepted', adminNotes)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle size={16} />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'rejected', adminNotes)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setAdminNotes('');
                    }}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageOrders;