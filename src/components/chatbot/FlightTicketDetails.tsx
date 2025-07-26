
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
          <h3 className="text-lg font-semibold text-white">Flight Ticket Details</h3>
          <p className="text-blue-200/70 text-xs">Complete booking information</p>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
        </div>

        {/* Flight Route */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-white mb-1">{transaction.departure_airport}</div>
              <div className="text-blue-200/70 text-xs">{transaction.departure_time}</div>
            </div>
            
            <div className="flex-1 relative mx-6">
              <div className="h-px bg-gradient-to-r from-blue-400 to-cyan-400 relative">
                <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 rotate-90 bg-slate-900 px-1" />
              </div>
              <div className="text-center mt-2">
                <span className="text-blue-200/70 text-xs font-medium">{transaction.flight_number}</span>
              </div>
            </div>
            
            <div className="text-center flex-1">
              <div className="text-2xl font-bold text-white mb-1">{transaction.arrival_airport}</div>
              <div className="text-blue-200/70 text-xs">{transaction.arrival_time}</div>
            </div>
          </div>
        </div>

        {/* Passenger & Booking Info */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Passenger Details
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Name:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.passenger_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Contact:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.contact_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Frequent Flyer:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.frequent_flyer_id || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Booking Details
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Booking ID:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.booking_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">PNR:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.pnr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Date:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seat & Services */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Plane className="w-4 h-4 text-cyan-400" />
              Seat & Class
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Class:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.travel_class}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Seat:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.seat_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Seat Type:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.seat_type}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-400" />
              Services
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Meal:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.meal_selected || 'None'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  WiFi:
                </span>
                <span className="text-white font-medium text-xs text-right">{transaction.wifi_addon || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs flex items-center gap-1">
                  <Luggage className="w-3 h-3" />
                  Baggage:
                </span>
                <span className="text-white font-medium text-xs text-right">{transaction.baggage_addon || 'Standard'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Status */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Payment Details
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Ticket Price:</span>
                <span className="text-white font-medium text-xs text-right">${transaction.ticket_price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Taxes:</span>
                <span className="text-white font-medium text-xs text-right">${transaction.taxes}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-2">
                <span className="text-blue-200/70 font-semibold text-xs">Total Paid:</span>
                <span className="text-emerald-400 font-bold text-sm text-right">${transaction.total_amount_paid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Payment Method:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.payment_instrument}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Status & Check-in
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Booking Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'Confirmed' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Check-in:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.checkin_status === 'Completed' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-orange-500/20 text-orange-300'
                }`}>
                  {transaction.checkin_status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Boarding Group:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.boarding_group}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Info (if applicable) */}
        {transaction.refund_status && transaction.refund_status !== 'N/A' && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-purple-400" />
              Refund Information
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Refund ID:</span>
                <span className="text-white font-medium text-xs text-right">{transaction.refund_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.refund_status === 'Completed' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {transaction.refund_status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/70 text-xs">Amount:</span>
                <span className="text-emerald-400 font-medium text-xs text-right">${transaction.refund_amount}</span>
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
