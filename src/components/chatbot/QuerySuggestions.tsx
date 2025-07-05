
import React, { useState, useEffect, useRef } from 'react';
import { getQuerySuggestions } from '@/utils/responseGenerator';
import { Transaction, ConversationMemory } from '@/types/chatbot';
import { ChevronRight } from 'lucide-react';

interface QuerySuggestionsProps {
  queryInput: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
  onClose: () => void;
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
  onClose,
  transaction,
  conversationMemory
}) => {
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (queryInput.trim()) {
      const newSuggestions = getQuerySuggestions(queryInput, transaction, conversationMemory);
      setSuggestions(newSuggestions);
    } else {
      const defaultSuggestions = getQuerySuggestions('', transaction, conversationMemory);
      setSuggestions(defaultSuggestions);
    }
  }, [queryInput, transaction, conversationMemory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

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
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute bottom-full left-0 right-0 mb-2 z-50 animate-fade-in"
    >
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-lg max-h-80 overflow-y-auto">
        <div className="p-1">
          {sortedCategories.map(([category, categorySuggestions]) => (
            <div key={category} className="mb-1 last:mb-0">
              {/* Category Header */}
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100/50 bg-gray-50/30">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              
              {/* Suggestions */}
              <div className="py-1">
                {categorySuggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.display)}
                    className="w-full text-left group px-4 py-3 hover:bg-gray-50/50 transition-all duration-200 flex items-center justify-between border-l-2 border-transparent hover:border-blue-400/30"
                  >
                    <span className="text-gray-700 text-sm leading-relaxed pr-2 font-light">
                      {suggestion.display}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 transform group-hover:translate-x-1" />
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
