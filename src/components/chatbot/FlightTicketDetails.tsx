
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Ticket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Flight Ticket Details</h3>
          <p className="text-slate-600 font-semibold">Complete booking information</p>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-8 shadow-lg">
        {/* Flight Route */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-slate-800 mb-2">{transaction.departure_airport}</div>
              <div className="text-slate-600 font-semibold">{transaction.departure_time}</div>
            </div>
            
            <div className="flex-1 relative mx-8">
              <div className="h-px bg-slate-300 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <Plane className="w-5 h-5 text-blue-600 rotate-90" />
                </div>
              </div>
              <div className="text-center mt-3">
                <span className="text-slate-700 font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{transaction.flight_number}</span>
              </div>
            </div>
            
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-slate-800 mb-2">{transaction.arrival_airport}</div>
              <div className="text-slate-600 font-semibold">{transaction.arrival_time}</div>
            </div>
          </div>
        </div>

        {/* Passenger & Booking Info */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              Passenger Details
            </h4>
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 space-y-3 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Name:</span>
                <span className="text-slate-800 font-bold">{transaction.passenger_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Contact:</span>
                <span className="text-slate-800 font-bold">{transaction.contact_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Frequent Flyer:</span>
                <span className="text-slate-800 font-bold">{transaction.frequent_flyer_id || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              Booking Details
            </h4>
            <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl p-5 space-y-3 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Booking ID:</span>
                <span className="text-slate-800 font-bold">{transaction.booking_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">PNR:</span>
                <span className="text-slate-800 font-bold">{transaction.pnr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Date:</span>
                <span className="text-slate-800 font-bold">{transaction.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seat & Services */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 text-blue-600" />
              </div>
              Seat & Class
            </h4>
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 space-y-3 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Class:</span>
                <span className="text-slate-800 font-bold">{transaction.travel_class}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Seat:</span>
                <span className="text-slate-800 font-bold">{transaction.seat_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Seat Type:</span>
                <span className="text-slate-800 font-bold">{transaction.seat_type}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Utensils className="w-4 h-4 text-orange-600" />
              </div>
              Services
            </h4>
            <div className="bg-gradient-to-r from-slate-50 to-orange-50 rounded-xl p-5 space-y-3 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Meal:</span>
                <span className="text-slate-800 font-bold">{transaction.meal_selected || 'None'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  WiFi:
                </span>
                <span className="text-slate-800 font-bold">{transaction.wifi_addon || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold flex items-center gap-2">
                  <Luggage className="w-4 h-4" />
                  Baggage:
                </span>
                <span className="text-slate-800 font-bold">{transaction.baggage_addon || 'Standard'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Status */}
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              Payment Details
            </h4>
            <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl p-5 space-y-3 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Ticket Price:</span>
                <span className="text-slate-800 font-bold">${transaction.ticket_price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Taxes:</span>
                <span className="text-slate-800 font-bold">${transaction.taxes}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                <span className="text-slate-700 font-bold">Total Paid:</span>
                <span className="text-emerald-600 font-bold text-lg">${transaction.total_amount_paid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Payment Method:</span>
                <span className="text-slate-800 font-bold">{transaction.payment_instrument}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              Status & Check-in
            </h4>
            <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl p-5 space-y-3 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Booking Status:</span>
                <span className={`px-3 py-1 rounded-full font-bold ${
                  transaction.status === 'Confirmed' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Check-in:</span>
                <span className={`px-3 py-1 rounded-full font-bold ${
                  transaction.checkin_status === 'Completed' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                }`}>
                  {transaction.checkin_status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Boarding Group:</span>
                <span className="text-slate-800 font-bold">{transaction.boarding_group}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Info (if applicable) */}
        {transaction.refund_status && transaction.refund_status !== 'N/A' && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="font-bold text-slate-800 flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              Refund Information
            </h4>
            <div className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl p-5 space-y-3 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Refund ID:</span>
                <span className="text-slate-800 font-bold">{transaction.refund_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Status:</span>
                <span className={`px-3 py-1 rounded-full font-bold ${
                  transaction.refund_status === 'Completed' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {transaction.refund_status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Amount:</span>
                <span className="text-emerald-600 font-bold">${transaction.refund_amount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
