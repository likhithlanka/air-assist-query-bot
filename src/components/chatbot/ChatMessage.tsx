
import React from 'react';
import { Message } from '@/types/chatbot';
import { Bot, User, Plane, DollarSign, Calendar, CreditCard, Clock } from 'lucide-react';

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
  
  return <Bot className="w-4 h-4 text-blue-600" />;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  const messageIcon = getMessageIcon(message.content, isBot);
  
  return (
    <div className={`flex gap-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      
      <div className="flex flex-col max-w-[75%] gap-2">
        <div
          className={`px-5 py-4 rounded-2xl transition-all duration-200 shadow-sm ${
            isBot
              ? 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-slate-800'
              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
          }`}
        >
          {/* Message Icon */}
          {isBot && messageIcon && (
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {messageIcon}
              </div>
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                {message.content.includes('refund') ? 'Refund Info' :
                 message.content.includes('flight') ? 'Flight Details' :
                 message.content.includes('booking') ? 'Booking Info' :
                 message.content.includes('payment') ? 'Payment Info' : 'Assistant'}
              </span>
            </div>
          )}
          
          <p className="whitespace-pre-wrap leading-relaxed font-semibold">
            {message.content}
          </p>
        </div>
        
        <div className={`text-sm ${isBot ? 'text-slate-500' : 'text-slate-500'} flex items-center gap-2 px-3 font-medium`}>
          <Clock className="w-3 h-3" />
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
