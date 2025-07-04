
import { useState, useCallback } from 'react';
import { Message, Transaction, ChatState, ConversationMemory } from '@/types/chatbot';
import { sheetDbService } from '@/services/sheetDbService';
import { validateEmail } from '@/utils/validation';
import { generateResponse } from '@/utils/responseGenerator';
import { 
  shouldInitiateRefund, 
  generateNextRefundId, 
  createRefundInitiation, 
  generateRefundInitiationMessage 
} from '@/utils/refundOperations';

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to our Airline Service Bot! To assist you better, please provide your email address.',
      type: 'bot',
      timestamp: new Date()
    }
  ]);
  const [currentState, setCurrentState] = useState<ChatState>(ChatState.EMAIL_COLLECTION);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [queryInput, setQueryInput] = useState('');
  
  // Enhanced conversation memory
  const [conversationMemory, setConversationMemory] = useState<ConversationMemory>({
    lastIntent: null,
    askedTopics: [],
    userPreferences: {},
    contextData: {},
    conversationHistory: []
  });

  const addMessage = useCallback((content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const sendMessage = useCallback(async (content: string, messageType: 'email' | 'query') => {
    addMessage(content, 'user');
    setIsLoading(true);

    try {
      if (messageType === 'email') {
        if (!validateEmail(content)) {
          addMessage('Please enter a valid email address.', 'bot');
          setIsLoading(false);
          return;
        }

        setEmail(content);
        const userTransactions = await sheetDbService.getTransactionsByEmail(content);
        
        if (userTransactions.length === 0) {
          addMessage('Sorry, we couldn\'t find any transactions associated with this email. Please verify your email address or contact customer support.', 'bot');
          setCurrentState(ChatState.EMAIL_COLLECTION);
        } else {
          setTransactions(userTransactions);
          addMessage(`Found ${userTransactions.length} transaction(s) for your email. Please select a transaction to continue:`, 'bot');
          setCurrentState(ChatState.TRANSACTION_SELECTION);
        }
      }
    } catch (error) {
      addMessage('Sorry, there was an error processing your request. Please try again.', 'bot');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const selectTransaction = useCallback(async (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLoading(true);
    
    // Check if this transaction qualifies for automatic refund initiation
    if (shouldInitiateRefund(transaction)) {
      try {
        // Generate next refund ID
        const newRefundId = generateNextRefundId(transactions);
        
        // Create refund initiation data
        const refundData = createRefundInitiation(transaction, newRefundId);
        
        // Attempt to update the backend/sheet (non-blocking)
        const updateSuccess = await sheetDbService.createRefundRequest(refundData);
        
        // Update local transaction state
        const updatedTransaction = {
          ...transaction,
          refund_id: newRefundId,
          refund_status: 'Initiated',
          refund_amount: transaction.total_amount_paid,
          refund_date: refundData.refund_date,
          refund_mode: refundData.refund_mode
        };
        
        setSelectedTransaction(updatedTransaction);
        
        // Update the transactions list to reflect the change
        setTransactions(prev => prev.map(t => 
          t.transaction_id === transaction.transaction_id ? updatedTransaction : t
        ));
        
        // Generate and display refund initiation message
        const refundMessage = generateRefundInitiationMessage(transaction, newRefundId);
        addMessage(refundMessage, 'bot');
        
        if (!updateSuccess) {
          addMessage('Note: The refund request has been initiated locally. Please contact customer service to ensure it\'s processed in our system.', 'bot');
        }
        
      } catch (error) {
        console.error('Error initiating refund:', error);
        addMessage(`Selected booking ${transaction.booking_id}. I notice there may be an issue with your PNR generation. What would you like to know about this transaction?`, 'bot');
      }
    } else {
      addMessage(`Selected booking ${transaction.booking_id}. What would you like to know about this transaction?`, 'bot');
    }
    
    setCurrentState(ChatState.QUERY_HANDLING);
    setIsLoading(false);
  }, [addMessage, transactions]);

  const handleQuery = useCallback(async (query: string) => {
    if (!selectedTransaction) return;

    addMessage(query, 'user');
    setIsLoading(true);

    try {
      // Use enhanced response generation with conversation memory
      const response = generateResponse(query, selectedTransaction, conversationMemory);
      addMessage(response, 'bot');
      
      // Update conversation memory state
      setConversationMemory(prev => ({
        ...prev,
        contextData: {
          ...prev.contextData,
          lastQuery: query,
          lastResponse: response,
          queryTimestamp: new Date().toISOString()
        }
      }));
      
    } catch (error) {
      addMessage('I apologize, but I encountered an error processing your request. Please try again or contact our support team for assistance.', 'bot');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTransaction, addMessage, conversationMemory]);

  return {
    messages,
    currentState,
    isLoading,
    email,
    transactions,
    selectedTransaction,
    queryInput,
    conversationMemory,
    setQueryInput,
    sendMessage,
    setEmail,
    selectTransaction,
    handleQuery
  };
};
