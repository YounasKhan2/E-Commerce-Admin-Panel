'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Card, Badge, Alert, Modal, Input } from '@/components/ui';
import { listDocuments, createDocument, updateDocument, deleteDocument, COLLECTIONS, ID } from '@/lib/appwrite';

export default function SegmentsPage() {
  const router = useRouter();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await listDocuments(COLLECTIONS.CUSTOMER_SEGMENTS, [], 1, 100);
      setSegments(response.documents);
    } catch (err) {
      console.error('Error fetching segments:', err);
      setError('Failed to load segments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSegment = async () => {
    if (!formData.name.trim()) {
      setError('Segment name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const newSegment = await createDocument(
        COLLECTIONS.CUSTOMER_SEGMENTS,
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          criteria: formData.criteria.trim(),
          customerCount: 0
        },
        ID.unique()
      );

      setSegments([...segments, newSegment]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', criteria: '' });
      setSuccessMessage('Segment created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error creating segment:', err);
      setError('Failed to create segment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSegment = async () => {
    if (!formData.name.trim()) {
      setError('Segment name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updatedSegment = await updateDocument(
        COLLECTIONS.CUSTOMER_SEGMENTS,
        editingSegment.$id,
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          criteria: formData.criteria.trim()
        }
      );

      setSegments(segments.map(s => s.$id === updatedSegment.$id ? updatedSegment : s));
      setShowEditModal(false);
      setEditingSegment(null);
      setFormData({ name: '', description: '', criteria: '' });
      setSuccessMessage('Segment updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating segment:', err);
      setError('Failed to update segment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSegment = async (segmentId) => {
    if (!confirm('Are you sure you want to delete this segment? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      
      await deleteDocument(COLLECTIONS.CUSTOMER_SEGMENTS, segmentId);
      setSegments(segments.filter(s => s.$id !== segmentId));
      setSuccessMessage('Segment deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting segment:', err);
      setError('Failed to delete segment. Please try again.');
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', description: '', criteria: '' });
    setError(null);
    setShowCreateModal(true);
  };

  const openEditModal = (segment) => {
    setEditingSegment(segment);
    setFormData({
      name: segment.name,
      description: segment.description || '',
      criteria: segment.criteria || ''
    });
    setError(null);
    setShowEditModal(true);
  };

  const viewSegmentCustomers = (segmentId) => {
    router.push(`/customers?segment=${segmentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading segments...</div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Customer Segments"
        description="Organize customers into segments for targeted marketing"
        action={
          <Button onClick={openCreateModal}>
            <span className="material-symbols-outlined text-base mr-1">add</span>
            Create Segment
          </Button>
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

      {segments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4 block">
              group
            </span>
            <h3 className="text-lg font-medium text-white mb-2">No segments yet</h3>
            <p className="text-sm text-slate-400 mb-6">
              Create your first customer segment to organize and target customers
            </p>
            <Button onClick={openCreateModal}>
              <span className="material-symbols-outlined text-base mr-1">add</span>
              Create Segment
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((segment) => (
            <Card key={segment.$id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {segment.name}
                    </h3>
                    {segment.description && (
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {segment.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-slate-400">
                    group
                  </span>
                  <span className="text-sm text-slate-300">
                    {segment.customerCount || 0} customers
                  </span>
                </div>

                {segment.criteria && (
                  <div className="p-3 bg-background-dark rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">Criteria</div>
                    <div className="text-sm text-slate-300 font-mono">
                      {segment.criteria}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-slate-700">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => viewSegmentCustomers(segment.$id)}
                    className="flex-1"
                  >
                    <span className="material-symbols-outlined text-base mr-1">visibility</span>
                    View Customers
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(segment)}
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteSegment(segment.$id)}
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Segment Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Segment"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Segment Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., VIP Customers, High Value"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this segment..."
                rows={3}
                className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Criteria (Optional)
              </label>
              <textarea
                value={formData.criteria}
                onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                placeholder="e.g., Total spent > $1000, Orders > 10"
                rows={2}
                className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">
                Define criteria for this segment (for reference only)
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleCreateSegment} disabled={saving}>
                {saving ? 'Creating...' : 'Create Segment'}
              </Button>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Segment Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Segment"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Segment Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., VIP Customers, High Value"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this segment..."
                rows={3}
                className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Criteria (Optional)
              </label>
              <textarea
                value={formData.criteria}
                onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                placeholder="e.g., Total spent > $1000, Orders > 10"
                rows={2}
                className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">
                Define criteria for this segment (for reference only)
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleEditSegment} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
