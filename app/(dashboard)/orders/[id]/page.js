'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Badge, Alert } from '@/components/ui';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import InvoiceButton from '@/components/orders/InvoiceButton';
import { getDocument, updateDocument, listDocuments, COLLECTIONS, Query } from '@/lib/appwrite';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { ORDER_STATUSES, PAYMENT_STATUSES, FULFILLMENT_STATUSES } from '@/lib/utils/constants';
import { processOrder } from '@/lib/appwrite/functions';

export default function OrderDetailPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states for editable fields
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('');
  const [shippingLabelUrl, setShippingLabelUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch order
      const orderData = await getDocument(COLLECTIONS.ORDERS, params.id);
      setOrder(orderData);
      setStatus(orderData.status || '');
      setTrackingNumber(orderData.trackingNumber || '');
      setShippingCarrier(orderData.shippingCarrier || '');
      setShippingLabelUrl(orderData.shippingLabelUrl || '');
      setNotes(orderData.notes || '');

      // Fetch customer
      if (orderData.customerId) {
        try {
          const customerData = await getDocument(COLLECTIONS.CUSTOMERS, orderData.customerId);
          setCustomer(customerData);
        } catch (err) {
          console.error('Error fetching customer:', err);
        }
      }

      // Fetch order items
      const itemsResponse = await listDocuments(
        COLLECTIONS.ORDER_ITEMS,
        [Query.equal('orderId', params.id)],
        1,
        100
      );
      setOrderItems(itemsResponse.documents);

    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      // Update order status
      const updatedOrder = await updateDocument(COLLECTIONS.ORDERS, params.id, {
        status: newStatus
      });

      setOrder(updatedOrder);
      setStatus(newStatus);

      // Trigger processOrder function
      try {
        await processOrder({
          orderId: params.id,
          status: newStatus,
          ...updatedOrder
        });
      } catch (funcError) {
        console.error('Error triggering processOrder function:', funcError);
        // Don't fail the whole operation if function fails
      }

      setSuccessMessage('Order status updated successfully');
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsShipped = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const updateData = {
        status: 'shipped',
        fulfillmentStatus: 'fulfilled',
        trackingNumber,
        shippingCarrier,
        shippingLabelUrl
      };

      const updatedOrder = await updateDocument(COLLECTIONS.ORDERS, params.id, updateData);
      setOrder(updatedOrder);
      setStatus('shipped');

      // Trigger processOrder function
      try {
        await processOrder({
          orderId: params.id,
          ...updatedOrder
        });
      } catch (funcError) {
        console.error('Error triggering processOrder function:', funcError);
      }

      setSuccessMessage('Order marked as shipped successfully');
    } catch (err) {
      console.error('Error marking order as shipped:', err);
      setError('Failed to mark order as shipped. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const updatedOrder = await updateDocument(COLLECTIONS.ORDERS, params.id, {
        status: 'delivered'
      });

      setOrder(updatedOrder);
      setStatus('delivered');

      setSuccessMessage('Order marked as delivered successfully');
    } catch (err) {
      console.error('Error marking order as delivered:', err);
      setError('Failed to mark order as delivered. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const updatedOrder = await updateDocument(COLLECTIONS.ORDERS, params.id, {
        notes
      });

      setOrder(updatedOrder);
      setSuccessMessage('Notes saved successfully');
    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Failed to save notes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInvoiceGenerated = async (fileId) => {
    try {
      // Update order with invoice file ID
      const updatedOrder = await updateDocument(COLLECTIONS.ORDERS, params.id, {
        invoiceUrl: fileId
      });

      setOrder(updatedOrder);
      setSuccessMessage('Invoice generated successfully');
    } catch (err) {
      console.error('Error updating order with invoice:', err);
      setError('Invoice generated but failed to update order. Please refresh the page.');
    }
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending' },
      paid: { variant: 'success', label: 'Paid' },
      failed: { variant: 'danger', label: 'Failed' },
      refunded: { variant: 'neutral', label: 'Refunded' },
    };

    const config = statusConfig[paymentStatus] || { variant: 'neutral', label: paymentStatus };
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getFulfillmentStatusBadge = (fulfillmentStatus) => {
    const statusConfig = {
      unfulfilled: { variant: 'warning', label: 'Unfulfilled' },
      partial: { variant: 'info', label: 'Partial' },
      fulfilled: { variant: 'success', label: 'Fulfilled' },
    };

    const config = statusConfig[fulfillmentStatus] || { variant: 'neutral', label: fulfillmentStatus };
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Loading..." />
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading order details...</div>
        </div>
      </>
    );
  }

  if (error && !order) {
    return (
      <>
        <PageHeader title="Error" />
        <Alert variant="danger">{error}</Alert>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <PageHeader title="Order Not Found" />
        <Alert variant="danger">The requested order could not be found.</Alert>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Created on ${formatDate(order.$createdAt)}`}
        action={
          <Button
            variant="ghost"
            size="sm"
            icon="arrow_back"
            onClick={() => router.push('/orders')}
          >
            Back to Orders
          </Button>
        }
      />

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-sidebar rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Order Details</h2>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                {getPaymentStatusBadge(order.paymentStatus)}
                {order.fulfillmentStatus && getFulfillmentStatusBadge(order.fulfillmentStatus)}
              </div>
            </div>

            {/* Status Update Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Update Status
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-sidebar rounded-lg border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Product</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">SKU</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">Quantity</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">Price</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.$id} className="border-b border-slate-700/50">
                      <td className="py-3 px-2">
                        <div className="text-sm text-white">{item.productName}</div>
                        {item.variantInfo && (
                          <div className="text-xs text-slate-400">{item.variantInfo}</div>
                        )}
                      </td>
                      <td className="py-3 px-2 text-sm text-slate-400">{item.sku || 'N/A'}</td>
                      <td className="py-3 px-2 text-sm text-white text-right">{item.quantity}</td>
                      <td className="py-3 px-2 text-sm text-white text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-white text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-sidebar rounded-lg border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">{formatCurrency(order.subtotalAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax</span>
                <span className="text-white">{formatCurrency(order.taxAmount || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Shipping</span>
                <span className="text-white">{formatCurrency(order.shippingAmount || 0)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Discount</span>
                  <span className="text-green-400">-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-white">Total</span>
                  <span className="text-base font-semibold text-white">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Section */}
          <div className="bg-sidebar rounded-lg border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Invoice</h2>
            <InvoiceButton 
              order={{
                ...order,
                items: orderItems,
                customerName: customer ? `${customer.firstName} ${customer.lastName}` : '',
                customerEmail: customer?.email || ''
              }}
              onInvoiceGenerated={handleInvoiceGenerated}
            />
          </div>

          {/* Fulfillment Section */}
          <div className="bg-sidebar rounded-lg border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Fulfillment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Shipping Carrier
                </label>
                <input
                  type="text"
                  value={shippingCarrier}
                  onChange={(e) => setShippingCarrier(e.target.value)}
                  placeholder="e.g., UPS, FedEx, USPS"
                  className="w-full px-4 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Shipping Label URL
                </label>
                <input
                  type="url"
                  value={shippingLabelUrl}
                  onChange={(e) => setShippingLabelUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleMarkAsShipped}
                  disabled={saving || !trackingNumber}
                  icon="local_shipping"
                >
                  Mark as Shipped
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleMarkAsDelivered}
                  disabled={saving}
                  icon="check_circle"
                >
                  Mark as Delivered
                </Button>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-sidebar rounded-lg border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Internal Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this order..."
              rows={4}
              className="w-full px-4 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveNotes}
                disabled={saving}
                icon="save"
              >
                Save Notes
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-sidebar rounded-lg border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Customer</h2>
            {customer ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-white">
                    {customer.firstName} {customer.lastName}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{customer.email}</div>
                  {customer.phone && (
                    <div className="text-xs text-slate-400">{customer.phone}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/customers/${customer.$id}`)}
                  icon="person"
                >
                  View Customer
                </Button>
              </div>
            ) : (
              <div className="text-sm text-slate-400">Customer information not available</div>
            )}
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-sidebar rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Shipping Address</h2>
              <div className="text-sm text-slate-300 space-y-1">
                {typeof order.shippingAddress === 'string' ? (
                  <div>{order.shippingAddress}</div>
                ) : (
                  <>
                    {order.shippingAddress.line1 && <div>{order.shippingAddress.line1}</div>}
                    {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                    <div>
                      {order.shippingAddress.city && `${order.shippingAddress.city}, `}
                      {order.shippingAddress.state && `${order.shippingAddress.state} `}
                      {order.shippingAddress.postalCode}
                    </div>
                    {order.shippingAddress.country && <div>{order.shippingAddress.country}</div>}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Billing Address */}
          {order.billingAddress && (
            <div className="bg-sidebar rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Billing Address</h2>
              <div className="text-sm text-slate-300 space-y-1">
                {typeof order.billingAddress === 'string' ? (
                  <div>{order.billingAddress}</div>
                ) : (
                  <>
                    {order.billingAddress.line1 && <div>{order.billingAddress.line1}</div>}
                    {order.billingAddress.line2 && <div>{order.billingAddress.line2}</div>}
                    <div>
                      {order.billingAddress.city && `${order.billingAddress.city}, `}
                      {order.billingAddress.state && `${order.billingAddress.state} `}
                      {order.billingAddress.postalCode}
                    </div>
                    {order.billingAddress.country && <div>{order.billingAddress.country}</div>}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
