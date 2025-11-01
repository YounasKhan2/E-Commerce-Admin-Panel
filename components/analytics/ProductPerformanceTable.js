'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import Badge from '@/components/ui/Badge';

export default function ProductPerformanceTable({ 
  data, 
  loading, 
  categories,
  onCategoryFilter 
}) {
  const [sortField, setSortField] = useState('revenue');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (!data) return;

    // Filter by category
    let filtered = data;
    if (selectedCategory !== 'all') {
      filtered = data.filter(item => item.categoryId === selectedCategory);
    }

    // Sort data
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setSortedData(sorted);
  }, [data, sortField, sortDirection, selectedCategory]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (onCategoryFilter) {
      onCategoryFilter(value);
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return 'trending_up';
    if (trend === 'down') return 'trending_down';
    return 'trending_flat';
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-slate-400';
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <span className="material-symbols-outlined text-slate-600 text-sm">unfold_more</span>;
    }
    return (
      <span className="material-symbols-outlined text-primary text-sm">
        {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
      </span>
    );
  };

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-slate-400 text-sm">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-background-dark border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Categories</option>
          {categories && categories.map((category) => (
            <option key={category.$id} value={category.$id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                Product
              </th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                Category
              </th>
              <th 
                className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('unitsSold')}
              >
                <div className="flex items-center justify-end gap-1">
                  Units Sold
                  <SortIcon field="unitsSold" />
                </div>
              </th>
              <th 
                className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center justify-end gap-1">
                  Revenue
                  <SortIcon field="revenue" />
                </div>
              </th>
              <th 
                className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('turnoverRate')}
              >
                <div className="flex items-center justify-end gap-1">
                  Turnover Rate
                  <SortIcon field="turnoverRate" />
                </div>
              </th>
              <th className="text-center text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                Trend
              </th>
              <th className="text-center text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 text-sm">
                  No product performance data available
                </td>
              </tr>
            ) : (
              sortedData.map((product) => (
                <tr
                  key={product.productId}
                  className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">
                        {product.productName}
                      </span>
                      <span className="text-slate-400 text-xs">
                        SKU: {product.sku}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-300 text-sm">
                      {product.categoryName || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-white text-sm font-medium">
                      {formatNumber(product.unitsSold)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-white text-sm font-medium">
                      {formatCurrency(product.revenue)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-slate-300 text-sm">
                      {product.turnoverRate ? product.turnoverRate.toFixed(2) : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`material-symbols-outlined text-lg ${getTrendColor(product.trend)}`}>
                      {getTrendIcon(product.trend)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {product.zeroSales ? (
                      <Badge variant="warning" size="sm">No Sales</Badge>
                    ) : product.unitsSold > 100 ? (
                      <Badge variant="success" size="sm">Top Seller</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Active</Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {!loading && sortedData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-sm">
          <span className="text-slate-400">
            Showing {sortedData.length} product{sortedData.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400">Total Units: </span>
              <span className="text-white font-medium">
                {formatNumber(sortedData.reduce((sum, p) => sum + p.unitsSold, 0))}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Total Revenue: </span>
              <span className="text-white font-medium">
                {formatCurrency(sortedData.reduce((sum, p) => sum + p.revenue, 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
