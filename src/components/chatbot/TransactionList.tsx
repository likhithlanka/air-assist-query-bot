
import React from 'react';
import { Transaction } from '@/types/chatbot';
import { Plane, Calendar, DollarSign, MapPin, Clock, CreditCard } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onSelect: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onSelect }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
        <h3 className="text-base font-semibold text-gray-900">Your Bookings</h3>
      </div>
      
      {transactions.map((transaction) => (
        <div
          key={transaction.transaction_id}
          onClick={() => onSelect(transaction)}
          className="group cursor-pointer transition-all duration-200 hover:shadow-md"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 transition-all duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 text-base">{transaction.flight_number}</span>
                  <p className="text-gray-500 text-sm font-medium">Flight</p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                transaction.status === 'Confirmed' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
              }`}>
                {transaction.status}
              </div>
            </div>
            
            {/* Route */}
            <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">{transaction.departure_airport}</span>
              </div>
              
              <div className="flex-1 relative">
                <div className="h-px bg-gray-300"></div>
                <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 rotate-90 bg-gray-50 px-1" />
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-semibold">{transaction.arrival_airport}</span>
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600 font-medium">{transaction.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-gray-600 font-medium">${transaction.total_amount_paid}</span>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">
                  {transaction.booking_id}
                </span>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                  Select booking
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
