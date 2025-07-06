
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
    return <DollarSign className="w-3 h-3 text-green-600" />;
  }
  if (lowerContent.includes('flight') || lowerContent.includes('departure') || lowerContent.includes('arrival')) {
    return <Plane className="w-3 h-3 text-blue-600" />;
  }
  if (lowerContent.includes('booking') || lowerContent.includes('reservation')) {
    return <Calendar className="w-3 h-3 text-purple-600" />;
  }
  if (lowerContent.includes('card') || lowerContent.includes('payment method')) {
    return <CreditCard className="w-3 h-3 text-orange-600" />;
  }
  
  return <Bot className="w-3 h-3 text-blue-600" />;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  const messageIcon = getMessageIcon(message.content, isBot);
  
  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      
      <div className="flex flex-col max-w-[75%] gap-1">
        <div
          className={`px-4 py-3 rounded-xl transition-all duration-200 ${
            isBot
              ? 'bg-gray-100 border border-gray-200 text-gray-900'
              : 'bg-blue-600 text-white'
          }`}
        >
          {/* Message Icon */}
          {isBot && messageIcon && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
              {messageIcon}
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {message.content.includes('refund') ? 'Refund Info' :
                 message.content.includes('flight') ? 'Flight Details' :
                 message.content.includes('booking') ? 'Booking Info' :
                 message.content.includes('payment') ? 'Payment Info' : 'Assistant'}
              </span>
            </div>
          )}
          
          <p className="whitespace-pre-wrap leading-relaxed font-medium text-sm">
            {message.content}
          </p>
        </div>
        
        <div className={`text-xs ${isBot ? 'text-gray-500' : 'text-gray-500'} flex items-center gap-1 px-2 font-medium`}>
          <Clock className="w-3 h-3" />
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
