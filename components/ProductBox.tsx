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
    <div className="rounded-2xl shadow-soft border border-primary-600 p-6 max-w-sm hover:shadow-medium transition-all duration-300 animate-fade-in product-box">
      {badge && (
        <div className="inline-flex items-center bg-gradient-to-r from-warning-500 to-warning-600 text-white text-xs px-3 py-1.5 rounded-full mb-4 font-medium">
          {badge}
        </div>
      )}
      
      <div className="text-center mb-6">
        <div className="relative overflow-hidden rounded-xl mb-4 bg-primary-50">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <h3 className="text-lg font-semibold text-primary-800 mb-3 leading-tight">{name}</h3>
        
        {rating > 0 && (
          <div className="flex items-center justify-center mb-3">
            <div className="flex">{renderStars(rating)}</div>
            {reviewCount > 0 && (
              <span className="text-sm text-primary-500 ml-2">({reviewCount} reviews)</span>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl font-bold text-success-600">{price}</span>
          {originalPrice && (
            <span className="text-lg text-primary-500 line-through ml-3">{originalPrice}</span>
          )}
        </div>
      </div>

      <ul className="text-sm text-primary-600 mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-success-500 mr-3 mt-0.5 text-base">✓</span>
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        className="block w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold py-3.5 px-4 rounded-xl text-center transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-soft hover:shadow-medium"
      >
        Check Price on Amazon
      </button>
      
      <p className="text-xs text-primary-500 text-center mt-3 leading-relaxed">
        *Price may vary. Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}