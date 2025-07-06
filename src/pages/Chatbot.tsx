
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Plane, Eye, EyeOff, Loader2, Printer, X } from 'lucide-react';
import { ChatMessage } from '@/components/chatbot/ChatMessage';
import { TransactionList } from '@/components/chatbot/TransactionList';
import { QuerySuggestions } from '@/components/chatbot/QuerySuggestions';
import { FlightTicketDetails } from '@/components/chatbot/FlightTicketDetails';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatState } from '@/types/chatbot';
import { printTicketPDF } from '@/utils/printTicket';

const Chatbot = () => {
  const {
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
  } = useChatbot();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(false);

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
    
    if (currentState === ChatState.QUERY_HANDLING && selectedTransaction) {
      setShowSuggestions(value.trim().length > 0 || value.length === 0);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(''); // Clear the input box
    setShowSuggestions(false);
    handleQuery(suggestion);
  };

  const handleInputFocus = () => {
    if (currentState === ChatState.QUERY_HANDLING && selectedTransaction) {
      setShowSuggestions(true);
    }
  };

  const toggleTicketDetails = () => {
    setShowTicketDetails(!showTicketDetails);
  };

  const handlePrintTicket = () => {
    if (selectedTransaction) {
      printTicketPDF(selectedTransaction);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Flight Assistant
              </h1>
              <p className="text-slate-600 font-medium mt-1">
                Your intelligent travel companion
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Chat Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Messages Area */}
              <div className="h-[500px] overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-white to-slate-50/30">
                {messages.map((message, index) => (
                  <div key={index}>
                    <ChatMessage message={message} />
                  </div>
                ))}

                {/* Transaction List */}
                {currentState === ChatState.TRANSACTION_SELECTION && transactions.length > 0 && (
                  <div>
                    <TransactionList 
                      transactions={transactions} 
                      onSelect={selectTransaction}
                    />
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-center justify-center gap-3 py-12">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                    <span className="text-slate-600 font-semibold">Processing your request...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-100 p-6 bg-white">
                {/* Quick Actions for Selected Transaction */}
                {currentState === ChatState.QUERY_HANDLING && selectedTransaction && (
                  <div className="flex items-center justify-between mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <Plane className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-lg">{selectedTransaction.flight_number}</div>
                        <div className="text-slate-600 font-medium">{selectedTransaction.departure_airport} → {selectedTransaction.arrival_airport}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={toggleTicketDetails}
                        size="sm"
                        variant="outline"
                        className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold shadow-sm transition-all duration-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        onClick={handlePrintTicket}
                        size="sm"
                        variant="outline"
                        className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold shadow-sm transition-all duration-200"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                )}

                {/* Suggestions Area - Above Input */}
                {currentState === ChatState.QUERY_HANDLING && selectedTransaction && (
                  <div className="mb-6">
                    <QuerySuggestions 
                      queryInput={inputValue}
                      onSuggestionClick={handleSuggestionClick}
                      isVisible={true}
                      transaction={selectedTransaction}
                      conversationMemory={conversationMemory}
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      placeholder={
                        currentState === ChatState.EMAIL_COLLECTION 
                          ? "Enter your email address..." 
                          : "Ask me anything about your booking..."
                      }
                      className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-500 rounded-xl px-5 py-4 text-base font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm"
                      disabled={isLoading || currentState === ChatState.TRANSACTION_SELECTION}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim() || currentState === ChatState.TRANSACTION_SELECTION}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 rounded-xl px-8 py-4 shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

          {/* Flight Ticket Details Modal */}
          {selectedTransaction && showTicketDetails && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
                <div className="border-b border-slate-100 p-6 bg-gradient-to-r from-slate-50 to-blue-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Ticket Details</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handlePrintTicket}
                      variant="outline"
                      size="sm"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold shadow-sm"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                    <Button
                      onClick={toggleTicketDetails}
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-semibold"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-8">
                  <FlightTicketDetails transaction={selectedTransaction} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
