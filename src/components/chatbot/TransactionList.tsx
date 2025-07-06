
import React, { useState } from 'react';
import { Transaction } from '@/types/chatbot';
import { Plane, Calendar, DollarSign, MapPin, Clock, CreditCard, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onSelect: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onSelect }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Your Flight Bookings</h3>
          <p className="text-sm text-slate-600">Select a booking to get assistance</p>
        </div>
      </div>
      
      {transactions.map((transaction, index) => (
        <div
          key={transaction.transaction_id}
          onClick={() => onSelect(transaction)}
          onMouseEnter={() => setHoveredId(transaction.transaction_id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`bg-white/90 backdrop-blur-sm border border-slate-200 rounded-3xl p-6 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl ${
            hoveredId === transaction.transaction_id ? 'ring-2 ring-blue-100' : ''
          }`}>
            
            {/* Header with Flight Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-blue-100">
                  <Plane className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xl mb-1">{transaction.flight_number}</div>
                  <div className="text-slate-600 font-semibold">
                    {transaction.passenger_name}
                  </div>
                </div>
              </div>
              
              <div className={`px-4 py-2 rounded-2xl font-bold border flex items-center gap-2 ${getStatusColor(transaction.status)}`}>
                {getStatusIcon(transaction.status)}
                {transaction.status}
              </div>
            </div>
            
            {/* Route Information */}
            <div className="flex items-center gap-6 mb-6 p-5 rounded-2xl bg-gradient-to-r from-slate-50/80 to-blue-50/50 border border-slate-100">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{transaction.departure_airport}</div>
                  <div className="text-sm text-slate-500 font-medium">
                    {transaction.departure_time}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="h-0.5 bg-slate-300 rounded-full relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-blue-200 shadow-sm">
                    <Plane className="w-5 h-5 text-blue-600 rotate-90" />
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded-full border border-slate-200">
                    {transaction.travel_class}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-slate-700">
                <div className="text-center">
                  <div className="font-bold text-lg">{transaction.arrival_airport}</div>
                  <div className="text-sm text-slate-500 font-medium">
                    {transaction.arrival_time}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-purple-600 font-semibold uppercase tracking-wide">Date</div>
                  <div className="text-slate-800 font-bold">{formatDate(transaction.date)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Total</div>
                  <div className="text-slate-800 font-bold">${transaction.total_amount_paid}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-orange-600 font-semibold uppercase tracking-wide">Seat</div>
                  <div className="text-slate-800 font-bold">{transaction.seat_number}</div>
                </div>
              </div>
            </div>
            
            {/* Footer with CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500 font-semibold">
                  Booking: {transaction.booking_id}
                </span>
              </div>
              
              <div className={`transition-all duration-200 ${
                hoveredId === transaction.transaction_id ? 'opacity-100 translate-x-0' : 'opacity-70 translate-x-2'
              }`}>
                <span className="text-sm text-blue-600 font-bold flex items-center gap-2">
                  Get help with this booking
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                    hoveredId === transaction.transaction_id ? 'translate-x-1' : ''
                  }`} />
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Helper text */}
      <div className="text-center pt-4">
        <p className="text-sm text-slate-500">
          Click on any booking above to start getting help
        </p>
      </div>
    </div>
  );
};
