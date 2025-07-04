
import { Transaction } from '@/types/chatbot';

const intentKeywords = {
  refund: {
    category: 'refundStatus',
    keywords: ['refund', 'money', 'return', 'payment back', 'refunded', 'reimbursement'],
    questions: [
      {
        display: "What's my refund status?",
        intent: "refundStatus"
      },
      {
        display: "When will I get my refund?",
        intent: "refundStatus"
      },
      {
        display: "How much will I be refunded?",
        intent: "refundStatus"
      }
    ]
  },
  flight: {
    category: 'flightDetails',
    keywords: ['flight', 'departure', 'arrival', 'plane', 'time', 'airport'],
    questions: [
      {
        display: "What are my flight details?",
        intent: "flightDetails"
      },
      {
        display: "What's my departure time?",
        intent: "flightDetails"
      },
      {
        display: "What's my arrival time?",
        intent: "flightDetails"
      }
    ]
  },
  booking: {
    category: 'bookingDetails',
    keywords: ['booking', 'reservation', 'seat', 'ticket', 'meal', 'addon'],
    questions: [
      {
        display: "Show my booking details",
        intent: "bookingDetails"
      },
      {
        display: "What's my seat number?",
        intent: "bookingDetails"
      },
      {
        display: "What meals did I select?",
        intent: "bookingDetails"
      }
    ]
  },
  payment: {
    category: 'paymentDetails',
    keywords: ['payment', 'paid', 'cost', 'price', 'amount', 'total'],
    questions: [
      {
        display: "How much did I pay?",
        intent: "paymentDetails"
      },
      {
        display: "What was my payment method?",
        intent: "paymentDetails"
      },
      {
        display: "Show payment breakdown",
        intent: "paymentDetails"
      }
    ]
  }
};

export const generateResponse = (query: string, transaction: Transaction): string => {
  const queryLower = query.toLowerCase();
  
  // Determine intent based on keywords
  let detectedIntent = '';
  let maxMatches = 0;
  
  Object.entries(intentKeywords).forEach(([intent, config]) => {
    const matches = config.keywords.filter(keyword => queryLower.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedIntent = config.category;
    }
  });

  switch (detectedIntent) {
    case 'refundStatus':
      return generateRefundResponse(transaction);
    case 'flightDetails':
      return generateFlightResponse(transaction);
    case 'bookingDetails':
      return generateBookingResponse(transaction);
    case 'paymentDetails':
      return generatePaymentResponse(transaction);
    default:
      return "I apologize, but I can only provide information about refund status, flight details, and booking details. For other queries, please contact our support team.";
  }
};

const generateRefundResponse = (transaction: Transaction): string => {
  const expectedDate = calculateExpectedRefundDate(transaction.refund_date, transaction.refund_mode);
  
  return `Your refund for booking ${transaction.booking_id} is ${transaction.refund_status}.
Amount: $${transaction.refund_amount}
Processing Date: ${transaction.refund_date}
Expected completion: ${expectedDate} via ${transaction.refund_mode}`;
};

const generateFlightResponse = (transaction: Transaction): string => {
  return `Flight: ${transaction.flight_number}
From: ${transaction.departure_airport} at ${transaction.departure_time}
To: ${transaction.arrival_airport} at ${transaction.arrival_time}
Class: ${transaction.travel_class}
Seat: ${transaction.seat_number} (${transaction.seat_type})`;
};

const generateBookingResponse = (transaction: Transaction): string => {
  return `Booking ID: ${transaction.booking_id}
Passenger: ${transaction.passenger_name}
Amount Paid: $${transaction.total_amount_paid}
Addons: ${transaction.baggage_addon}, ${transaction.wifi_addon}
Meal: ${transaction.meal_selected}`;
};

const generatePaymentResponse = (transaction: Transaction): string => {
  return `Total Amount Paid: $${transaction.total_amount_paid}
Payment Status: ${transaction.status}
Booking Reference: ${transaction.booking_id}`;
};

const calculateExpectedRefundDate = (refundDate: string, refundMode: string): string => {
  const date = new Date(refundDate);
  let daysToAdd = 7; // default
  
  switch (refundMode.toLowerCase()) {
    case 'credit card':
      daysToAdd = 7;
      break;
    case 'debit card':
      daysToAdd = 10;
      break;
    case 'bank transfer':
      daysToAdd = 14;
      break;
  }
  
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString();
};

export const getQuerySuggestions = (input: string) => {
  const inputLower = input.toLowerCase();
  const suggestions: { display: string; intent: string; category: string }[] = [];
  
  Object.entries(intentKeywords).forEach(([intent, config]) => {
    const hasMatchingKeyword = config.keywords.some(keyword => 
      inputLower.includes(keyword) || keyword.includes(inputLower)
    );
    
    if (hasMatchingKeyword || inputLower === '') {
      config.questions.forEach(question => {
        suggestions.push({
          ...question,
          category: config.category
        });
      });
    }
  });
  
  return suggestions;
};
