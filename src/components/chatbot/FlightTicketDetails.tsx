
import React from 'react';
import { Transaction } from '@/types/chatbot';
import { 
  Plane, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock, 
  CreditCard, 
  User, 
  Phone, 
  Utensils, 
  Wifi, 
  Luggage,
  Ticket,
  Shield,
  CheckCircle
} from 'lucide-react';

interface FlightTicketDetailsProps {
  transaction: Transaction;
}

export const FlightTicketDetails: React.FC<FlightTicketDetailsProps> = ({ transaction }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 animate-pulse"></div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Flight Ticket Details</h3>
          <p className="text-blue-200/70 text-sm">Complete booking information</p>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
        </div>

        {/* Flight Route */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{transaction.departure_airport}</div>
              <div className="text-blue-200/70 text-sm">{transaction.departure_time}</div>
            </div>
            
            <div className="flex-1 relative mx-8">
              <div className="h-px bg-gradient-to-r from-blue-400 to-cyan-400 relative">
                <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 rotate-90 bg-slate-900 px-1" />
              </div>
              <div className="text-center mt-2">
                <span className="text-blue-200/70 text-sm font-medium">{transaction.flight_number}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{transaction.arrival_airport}</div>
              <div className="text-blue-200/70 text-sm">{transaction.arrival_time}</div>
            </div>
          </div>
        </div>

        {/* Passenger & Booking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Passenger Details
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex justify-between">
                <span className="text-blue-200/70">Name:</span>
                <span className="text-white font-medium">{transaction.passenger_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Contact:</span>
                <span className="text-white font-medium">{transaction.contact_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Frequent Flyer:</span>
                <span className="text-white font-medium">{transaction.frequent_flyer_id || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Booking Details
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex justify-between">
                <span className="text-blue-200/70">Booking ID:</span>
                <span className="text-white font-medium">{transaction.booking_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">PNR:</span>
                <span className="text-white font-medium">{transaction.pnr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Date:</span>
                <span className="text-white font-medium">{transaction.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seat & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Plane className="w-5 h-5 text-cyan-400" />
              Seat & Class
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex justify-between">
                <span className="text-blue-200/70">Class:</span>
                <span className="text-white font-medium">{transaction.travel_class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Seat:</span>
                <span className="text-white font-medium">{transaction.seat_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Seat Type:</span>
                <span className="text-white font-medium">{transaction.seat_type}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-400" />
              Services
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70">Meal:</span>
                <span className="text-white font-medium">{transaction.meal_selected || 'None'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  WiFi:
                </span>
                <span className="text-white font-medium">{transaction.wifi_addon || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 flex items-center gap-1">
                  <Luggage className="w-3 h-3" />
                  Baggage:
                </span>
                <span className="text-white font-medium">{transaction.baggage_addon || 'Standard'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Payment Details
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex justify-between">
                <span className="text-blue-200/70">Ticket Price:</span>
                <span className="text-white font-medium">${transaction.ticket_price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Taxes:</span>
                <span className="text-white font-medium">${transaction.taxes}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-blue-200/70 font-semibold">Total Paid:</span>
                <span className="text-emerald-400 font-bold text-lg">${transaction.total_amount_paid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Payment Method:</span>
                <span className="text-white font-medium">{transaction.payment_instrument}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Status & Check-in
            </h4>
            <div className="space-y-3 pl-7">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70">Booking Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'Confirmed' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70">Check-in:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  transaction.checkin_status === 'Completed' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-orange-500/20 text-orange-300'
                }`}>
                  {transaction.checkin_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Boarding Group:</span>
                <span className="text-white font-medium">{transaction.boarding_group}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Info (if applicable) */}
        {transaction.refund_status && transaction.refund_status !== 'N/A' && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
              Refund Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
              <div className="flex justify-between">
                <span className="text-blue-200/70">Refund ID:</span>
                <span className="text-white font-medium">{transaction.refund_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.refund_status === 'Completed' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {transaction.refund_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200/70">Amount:</span>
                <span className="text-emerald-400 font-medium">${transaction.refund_amount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Hover glow effect */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 blur pointer-events-none"></div>
      </div>
    </div>
  );
};
