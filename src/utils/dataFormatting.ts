import { Transaction } from '@/types/chatbot';

// Enhanced data validation and formatting utilities

// Currency formatting
export const formatCurrency = (amount: number | string, currency: string = 'INR'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return `${currency} 0`;
  }
  
  // Format with proper comma separation for Indian currency
  if (currency === 'INR') {
    return `INR ${numAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  }
  
  return `${currency} ${numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Date and time formatting
export const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return 'Not available';
  
  try {
    const date = new Date(dateTimeString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateTimeString; // Return original if invalid
    }
    
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return dateTimeString; // Return original if parsing fails
  }
};

// Date only formatting
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Not available';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

// Time only formatting
export const formatTime = (timeString: string): string => {
  if (!timeString) return 'Not available';
  
  try {
    const date = new Date(`2000-01-01 ${timeString}`);
    
    if (isNaN(date.getTime())) {
      // Try parsing as full datetime
      const fullDate = new Date(timeString);
      if (!isNaN(fullDate.getTime())) {
        return fullDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      return timeString; // Return original if invalid
    }
    
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return timeString;
  }
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return 'Not available';
  
  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Format Indian phone numbers
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  
  // Return original if not standard format
  return phoneNumber;
};

// PNR formatting
export const formatPNR = (pnr: string): string => {
  if (!pnr) return 'Not available';
  
  // PNR should be uppercase and properly spaced if long
  const cleanPNR = pnr.toUpperCase().replace(/\s/g, '');
  
  if (cleanPNR.length === 6) {
    return `${cleanPNR.slice(0, 3)} ${cleanPNR.slice(3)}`;
  }
  
  return cleanPNR;
};

// Status formatting with emojis
export const formatStatus = (status: string): string => {
  if (!status) return 'Unknown';
  
  const statusLower = status.toLowerCase();
  
  switch (statusLower) {
    case 'confirmed':
      return '✅ Confirmed';
    case 'pending':
      return '⏳ Pending';
    case 'cancelled':
      return '❌ Cancelled';
    case 'completed':
      return '✅ Completed';
    case 'failed':
      return '❌ Failed';
    case 'processing':
      return '🔄 Processing';
    case 'refunded':
      return '💰 Refunded';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Capitalize and format names
export const formatName = (name: string): string => {
  if (!name) return 'Not available';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Validate and format email
export const formatEmail = (email: string): string => {
  if (!email) return 'Not available';
  
  return email.toLowerCase().trim();
};

// Flight number formatting
export const formatFlightNumber = (flightNumber: string): string => {
  if (!flightNumber) return 'Not available';
  
  // Ensure proper airline code and number format
  return flightNumber.toUpperCase().replace(/\s+/g, ' ').trim();
};

// Airport code formatting
export const formatAirportCode = (airportCode: string): string => {
  if (!airportCode) return 'Not available';
  
  return airportCode.toUpperCase().trim();
};

// Travel class formatting
export const formatTravelClass = (travelClass: string): string => {
  if (!travelClass) return 'Not available';
  
  const classMap: Record<string, string> = {
    'economy': 'Economy Class',
    'premium economy': 'Premium Economy',
    'business': 'Business Class',
    'first': 'First Class',
    'eco': 'Economy Class',
    'bus': 'Business Class'
  };
  
  const formatted = classMap[travelClass.toLowerCase()] || travelClass;
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

// Seat type formatting
export const formatSeatType = (seatType: string): string => {
  if (!seatType) return 'Standard';
  
  const typeMap: Record<string, string> = {
    'window': '🪟 Window',
    'aisle': '🚪 Aisle',
    'middle': '🔀 Middle',
    'exit': '🚪 Exit Row',
    'premium': '⭐ Premium',
    'standard': '📱 Standard'
  };
  
  return typeMap[seatType.toLowerCase()] || seatType;
};

// Meal formatting
export const formatMeal = (meal: string): string => {
  if (!meal || meal.toLowerCase() === 'none') return 'No special meal';
  
  const mealMap: Record<string, string> = {
    'veg': '🥗 Vegetarian',
    'non-veg': '🍖 Non-Vegetarian',
    'vegan': '🌱 Vegan',
    'jain': '🙏 Jain Meal',
    'diabetic': '🍎 Diabetic Meal',
    'kosher': '✡️ Kosher',
    'halal': '☪️ Halal',
    'hindu': '🕉️ Hindu Meal'
  };
  
  return mealMap[meal.toLowerCase()] || meal;
};

// Validation functions
export const validateTransactionData = (transaction: Transaction): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields validation
  if (!transaction.booking_id) errors.push('Booking ID is missing');
  if (!transaction.pnr) errors.push('PNR is missing');
  if (!transaction.flight_number) errors.push('Flight number is missing');
  if (!transaction.passenger_name) errors.push('Passenger name is missing');
  
  // Data format validation
  if (transaction.total_amount_paid <= 0) errors.push('Invalid payment amount');
  if (transaction.user_email && !isValidEmail(transaction.user_email)) {
    errors.push('Invalid email format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get contextual urgency level
export const getUrgencyLevel = (transaction: Transaction): 'low' | 'medium' | 'high' | 'critical' => {
  const now = new Date();
  const flightDate = new Date(transaction.departure_time);
  const hoursUntilFlight = Math.ceil((flightDate.getTime() - now.getTime()) / (1000 * 3600));
  
  if (hoursUntilFlight < 0) return 'low'; // Flight has passed
  if (hoursUntilFlight <= 2) return 'critical'; // Less than 2 hours
  if (hoursUntilFlight <= 24) return 'high'; // Less than 24 hours
  if (hoursUntilFlight <= 72) return 'medium'; // Less than 3 days
  return 'low'; // More than 3 days
};

// Get contextual messaging
export const getContextualMessage = (transaction: Transaction): string => {
  const urgency = getUrgencyLevel(transaction);
  const now = new Date();
  const flightDate = new Date(transaction.departure_time);
  const hoursUntilFlight = Math.ceil((flightDate.getTime() - now.getTime()) / (1000 * 3600));
  
  switch (urgency) {
    case 'critical':
      return '🚨 Your flight is departing very soon! For urgent assistance, please call customer support immediately.';
    case 'high':
      return '⏰ Your flight is within 24 hours. Make sure you\'re checked in and ready to go!';
    case 'medium':
      return 'ℹ️ Your flight is coming up soon. Don\'t forget to check in 24 hours before departure.';
    default:
      return '';
  }
};
