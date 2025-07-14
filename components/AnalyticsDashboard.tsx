'use client';

import { useState, useEffect } from 'react';
import { getAffiliateStats, exportAffiliateData, clearOldAffiliateData } from '@/lib/affiliate-tracking';
import type { AffiliateStats } from '@/lib/affiliate-tracking';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = () => {
    setIsLoading(true);
    try {
      const affiliateStats = getAffiliateStats(timeRange);
      setStats(affiliateStats);
    } catch (error) {
      console.error('Error loading affiliate stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const csvData = exportAffiliateData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-clicks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClearOldData = () => {
    if (confirm('Are you sure you want to clear data older than 30 days?')) {
      clearOldAffiliateData(30);
      loadStats();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8 text-gray-500">
        No affiliate data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Affiliate Analytics</h2>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            Export CSV
          </button>
          <button
            onClick={handleClearOldData}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
          >
            Clear Old Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.totalClicks}</div>
          <div className="text-sm text-gray-600">Total Clicks</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {Object.keys(stats.clicksByProduct).length}
          </div>
          <div className="text-sm text-gray-600">Products Clicked</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(stats.clicksByCategory).length}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {Object.keys(stats.clicksBySource).length}
          </div>
          <div className="text-sm text-gray-600">Traffic Sources</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {stats.topProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-500">{product.category}</div>
                </div>
                <div className="text-sm font-semibold text-blue-600">
                  {product.clicks} clicks
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clicks by Category</h3>
          <div className="space-y-3">
            {Object.entries(stats.clicksByCategory)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([category, clicks], index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {category.replace('-', ' ')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(clicks / stats.totalClicks) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-blue-600">
                      {clicks}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.clicksBySource)
            .sort(([, a], [, b]) => b - a)
            .map(([source, clicks], index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{clicks}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {source.replace('-', ' ')}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Top performing product: {stats.topProducts[0]?.name}
              </div>
              <div className="text-xs text-gray-500">
                {stats.topProducts[0]?.clicks} clicks - consider creating more content around this product
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Most popular category: {Object.entries(stats.clicksByCategory).sort(([, a], [, b]) => b - a)[0]?.[0]}
              </div>
              <div className="text-xs text-gray-500">
                Focus on creating more content in this category
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Best traffic source: {Object.entries(stats.clicksBySource).sort(([, a], [, b]) => b - a)[0]?.[0]}
              </div>
              <div className="text-xs text-gray-500">
                Optimize this source for better performance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}