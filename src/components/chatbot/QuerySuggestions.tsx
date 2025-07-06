
import React, { useState, useEffect } from 'react';
import { getQuerySuggestions } from '@/utils/responseGenerator';
import { Transaction, ConversationMemory } from '@/types/chatbot';
import { ChevronRight, Sparkles } from 'lucide-react';

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
    const newSuggestions = getQuerySuggestions(queryInput, transaction, conversationMemory);
    setSuggestions(newSuggestions);
  }, [queryInput, transaction, conversationMemory]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
  };

  return (
    <div className="mb-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-slate-700 font-bold">
                {queryInput.trim() === '' ? 'Quick questions:' : 'Suggested questions:'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {suggestions.slice(0, 6).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.display)}
                className="group inline-flex items-center gap-2 px-4 py-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-slate-700 hover:text-blue-700 font-semibold transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="leading-none">{suggestion.display}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
