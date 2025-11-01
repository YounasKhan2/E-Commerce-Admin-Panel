'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Table, Badge } from '@/components/ui';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { listDocuments, COLLECTIONS, Query } from '@/lib/appwrite';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { ORDER_STATUSES } from '@/lib/utils/constants';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const pageSize = 25;

  useEffect(() => {
    fetchOrders();
  }, [page, searchTerm, statusFilter, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queries = [];

      // Search by order number or customer email
      if (searchTerm) {
        // Note: Appwrite search works on indexed fields
        // We'll search orderNumber field
        queries.push(Query.search('orderNumber', searchTerm));
      }

      // Filter by status
      if (statusFilter) {
        queries.push(Query.equal('status', statusFilter));
      }

      // Filter by date range
      if (startDate) {
        queries.push(Query.greaterThanEqual('$createdAt', new Date(startDate).toISOString()));
      }
      if (endDate) {
        // Add one day to include the end date
        const endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
        queries.push(Query.lessThan('$createdAt', endDateTime.toISOString()));
      }

      // Order by creation date (newest first)
      queries.push(Query.orderDesc('$createdAt'));

      const response = await listDocuments(
        COLLECTIONS.ORDERS,
        queries,
        page,
        pageSize
      );

      setOrders(response.documents);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order Number',
      sortable: true,
      render: (orderNumber) => (
        <span className="font-medium text-primary">{orderNumber}</span>
      ),
    },
    {
      key: 'customerId',
      label: 'Customer',
      render: (customerId, row) => {
        // For now, show customer ID. In a real app, we'd fetch customer data
        // or use a relationship to get customer name
        return (
          <div className="text-sm">
            <div className="text-white">{row.customerEmail || 'N/A'}</div>
            <div className="text-slate-400 text-xs">{customerId}</div>
          </div>
        );
      },
    },
    {
      key: '$createdAt',
      label: 'Date',
      sortable: true,
      render: (date) => formatDate(date),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <OrderStatusBadge status={status} />,
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (paymentStatus) => getPaymentStatusBadge(paymentStatus),
    },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      render: (totalAmount) => (
        <span className="font-medium">{formatCurrency(totalAmount)}</span>
      ),
    },
    {
      key: '$id',
      label: 'Actions',
      render: (id) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/orders/${id}`);
            }}
            className="text-primary hover:text-primary/80 transition-colors"
            title="View Order"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Manage customer orders and fulfillment"
      />

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-[180px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filters */}
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Table
        columns={columns}
        data={orders}
        loading={loading}
        onRowClick={(row) => router.push(`/orders/${row.$id}`)}
        pagination={{
          page,
          pageSize,
          total,
        }}
        onPageChange={setPage}
      />
    </>
  );
}
