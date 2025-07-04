
import { Transaction } from '@/types/chatbot';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/rmbktpz2h5o0j';

class SheetDbService {
  async getTransactionsByEmail(email: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`${SHEETDB_URL}/search?user_email=${encodeURIComponent(email)}`);
      
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
}

export const sheetDbService = new SheetDbService();
