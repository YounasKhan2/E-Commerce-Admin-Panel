import Badge from '../ui/Badge';

/**
 * OrderStatusBadge Component
 * Displays order status with appropriate color coding
 * 
 * @param {string} status - Order status (pending, confirmed, processing, shipped, delivered, cancelled, refunded)
 * @param {string} size - Badge size (sm or md)
 */
export default function OrderStatusBadge({ status, size = 'sm' }) {
  // Map order statuses to badge variants
  const statusConfig = {
    pending: { variant: 'warning', label: 'Pending' },
    confirmed: { variant: 'info', label: 'Confirmed' },
    processing: { variant: 'info', label: 'Processing' },
    shipped: { variant: 'info', label: 'Shipped' },
    delivered: { variant: 'success', label: 'Delivered' },
    cancelled: { variant: 'neutral', label: 'Cancelled' },
    refunded: { variant: 'danger', label: 'Refunded' },
  };

  const config = statusConfig[status] || { variant: 'neutral', label: status };

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
