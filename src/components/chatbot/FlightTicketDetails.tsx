
import React, { useState } from 'react';
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
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';

interface FlightTicketDetailsProps {
  transaction: Transaction;
}

export const FlightTicketDetails: React.FC<FlightTicketDetailsProps> = ({ transaction }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    passenger: true,
    booking: true,
    flight: true,
    services: false,
    payment: false,
    refund: false
  });
  const [copiedField, setCopiedField] = useState<string>('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const Section = ({ 
    title, 
    icon, 
    children, 
    sectionKey, 
    bgColor = "from-slate-50 to-gray-50",
    iconColor = "bg-blue-100 text-blue-600"
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    sectionKey: string;
    bgColor?: string;
    iconColor?: string;
  }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className={`w-full p-5 bg-gradient-to-r ${bgColor} border-b border-slate-200 flex items-center justify-between hover:bg-slate-100/50 transition-colors duration-200`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${iconColor} rounded-xl flex items-center justify-center shadow-sm`}>
            {icon}
          </div>
          <h4 className="font-bold text-slate-800 text-left">{title}</h4>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-slate-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="p-5 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );

  const CopyableField = ({ label, value, field }: { label: string; value: string; field: string }) => (
    <div className="flex justify-between items-center group">
      <span className="text-slate-600 font-semibold">{label}:</span>
      <div className="flex items-center gap-2">
        <span className="text-slate-800 font-bold">{value}</span>
        <button
          onClick={() => copyToClipboard(value, field)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all duration-200"
        >
          {copiedField === field ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3 text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-blue-100">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Flight Ticket</h2>
            <p className="text-slate-600 font-semibold">Complete booking details</p>
          </div>
        </div>

        {/* Quick Status Overview */}
        <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{transaction.flight_number}</div>
            <div className="text-sm text-slate-600">Flight Number</div>
          </div>
          <div className="w-px h-12 bg-slate-300"></div>
          <div className="text-center">
            <div className={`px-3 py-1 rounded-full font-bold text-sm ${
              transaction.status === 'Confirmed' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {transaction.status}
            </div>
            <div className="text-sm text-slate-600">Status</div>
          </div>
        </div>
      </div>

      {/* Flight Route - Always Visible */}
      <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-3xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <div className="text-4xl font-bold text-slate-800 mb-2">{transaction.departure_airport}</div>
            <div className="text-slate-600 font-semibold">{formatDateTime(transaction.departure_time)}</div>
          </div>
          
          <div className="flex-1 relative mx-8">
            <div className="h-px bg-slate-300 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <Plane className="w-6 h-6 text-blue-600 rotate-90" />
              </div>
            </div>
            <div className="text-center mt-4">
              <span className="text-slate-700 font-bold bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                {transaction.flight_number}
              </span>
            </div>
          </div>
          
          <div className="text-center flex-1">
            <div className="text-4xl font-bold text-slate-800 mb-2">{transaction.arrival_airport}</div>
            <div className="text-slate-600 font-semibold">{formatDateTime(transaction.arrival_time)}</div>
          </div>
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {/* Passenger Details */}
        <Section
          title="Passenger Information"
          icon={<User className="w-5 h-5" />}
          sectionKey="passenger"
          bgColor="from-blue-50 to-indigo-50"
          iconColor="bg-blue-100 text-blue-600"
        >
          <div className="space-y-4">
            <CopyableField label="Name" value={transaction.passenger_name} field="name" />
            <CopyableField label="Contact" value={transaction.contact_number} field="contact" />
            <CopyableField label="Frequent Flyer" value={transaction.frequent_flyer_id || 'Not applicable'} field="ff" />
          </div>
        </Section>

        {/* Booking Details */}
        <Section
          title="Booking Information"
          icon={<Calendar className="w-5 h-5" />}
          sectionKey="booking"
          bgColor="from-purple-50 to-violet-50"
          iconColor="bg-purple-100 text-purple-600"
        >
          <div className="space-y-4">
            <CopyableField label="Booking ID" value={transaction.booking_id} field="booking" />
            <CopyableField label="PNR" value={transaction.pnr} field="pnr" />
            <CopyableField label="Booking Date" value={transaction.date} field="date" />
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-semibold">Travel Class:</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold text-sm">
                {transaction.travel_class}
              </span>
            </div>
          </div>
        </Section>

        {/* Seat & Services */}
        <Section
          title="Seat & Services"
          icon={<Plane className="w-5 h-5" />}
          sectionKey="services"
          bgColor="from-orange-50 to-amber-50"
          iconColor="bg-orange-100 text-orange-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-slate-700 flex items-center gap-2">
                <Plane className="w-4 h-4" /> Seating
              </h5>
              <div className="space-y-3">
                <CopyableField label="Seat Number" value={transaction.seat_number} field="seat" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Seat Type:</span>
                  <span className="text-slate-800 font-bold">{transaction.seat_type}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold text-slate-700 flex items-center gap-2">
                <Utensils className="w-4 h-4" /> Add-ons
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold flex items-center gap-2">
                    <Utensils className="w-4 h-4" /> Meal:
                  </span>
                  <span className="text-slate-800 font-bold">{transaction.meal_selected || 'None'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold flex items-center gap-2">
                    <Wifi className="w-4 h-4" /> WiFi:
                  </span>
                  <span className="text-slate-800 font-bold">{transaction.wifi_addon || 'Not selected'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold flex items-center gap-2">
                    <Luggage className="w-4 h-4" /> Baggage:
                  </span>
                  <span className="text-slate-800 font-bold">{transaction.baggage_addon || 'Standard'}</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Payment Information */}
        <Section
          title="Payment Details"
          icon={<DollarSign className="w-5 h-5" />}
          sectionKey="payment"
          bgColor="from-emerald-50 to-green-50"
          iconColor="bg-emerald-100 text-emerald-600"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Ticket Price:</span>
                  <span className="text-slate-800 font-bold">${transaction.ticket_price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Taxes & Fees:</span>
                  <span className="text-slate-800 font-bold">${transaction.taxes}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-slate-800 font-bold">Total Paid:</span>
                  <span className="text-emerald-600 font-bold text-xl">${transaction.total_amount_paid}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <CopyableField label="Payment Method" value={transaction.payment_instrument} field="payment" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Gateway:</span>
                  <span className="text-slate-800 font-bold">{transaction.payment_gateway}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Platform:</span>
                  <span className="text-slate-800 font-bold">{transaction.platform}</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Refund Information (if applicable) */}
        {transaction.refund_status && transaction.refund_status !== 'N/A' && (
          <Section
            title="Refund Information"
            icon={<Shield className="w-5 h-5" />}
            sectionKey="refund"
            bgColor="from-red-50 to-pink-50"
            iconColor="bg-red-100 text-red-600"
          >
            <div className="space-y-4">
              <CopyableField label="Refund ID" value={transaction.refund_id} field="refund" />
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Status:</span>
                <span className={`px-3 py-1 rounded-full font-bold ${
                  transaction.refund_status === 'Completed' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {transaction.refund_status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Refund Amount:</span>
                <span className="text-emerald-600 font-bold text-lg">${transaction.refund_amount}</span>
              </div>
              {transaction.refund_date && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">Refund Date:</span>
                  <span className="text-slate-800 font-bold">{transaction.refund_date}</span>
                </div>
              )}
            </div>
          </Section>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          {copiedField ? 'Copied to clipboard!' : 'Click any value to copy to clipboard'}
        </p>
      </div>
    </div>
  );
};
