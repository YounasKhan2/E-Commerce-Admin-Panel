'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import PageHeader from '@/components/layout/PageHeader';
import { getDocument, updateDocument, listDocuments, createDocument, COLLECTIONS } from '@/lib/appwrite';
import { getFilePreview, BUCKETS } from '@/lib/appwrite';
import { Alert } from '@/components/ui';
import { Query } from 'appwrite';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Fetch product
      const productData = await getDocument(COLLECTIONS.PRODUCTS, productId);

      // Fetch variants if product has variants
      let variants = [];
      if (productData.hasVariants) {
        const variantsResponse = await listDocuments(
          COLLECTIONS.PRODUCT_VARIANTS,
          [Query.equal('productId', productId)],
          1,
          100
        );
        variants = variantsResponse.documents;
      }

      // Process images to include preview URLs
      const images = productData.images?.map((fileId) => ({
        fileId,
        url: getFilePreview(BUCKETS.PRODUCT_IMAGES, fileId, 400, 400),
        name: fileId,
      })) || [];

      // Process tags if they're an array
      const tags = Array.isArray(productData.tags) 
        ? productData.tags.join(', ') 
        : productData.tags || '';

      setProduct({
        ...productData,
        images,
        tags,
        variants,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      // Update product document
      await updateDocument(COLLECTIONS.PRODUCTS, productId, productData);

      // Handle variants
      if (data.hasVariants && data.variants && data.variants.length > 0) {
        // Get existing variants
        const existingVariantsResponse = await listDocuments(
          COLLECTIONS.PRODUCT_VARIANTS,
          [Query.equal('productId', productId)],
          1,
          100
        );
        const existingVariants = existingVariantsResponse.documents;

        // Update or create variants
        for (const variant of data.variants) {
          if (variant.variantType && variant.variantValue) {
            const variantData = {
              productId: productId,
              variantType: variant.variantType,
              variantValue: variant.variantValue,
              sku: variant.sku || '',
              price: variant.price ? parseFloat(variant.price) : null,
              inventory: variant.inventory ? parseInt(variant.inventory) : 0,
            };

            // Check if variant exists (by matching variantType and variantValue)
            const existingVariant = existingVariants.find(
              (v) => v.variantType === variant.variantType && v.variantValue === variant.variantValue
            );

            if (existingVariant) {
              // Update existing variant
              await updateDocument(COLLECTIONS.PRODUCT_VARIANTS, existingVariant.$id, variantData);
            } else {
              // Create new variant
              await createDocument(COLLECTIONS.PRODUCT_VARIANTS, variantData);
            }
          }
        }
      }

      // Redirect to products list
      router.push('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message || 'Failed to update product. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Product" />
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Product"
        description={`Update details for ${product?.name || 'product'}`}
      />

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {product && (
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
