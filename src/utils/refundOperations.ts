import { Transaction } from '@/types/chatbot';

/**
 * Checks if a transaction meets the criteria for automatic refund initiation
 * Criteria: PNR generation failed, refund status is null/empty
 */
export const shouldInitiateRefund = (transaction: Transaction): boolean => {
  const hasPNRFailure = !transaction.pnr || 
                       transaction.pnr.trim() === '' || 
                       transaction.pnr.toLowerCase() === 'failed' ||
                       transaction.pnr.toLowerCase() === 'not generated';
  const hasNoRefundStatus = !transaction.refund_status || transaction.refund_status.trim() === '';

  return hasPNRFailure && hasNoRefundStatus;
};

/**
 * Generates the next refund ID by incrementing the highest existing refund_id
 * Fetches all transactions to ensure we get the true maximum refund ID
 */
export const generateNextRefundId = async (): Promise<string> => {
  try {
    const response = await fetch('https://sheetdb.io/api/v1/rmbktpz2h5o0j');
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format from API');
    }
    
    const maxNum = Math.max(...data.map((row: any) => {
      if (!row.refund_id) return 0;
      const match = row.refund_id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }));
    
    // If no refund IDs exist, start with 10001
    const nextNumber = maxNum > 0 ? maxNum + 1 : 10001;
    return `RFND${nextNumber}`;
  } catch (error) {
    console.error('Error fetching refund IDs:', error);
    // Fallback to default logic if API fails
    return `RFND10001`;
  }
};

/**
 * Creates a refund initiation object with the new refund details
 */
export const createRefundInitiation = (transaction: Transaction, newRefundId: string) => {
  return {
    transaction_id: transaction.transaction_id,
    refund_id: newRefundId,
    refund_status: 'Initiated',
    refund_amount: transaction.total_amount_paid,
    refund_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    refund_mode: transaction.payment_instrument || 'Original Payment Method'
  };
};

/**
 * Generates a user-friendly message about the refund initiation
 */
export const generateRefundInitiationMessage = (transaction: Transaction, refundId: string): string => {
  return `We are initiating the refund.

I notice that your PNR generation failed for booking ${transaction.booking_id}. We've automatically initiated a refund request for you.

Refund Details:
- Refund ID: ${refundId}
- Amount: $${transaction.total_amount_paid}
- Status: Initiated
- Expected processing time: 5-7 business days

The refund will be processed back to your original payment method (${transaction.payment_instrument}). You'll receive an email confirmation shortly with further details.

Is there anything else I can help you with regarding this refund?`;
};
