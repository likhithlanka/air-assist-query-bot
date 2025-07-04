
import React, { useState, useEffect, useRef } from 'react';
import { getQuerySuggestions } from '@/utils/responseGenerator';
import { MessageSquare } from 'lucide-react';

interface QuerySuggestionsProps {
  queryInput: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
  onClose: () => void;
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
  onClose
}) => {
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (queryInput.trim()) {
      const newSuggestions = getQuerySuggestions(queryInput);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [queryInput]);

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

  // Sort categories by highest priority (most keyword matches)
  const sortedCategories = Object.entries(groupedSuggestions).sort(([, a], [, b]) => {
    const avgPriorityA = a.reduce((sum, item) => sum + item.priority, 0) / a.length;
    const avgPriorityB = b.reduce((sum, item) => sum + item.priority, 0) / b.length;
    return avgPriorityB - avgPriorityA;
  });

  const categoryLabels = {
    refundStatus: 'Refund Information',
    flightDetails: 'Flight Details',
    bookingDetails: 'Booking Information',
    paymentDetails: 'Payment Information'
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E9E9E8] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
    >
      <div className="p-2">
        {sortedCategories.map(([category, categorySuggestions]) => (
          <div key={category} className="mb-3 last:mb-0">
            <h4 className="text-xs font-medium text-[#6B6B6B] mb-2 px-2 uppercase tracking-wide">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h4>
            <div className="space-y-1">
              {categorySuggestions.slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.display)}
                  className="w-full text-left px-3 py-2 text-sm bg-[#F7F6F3] hover:bg-[#E9E9E8] border border-transparent hover:border-[#2E95E5] rounded-md transition-all duration-200 flex items-center gap-2 group"
                >
                  <MessageSquare className="w-3 h-3 text-[#6B6B6B] group-hover:text-[#2E95E5] flex-shrink-0" />
                  <span className="text-[#37352F] group-hover:text-[#2E95E5]">
                    {suggestion.display}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
