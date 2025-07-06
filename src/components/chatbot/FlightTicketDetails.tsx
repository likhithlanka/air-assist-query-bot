
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Ticket className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Flight Ticket Details</h3>
          <p className="text-gray-600 text-sm">Complete booking information</p>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {/* Flight Route */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="text-2xl font-semibold text-gray-900 mb-1">{transaction.departure_airport}</div>
              <div className="text-gray-600 text-sm">{transaction.departure_time}</div>
            </div>
            
            <div className="flex-1 relative mx-6">
              <div className="h-px bg-gray-300 relative">
                <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 rotate-90 bg-white px-1" />
              </div>
              <div className="text-center mt-2">
                <span className="text-gray-600 text-sm font-medium">{transaction.flight_number}</span>
              </div>
            </div>
            
            <div className="text-center flex-1">
              <div className="text-2xl font-semibold text-gray-900 mb-1">{transaction.arrival_airport}</div>
              <div className="text-gray-600 text-sm">{transaction.arrival_time}</div>
            </div>
          </div>
        </div>

        {/* Passenger & Booking Info */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Passenger Details
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Name:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.passenger_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Contact:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.contact_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Frequent Flyer:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.frequent_flyer_id || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              Booking Details
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Booking ID:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.booking_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">PNR:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.pnr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Date:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seat & Services */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-600" />
              Seat & Class
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Class:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.travel_class}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Seat:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.seat_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Seat Type:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.seat_type}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-600" />
              Services
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Meal:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.meal_selected || 'None'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  WiFi:
                </span>
                <span className="text-gray-900 font-medium text-sm">{transaction.wifi_addon || 'Not selected'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm flex items-center gap-1">
                  <Luggage className="w-3 h-3" />
                  Baggage:
                </span>
                <span className="text-gray-900 font-medium text-sm">{transaction.baggage_addon || 'Standard'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Status */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Payment Details
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Ticket Price:</span>
                <span className="text-gray-900 font-medium text-sm">${transaction.ticket_price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Taxes:</span>
                <span className="text-gray-900 font-medium text-sm">${transaction.taxes}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="text-gray-700 font-semibold text-sm">Total Paid:</span>
                <span className="text-green-600 font-semibold text-sm">${transaction.total_amount_paid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Payment Method:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.payment_instrument}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Status & Check-in
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Booking Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  transaction.status === 'Confirmed' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Check-in:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  transaction.checkin_status === 'Completed' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                }`}>
                  {transaction.checkin_status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Boarding Group:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.boarding_group}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Info (if applicable) */}
        {transaction.refund_status && transaction.refund_status !== 'N/A' && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-purple-600" />
              Refund Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Refund ID:</span>
                <span className="text-gray-900 font-medium text-sm">{transaction.refund_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  transaction.refund_status === 'Completed' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {transaction.refund_status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Amount:</span>
                <span className="text-green-600 font-medium text-sm">${transaction.refund_amount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
