'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { listDocuments, updateDocument } from '@/lib/appwrite/database';
import { COLLECTIONS, Query } from '@/lib/appwrite/client';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function AlertList({ limit = 5 }) {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queries = [
        Query.equal('isRead', false),
        Query.orderDesc('$createdAt')
      ];
      
      if (limit) {
        queries.push(Query.limit(limit));
      }
      
      const response = await listDocuments(COLLECTIONS.ALERTS, queries);
      setAlerts(response.documents);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      await updateDocument(COLLECTIONS.ALERTS, alertId, { isRead: true });
      setAlerts(alerts.filter(alert => alert.$id !== alertId));
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  };

  const handleAlertClick = async (alert) => {
    // Mark as read
    await markAsRead(alert.$id);
    
    // Navigate to related product
    if (alert.productId) {
      router.push(`/products/${alert.productId}`);
    }
  };

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-sidebar rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded">
        {error}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-slate-400 text-sm p-4 text-center bg-sidebar rounded">
        No unread alerts
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.$id}
          className="bg-sidebar p-3 rounded hover:bg-[#1f3142] transition-colors cursor-pointer group"
          onClick={() => handleAlertClick(alert)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={getSeverityVariant(alert.severity)} size="sm">
                  {alert.severity}
                </Badge>
                <span className="text-xs text-slate-400">
                  {alert.type}
                </span>
              </div>
              <p className="text-sm text-white mb-1 line-clamp-2">
                {alert.message}
              </p>
              {alert.productName && (
                <p className="text-xs text-slate-400">
                  Product: {alert.productName}
                </p>
              )}
              {alert.currentInventory !== undefined && (
                <p className="text-xs text-slate-400">
                  Current stock: {alert.currentInventory} / Threshold: {alert.threshold}
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(alert.$id);
              }}
              className="text-slate-400 hover:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
