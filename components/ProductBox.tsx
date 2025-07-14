'use client';

import { useAffiliateTracking } from '@/lib/affiliate-tracking';

export interface ProductBoxProps {
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  features: string[];
  affiliateUrl: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  source?: string;
  category?: string;
  productId?: string;
}

export default function ProductBox({
  name,
  price,
  originalPrice,
  image,
  features,
  affiliateUrl,
  rating = 0,
  reviewCount = 0,
  badge,
  source = 'product-box',
  category = 'product',
  productId,
}: ProductBoxProps) {
  const { trackClick } = useAffiliateTracking();

  const handleClick = () => {
    trackClick(name, affiliateUrl, source, category, price, productId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 max-w-sm">
      {badge && (
        <div className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mb-4">
          {badge}
        </div>
      )}
      
      <div className="text-center mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
        
        {rating > 0 && (
          <div className="flex items-center justify-center mb-2">
            <div className="flex">{renderStars(rating)}</div>
            {reviewCount > 0 && (
              <span className="text-sm text-gray-500 ml-2">({reviewCount} reviews)</span>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-green-600">{price}</span>
          {originalPrice && (
            <span className="text-lg text-gray-500 line-through ml-2">{originalPrice}</span>
          )}
        </div>
      </div>

      <ul className="text-sm text-gray-600 mb-6 space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md text-center transition-colors duration-200"
      >
        Check Price on Amazon
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-2">
        *Price may vary. Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}