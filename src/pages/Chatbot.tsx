
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/components/chatbot/ChatMessage';
import { TransactionList } from '@/components/chatbot/TransactionList';
import { QuerySuggestions } from '@/components/chatbot/QuerySuggestions';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatState } from '@/types/chatbot';

const Chatbot = () => {
  const {
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
  } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (currentState === ChatState.EMAIL_COLLECTION) {
      await sendMessage(inputValue, 'email');
    } else if (currentState === ChatState.QUERY_HANDLING && selectedTransaction) {
      await handleQuery(inputValue);
    }
    
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Show suggestions only when in query handling state and user is typing
    if (currentState === ChatState.QUERY_HANDLING && selectedTransaction) {
      setShowSuggestions(value.trim().length > 0);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    handleQuery(suggestion);
  };

  const handleInputFocus = () => {
    if (currentState === ChatState.QUERY_HANDLING && selectedTransaction && inputValue.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center border-b border-[#E9E9E8] pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bot className="w-8 h-8 text-[#2E95E5]" />
            <h1 className="text-2xl font-semibold text-[#37352F]">Airline Service Bot</h1>
          </div>
          <p className="text-[#6B6B6B]">Get instant help with your flight bookings and refunds</p>
        </div>

        {/* Chat Container */}
        <div className="bg-[#F7F6F3] rounded-lg border border-[#E9E9E8] shadow-sm">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}

            {/* Transaction List */}
            {currentState === ChatState.TRANSACTION_SELECTION && transactions.length > 0 && (
              <TransactionList 
                transactions={transactions} 
                onSelect={selectTransaction}
              />
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-[#6B6B6B]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-[#E9E9E8] p-4">
            <div className="relative">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={handleInputFocus}
                    placeholder={
                      currentState === ChatState.EMAIL_COLLECTION 
                        ? "Enter your email address..." 
                        : "Type your question..."
                    }
                    className="border-[#E9E9E8] focus:border-[#2E95E5] focus:ring-[#2E95E5]"
                    disabled={isLoading || currentState === ChatState.TRANSACTION_SELECTION}
                  />
                  
                  {/* Query Suggestions Dropdown */}
                  <QuerySuggestions 
                    queryInput={inputValue}
                    onSuggestionClick={handleSuggestionClick}
                    isVisible={showSuggestions}
                    onClose={() => setShowSuggestions(false)}
                  />
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim() || currentState === ChatState.TRANSACTION_SELECTION}
                  className="bg-[#2E95E5] hover:bg-[#2680C4] text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
