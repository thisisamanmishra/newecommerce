import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/customer/Home';
import ProductList from './components/customer/ProductList';
import ProductDetail from './components/customer/ProductDetail';
import Cart from './components/customer/Cart';
import Checkout from './components/customer/Checkout';
import Auth from './components/customer/Auth';
import Profile from './components/customer/Profile';
import AdminPanel from './components/admin/AdminPanel';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [viewData, setViewData] = useState<any>(null);

  const handleViewChange = (view: string, data?: any) => {
    setCurrentView(view);
    setViewData(data);
    window.scrollTo(0, 0);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home onViewChange={handleViewChange} />;
      case 'products':
        return <ProductList onViewChange={handleViewChange} filterCategory={viewData?.category} />;
      case 'categories':
        return <ProductList onViewChange={handleViewChange} />;
      case 'product':
        return <ProductDetail productId={viewData?.productId} onViewChange={handleViewChange} />;
      case 'cart':
        return <Cart onViewChange={handleViewChange} />;
      case 'checkout':
        return <Checkout onViewChange={handleViewChange} />;
      case 'login':
        return <Auth onViewChange={handleViewChange} />;
      case 'profile':
        return <Profile onViewChange={handleViewChange} />;
      case 'admin':
        return <AdminPanel onViewChange={handleViewChange} />;
      case 'order-success':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your order #{viewData?.orderId} has been confirmed. You will receive a confirmation email shortly.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleViewChange('profile')}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Track Order
                </button>
                <button
                  onClick={() => handleViewChange('home')}
                  className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Home onViewChange={handleViewChange} />;
    }
  };

  const showHeaderFooter = !['admin'].includes(currentView);

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        {showHeaderFooter && (
          <Header currentView={currentView} onViewChange={handleViewChange} />
        )}
        
        <main>
          {renderCurrentView()}
        </main>
        
        {showHeaderFooter && <Footer />}
      </div>
    </AppProvider>
  );
}

export default App;