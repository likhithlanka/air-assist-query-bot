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
import { openAIService } from '@/services/openaiService';

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
    return `I don't see any active refund requests for booking ${transaction.booking_id}. If you need to cancel and get your money back, I can connect you with our support team who can review your options based on your ticket type and timing.`;
  }
  
  return `Your refund for booking ${transaction.booking_id} is actively being processed! Status: "${formatStatus(transaction.refund_status)}", Reference: ${transaction.refund_id}, Amount: ${formatCurrency(transaction.refund_amount)}. Everything is moving along smoothly.`;
};

const generateRefundTimingResponse = (transaction: Transaction): string => {
  // Check if refund is initiated
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    return `No active refund for booking ${transaction.booking_id} right now. Timing for new refunds depends on your ticket type and how close to departure you are. Want me to connect you with support for specific timing?`;
  }
  
  const expectedDate = calculateExpectedRefundDate(transaction.refund_date, transaction.refund_mode);
  return `Based on your ${transaction.refund_mode} refund started on ${formatDate(transaction.refund_date)}, expect to see the money by ${expectedDate}. Banks sometimes take an extra day or two, but most arrive right on schedule.`;
};

const generateRefundAmountResponse = (transaction: Transaction): string => {
  // Check if refund is initiated
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    return `No refund calculated for booking ${transaction.booking_id} yet. The amount depends on your ticket type and timing. Some get full refunds, others might have fees or qualify for travel credits. Want me to connect you with support for details?`;
  }
  
  return `Great news! You're getting a full refund of ${formatCurrency(transaction.refund_amount)} for booking ${transaction.booking_id} - no cancellation fees! The money goes back through ${transaction.refund_mode}, same method you used originally.`;
};

const generateFlightDetailsResponse = (transaction: Transaction): string => {
  const contextualMsg = getContextualMessage(transaction);
  
  const response = `Here are your flight details! Flight ${formatFlightNumber(transaction.flight_number)} departs ${formatAirportCode(transaction.departure_airport)} at ${formatTime(transaction.departure_time)} and arrives ${formatAirportCode(transaction.arrival_airport)} at ${formatTime(transaction.arrival_time)} on ${formatDate(transaction.date)}. You're in ${formatTravelClass(transaction.travel_class)} class, seat ${transaction.seat_number} (${formatSeatType(transaction.seat_type)}).`;

  return contextualMsg ? `${response}\n\n${contextualMsg}` : response;
};

const generateDepartureTimeResponse = (transaction: Transaction): string => {
  const contextualMsg = getContextualMessage(transaction);
  const response = `Flight ${formatFlightNumber(transaction.flight_number)} departs ${formatAirportCode(transaction.departure_airport)} at ${formatTime(transaction.departure_time)} on ${formatDate(transaction.date)}. Remember to arrive early for check-in and security!`;
  
  return contextualMsg ? `${response}\n\n${contextualMsg}` : response;
};

const generateArrivalTimeResponse = (transaction: Transaction): string => {
  return `Flight ${formatFlightNumber(transaction.flight_number)} arrives at ${formatAirportCode(transaction.arrival_airport)} at ${formatTime(transaction.arrival_time)} on ${formatDate(transaction.date)}. Actual times may vary slightly due to air traffic and weather.`;
};

const generateBookingDetailsResponse = (transaction: Transaction): string => {
  return `Booking ${transaction.booking_id} for ${formatName(transaction.passenger_name)}, contact: ${formatPhoneNumber(transaction.contact_number)}, PNR: ${formatPNR(transaction.pnr)}. Total paid: ${formatCurrency(transaction.total_amount_paid)}. Add-ons: ${transaction.baggage_addon ? 'Baggage ✓' : 'Standard baggage'}, ${transaction.wifi_addon ? 'WiFi ✓' : 'No WiFi'}, Meal: ${formatMeal(transaction.meal_selected)}. Check-in: ${formatStatus(transaction.checkin_status)}.`;
};

const generateSeatNumberResponse = (transaction: Transaction): string => {
  return `You're in seat ${transaction.seat_number} (${formatSeatType(transaction.seat_type)}) in ${formatTravelClass(transaction.travel_class)} class for flight ${formatFlightNumber(transaction.flight_number)}. If you want to change seats, check the airline's website for available options.`;
};

const generateMealSelectionResponse = (transaction: Transaction): string => {
  return `You've selected ${formatMeal(transaction.meal_selected)} for flight ${formatFlightNumber(transaction.flight_number)}. This choice is locked in with the airline. If you want to change it, contact them before 24 hours prior to departure.`;
};

// Payment response functions
const generatePaymentAmountResponse = (transaction: Transaction): string => {
  return `For booking ${transaction.booking_id}, you paid ${formatCurrency(transaction.total_amount_paid)} total: ${formatCurrency(transaction.ticket_price)} ticket price plus ${formatCurrency(transaction.taxes)} in taxes and fees. Everything processed successfully!`;
};

const generatePaymentMethodResponse = (transaction: Transaction): string => {
  return `You paid with your ${transaction.payment_instrument} through ${transaction.payment_gateway} on ${transaction.platform}. The charge should appear on your statement with booking reference ${transaction.booking_id}.`;
};

const generatePaymentBreakdownResponse = (transaction: Transaction): string => {
  return `Payment summary for booking ${transaction.booking_id}: Ticket ${formatCurrency(transaction.ticket_price)} + Taxes ${formatCurrency(transaction.taxes)} = Total ${formatCurrency(transaction.total_amount_paid)}. Paid via ${transaction.payment_instrument} through ${transaction.payment_gateway}. Status: ${formatStatus(transaction.status)}. ${transaction.coupon_used ? `Coupon "${transaction.coupon_used}" applied.` : 'No discounts used.'}`;
};

// New response functions for enhanced categories
const generateRefundEligibilityResponse = (transaction: Transaction): string => {
  const now = new Date();
  const flightDate = new Date(transaction.departure_time);
  const daysDiff = Math.ceil((flightDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    if (daysDiff > 1) {
      return `I've looked at your booking ${transaction.booking_id}, and the good news is that you still have some time before your departure date, which typically means you have more options available.

Refund eligibility really depends on the type of ticket you purchased when you made your booking. Some tickets are fully refundable, others allow refunds with a fee, and some are non-refundable but might still qualify for travel credits or refunds in special circumstances.

Since your flight isn't imminent, you're in a better position than travelers who are trying to cancel at the last minute. I'd recommend reaching out to our customer support team who can review the specific terms of your ticket and walk you through exactly what options are available to you and what the process would look like.`;
    } else {
      return `I can see that your flight is coming up very soon - within the next 24 hours. This does make the refund situation more challenging, as most airline policies become much more restrictive when you're this close to departure.

That said, there are sometimes exceptions for medical emergencies, severe weather, or other extenuating circumstances. Even if a standard refund isn't available, you might be eligible for a travel credit that you could use for future bookings.

Given the time-sensitive nature of your situation, I'd strongly recommend calling our customer support line immediately. They can review your specific circumstances and let you know if there are any options available, even at this late stage.`;
    }
  }
  
  return `Actually, I can see that you already have an active refund in progress! Your refund reference number is ${transaction.refund_id} and it's for ${formatCurrency(transaction.refund_amount)}. The current status shows as "${transaction.refund_status}".

It looks like the refund eligibility question has already been answered in your favor, and the process is underway. You don't need to worry about whether you qualify - you've already been approved and the refund is being processed.`;
};

const generateFlightStatusResponse = (transaction: Transaction): string => {
  const now = new Date();
  const flightDate = new Date(transaction.departure_time);
  const daysDiff = Math.ceil((flightDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  if (daysDiff < 0) {
    return `Looking at your booking, flight ${transaction.flight_number} was scheduled to depart on ${transaction.date}, which has already passed. If you missed this flight or there were any issues with your travel, our customer support team can help you understand what options might be available.

Sometimes passengers are able to rebook on later flights or request refunds depending on the circumstances of why they didn't travel. If this was due to an airline delay or cancellation, you might have additional protections and compensation available.`;
  } else if (daysDiff === 0) {
    return `Your flight ${transaction.flight_number} is scheduled to depart today at ${transaction.departure_time}! This is an exciting day, but also important to stay on top of any last-minute changes.

I always recommend checking directly with the airline for the most up-to-date information about gate assignments, any potential delays, or boarding time changes. Airlines can sometimes update these details even a few hours before departure.

Make sure you've completed your check-in if you haven't already, and give yourself plenty of time to get to the airport and through security. Have a wonderful trip!`;
  } else if (daysDiff === 1) {
    return `Tomorrow's the big day! Your flight ${transaction.flight_number} is scheduled to depart at ${transaction.departure_time}. Since you're within the 24-hour window now, online check-in should be available if you haven't taken care of that yet.

It's always a good idea to check in as early as possible to secure your preferred seat and get your boarding pass ready. You might also want to verify your flight status tomorrow morning before heading to the airport, just in case there are any schedule adjustments.

Don't forget to check the weather at both your departure and arrival cities - it can sometimes affect flight schedules even when everything else looks good.`;
  } else {
    return `Your flight ${transaction.flight_number} is coming up on ${transaction.date} at ${transaction.departure_time}. You've got ${daysDiff} days to prepare, which gives you a nice window to get everything organized.

Online check-in will open exactly 24 hours before your departure time, so mark that on your calendar if you like to check in right when it becomes available. In the meantime, you can keep an eye on any potential schedule changes by checking the airline's website or app.

This is also a good time to review your travel documents, confirm your transportation to the airport, and make sure you understand the baggage policies for your specific flight.`;
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
  
  if (transaction.checkin_status === 'completed') {
    return `You're all checked in! Boarding group: ${transaction.boarding_group}, Seat: ${transaction.seat_number}. You should have your boarding pass ready. Arrive early for security and watch for gate assignments.`;
  } else if (hoursDiff <= 24 && hoursDiff > 0) {
    return `Online check-in is now available! You can check in anytime until 1 hour before departure. Do it soon to get the best seat selection and have one less thing to worry about at the airport.`;
  } else if (hoursDiff > 24) {
    return `Check-in opens in ${Math.ceil(hoursDiff - 24)} hours (24 hours before departure). Perfect time to prepare your documents and confirm travel plans!`;
  } else {
    return `Online check-in has closed. No worries - head to the airline counter or self-service kiosks at the airport. Just arrive extra early to complete check-in there.`;
  }
};

const generateBoardingGroupResponse = (transaction: Transaction): string => {
  if (transaction.boarding_group) {
    return `You're in boarding group ${transaction.boarding_group} for flight ${formatFlightNumber(transaction.flight_number)}, seat ${transaction.seat_number}. Lower numbers/letters typically board first. Be near the gate when boarding starts!`;
  }
  
  if (transaction.checkin_status !== 'completed') {
    return `Boarding group will be assigned when you check in. Current status: "${formatStatus(transaction.checkin_status)}". Complete check-in to get your boarding group assignment.`;
  }
  
  return `No boarding group info available right now. Check your boarding pass for the group assignment, or contact support if you need help finding it.`;
};

const generateBookingStatusResponse = (transaction: Transaction): string => {
  if (transaction.status === 'confirmed') {
    return `Perfect! Your booking ${transaction.booking_id} is fully confirmed. PNR: ${formatPNR(transaction.pnr)}. Your seats are reserved, payment processed, and you're guaranteed a spot on the flight. All set for travel!`;
  } else if (transaction.status === 'pending') {
    return `Your booking ${transaction.booking_id} is currently pending (PNR: ${formatPNR(transaction.pnr)}). This usually resolves to "confirmed" within minutes as systems process your reservation. If it's been over 20 minutes, worth calling support.`;
  } else {
    return `Your booking ${transaction.booking_id} shows an unusual status: ${formatStatus(transaction.status)} (PNR: ${formatPNR(transaction.pnr)}). This needs attention from our support team who can check for payment issues or system glitches and fix it quickly.`;
  }
};

const generateContactInfoResponse = (): string => {
  return `I want to make sure you can reach our customer support team whenever you need them! Here are all the ways you can get in touch:

For immediate assistance, our phone support is available 24/7 at 1800-XXX-XXXX. This is your best bet for urgent issues or when you need to speak with someone right away about flight changes or cancellations.

If you prefer digital communication, you can email us at support@airline.com, or use the live chat feature on our website at www.airline.com/support. The live chat is particularly convenient because you can get real-time help without waiting on hold.

For travel days, don't forget about our mobile app - it's got instant support features and can handle many common requests right from your phone. Plus, if you're already at the airport, there are helpdesks available at all major airports where our staff can assist you in person.

Pro tip: if you're calling during busy travel periods, try reaching out between 6 AM and 10 PM for the fastest response times. That's when we're typically less swamped with calls!`;
};

const generateGeneralHelpResponse = (transaction: Transaction): string => {
  return `I'm so glad you reached out! I'm here to help you with everything related to your booking ${transaction.booking_id}, and I've got access to all the details of your trip.

Here's what I can help you with right away: I can pull up your complete flight details and status, show you all your booking information including seat assignments and meal preferences, give you updates on any payment or refund situations, and walk you through check-in and boarding details.

I'm like your personal travel assistant for this booking - I can answer questions, explain policies, and help you understand exactly what's happening with your trip. For more complex requests like actually changing your booking or handling special circumstances, I'll connect you with our customer support team who have the tools to make those kinds of updates.

What would you like to know about your trip? I'm here to make your travel experience as smooth as possible!`;
};

const generateReportIssueResponse = (): string => {
  return `I understand you're dealing with an issue, and I want to make sure you get the right help as quickly as possible.

For urgent situations - like if your flight has been delayed, cancelled, or you're dealing with a time-sensitive problem at the airport - please call our 24/7 emergency line at 1800-XXX-XXXX immediately. They have the tools and authority to handle crisis situations and can often resolve urgent issues on the spot.

For less urgent concerns, you have a few good options: you can email us at support@airline.com with a detailed description of what's happening, or use the live chat feature on our website for real-time assistance.

When you contact support, having your booking ID and PNR ready will help them pull up your information quickly and get straight to solving your problem.

Before you reach out though, let me see if I can help with your issue right now! I can handle inquiries about refund status, provide flight information, verify booking details, and explain policies. Sometimes I can resolve things immediately without you needing to wait for additional support.`;
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

// Enhanced response generation with conversation memory, sentiment analysis, and AI intent matching
export const generateResponse = async (
  query: string, 
  transaction: Transaction, 
  memory?: ConversationMemory
): Promise<string> => {
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

  // If no clear intent detected, try AI-powered intent matching
  if (maxMatches === 0 || detectedCategory === '') {
    return await handleUnknownIntentWithAI(query, transaction, sentimentAnalysis, memory);
  }

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
      response = generateContextualRefundResponse(transaction, contextualFactors);
      break;
    case 'flightDetails':
      response = generateContextualFlightResponse(transaction, contextualFactors);
      break;
    case 'bookingDetails':
      response = generateGenericBookingResponse(transaction);
      break;
    case 'paymentDetails':
      response = generateGenericPaymentResponse(transaction);
      break;
    case 'statusInquiry':
      response = generateContextualStatusResponse(transaction, contextualFactors);
      break;
    case 'contactSupport':
      response = generateContextualSupportResponse(transaction, queryLower);
      break;
    default:
      return await handleUnknownIntentWithAI(query, transaction, sentimentAnalysis, memory);
  }
  
  // Update conversation memory
  if (memory) {
    updateConversationMemory(memory, detectedCategory, query);
  }
  
  return createEmpatheticResponse(response, sentimentAnalysis);
};

// Contextual response generators
const generateContextualRefundResponse = (transaction: Transaction, factors: string[]): string => {
  if (!transaction.refund_id || transaction.refund_amount === 0) {
    if (factors.includes('flight_soon')) {
      return `There is no refund initiated for your booking ${transaction.booking_id}. Since your flight is soon, cancellation options may be limited. Please contact customer support immediately if you need to cancel.`;
    }
    return generateGenericRefundResponse(transaction);
  }
  return generateGenericRefundResponse(transaction);
};

const generateContextualFlightResponse = (transaction: Transaction, factors: string[]): string => {
  let response = generateGenericFlightResponse(transaction);
  
  if (factors.includes('flight_soon') && factors.includes('not_checked_in')) {
    response += `\n\n⚠️ Reminder: Your flight is soon and you haven't checked in yet. Online check-in is available now!`;
  } else if (factors.includes('flight_soon')) {
    response += `\n\n✈️ Your flight is coming up soon. Have a great trip!`;
  }
  
  return response;
};

const generateContextualStatusResponse = (transaction: Transaction, factors: string[]): string => {
  if (factors.includes('booking_not_confirmed')) {
    return `Your booking status is: ${transaction.status} (not confirmed yet). This usually resolves within a few minutes. If it persists, please contact customer support.`;
  }
  
  if (factors.includes('not_checked_in') && factors.includes('flight_soon')) {
    return `Check-in Status: ${transaction.checkin_status}. Your flight is soon - you can check in now! Online check-in is available up to 1 hour before departure.`;
  }
  
  return `Booking Status: ${transaction.status}\nCheck-in Status: ${transaction.checkin_status}\nBoarding Group: ${transaction.boarding_group || 'Will be assigned after check-in'}`;
};

const generateContextualSupportResponse = (transaction: Transaction, query: string): string => {
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
  
  return `I'm not sure what you're asking about regarding booking ${transaction.booking_id}. I can help with flight details, refund status, booking info, payment details, and check-in status. Could you try rephrasing your question? I'm here to help make your travel smoother!`;
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

/**
 * Handles unknown intents using OpenAI to match with available intents
 */
const handleUnknownIntentWithAI = async (
  query: string, 
  transaction: Transaction, 
  sentimentAnalysis: SentimentAnalysis, 
  memory?: ConversationMemory
): Promise<string> => {
  try {
    // Create a context about available intents for AI
    const availableIntents = [
      "refund status and timing",
      "flight details and schedules", 
      "booking information and PNR",
      "payment details and breakdown",
      "check-in status and boarding",
      "meal selections and preferences",
      "seat assignments and changes",
      "general help and support contact"
    ];

    const intentMatchingPrompt = `User query: "${query}"

Available intents I can help with:
${availableIntents.map((intent, i) => `${i + 1}. ${intent}`).join('\n')}

Based on the user's query, which intent (1-${availableIntents.length}) seems most likely? 
If unclear, pick the most probable one and explain your assumption.
Respond in format: "INTENT: [number] - ASSUMPTION: [brief explanation]"`;

    const aiResult = await openAIService.generateAIResponse(
      intentMatchingPrompt,
      transaction,
      sentimentAnalysis,
      'Intent matching for unclear query'
    );

    if ('response' in aiResult) {
      // Parse AI response to extract intent and assumption
      const response = aiResult.response;
      const intentMatch = response.match(/INTENT:\s*(\d+)/);
      const assumptionMatch = response.match(/ASSUMPTION:\s*(.+)/);
      
      if (intentMatch && assumptionMatch) {
        const intentNumber = parseInt(intentMatch[1], 10);
        const assumption = assumptionMatch[1].trim();
        
        // Map intent number to category and generate response
        const intentMapping: Record<number, string> = {
          1: 'refundStatus',
          2: 'flightDetails', 
          3: 'bookingDetails',
          4: 'paymentDetails',
          5: 'statusInquiry',
          6: 'mealSelection',
          7: 'seatNumber',
          8: 'contactSupport'
        };
        
        const detectedCategory = intentMapping[intentNumber];
        if (detectedCategory) {
          let baseResponse = '';
          
          // Generate appropriate response based on detected intent
          switch (detectedCategory) {
            case 'refundStatus':
              baseResponse = generateRefundStatusResponse(transaction);
              break;
            case 'flightDetails':
              baseResponse = generateFlightDetailsResponse(transaction);
              break;
            case 'bookingDetails':
              baseResponse = generateBookingDetailsResponse(transaction);
              break;
            case 'paymentDetails':
              baseResponse = generatePaymentBreakdownResponse(transaction);
              break;
            case 'statusInquiry':
              baseResponse = generateCheckinStatusResponse(transaction);
              break;
            case 'mealSelection':
              baseResponse = generateMealSelectionResponse(transaction);
              break;
            case 'seatNumber':
              baseResponse = generateSeatNumberResponse(transaction);
              break;
            case 'contactSupport':
              baseResponse = generateContactInfoResponse();
              break;
            default:
              baseResponse = generateFallbackResponse(transaction, query, sentimentAnalysis);
          }
          
          // Add assumption explanation and provide the response
          const assumptionResponse = `I think you're asking about ${availableIntents[intentNumber - 1]}. ${assumption}\n\n${baseResponse}`;
          
          // Update conversation memory
          if (memory) {
            updateConversationMemory(memory, detectedCategory, query);
          }
          
          return createEmpatheticResponse(assumptionResponse, sentimentAnalysis);
        }
      }
    }
  } catch (error) {
    console.error('Error with AI intent matching:', error);
  }
  
  // Fallback to traditional response if AI fails
  return createEmpatheticResponse(generateFallbackResponse(transaction, query, sentimentAnalysis), sentimentAnalysis);
};
