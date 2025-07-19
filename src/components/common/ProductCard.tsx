import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface ProductCardProps {
  product: Product;
  onViewProduct: (productId: string) => void;
}

export default function ProductCard({ product, onViewProduct }: ProductCardProps) {
  const { dispatch } = useApp();

  const discountPercentage = product.discountedPrice 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_TO_CART',
      payload: { productId: product.id, quantity: 1 }
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => onViewProduct(product.id)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.discountedPrice ? (
              <>
                <span className="text-xl font-bold text-green-600">
                  ${product.discountedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>
          
          <span className={`text-sm px-2 py-1 rounded-full ${
            product.stock > 10 
              ? 'bg-green-100 text-green-800'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
}