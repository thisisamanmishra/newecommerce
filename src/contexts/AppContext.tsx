import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';

interface AppContextType {
  auth: ReturnType<typeof useAuth>;
  products: ReturnType<typeof useProducts>;
  cart: ReturnType<typeof useCart>;
  orders: ReturnType<typeof useOrders>;
}

const AppContext = createContext<AppContextType | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const products = useProducts();
  const cart = useCart();
  const orders = useOrders();

  const value = {
    auth,
    products,
    cart,
    orders,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}