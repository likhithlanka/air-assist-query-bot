
import React from 'react';
import { Transaction } from '@/types/chatbot';
import { Plane, Calendar, DollarSign, Clock } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onSelect: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onSelect }) => {
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          onClick={() => onSelect(transaction)}
          className="bg-white border border-[#E9E9E8] rounded-lg p-4 cursor-pointer hover:border-[#2E95E5] hover:shadow-sm transition-all duration-200 group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#2E95E5]" />
              <span className="font-medium text-[#37352F]">{transaction.flight_number}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              transaction.status === 'Confirmed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {transaction.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#6B6B6B]" />
              <span className="text-[#6B6B6B]">{transaction.travel_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-3 h-3 text-[#6B6B6B]" />
              <span className="text-[#6B6B6B]">${transaction.total_amount_paid}</span>
            </div>
          </div>
          
          <div className="mt-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#6B6B6B]" />
              <span className="text-[#6B6B6B]">
                {transaction.departure_airport} → {transaction.arrival_airport}
              </span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-[#E9E9E8]">
            <p className="text-xs text-[#6B6B6B]">
              Booking ID: <span className="font-medium text-[#37352F]">{transaction.booking_id}</span>
            </p>
          </div>
          
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-xs text-[#2E95E5] font-medium">Click to select →</span>
          </div>
        </div>
      ))}
    </div>
  );
};
