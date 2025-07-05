
import React, { useState, useEffect } from 'react';
import { getQuerySuggestions } from '@/utils/responseGenerator';
import { Transaction, ConversationMemory } from '@/types/chatbot';
import { ChevronRight } from 'lucide-react';

interface QuerySuggestionsProps {
  queryInput: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
  transaction?: Transaction;
  conversationMemory?: ConversationMemory;
}

interface QuerySuggestion {
  display: string;
  intent: string;
  category: string;
  priority: number;
}

export const QuerySuggestions: React.FC<QuerySuggestionsProps> = ({ 
  queryInput, 
  onSuggestionClick,
  isVisible,
  transaction,
  conversationMemory
}) => {
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);

  useEffect(() => {
    if (queryInput.trim()) {
      const newSuggestions = getQuerySuggestions(queryInput, transaction, conversationMemory);
      setSuggestions(newSuggestions);
    } else {
      const defaultSuggestions = getQuerySuggestions('', transaction, conversationMemory);
      setSuggestions(defaultSuggestions);
    }
  }, [queryInput, transaction, conversationMemory]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  // Group suggestions by category and sort by priority
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, QuerySuggestion[]>);

  // Sort categories by highest priority
  const sortedCategories = Object.entries(groupedSuggestions).sort(([, a], [, b]) => {
    const avgPriorityA = a.reduce((sum, item) => sum + item.priority, 0) / a.length;
    const avgPriorityB = b.reduce((sum, item) => sum + item.priority, 0) / b.length;
    return avgPriorityB - avgPriorityA;
  });

  const categoryLabels = {
    refundStatus: 'Refund Information',
    flightDetails: 'Flight Details',
    bookingDetails: 'Booking Information',
    paymentDetails: 'Payment Information',
    statusInquiry: 'Status & Check-in',
    contactSupport: 'Help & Support'
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
  };

  return (
    <div className="animate-fade-in mb-4">
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 bg-white/5">
          <h3 className="text-sm font-bold text-blue-200/80 uppercase tracking-wide">
            Suggested Questions
          </h3>
        </div>
        
        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400/20 scrollbar-track-transparent">
          {sortedCategories.map(([category, categorySuggestions]) => (
            <div key={category} className="border-b border-white/5 last:border-b-0">
              {/* Category Header */}
              <div className="px-4 py-2 text-xs font-bold text-blue-300/70 bg-white/5">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              
              {/* Suggestions */}
              <div className="py-1">
                {categorySuggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.display)}
                    className="w-full text-left group px-4 py-3 hover:bg-white/10 transition-colors duration-150 flex items-center justify-between"
                  >
                    <span className="text-white text-sm leading-relaxed pr-3 font-bold">
                      {suggestion.display}
                    </span>
                    <ChevronRight className="w-4 h-4 text-blue-300/50 opacity-0 group-hover:opacity-100 group-hover:text-blue-300 transition-all duration-150 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
