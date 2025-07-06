
import React, { useState, useEffect } from 'react';
import { getQuerySuggestions } from '@/utils/responseGenerator';
import { Transaction, ConversationMemory } from '@/types/chatbot';
import { ChevronRight, Sparkles, Clock, Zap } from 'lucide-react';

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
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const newSuggestions = getQuerySuggestions(queryInput, transaction, conversationMemory);
    setSuggestions(newSuggestions);
    setSelectedIndex(-1);
  }, [queryInput, transaction, conversationMemory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        onSuggestionClick(suggestions[selectedIndex].display);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSuggestionClick]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  const handleSuggestionClick = (suggestion: string, index: number) => {
    setSelectedIndex(index);
    onSuggestionClick(suggestion);
  };

  // Group suggestions by category
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    const category = suggestion.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(suggestion);
    return acc;
  }, {} as Record<string, QuerySuggestion[]>);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'refund': return '💰';
      case 'flight': return '✈️';
      case 'booking': return '📅';
      case 'status': return '📋';
      default: return '💡';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'refund': return 'from-emerald-50 to-green-50 border-emerald-200';
      case 'flight': return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'booking': return 'from-purple-50 to-violet-50 border-purple-200';
      case 'status': return 'from-orange-50 to-amber-50 border-orange-200';
      default: return 'from-slate-50 to-gray-50 border-slate-200';
    }
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="bg-gradient-to-br from-white/95 to-slate-50/60 rounded-2xl border border-slate-200/60 shadow-lg backdrop-blur-sm overflow-hidden">
        <div className="p-6">
          {/* Header with Better Alignment */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-base text-slate-700 font-bold">
                  {queryInput.trim() === '' ? 'Quick questions' : 'Suggested questions'}
                </span>
              </div>
              {queryInput.trim() !== '' && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Zap className="w-3 h-3" />
                  <span>Smart suggestions</span>
                </div>
              )}
            </div>
            {suggestions.length > 0 && (
              <p className="text-sm text-slate-500 leading-relaxed">
                Use ↑↓ to navigate, Enter to select, or click any suggestion
              </p>
            )}
          </div>

          {/* Suggestions with Improved Layout */}
          <div className="space-y-5">
            {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
              <div key={category}>
                {Object.keys(groupedSuggestions).length > 1 && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      {category}
                    </span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categorySuggestions.slice(0, 4).map((suggestion, categoryIndex) => {
                    const globalIndex = suggestions.indexOf(suggestion);
                    const isSelected = selectedIndex === globalIndex;
                    
                    return (
                      <button
                        key={categoryIndex}
                        onClick={() => handleSuggestionClick(suggestion.display, globalIndex)}
                        className={`group flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r rounded-2xl font-semibold transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 text-left w-full ${
                          isSelected 
                            ? 'bg-blue-100 border-blue-300 text-blue-800 shadow-lg -translate-y-0.5' 
                            : `${getCategoryColor(category)} hover:shadow-lg text-slate-700 hover:text-slate-800 border`
                        }`}
                      >
                        <span className="leading-tight text-sm text-left flex-1">{suggestion.display}</span>
                        <ChevronRight className={`w-4 h-4 transition-all duration-200 flex-shrink-0 ${
                          isSelected 
                            ? 'text-blue-600 translate-x-1' 
                            : 'text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer with Better Alignment */}
          {suggestions.length > 6 && (
            <div className="mt-6 pt-4 border-t border-slate-200/60">
              <p className="text-sm text-slate-500 text-center leading-relaxed">
                Showing top suggestions • Start typing for more specific options
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
