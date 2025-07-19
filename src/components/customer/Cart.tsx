import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface CartProps {
  onViewChange: (view: string, data?: any) => void;
}

export default function Cart({ onViewChange }: CartProps) {
  const { state, dispatch } = useApp();

  const cartItemsWithDetails = state.cart.map(cartItem => {
    const product = state.products.find(p => p.id === cartItem.productId);
    return { ...cartItem, product };
  }).filter(item => item.product);

  const subtotal = cartItemsWithDetails.reduce((total, item) => {
    const price = item.product!.discountedPrice || item.product!.price;
    return total + (price * item.quantity);
  }, 0);

  const deliveryCharges = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + deliveryCharges;

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, quantity: newQuantity } });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  if (cartItemsWithDetails.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some amazing products to get started!</p>
          <button
            onClick={() => onViewChange('products')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cartItemsWithDetails.map((item) => {
                const product = item.product!;
                const price = product.discountedPrice || product.price;
                
                return (
                  <div key={item.productId} className="p-6 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                          onClick={() => onViewChange('product', { productId: product.id })}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => onViewChange('product', { productId: product.id })}
                        >
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{product.category}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                          {/* Price */}
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${price}
                            </span>
                            {product.discountedPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.price}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-700 transition-colors p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="mt-2 text-right">
                          <span className="text-lg font-semibold text-gray-900">
                            ${(price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">
                    {deliveryCharges === 0 ? 'Free' : `$${deliveryCharges.toFixed(2)}`}
                  </span>
                </div>
                
                {subtotal < 50 && (
                  <p className="text-sm text-green-600">
                    Add ${(50 - subtotal).toFixed(2)} more for free delivery!
                  </p>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onViewChange('checkout')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>

              <button
                onClick={() => onViewChange('products')}
                className="w-full mt-4 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}