'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Table, Badge, Modal, Input, Alert } from '@/components/ui';
import { listDocuments, createDocument, updateDocument, deleteDocument, COLLECTIONS } from '@/lib/appwrite';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await listDocuments(COLLECTIONS.CATEGORIES, [], 1, 100);
      setCategories(response.documents);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', isActive: true });
    }
    setShowModal(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', isActive: true });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingCategory) {
        await updateDocument(COLLECTIONS.CATEGORIES, editingCategory.$id, formData);
      } else {
        await createDocument(COLLECTIONS.CATEGORIES, formData);
      }
      await fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteDocument(COLLECTIONS.CATEGORIES, categoryId);
      await fetchCategories();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      render: (description) => description || '-',
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (isActive) => (
        <Badge variant={isActive ? 'success' : 'neutral'} size="sm">
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: '$id',
      label: 'Actions',
      render: (id, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(row);
            }}
            className="text-primary hover:text-primary/80 transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirm(row);
            }}
            className="text-negative hover:text-negative/80 transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage product categories"
        action={
          <Button variant="primary" icon="add" onClick={() => handleOpenModal()}>
            Add Category
          </Button>
        }
      />

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Table
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="No categories found. Create your first category to get started."
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Electronics"
          />

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Optional description"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-background-dark text-primary focus:ring-primary"
            />
            <span className="text-slate-300 text-sm">Active</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">
            Are you sure you want to delete the category "{deleteConfirm?.name}"? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => handleDelete(deleteConfirm.$id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
