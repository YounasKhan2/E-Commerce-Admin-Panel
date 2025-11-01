'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDocument, updateDocument, createDocument, listDocuments, COLLECTIONS, DATABASE_ID, Query } from '@/lib/appwrite';
import { uploadFile, getFilePreview, BUCKETS } from '@/lib/appwrite/storage';
import PageHeader from '@/components/layout/PageHeader';
import { Badge, Button, Alert } from '@/components/ui';
import { formatDate, formatDateTime } from '@/lib/utils/formatters';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '@/lib/utils/constants';

export default function TicketDetailPage({ params }) {
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicketData();
  }, [params.id]);

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ticket
      const ticketData = await getDocument(COLLECTIONS.SUPPORT_TICKETS, params.id);
      setTicket(ticketData);

      // Fetch customer if customerId exists
      if (ticketData.customerId) {
        try {
          const customerData = await getDocument(COLLECTIONS.CUSTOMERS, ticketData.customerId);
          setCustomer(customerData);
        } catch (err) {
          console.error('Error fetching customer:', err);
        }
      }

      // Fetch messages
      const messagesResponse = await listDocuments(
        COLLECTIONS.TICKET_MESSAGES,
        [
          Query.equal('ticketId', params.id),
          Query.orderAsc('$createdAt')
        ],
        1,
        100
      );
      setMessages(messagesResponse.documents);
    } catch (err) {
      console.error('Error fetching ticket data:', err);
      setError('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await updateDocument(COLLECTIONS.SUPPORT_TICKETS, params.id, {
        priority: newPriority
      });
      setTicket({ ...ticket, priority: newPriority });
    } catch (err) {
      console.error('Error updating priority:', err);
      setError('Failed to update priority');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDocument(COLLECTIONS.SUPPORT_TICKETS, params.id, {
        status: newStatus
      });
      setTicket({ ...ticket, status: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const handleAssignedToChange = async (e) => {
    const newAssignedTo = e.target.value;
    try {
      await updateDocument(COLLECTIONS.SUPPORT_TICKETS, params.id, {
        assignedTo: newAssignedTo
      });
      setTicket({ ...ticket, assignedTo: newAssignedTo });
    } catch (err) {
      console.error('Error updating assigned to:', err);
      setError('Failed to update assignment');
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedFiles = [];
      for (const file of files) {
        const uploadedFile = await uploadFile(BUCKETS.DOCUMENTS, file);
        uploadedFiles.push({
          fileId: uploadedFile.$id,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type
        });
      }
      setAttachments([...attachments, ...uploadedFiles]);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload attachments');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() && attachments.length === 0) {
      return;
    }

    setSending(true);
    try {
      // Create message document
      await createDocument(COLLECTIONS.TICKET_MESSAGES, {
        ticketId: params.id,
        content: replyContent,
        isFromCustomer: false,
        attachments: attachments.length > 0 ? JSON.stringify(attachments) : null,
        author: 'Admin' // In a real app, this would be the logged-in admin's name
      });

      // Update ticket's lastResponse timestamp
      await updateDocument(COLLECTIONS.SUPPORT_TICKETS, params.id, {
        lastResponse: new Date().toISOString()
      });

      // Clear form
      setReplyContent('');
      setAttachments([]);

      // Refresh messages
      await fetchTicketData();
    } catch (err) {
      console.error('Error sending reply:', err);
      setError('Failed to send reply');
    } finally {
      setSending(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading ticket details...</div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="p-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => router.push('/support')} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-4">
        <Alert variant="danger">Ticket not found</Alert>
        <Button onClick={() => router.push('/support')} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Ticket #${ticket.ticketNumber}`}
        description={ticket.subject}
        action={
          <Button variant="secondary" onClick={() => router.push('/support')}>
            <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
            Back to Tickets
          </Button>
        }
      />

      {error && (
        <div className="mb-4">
          <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Messages */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header */}
          <div className="bg-sidebar rounded-lg p-6 border border-slate-700">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="px-3 py-1.5 bg-background-dark border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {TICKET_PRIORITIES.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3 py-1.5 bg-background-dark border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {TICKET_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Assigned To</label>
                <input
                  type="text"
                  value={ticket.assignedTo || ''}
                  onChange={handleAssignedToChange}
                  placeholder="Unassigned"
                  className="px-3 py-1.5 bg-background-dark border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Created {formatDateTime(ticket.$createdAt)}
              {ticket.lastResponse && ` • Last response ${formatDateTime(ticket.lastResponse)}`}
            </div>
          </div>

          {/* Message Thread */}
          <div className="bg-sidebar rounded-lg border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-base font-medium text-white">Messages</h3>
            </div>
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  No messages yet
                </div>
              ) : (
                messages.map((message) => {
                  const isCustomer = message.isFromCustomer;
                  const attachmentsList = message.attachments ? JSON.parse(message.attachments) : [];

                  return (
                    <div
                      key={message.$id}
                      className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          isCustomer
                            ? 'bg-background-dark border border-slate-700'
                            : 'bg-primary/10 border border-primary/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-medium ${isCustomer ? 'text-white' : 'text-primary'}`}>
                            {message.author || (isCustomer ? 'Customer' : 'Admin')}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatDateTime(message.$createdAt)}
                          </span>
                        </div>
                        <div className="text-sm text-slate-200 whitespace-pre-wrap">
                          {message.content}
                        </div>
                        {attachmentsList.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <div className="text-xs text-slate-400 mb-2">Attachments:</div>
                            <div className="space-y-1">
                              {attachmentsList.map((attachment, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  <span className="material-symbols-outlined text-sm">attach_file</span>
                                  <span className="text-slate-300">{attachment.fileName}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Reply Section */}
          <div className="bg-sidebar rounded-lg p-6 border border-slate-700">
            <h3 className="text-base font-medium text-white mb-4">Reply</h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              rows={6}
              className="w-full px-4 py-3 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((attachment, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-background-dark px-3 py-2 rounded border border-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-slate-400">attach_file</span>
                      <span className="text-sm text-slate-300">{attachment.fileName}</span>
                      <span className="text-xs text-slate-500">
                        ({(attachment.fileSize / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-background-dark border border-slate-600 rounded-lg text-slate-300 text-sm hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-base">attach_file</span>
                  {uploading ? 'Uploading...' : 'Attach Files'}
                </div>
              </label>

              <Button
                onClick={handleSendReply}
                disabled={(!replyContent.trim() && attachments.length === 0) || sending}
                className="ml-auto"
              >
                <span className="material-symbols-outlined text-base mr-2">send</span>
                {sending ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar - Customer Info */}
        <div className="space-y-6">
          <div className="bg-sidebar rounded-lg p-6 border border-slate-700">
            <h3 className="text-base font-medium text-white mb-4">Customer Information</h3>
            {customer ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Name</div>
                  <div className="text-sm text-white">
                    {customer.firstName} {customer.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Email</div>
                  <div className="text-sm text-white">{customer.email}</div>
                </div>
                {customer.phone && (
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Phone</div>
                    <div className="text-sm text-white">{customer.phone}</div>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-700">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(`/customers/${customer.$id}`)}
                    className="w-full"
                  >
                    View Customer Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">
                {ticket.customerId ? 'Customer information not available' : 'No customer linked'}
              </div>
            )}
          </div>

          {/* Ticket Info */}
          <div className="bg-sidebar rounded-lg p-6 border border-slate-700">
            <h3 className="text-base font-medium text-white mb-4">Ticket Details</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Ticket Number</div>
                <div className="text-sm text-white font-medium">{ticket.ticketNumber}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Subject</div>
                <div className="text-sm text-white">{ticket.subject}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Priority</div>
                <div>{getPriorityBadge(ticket.priority)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Status</div>
                <div>{getStatusBadge(ticket.status)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Created</div>
                <div className="text-sm text-white">{formatDateTime(ticket.$createdAt)}</div>
              </div>
              {ticket.lastResponse && (
                <div>
                  <div className="text-xs text-slate-400 mb-1">Last Response</div>
                  <div className="text-sm text-white">{formatDateTime(ticket.lastResponse)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
