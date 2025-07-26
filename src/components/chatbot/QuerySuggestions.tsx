
import React, { useState, useEffect } from 'react';
import { getQuerySuggestions } from '@/utils/responseGenerator';
import { MessageSquare, Lightbulb } from 'lucide-react';

interface QuerySuggestionsProps {
  queryInput: string;
  onSuggestionClick: (suggestion: string) => void;
}

interface QuerySuggestion {
  display: string;
  intent: string;
  category: string;
}

export const QuerySuggestions: React.FC<QuerySuggestionsProps> = ({ 
  queryInput, 
  onSuggestionClick 
}) => {
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);

  useEffect(() => {
    const newSuggestions = getQuerySuggestions(queryInput);
    setSuggestions(newSuggestions);
  }, [queryInput]);

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, QuerySuggestion[]>);

  const categoryLabels = {
    refundStatus: 'Refund Information',
    flightDetails: 'Flight Details',
    bookingDetails: 'Booking Information',
    paymentDetails: 'Payment Information'
  };

  return (
    <div className="bg-white border border-[#E9E9E8] rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-[#2E95E5]" />
        <span className="text-sm font-medium text-[#37352F]">Suggested Questions</span>
      </div>
      
      <div className="space-y-4">
        {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
          <div key={category}>
            <h4 className="text-xs font-medium text-[#6B6B6B] mb-2 uppercase tracking-wide">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {categorySuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion.display)}
                  className="text-left px-3 py-2 text-sm bg-[#F7F6F3] hover:bg-[#E9E9E8] border border-transparent hover:border-[#2E95E5] rounded-md transition-all duration-200 flex items-center gap-2 group"
                >
                  <MessageSquare className="w-3 h-3 text-[#6B6B6B] group-hover:text-[#2E95E5]" />
                  <span className="text-[#37352F] group-hover:text-[#2E95E5]">
                    {suggestion.display}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {suggestions.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-[#6B6B6B]">
            Start typing to see relevant suggestions, or ask any question about your booking.
          </p>
        </div>
      )}
    </div>
  );
};
