
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
    return <DollarSign className="w-4 h-4 text-emerald-400" />;
  }
  if (lowerContent.includes('flight') || lowerContent.includes('departure') || lowerContent.includes('arrival')) {
    return <Plane className="w-4 h-4 text-blue-400" />;
  }
  if (lowerContent.includes('booking') || lowerContent.includes('reservation')) {
    return <Calendar className="w-4 h-4 text-purple-400" />;
  }
  if (lowerContent.includes('card') || lowerContent.includes('payment method')) {
    return <CreditCard className="w-4 h-4 text-orange-400" />;
  }
  
  return <Bot className="w-4 h-4 text-blue-400" />;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  const messageIcon = getMessageIcon(message.content, isBot);
  
  return (
    <div className={`flex gap-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      {isBot && (
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 animate-pulse"></div>
        </div>
      )}
      
      <div className="flex flex-col max-w-[75%] gap-2">
        <div
          className={`relative px-6 py-4 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
            isBot
              ? 'bg-white/10 border border-white/20 text-white shadow-xl'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl'
          }`}
        >
          {/* Message Icon */}
          {isBot && messageIcon && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
              {messageIcon}
              <span className="text-xs font-medium text-blue-200/80 uppercase tracking-wide">
                {message.content.includes('refund') ? 'Refund Info' :
                 message.content.includes('flight') ? 'Flight Details' :
                 message.content.includes('booking') ? 'Booking Info' :
                 message.content.includes('payment') ? 'Payment Info' : 'Assistant'}
              </span>
            </div>
          )}
          
          <p className="whitespace-pre-wrap leading-relaxed font-light">
            {message.content}
          </p>
          
          {/* Floating glow effect */}
          <div className={`absolute -inset-1 rounded-3xl blur opacity-20 ${
            isBot ? 'bg-white/20' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}></div>
        </div>
        
        <div className={`text-xs ${isBot ? 'text-blue-200/60' : 'text-blue-200/60'} flex items-center gap-2 px-2`}>
          <Clock className="w-3 h-3" />
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {!isBot && (
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl blur opacity-30"></div>
        </div>
      )}
    </div>
  );
};
