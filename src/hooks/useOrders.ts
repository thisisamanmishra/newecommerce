import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { phonePeService } from '../services/phonepe';
import { delhiveryService } from '../services/delhivery';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  shipping_amount: number;
  discount_amount: number;
  tax_amount: number;
  shipping_address: any;
  billing_address: any | null;
  payment_method: string | null;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id: string | null;
  delivery_partner: string | null;
  tracking_id: string | null;
  awb_number: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_snapshot: any;
  product?: {
    id: string;
    name: string;
    images: string[];
  };
}

export interface Address {
  id?: string;
  user_id?: string;
  type?: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchAddresses();
    } else {
      setOrders([]);
      setAddresses([]);
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(id, name, images)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;

      setAddresses(data || []);
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
    }
  };

  const createOrder = async (
    cartItems: any[],
    shippingAddress: Address,
    paymentMethod: string = 'phonepe'
  ) => {
    if (!user) return { success: false, error: 'Please login' };

    try {
      setLoading(true);

      // Calculate totals
      const subtotal = cartItems.reduce((total, item) => {
        const price = item.product?.original_price || item.product?.price || 0;
        return total + (price * item.quantity);
      }, 0);

      const shippingAmount = subtotal > 50 ? 0 : 9.99;
      const taxAmount = subtotal * 0.18; // 18% GST
      const totalAmount = subtotal + shippingAmount + taxAmount;

      // Generate order number
      const orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: totalAmount,
          shipping_amount: shippingAmount,
          discount_amount: 0,
          tax_amount: taxAmount,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.product?.original_price || item.product?.price || 0,
        total_price: (item.product?.original_price || item.product?.price || 0) * item.quantity,
        product_snapshot: {
          name: item.product?.name,
          images: item.product?.images,
          price: item.product?.price,
          original_price: item.product?.original_price,
        },
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initiate payment
      if (paymentMethod === 'phonepe') {
        const paymentResult = await phonePeService.initiatePayment(
          totalAmount,
          order.id,
          user.id,
          shippingAddress.phone
        );

        if (paymentResult.success && paymentResult.data?.paymentUrl) {
          // Redirect to payment page
          window.location.href = paymentResult.data.paymentUrl;
          return { success: true, data: { order, paymentUrl: paymentResult.data.paymentUrl } };
        } else {
          throw new Error(paymentResult.error || 'Payment initiation failed');
        }
      }

      await fetchOrders();
      return { success: true, data: { order } };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          ...(status === 'delivered' && { delivered_at: new Date().toISOString() })
        })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const processShipment = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');

      // Calculate total weight and dimensions
      const totalWeight = order.order_items?.reduce((weight, item) => {
        return weight + (item.quantity * 0.5); // Assume 0.5kg per item
      }, 0) || 1;

      const products = order.order_items?.map(item => ({
        name: item.product_snapshot?.name || 'Product',
        quantity: item.quantity,
        hsn: '1234'
      })) || [];

      // Create shipment with Delhivery
      const shipmentResult = await delhiveryService.createShipment({
        orderId: order.order_number,
        customerName: order.shipping_address.full_name,
        customerAddress: `${order.shipping_address.address_line_1}, ${order.shipping_address.address_line_2 || ''}`,
        customerCity: order.shipping_address.city,
        customerState: order.shipping_address.state,
        customerPincode: order.shipping_address.pincode,
        customerPhone: order.shipping_address.phone,
        codAmount: order.payment_status === 'pending' ? order.total_amount : 0,
        totalAmount: order.total_amount,
        weight: totalWeight,
        dimensions: { length: 30, width: 20, height: 10 },
        products,
      });

      if (shipmentResult.success) {
        // Update order with tracking information
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'shipped',
            delivery_partner: 'Delhivery',
            awb_number: shipmentResult.data?.awbNumber,
            tracking_id: shipmentResult.data?.trackingId,
            estimated_delivery: shipmentResult.data?.estimatedDelivery,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (error) throw error;

        await fetchOrders();
        return { success: true, data: shipmentResult.data };
      } else {
        throw new Error(shipmentResult.error || 'Shipment creation failed');
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const trackOrder = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order?.awb_number) {
        throw new Error('No tracking information available');
      }

      const trackingResult = await delhiveryService.trackShipment(order.awb_number);
      
      if (trackingResult.success) {
        return { success: true, data: trackingResult.data };
      } else {
        throw new Error(trackingResult.error || 'Tracking failed');
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const addAddress = async (address: Omit<Address, 'id' | 'user_id'>) => {
    if (!user) return { success: false, error: 'Please login' };

    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          ...address,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAddresses();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateAddress = async (addressId: string, updates: Partial<Address>) => {
    if (!user) return { success: false, error: 'Please login' };

    try {
      const { error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchAddresses();
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!user) return { success: false, error: 'Please login' };

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchAddresses();
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    orders,
    addresses,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    processShipment,
    trackOrder,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchOrders,
    fetchAddresses,
  };
}