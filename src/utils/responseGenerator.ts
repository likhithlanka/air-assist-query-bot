import { Transaction, ConversationMemory, QuestionCategory, ResponseContext, QuerySuggestion } from '@/types/chatbot';
import { 
  formatCurrency, 
  formatDateTime, 
  formatDate, 
  formatTime, 
  formatPhoneNumber, 
  formatPNR, 
  formatStatus, 
  formatName, 
  formatFlightNumber, 
  formatAirportCode, 
  formatTravelClass, 
  formatSeatType, 
  formatMeal,
  getContextualMessage 
} from '@/utils/dataFormatting';
import { 
  analyzeSentiment, 
  getEmpatheticOpener, 
  adjustResponseTone, 
  SentimentAnalysis 
} from '@/utils/sentimentAnalysis';

// Enhanced intent keywords with new categories
const intentKeywords = {
  refund: {
    category: 'refundStatus',
    keywords: ['refund', 'money', 'return', 'payment back', 'refunded', 'reimbursement', 'cancel', 'cancellation', 'money back', 'get back', 'reimburse', 'cash back'],
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
      },
      {
        display: "Am I eligible for a refund?",
        intent: "refundEligibility"
      }
    ]
  },
  flight: {
    category: 'flightDetails',
    keywords: ['flight', 'departure', 'arrival', 'plane', 'time', 'airport', 'gate', 'terminal', 'fly', 'flying', 'depart', 'arrive', 'schedule'],
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
      },
      {
        display: "Is my flight on time?",
        intent: "flightStatus"
      }
    ]
  },
  booking: {
    category: 'bookingDetails',
    keywords: ['booking', 'reservation', 'seat', 'ticket', 'meal', 'addon', 'pnr', 'confirmation', 'book', 'reserved', 'confirm'],
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
      },
      {
        display: "What's my PNR?",
        intent: "pnrDetails"
      }
    ]
  },
  payment: {
    category: 'paymentDetails',
    keywords: ['payment', 'paid', 'cost', 'price', 'amount', 'total', 'bill', 'invoice', 'pay', 'charge', 'fee'],
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
  },
  status: {
    category: 'statusInquiry',
    keywords: ['status', 'check-in', 'boarding', 'confirmed', 'pending', 'completed'],
    questions: [
      {
        display: "What's my check-in status?",
        intent: "checkinStatus"
      },
      {
        display: "What's my boarding group?",
        intent: "boardingGroup"
      },
      {
        display: "Is my booking confirmed?",
        intent: "bookingStatus"
      }
    ]
  },
  contact: {
    category: 'contactSupport',
    keywords: ['help', 'support', 'contact', 'customer service', 'assistance', 'problem', 'issue'],
    questions: [
      {
        display: "How can I contact customer support?",
        intent: "contactInfo"
      },
      {
        display: "I need help with my booking",
        intent: "generalHelp"
      },
      {
        display: "Report an issue",
        intent: "reportIssue"
      }
    ]
  }
};

// Enhanced query suggestions with intelligent routing
export const getQuerySuggestions = (
  input: string, 
  transaction?: Transaction, 
  memory?: ConversationMemory
) => {
  const inputLower = input.toLowerCase().trim();
  const suggestions: { display: string; intent: string; category: string; priority: number }[] = [];
  
  // Calculate keyword match count for each category
  const categoryPriorities: Record<string, number> = {};
  
  Object.entries(intentKeywords).forEach(([intent, config]) => {
    const matchCount = config.keywords.filter(keyword => {
      // More flexible keyword matching
      const keywordLower = keyword.toLowerCase();
      return inputLower.includes(keywordLower) || 
             keywordLower.includes(inputLower) ||
             // Check for partial matches (at least 3 characters)
             (inputLower.length >= 3 && keywordLower.includes(inputLower)) ||
             (inputLower.length >= 3 && inputLower.includes(keywordLower));
    }).length;
    
    categoryPriorities[config.category] = matchCount;
    
    // Debug logging
    if (inputLower.length > 0) {
      console.log(`Intent: ${intent}, Input: "${inputLower}", Matches: ${matchCount}, Keywords: ${config.keywords.join(', ')}`);
    }
    
    // Show suggestions if there are keyword matches or if input is empty
    if (matchCount > 0 || inputLower.trim() === '') {
      config.questions.forEach(question => {
        // Skip refund suggestions if transaction has no refund data
        if (config.category === 'refundStatus' && transaction) {
          const hasRefundData = transaction.refund_id && 
                               transaction.refund_id.trim() !== '' && 
                               transaction.refund_amount > 0;
          if (!hasRefundData) {
            return; // Skip this refund suggestion
          }
        }

        let priority = matchCount;
        
        // Boost priority based on conversation context
        if (memory) {
          // Boost if related to last intent
          if (memory.lastIntent && question.intent.includes(memory.lastIntent.split(/(?=[A-Z])/)[0])) {
            priority += 2;
          }
          
          // Boost if not asked recently
          if (!memory.askedTopics.includes(question.intent)) {
            priority += 1;
          }
        }
        
        // Contextual boosting based on transaction data
        if (transaction) {
          priority += getContextualPriority(question.intent, transaction);
        }
        
        suggestions.push({
          ...question,
          category: config.category,
          priority
        });
      });
    }
  });
  
  // Sort by priority and return top suggestions
  const finalSuggestions = suggestions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6); // Show top 6 suggestions
    
  // Debug logging
  if (inputLower.length > 0) {
    console.log(`Final suggestions for "${inputLower}":`, finalSuggestions.map(s => `${s.display} (priority: ${s.priority})`));
  }
  
  return finalSuggestions;
};

// Contextual priority calculation based on transaction data
const getContextualPriority = (intent: string, transaction: Transaction): number => {
  let priority = 0;
  
  // Flight time context
  const now = new Date();
  const flightDate = new Date(transaction.departure_time);
  const timeDiff = flightDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Boost flight-related queries if flight is soon
  if (intent.includes('flight') || intent.includes('departure') || intent.includes('arrival')) {
    if (daysDiff <= 1) priority += 3; // Flight today/tomorrow
    else if (daysDiff <= 7) priority += 2; // Flight this week
    else if (daysDiff <= 30) priority += 1; // Flight this month
  }
  
  // Boost check-in related queries if flight is within check-in window
  if (intent.includes('checkin') && daysDiff <= 1 && daysDiff >= 0) {
    priority += 3;
  }
  
  // Boost refund queries if there's an active refund
  if (intent.includes('refund') && transaction.refund_id && transaction.refund_amount > 0) {
    priority += 2;
  }
  
  // Boost booking status if booking is not confirmed
  if (intent.includes('booking') && transaction.status !== 'confirmed') {
    priority += 2;
  }
  
  return priority;
};

// Specific response functions for each intent
const generateRefundStatusResponse = (transaction: Transaction): string => {
  // Check if refund is initiated
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    return `There is no refund initiated for your booking ${transaction.booking_id}. If you believe you're eligible for a refund, please contact customer support.`;
  }
  
  return `Your refund status for booking ${transaction.booking_id} is: ${formatStatus(transaction.refund_status)}
Refund ID: ${transaction.refund_id}
Amount: ${formatCurrency(transaction.refund_amount)}`;
};

const generateRefundTimingResponse = (transaction: Transaction): string => {
  // Check if refund is initiated
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    return `There is no refund initiated for your booking ${transaction.booking_id}. Please contact customer support if you believe you're eligible for a refund.`;
  }
  
  const expectedDate = calculateExpectedRefundDate(transaction.refund_date, transaction.refund_mode);
  return `You can expect your refund by ${expectedDate} via ${transaction.refund_mode}. Processing started on ${formatDate(transaction.refund_date)}.`;
};

const generateRefundAmountResponse = (transaction: Transaction): string => {
  // Check if refund is initiated
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    return `There is no refund initiated for your booking ${transaction.booking_id}. You are not currently eligible for a refund.`;
  }
  
  return `You'll be refunded ${formatCurrency(transaction.refund_amount)} through ${transaction.refund_mode} for booking ${transaction.booking_id}.`;
};

const generateFlightDetailsResponse = (transaction: Transaction): string => {
  const contextualMsg = getContextualMessage(transaction);
  
  const response = `Flight: ${formatFlightNumber(transaction.flight_number)}
From: ${formatAirportCode(transaction.departure_airport)} at ${formatTime(transaction.departure_time)}
To: ${formatAirportCode(transaction.arrival_airport)} at ${formatTime(transaction.arrival_time)}
Date: ${formatDate(transaction.date)}
Class: ${formatTravelClass(transaction.travel_class)}
Seat: ${transaction.seat_number} (${formatSeatType(transaction.seat_type)})`;

  return contextualMsg ? `${response}\n\n${contextualMsg}` : response;
};

const generateDepartureTimeResponse = (transaction: Transaction): string => {
  const contextualMsg = getContextualMessage(transaction);
  const response = `Your flight ${formatFlightNumber(transaction.flight_number)} departs from ${formatAirportCode(transaction.departure_airport)} at ${formatTime(transaction.departure_time)} on ${formatDate(transaction.date)}.`;
  
  return contextualMsg ? `${response}\n\n${contextualMsg}` : response;
};

const generateArrivalTimeResponse = (transaction: Transaction): string => {
  return `Your flight ${formatFlightNumber(transaction.flight_number)} arrives at ${formatAirportCode(transaction.arrival_airport)} at ${formatTime(transaction.arrival_time)} on ${formatDate(transaction.date)}.`;
};

const generateBookingDetailsResponse = (transaction: Transaction): string => {
  return `Booking ID: ${transaction.booking_id}
PNR: ${formatPNR(transaction.pnr)}
Passenger: ${formatName(transaction.passenger_name)}
Contact: ${formatPhoneNumber(transaction.contact_number)}
Total Amount Paid: ${formatCurrency(transaction.total_amount_paid)}
Add-ons: Baggage: ${transaction.baggage_addon}, WiFi: ${transaction.wifi_addon}
Meal: ${formatMeal(transaction.meal_selected)}
Check-in Status: ${formatStatus(transaction.checkin_status)}`;
};

const generateSeatNumberResponse = (transaction: Transaction): string => {
  return `Your seat number is ${transaction.seat_number} (${formatSeatType(transaction.seat_type)}) in ${formatTravelClass(transaction.travel_class)} class for flight ${formatFlightNumber(transaction.flight_number)}.`;
};

const generateMealSelectionResponse = (transaction: Transaction): string => {
  return `You selected: ${formatMeal(transaction.meal_selected)} for your flight ${formatFlightNumber(transaction.flight_number)}.`;
};

// Payment response functions
const generatePaymentAmountResponse = (transaction: Transaction): string => {
  return `You paid a total of ${formatCurrency(transaction.total_amount_paid)} for booking ${transaction.booking_id}.
Breakdown: Ticket Price: ${formatCurrency(transaction.ticket_price)}, Taxes: ${formatCurrency(transaction.taxes)}`;
};

const generatePaymentMethodResponse = (transaction: Transaction): string => {
  return `You paid using ${transaction.payment_instrument} via ${transaction.payment_gateway} on ${transaction.platform}.`;
};

const generatePaymentBreakdownResponse = (transaction: Transaction): string => {
  return `Payment Breakdown for booking ${transaction.booking_id}:
Ticket Price: ${formatCurrency(transaction.ticket_price)}
Taxes: ${formatCurrency(transaction.taxes)}
Total Amount: ${formatCurrency(transaction.total_amount_paid)}
Payment Method: ${transaction.payment_instrument} via ${transaction.payment_gateway}
Payment Status: ${formatStatus(transaction.status)}
${transaction.coupon_used ? `Coupon Used: ${transaction.coupon_used}` : 'No coupon used'}`;
};

// New response functions for enhanced categories
const generateRefundEligibilityResponse = (transaction: Transaction): string => {
  const now = new Date();
  const flightDate = new Date(transaction.departure_time);
  const daysDiff = Math.ceil((flightDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    if (daysDiff > 1) {
      return `Your booking ${transaction.booking_id} may be eligible for cancellation. Refund eligibility depends on your ticket type and timing. For assistance with refund requests, please contact customer support.`;
    } else {
      return `Your flight is within 24 hours. Refund eligibility is limited. Please contact customer support immediately for urgent cancellation requests.`;
    }
  }
  
  return `You already have an active refund (${transaction.refund_id}) for INR ${transaction.refund_amount}. Status: ${transaction.refund_status}`;
};

const generateFlightStatusResponse = (transaction: Transaction): string => {
  const now = new Date();
  const flightDate = new Date(transaction.departure_time);
  const daysDiff = Math.ceil((flightDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  if (daysDiff < 0) {
    return `Your flight ${transaction.flight_number} has already departed on ${transaction.date}.`;
  } else if (daysDiff === 0) {
    return `Your flight ${transaction.flight_number} is scheduled to depart today at ${transaction.departure_time}. Please check with the airline for real-time updates.`;
  } else if (daysDiff === 1) {
    return `Your flight ${transaction.flight_number} is scheduled for tomorrow at ${transaction.departure_time}. Remember to check-in online!`;
  } else {
    return `Your flight ${transaction.flight_number} is scheduled for ${transaction.date} at ${transaction.departure_time}. Check-in opens 24 hours before departure.`;
  }
};

const generatePnrDetailsResponse = (transaction: Transaction): string => {
  return `Your PNR (Passenger Name Record) is: ${formatPNR(transaction.pnr)}
Booking ID: ${transaction.booking_id}
Passenger: ${formatName(transaction.passenger_name)}
Flight: ${formatFlightNumber(transaction.flight_number)}`;
};

const generateCheckinStatusResponse = (transaction: Transaction): string => {
  const now = new Date();
  const flightDate = new Date(transaction.departure_time);
  const hoursDiff = Math.ceil((flightDate.getTime() - now.getTime()) / (1000 * 3600));
  
  let checkinMessage = `Check-in Status: ${transaction.checkin_status}`;
  
  if (transaction.checkin_status === 'completed') {
    checkinMessage += `\nBoarding Group: ${transaction.boarding_group}`;
    if (transaction.seat_number) {
      checkinMessage += `\nSeat: ${transaction.seat_number}`;
    }
  } else if (hoursDiff <= 24 && hoursDiff > 0) {
    checkinMessage += `\nOnline check-in is now available! You can check-in up to 1 hour before departure.`;
  } else if (hoursDiff > 24) {
    checkinMessage += `\nOnline check-in opens 24 hours before departure (${Math.ceil(hoursDiff - 24)} hours remaining).`;
  } else {
    checkinMessage += `\nCheck-in is no longer available online. Please visit the airport counter.`;
  }
  
  return checkinMessage;
};

const generateBoardingGroupResponse = (transaction: Transaction): string => {
  if (transaction.boarding_group) {
    return `Your boarding group is: ${transaction.boarding_group}
Flight: ${formatFlightNumber(transaction.flight_number)}
Seat: ${transaction.seat_number}`;
  }
  
  if (transaction.checkin_status !== 'completed') {
    return `Boarding group will be assigned after check-in completion. Check-in status: ${formatStatus(transaction.checkin_status)}`;
  }
  
  return `Boarding group information is not available. Please check your boarding pass or contact customer support.`;
};

const generateBookingStatusResponse = (transaction: Transaction): string => {
  const statusMessage = `Booking Status: ${formatStatus(transaction.status)}
Booking ID: ${transaction.booking_id}
PNR: ${formatPNR(transaction.pnr)}`;
  
  if (transaction.status === 'confirmed') {
    return `${statusMessage}
✅ Your booking is confirmed and ready!`;
  } else if (transaction.status === 'pending') {
    return `${statusMessage}
⏳ Your booking is pending confirmation. This usually takes a few minutes to process.`;
  } else {
    return `${statusMessage}
❗ Please contact customer support for assistance with your booking status.`;
  }
};

const generateContactInfoResponse = (): string => {
  return `📞 Customer Support Contact Information:

🔵 Phone: 1800-XXX-XXXX (24/7 Support)
📧 Email: support@airline.com
💬 Live Chat: Available on our website
🌐 Website: www.airline.com/support

For urgent flight-related issues:
📱 Mobile App: Download our app for instant support
✈️ Airport Helpdesk: Available at all major airports

Best times to call: 6 AM - 10 PM for faster response`;
};

const generateGeneralHelpResponse = (transaction: Transaction): string => {
  return `I'm here to help with your booking ${transaction.booking_id}! 

I can assist you with:
✈️ Flight details and status
🎫 Booking information
💰 Payment and refund status  
🪑 Seat and meal preferences
📋 Check-in and boarding details

For complex issues or changes to your booking, please contact our customer support team using the contact information I can provide.

What specific information would you like to know about your booking?`;
};

const generateReportIssueResponse = (): string => {
  return `To report an issue, please contact our customer support team:

🚨 For urgent issues (flight delays, cancellations):
📞 Call: 1800-XXX-XXXX (24/7)

📋 For general issues:
📧 Email: support@airline.com
💬 Live Chat: Available on our website

Please have your booking ID and PNR ready when contacting support.

Common issues I can help with right now:
• Refund status inquiries
• Flight information
• Booking details verification`;
};

// Generic category responses (fallback when no specific intent is detected)
const generateGenericRefundResponse = (transaction: Transaction): string => {
  // Check if refund is initiated
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    return `There is no refund initiated for your booking ${transaction.booking_id}. You are not currently eligible for a refund. If you believe this is an error, please contact customer support.`;
  }
  
  const expectedDate = calculateExpectedRefundDate(transaction.refund_date, transaction.refund_mode);
  
  return `Your refund for booking ${transaction.booking_id} is ${transaction.refund_status}.
Amount: INR ${transaction.refund_amount}
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
  if (!refundDate) {
    return "Date not available";
  }
  
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
    case 'manual':
      daysToAdd = 5;
      break;
    case 'travel credit':
      daysToAdd = 3;
      break;
    case 'original source':
      daysToAdd = 10;
      break;
    default:
      daysToAdd = 7;
  }
  
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString();
};

// Enhanced response generation with conversation memory, sentiment analysis, and smarter logic
export const generateResponse = (
  query: string, 
  transaction: Transaction, 
  memory?: ConversationMemory
): string => {
  const queryLower = query.toLowerCase();
  
  // Analyze sentiment and emotional state of the user's query
  const sentimentAnalysis = analyzeSentiment(query);
  
  // First check for exact intent matches from suggestions
  const exactIntentMatch = findExactIntentMatch(query);
  if (exactIntentMatch) {
    // Update conversation memory
    if (memory) {
      updateConversationMemory(memory, exactIntentMatch, query);
    }
    const baseResponse = generateSpecificResponse(exactIntentMatch, transaction);
    return createEmpatheticResponse(baseResponse, sentimentAnalysis);
  }
  
  // Enhanced fallback to keyword-based detection with context
  let detectedCategory = '';
  let maxMatches = 0;
  const contextualFactors: string[] = [];
  
  Object.entries(intentKeywords).forEach(([intent, config]) => {
    const matches = config.keywords.filter(keyword => queryLower.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedCategory = config.category;
    }
  });

  // Add contextual factors for smarter responses
  if (transaction) {
    const now = new Date();
    const flightDate = new Date(transaction.departure_time);
    const daysDiff = Math.ceil((flightDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff <= 1) contextualFactors.push('flight_soon');
    if (transaction.refund_id) contextualFactors.push('has_refund');
    if (transaction.checkin_status !== 'completed') contextualFactors.push('not_checked_in');
    if (transaction.status !== 'confirmed') contextualFactors.push('booking_not_confirmed');
  }

  // Generate contextual response
  let response = '';
  switch (detectedCategory) {
    case 'refundStatus':
      response = generateContextualRefundResponse(transaction, contextualFactors, sentimentAnalysis);
      break;
    case 'flightDetails':
      response = generateContextualFlightResponse(transaction, contextualFactors, sentimentAnalysis);
      break;
    case 'bookingDetails':
      response = generateGenericBookingResponse(transaction);
      break;
    case 'paymentDetails':
      response = generateGenericPaymentResponse(transaction);
      break;
    case 'statusInquiry':
      response = generateContextualStatusResponse(transaction, contextualFactors, sentimentAnalysis);
      break;
    case 'contactSupport':
      response = generateContextualSupportResponse(transaction, queryLower, sentimentAnalysis);
      break;
    default:
      response = generateFallbackResponse(transaction, queryLower, sentimentAnalysis);
  }
  
  // Update conversation memory
  if (memory) {
    updateConversationMemory(memory, detectedCategory, query);
  }
  
  return createEmpatheticResponse(response, sentimentAnalysis);
};

// Contextual response generators
const generateContextualRefundResponse = (transaction: Transaction, factors: string[], sentimentAnalysis?: SentimentAnalysis): string => {
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    if (factors.includes('flight_soon')) {
      return `There is no refund initiated for your booking ${transaction.booking_id}. Since your flight is soon, cancellation options may be limited. Please contact customer support immediately if you need to cancel.`;
    }
    return generateGenericRefundResponse(transaction);
  }
  return generateGenericRefundResponse(transaction);
};

const generateContextualFlightResponse = (transaction: Transaction, factors: string[], sentimentAnalysis?: SentimentAnalysis): string => {
  let response = generateGenericFlightResponse(transaction);
  
  if (factors.includes('flight_soon') && factors.includes('not_checked_in')) {
    response += `\n\n⚠️ Reminder: Your flight is soon and you haven't checked in yet. Online check-in is available now!`;
  } else if (factors.includes('flight_soon')) {
    response += `\n\n✈️ Your flight is coming up soon. Have a great trip!`;
  }
  
  return response;
};

const generateContextualStatusResponse = (transaction: Transaction, factors: string[], sentimentAnalysis?: SentimentAnalysis): string => {
  if (factors.includes('booking_not_confirmed')) {
    return `Your booking status is: ${transaction.status} (not confirmed yet). This usually resolves within a few minutes. If it persists, please contact customer support.`;
  }
  
  if (factors.includes('not_checked_in') && factors.includes('flight_soon')) {
    return `Check-in Status: ${transaction.checkin_status}. Your flight is soon - you can check in now! Online check-in is available up to 1 hour before departure.`;
  }
  
  return `Booking Status: ${transaction.status}\nCheck-in Status: ${transaction.checkin_status}\nBoarding Group: ${transaction.boarding_group || 'Will be assigned after check-in'}`;
};

const generateContextualSupportResponse = (transaction: Transaction, query: string, sentimentAnalysis?: SentimentAnalysis): string => {
  if (query.includes('urgent') || query.includes('emergency')) {
    return `🚨 For urgent issues, please call our 24/7 support line: 1800-XXX-XXXX\n\n${generateContactInfoResponse()}`;
  }
  
  if (query.includes('refund') || query.includes('cancel')) {
    return `For refund and cancellation requests:\n📞 Call: 1800-XXX-XXXX\n📧 Email: refunds@airline.com\n\nPlease have your booking ID (${transaction.booking_id}) ready.`;
  }
  
  return generateContactInfoResponse();
};

const generateFallbackResponse = (transaction: Transaction, query: string, sentimentAnalysis?: SentimentAnalysis): string => {
  if (query.includes('help') || query.includes('assist')) {
    return generateGeneralHelpResponse(transaction);
  }
  
  return `I apologize, but I couldn't understand your query. I can help you with:
• Flight details and timing
• Refund status and information  
• Booking and payment details
• Check-in and boarding status
• Contact information for support

Please try rephrasing your question or select from the suggested options.`;
};

/**
 * Creates an empathetic response by combining sentiment analysis with the base response
 */
const createEmpatheticResponse = (baseResponse: string, sentimentAnalysis: SentimentAnalysis): string => {
  // Get empathetic opener based on sentiment
  const opener = getEmpatheticOpener(sentimentAnalysis);
  
  // Adjust the tone of the base response
  const adjustedResponse = adjustResponseTone(baseResponse, sentimentAnalysis);
  
  // For very negative emotions, add extra empathy and urgency
  if (sentimentAnalysis.emotion === 'angry' || sentimentAnalysis.emotion === 'frustrated') {
    const empathicEnding = "\n\nI'm committed to resolving this for you as quickly as possible. Is there anything else I can help clarify right now?";
    return `${opener}\n\n${adjustedResponse}${empathicEnding}`;
  }
  
  // For worried users, add reassurance
  if (sentimentAnalysis.emotion === 'worried') {
    const reassurance = "\n\nPlease don't worry - I'm here to help you through this step by step.";
    return `${opener}\n\n${adjustedResponse}${reassurance}`;
  }
  
  // For neutral or positive emotions, use a lighter approach
  if (sentimentAnalysis.emotion === 'neutral' || sentimentAnalysis.emotion === 'hopeful') {
    return `${opener}\n\n${adjustedResponse}`;
  }
  
  // For happy users, maintain the positive energy
  if (sentimentAnalysis.emotion === 'happy' || sentimentAnalysis.emotion === 'satisfied') {
    return `${opener}\n\n${adjustedResponse}\n\nI'm glad I could help! Let me know if you need anything else.`;
  }
  
  // Default case
  return `${opener}\n\n${adjustedResponse}`;
};

// Update conversation memory
const updateConversationMemory = (memory: ConversationMemory, intent: string, query: string): void => {
  memory.lastIntent = intent;
  memory.conversationHistory.push(query);
  
  // Keep only last 10 conversations
  if (memory.conversationHistory.length > 10) {
    memory.conversationHistory = memory.conversationHistory.slice(-10);
  }
  
  // Track asked topics
  if (!memory.askedTopics.includes(intent)) {
    memory.askedTopics.push(intent);
  }
  
  // Keep only last 20 topics
  if (memory.askedTopics.length > 20) {
    memory.askedTopics = memory.askedTopics.slice(-20);
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
    case 'refundEligibility':
      return generateRefundEligibilityResponse(transaction);
    
    // Flight specific intents
    case 'flightDetailsComplete':
      return generateFlightDetailsResponse(transaction);
    case 'departureTime':
      return generateDepartureTimeResponse(transaction);
    case 'arrivalTime':
      return generateArrivalTimeResponse(transaction);
    case 'flightStatus':
      return generateFlightStatusResponse(transaction);
    
    // Booking specific intents
    case 'bookingDetailsComplete':
      return generateBookingDetailsResponse(transaction);
    case 'seatNumber':
      return generateSeatNumberResponse(transaction);
    case 'mealSelection':
      return generateMealSelectionResponse(transaction);
    case 'pnrDetails':
      return generatePnrDetailsResponse(transaction);
    
    // Payment specific intents
    case 'paymentAmount':
      return generatePaymentAmountResponse(transaction);
    case 'paymentMethod':
      return generatePaymentMethodResponse(transaction);
    case 'paymentBreakdown':
      return generatePaymentBreakdownResponse(transaction);
    
    // Status specific intents
    case 'checkinStatus':
      return generateCheckinStatusResponse(transaction);
    case 'boardingGroup':
      return generateBoardingGroupResponse(transaction);
    case 'bookingStatus':
      return generateBookingStatusResponse(transaction);
    
    // Contact specific intents
    case 'contactInfo':
      return generateContactInfoResponse();
    case 'generalHelp':
      return generateGeneralHelpResponse(transaction);
    case 'reportIssue':
      return generateReportIssueResponse();
    
    default:
      return "I apologize, but I can only provide information about refund status, flight details, and booking details. For other queries, please contact our support team.";
  }
};
