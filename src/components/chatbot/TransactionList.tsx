
import React from 'react';
import { Transaction } from '@/types/chatbot';
import { Plane, Calendar, DollarSign, MapPin, Clock, CreditCard } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onSelect: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></div>
        <h3 className="text-lg font-medium text-white/90">Your Bookings</h3>
      </div>
      
      {transactions.map((transaction) => (
        <div
          key={transaction.transaction_id}
          onClick={() => onSelect(transaction)}
          className="group relative cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
        >
          <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-blue-400/30 transition-all duration-300 shadow-xl">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                </div>
                <div>
                  <span className="font-semibold text-white text-lg">{transaction.flight_number}</span>
                  <p className="text-blue-200/70 text-sm font-light">Flight</p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                transaction.status === 'Confirmed' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
              }`}>
                {transaction.status}
              </div>
            </div>
            
            {/* Route */}
            <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="font-medium">{transaction.departure_airport}</span>
              </div>
              
              <div className="flex-1 relative">
                <div className="h-px bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 rotate-90" />
              </div>
              
              <div className="flex items-center gap-2 text-white/80">
                <span className="font-medium">{transaction.arrival_airport}</span>
                <MapPin className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-white/70">{transaction.travel_date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-white/70">${transaction.total_amount_paid}</span>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3 h-3 text-blue-400/60" />
                <span className="text-xs text-blue-200/60 font-medium">
                  {transaction.booking_id}
                </span>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs text-blue-400 font-medium flex items-center gap-1">
                  Select booking
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                </span>
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
