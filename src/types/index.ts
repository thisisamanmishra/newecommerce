export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  deliveryCharges: number;
  finalAmount: number;
  shippingAddress: Address;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  trackingId?: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  isActive: boolean;
}