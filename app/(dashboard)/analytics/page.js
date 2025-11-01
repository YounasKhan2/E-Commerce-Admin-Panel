'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import DateRangeSelector from '@/components/analytics/DateRangeSelector';
import MetricCard from '@/components/analytics/MetricCard';
import CategorySalesChart from '@/components/analytics/CategorySalesChart';
import PaymentStatusChart from '@/components/analytics/PaymentStatusChart';
import Button from '@/components/ui/Button';
import { listDocuments } from '@/lib/appwrite/database';
import { COLLECTIONS } from '@/lib/appwrite/client';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { exportOrdersToCSV } from '@/lib/utils/csvExport';
import { Query } from 'appwrite';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const last30 = new Date(now);
    last30.setDate(last30.getDate() - 30);
    return {
      startDate: last30.toISOString(),
      endDate: now.toISOString(),
      preset: 'last30days'
    };
  });

  const [loading, setLoading] = useState(true);
  const [salesMetrics, setSalesMetrics] = useState({
    totalSales: 0,
    orderCount: 0,
    averageOrderValue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSalesMetrics(),
        fetchCategorySales(),
        fetchPaymentStatusDistribution(),
      ]);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesMetrics = async () => {
    try {
      const ordersResponse = await listDocuments(
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual('$createdAt', dateRange.startDate),
          Query.lessThanEqual('$createdAt', dateRange.endDate),
          Query.equal('paymentStatus', 'paid'),
        ],
        1,
        1000
      );

      const totalSales = ordersResponse.documents.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      const orderCount = ordersResponse.documents.length;
      const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

      setSalesMetrics({
        totalSales,
        orderCount,
        averageOrderValue,
      });
      
      // Store orders for export
      setOrders(ordersResponse.documents);
    } catch (error) {
      console.error('Error fetching sales metrics:', error);
    }
  };

  const fetchCategorySales = async () => {
    try {
      // Fetch all paid orders in the date range
      const ordersResponse = await listDocuments(
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual('$createdAt', dateRange.startDate),
          Query.lessThanEqual('$createdAt', dateRange.endDate),
          Query.equal('paymentStatus', 'paid'),
        ],
        1,
        1000
      );

      // Fetch all order items for these orders
      const orderIds = ordersResponse.documents.map(order => order.$id);
      
      if (orderIds.length === 0) {
        setCategorySales([]);
        return;
      }

      // Fetch order items
      const orderItemsResponse = await listDocuments(
        COLLECTIONS.ORDER_ITEMS,
        [Query.equal('orderId', orderIds)],
        1,
        5000
      );

      // Fetch all products to get category information
      const productIds = [...new Set(orderItemsResponse.documents.map(item => item.productId))];
      const productsMap = {};
      
      // Fetch products in batches
      for (let i = 0; i < productIds.length; i += 25) {
        const batch = productIds.slice(i, i + 25);
        const productsResponse = await listDocuments(
          COLLECTIONS.PRODUCTS,
          [Query.equal('$id', batch)],
          1,
          25
        );
        productsResponse.documents.forEach(product => {
          productsMap[product.$id] = product;
        });
      }

      // Fetch all categories
      const categoriesResponse = await listDocuments(
        COLLECTIONS.CATEGORIES,
        [],
        1,
        100
      );
      const categoriesMap = {};
      categoriesResponse.documents.forEach(category => {
        categoriesMap[category.$id] = category.name;
      });

      // Group sales by category
      const categoryData = {};
      
      orderItemsResponse.documents.forEach(item => {
        const product = productsMap[item.productId];
        if (!product) return;

        const categoryId = product.categoryId || 'uncategorized';
        const categoryName = categoryId === 'uncategorized' 
          ? 'Uncategorized' 
          : (categoriesMap[categoryId] || 'Unknown');
        
        if (!categoryData[categoryId]) {
          categoryData[categoryId] = {
            categoryId,
            categoryName,
            revenue: 0,
            orderCount: 0,
            orderIds: new Set(),
          };
        }

        categoryData[categoryId].revenue += (item.price * item.quantity);
        categoryData[categoryId].orderIds.add(item.orderId);
      });

      // Convert to array and calculate order counts
      const categorySalesArray = Object.values(categoryData).map(cat => ({
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        revenue: cat.revenue,
        orderCount: cat.orderIds.size,
      }));

      // Sort by revenue descending
      categorySalesArray.sort((a, b) => b.revenue - a.revenue);

      setCategorySales(categorySalesArray);
    } catch (error) {
      console.error('Error fetching category sales:', error);
      setCategorySales([]);
    }
  };

  const fetchPaymentStatusDistribution = async () => {
    try {
      // Fetch all orders in the date range
      const ordersResponse = await listDocuments(
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual('$createdAt', dateRange.startDate),
          Query.lessThanEqual('$createdAt', dateRange.endDate),
        ],
        1,
        1000
      );

      // Group orders by payment status
      const paymentStatusMap = {};
      
      ordersResponse.documents.forEach(order => {
        const status = order.paymentStatus || 'pending';
        
        if (!paymentStatusMap[status]) {
          paymentStatusMap[status] = {
            status,
            count: 0,
            amount: 0,
          };
        }
        
        paymentStatusMap[status].count += 1;
        paymentStatusMap[status].amount += (order.totalAmount || 0);
      });

      // Convert to array format for chart
      const totalOrders = ordersResponse.documents.length;
      const paymentStatusArray = Object.values(paymentStatusMap).map(item => ({
        status: item.status,
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        value: item.count,
        amount: item.amount,
        percentage: totalOrders > 0 ? ((item.count / totalOrders) * 100).toFixed(1) : 0,
      }));

      // Sort by count descending
      paymentStatusArray.sort((a, b) => b.value - a.value);

      setPaymentStatusData(paymentStatusArray);
    } catch (error) {
      console.error('Error fetching payment status distribution:', error);
      setPaymentStatusData([]);
    }
  };

  const handleExportCSV = async () => {
    try {
      // Fetch all orders with customer data for the selected period
      const ordersResponse = await listDocuments(
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual('$createdAt', dateRange.startDate),
          Query.lessThanEqual('$createdAt', dateRange.endDate),
        ],
        1,
        1000
      );

      // Fetch customer data for each order
      const ordersWithCustomers = await Promise.all(
        ordersResponse.documents.map(async (order) => {
          if (order.customerId) {
            try {
              const customer = await listDocuments(
                COLLECTIONS.CUSTOMERS,
                [Query.equal('$id', order.customerId)],
                1,
                1
              );
              return {
                ...order,
                customer: customer.documents[0] || {}
              };
            } catch (error) {
              console.error('Error fetching customer:', error);
              return { ...order, customer: {} };
            }
          }
          return { ...order, customer: {} };
        })
      );

      // Generate filename with date range
      const startDate = new Date(dateRange.startDate).toISOString().split('T')[0];
      const endDate = new Date(dateRange.endDate).toISOString().split('T')[0];
      const filename = `orders-${startDate}-to-${endDate}.csv`;

      // Export to CSV
      exportOrdersToCSV(ordersWithCustomers, filename);
    } catch (error) {
      console.error('Error exporting orders:', error);
      alert('Failed to export orders. Please try again.');
    }
  };

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Comprehensive sales reports and business insights"
      />

      {/* Date Range Selector */}
      <div className="mb-6">
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {/* Sales Overview Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Sales Overview</h2>
          <Button
            variant="secondary"
            size="sm"
            icon="download"
            onClick={handleExportCSV}
            disabled={loading || orders.length === 0}
          >
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <MetricCard
            label="Total Sales"
            value={formatCurrency(salesMetrics.totalSales)}
            icon="payments"
            loading={loading}
          />
          <MetricCard
            label="Order Count"
            value={formatNumber(salesMetrics.orderCount)}
            icon="shopping_cart"
            loading={loading}
          />
          <MetricCard
            label="Average Order Value"
            value={formatCurrency(salesMetrics.averageOrderValue)}
            icon="receipt_long"
            loading={loading}
          />
        </div>
      </div>

      {/* Sales by Category Section */}
      <div className="mb-8 bg-sidebar border border-slate-700 rounded-xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4">
          Sales by Category
        </h2>
        
        {/* Bar Chart */}
        <div className="mb-6">
          <CategorySalesChart data={categorySales} loading={loading} />
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                  Category
                </th>
                <th className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                  Revenue
                </th>
                <th className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                  Orders
                </th>
                <th className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                  Avg Order Value
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : categorySales.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400 text-sm">
                    No category sales data available
                  </td>
                </tr>
              ) : (
                categorySales.map((category) => (
                  <tr
                    key={category.categoryId}
                    className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-white text-sm">{category.categoryName}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-white text-sm font-medium">
                        {formatCurrency(category.revenue)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-slate-300 text-sm">
                        {formatNumber(category.orderCount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-slate-300 text-sm">
                        {formatCurrency(category.revenue / category.orderCount)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Status Distribution Section */}
      <div className="bg-sidebar border border-slate-700 rounded-xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4">
          Payment Status Distribution
        </h2>
        
        {/* Pie Chart */}
        <div className="mb-6">
          <PaymentStatusChart data={paymentStatusData} loading={loading} />
        </div>

        {/* Payment Status Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                  Status
                </th>
                <th className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                  Order Count
                </th>
                <th className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                  Total Amount
                </th>
                <th className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider py-3 px-4">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : paymentStatusData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400 text-sm">
                    No payment data available
                  </td>
                </tr>
              ) : (
                paymentStatusData.map((item) => (
                  <tr
                    key={item.status}
                    className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-white text-sm capitalize">{item.name}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-white text-sm font-medium">
                        {formatNumber(item.value)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-slate-300 text-sm">
                        {formatCurrency(item.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-slate-300 text-sm">
                        {item.percentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
