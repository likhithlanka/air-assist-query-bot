
import { useState, useCallback } from 'react';
import { Message, Transaction, ChatState } from '@/types/chatbot';
import { sheetDbService } from '@/services/sheetDbService';
import { validateEmail } from '@/utils/validation';
import { generateResponse } from '@/utils/responseGenerator';

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

  const selectTransaction = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    addMessage(`Selected booking ${transaction.booking_id}. What would you like to know about this transaction?`, 'bot');
    setCurrentState(ChatState.QUERY_HANDLING);
  }, [addMessage]);

  const handleQuery = useCallback(async (query: string) => {
    if (!selectedTransaction) return;

    addMessage(query, 'user');
    setIsLoading(true);

    try {
      const response = generateResponse(query, selectedTransaction);
      addMessage(response, 'bot');
    } catch (error) {
      addMessage('I apologize, but I can only provide information about refund status, flight details, and booking details. For other queries, please contact our support team.', 'bot');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTransaction, addMessage]);

  return {
    messages,
    currentState,
    isLoading,
    email,
    transactions,
    selectedTransaction,
    queryInput,
    setQueryInput,
    sendMessage,
    setEmail,
    selectTransaction,
    handleQuery
  };
};
