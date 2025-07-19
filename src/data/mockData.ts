import { Product, User, Order, Review, Category } from '../types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
  },
  {
    id: '2',
    name: 'Fashion',
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
  },
  {
    id: '3',
    name: 'Home & Garden',
    image: 'https://images.pexels.com/photos/245208/pexels-photo-245208.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
  },
  {
    id: '4',
    name: 'Sports',
    image: 'https://images.pexels.com/photos/163444/sport-treadmill-tor-route-163444.jpeg?auto=compress&cs=tinysrgb&w=300',
    isActive: true,
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 299.99,
    discountedPrice: 249.99,
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    category: 'Electronics',
    tags: ['wireless', 'audio', 'premium'],
    stock: 50,
    rating: 4.8,
    reviewCount: 127,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor, GPS, and 7-day battery life. Track your fitness goals effectively.',
    price: 199.99,
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    category: 'Electronics',
    tags: ['fitness', 'smart', 'wearable'],
    stock: 75,
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    name: 'Designer Leather Jacket',
    description: 'Premium leather jacket with modern cut and exceptional comfort. Made from genuine leather with attention to detail.',
    price: 349.99,
    discountedPrice: 279.99,
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    category: 'Fashion',
    tags: ['leather', 'designer', 'jacket'],
    stock: 25,
    rating: 4.9,
    reviewCount: 56,
    isActive: true,
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: '4',
    name: 'Modern Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe and built-in grinder. Make perfect coffee every morning.',
    price: 159.99,
    images: [
      'https://images.pexels.com/photos/4226924/pexels-photo-4226924.jpeg?auto=compress&cs=tinysrgb&w=500',
    ],
    category: 'Home & Garden',
    tags: ['coffee', 'kitchen', 'appliance'],
    stock: 40,
    rating: 4.4,
    reviewCount: 203,
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'customer',
    addresses: [
      {
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        addressLine1: '123 Main Street',
        addressLine2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        isDefault: true,
      }
    ],
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1234567891',
    role: 'admin',
    addresses: [],
    createdAt: '2024-01-01T10:00:00Z',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    userId: '1',
    items: [
      {
        productId: '1',
        productName: 'Premium Wireless Headphones',
        productImage: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
        quantity: 1,
        price: 299.99,
        discountedPrice: 249.99,
      }
    ],
    totalAmount: 299.99,
    discountAmount: 50,
    deliveryCharges: 9.99,
    finalAmount: 259.98,
    shippingAddress: {
      id: '1',
      name: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      isDefault: true,
    },
    status: 'shipped',
    paymentStatus: 'completed',
    paymentMethod: 'UPI',
    trackingId: 'DEL123456789',
    createdAt: '2024-01-15T10:00:00Z',
  },
];

export const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: '1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Amazing sound quality and comfortable to wear for long periods. Highly recommended!',
    createdAt: '2024-01-20T10:00:00Z',
    isApproved: true,
  },
];