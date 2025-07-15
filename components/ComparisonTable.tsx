'use client';

import { useAffiliateTracking } from '@/lib/affiliate-tracking';

export interface ComparisonProduct {
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  affiliateUrl: string;
  rating?: number;
  badge?: string;
  features: Record<string, string | boolean | number>;
  category?: string;
  productId?: string;
}

export interface ComparisonTableProps {
  products: ComparisonProduct[];
  features: Array<{
    key: string;
    label: string;
    type: 'text' | 'boolean' | 'number' | 'price';
  }>;
  source?: string;
}

// Simple comparison table for MDX content
export interface SimpleComparisonProduct {
  name: string;
  price: string;
  capacity?: string;
  weight?: string;
  ports?: string;
  rating?: number;
  pros?: string[];
  cons?: string[];
}

export interface SimpleComparisonTableProps {
  products: SimpleComparisonProduct[];
}

export function ComparisonTable({ products }: SimpleComparisonTableProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-primary-600 my-8 comparison-table">
      <table className="w-full">
        <thead>
          <tr className="bg-primary-700">
            <th className="px-6 py-4 text-left text-sm font-medium text-white">
              Product
            </th>
            <th className="px-6 py-4 text-center text-sm font-medium text-white">
              Price
            </th>
            <th className="px-6 py-4 text-center text-sm font-medium text-white">
              Capacity
            </th>
            <th className="px-6 py-4 text-center text-sm font-medium text-white">
              Weight
            </th>
            <th className="px-6 py-4 text-center text-sm font-medium text-white">
              Ports
            </th>
            <th className="px-6 py-4 text-center text-sm font-medium text-white">
              Rating
            </th>
            <th className="px-6 py-4 text-center text-sm font-medium text-white">
              Pros & Cons
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-600">
          {products.map((product, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-primary-800/20' : 'bg-primary-800/40'}>
              <td className="px-6 py-4 text-sm font-medium text-white">
                {product.name}
              </td>
              <td className="px-6 py-4 text-center text-sm font-bold text-green-400">
                {product.price}
              </td>
              <td className="px-6 py-4 text-center text-sm text-gray-200 font-medium">
                {product.capacity}
              </td>
              <td className="px-6 py-4 text-center text-sm text-gray-200 font-medium">
                {product.weight}
              </td>
              <td className="px-6 py-4 text-center text-sm text-gray-200 font-medium">
                {product.ports}
              </td>
              <td className="px-6 py-4 text-center">
                {product.rating && (
                  <div className="flex justify-center">{renderStars(product.rating)}</div>
                )}
              </td>
              <td className="px-6 py-4 text-xs">
                {product.pros && (
                  <div className="mb-2">
                    <div className="text-green-400 font-semibold mb-1">Pros:</div>
                    <ul className="text-gray-200 space-y-1">
                      {product.pros.map((pro, i) => (
                        <li key={i}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.cons && (
                  <div>
                    <div className="text-red-400 font-semibold mb-1">Cons:</div>
                    <ul className="text-gray-200 space-y-1">
                      {product.cons.map((con, i) => (
                        <li key={i}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdvancedComparisonTable({
  products,
  features,
  source = 'comparison-table',
}: ComparisonTableProps) {
  const { trackClick } = useAffiliateTracking();

  const handleProductClick = (product: ComparisonProduct) => {
    trackClick(
      product.name,
      product.affiliateUrl,
      source,
      product.category || 'product',
      product.price,
      product.productId
    );
  };

  const renderFeatureValue = (
    value: string | boolean | number,
    type: 'text' | 'boolean' | 'number' | 'price'
  ) => {
    switch (type) {
      case 'boolean':
        return value ? (
          <span className="text-green-600">✓</span>
        ) : (
          <span className="text-red-600">✗</span>
        );
      case 'price':
        return <span className="font-semibold text-green-600">{value}</span>;
      case 'number':
        return <span className="font-medium">{value}</span>;
      default:
        return <span>{value}</span>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
              Product
            </th>
            {products.map((product, index) => (
              <th key={index} className="px-6 py-4 text-center min-w-[200px]">
                <div className="flex flex-col items-center">
                  {product.badge && (
                    <div className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mb-2">
                      {product.badge}
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded mb-2"
                  />
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  {product.rating && (
                    <div className="flex mb-2">{renderStars(product.rating)}</div>
                  )}
                  <div className="mb-2">
                    <span className="text-lg font-bold text-green-600">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-1">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {feature.label}
              </td>
              {products.map((product, productIndex) => (
                <td key={productIndex} className="px-6 py-4 text-center text-sm">
                  {renderFeatureValue(product.features[feature.key], feature.type)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-yellow-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              Buy Now
            </td>
            {products.map((product, index) => (
              <td key={index} className="px-6 py-4 text-center">
                <button
                  onClick={() => handleProductClick(product)}
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded text-sm transition-colors duration-200"
                >
                  Check Price
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}