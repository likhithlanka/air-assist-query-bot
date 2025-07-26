
export interface Transaction {
  id: string;
  booking_id: string;
  email: string;
  passenger_name: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  travel_date: string;
  travel_class: string;
  seat_number: string;
  seat_type: string;
  total_amount_paid: number;
  refund_status: string;
  refund_amount: number;
  refund_date: string;
  refund_mode: string;
  baggage_addon: string;
  wifi_addon: string;
  meal_selected: string;
  status: string;
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
