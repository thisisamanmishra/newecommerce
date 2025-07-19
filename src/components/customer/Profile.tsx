import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface ProfileProps {
  onViewChange: (view: string, data?: any) => void;
}

export default function Profile({ onViewChange }: ProfileProps) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <button
            onClick={() => onViewChange('login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  const userOrders = state.orders.filter(order => order.userId === state.user!.id);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    onViewChange('home');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 bg-gray-50 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{state.user.name}</h2>
                <p className="text-gray-600">{state.user.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={state.user.name}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={state.user.email}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={state.user.phone}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                        <input
                          type="text"
                          value={new Date(state.user.createdAt).toLocaleDateString()}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Order History</h3>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">No orders yet</p>
                      <button
                        onClick={() => onViewChange('products')}
                        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold">Order #{order.id}</h4>
                              <p className="text-gray-600">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="font-semibold">${order.finalAmount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Payment Status</p>
                              <p className="font-semibold capitalize">{order.paymentStatus}</p>
                            </div>
                            {order.trackingId && (
                              <div>
                                <p className="text-sm text-gray-600">Tracking ID</p>
                                <p className="font-semibold">{order.trackingId}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.productName}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">
                                  ${((item.discountedPrice || item.price) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h3>
                  {state.user.addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">No addresses saved</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {state.user.addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{address.name}</h4>
                            {address.isDefault && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-gray-600 text-sm">{address.addressLine2}</p>
                          )}
                          <p className="text-gray-600 text-sm">
                            {address.city}, {address.state} {address.pincode}
                          </p>
                          <p className="text-gray-600 text-sm">{address.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h3>
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Your wishlist is empty</p>
                    <button
                      onClick={() => onViewChange('products')}
                      className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Discover Products
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h3>
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Email notifications for orders
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          SMS notifications for delivery
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          Marketing emails
                        </label>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Privacy</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Show profile to other users
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          Allow personalized recommendations
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}