
export interface Transaction {
  transaction_id: string;
  user_email: string;
  date: string;
  payment_instrument: string;
  payment_gateway: string;
  platform: string;
  amount: number;
  status: string;
  refund_id: string;
  refund_status: string;
  refund_amount: number;
  refund_date: string;
  booking_id: string;
  pnr: string;
  passenger_name: string;
  contact_number: string;
  frequent_flyer_id: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  travel_class: string;
  seat_number: string;
  seat_type: string;
  meal_selected: string;
  baggage_addon: string;
  wifi_addon: string;
  checkin_status: string;
  boarding_group: string;
  coupon_used: string;
  ticket_price: number;
  taxes: number;
  total_amount_paid: number;
  refund_mode: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

export enum ChatState {
  WELCOME = 'welcome',
  EMAIL_COLLECTION = 'email_collection',
  TRANSACTION_SELECTION = 'transaction_selection',
  QUERY_HANDLING = 'query_handling'
}

export interface QuerySuggestion {
  display: string;
  intent: string;
}

export interface IntentCategory {
  category: string;
  keywords: string[];
  questions: QuerySuggestion[];
}
