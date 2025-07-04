import { Transaction } from '@/types/chatbot';

const intentKeywords = {
  refund: {
    category: 'refundStatus',
    keywords: ['refund', 'money', 'return', 'payment back', 'refunded', 'reimbursement'],
    questions: [
      {
        display: "What's my refund status?",
        intent: "refundStatusCheck"
      },
      {
        display: "When will I get my refund?",
        intent: "refundTiming"
      },
      {
        display: "How much will I be refunded?",
        intent: "refundAmount"
      }
    ]
  },
  flight: {
    category: 'flightDetails',
    keywords: ['flight', 'departure', 'arrival', 'plane', 'time', 'airport'],
    questions: [
      {
        display: "What are my flight details?",
        intent: "flightDetailsComplete"
      },
      {
        display: "What's my departure time?",
        intent: "departureTime"
      },
      {
        display: "What's my arrival time?",
        intent: "arrivalTime"
      }
    ]
  },
  booking: {
    category: 'bookingDetails',
    keywords: ['booking', 'reservation', 'seat', 'ticket', 'meal', 'addon'],
    questions: [
      {
        display: "Show my booking details",
        intent: "bookingDetailsComplete"
      },
      {
        display: "What's my seat number?",
        intent: "seatNumber"
      },
      {
        display: "What meals did I select?",
        intent: "mealSelection"
      }
    ]
  },
  payment: {
    category: 'paymentDetails',
    keywords: ['payment', 'paid', 'cost', 'price', 'amount', 'total'],
    questions: [
      {
        display: "How much did I pay?",
        intent: "paymentAmount"
      },
      {
        display: "What was my payment method?",
        intent: "paymentMethod"
      },
      {
        display: "Show payment breakdown",
        intent: "paymentBreakdown"
      }
    ]
  }
};

export const getQuerySuggestions = (input: string) => {
  const inputLower = input.toLowerCase();
  const suggestions: { display: string; intent: string; category: string; priority: number }[] = [];
  
  // Calculate keyword match count for each category
  const categoryPriorities: Record<string, number> = {};
  
  Object.entries(intentKeywords).forEach(([intent, config]) => {
    const matchCount = config.keywords.filter(keyword => 
      inputLower.includes(keyword) || keyword.includes(inputLower)
    ).length;
    
    categoryPriorities[config.category] = matchCount;
    
    // Show suggestions if there are keyword matches or if input is empty
    if (matchCount > 0 || inputLower === '') {
      config.questions.forEach(question => {
        suggestions.push({
          ...question,
          category: config.category,
          priority: matchCount
        });
      });
    }
  });
  
  return suggestions;
};

// Specific response functions for each intent
const generateRefundStatusResponse = (transaction: Transaction): string => {
  return `Your refund status for booking ${transaction.booking_id} is: ${transaction.refund_status}`;
};

const generateRefundTimingResponse = (transaction: Transaction): string => {
  const expectedDate = calculateExpectedRefundDate(transaction.refund_date, transaction.refund_mode);
  return `You can expect your refund by ${expectedDate} via ${transaction.refund_mode}. Processing started on ${transaction.refund_date}.`;
};

const generateRefundAmountResponse = (transaction: Transaction): string => {
  return `You'll be refunded $${transaction.refund_amount} through ${transaction.refund_mode} for booking ${transaction.booking_id}.`;
};

const generateFlightDetailsResponse = (transaction: Transaction): string => {
  return `Flight: ${transaction.flight_number}
From: ${transaction.departure_airport} at ${transaction.departure_time}
To: ${transaction.arrival_airport} at ${transaction.arrival_time}
Class: ${transaction.travel_class}
Seat: ${transaction.seat_number} (${transaction.seat_type})`;
};

const generateDepartureTimeResponse = (transaction: Transaction): string => {
  return `Your flight ${transaction.flight_number} departs from ${transaction.departure_airport} at ${transaction.departure_time}.`;
};

const generateArrivalTimeResponse = (transaction: Transaction): string => {
  return `Your flight ${transaction.flight_number} arrives at ${transaction.arrival_airport} at ${transaction.arrival_time}.`;
};

const generateBookingDetailsResponse = (transaction: Transaction): string => {
  return `Booking ID: ${transaction.booking_id}
Passenger: ${transaction.passenger_name}
Amount Paid: $${transaction.total_amount_paid}
Addons: ${transaction.baggage_addon}, ${transaction.wifi_addon}
Meal: ${transaction.meal_selected}`;
};

const generateSeatNumberResponse = (transaction: Transaction): string => {
  return `Your seat number is ${transaction.seat_number} (${transaction.seat_type}) in ${transaction.travel_class} class.`;
};

const generateMealSelectionResponse = (transaction: Transaction): string => {
  return `You selected: ${transaction.meal_selected} for your flight ${transaction.flight_number}.`;
};

const generatePaymentAmountResponse = (transaction: Transaction): string => {
  return `You paid a total of $${transaction.total_amount_paid} for booking ${transaction.booking_id}.`;
};

const generatePaymentMethodResponse = (transaction: Transaction): string => {
  return `You paid using ${transaction.payment_instrument} via ${transaction.payment_gateway}.`;
};

const generatePaymentBreakdownResponse = (transaction: Transaction): string => {
  return `Payment Breakdown for booking ${transaction.booking_id}:
Ticket Price: $${transaction.ticket_price}
Taxes: $${transaction.taxes}
Total Amount: $${transaction.total_amount_paid}
Payment Method: ${transaction.payment_instrument}`;
};

// Generic category responses (fallback when no specific intent is detected)
const generateGenericRefundResponse = (transaction: Transaction): string => {
  const expectedDate = calculateExpectedRefundDate(transaction.refund_date, transaction.refund_mode);
  
  return `Your refund for booking ${transaction.booking_id} is ${transaction.refund_status}.
Amount: $${transaction.refund_amount}
Processing Date: ${transaction.refund_date}
Expected completion: ${expectedDate} via ${transaction.refund_mode}`;
};

const generateGenericFlightResponse = (transaction: Transaction): string => {
  return generateFlightDetailsResponse(transaction);
};

const generateGenericBookingResponse = (transaction: Transaction): string => {
  return generateBookingDetailsResponse(transaction);
};

const generateGenericPaymentResponse = (transaction: Transaction): string => {
  return generatePaymentBreakdownResponse(transaction);
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

export const generateResponse = (query: string, transaction: Transaction): string => {
  const queryLower = query.toLowerCase();
  
  // First check for exact intent matches from suggestions
  const exactIntentMatch = findExactIntentMatch(query);
  if (exactIntentMatch) {
    return generateSpecificResponse(exactIntentMatch, transaction);
  }
  
  // Fallback to keyword-based detection for generic responses
  let detectedCategory = '';
  let maxMatches = 0;
  
  Object.entries(intentKeywords).forEach(([intent, config]) => {
    const matches = config.keywords.filter(keyword => queryLower.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedCategory = config.category;
    }
  });

  switch (detectedCategory) {
    case 'refundStatus':
      return generateGenericRefundResponse(transaction);
    case 'flightDetails':
      return generateGenericFlightResponse(transaction);
    case 'bookingDetails':
      return generateGenericBookingResponse(transaction);
    case 'paymentDetails':
      return generateGenericPaymentResponse(transaction);
    default:
      return "I apologize, but I can only provide information about refund status, flight details, and booking details. For other queries, please contact our support team.";
  }
};

// Helper function to find exact intent match from suggestions
const findExactIntentMatch = (query: string): string | null => {
  const trimmedQuery = query.trim();
  
  for (const categoryData of Object.values(intentKeywords)) {
    const match = categoryData.questions.find(q => q.display === trimmedQuery);
    if (match) {
      return match.intent;
    }
  }
  
  return null;
};

// Generate specific responses based on exact intent
const generateSpecificResponse = (intent: string, transaction: Transaction): string => {
  switch (intent) {
    // Refund specific intents
    case 'refundStatusCheck':
      return generateRefundStatusResponse(transaction);
    case 'refundTiming':
      return generateRefundTimingResponse(transaction);
    case 'refundAmount':
      return generateRefundAmountResponse(transaction);
    
    // Flight specific intents
    case 'flightDetailsComplete':
      return generateFlightDetailsResponse(transaction);
    case 'departureTime':
      return generateDepartureTimeResponse(transaction);
    case 'arrivalTime':
      return generateArrivalTimeResponse(transaction);
    
    // Booking specific intents
    case 'bookingDetailsComplete':
      return generateBookingDetailsResponse(transaction);
    case 'seatNumber':
      return generateSeatNumberResponse(transaction);
    case 'mealSelection':
      return generateMealSelectionResponse(transaction);
    
    // Payment specific intents
    case 'paymentAmount':
      return generatePaymentAmountResponse(transaction);
    case 'paymentMethod':
      return generatePaymentMethodResponse(transaction);
    case 'paymentBreakdown':
      return generatePaymentBreakdownResponse(transaction);
    
    default:
      return "I apologize, but I can only provide information about refund status, flight details, and booking details. For other queries, please contact our support team.";
  }
};
