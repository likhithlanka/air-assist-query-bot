
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

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
  };

  return (
    <div className="animate-fade-in mb-3">
      <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border border-white/10 shadow-lg backdrop-blur-sm overflow-hidden">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 6).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.display)}
                className="group inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-400/20 hover:border-blue-400/40 rounded-full text-white text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-blue-500/20"
              >
                <span className="leading-none">{suggestion.display}</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-300/70 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all duration-200" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
