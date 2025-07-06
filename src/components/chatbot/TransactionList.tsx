
import React from 'react';
import { Transaction } from '@/types/chatbot';
import { Plane, Calendar, DollarSign, MapPin, Clock, CreditCard, ChevronRight } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onSelect: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
        <h3 className="text-lg font-bold text-slate-800">Your Bookings</h3>
      </div>
      
      {transactions.map((transaction) => (
        <div
          key={transaction.transaction_id}
          onClick={() => onSelect(transaction)}
          className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-200 shadow-sm">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-lg">{transaction.flight_number}</span>
                  <p className="text-slate-600 font-semibold">Flight</p>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-xl font-bold border ${
                transaction.status === 'Confirmed' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {transaction.status}
              </div>
            </div>
            
            {/* Route */}
            <div className="flex items-center gap-6 mb-5 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100">
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-lg">{transaction.departure_airport}</span>
              </div>
              
              <div className="flex-1 relative">
                <div className="h-0.5 bg-slate-300 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plane className="w-4 h-4 text-blue-600 rotate-90" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-slate-700">
                <span className="font-bold text-lg">{transaction.arrival_airport}</span>
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-slate-700 font-bold">{transaction.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-slate-700 font-bold">${transaction.total_amount_paid}</span>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500 font-semibold">
                  {transaction.booking_id}
                </span>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                <span className="text-sm text-blue-600 font-bold flex items-center gap-2">
                  Select booking
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
