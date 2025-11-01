'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

const PAYMENT_STATUS_COLORS = {
  paid: '#10b981',
  pending: '#f59e0b',
  failed: '#ef4444',
  refunded: '#f97316',
};

const PAYMENT_STATUS_LABELS = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
};

export default function PaymentStatusChart({ data, loading }) {
  if (loading) {
    return (
      <div className="w-full h-80 bg-slate-700 rounded-lg animate-pulse"></div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-sidebar border border-slate-700 rounded-lg">
        <p className="text-slate-400 text-sm">No payment data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-sidebar border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white text-sm font-semibold mb-1">{data.name}</p>
          <p className="text-slate-400 text-xs mb-1">
            Orders: {data.value} ({data.payload.percentage}%)
          </p>
          <p className="text-slate-400 text-xs">
            Amount: {formatCurrency(data.payload.amount)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-slate-300 text-xs">
              {entry.value} ({entry.payload.value})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ percentage }) => `${percentage}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PAYMENT_STATUS_COLORS[entry.status] || '#64748b'}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
