'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { generateInvoice } from '@/lib/appwrite/functions';
import { getFileDownload } from '@/lib/appwrite/storage';
import { BUCKETS } from '@/lib/appwrite/client';

/**
 * InvoiceButton Component
 * Displays invoice actions based on whether invoice exists
 * @param {Object} order - Order object with invoice data
 * @param {Function} onInvoiceGenerated - Callback when invoice is generated
 */
export default function InvoiceButton({ order, onInvoiceGenerated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasInvoice = order?.invoiceUrl;

  const handleGenerateInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare order data for invoice generation
      const invoiceData = {
        orderId: order.$id,
        orderNumber: order.orderNumber,
        orderDate: order.$createdAt,
        customerId: order.customerId,
        customerName: order.customerName || 'Customer',
        customerEmail: order.customerEmail || '',
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        items: order.items || [],
        subtotalAmount: order.subtotalAmount || 0,
        taxAmount: order.taxAmount || 0,
        shippingAmount: order.shippingAmount || 0,
        discountAmount: order.discountAmount || 0,
        totalAmount: order.totalAmount || 0
      };

      // Call generateInvoice function
      const response = await generateInvoice(invoiceData);
      
      // Parse response to get file ID
      let fileId = null;
      if (response.responseBody) {
        try {
          const result = JSON.parse(response.responseBody);
          fileId = result.fileId || result.invoiceFileId;
        } catch (e) {
          console.error('Error parsing invoice response:', e);
        }
      }

      // Notify parent component
      if (onInvoiceGenerated && fileId) {
        onInvoiceGenerated(fileId);
      }

    } catch (err) {
      console.error('Error generating invoice:', err);
      setError('Failed to generate invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    try {
      if (!hasInvoice) return;

      // Get download URL and trigger download
      const downloadUrl = getFileDownload(BUCKETS.INVOICES, order.invoiceUrl);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `invoice-${order.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Error downloading invoice:', err);
      setError('Failed to download invoice. Please try again.');
    }
  };

  const handleEmailInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement email invoice functionality
      // This would typically call another Appwrite function to send email
      alert('Email invoice functionality coming soon!');

    } catch (err) {
      console.error('Error emailing invoice:', err);
      setError('Failed to email invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!hasInvoice ? (
          <Button
            variant="primary"
            size="sm"
            icon="description"
            onClick={handleGenerateInvoice}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Invoice'}
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              size="sm"
              icon="download"
              onClick={handleDownloadInvoice}
              disabled={loading}
            >
              Download Invoice
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon="email"
              onClick={handleEmailInvoice}
              disabled={loading}
            >
              Email Invoice
            </Button>
          </>
        )}
      </div>

      {hasInvoice && (
        <div className="text-xs text-slate-400">
          Invoice generated and ready for download
        </div>
      )}
    </div>
  );
}
