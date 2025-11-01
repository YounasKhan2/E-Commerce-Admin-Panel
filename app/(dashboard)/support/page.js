'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { Table, Badge } from '@/components/ui';
import { listDocuments, COLLECTIONS, Query } from '@/lib/appwrite';
import { formatDate } from '@/lib/utils/formatters';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@/lib/utils/constants';

export default function SupportTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const pageSize = 25;

  useEffect(() => {
    fetchTickets();
  }, [page, searchTerm, priorityFilter, statusFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const queries = [];

      // Search by ticket number or subject
      if (searchTerm) {
        // Search in subject field (assuming it's indexed)
        queries.push(Query.search('subject', searchTerm));
      }

      // Filter by priority
      if (priorityFilter) {
        queries.push(Query.equal('priority', priorityFilter));
      }

      // Filter by status
      if (statusFilter) {
        queries.push(Query.equal('status', statusFilter));
      }

      // Order by last response date (newest first)
      queries.push(Query.orderDesc('lastResponse'));

      const response = await listDocuments(
        COLLECTIONS.SUPPORT_TICKETS,
        queries,
        page,
        pageSize
      );

      setTickets(response.documents);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { variant: 'info', label: 'Low' },
      medium: { variant: 'warning', label: 'Medium' },
      high: { variant: 'danger', label: 'High' },
      urgent: { variant: 'danger', label: 'Urgent' },
    };

    const config = priorityConfig[priority] || { variant: 'neutral', label: priority };
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { variant: 'warning', label: 'Open' },
      in_progress: { variant: 'info', label: 'In Progress' },
      resolved: { variant: 'success', label: 'Resolved' },
      closed: { variant: 'neutral', label: 'Closed' },
    };

    const config = statusConfig[status] || { variant: 'neutral', label: status };
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const columns = [
    {
      key: 'ticketNumber',
      label: 'Ticket #',
      sortable: true,
      render: (ticketNumber) => (
        <span className="font-medium text-primary">{ticketNumber}</span>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (subject) => (
        <div className="text-sm">
          <div className="text-white font-medium">{subject}</div>
        </div>
      ),
    },
    {
      key: 'customerId',
      label: 'Customer',
      render: (customerId, row) => {
        return (
          <div className="text-sm">
            <div className="text-white">{row.customerName || 'N/A'}</div>
            <div className="text-slate-400 text-xs">{row.customerEmail || customerId}</div>
          </div>
        );
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (priority) => getPriorityBadge(priority),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => getStatusBadge(status),
    },
    {
      key: 'lastResponse',
      label: 'Last Response',
      sortable: true,
      render: (lastResponse) => (
        <span className="text-sm text-slate-400">
          {lastResponse ? formatDate(lastResponse) : 'No response'}
        </span>
      ),
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (assignedTo) => (
        <span className="text-sm text-slate-300">
          {assignedTo || 'Unassigned'}
        </span>
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
              router.push(`/support/${id}`);
            }}
            className="text-primary hover:text-primary/80 transition-colors"
            title="View Ticket"
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
        title="Support Tickets"
        description="Manage customer support requests"
      />

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by ticket number or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Priority Filter */}
        <div className="min-w-[180px]">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Priorities</option>
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="min-w-[180px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            {TICKET_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <Table
        columns={columns}
        data={tickets}
        loading={loading}
        onRowClick={(row) => router.push(`/support/${row.$id}`)}
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
