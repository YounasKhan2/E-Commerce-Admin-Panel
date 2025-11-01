import { Card, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

export default function CustomerCard({ customer }) {
  return (
    <Card>
      <div className="p-4">
        {/* Customer Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-medium text-white">
              {customer.firstName} {customer.lastName}
            </h3>
            <p className="text-sm text-slate-400 mt-1">{customer.email}</p>
            {customer.phone && (
              <p className="text-sm text-slate-400">{customer.phone}</p>
            )}
          </div>
          {customer.segment && (
            <Badge variant="info" size="sm">
              {customer.segment}
            </Badge>
          )}
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background-dark rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Total Spent</p>
            <p className="text-sm font-medium text-white">
              {formatCurrency(customer.totalSpent || 0)}
            </p>
          </div>
          <div className="bg-background-dark rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Orders</p>
            <p className="text-sm font-medium text-white">
              {customer.orderCount || 0}
            </p>
          </div>
          <div className="bg-background-dark rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Avg Order Value</p>
            <p className="text-sm font-medium text-white">
              {formatCurrency(
                customer.orderCount > 0
                  ? (customer.totalSpent || 0) / customer.orderCount
                  : 0
              )}
            </p>
          </div>
          <div className="bg-background-dark rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Last Order</p>
            <p className="text-sm font-medium text-white">
              {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : '-'}
            </p>
          </div>
        </div>

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {customer.tags.map((tag, index) => (
                <Badge key={index} variant="neutral" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
