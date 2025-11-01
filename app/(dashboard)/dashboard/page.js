'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import MetricCard from '@/components/analytics/MetricCard';
import DateRangeSelector from '@/components/analytics/DateRangeSelector';
import RevenueChart from '@/components/analytics/RevenueChart';
import OrderChart from '@/components/analytics/OrderChart';
import TopProducts from '@/components/analytics/TopProducts';
import { listDocuments } from '@/lib/appwrite/database';
import { COLLECTIONS } from '@/lib/appwrite/client';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Query } from 'appwrite';

export default function DashboardPage() {
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

  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    orderCount: 0,
    averageOrderValue: 0,
    revenueChange: 0,
    orderChange: 0,
    aovChange: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMetrics(),
        fetchRecentOrders(),
        fetchLowStockProducts(),
        fetchRevenueData(),
        fetchOrderStatusData(),
        fetchTopProducts(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Fetch orders for current period
      const currentOrders = await listDocuments(
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual('$createdAt', dateRange.startDate),
          Query.lessThanEqual('$createdAt', dateRange.endDate),
          Query.equal('paymentStatus', 'paid'),
        ],
        1,
        1000
      );

      // Calculate current period metrics
      const totalRevenue = currentOrders.documents.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      const orderCount = currentOrders.documents.length;
      const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

      // Calculate previous period for comparison
      const periodLength = new Date(dateRange.endDate) - new Date(dateRange.startDate);
      const previousStart = new Date(new Date(dateRange.startDate) - periodLength);
      const previousEnd = new Date(dateRange.startDate);

      const previousOrders = await listDocuments(
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual('$createdAt', previousStart.toISOString()),
          Query.lessThanEqual('$createdAt', previousEnd.toISOString()),
          Query.equal('paymentStatus', 'paid'),
        ],
        1,
        1000
      );

      const previousRevenue = previousOrders.documents.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      const previousOrderCount = previousOrders.documents.length;
      const previousAOV = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0;

      // Calculate percentage changes
      const revenueChange = previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;
      const orderChange = previousOrderCount > 0
        ? ((orderCount - previousOrderCount) / previousOrderCount) * 100
        : 0;
      const aovChange = previousAOV > 0
        ? ((averageOrderValue - previousAOV) / previousAOV) * 100
        : 0;

      setMetrics({
        totalRevenue,
        orderCount,
        averageOrderValue,
        revenueChange: Math.round(revenueChange * 10) / 10,
        orderChange: Math.round(orderChange * 10) / 10,
        aovChange: Math.round(aovChange * 10) / 10,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const result = await listDocuments(
        COLLECTIONS.ORDERS,
        [Query.orderDesc('$createdAt'), Query.limit(10)],
        1,
        10
      );
      setRecentOrders(result.documents);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const result = await listDocuments(
        COLLECTIONS.PRODUCTS,
        [Query.limit(100)],
        1,
        100
      );
      
      // Filter products where inventory < lowStockThreshold
      const lowStock = result.documents.filter(
        (product) => product.inventory < (product.lowStockThreshold || 10)
      );
      
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      // Fetch all orders in the date range
      const orders = await listDocuments(
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual('$createdAt', dateRange.startDate),
          Query.lessThanEqual('$createdAt', dateRange.endDate),
          Query.equal('paymentStatus', 'paid'),
        ],
        1,
        1000
      );

      // Group orders by date
      const revenueByDate = {};
      orders.documents.forEach((order) => {
        const date = new Date(order.$createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        if (!revenueByDate[date]) {
          revenueByDate[date] = 0;
        }
        revenueByDate[date] += order.totalAmount || 0;
      });

      // Convert to array format for chart
      const chartData = Object.entries(revenueByDate).map(([date, revenue]) => ({
        date,
        revenue,
      }));

      setRevenueData(chartData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const fetchOrderStatusData = async () => {
    try {
      // Fetch all orders in the date range
      const orders = await listDocuments(
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual('$createdAt', dateRange.startDate),
          Query.lessThanEqual('$createdAt', dateRange.endDate),
        ],
        1,
        1000
      );

      // Group orders by status
      const statusCounts = {};
      orders.documents.forEach((order) => {
        const status = order.status || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const totalOrders = orders.documents.length;

      // Convert to array format for chart
      const chartData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        status,
        value: count,
        percentage: totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0,
      }));

      setOrderStatusData(chartData);
    } catch (error) {
      console.error('Error fetching order status data:', error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      // Fetch all order items in the date range
      const orderItems = await listDocuments(
        COLLECTIONS.ORDER_ITEMS,
        [Query.limit(1000)],
        1,
        1000
      );

      // Filter items by orders in date range
      const orders = await listDocuments(
        COLLECTIONS.ORDERS,
        [
          Query.greaterThanEqual('$createdAt', dateRange.startDate),
          Query.lessThanEqual('$createdAt', dateRange.endDate),
          Query.equal('paymentStatus', 'paid'),
        ],
        1,
        1000
      );

      const orderIds = new Set(orders.documents.map((o) => o.$id));
      const relevantItems = orderItems.documents.filter((item) =>
        orderIds.has(item.orderId)
      );

      // Group by product
      const productStats = {};
      relevantItems.forEach((item) => {
        const productId = item.productId;
        if (!productStats[productId]) {
          productStats[productId] = {
            productId,
            productName: item.productName || 'Unknown Product',
            unitsSold: 0,
            revenue: 0,
          };
        }
        productStats[productId].unitsSold += item.quantity || 0;
        productStats[productId].revenue += (item.price || 0) * (item.quantity || 0);
      });

      // Convert to array and sort by revenue
      const productsArray = Object.values(productStats).sort(
        (a, b) => b.revenue - a.revenue
      );

      // Calculate total revenue for percentage
      const totalRevenue = productsArray.reduce((sum, p) => sum + p.revenue, 0);

      // Add percentage and limit to top 10
      const topProducts = productsArray.slice(0, 10).map((product) => ({
        ...product,
        percentage:
          totalRevenue > 0 ? Math.round((product.revenue / totalRevenue) * 100) : 0,
      }));

      setTopProductsData(topProducts);
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  const getTrend = (change) => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to your e-commerce admin panel"
      />

      {/* Date Range Selector */}
      <div className="mb-6">
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MetricCard
          label="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon="payments"
          change={metrics.revenueChange}
          trend={getTrend(metrics.revenueChange)}
          loading={loading}
        />
        <MetricCard
          label="Total Orders"
          value={metrics.orderCount.toString()}
          icon="shopping_cart"
          change={metrics.orderChange}
          trend={getTrend(metrics.orderChange)}
          loading={loading}
        />
        <MetricCard
          label="Average Order Value"
          value={formatCurrency(metrics.averageOrderValue)}
          icon="receipt_long"
          change={metrics.aovChange}
          trend={getTrend(metrics.aovChange)}
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-sidebar border border-slate-700 rounded-xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4">Revenue Trend</h2>
          <RevenueChart data={revenueData} loading={loading} />
        </div>

        {/* Order Status Distribution Chart */}
        <div className="bg-sidebar border border-slate-700 rounded-xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            Order Status Distribution
          </h2>
          <OrderChart data={orderStatusData} loading={loading} />
        </div>
      </div>

      {/* Top Selling Products Section */}
      <div className="mb-8 bg-sidebar border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Top Selling Products</h2>
          <Link
            href="/analytics"
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            View All
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Link>
        </div>
        <TopProducts data={topProductsData} loading={loading} />
      </div>

      {/* Recent Orders Section */}
      <div className="mb-8 bg-sidebar border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Recent Orders</h2>
          <Link
            href="/orders"
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            View All
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-700 rounded animate-pulse"></div>
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">
                    Order #
                  </th>
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">
                    Customer
                  </th>
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 text-slate-400 font-medium">
                    Status
                  </th>
                  <th className="text-right py-3 px-2 text-slate-400 font-medium">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.$id}
                    className="border-b border-slate-700 hover:bg-slate-800/50 cursor-pointer"
                    onClick={() => window.location.href = `/orders/${order.$id}`}
                  >
                    <td className="py-3 px-2 text-white">
                      {order.orderNumber || order.$id.slice(0, 8)}
                    </td>
                    <td className="py-3 px-2 text-slate-300">
                      {order.customerEmail || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-slate-300">
                      {formatDate(order.$createdAt)}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-white font-medium">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">
            No orders yet
          </p>
        )}
      </div>

      {/* Low Stock Alerts Section */}
      <div className="bg-sidebar border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">
            Low Stock Alerts
          </h2>
          <span className="material-symbols-outlined text-slate-400">
            notifications
          </span>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded animate-pulse"></div>
            ))}
          </div>
        ) : lowStockProducts.length > 0 ? (
          <div className="space-y-3">
            {lowStockProducts.slice(0, 5).map((product) => (
              <Link
                key={product.$id}
                href={`/products/${product.$id}`}
                className="flex items-center justify-between p-3 bg-background-dark border border-slate-700 rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-500">
                    warning
                  </span>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="text-slate-400 text-xs">
                      SKU: {product.sku}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400 text-sm font-medium">
                    {product.inventory} left
                  </p>
                  <p className="text-slate-400 text-xs">
                    Threshold: {product.lowStockThreshold || 10}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">
            All products are well stocked
          </p>
        )}
      </div>
    </>
  );
}
