import React from 'react';
import { Transaction } from '@/types/chatbot';

interface PrintableTicketProps {
  transaction: Transaction;
}

export const PrintableTicket: React.FC<PrintableTicketProps> = ({ transaction }) => {
  return (
    <div className="print-ticket bg-white text-black p-8 font-sans max-w-4xl mx-auto">
      {/* Airline Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">AirAssist Airlines</h1>
            <p className="text-gray-600 text-sm">Your Journey, Our Priority</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">E-TICKET</div>
            <div className="text-sm text-gray-600">Electronic Ticket Receipt</div>
          </div>
        </div>
      </div>

      {/* Booking Reference */}
      <div className="grid grid-cols-3 gap-6 mb-8 bg-gray-50 p-4 rounded">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking Reference</div>
          <div className="text-lg font-bold text-black">{transaction.booking_id}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Transaction ID</div>
          <div className="text-lg font-bold text-black">{transaction.transaction_id}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PNR Status</div>
          <div className={`text-lg font-bold ${transaction.pnr && transaction.pnr !== 'Failed' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.pnr || 'FAILED'}
          </div>
        </div>
      </div>

      {/* Flight Information */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">FLIGHT INFORMATION</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{transaction.departure_airport}</div>
              <div className="text-sm text-gray-600">Departure</div>
              <div className="text-lg font-semibold">{transaction.departure_time}</div>
            </div>
            <div className="flex-1 mx-8 text-center">
              <div className="text-xl font-bold text-blue-600 mb-2">{transaction.flight_number}</div>
              <div className="border-t-2 border-blue-300 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                  ✈️ FLIGHT
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{transaction.arrival_airport}</div>
              <div className="text-sm text-gray-600">Arrival</div>
              <div className="text-lg font-semibold">{transaction.arrival_time}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Information */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">PASSENGER DETAILS</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Name:</span>
              <span className="font-semibold">{transaction.passenger_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Contact:</span>
              <span className="font-semibold">{transaction.contact_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="font-semibold">{transaction.user_email || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Frequent Flyer:</span>
              <span className="font-semibold">{transaction.frequent_flyer_id || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">BOOKING DETAILS</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Date:</span>
              <span className="font-semibold">{transaction.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Class:</span>
              <span className="font-semibold">{transaction.travel_class || 'Economy'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Seat:</span>
              <span className="font-semibold">{transaction.seat_number || 'To be assigned'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Baggage:</span>
              <span className="font-semibold">{transaction.baggage_addon || '20kg'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">PAYMENT INFORMATION</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center bg-green-50 p-4 rounded">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Amount</div>
            <div className="text-2xl font-bold text-green-600">${transaction.total_amount_paid}</div>
          </div>
          <div className="text-center bg-blue-50 p-4 rounded">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Method</div>
            <div className="text-lg font-semibold text-blue-600">{transaction.payment_instrument}</div>
          </div>
          <div className="text-center bg-gray-50 p-4 rounded">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</div>
            <div className="text-lg font-semibold text-green-600">PAID</div>
          </div>
        </div>
      </div>

      {/* Refund Information (if applicable) */}
      {(transaction.refund_id || transaction.refund_status) && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="text-lg font-bold text-yellow-800 mb-4">REFUND INFORMATION</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-yellow-700 font-medium">Refund ID:</span>
                <span className="font-semibold">{transaction.refund_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-700 font-medium">Status:</span>
                <span className="font-semibold">{transaction.refund_status || 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-yellow-700 font-medium">Amount:</span>
                <span className="font-semibold">${transaction.refund_amount || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-700 font-medium">Date:</span>
                <span className="font-semibold">{transaction.refund_date || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="border-t-2 border-gray-300 pt-6 mt-8">
        <h3 className="text-sm font-bold text-gray-800 mb-3">IMPORTANT INFORMATION</h3>
        <div className="text-xs text-gray-600 space-y-2">
          <p>• Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights.</p>
          <p>• Valid government-issued photo identification is required for all passengers.</p>
          <p>• Check-in closes 45 minutes before departure for domestic flights and 60 minutes for international flights.</p>
          <p>• Baggage restrictions and fees may apply. Please check our website for current policies.</p>
          <p>• Flight times are subject to change. Please confirm your flight status before traveling.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 mt-6 pt-4 text-center">
        <div className="text-xs text-gray-500">
          <p>AirAssist Airlines • Customer Service: 1-800-FLY-EASY • www.airassist.com</p>
          <p className="mt-1">Thank you for choosing AirAssist Airlines. We appreciate your business!</p>
        </div>
      </div>
    </div>
  );
};
