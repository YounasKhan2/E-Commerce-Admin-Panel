'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import { Button, Table, Badge } from '@/components/ui';
import { listDocuments, COLLECTIONS, Query } from '@/lib/appwrite';
import { getFilePreview, BUCKETS } from '@/lib/appwrite';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const pageSize = 25;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await listDocuments(COLLECTIONS.CATEGORIES, [], 1, 100);
      setCategories(response.documents);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queries = [];

      if (searchTerm) {
        queries.push(Query.search('name', searchTerm));
      }

      if (categoryFilter) {
        queries.push(Query.equal('categoryId', categoryFilter));
      }

      const response = await listDocuments(
        COLLECTIONS.PRODUCTS,
        queries,
        page,
        pageSize
      );

      setProducts(response.documents);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'images',
      label: 'Image',
      render: (images) => {
        if (images && images.length > 0) {
          const imageUrl = getFilePreview(BUCKETS.PRODUCT_IMAGES, images[0], 50, 50);
          return (
            <img
              src={imageUrl}
              alt="Product"
              className="w-10 h-10 rounded object-cover"
            />
          );
        }
        return (
          <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-500 text-sm">
              image
            </span>
          </div>
        );
      },
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
    },
    {
      key: 'categoryId',
      label: 'Category',
      render: (categoryId) => {
        const category = categories.find((cat) => cat.$id === categoryId);
        return category ? category.name : '-';
      },
    },
    {
      key: 'price',
      label: 'Price',
      render: (price) => '$' + price.toFixed(2),
    },
    {
      key: 'inventory',
      label: 'Inventory',
      render: (inventory, row) => {
        const isLowStock = row.lowStockThreshold && inventory < row.lowStockThreshold;
        return (
          <div className="flex items-center gap-2">
            <span>{inventory}</span>
            {isLowStock && (
              <Badge variant="warning" size="sm">
                Low Stock
              </Badge>
            )}
          </div>
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
              router.push('/products/' + id);
            }}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        action={
          <Button
            variant="primary"
            icon="add"
            onClick={() => router.push('/products/new')}
          >
            Add Product
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 bg-sidebar border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.$id} value={cat.$id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <Table
        columns={columns}
        data={products}
        loading={loading}
        onRowClick={(row) => router.push('/products/' + row.$id)}
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
