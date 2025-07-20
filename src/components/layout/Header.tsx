import React from 'react';
import { Search, ShoppingCart, User, Menu, Heart, Package } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  cartItemsCount?: number;
  isAuthenticated?: boolean;
  userRole?: 'customer' | 'admin';
  onAuthClick?: () => void;
  onCartClick?: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({
  currentView,
  onViewChange,
  cartItemsCount = 0,
  isAuthenticated = false,
  userRole = 'customer',
  onAuthClick,
  onCartClick,
  onSearch
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'products', label: 'Products', icon: null },
    { id: 'categories', label: 'Categories', icon: null },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onViewChange('home')}
              className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Package className="w-8 h-8" />
              <span>ShopHub</span>
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            {isAuthenticated && userRole === 'customer' && (
              <button
                onClick={() => onViewChange('wishlist')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Heart className="w-6 h-6" />
              </button>
            )}

            {/* Cart */}
            {userRole === 'customer' && (
              <button
                onClick={onCartClick || (() => onViewChange('cart'))}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            <button
              onClick={onAuthClick || (() => onViewChange(isAuthenticated ? 'profile' : 'auth'))}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="hidden sm:block text-sm">
                {isAuthenticated ? 'Profile' : 'Sign In'}
              </span>
            </button>

            {/* Admin Panel Access */}
            {isAuthenticated && userRole === 'admin' && (
              <button
                onClick={() => onViewChange('admin')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Admin
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}