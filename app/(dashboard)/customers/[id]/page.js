'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Badge, Card, Alert, Modal, Input } from '@/components/ui';
import { getDocument, updateDocument, listDocuments, COLLECTIONS, Query } from '@/lib/appwrite';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';

export default function CustomerDetailPage({ params }) {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });

  // Address management
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState({
    type: 'shipping',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  // Tags management
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Notes management
  const [notes, setNotes] = useState('');

  // Segment management
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState('');

  useEffect(() => {
    fetchCustomerDetails();
    fetchSegments();
  }, [params.id]);

  const fetchSegments = async () => {
    try {
      const response = await listDocuments(COLLECTIONS.CUSTOMER_SEGMENTS, [], 1, 100);
      setSegments(response.documents);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch customer
      const customerData = await getDocument(COLLECTIONS.CUSTOMERS, params.id);
      setCustomer(customerData);

      // Initialize form data
      setEditForm({
        firstName: customerData.firstName || '',
        lastName: customerData.lastName || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        dateOfBirth: customerData.dateOfBirth || ''
      });

      // Parse addresses from JSON
      try {
        const parsedAddresses = customerData.addresses ? JSON.parse(customerData.addresses) : [];
        setAddresses(Array.isArray(parsedAddresses) ? parsedAddresses : []);
      } catch (e) {
        console.error('Error parsing addresses:', e);
        setAddresses([]);
      }

      // Parse tags
      setTags(customerData.tags || []);

      // Set notes
      setNotes(customerData.notes || '');

      // Set segment
      setSelectedSegment(customerData.segment || '');

      // Fetch customer orders
      const ordersResponse = await listDocuments(
        COLLECTIONS.ORDERS,
        [Query.equal('customerId', params.id), Query.orderDesc('$createdAt')],
        1,
        50
      );
      setOrders(ordersResponse.documents);

    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError('Failed to load customer details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit - reset form
      setEditForm({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        dateOfBirth: customer.dateOfBirth || ''
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveCustomer = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const updatedCustomer = await updateDocument(COLLECTIONS.CUSTOMERS, params.id, editForm);
      setCustomer(updatedCustomer);
      setIsEditMode(false);
      setSuccessMessage('Customer information updated successfully');

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('Failed to update customer. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddressIndex(null);
    setAddressForm({
      type: 'shipping',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    });
    setShowAddressModal(true);
  };

  const handleEditAddress = (index) => {
    setEditingAddressIndex(index);
    setAddressForm(addresses[index]);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    try {
      setSaving(true);
      setError(null);

      let updatedAddresses;
      if (editingAddressIndex !== null) {
        // Edit existing address
        updatedAddresses = [...addresses];
        updatedAddresses[editingAddressIndex] = addressForm;
      } else {
        // Add new address
        updatedAddresses = [...addresses, addressForm];
      }

      // Save to database as JSON string
      await updateDocument(COLLECTIONS.CUSTOMERS, params.id, {
        addresses: JSON.stringify(updatedAddresses)
      });

      setAddresses(updatedAddresses);
      setShowAddressModal(false);
      setSuccessMessage('Address saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      setSaving(true);
      setError(null);

      const updatedAddresses = addresses.filter((_, i) => i !== index);

      await updateDocument(COLLECTIONS.CUSTOMERS, params.id, {
        addresses: JSON.stringify(updatedAddresses)
      });

      setAddresses(updatedAddresses);
      setSuccessMessage('Address deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    if (tags.includes(newTag.trim())) {
      setNewTag('');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updatedTags = [...tags, newTag.trim()];

      await updateDocument(COLLECTIONS.CUSTOMERS, params.id, {
        tags: updatedTags
      });

      setTags(updatedTags);
      setNewTag('');
      setSuccessMessage('Tag added successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding tag:', err);
      setError('Failed to add tag. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    try {
      setSaving(true);
      setError(null);

      const updatedTags = tags.filter(tag => tag !== tagToRemove);

      await updateDocument(COLLECTIONS.CUSTOMERS, params.id, {
        tags: updatedTags
      });

      setTags(updatedTags);
      setSuccessMessage('Tag removed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error removing tag:', err);
      setError('Failed to remove tag. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      setError(null);

      await updateDocument(COLLECTIONS.CUSTOMERS, params.id, {
        notes: notes
      });

      setSuccessMessage('Notes saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Failed to save notes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSegmentChange = async (newSegmentId) => {
    try {
      setSaving(true);
      setError(null);

      const oldSegmentId = customer.segment;

      // Update customer's segment
      await updateDocument(COLLECTIONS.CUSTOMERS, params.id, {
        segment: newSegmentId || null
      });

      // Update old segment's customer count (decrement)
      if (oldSegmentId) {
        const oldSegment = segments.find(s => s.$id === oldSegmentId);
        if (oldSegment) {
          await updateDocument(COLLECTIONS.CUSTOMER_SEGMENTS, oldSegmentId, {
            customerCount: Math.max(0, (oldSegment.customerCount || 0) - 1)
          });
        }
      }

      // Update new segment's customer count (increment)
      if (newSegmentId) {
        const newSegment = segments.find(s => s.$id === newSegmentId);
        if (newSegment) {
          await updateDocument(COLLECTIONS.CUSTOMER_SEGMENTS, newSegmentId, {
            customerCount: (newSegment.customerCount || 0) + 1
          });
        }
      }

      // Update local state
      setSelectedSegment(newSegmentId);
      setCustomer({ ...customer, segment: newSegmentId });

      // Refresh segments to get updated counts
      await fetchSegments();

      setSuccessMessage('Segment updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating segment:', err);
      setError('Failed to update segment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading customer details...</div>
      </div>
    );
  }

  if (error && !customer) {
    return (
      <div className="p-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => router.push('/customers')} className="mt-4">
          Back to Customers
        </Button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-4">
        <Alert variant="danger">Customer not found</Alert>
        <Button onClick={() => router.push('/customers')} className="mt-4">
          Back to Customers
        </Button>
      </div>
    );
  }

  const averageOrderValue = customer.orderCount > 0 
    ? customer.totalSpent / customer.orderCount 
    : 0;

  return (
    <>
      <PageHeader
        title={`${customer.firstName} ${customer.lastName}`}
        description={customer.email}
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push('/customers')}
            >
              Back to Customers
            </Button>
            {!isEditMode && (
              <Button onClick={handleEditToggle}>
                <span className="material-symbols-outlined text-base mr-1">edit</span>
                Edit Customer
              </Button>
            )}
          </div>
        }
      />

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
        {/* Left Column - Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Header */}
          <Card title="Customer Information">
            {isEditMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                />
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSaveCustomer} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="secondary" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Phone</div>
                    <div className="text-sm text-white">{customer.phone || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Date of Birth</div>
                    <div className="text-sm text-white">
                      {customer.dateOfBirth ? formatDate(customer.dateOfBirth) : '-'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Customer Since</div>
                  <div className="text-sm text-white">{formatDate(customer.$createdAt)}</div>
                </div>
              </div>
            )}
          </Card>

          {/* Addresses Section */}
          <Card 
            title="Addresses" 
            action={
              <Button size="sm" onClick={handleAddAddress}>
                <span className="material-symbols-outlined text-base mr-1">add</span>
                Add Address
              </Button>
            }
          >
            {addresses.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-4">
                No addresses added yet
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="p-3 bg-background-dark rounded-lg border border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="info" size="sm">
                        {address.type || 'Address'}
                      </Badge>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditAddress(index)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Edit Address"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(index)}
                          className="text-negative hover:text-negative/80 transition-colors"
                          title="Delete Address"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 space-y-1">
                      <div>{address.street}</div>
                      <div>
                        {address.city}, {address.state} {address.postalCode}
                      </div>
                      <div>{address.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Tags and Notes */}
          <Card title="Tags">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.length === 0 ? (
                  <span className="text-sm text-slate-400">No tags added</span>
                ) : (
                  tags.map((tag, index) => (
                    <Badge key={index} variant="info" size="sm">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </Badge>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" onClick={handleAddTag} disabled={!newTag.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Notes">
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes about this customer..."
                rows={4}
                className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <Button size="sm" onClick={handleSaveNotes} disabled={saving}>
                {saving ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </Card>

          {/* Order History */}
          <Card title="Order History">
            {orders.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-4">
                No orders yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-xs font-medium text-slate-400 pb-3">Order #</th>
                      <th className="text-left text-xs font-medium text-slate-400 pb-3">Date</th>
                      <th className="text-left text-xs font-medium text-slate-400 pb-3">Status</th>
                      <th className="text-left text-xs font-medium text-slate-400 pb-3">Payment</th>
                      <th className="text-right text-xs font-medium text-slate-400 pb-3">Total</th>
                      <th className="text-right text-xs font-medium text-slate-400 pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.$id}
                        className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                        onClick={() => router.push(`/orders/${order.$id}`)}
                      >
                        <td className="py-3 text-sm text-white font-medium">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 text-sm text-slate-300">
                          {formatDate(order.$createdAt)}
                        </td>
                        <td className="py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              order.paymentStatus === 'paid'
                                ? 'success'
                                : order.paymentStatus === 'failed'
                                ? 'danger'
                                : 'warning'
                            }
                            size="sm"
                          >
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-white font-medium text-right">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/orders/${order.$id}`);
                            }}
                            className="text-primary hover:text-primary/80 transition-colors"
                            title="View Order"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          <Card title="Customer Stats">
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(customer.totalSpent || 0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Total Orders</div>
                <div className="text-2xl font-bold text-white">
                  {customer.orderCount || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Average Order Value</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(averageOrderValue)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Last Order</div>
                <div className="text-sm text-white">
                  {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Never'}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Customer Segment">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Assign Segment
                </label>
                <select
                  value={selectedSegment}
                  onChange={(e) => handleSegmentChange(e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  <option value="">No Segment</option>
                  {segments.map((segment) => (
                    <option key={segment.$id} value={segment.$id}>
                      {segment.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedSegment && (
                <div className="p-3 bg-background-dark rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">
                      {segments.find(s => s.$id === selectedSegment)?.name || 'Unknown'}
                    </Badge>
                  </div>
                  {segments.find(s => s.$id === selectedSegment)?.description && (
                    <p className="text-xs text-slate-400 mt-2">
                      {segments.find(s => s.$id === selectedSegment)?.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <Modal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          title={editingAddressIndex !== null ? 'Edit Address' : 'Add Address'}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address Type
              </label>
              <select
                value={addressForm.type}
                onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
                <option value="both">Both</option>
              </select>
            </div>
            <Input
              label="Street Address"
              value={addressForm.street}
              onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
              />
              <Input
                label="State/Province"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                required
              />
              <Input
                label="Country"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveAddress} disabled={saving}>
                {saving ? 'Saving...' : 'Save Address'}
              </Button>
              <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
