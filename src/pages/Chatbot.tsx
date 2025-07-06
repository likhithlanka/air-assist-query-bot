
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
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header - Now Aligned with Chat Container */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md ring-2 ring-blue-100">
                  <Plane className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
                    Flight Assistant
                  </h1>
                  <p className="text-slate-600 font-medium text-base leading-relaxed mt-1">
                    {getStateDescription()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowHelp(!showHelp)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-700 h-10 w-10 p-0 rounded-xl"
                >
                  <HelpCircle className="w-5 h-5" />
                </Button>
                <Button
                  onClick={resetChat}
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-700 h-10 w-10 p-0 rounded-xl"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Progress Indicator - Centered and Aligned */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {[ChatState.EMAIL_COLLECTION, ChatState.TRANSACTION_SELECTION, ChatState.QUERY_HANDLING].map((state, index) => (
                <div key={state} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                    currentState === state 
                      ? 'bg-blue-500 ring-4 ring-blue-100 shadow-sm' 
                      : Object.values(ChatState).indexOf(currentState) > index
                        ? 'bg-green-500 shadow-sm'
                        : 'bg-slate-200'
                  }`} />
                  {index < 2 && (
                    <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                      Object.values(ChatState).indexOf(currentState) > index ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Help Panel - Aligned with Container */}
            {showHelp && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 animate-fade-in">
                <h3 className="font-bold text-blue-800 mb-4 text-lg">How it works:</h3>
                <ul className="text-blue-700 space-y-3 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></span>
                    <span>Enter your email to find your flight bookings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></span>
                    <span>Select a booking you need help with</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></span>
                    <span>Ask questions about refunds, changes, or flight details</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></span>
                    <span>Use suggested questions for quick answers</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Chat Container with Perfect Alignment */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
            {/* Messages Area with Improved Alignment */}
            <div className="h-[540px] overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-white/60 to-slate-50/40 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Plane className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Welcome to Flight Assistant</h3>
                  <p className="text-slate-500 font-medium max-w-md">Let's get started by finding your flight bookings.</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={index} className="animate-fade-in">
                  <ChatMessage message={message} />
                </div>
              ))}

              {/* Transaction List with Better Spacing */}
              {currentState === ChatState.TRANSACTION_SELECTION && transactions.length > 0 && (
                <div className="animate-fade-in pt-4">
                  <TransactionList 
                    transactions={transactions} 
                    onSelect={selectTransaction}
                  />
                </div>
              )}

              {/* Centered Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
                  </div>
                  <div className="text-center">
                    <span className="text-slate-700 font-semibold block text-lg">Processing your request</span>
                    <span className="text-slate-500 text-base mt-1">This may take a few seconds...</span>
                  </div>
                </div>
              )}

              {/* Centered Empty State */}
              {currentState === ChatState.TRANSACTION_SELECTION && transactions.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-3 text-lg">No bookings found</h3>
                  <p className="text-slate-500 text-base mb-6 max-w-md">We couldn't find any bookings for this email address.</p>
                  <Button onClick={resetChat} variant="outline" size="sm" className="rounded-xl">
                    Try another email
                  </Button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area with Improved Alignment */}
            <div className="border-t border-slate-100/60 bg-white/95 backdrop-blur-sm">
              {/* Transaction Quick Actions with Better Layout */}
              {currentState === ChatState.QUERY_HANDLING && selectedTransaction && (
                <div className="px-8 pt-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 rounded-2xl border border-blue-100/60 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                        <Plane className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-lg leading-tight">{selectedTransaction.flight_number}</div>
                        <div className="text-slate-600 font-medium text-sm mt-0.5">{selectedTransaction.departure_airport} → {selectedTransaction.arrival_airport}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={toggleTicketDetails}
                        size="sm"
                        variant="outline"
                        className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold shadow-sm transition-all duration-200 rounded-xl h-10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                      <Button
                        onClick={handlePrintTicket}
                        size="sm"
                        variant="outline"
                        className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold shadow-sm transition-all duration-200 rounded-xl h-10"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions with Consistent Spacing */}
              {currentState === ChatState.QUERY_HANDLING && selectedTransaction && (
                <div className="px-8 pt-6">
                  <QuerySuggestions 
                    queryInput={inputValue}
                    onSuggestionClick={handleSuggestionClick}
                    isVisible={true}
                    transaction={selectedTransaction}
                    conversationMemory={conversationMemory}
                  />
                </div>
              )}

              {/* Input Section with Better Alignment */}
              <div className="p-8">
                {inputError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium animate-fade-in flex items-center gap-3">
                    <AlertCircle className="w-4 h-4" />
                    <span>{inputError}</span>
                  </div>
                )}

                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onFocus={handleInputFocus}
                      placeholder={getInputPlaceholder()}
                      className={`bg-white/95 backdrop-blur-sm border-slate-200 text-slate-800 placeholder:text-slate-500 rounded-2xl px-6 py-4 text-base font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm h-14 ${
                        inputError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''
                      }`}
                      disabled={isLoading || currentState === ChatState.TRANSACTION_SELECTION}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim() || currentState === ChatState.TRANSACTION_SELECTION}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 rounded-2xl px-6 shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 hover:shadow-xl hover:-translate-y-0.5 h-14 w-14 p-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Input Helper Text with Better Alignment */}
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span>Press Enter to send, Escape to clear</span>
                  {currentState === ChatState.QUERY_HANDLING && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span>Ready to help</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Flight Ticket Details Modal with Better Centered Layout */}
          {selectedTransaction && showTicketDetails && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in">
                <div className="border-b border-slate-100 p-8 bg-gradient-to-r from-slate-50 to-blue-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                      <Plane className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 leading-tight">Flight Details</h3>
                      <p className="text-slate-600 font-medium text-base mt-1">{selectedTransaction.flight_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handlePrintTicket}
                      variant="outline"
                      size="sm"
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold shadow-sm rounded-xl h-10"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                    <Button
                      onClick={toggleTicketDetails}
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 font-semibold rounded-xl h-10 w-10 p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(95vh-100px)] p-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
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
