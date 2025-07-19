import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Wallet, Lock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Address, Order } from '../../types';

interface CheckoutProps {
  onViewChange: (view: string, data?: any) => void;
}

export default function Checkout({ onViewChange }: CheckoutProps) {
  const { state, dispatch } = useApp();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    state.user?.addresses.find(addr => addr.isDefault) || null
  );
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

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

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to proceed with checkout.</p>
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

  if (cartItemsWithDetails.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart before checkout.</p>
          <button
            onClick={() => onViewChange('products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    const order: Order = {
      id: `ORD${Date.now()}`,
      userId: state.user!.id,
      items: cartItemsWithDetails.map(item => ({
        productId: item.productId,
        productName: item.product!.name,
        productImage: item.product!.images[0],
        quantity: item.quantity,
        price: item.product!.price,
        discountedPrice: item.product!.discountedPrice,
      })),
      totalAmount: subtotal,
      discountAmount: 0,
      deliveryCharges,
      finalAmount: total,
      shippingAddress: selectedAddress,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_ORDER', payload: order });
    dispatch({ type: 'CLEAR_CART' });

    // Simulate payment processing
    setTimeout(() => {
      dispatch({ 
        type: 'UPDATE_ORDER', 
        payload: { 
          ...order, 
          status: 'confirmed',
          paymentStatus: 'completed',
          trackingId: `TRK${Date.now()}`
        } 
      });
      onViewChange('order-success', { orderId: order.id });
    }, 2000);
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.addressLine1 || !newAddress.city) {
      alert('Please fill in all required fields');
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      name: newAddress.name!,
      phone: newAddress.phone!,
      addressLine1: newAddress.addressLine1!,
      addressLine2: newAddress.addressLine2 || '',
      city: newAddress.city!,
      state: newAddress.state!,
      pincode: newAddress.pincode!,
      isDefault: state.user!.addresses.length === 0,
    };

    // In a real app, this would update the user in the backend
    setSelectedAddress(address);
    setShowAddressForm(false);
    setNewAddress({
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => onViewChange('cart')}
            className="flex items-center text-blue-600 hover:text-blue-700 mr-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
              
              {state.user.addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {state.user.addresses.map((address) => (
                    <label key={address.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?.id === address.id}
                        onChange={() => setSelectedAddress(address)}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{address.name}</div>
                        <div className="text-gray-600 text-sm">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {address.city}, {address.state} {address.pincode}
                        </div>
                        <div className="text-gray-600 text-sm">{address.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                + Add New Address
              </button>

              {showAddressForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 1 *"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="City *"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="State *"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleAddAddress}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Address
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium">UPI Payment</div>
                    <div className="text-sm text-gray-600">Pay with Google Pay, PhonePe, Paytm</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <CreditCard className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Visa, MasterCard, RuPay</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Wallet className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-medium">Digital Wallet</div>
                    <div className="text-sm text-gray-600">PhonePe Wallet, Amazon Pay</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItemsWithDetails.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-3">
                    <img
                      src={item.product!.images[0]}
                      alt={item.product!.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.product!.name}</div>
                      <div className="text-gray-600 text-xs">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-medium">
                      ${((item.product!.discountedPrice || item.product!.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
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
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddress}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Lock className="w-5 h-5 mr-2" />
                Place Order
              </button>

              <div className="mt-4 text-center text-sm text-gray-600">
                <Lock className="w-4 h-4 inline mr-1" />
                Secure checkout powered by 256-bit SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}