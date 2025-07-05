
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
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-h-80 overflow-y-auto">
        {sortedCategories.map(([category, categorySuggestions]) => (
          <div key={category} className="border-b border-gray-100 last:border-b-0">
            {/* Category Header - Notion style */}
            <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50/30 border-b border-gray-100">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </div>
            
            {/* Suggestions */}
            <div className="py-1">
              {categorySuggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.display)}
                  className="w-full text-left group px-3 py-2.5 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between"
                >
                  <span className="text-gray-700 text-sm leading-relaxed pr-3 font-normal">
                    {suggestion.display}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-gray-400 transition-all duration-150 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
