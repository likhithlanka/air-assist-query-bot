
import React, { useState, useEffect, useRef } from 'react';
import { getQuerySuggestions } from '@/utils/responseGenerator';
import { Transaction, ConversationMemory } from '@/types/chatbot';
import { Sparkles, ChevronRight } from 'lucide-react';

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

  const categoryIcons = {
    refundStatus: '💸',
    flightDetails: '✈️',
    bookingDetails: '📅',
    paymentDetails: '💳',
    statusInquiry: '📋',
    contactSupport: '🔧'
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="fixed inset-x-4 bottom-24 z-[9999] max-h-80 overflow-y-auto animate-fade-in"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <div className="bg-slate-800/98 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/50">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-200 uppercase tracking-wide">
              Quick Suggestions
            </span>
          </div>

          {sortedCategories.map(([category, categorySuggestions]) => (
            <div key={category} className="mb-4 last:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </span>
                <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h4>
              </div>
              
              <div className="space-y-2">
                {categorySuggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.display)}
                    className="w-full text-left group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-700/40 border border-slate-600/40 hover:bg-slate-700/60 hover:border-blue-400/40 transition-all duration-300 transform hover:scale-[1.02]">
                      <span className="text-white/90 font-light text-sm group-hover:text-white transition-colors leading-relaxed">
                        {suggestion.display}
                      </span>
                      <ChevronRight className="w-4 h-4 text-blue-400/60 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                    </div>
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
