'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatters';

export default function TopProducts({ data, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-700 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-slate-400 text-sm">No product sales data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-2 text-slate-400 font-medium">
              Rank
            </th>
            <th className="text-left py-3 px-2 text-slate-400 font-medium">
              Product
            </th>
            <th className="text-right py-3 px-2 text-slate-400 font-medium">
              Units Sold
            </th>
            <th className="text-right py-3 px-2 text-slate-400 font-medium">
              Revenue
            </th>
            <th className="text-right py-3 px-2 text-slate-400 font-medium">
              % of Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) => (
            <tr
              key={product.productId}
              className="border-b border-slate-700 hover:bg-slate-800/50"
            >
              <td className="py-3 px-2 text-slate-300">
                #{index + 1}
              </td>
              <td className="py-3 px-2">
                <Link
                  href={`/products/${product.productId}`}
                  className="text-white hover:text-primary transition-colors"
                >
                  {product.productName}
                </Link>
              </td>
              <td className="py-3 px-2 text-right text-slate-300">
                {product.unitsSold}
              </td>
              <td className="py-3 px-2 text-right text-white font-medium">
                {formatCurrency(product.revenue)}
              </td>
              <td className="py-3 px-2 text-right">
                <span className="text-primary font-medium">
                  {product.percentage}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
