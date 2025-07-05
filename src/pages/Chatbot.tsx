
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
    setInputValue(suggestion);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-cyan-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-400/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Dotted Flight Path */}
        <svg className="absolute top-1/4 left-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M0,50 Q25,30 50,50 T100,40" 
            stroke="url(#gradient)" 
            strokeWidth="0.2" 
            strokeDasharray="2,3" 
            fill="none"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3"/>
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                Flight Assistant
              </h1>
              <p className="text-blue-200/80 text-sm font-bold">
                Your intelligent travel companion
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Chat Container - Full Width */}
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Messages Area */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-blue-400/20 scrollbar-track-transparent">
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

                {isLoading && (
                  <div className="flex items-center justify-center gap-3 py-8">
                    <div className="relative">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                      <div className="absolute inset-0 bg-blue-400/20 rounded-full blur animate-pulse"></div>
                    </div>
                    <span className="text-blue-200/80 font-bold">Processing your request...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Area - Above Input */}
              {currentState === ChatState.QUERY_HANDLING && selectedTransaction && (
                <div className="border-t border-white/10 p-6 bg-white/5 backdrop-blur-sm">
                  <QuerySuggestions 
                    queryInput={inputValue}
                    onSuggestionClick={handleSuggestionClick}
                    isVisible={showSuggestions}
                    transaction={selectedTransaction}
                    conversationMemory={conversationMemory}
                  />
                </div>
              )}

              {/* Input Area with Quick Actions */}
              <div className="border-t border-white/10 p-4 bg-white/5 backdrop-blur-sm">
                {/* Quick Actions for Selected Transaction */}
                {currentState === ChatState.QUERY_HANDLING && selectedTransaction && (
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-sm text-blue-200/70">
                      <Plane className="w-4 h-4 text-blue-400" />
                      <span className="font-bold">{selectedTransaction.flight_number}</span>
                      <span>•</span>
                      <span>{selectedTransaction.departure_airport} → {selectedTransaction.arrival_airport}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        onClick={toggleTicketDetails}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-blue-300 hover:bg-white/20 hover:text-white font-bold text-xs px-3 py-2"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button
                        onClick={() => window.print()}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-blue-300 hover:bg-white/20 hover:text-white font-bold text-xs px-3 py-2"
                      >
                        <Printer className="w-3 h-3 mr-1" />
                        Print
                      </Button>
                    </div>
                  </div>
                )}

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
                          : "Ask me anything about your booking..."
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/60 placeholder:font-bold rounded-2xl px-6 py-4 text-base font-bold focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300"
                      disabled={isLoading || currentState === ChatState.TRANSACTION_SELECTION}
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim() || currentState === ChatState.TRANSACTION_SELECTION}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 rounded-2xl px-6 py-4 shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-bold"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

          {/* Flight Ticket Details Modal/Overlay - Only show when toggled */}
          {selectedTransaction && showTicketDetails && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="border-b border-white/10 p-4 bg-white/5 backdrop-blur-sm flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Flight Ticket Details</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => window.print()}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-blue-300 hover:bg-white/20 hover:text-white font-bold"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                    <Button
                      onClick={toggleTicketDetails}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-white/10 font-bold"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
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
