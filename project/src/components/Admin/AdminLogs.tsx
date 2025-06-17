import React, { useState, useEffect } from 'react';
import { Activity, Filter, Calendar, User, FileText, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AdminLog {
  id: number;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  admin_name?: string;
}

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select(`
          *,
          profiles!admin_logs_admin_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const logsWithAdminNames = data?.map(log => ({
        ...log,
        admin_name: log.profiles?.full_name || 'Unknown Admin'
      })) || [];

      setLogs(logsWithAdminNames);
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      toast.error('Failed to load admin logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'user_status_update':
      case 'user_role_update':
      case 'user_profile_update':
        return <User size={16} className="text-blue-600" />;
      case 'order_status_update':
        return <FileText size={16} className="text-green-600" />;
      case 'password_reset':
        return <User size={16} className="text-orange-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getActionDescription = (log: AdminLog) => {
    const { action_type, target_type, target_id, details } = log;
    
    switch (action_type) {
      case 'user_status_update':
        return `Updated user status to "${details.new_status}" for user ${target_id}`;
      case 'user_role_update':
        return `Changed user role to "${details.new_role}" for user ${target_id}`;
      case 'user_profile_update':
        return `Updated profile information for user ${target_id}`;
      case 'order_status_update':
        return `Changed order #${target_id} status from "${details.old_status}" to "${details.new_status}"`;
      case 'password_reset':
        return `Reset password for user ${target_id}`;
      default:
        return `Performed ${action_type} on ${target_type} ${target_id}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.admin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target_id.includes(searchTerm);
    
    const matchesAction = actionFilter === 'all' || log.action_type === actionFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const logDate = new Date(log.created_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesAction && matchesDate;
  });

  const actionTypes = [...new Set(logs.map(log => log.action_type))];

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin logs...</p>
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
              Admin Activity Logs
            </h1>
            <p className="font-merriweather text-xl text-gray-600">
              Track all administrative actions and system changes
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Actions</option>
                {actionTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>

              <div className="flex items-center text-sm text-gray-600">
                <Activity size={16} className="mr-2" />
                {filteredLogs.length} logs found
              </div>
            </div>
          </div>

          {/* Logs List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <Activity className="mx-auto text-gray-400 mb-4" size={64} />
                <h2 className="font-poppins font-semibold text-2xl text-gray-800 mb-2">
                  No Logs Found
                </h2>
                <p className="text-gray-600">
                  No admin activity logs match your current filters.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getActionIcon(log.action_type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {log.admin_name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {formatDate(log.created_at)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">
                          {getActionDescription(log)}
                        </p>
                        
                        {log.details && Object.keys(log.details).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              View Details
                            </summary>
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </details>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Action: {log.action_type}</span>
                          <span>Target: {log.target_type} #{log.target_id}</span>
                          {log.ip_address && <span>IP: {log.ip_address}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogs;