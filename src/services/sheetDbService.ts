import { Transaction } from '@/types/chatbot';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/rmbktpz2h5o0j';

class SheetDbService {
  async getTransactionsByEmail(email: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`${SHEETDB_URL}/search?user_email=${encodeURIComponent(email)}`);
      console.log(`Fetching transactions for email: ${email}`);
      console.log(`Response status: ${response}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetch(SHEETDB_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch all transactions');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      throw error;
    }
  }

  async createRefundRequest(refundData: {
    transaction_id: string;
    refund_id: string;
    refund_status: string;
    refund_amount: number;
    refund_date: string;
    refund_mode: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${SHEETDB_URL}/transaction_id/${refundData.transaction_id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refund_id: refundData.refund_id,
          refund_status: refundData.refund_status,
          refund_amount: refundData.refund_amount,
          refund_date: refundData.refund_date,
          refund_mode: refundData.refund_mode
        })
      });

      if (!response.ok) {
        console.warn('Failed to update refund in SheetDB, continuing with local state update');
        return false;
      }

      console.log('Refund request created successfully:', refundData.refund_id);
      return true;
    } catch (error) {
      console.error('Error creating refund request:', error);
      return false;
    }
  }
}

export const sheetDbService = new SheetDbService();
