'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import PageHeader from '@/components/layout/PageHeader';
import { createDocument, COLLECTIONS } from '@/lib/appwrite';
import { Alert } from '@/components/ui';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Process tags if they're a string
      let tags = data.tags;
      if (typeof tags === 'string') {
        tags = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      }

      // Prepare product data
      const productData = {
        name: data.name,
        description: data.description || '',
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        sku: data.sku,
        barcode: data.barcode || '',
        categoryId: data.categoryId || null,
        inventory: data.inventory,
        lowStockThreshold: data.lowStockThreshold,
        tags: tags || [],
        weight: data.weight,
        images: data.images?.map((img) => img.fileId) || [],
        hasVariants: data.hasVariants || false,
      };

      // Create product document
      const product = await createDocument(COLLECTIONS.PRODUCTS, productData);

      // Create variants if they exist
      if (data.hasVariants && data.variants && data.variants.length > 0) {
        for (const variant of data.variants) {
          if (variant.variantType && variant.variantValue) {
            await createDocument(COLLECTIONS.PRODUCT_VARIANTS, {
              productId: product.$id,
              variantType: variant.variantType,
              variantValue: variant.variantValue,
              sku: variant.sku || '',
              price: variant.price ? parseFloat(variant.price) : null,
              inventory: variant.inventory ? parseInt(variant.inventory) : 0,
            });
          }
        }
      }

      // Redirect to products list
      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Product"
        description="Add a new product to your catalog"
      />

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
