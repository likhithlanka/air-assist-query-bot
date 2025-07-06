
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Plane, Eye, EyeOff, Loader2, Printer, X, HelpCircle, RefreshCw, AlertCircle } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [inputError, setInputError] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input after state changes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentState, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      setInputError('Please enter a message');
      return;
    }

    setInputError('');
    setIsTyping(true);

    try {
      if (currentState === ChatState.EMAIL_COLLECTION) {
        await sendMessage(inputValue, 'email');
      } else if (currentState === ChatState.QUERY_HANDLING && selectedTransaction) {
        await handleQuery(inputValue);
      }
      
      setInputValue('');
      setShowSuggestions(false);
    } catch (error) {
      setInputError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInputError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setInputError('');
    
    if (currentState === ChatState.QUERY_HANDLING && selectedTransaction) {
      setShowSuggestions(value.trim().length > 0 || value.length === 0);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue('');
    setShowSuggestions(false);
    setInputError('');
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

  const resetChat = () => {
    window.location.reload();
  };

  const getStateDescription = () => {
    switch (currentState) {
      case ChatState.EMAIL_COLLECTION:
        return "Enter your email address to find your bookings";
      case ChatState.TRANSACTION_SELECTION:
        return "Select a booking to get help with";
      case ChatState.QUERY_HANDLING:
        return "Ask me anything about your selected booking";
      default:
        return "Getting started...";
    }
  };

  const getInputPlaceholder = () => {
    switch (currentState) {
      case ChatState.EMAIL_COLLECTION:
        return "Enter your email address (e.g., john@example.com)";
      case ChatState.QUERY_HANDLING:
        return "Ask about refunds, flight details, seat changes...";
      default:
        return "Type your message...";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Enhanced Header with Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-blue-100">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  Flight Assistant
                </h1>
                <p className="text-slate-600 font-medium text-sm md:text-base">
                  {getStateDescription()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowHelp(!showHelp)}
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button
                onClick={resetChat}
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-4">
            {[ChatState.EMAIL_COLLECTION, ChatState.TRANSACTION_SELECTION, ChatState.QUERY_HANDLING].map((state, index) => (
              <div key={state} className="flex items-center">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentState === state 
                    ? 'bg-blue-500 ring-4 ring-blue-100' 
                    : Object.values(ChatState).indexOf(currentState) > index
                      ? 'bg-green-500'
                      : 'bg-slate-200'
                }`} />
                {index < 2 && (
                  <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                    Object.values(ChatState).indexOf(currentState) > index ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Help Panel */}
          {showHelp && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 animate-fade-in">
              <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Enter your email to find your flight bookings</li>
                <li>• Select a booking you need help with</li>
                <li>• Ask questions about refunds, changes, or flight details</li>
                <li>• Use suggested questions for quick answers</li>
              </ul>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Enhanced Chat Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-xl overflow-hidden">
            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-6 md:p-8 space-y-6 bg-gradient-to-b from-white/50 to-slate-50/30 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Welcome! Let's get started.</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={index} className="animate-fade-in">
                  <ChatMessage message={message} />
                </div>
              ))}

              {/* Transaction List */}
              {currentState === ChatState.TRANSACTION_SELECTION && transactions.length > 0 && (
                <div className="animate-fade-in">
                  <TransactionList 
                    transactions={transactions} 
                    onSelect={selectTransaction}
                  />
                </div>
              )}

              {/* Enhanced Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center gap-4 py-8">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                  <div>
                    <span className="text-slate-700 font-semibold block">Processing your request</span>
                    <span className="text-slate-500 text-sm">This may take a few seconds...</span>
                  </div>
                </div>
              )}

              {/* Empty State for No Transactions */}
              {currentState === ChatState.TRANSACTION_SELECTION && transactions.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">No bookings found</h3>
                  <p className="text-slate-500 text-sm mb-4">We couldn't find any bookings for this email address.</p>
                  <Button onClick={resetChat} variant="outline" size="sm">
                    Try another email
                  </Button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="border-t border-slate-100/50 bg-white/90 backdrop-blur-sm">
              {/* Quick Actions for Selected Transaction */}
              {currentState === ChatState.QUERY_HANDLING && selectedTransaction && (
                <div className="px-6 pt-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-100/50 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                        <Plane className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-lg">{selectedTransaction.flight_number}</div>
                        <div className="text-slate-600 font-medium text-sm">{selectedTransaction.departure_airport} → {selectedTransaction.arrival_airport}</div>
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
                        Details
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
                </div>
              )}

              {/* Suggestions Area */}
              {currentState === ChatState.QUERY_HANDLING && selectedTransaction && (
                <div className="px-6 pt-4">
                  <QuerySuggestions 
                    queryInput={inputValue}
                    onSuggestionClick={handleSuggestionClick}
                    isVisible={true}
                    transaction={selectedTransaction}
                    conversationMemory={conversationMemory}
                  />
                </div>
              )}

              {/* Input Section */}
              <div className="p-6">
                {inputError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-fade-in">
                    {inputError}
                  </div>
                )}

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      placeholder={getInputPlaceholder()}
                      className={`bg-white/90 backdrop-blur-sm border-slate-200 text-slate-800 placeholder:text-slate-500 rounded-2xl px-6 py-4 text-base font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm ${
                        inputError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
                      }`}
                      disabled={isLoading || currentState === ChatState.TRANSACTION_SELECTION}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim() || currentState === ChatState.TRANSACTION_SELECTION}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 rounded-2xl px-6 py-4 shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 hover:shadow-xl hover:-translate-y-0.5 min-w-[60px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Input Helper Text */}
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Press Enter to send, Escape to clear</span>
                  {currentState === ChatState.QUERY_HANDLING && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Ready to help
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Flight Ticket Details Modal */}
          {selectedTransaction && showTicketDetails && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in">
                <div className="border-b border-slate-100 p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Flight Details</h3>
                      <p className="text-slate-600 font-medium">{selectedTransaction.flight_number}</p>
                    </div>
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
                <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
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
