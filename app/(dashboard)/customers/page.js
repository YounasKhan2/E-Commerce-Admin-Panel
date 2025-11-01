'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { Table, Badge, Button } from '@/components/ui';
import { listDocuments, COLLECTIONS, Query } from '@/lib/appwrite';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('');
  const [segments, setSegments] = useState([]);
  const pageSize = 25;

  useEffect(() => {
    fetchSegments();
    
    // Check if there's a segment filter in URL params
    const segmentParam = searchParams.get('segment');
    if (segmentParam) {
      setSegmentFilter(segmentParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm, segmentFilter]);

  const fetchSegments = async () => {
    try {
      const response = await listDocuments(COLLECTIONS.CUSTOMER_SEGMENTS, [], 1, 100);
      setSegments(response.documents);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const queries = [];

      // Search by name or email
      if (searchTerm) {
        // Appwrite search works on indexed fields
        // We'll search on email field (assuming it's indexed)
        queries.push(Query.search('email', searchTerm));
      }

      // Filter by segment
      if (segmentFilter) {
        queries.push(Query.equal('segment', segmentFilter));
      }

      // Order by creation date (newest first)
      queries.push(Query.orderDesc('$createdAt'));

      const response = await listDocuments(
        COLLECTIONS.CUSTOMERS,
        queries,
        page,
        pageSize
      );

      setCustomers(response.documents);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'firstName',
      label: 'Name',
      sortable: true,
      render: (firstName, row) => (
        <div className="text-sm">
          <div className="text-white font-medium">
            {firstName} {row.lastName}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (email) => (
        <span className="text-slate-300">{email}</span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (phone) => (
        <span className="text-slate-300">{phone || '-'}</span>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (totalSpent) => (
        <span className="font-medium">{formatCurrency(totalSpent || 0)}</span>
      ),
    },
    {
      key: 'orderCount',
      label: 'Orders',
      sortable: true,
      render: (orderCount) => (
        <span className="text-slate-300">{orderCount || 0}</span>
      ),
    },
    {
      key: 'lastOrderDate',
      label: 'Last Order',
      sortable: true,
      render: (lastOrderDate) => (
        <span className="text-slate-300">{formatDate(lastOrderDate)}</span>
      ),
    },
    {
      key: 'segment',
      label: 'Segment',
      render: (segment) => {
        if (!segment) return <span className="text-slate-500">-</span>;
        
        const segmentData = segments.find((s) => s.$id === segment);
        return (
          <Badge variant="info" size="sm">
            {segmentData?.name || segment}
          </Badge>
        );
      },
    },
    {
      key: '$id',
      label: 'Actions',
      render: (id) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/customers/${id}`);
            }}
            className="text-primary hover:text-primary/80 transition-colors"
            title="View Customer"
          >
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
        </div>
      ),
    },
  ];

  const currentSegment = segmentFilter ? segments.find(s => s.$id === segmentFilter) : null;

  const clearFilters = () => {
    setSegmentFilter('');
    setSearchTerm('');
    router.push('/customers');
  };

  return (
    <>
      <PageHeader
        title={currentSegment ? `Customers in ${currentSegment.name}` : 'Customers'}
        description={
          currentSegment 
            ? currentSegment.description || 'Viewing customers in this segment'
            : 'Manage customer profiles and relationships'
        }
        action={
          currentSegment && (
            <Button variant="secondary" onClick={clearFilters}>
              <span className="material-symbols-outlined text-base mr-1">close</span>
              Clear Filter
            </Button>
          )
        }
      />

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Segment Filter */}
        <div className="min-w-[200px]">
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="w-full px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Segments</option>
            {segments.map((segment) => (
              <option key={segment.$id} value={segment.$id}>
                {segment.name}
              </option>
            ))}
          </select>
        </div>

        {(segmentFilter || searchTerm) && (
          <Button variant="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Customers Table */}
      <Table
        columns={columns}
        data={customers}
        loading={loading}
        onRowClick={(row) => router.push(`/customers/${row.$id}`)}
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
