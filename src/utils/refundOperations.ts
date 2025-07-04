import { Transaction } from '@/types/chatbot';

/**
 * Checks if a transaction meets the criteria for automatic refund initiation
 * Criteria: PNR generation failed, refund status is null/empty
 */
export const shouldInitiateRefund = (transaction: Transaction): boolean => {
  const hasPNRFailure = !transaction.pnr || transaction.pnr.trim() === '' || transaction.pnr.toLowerCase() === 'failed';
  const hasNoRefundStatus = !transaction.refund_status || transaction.refund_status.trim() === '';

  return hasPNRFailure && hasNoRefundStatus;
};

/**
 * Generates the next refund ID by incrementing the highest existing refund_id
 */
export const generateNextRefundId = (transactions: Transaction[]): string => {
  let maxRefundNumber = 10000; // Default starting number

  transactions.forEach(transaction => {
    if (transaction.refund_id && transaction.refund_id.startsWith('RFND')) {
      const numberPart = transaction.refund_id.replace('RFND', '');
      const refundNumber = parseInt(numberPart, 10);
      if (!isNaN(refundNumber) && refundNumber > maxRefundNumber) {
        maxRefundNumber = refundNumber;
      }
    }
  });

  return `RFND${maxRefundNumber + 1}`;
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

**Refund Details:**
- Refund ID: ${refundId}
- Amount: $${transaction.total_amount_paid}
- Status: Initiated
- Expected processing time: 5-7 business days

The refund will be processed back to your original payment method (${transaction.payment_instrument}). You'll receive an email confirmation shortly with further details.

Is there anything else I can help you with regarding this refund?`;
};
