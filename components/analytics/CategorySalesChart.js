'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

export default function CategorySalesChart({ data, loading }) {
  if (loading) {
    return (
      <div className="w-full h-80 bg-slate-700 rounded-lg animate-pulse"></div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-sidebar border border-slate-700 rounded-lg">
        <p className="text-slate-400 text-sm">No category sales data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-sidebar border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white text-sm font-semibold mb-1">{data.payload.categoryName}</p>
          <p className="text-slate-400 text-xs mb-1">
            Revenue: {formatCurrency(data.value)}
          </p>
          <p className="text-slate-400 text-xs">
            Orders: {data.payload.orderCount}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="categoryName"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#94a3b8' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="revenue"
            fill="#1173d4"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
