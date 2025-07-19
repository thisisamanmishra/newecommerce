import React, { useState } from 'react';
import { Search, Filter, Package, Truck, Check, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function OrderManagement() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = state.orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      const updatedOrder = { ...order, status: newStatus as any };
      if (newStatus === 'delivered') {
        updatedOrder.deliveredAt = new Date().toISOString();
      }
      dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <div className="text-gray-600">
          {filteredOrders.length} orders
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      {order.trackingId && (
                        <div className="text-xs text-blue-600">
                          Tracking: {order.trackingId}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.shippingAddress.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingAddress.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${order.finalAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        {order.paymentMethod.toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`border rounded-lg px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        disabled={order.status !== 'pending'}
                        className="text-green-600 hover:text-green-900 disabled:text-gray-400 transition-colors"
                        title="Confirm Order"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        disabled={!['confirmed', 'processing'].includes(order.status)}
                        className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 transition-colors"
                        title="Mark as Shipped"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        disabled={['delivered', 'cancelled'].includes(order.status)}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400 transition-colors"
                        title="Cancel Order"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusOptions.map(status => {
          const count = state.orders.filter(order => order.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className={`text-2xl font-bold ${getStatusColor(status).split(' ')[1]}`}>
                {count}
              </div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}