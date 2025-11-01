'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button, Card } from '@/components/ui';
import { listDocuments, COLLECTIONS } from '@/lib/appwrite';
import ImageUpload from './ImageUpload';

export default function ProductForm({ initialData, onSubmit, isSubmitting }) {
  const [categories, setCategories] = useState([]);
  const [showVariants, setShowVariants] = useState(initialData?.hasVariants || false);
  const [variants, setVariants] = useState(initialData?.variants || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: '',
      compareAtPrice: '',
      sku: '',
      barcode: '',
      categoryId: '',
      inventory: '',
      lowStockThreshold: '',
      tags: [],
      weight: '',
      images: [],
      hasVariants: false,
    },
  });

  const images = watch('images') || [];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await listDocuments(COLLECTIONS.CATEGORIES, [], 1, 100);
      setCategories(response.documents);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      price: parseFloat(data.price),
      compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
      inventory: parseInt(data.inventory),
      lowStockThreshold: data.lowStockThreshold ? parseInt(data.lowStockThreshold) : null,
      weight: data.weight ? parseFloat(data.weight) : null,
      hasVariants: showVariants,
      variants: showVariants ? variants : [],
    });
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { variantType: '', variantValue: '', sku: '', price: '', inventory: '' },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Product Name"
              {...register('name', { required: 'Product name is required' })}
              error={errors.name?.message}
              placeholder="Enter product name"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter product description"
            />
          </div>

          <Input
            label="SKU"
            {...register('sku', { required: 'SKU is required' })}
            error={errors.sku?.message}
            placeholder="PROD-001"
          />

          <Input
            label="Barcode"
            {...register('barcode')}
            placeholder="123456789"
          />
        </div>
      </Card>

      {/* Pricing */}
      <Card title="Pricing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...register('price', { required: 'Price is required' })}
            error={errors.price?.message}
            placeholder="0.00"
            icon="payments"
          />

          <Input
            label="Compare at Price"
            type="number"
            step="0.01"
            {...register('compareAtPrice')}
            placeholder="0.00"
            helperText="Original price for showing discounts"
          />
        </div>
      </Card>

      {/* Inventory */}
      <Card title="Inventory">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Inventory"
            type="number"
            {...register('inventory', { required: 'Inventory is required' })}
            error={errors.inventory?.message}
            placeholder="0"
          />

          <Input
            label="Low Stock Threshold"
            type="number"
            {...register('lowStockThreshold')}
            placeholder="10"
            helperText="Alert when stock falls below this number"
          />
        </div>
      </Card>

      {/* Organization */}
      <Card title="Organization">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Category
            </label>
            <select
              {...register('categoryId')}
              className="w-full px-3 py-2 bg-background-dark border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.$id} value={cat.$id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Weight (kg)"
            type="number"
            step="0.01"
            {...register('weight')}
            placeholder="0.00"
          />

          <div className="md:col-span-2">
            <Input
              label="Tags"
              {...register('tags')}
              placeholder="tag1, tag2, tag3"
              helperText="Comma-separated tags"
            />
          </div>
        </div>
      </Card>

      {/* Product Images */}
      <Card title="Product Images">
        <ImageUpload
          images={images}
          onChange={(newImages) => setValue('images', newImages)}
        />
      </Card>

      {/* Variants */}
      <Card
        title="Product Variants"
        action={
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showVariants}
              onChange={(e) => setShowVariants(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-background-dark text-primary focus:ring-primary"
            />
            <span className="text-slate-300 text-sm">Enable variants</span>
          </label>
        }
      >
        {showVariants && (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="p-4 bg-background-dark rounded-lg border border-slate-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white text-sm font-medium">
                    Variant {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-negative hover:text-negative/80"
                  >
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <input
                    type="text"
                    value={variant.variantType}
                    onChange={(e) => updateVariant(index, 'variantType', e.target.value)}
                    placeholder="Type (e.g., Size)"
                    className="px-3 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={variant.variantValue}
                    onChange={(e) => updateVariant(index, 'variantValue', e.target.value)}
                    placeholder="Value (e.g., Large)"
                    className="px-3 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    placeholder="SKU"
                    className="px-3 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', e.target.value)}
                    placeholder="Price"
                    className="px-3 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    value={variant.inventory}
                    onChange={(e) => updateVariant(index, 'inventory', e.target.value)}
                    placeholder="Inventory"
                    className="px-3 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              icon="add"
              onClick={addVariant}
            >
              Add Variant
            </Button>
          </div>
        )}
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
