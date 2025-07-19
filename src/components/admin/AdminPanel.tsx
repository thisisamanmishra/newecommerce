import React, { useState } from 'react';
import { BarChart3, Package, Users, ShoppingCart, Settings, LogOut, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';

interface AdminPanelProps {
  onViewChange: (view: string) => void;
}

export default function AdminPanel({ onViewChange }: AdminPanelProps) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!state.user || state.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this area.</p>
          <button
            onClick={() => onViewChange('home')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    onViewChange('home');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">{state.user.name}</p>
          </div>

          <nav className="p-6 space-y-2">
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
            
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={() => onViewChange('home')}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-2"
              >
                <Package className="w-5 h-5" />
                <span>View Store</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Settings</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}