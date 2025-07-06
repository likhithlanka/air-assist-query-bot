
import React from 'react';
import { Message } from '@/types/chatbot';
import { Bot, User, Plane, DollarSign, Calendar, CreditCard, Clock, CheckCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const getMessageIcon = (content: string, isBot: boolean) => {
  if (!isBot) return null;
  
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('refund') || lowerContent.includes('money') || lowerContent.includes('payment')) {
    return <DollarSign className="w-4 h-4 text-emerald-600" />;
  }
  if (lowerContent.includes('flight') || lowerContent.includes('departure') || lowerContent.includes('arrival')) {
    return <Plane className="w-4 h-4 text-blue-600" />;
  }
  if (lowerContent.includes('booking') || lowerContent.includes('reservation')) {
    return <Calendar className="w-4 h-4 text-purple-600" />;
  }
  if (lowerContent.includes('card') || lowerContent.includes('payment method')) {
    return <CreditCard className="w-4 h-4 text-orange-600" />;
  }
  if (lowerContent.includes('confirmed') || lowerContent.includes('success')) {
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  }
  
  return <Bot className="w-4 h-4 text-blue-600" />;
};

const getMessageCategory = (content: string) => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('refund')) return 'Refund Info';
  if (lowerContent.includes('flight')) return 'Flight Details';
  if (lowerContent.includes('booking')) return 'Booking Info'; 
  if (lowerContent.includes('payment')) return 'Payment Info';
  if (lowerContent.includes('confirmed') || lowerContent.includes('success')) return 'Confirmation';
  return 'Assistant';
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  const messageIcon = getMessageIcon(message.content, isBot);
  const category = getMessageCategory(message.content);
  
  return (
    <div className={`flex gap-4 ${isBot ? 'justify-start' : 'justify-end'} group`}>
      {isBot && (
        <div className="flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md ring-2 ring-blue-100 group-hover:ring-4 transition-all duration-200">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      
      <div className="flex flex-col max-w-[80%] gap-3">
        <div
          className={`px-6 py-5 rounded-2xl transition-all duration-200 shadow-sm group-hover:shadow-md ${
            isBot
              ? 'bg-gradient-to-br from-white to-slate-50/60 border border-slate-200/60 text-slate-800 backdrop-blur-sm'
              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {/* Message Header for Bot with Better Alignment */}
          {isBot && messageIcon && (
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200/60">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm ring-1 ring-slate-100">
                {messageIcon}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider leading-tight">
                  {category}
                </span>
              </div>
            </div>
          )}
          
          {/* Message Content with Better Spacing */}
          <div className={`whitespace-pre-wrap leading-relaxed ${
            isBot ? 'font-medium text-slate-700 text-base' : 'font-semibold text-white text-base'
          }`}>
            {message.content}
          </div>
        </div>
        
        {/* Timestamp with Better Alignment */}
        <div className={`text-xs flex items-center gap-2 px-4 font-medium transition-opacity duration-200 ${
          isBot ? 'text-slate-500' : 'text-slate-500 justify-end'
        } opacity-0 group-hover:opacity-100`}>
          <Clock className="w-3 h-3" />
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md ring-2 ring-slate-200 group-hover:ring-4 transition-all duration-200">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
